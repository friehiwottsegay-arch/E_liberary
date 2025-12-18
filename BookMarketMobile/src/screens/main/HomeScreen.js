// Home Screen - Main screen showing categories and featured books
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { booksAPI } from '../../api/books';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [categories, setCategories] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load categories
      const categoriesResult = await booksAPI.getCategories();
      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
      }

      // Load featured books
      const booksResult = await booksAPI.getAllBooks({ is_featured: true });
      if (booksResult.success) {
        setFeaturedBooks(booksResult.data.slice(0, 10)); // Show first 10
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('BookList', { 
      categoryId: category.id, 
      categoryName: category.name 
    });
  };

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { bookId: book.id });
  };

  const handleAddToCart = (book, bookType = 'soft') => {
    addToCart(book, bookType);
    Alert.alert('Success', 'Book added to cart!');
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
    >
      {item.image_path ? (
        <Image 
          source={{ uri: item.image_path }} 
          style={styles.categoryImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.categoryPlaceholder}>
          <Text style={styles.categoryIcon}>📚</Text>
        </View>
      )}
      <Text style={styles.categoryName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

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
        <View style={styles.priceContainer}>
          {item.available_for_hard && (
            <Text style={styles.priceText}>${item.hard_price}</Text>
          )}
          {item.available_for_soft && (
            <Text style={styles.priceText}>
              {item.available_for_hard ? ' / ' : ''}${item.soft_price}
            </Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.first_name || 'User'}!</Text>
        <Text style={styles.subtitle}>What book are you looking for?</Text>
      </View>

      {categories.length > 0 ? (
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCategory}
            numColumns={2}
            columnWrapperStyle={styles.categoryRow}
          />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No categories available</Text>
        </View>
      )}

      {featuredBooks.length > 0 && (
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Books</Text>
            <TouchableOpacity onPress={() => navigation.navigate('BookList')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredBooks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderBook}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContainer}
          />
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />
      
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={renderContent()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  categoriesContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
  },
  categoryPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  featuredSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  seeAllText: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '700',
  },
  featuredContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  bookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: 160,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bookImageContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  bookImage: {
    width: '100%',
    height: 180,
  },
  bookPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookIcon: {
    fontSize: 40,
    color: '#CBD5E1',
  },
  bookInfo: {
    padding: 14,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B82F6',
  },
  addToCartButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
});

export default HomeScreen;