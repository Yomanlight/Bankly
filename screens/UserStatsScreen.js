import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserStats } from '../context/UserStatsContext';

export default function UserStatsScreen({ navigation }) {
  const { colors } = useTheme();
  const { stats, formatTimeSpent } = useUserStats();

  const statsCards = [
    {
      title: 'Temps d\'apprentissage',
      value: formatTimeSpent(stats.totalTimeSpent),
      icon: 'time-outline',
      color: '#8B5CF6',
      gradient: ['#8B5CF6', '#7C3AED'],
    },
    {
      title: 'Points totaux',
      value: stats.totalPoints.toString(),
      icon: 'trophy-outline',
      color: '#F59E0B',
      gradient: ['#F59E0B', '#D97706'],
    },
    {
      title: 'Série actuelle',
      value: `${stats.streakDays} jours`,
      icon: 'flame-outline',
      color: '#EF4444',
      gradient: ['#EF4444', '#DC2626'],
    },
    {
      title: 'Niveau',
      value: stats.level.toString(),
      icon: 'star-outline',
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
    },
  ];

  const progressCards = [
    {
      title: 'Cours terminés',
      value: stats.coursesCompleted,
      total: stats.coursesCompleted + stats.coursesInProgress + 10,
      icon: 'school-outline',
      color: '#8B5CF6',
    },
    {
      title: 'Quiz complétés',
      value: stats.quizzesTaken,
      total: 50,
      icon: 'help-circle-outline',
      color: '#3B82F6',
    },
    {
      title: 'Missions accomplies',
      value: stats.missionsCompleted.length,
      total: 30,
      icon: 'checkmark-done-outline',
      color: '#10B981',
    },
  ];

  return (
    <LinearGradient colors={[colors.background, colors.backgroundSecondary]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Mes Statistiques</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Main Stats */}
        <View style={styles.mainStatsContainer}>
          {statsCards.map((stat, index) => (
            <View key={index} style={styles.mainStatCard}>
              <LinearGradient colors={stat.gradient} style={styles.mainStatGradient}>
                <View style={styles.mainStatIcon}>
                  <Ionicons name={stat.icon} size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.mainStatValue}>{stat.value}</Text>
                <Text style={styles.mainStatTitle}>{stat.title}</Text>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Progression</Text>
          
          {progressCards.map((item, index) => {
            const percentage = Math.min((item.value / item.total) * 100, 100);
            
            return (
              <View key={index} style={[styles.progressCard, { backgroundColor: colors.card }]}>
                <View style={styles.progressHeader}>
                  <View style={[styles.progressIcon, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  </View>
                  <View style={styles.progressInfo}>
                    <Text style={[styles.progressTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.progressValue, { color: colors.textMuted }]}>
                      {item.value} / {item.total}
                    </Text>
                  </View>
                  <Text style={[styles.progressPercentage, { color: item.color }]}>
                    {Math.round(percentage)}%
                  </Text>
                </View>
                <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${percentage}%`, backgroundColor: item.color }
                    ]} 
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Badges Section */}
        {stats.badges.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Badges obtenus</Text>
            <View style={styles.badgesContainer}>
              {stats.badges.map((badge, index) => (
                <View key={index} style={[styles.badgeCard, { backgroundColor: colors.card }]}>
                  <View style={styles.badgeIcon}>
                    <Ionicons name={badge.icon || 'medal-outline'} size={32} color="#F59E0B" />
                  </View>
                  <Text style={[styles.badgeName, { color: colors.text }]}>{badge.name}</Text>
                  <Text style={[styles.badgeDate, { color: colors.textMuted }]}>
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Activity Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Résumé d'activité</Text>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Score moyen aux quiz</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {stats.quizzesTaken > 0 
                  ? Math.round(stats.quizzesScore / stats.quizzesTaken) 
                  : 0}%
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Cours en cours</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {stats.coursesInProgress}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Dernière connexion</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {stats.lastActiveDate 
                  ? new Date(stats.lastActiveDate).toLocaleDateString() 
                  : 'Aujourd\'hui'}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingBottom: 24,
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
  mainStatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  mainStatCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  mainStatGradient: {
    padding: 20,
    alignItems: 'center',
  },
  mainStatIcon: {
    marginBottom: 12,
  },
  mainStatValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  mainStatTitle: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  progressCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 13,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '30%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  badgeIcon: {
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDate: {
    fontSize: 10,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 15,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
});
