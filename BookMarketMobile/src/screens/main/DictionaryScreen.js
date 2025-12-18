// Dictionary Screen - Sign language dictionary
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { dictionaryAPI } from '../../api/dictionary';

const DictionaryScreen = () => {
  const navigation = useNavigation();
  
  const [words, setWords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    setLoading(true);
    try {
      const result = await dictionaryAPI.getSignWords();
      if (result.success) {
        setWords(result.data);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load dictionary');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWords();
    setRefreshing(false);
  };

  const handleSearch = async (query) => {
    if (query.trim() === '') {
      loadWords();
      return;
    }

    setLoading(true);
    try {
      const result = await dictionaryAPI.searchWords(query);
      if (result.success) {
        setWords(result.data);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWordPress = (word) => {
    // In a real app, this would open a video player for the sign language video
    Alert.alert(
      word.word,
      'This would play the sign language video in a full implementation',
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Learn More', onPress: () => console.log('Learn more about:', word.word) }
      ]
    );
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a word..."
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          handleSearch(text);
        }}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );

  const renderWord = ({ item: word }) => (
    <TouchableOpacity
      style={styles.wordCard}
      onPress={() => handleWordPress(word)}
    >
      <View style={styles.wordInfo}>
        <Text style={styles.wordText}>{word.word}</Text>
        <Text style={styles.wordDescription}>
          Tap to see sign language video
        </Text>
      </View>
      
      <View style={styles.wordActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>▶️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>❤️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item: category }) => (
    <View style={styles.categoryCard}>
      <Text style={styles.categoryIcon}>{category.icon || '📖'}</Text>
      <Text style={styles.categoryName}>{category.name}</Text>
      <Text style={styles.categoryCount}>
        {category.words?.length || 0} words
      </Text>
    </View>
  );

  // Group words by first letter for alphabetical organization
  const organizedWords = words.reduce((acc, word) => {
    const firstLetter = word.word.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(word);
    return acc;
  }, {});

  const sections = Object.keys(organizedWords).sort();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sign Language Dictionary</Text>
        <Text style={styles.headerSubtitle}>
          Learn sign language with visual guides
        </Text>
      </View>

      {renderSearchBar()}

      <FlatList
        data={sections}
        keyExtractor={(letter) => letter}
        renderItem={({ item: letter }) => (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{letter}</Text>
            <FlatList
              data={organizedWords[letter]}
              keyExtractor={(word) => word.id.toString()}
              renderItem={renderWord}
              scrollEnabled={false}
            />
          </View>
        )}
        contentContainerStyle={styles.wordsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👋</Text>
              <Text style={styles.emptyText}>No words found</Text>
              <Text style={styles.emptySubtext}>
                Try searching for a different word
              </Text>
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
  searchContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
  },
  wordsList: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 12,
    marginLeft: 16,
  },
  wordCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  wordInfo: {
    flex: 1,
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  wordDescription: {
    fontSize: 12,
    color: '#666',
  },
  wordActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 16,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default DictionaryScreen;