import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserStats } from '../context/UserStatsContext';
import * as Haptics from 'expo-haptics';

const COURSES = [
  { 
    id: 1, 
    title: 'Budget Personnel', 
    progress: 75, 
    duration: '2h 30min', 
    icon: 'wallet-outline', 
    color: '#8B5CF6', 
    students: '12.5k',
    lessons: 8,
    completedLessons: 6,
    description: 'Apprenez à gérer votre budget mensuel efficacement',
    difficulty: 'Débutant'
  },
  { 
    id: 2, 
    title: 'Investir en Bourse', 
    progress: 45, 
    duration: '3h 15min', 
    icon: 'trending-up-outline', 
    color: '#3B82F6', 
    students: '8.2k',
    lessons: 12,
    completedLessons: 5,
    description: 'Découvrez les bases de l\'investissement boursier',
    difficulty: 'Intermédiaire'
  },
  { 
    id: 3, 
    title: 'Épargne Intelligente', 
    progress: 0, 
    duration: '1h 45min', 
    icon: 'cash-outline', 
    color: '#10B981', 
    students: '15k',
    lessons: 6,
    completedLessons: 0,
    description: 'Stratégies pour économiser et faire fructifier votre argent',
    difficulty: 'Débutant'
  },
  { 
    id: 4, 
    title: 'Cryptomonnaies 101', 
    progress: 0, 
    duration: '2h 00min', 
    icon: 'logo-bitcoin', 
    color: '#F59E0B', 
    students: '9.8k',
    lessons: 10,
    completedLessons: 0,
    description: 'Introduction au monde des cryptomonnaies',
    difficulty: 'Intermédiaire'
  },
  { 
    id: 5, 
    title: 'Fiscalité & Impôts', 
    progress: 0, 
    duration: '2h 20min', 
    icon: 'document-text-outline', 
    color: '#EF4444', 
    students: '6.3k',
    lessons: 9,
    completedLessons: 0,
    description: 'Comprendre et optimiser votre situation fiscale',
    difficulty: 'Avancé'
  },
  { 
    id: 6, 
    title: 'Prêts & Crédits', 
    progress: 0, 
    duration: '1h 50min', 
    icon: 'card-outline', 
    color: '#EC4899', 
    students: '7.1k',
    lessons: 7,
    completedLessons: 0,
    description: 'Tout savoir sur les prêts et le crédit',
    difficulty: 'Intermédiaire'
  },
];

export default function CoursesScreen({ navigation }) {
  const { colors } = useTheme();
  const { stats } = useUserStats();
  const [filter, setFilter] = useState('all'); // all, in_progress, not_started

  const filteredCourses = COURSES.filter(course => {
    if (filter === 'in_progress') return course.progress > 0 && course.progress < 100;
    if (filter === 'not_started') return course.progress === 0;
    return true;
  });

  const handleCoursePress = (course) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('CourseDetail', { course });
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Débutant': return '#10B981';
      case 'Intermédiaire': return '#F59E0B';
      case 'Avancé': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  return (
    <LinearGradient colors={[colors.background, colors.backgroundSecondary]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Mes Cours</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats Summary */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: '#8B5CF6' }]}>
            {COURSES.filter(c => c.progress > 0 && c.progress < 100).length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>En cours</Text>
        </View>
        
        <View style={[styles.statBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: '#10B981' }]}>
            {stats.coursesCompleted || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Terminés</Text>
        </View>
        
        <View style={[styles.statBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
            {COURSES.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && styles.filterButtonActive,
            { borderColor: colors.border }
          ]}
          onPress={() => {
            setFilter('all');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={[
            styles.filterText,
            filter === 'all' ? styles.filterTextActive : { color: colors.textMuted }
          ]}>
            Tous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'in_progress' && styles.filterButtonActive,
            { borderColor: colors.border }
          ]}
          onPress={() => {
            setFilter('in_progress');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={[
            styles.filterText,
            filter === 'in_progress' ? styles.filterTextActive : { color: colors.textMuted }
          ]}>
            En cours
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'not_started' && styles.filterButtonActive,
            { borderColor: colors.border }
          ]}
          onPress={() => {
            setFilter('not_started');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={[
            styles.filterText,
            filter === 'not_started' ? styles.filterTextActive : { color: colors.textMuted }
          ]}>
            Non commencés
          </Text>
        </TouchableOpacity>
      </View>

      {/* Courses List */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: course }) => (
          <TouchableOpacity 
            style={[styles.courseCard, { backgroundColor: colors.card }]}
            onPress={() => handleCoursePress(course)}
            activeOpacity={0.7}
          >
            {/* Course Icon */}
            <View style={[styles.courseIcon, { backgroundColor: course.color + '20' }]}>
              <Ionicons name={course.icon} size={28} color={course.color} />
            </View>

            {/* Course Info */}
            <View style={styles.courseInfo}>
              <View style={styles.courseHeader}>
                <Text style={[styles.courseTitle, { color: colors.text }]}>{course.title}</Text>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(course.difficulty) + '20' }]}>
                  <Text style={[styles.difficultyText, { color: getDifficultyColor(course.difficulty) }]}>
                    {course.difficulty}
                  </Text>
                </View>
              </View>

              <Text style={[styles.courseDescription, { color: colors.textMuted }]} numberOfLines={2}>
                {course.description}
              </Text>

              <View style={styles.courseDetails}>
                <View style={styles.courseDetailItem}>
                  <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                  <Text style={[styles.courseDetailText, { color: colors.textMuted }]}>{course.duration}</Text>
                </View>
                <View style={styles.courseDetailItem}>
                  <Ionicons name="book-outline" size={14} color={colors.textMuted} />
                  <Text style={[styles.courseDetailText, { color: colors.textMuted }]}>
                    {course.completedLessons}/{course.lessons} leçons
                  </Text>
                </View>
                <View style={styles.courseDetailItem}>
                  <Ionicons name="people-outline" size={14} color={colors.textMuted} />
                  <Text style={[styles.courseDetailText, { color: colors.textMuted }]}>{course.students}</Text>
                </View>
              </View>

              {/* Progress Bar */}
              {course.progress > 0 && (
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${course.progress}%`, backgroundColor: course.color }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.progressText, { color: colors.textMuted }]}>
                    {course.progress}%
                  </Text>
                </View>
              )}
            </View>

            {/* Arrow */}
            <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  filterButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  courseCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  courseIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseInfo: {
    flex: 1,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  courseDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  courseDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  courseDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courseDetailText: {
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    width: 36,
  },
});
