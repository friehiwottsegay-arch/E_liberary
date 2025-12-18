// Exams Screen - Browse and take exams
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { examsAPI } from '../../api/exams';

const ExamsScreen = () => {
  const navigation = useNavigation();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const result = await examsAPI.getGroupedSubjects();
      if (result.success) {
        setCategories(result.data);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCategories();
    setRefreshing(false);
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('SubjectList', { category });
  };

  const handleSubjectPress = (subject) => {
    navigation.navigate('ExamStart', { subject });
  };

  const renderCategory = ({ item: category }) => (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(category)}
      >
        <Text style={styles.categoryIcon}>{category.icon || '📚'}</Text>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryCount}>
          {category.subjects?.length || 0} subjects
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSubject = ({ item: subject }) => (
    <View style={styles.subjectCard}>
      <View style={styles.subjectInfo}>
        <Text style={styles.subjectName}>{subject.name}</Text>
        <Text style={styles.subjectDescription} numberOfLines={2}>
          {subject.desc}
        </Text>
        <View style={styles.subjectMeta}>
          <Text style={styles.subjectQuestions}>
            {subject.questions?.length || 0} questions
          </Text>
          <Text style={styles.subjectTime}>{subject.time} minutes</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.startExamButton}
        onPress={() => handleSubjectPress(subject)}
      >
        <Text style={styles.startExamText}>Start Exam</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exams & Tests</Text>
        <Text style={styles.headerSubtitle}>
          Choose a subject to take an exam
        </Text>
      </View>

      {categories.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>No exams available</Text>
          <Text style={styles.emptySubtext}>
            Check back later for new exam content
          </Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.name}
          renderItem={renderCategory}
          contentContainerStyle={styles.categoriesList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
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
  categoriesList: {
    padding: 20,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
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
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
  },
  subjectCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subjectDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  subjectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subjectQuestions: {
    fontSize: 12,
    color: '#6200EE',
    fontWeight: '600',
  },
  subjectTime: {
    fontSize: 12,
    color: '#666',
  },
  startExamButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 12,
  },
  startExamText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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

export default ExamsScreen;