import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  
  const menuItems = [
    {
      section: 'Compte',
      items: [
        { id: 1, title: 'Informations personnelles', icon: 'person-outline', screen: 'EditProfile' },
        { id: 2, title: 'Sécurité', icon: 'shield-checkmark-outline', screen: 'Security' },
        { id: 3, title: 'Notifications', icon: 'notifications-outline', screen: 'Notifications' },
      ],
    },
    {
      section: 'Apprentissage',
      items: [
        { id: 4, title: 'Mes certificats', icon: 'ribbon-outline', screen: 'Certificates' },
        { id: 5, title: 'Objectifs', icon: 'flag-outline', screen: 'Goals' },
        { id: 6, title: 'Statistiques', icon: 'bar-chart-outline', screen: 'Statistics' },
      ],
    },
    {
      section: 'Support',
      items: [
        { id: 7, title: 'Centre d\'aide', icon: 'help-circle-outline', screen: 'Help' },
        { id: 8, title: 'Nous contacter', icon: 'mail-outline', screen: 'Contact' },
        { id: 9, title: 'À propos', icon: 'information-circle-outline', screen: 'About' },
      ],
    },
  ];

  const achievements = [
    { id: 1, icon: 'trophy', label: 'Premier cours' },
    { id: 2, icon: 'flame', label: '7 jours' },
    { id: 3, icon: 'star', label: 'Top 10%' },
  ];

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profil</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: colors.text }]}>
                  <Text style={[styles.avatarText, { color: colors.primary }]}>JD</Text>
                </View>
                <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: colors.primaryDark, borderColor: colors.primary }]}>
                  <Ionicons name="camera" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: colors.text }]}>Jean Dupont</Text>
                <Text style={[styles.profileEmail, { color: colors.text }]}>jean.dupont@email.com</Text>
              </View>
            </View>

            {/* Achievements */}
            <View style={styles.achievementsContainer}>
              {achievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievement}>
                  <View style={[styles.achievementIcon, { backgroundColor: achievement.color + '30' }]}>
                    <Ionicons name={achievement.icon} size={20} color={achievement.color} />
                  </View>
                  <Text style={[styles.achievementLabel, { color: colors.text }]}>{achievement.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Cours complétés</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>2.5h</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Temps d'étude</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>7</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Jours de suite</Text>
          </View>
        </View>

        {/* Menu Sections */}
        {menuItems.map((section, index) => (
          <View key={index} style={styles.menuSection}>
            <Text style={[styles.menuSectionTitle, { color: colors.textSecondary }]}>{section.section}</Text>
            <View style={[styles.menuItems, { backgroundColor: colors.card }]}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, { borderBottomColor: colors.border }]}
                  onPress={() => navigation.navigate(item.screen)}
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

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.card }]}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Se déconnecter</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>Version 1.0.0</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileCard: {
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileGradient: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    opacity: 0.8,
  },
  achievementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  achievement: {
    alignItems: 'center',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementLabel: {
    fontSize: 11,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
  },
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  menuItems: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
  },
});

