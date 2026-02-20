import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../context/UserStatsContext';
import { useLanguage } from '../context/LanguageContext';

export default function MoreScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { stats } = useUserStats();
  const { t } = useLanguage();

  // Extraire les initiales du nom
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const userName = user?.name || user?.displayName || user?.email?.split('@')[0] || t('dashboard.advisor');
  const userInitials = getInitials(userName);
  const userPoints = stats?.totalPoints || 0;
  const userLevel = stats?.level || 1;

  const sections = [
    {
      title: t('more.myProfile'),
      items: [
        { icon: 'stats-chart', title: t('more.myStats'), screen: 'UserStats' },
        { icon: 'school', title: t('more.myCourses'), screen: 'Courses' },
      ],
    },
    {
      title: t('more.tools'),
      items: [
        { icon: 'calculator', title: t('more.budgetCalc'), screen: 'BudgetCalculator' },
        { icon: 'trophy', title: t('more.myBadges'), screen: 'Profile' },
      ],
    },
    {
      title: t('more.content'),
      items: [
        { icon: 'book', title: t('more.allCourses'), screen: 'Explore' },
        { icon: 'bulb', title: t('more.dailyTips'), screen: 'Profile' },
      ],
    },
    {
      title: t('more.account'),
      items: [
        { icon: 'settings', title: t('more.settings'), screen: 'Settings' },
        { icon: 'moon', title: t('more.theme'), action: 'toggleTheme' },
        { icon: 'information-circle', title: t('more.about'), screen: 'Profile' },
      ],
    },
  ];

  return (
    <LinearGradient colors={[colors.background, colors.backgroundSecondary]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('more.title')}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.profileCard, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('UserStats')}
          activeOpacity={0.7}
        >
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>{userName}</Text>
            <Text style={[styles.profileStats, { color: colors.textMuted }]}>{userPoints} pts • Level {userLevel}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {sections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{section.title}</Text>
            <View style={[styles.menuItems, { backgroundColor: colors.card }]}>
              {section.items.map((item, itemIdx) => (
                <TouchableOpacity
                  key={itemIdx}
                  style={[styles.menuItem, itemIdx < section.items.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
                  onPress={() => item.screen && navigation.navigate(item.screen)}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuItemIcon, { backgroundColor: colors.primary + '20' }]}>
                      <Ionicons name={item.icon} size={20} color={colors.primary} />
                    </View>
                    <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', letterSpacing: -1 },
  profileCard: { marginHorizontal: 24, marginBottom: 24, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  profileStats: { fontSize: 14 },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  menuItems: { borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuItemText: { fontSize: 15 },
});
