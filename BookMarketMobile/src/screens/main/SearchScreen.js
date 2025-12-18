// Search Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import { booksAPI } from '../../api/books';
import { colors } from '../../config/colors';

const SearchScreen = () => {
  const navigation = useNavigation();
  const { addToCart } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await booksAPI.getCategories();
      if (result.success) {
        setCategories(result.data.slice(0, 6)); // Show first 6 categories
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const result = await booksAPI.searchBooks(searchQuery);
      if (result.success) {
        setSearchResults(result.data);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { bookId: book.id });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('BookList', { 
      categoryId: category.id, 
      categoryName: category.name 
    });
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Search Books</Text>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for books, authors, or categories..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
            </View>
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={loading}
            >
              <Text style={styles.searchButtonText}>
                {loading ? '...' : '🔍'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {searchQuery && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {hasSearched ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderBook}
            numColumns={2}
            columnWrapperStyle={styles.bookRow}
            contentContainerStyle={styles.resultsContainer}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  No books found for "{searchQuery}"
                </Text>
                <Text style={styles.emptySubtext}>
                  Try different keywords or browse categories
                </Text>
              </View>
            }
          />
        ) : (
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCategory}
              numColumns={2}
              columnWrapperStyle={styles.categoryRow}
              contentContainerStyle={styles.categoryList}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#6200EE',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
  },
  clearButton: {
    alignSelf: 'flex-end',
  },
  clearButtonText: {
    color: '#6200EE',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  categoryList: {
    paddingBottom: 20,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  categoryPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  resultsContainer: {
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
    height: 120,
  },
  bookPlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookIcon: {
    fontSize: 24,
    color: '#999',
  },
  bookInfo: {
    padding: 12,
  },
  bookTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 10,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    marginBottom: 8,
  },
  priceText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  addToCartButton: {
    backgroundColor: '#6200EE',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  addToCartText: {
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
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default SearchScreen;