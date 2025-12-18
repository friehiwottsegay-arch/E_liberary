// Subscription Screen - Manage subscription plans and billing
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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { subscriptionAPI } from '../../api/subscription';

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [currentPlan, setCurrentPlan] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    setLoading(true);
    try {
      const [currentResult, plansResult] = await Promise.all([
        subscriptionAPI.getCurrentSubscription(),
        subscriptionAPI.getAvailablePlans(),
      ]);

      if (currentResult.success) {
        setCurrentPlan(currentResult.data);
      }

      if (plansResult.success) {
        setAvailablePlans(plansResult.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    setSubscribing(true);
    try {
      const result = await subscriptionAPI.subscribeToPlan(plan.id);
      if (result.success) {
        if (result.data.checkout_url) {
          // Navigate to payment or show external link
          Alert.alert(
            'Subscription',
            'You will be redirected to complete your subscription payment.',
            [
              { text: 'OK', onPress: () => navigation.navigate('Payment', { subscription: true }) }
            ]
          );
        } else {
          Alert.alert('Success', 'Subscription activated successfully!');
          loadSubscriptionData();
        }
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Subscription failed. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancelSubscription = async () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your current subscription?',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        { 
          text: 'Cancel Subscription', 
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await subscriptionAPI.cancelSubscription();
              if (result.success) {
                Alert.alert('Success', 'Subscription cancelled successfully');
                loadSubscriptionData();
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel subscription');
            }
          }
        }
      ]
    );
  };

  const renderCurrentPlan = () => {
    if (!currentPlan) return null;

    return (
      <View style={styles.currentPlanContainer}>
        <Text style={styles.sectionTitle}>Current Plan</Text>
        <View style={styles.currentPlanCard}>
          <View style={styles.currentPlanHeader}>
            <Text style={styles.currentPlanName}>{currentPlan.plan_name}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: currentPlan.is_active ? '#28a745' : '#dc3545' }
            ]}>
              <Text style={styles.statusText}>
                {currentPlan.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          
          <View style={styles.planDetails}>
            <Text style={styles.planPrice}>
              ${currentPlan.amount}/{currentPlan.billing_cycle}
            </Text>
            <Text style={styles.planNextBilling}>
              Next billing: {new Date(currentPlan.next_billing_date).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.currentPlanActions}>
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => navigation.navigate('SubscriptionDetail', { subscription: currentPlan })}
            >
              <Text style={styles.manageButtonText}>Manage</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelSubscription}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderPlanCard = (plan) => (
    <View style={styles.planCard} key={plan.id}>
      <View style={styles.planHeader}>
        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planDescription}>{plan.description}</Text>
      </View>
      
      <View style={styles.planFeatures}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.planPricing}>
        <Text style={styles.planPrice}>${plan.price}</Text>
        <Text style={styles.planPeriod}>/{plan.period}</Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.subscribeButton,
          subscribing && styles.subscribeButtonDisabled,
          currentPlan?.id === plan.id && styles.currentPlanButton
        ]}
        onPress={() => handleSubscribe(plan)}
        disabled={subscribing || currentPlan?.id === plan.id}
      >
        <Text style={styles.subscribeButtonText}>
          {subscribing ? 'Processing...' : 
           currentPlan?.id === plan.id ? 'Current Plan' : 'Subscribe'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAvailablePlans = () => (
    <View style={styles.plansContainer}>
      <Text style={styles.sectionTitle}>Available Plans</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {availablePlans.map(renderPlanCard)}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Subscription</Text>
        <Text style={styles.headerSubtitle}>
          Manage your subscription and billing
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentPlan && renderCurrentPlan()}
        {renderAvailablePlans()}
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Subscription Benefits</Text>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📚</Text>
            <Text style={styles.benefitText}>Unlimited access to all books</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📝</Text>
            <Text style={styles.benefitText}>Take unlimited exams and tests</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🔬</Text>
            <Text style={styles.benefitText}>Access to research papers and projects</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🤟</Text>
            <Text style={styles.benefitText}>Complete sign language dictionary</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🤖</Text>
            <Text style={styles.benefitText}>AI-powered study assistance</Text>
          </View>
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
  scrollView: {
    flex: 1,
  },
  currentPlanContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  currentPlanCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#6200EE',
  },
  currentPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPlanName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planDetails: {
    marginBottom: 16,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  planNextBilling: {
    fontSize: 14,
    color: '#666',
  },
  currentPlanActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  manageButton: {
    flex: 1,
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  manageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#dc3545',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: 'bold',
  },
  plansContainer: {
    padding: 20,
  },
  planCard: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
  },
  planFeatures: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    color: '#28a745',
    fontSize: 14,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  planPeriod: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  subscribeButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  subscribeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  currentPlanButton: {
    backgroundColor: '#28a745',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#333',
  },
});

export default SubscriptionScreen;