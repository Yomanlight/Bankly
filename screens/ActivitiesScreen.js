import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStats } from '../context/StatsContext';
import { useLanguage } from '../context/LanguageContext';

export default function ActivitiesScreen() {
  const { activities, stats } = useStats();
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const periods = [
    { id: 'all', label: t('activities.filterAll') },
    { id: 'today', label: t('activities.filterToday') },
    { id: 'week', label: t('activities.filterWeek') },
    { id: 'month', label: t('activities.filterMonth') },
  ];

  // Calculer les stats depuis les vraies données
  const totalPoints = stats.totalPoints || 0;
  
  // Compter les activités d'aujourd'hui
  const today = new Date().toDateString();
  const todayActivities = activities.filter(activity => {
    if (!activity.timestamp) return false;
    return new Date(activity.timestamp).toDateString() === today;
  }).length;

  // Formater le temps relatif
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const activityDate = new Date(timestamp);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return t('activities.minutesAgo', { n: diffMins });
    if (diffHours < 24) return t('activities.hoursAgo', { n: diffHours });
    if (diffDays === 1) return t('activities.yesterday');
    if (diffDays < 7) return t('activities.daysAgo', { n: diffDays });
    return activityDate.toLocaleDateString();
  };

  // Ajouter le temps relatif aux activités
  const activitiesWithTime = activities.map(activity => ({
    ...activity,
    time: getRelativeTime(activity.timestamp),
  }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#1F2937']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('activities.title')}</Text>
          <Text style={styles.subtitle}>{activities.length} {t('activities.recentActivities')}</Text>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>{t('activities.pointsEarned')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{todayActivities}</Text>
            <Text style={styles.statLabel}>{t('activities.today')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.currentStreak || 0}</Text>
            <Text style={styles.statLabel}>{t('activities.streak')}</Text>
          </View>
        </View>

        {/* Period Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.filterButton,
                selectedPeriod === period.id && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedPeriod === period.id && styles.filterTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Activities List */}
        <ScrollView
          style={styles.activitiesList}
          showsVerticalScrollIndicator={false}
        >
          {activitiesWithTime.length > 0 ? (
            activitiesWithTime.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
                  <Ionicons name={activity.icon} size={24} color={activity.color} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <View style={styles.activityFooter}>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                    <View style={styles.activityPoints}>
                      <Ionicons name="trophy-outline" size={14} color="#F59E0B" />
                      <Text style={styles.pointsText}>+{activity.points} pts</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#6B7280" />
              <Text style={styles.emptyText}>{t('activities.noActivity')}</Text>
              <Text style={styles.emptySubtext}>{t('activities.startCourse')}</Text>
            </View>
          )}
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  filtersScroll: {
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#374151',
  },
  filterButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  activitiesList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
