// BookList Screen - Shows books by category or all books
import React, { useState, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import { booksAPI } from '../../api/books';

const BookListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addToCart } = useCart();
  
  const { categoryId, categoryName } = route.params || {};
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadBooks(true);
  }, [categoryId]);

  const loadBooks = async (refresh = false) => {
    const currentPage = refresh ? 1 : page;
    const shouldShowLoader = refresh || !loadingMore;
    
    if (shouldShowLoader) {
      setLoading(refresh);
    } else {
      setLoadingMore(true);
    }

    try {
      let result;
      if (categoryId) {
        result = await booksAPI.getBooksByCategory(categoryId);
      } else {
        result = await booksAPI.getAllBooks({ page: currentPage });
      }

      if (result.success) {
        const newBooks = result.data;
        
        if (refresh) {
          setBooks(newBooks);
          setPage(2);
        } else {
          setBooks(prev => [...prev, ...newBooks]);
          setPage(prev => prev + 1);
        }
        
        // Check if there are more books to load
        setHasMore(newBooks.length === 20); // Assuming 20 is the page size
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load books');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBooks(true);
    setRefreshing(false);
  }, [categoryId]);

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      loadBooks(false);
    }
  };

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { bookId: book.id });
  };

  const handleAddToCart = (book, bookType = 'soft') => {
    addToCart(book, bookType);
    Alert.alert('Success', 'Book added to cart!');
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookCard}
      onPress={() => handleBookPress(item)}
    >
      <View style={styles.bookImageContainer}>
        {item.cover_image_url || item.cover_url ? (
          <Image 
            source={{ uri: item.cover_image_url || item.cover_url }} 
            style={styles.bookImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.bookPlaceholder}>
            <Text style={styles.bookIcon}>📖</Text>
          </View>
        )}
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        
        {item.is_free ? (
          <View style={styles.freeBadge}>
            <Text style={styles.freeText}>FREE</Text>
          </View>
        ) : (
          <View style={styles.priceContainer}>
            {item.available_for_hard && (
              <Text style={styles.priceText}>
                Hard: ${item.hard_price}
              </Text>
            )}
            {item.available_for_soft && (
              <Text style={styles.priceText}>
                {item.available_for_hard ? ' | ' : ''}Digital: ${item.soft_price}
              </Text>
            )}
            {item.available_for_rent && (
              <Text style={styles.priceText}>
                {item.available_for_soft || item.available_for_hard ? ' | ' : ''}
                Rent: ${item.rental_price_per_week}/week
              </Text>
            )}
          </View>
        )}
        
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#6200EE" />
        <Text style={styles.footerText}>Loading more books...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {categoryName || 'All Books'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {categoryId ? `Books in ${categoryName}` : 'Browse our collection'}
        </Text>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBook}
        numColumns={2}
        columnWrapperStyle={styles.bookRow}
        contentContainerStyle={styles.booksContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No books found</Text>
              <Text style={styles.emptySubtext}>
                {categoryId 
                  ? `No books in the ${categoryName} category`
                  : 'Check back later for new books'
                }
              </Text>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading books...</Text>
        </View>
      )}
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
  booksContainer: {
    padding: 20,
  },
  bookRow: {
    justifyContent: 'space-between',
  },
  bookCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookImageContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  bookImage: {
    width: '100%',
    height: 140,
  },
  bookPlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookIcon: {
    fontSize: 32,
    color: '#999',
  },
  bookInfo: {
    padding: 12,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  freeBadge: {
    backgroundColor: '#28a745',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  freeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  priceContainer: {
    marginBottom: 8,
  },
  priceText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  actionContainer: {
    marginTop: 4,
  },
  addToCartButton: {
    backgroundColor: '#6200EE',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
});

export default BookListScreen;