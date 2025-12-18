// MyPurchases Screen - Shows user's purchased and rented books
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { paymentsAPI } from '../../api/payments';

const MyPurchasesScreen = () => {
  const navigation = useNavigation();
  
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, purchased, rented

  useEffect(() => {
    loadPurchases();
  }, [filter]);

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const result = await paymentsAPI.getUserPurchases();
      if (result.success) {
        let filteredData = result.data;
        
        if (filter === 'purchased') {
          filteredData = result.data.filter(item => item.payment_details?.payment_type === 'purchase_hard' || item.payment_details?.payment_type === 'purchase_soft');
        } else if (filter === 'rented') {
          filteredData = result.data.filter(item => item.payment_details?.payment_type === 'rental');
        }
        
        setPurchases(filteredData);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load purchases');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPurchases();
    setRefreshing(false);
  };

  const handleBookPress = (purchase) => {
    // Navigate to book detail or reading screen
    if (purchase.book_pdf) {
      // For digital books, you might want to open a PDF viewer
      Alert.alert('Digital Book', 'This would open the PDF reader in a full app');
    } else {
      navigation.navigate('BookDetail', { bookId: purchase.book.id });
    }
  };

  const handleDownload = (purchase) => {
    if (purchase.book_pdf) {
      Alert.alert('Download', 'This would download the PDF file to your device');
    } else {
      Alert.alert('No Digital Version', 'This book is only available in physical format');
    }
  };

  const renderFilterButton = (filterType, label) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterType && styles.filterButtonActive
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text style={[
        styles.filterButtonText,
        filter === filterType && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderPurchase = ({ item }) => (
    <View style={styles.purchaseCard}>
      <View style={styles.bookInfo}>
        <View style={styles.bookImageContainer}>
          {item.book_cover ? (
            <Image 
              source={{ uri: item.book_cover }} 
              style={styles.bookImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.bookPlaceholder}>
              <Text style={styles.bookIcon}>📖</Text>
            </View>
          )}
        </View>
        
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.book_title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {item.book_author}
          </Text>
          
          <View style={styles.purchaseMeta}>
            <Text style={styles.purchaseType}>
              {item.purchase_type === 'soft' ? 'Digital' : 'Physical'} Copy
            </Text>
            <Text style={styles.purchaseDate}>
              {new Date(item.purchased_at).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.purchasePrice}>
              ${item.payment_details?.amount}
            </Text>
            <Text style={styles.paymentMethod}>
              via {item.payment_details?.payment_method}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleBookPress(item)}
        >
          <Text style={styles.actionButtonText}>
            {item.purchase_type === 'soft' ? 'Read' : 'View'}
          </Text>
        </TouchableOpacity>
        
        {item.purchase_type === 'soft' && item.book_pdf && (
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => handleDownload(item)}
          >
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item) }
        ]}>
          <Text style={styles.statusText}>
            {getStatusText(item)}
          </Text>
        </View>
      </View>
    </View>
  );

  const getStatusColor = (purchase) => {
    const isRental = purchase.payment_details?.payment_type === 'rental';
    if (isRental) {
      // Check if rental is still valid
      const expiresAt = new Date(purchase.expires_at);
      const now = new Date();
      if (expiresAt > now) {
        return '#28a745'; // Green for active rental
      } else {
        return '#dc3545'; // Red for expired rental
      }
    }
    return '#6200EE'; // Purple for purchase
  };

  const getStatusText = (purchase) => {
    const isRental = purchase.payment_details?.payment_type === 'rental';
    if (isRental) {
      const expiresAt = new Date(purchase.expires_at);
      const now = new Date();
      if (expiresAt > now) {
        return 'Active Rental';
      } else {
        return 'Rental Expired';
      }
    }
    return 'Purchased';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Library</Text>
        <Text style={styles.headerSubtitle}>
          Your purchased and rented books
        </Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderFilterButton('all', 'All Books')}
          {renderFilterButton('purchased', 'Purchased')}
          {renderFilterButton('rented', 'Rented')}
        </ScrollView>
      </View>

      <FlatList
        data={purchases}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPurchase}
        contentContainerStyle={styles.purchasesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📚</Text>
              <Text style={styles.emptyText}>
                {filter === 'all' ? 'No books in your library yet' :
                 filter === 'purchased' ? 'No purchased books yet' :
                 'No rented books yet'}
              </Text>
              <Text style={styles.emptySubtext}>
                Start browsing and purchase some books
              </Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.browseButtonText}>Browse Books</Text>
              </TouchableOpacity>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#6200EE',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  purchasesList: {
    padding: 20,
    paddingBottom: 40,
  },
  purchaseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bookImageContainer: {
    marginRight: 16,
  },
  bookImage: {
    width: 60,
    height: 80,
    borderRadius: 6,
  },
  bookPlaceholder: {
    width: 60,
    height: 80,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  bookIcon: {
    fontSize: 24,
    color: '#999',
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  purchaseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  purchaseType: {
    fontSize: 12,
    color: '#6200EE',
    fontWeight: '600',
  },
  purchaseDate: {
    fontSize: 12,
    color: '#999',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  purchasePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#6200EE',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#28a745',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  browseButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyPurchasesScreen;