// Profile Screen - User dashboard and settings
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { paymentsAPI } from '../../api/payments';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { clearCart, getCartItemCount } = useCart();
  
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserPurchases();
    }
  }, [user]);

  const loadUserPurchases = async () => {
    setLoading(true);
    try {
      const result = await paymentsAPI.getUserPurchases();
      if (result.success) {
        setPurchases(result.data);
      }
    } catch (error) {
      console.error('Failed to load purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            clearCart();
            navigation.replace('Welcome');
          },
        },
      ]
    );
  };

  const handleMyPurchases = () => {
    navigation.navigate('MyPurchases');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings functionality coming soon!');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'For support, please contact: support@bookmarket.com');
  };

  const handlePurchaseHistory = () => {
    navigation.navigate('MyPurchases');
  };

  const quickActions = [
    { 
      icon: '📚', 
      label: 'My Library', 
      onPress: handleMyPurchases 
    },
    { 
      icon: '🛒', 
      label: `Cart (${getCartItemCount()})`, 
      onPress: () => navigation.navigate('Cart') 
    },
    { 
      icon: '📖', 
      label: 'Purchase History', 
      onPress: handlePurchaseHistory 
    },
    { 
      icon: '⚙️', 
      label: 'Settings', 
      onPress: handleSettings 
    },
    { 
      icon: '❓', 
      label: 'Support', 
      onPress: handleSupport 
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.profile_image ? (
              <Image 
                source={{ uri: user.profile_image }} 
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.first_name?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.first_name} {user?.last_name}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userRole}>Buyer Account</Text>
          </View>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleSettings}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.onPress}
              >
                <Text style={styles.actionCardIcon}>{action.icon}</Text>
                <Text style={styles.actionCardLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Purchases */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Purchases</Text>
            <TouchableOpacity onPress={handlePurchaseHistory}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {purchases.length > 0 ? (
            <View style={styles.purchasesList}>
              {purchases.slice(0, 3).map((purchase, index) => (
                <View key={index} style={styles.purchaseItem}>
                  <View style={styles.purchaseImageContainer}>
                    {purchase.book_cover ? (
                      <Image 
                        source={{ uri: purchase.book_cover }} 
                        style={styles.purchaseImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.purchasePlaceholder}>
                        <Text style={styles.purchaseIcon}>📖</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.purchaseInfo}>
                    <Text style={styles.purchaseTitle} numberOfLines={2}>
                      {purchase.book_title}
                    </Text>
                    <Text style={styles.purchaseType}>
                      {purchase.purchase_type === 'soft' ? 'Digital' : 'Physical'}
                    </Text>
                    <Text style={styles.purchaseDate}>
                      {new Date(purchase.purchased_at).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View style={styles.purchaseStatus}>
                    <Text style={styles.purchasePrice}>
                      ${purchase.payment_details?.amount}
                    </Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>Active</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📚</Text>
              <Text style={styles.emptyText}>No purchases yet</Text>
              <Text style={styles.emptySubtext}>
                Start browsing books to make your first purchase
              </Text>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#6200EE',
    fontWeight: '600',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#6200EE',
    borderRadius: 6,
  },
  editButtonText: {
    color: '#6200EE',
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 16,
    color: '#6200EE',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '31%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionCardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  purchasesList: {
    gap: 12,
  },
  purchaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  purchaseImageContainer: {
    marginRight: 12,
  },
  purchaseImage: {
    width: 40,
    height: 50,
    borderRadius: 4,
  },
  purchasePlaceholder: {
    width: 40,
    height: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  purchaseIcon: {
    fontSize: 16,
    color: '#999',
  },
  purchaseInfo: {
    flex: 1,
  },
  purchaseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  purchaseAuthor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  purchaseType: {
    fontSize: 12,
    color: '#6200EE',
    marginBottom: 2,
  },
  purchaseDate: {
    fontSize: 10,
    color: '#999',
  },
  purchaseStatus: {
    alignItems: 'flex-end',
  },
  purchasePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: '#28a745',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  logoutSection: {
    padding: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;