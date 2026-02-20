import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStats } from '../context/StatsContext';
import { useLanguage } from '../context/LanguageContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

const WEEKLY_DATA_BASE = [
  { key: 'mon', minutes: 45 },
  { key: 'tue', minutes: 30 },
  { key: 'wed', minutes: 60 },
  { key: 'thu', minutes: 25 },
  { key: 'fri', minutes: 55 },
  { key: 'sat', minutes: 40 },
  { key: 'sun', minutes: 50 },
];

const CATEGORIES_DATA = [
  { name: 'Budget', percentage: 35, color: '#8B5CF6', completed: 12, total: 15 },
  { name: 'Investissement', percentage: 25, color: '#3B82F6', completed: 8, total: 12 },
  { name: 'Épargne', percentage: 20, color: '#10B981', completed: 6, total: 10 },
  { name: 'Crédit', percentage: 20, color: '#F59E0B', completed: 4, total: 8 },
];

const ACHIEVEMENTS = [
  { id: 1, title: 'Série de 7 jours', icon: 'flame', color: '#EF4444', unlocked: true },
  { id: 2, title: 'Expert du Budget', icon: 'trophy', color: '#F59E0B', unlocked: true },
  { id: 3, title: '10 cours terminés', icon: 'star', color: '#8B5CF6', unlocked: true },
  { id: 4, title: 'Quiz Master', icon: 'ribbon', color: '#10B981', unlocked: false },
];

export default function AnalyticsScreen() {
  const { stats } = useStats();
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const WEEKLY_DATA = WEEKLY_DATA_BASE.map((d) => ({
    ...d,
    label: t(`analytics.days_short.${d.key}`),
  }));

  const periods = [
    { id: 'week', label: t('analytics.week') },
    { id: 'month', label: t('analytics.month') },
    { id: 'year', label: t('analytics.year') },
  ];

  const totalMinutes = stats?.totalMinutes || WEEKLY_DATA.reduce((sum, day) => sum + day.minutes, 0);
  const averageMinutes = Math.round(totalMinutes / 7);
  const maxMinutes = Math.max(...WEEKLY_DATA.map(d => d.minutes));

  const categoriesData = [
    {
      name: t('explore.categoriesList.budget'),
      percentage: stats?.coursesCompleted >= 15 ? 100 : Math.round((stats?.coursesCompleted / 15) * 100),
      color: '#8B5CF6',
      completed: stats?.coursesCompleted || 0,
      total: 15,
    },
    { name: t('explore.categoriesList.investment'), percentage: 25, color: '#3B82F6', completed: 0, total: 12 },
    { name: t('explore.categoriesList.savings'), percentage: 20, color: '#10B981', completed: 0, total: 10 },
    { name: t('explore.categoriesList.credit'), percentage: 20, color: '#F59E0B', completed: 0, total: 8 },
  ];

  const achievements = [
    { id: 1, title: t('analytics.achievements.streak7'), icon: 'flame', color: '#EF4444', unlocked: (stats?.currentStreak || 0) >= 7 },
    { id: 2, title: t('analytics.achievements.budgetExpert'), icon: 'trophy', color: '#F59E0B', unlocked: (stats?.score || 0) >= 700 },
    { id: 3, title: t('analytics.achievements.courses10'), icon: 'star', color: '#8B5CF6', unlocked: (stats?.coursesCompleted || 0) >= 10 },
    { id: 4, title: t('analytics.achievements.quizMaster'), icon: 'ribbon', color: '#10B981', unlocked: (stats?.quizzesPassed || 0) >= 5 },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#1F2937']} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('analytics.title')}</Text>
          <Text style={styles.subtitle}>{t('analytics.subtitle')}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Stats Overview */}
          <View style={styles.statsGrid}>
            <View style={styles.statCardLarge}>
              <Text style={styles.statLabel}>{t('analytics.timeThisWeek')}</Text>
              <Text style={styles.statValueLarge}>{totalMinutes} {t('common.min')}</Text>
              <View style={styles.statChange}>
                <Ionicons name="trending-up" size={16} color="#10B981" />
                <Text style={styles.statChangeText}>{t('analytics.vsLastWeek')}</Text>
              </View>
            </View>
            <View style={styles.statCardSmall}>
              <Text style={styles.statLabelSmall}>{t('analytics.dailyAverage')}</Text>
              <Text style={styles.statValueSmall}>{averageMinutes} {t('common.min')}</Text>
            </View>
            <View style={styles.statCardSmall}>
              <Text style={styles.statLabelSmall}>{t('analytics.currentStreak')}</Text>
              <Text style={styles.statValueSmall}>{stats?.currentStreak || 0} {t('analytics.days')}</Text>
            </View>
          </View>

          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.id && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period.id)}
              >
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === period.id && styles.periodTextActive,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bar Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('analytics.dailyStudy')}</Text>
            <View style={styles.chartContainer}>
              <View style={styles.barChart}>
                {WEEKLY_DATA.map((day, index) => (
                  <View key={index} style={styles.barContainer}>
                    <View style={styles.barWrapper}>
                      <LinearGradient
                        colors={['#8B5CF6', '#EC4899']}
                        style={[
                          styles.bar,
                          { height: `${(day.minutes / maxMinutes) * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{day.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Categories Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('analytics.categoryProgress')}</Text>
            {categoriesData.map((category, index) => (
              <View key={index} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <View
                      style={[styles.categoryDot, { backgroundColor: category.color }]}
                    />
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${category.percentage}%`,
                          backgroundColor: category.color,
                        },
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.categoryStats}>
                  {category.completed}/{category.total} {t('analytics.coursesCompleted')}
                </Text>
              </View>
            ))}
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('analytics.badges')}</Text>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    !achievement.unlocked && styles.achievementLocked,
                  ]}
                >
                  <View
                    style={[
                      styles.achievementIcon,
                      { backgroundColor: achievement.color + '20' },
                    ]}
                  >
                    <Ionicons
                      name={achievement.icon}
                      size={28}
                      color={achievement.unlocked ? achievement.color : '#6B7280'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.achievementTitle,
                      !achievement.unlocked && styles.achievementTitleLocked,
                    ]}
                  >
                    {achievement.title}
                  </Text>
                  {achievement.unlocked && (
                    <View style={styles.unlockedBadge}>
                      <Ionicons name="checkmark" size={12} color="#10B981" />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('analytics.insights')}</Text>
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Ionicons name="bulb" size={24} color="#F59E0B" />
                <Text style={styles.insightTitle}>{t('analytics.progressingFast')}</Text>
              </View>
              <Text style={styles.insightText}>{t('analytics.progressMessage')}</Text>
            </View>
            <View style={[styles.insightCard, { backgroundColor: '#1F2937' }]}>
              <View style={styles.insightHeader}>
                <Ionicons name="trophy" size={24} color="#8B5CF6" />
                <Text style={styles.insightTitle}>{t('analytics.goalReached')}</Text>
              </View>
              <Text style={styles.insightText}>{t('analytics.congratulations')}</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCardLarge: {
    width: '100%',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
  },
  statCardSmall: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    minWidth: (SCREEN_WIDTH - 60) / 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  statValueLarge: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statChangeText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
  },
  statLabelSmall: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  statValueSmall: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#374151',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  barWrapper: {
    width: '70%',
    height: '80%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 10,
  },
  barLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 8,
  },
  categoryCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryStats: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  achievementTitleLocked: {
    color: '#6B7280',
  },
  unlockedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  insightText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
});
