import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

const PDFReaderScreen = () => {
  const route = useRoute();
  const { book, pdfUrl } = route.params || {};
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleOpenPDF = async () => {
    if (pdfUrl) {
      const supported = await Linking.canOpenURL(pdfUrl);
      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert('Error', 'Cannot open PDF URL');
      }
    }
  };

  if (!pdfUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No PDF file available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.content}>
        <Text style={styles.title}>{book?.title || 'PDF Reader'}</Text>
        <Text style={styles.message}>
          PDF viewing requires a native build. In Expo Go, you can open the PDF in your browser.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleOpenPDF}>
          <Text style={styles.buttonText}>Open PDF in Browser</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default PDFReaderScreen;
