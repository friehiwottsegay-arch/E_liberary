// Payment Screen - Handles payment processing
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { paymentsAPI } from '../../api/payments';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const [selectedMethod, setSelectedMethod] = useState('chapa');
  const [loading, setLoading] = useState(false);
  const [availableMethods, setAvailableMethods] = useState([]);
  
  // If coming from cart, use cart items; if from book detail, use single book
  const paymentItems = route?.params?.items || cartItems;
  const totalAmount = getCartTotal();

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const result = await paymentsAPI.getPaymentMethods();
      if (result.success) {
        setAvailableMethods(result.data);
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      // Set default methods
      setAvailableMethods([
        { id: 'chapa', name: 'Chapa (Ethiopia)', type: 'local' },
        { id: 'stripe', name: 'Credit/Debit Card', type: 'international' },
        { id: 'paypal', name: 'PayPal', type: 'international' },
      ]);
    }
  };

  const handlePayment = async () => {
    if (paymentItems.length === 0) {
      Alert.alert('Empty Cart', 'No items to process payment for');
      return;
    }

    setLoading(true);
    
    try {
      // For Ethiopian users, prefer Chapa
      if (selectedMethod === 'chapa') {
        const result = await processChapaPayment();
        if (result.success) {
          Alert.alert(
            'Payment Initiated',
            'Please complete the payment using the provided link or instructions.',
            [
              { text: 'OK', onPress: () => {
                clearCart();
                navigation.navigate('Profile');
              }}
            ]
          );
        } else {
          Alert.alert('Payment Failed', result.message);
        }
      } else {
        // For other payment methods
        const result = await processGeneralPayment();
        if (result.success) {
          Alert.alert(
            'Payment Successful',
            'Your order has been processed successfully!',
            [
              { text: 'OK', onPress: () => {
                clearCart();
                navigation.navigate('Profile');
              }}
            ]
          );
        } else {
          Alert.alert('Payment Failed', result.message);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processChapaPayment = async () => {
    try {
      const paymentData = {
        book_id: paymentItems[0].book.id, // Assuming single book for now
        payment_type: 'purchase_soft',
        amount: totalAmount,
        currency: 'ETB',
        customer_email: user.email,
        customer_name: `${user.first_name} ${user.last_name}`,
        description: `Purchase of ${paymentItems.length} book(s)`,
      };

      const result = await paymentsAPI.processChapaPayment(paymentData);
      return result;
    } catch (error) {
      console.error('Chapa payment error:', error);
      return { success: false, message: 'Chapa payment failed' };
    }
  };

  const processGeneralPayment = async () => {
    try {
      const paymentData = {
        book_id: paymentItems[0].book.id,
        payment_type: 'purchase_soft',
        payment_method: selectedMethod,
        amount: totalAmount,
        transaction_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const result = await paymentsAPI.processPayment(paymentData);
      return result;
    } catch (error) {
      console.error('Payment error:', error);
      return { success: false, message: 'Payment processing failed' };
    }
  };

  const paymentMethods = [
    {
      id: 'chapa',
      name: 'Chapa (Ethiopia)',
      description: 'Pay with Telebir, CBE Bir, HelloCash, etc.',
      icon: '💳',
      color: '#6366f1',
    },
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: '💳',
      color: '#8b5cf6',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: '💵',
      color: '#3b82f6',
    },
  ];

  const renderOrderSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Order Summary</Text>
      {paymentItems.map((item, index) => (
        <View key={index} style={styles.orderItem}>
          <Text style={styles.orderItemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.orderItemDetails}>
            {item.bookType === 'hard' ? 'Physical' : 'Digital'} x{item.quantity}
          </Text>
          <Text style={styles.orderItemPrice}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderPaymentMethods = () => (
    <View style={styles.paymentContainer}>
      <Text style={styles.paymentTitle}>Payment Method</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentMethod,
            selectedMethod === method.id && styles.selectedMethod
          ]}
          onPress={() => setSelectedMethod(method.id)}
        >
          <View style={styles.methodHeader}>
            <Text style={styles.methodIcon}>{method.icon}</Text>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.methodDescription}>{method.description}</Text>
            </View>
            <View style={[
              styles.radioButton,
              selectedMethod === method.id && styles.radioButtonSelected
            ]}>
              {selectedMethod === method.id && <View style={styles.radioButtonInner} />}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderOrderSummary()}
        {renderPaymentMethods()}
        
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            <Text style={styles.payButtonText}>
              {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
  summaryContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderItemTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderItemDetails: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 8,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  paymentContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  paymentMethod: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  selectedMethod: {
    borderColor: '#6200EE',
    backgroundColor: '#f8f7ff',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 12,
    color: '#666',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#6200EE',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6200EE',
  },
  actionContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  payButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentScreen;