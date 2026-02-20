import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function ExploreScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, title: t('explore.categoriesList.budget'), icon: 'wallet', color: '#8B5CF6', lessons: 12 },
    { id: 2, title: t('explore.categoriesList.savings'), icon: 'cash', color: '#10B981', lessons: 8 },
    { id: 3, title: t('explore.categoriesList.investment'), icon: 'trending-up', color: '#F59E0B', lessons: 15 },
    { id: 4, title: t('explore.categoriesList.credit'), icon: 'card', color: '#EF4444', lessons: 10 },
    { id: 5, title: t('explore.categoriesList.retirement'), icon: 'time', color: '#8B5CF6', lessons: 6 },
    { id: 6, title: t('explore.categoriesList.realEstate'), icon: 'home', color: '#06B6D4', lessons: 9 },
  ];

  const popularLessons = [
    {
      id: 1,
      title: t('explore.lessons.budget'),
      duration: `15 ${t('common.min')}`,
      level: t('explore.levels.beginner'),
      rating: 4.8,
      enrolled: 1234,
    },
    {
      id: 2,
      title: t('explore.lessons.etf'),
      duration: `20 ${t('common.min')}`,
      level: t('explore.levels.intermediate'),
      rating: 4.9,
      enrolled: 2341,
    },
    {
      id: 3,
      title: t('explore.lessons.savings'),
      duration: `12 ${t('common.min')}`,
      level: t('explore.levels.beginner'),
      rating: 4.7,
      enrolled: 987,
    },
  ];

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('explore.title')}</Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={t('explore.search')}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('explore.categories')}</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <LinearGradient
                  colors={[category.color, category.color + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryGradient}
                >
                  <Ionicons name={category.icon} size={32} color={colors.text} />
                  <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Text>
                  <Text style={[styles.categoryLessons, { color: colors.text }]}>{category.lessons} {t('common.lessons')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Lessons */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('explore.popularCourses')}</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>

          {popularLessons.map((lesson) => (
            <TouchableOpacity key={lesson.id} style={[styles.lessonCard, { backgroundColor: colors.card }]}>
              <View style={styles.lessonThumbnail}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.thumbnailGradient}
                >
                  <Ionicons name="play-circle" size={32} color={colors.text} />
                </LinearGradient>
              </View>
              <View style={styles.lessonInfo}>
                <Text style={[styles.lessonTitle, { color: colors.text }]}>{lesson.title}</Text>
                <View style={styles.lessonMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                    <Text style={[styles.metaText, { color: colors.textMuted }]}>{lesson.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="bar-chart-outline" size={14} color={colors.textMuted} />
                    <Text style={[styles.metaText, { color: colors.textMuted }]}>{lesson.level}</Text>
                  </View>
                </View>
                <View style={styles.lessonFooter}>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={14} color={colors.warning} />
                    <Text style={[styles.ratingText, { color: colors.text }]}>{lesson.rating}</Text>
                  </View>
                  <Text style={[styles.enrolled, { color: colors.textMuted }]}>{lesson.enrolled} {t('common.enrolled')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommended */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('explore.recommended')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {[1, 2, 3].map((item) => (
              <TouchableOpacity key={item} style={styles.recommendedCard}>
                <LinearGradient
                  colors={[colors.card, colors.backgroundSecondary]}
                  style={styles.recommendedGradient}
                >
                  <View style={[styles.recommendedIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name="book" size={24} color={colors.primary} />
                  </View>
                  <Text style={[styles.recommendedTitle, { color: colors.text }]}>{t('explore.stockMarket')}</Text>
                  <Text style={[styles.recommendedSubtitle, { color: colors.textMuted }]}>6 {t('common.chapters')} • 2h 30min</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryGradient: {
    padding: 20,
    aspectRatio: 1,
    justifyContent: 'space-between',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryLessons: {
    fontSize: 12,
    opacity: 0.8,
  },
  lessonCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  lessonThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  thumbnailGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  enrolled: {
    fontSize: 11,
  },
  horizontalScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  recommendedCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  recommendedGradient: {
    padding: 16,
  },
  recommendedIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendedTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendedSubtitle: {
    fontSize: 11,
  },
});

