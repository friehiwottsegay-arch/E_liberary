// BookDetail Screen - Shows book details and purchase options
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
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { booksAPI } from '../../api/books';

const BookDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const { bookId } = route.params;
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('soft');
  const [rentalWeeks, setRentalWeeks] = useState(1);

  useEffect(() => {
    if (bookId) {
      loadBookDetail();
    }
  }, [bookId]);

  const loadBookDetail = async () => {
    setLoading(true);
    try {
      const result = await booksAPI.getBookDetail(bookId);
      if (result.success) {
        setBook(result.data);
        // Increment view count
        booksAPI.incrementBookViews(bookId);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!book) return;
    
    if (book.is_free) {
      Alert.alert('Free Book', 'This book is free and can be added to your library immediately.', [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add to Library', 
          onPress: () => {
            // For free books, we can either add to cart or go directly to download
            // For now, let's treat it as adding to cart with 0 price
            const freeBook = { ...book, hard_price: 0, soft_price: 0 };
            addToCart(freeBook, 'soft');
            Alert.alert('Success', 'Book added to your library!');
          }
        }
      ]);
      return;
    }
    
    addToCart(book, selectedType);
    Alert.alert('Success', 'Book added to cart!');
  };

  const handleBuyNow = () => {
    if (!book) return;
    
    // Add to cart and navigate to payment
    if (book.is_free) {
      Alert.alert('Free Book', 'This book is free!');
      return;
    }
    
    addToCart(book, selectedType);
    navigation.navigate('Payment');
  };

  const renderBookInfo = () => (
    <View style={styles.bookInfo}>
      <View style={styles.coverContainer}>
        {book.cover_image_url || book.cover_url ? (
          <Image 
            source={{ uri: book.cover_image_url || book.cover_url }} 
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.coverIcon}>📖</Text>
          </View>
        )}
      </View>
      
      <View style={styles.bookDetails}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>
        
        <View style={styles.metaInfo}>
          {book.category && (
            <Text style={styles.category}>📚 {book.category.name}</Text>
          )}
          {book.language && (
            <Text style={styles.language}>🗣️ {book.language}</Text>
          )}
          {book.grade_level && (
            <Text style={styles.grade}>🎓 {book.grade_level}</Text>
          )}
        </View>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {book.rating.toFixed(1)}</Text>
          <Text style={styles.views}>👁️ {book.views} views</Text>
        </View>
      </View>
    </View>
  );

  const renderPricing = () => {
    if (book.is_free) {
      return (
        <View style={styles.pricingSection}>
          <View style={styles.freeBadge}>
            <Text style={styles.freeText}>FREE</Text>
          </View>
          <TouchableOpacity 
            style={styles.readButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.readButtonText}>Read Now</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.pricingSection}>
        <Text style={styles.pricingTitle}>Choose Format & Rental Duration</Text>
        
        {/* Format Selection */}
        <View style={styles.formatSelection}>
          <Text style={styles.formatTitle}>Format:</Text>
          <View style={styles.formatButtons}>
            {book.available_for_soft && (
              <TouchableOpacity
                style={[
                  styles.formatButton,
                  selectedType === 'soft' && styles.formatButtonActive
                ]}
                onPress={() => setSelectedType('soft')}
              >
                <Text style={[
                  styles.formatButtonText,
                  selectedType === 'soft' && styles.formatButtonTextActive
                ]}>
                  Digital
                </Text>
                <Text style={styles.formatPrice}>${book.soft_price}</Text>
              </TouchableOpacity>
            )}
            
            {book.available_for_hard && (
              <TouchableOpacity
                style={[
                  styles.formatButton,
                  selectedType === 'hard' && styles.formatButtonActive
                ]}
                onPress={() => setSelectedType('hard')}
              >
                <Text style={[
                  styles.formatButtonText,
                  selectedType === 'hard' && styles.formatButtonTextActive
                ]}>
                  Physical
                </Text>
                <Text style={styles.formatPrice}>${book.hard_price}</Text>
              </TouchableOpacity>
            )}
            
            {book.available_for_rent && (
              <TouchableOpacity
                style={[
                  styles.formatButton,
                  selectedType === 'rent' && styles.formatButtonActive
                ]}
                onPress={() => setSelectedType('rent')}
              >
                <Text style={[
                  styles.formatButtonText,
                  selectedType === 'rent' && styles.formatButtonTextActive
                ]}>
                  Rent
                </Text>
                <Text style={styles.formatPrice}>${book.rental_price_per_week}/week</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Rental Duration */}
        {selectedType === 'rent' && book.available_for_rent && (
          <View style={styles.rentalSection}>
            <Text style={styles.rentalTitle}>Rental Duration:</Text>
            <View style={styles.rentalButtons}>
              {[1, 2, 4, 8, 12].map((weeks) => (
                <TouchableOpacity
                  key={weeks}
                  style={[
                    styles.rentalButton,
                    rentalWeeks === weeks && styles.rentalButtonActive
                  ]}
                  onPress={() => setRentalWeeks(weeks)}
                >
                  <Text style={[
                    styles.rentalButtonText,
                    rentalWeeks === weeks && styles.rentalButtonTextActive
                  ]}>
                    {weeks} week{weeks > 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <Text style={styles.totalPrice}>
            Total: ${selectedType === 'rent' 
              ? (book.rental_price_per_week * rentalWeeks).toFixed(2)
              : selectedType === 'hard' 
                ? book.hard_price 
                : book.soft_price
            }
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.addToCartBtn}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.buyNowBtn}
            onPress={handleBuyNow}
          >
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading book details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Book not found</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadBookDetail}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderBookInfo()}
        
        {book.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.description}>{book.description}</Text>
          </View>
        )}
        
        {renderPricing()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  bookInfo: {
    backgroundColor: 'white',
    padding: 20,
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  coverImage: {
    width: 200,
    height: 280,
    borderRadius: 8,
  },
  coverPlaceholder: {
    width: 200,
    height: 280,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  coverIcon: {
    fontSize: 64,
    color: '#999',
  },
  bookDetails: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  category: {
    fontSize: 12,
    color: '#6200EE',
    marginRight: 12,
    marginBottom: 4,
  },
  language: {
    fontSize: 12,
    color: '#666',
    marginRight: 12,
    marginBottom: 4,
  },
  grade: {
    fontSize: 12,
    color: '#666',
    marginRight: 12,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#ffa500',
    marginRight: 16,
  },
  views: {
    fontSize: 14,
    color: '#666',
  },
  descriptionSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 8,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  pricingSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 8,
  },
  freeBadge: {
    backgroundColor: '#28a745',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginBottom: 20,
  },
  freeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  formatSelection: {
    marginBottom: 20,
  },
  formatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  formatButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formatButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  formatButtonActive: {
    borderColor: '#6200EE',
    backgroundColor: '#f0f0ff',
  },
  formatButtonText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  formatButtonTextActive: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  formatPrice: {
    fontSize: 12,
    color: '#666',
  },
  rentalSection: {
    marginBottom: 20,
  },
  rentalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  rentalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rentalButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  rentalButtonActive: {
    borderColor: '#6200EE',
    backgroundColor: '#f0f0ff',
  },
  rentalButtonText: {
    fontSize: 14,
    color: '#333',
  },
  rentalButtonTextActive: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  priceSummary: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyNowBtn: {
    flex: 1,
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  buyNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  readButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  readButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookDetailScreen;