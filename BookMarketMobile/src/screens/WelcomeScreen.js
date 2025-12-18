import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [demoLoading, setDemoLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    
    try {
      console.log('Attempting demo login...');
      const result = await login('demo_buyer', 'demo123');
      
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Demo login successful!');
        navigation.replace('Main');
      } else {
        setDemoLoading(false);
        console.log('Demo login failed:', result.message);
        Alert.alert(
          '❌ Demo Login Failed',
          result.message || 'Demo account not available.\n\nPlease:\n1. Make sure backend is running\n2. Run: python create_demo_user.py',
          [
            { 
              text: 'Create Account', 
              onPress: () => navigation.navigate('Register'),
              style: 'default'
            },
            { 
              text: 'Sign In', 
              onPress: () => navigation.navigate('Login') 
            },
            { 
              text: 'Cancel', 
              style: 'cancel' 
            },
          ]
        );
      }
    } catch (error) {
      setDemoLoading(false);
      console.error('Demo login error:', error);
      
      Alert.alert(
        '🔌 Connection Error',
        'Cannot connect to backend server.\n\n' +
        'Please check:\n' +
        '1. Backend is running on port 8001\n' +
        '2. You are on the same WiFi network\n' +
        '3. Update API URL in src/api/client.js\n\n' +
        'Error: ' + (error.message || 'Network error'),
        [
          { 
            text: 'Try Again', 
            onPress: handleDemoLogin 
          },
          { 
            text: 'Cancel', 
            style: 'cancel' 
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Animated Content */}
      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📚</Text>
          </View>
          <Text style={styles.appTitle}>E-Library</Text>
          <Text style={styles.subtitle}>Your Digital Reading Companion</Text>
        </View>

        {/* Feature Highlights */}
        <View style={styles.features}>
          <View style={styles.featureRow}>
            <View style={styles.featureBadge}>
              <Text style={styles.featureBadgeText}>📖 10,000+ Books</Text>
            </View>
            <View style={styles.featureBadge}>
              <Text style={styles.featureBadgeText}>🎧 Audiobooks</Text>
            </View>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.featureBadge}>
              <Text style={styles.featureBadgeText}>🤖 AI Assistant</Text>
            </View>
            <View style={styles.featureBadge}>
              <Text style={styles.featureBadgeText}>⚡ Instant Access</Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.9}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.demoButton, demoLoading && styles.demoButtonDisabled]}
            onPress={handleDemoLogin}
            disabled={demoLoading}
            activeOpacity={0.9}
          >
            {demoLoading ? (
              <ActivityIndicator size="small" color="#64748B" />
            ) : (
              <Text style={styles.demoButtonText}>🚀 Try Demo</Text>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#DBEAFE',
  },
  icon: {
    fontSize: 40,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 6,
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  features: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 10,
  },
  featureBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureBadgeText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  ctaSection: {
    marginTop: 0,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#1E293B',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  demoButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  demoButtonDisabled: {
    opacity: 0.5,
  },
  demoButtonText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default WelcomeScreen;
