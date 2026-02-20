import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Alert, Modal, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export default function SettingsScreen({ navigation }) {
  const { isDarkMode, colors, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const currentLanguageLabel = LANGUAGES.find((l) => l.code === language)?.label || 'Français';

  const handleLogout = async () => {
    Alert.alert(
      t('settings.logoutTitle'),
      t('settings.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.logout'),
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (!result.success) {
              Alert.alert(t('common.error'), t('settings.logoutError'));
            }
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: t('settings.appearance'),
      items: [
        {
          id: 'theme',
          icon: 'moon',
          title: t('settings.darkMode'),
          type: 'switch',
          value: isDarkMode,
          onToggle: toggleTheme,
        },
        {
          id: 'notifications',
          icon: 'notifications',
          title: t('settings.notifications'),
          type: 'navigation',
          screen: 'NotificationSettings',
        },
      ],
    },
    {
      title: t('settings.account'),
      items: [
        {
          id: 'profile',
          icon: 'person',
          title: t('settings.personalInfo'),
          type: 'navigation',
          screen: 'EditProfile',
        },
        {
          id: 'security',
          icon: 'shield-checkmark',
          title: t('settings.security'),
          type: 'navigation',
          screen: 'Security',
        },
        {
          id: 'privacy',
          icon: 'lock-closed',
          title: t('settings.privacy'),
          type: 'navigation',
          screen: 'Privacy',
        },
      ],
    },
    {
      title: t('settings.preferences'),
      items: [
        {
          id: 'language',
          icon: 'language',
          title: t('settings.language'),
          subtitle: currentLanguageLabel,
          type: 'action',
          onPress: () => setLanguageModalVisible(true),
        },
        {
          id: 'currency',
          icon: 'cash',
          title: t('settings.currency'),
          subtitle: 'EUR (€)',
          type: 'navigation',
          screen: 'Currency',
        },
      ],
    },
    {
      title: t('settings.support'),
      items: [
        {
          id: 'help',
          icon: 'help-circle',
          title: t('settings.help'),
          type: 'navigation',
          screen: 'Help',
        },
        {
          id: 'feedback',
          icon: 'chatbubble',
          title: t('settings.feedback'),
          type: 'navigation',
          screen: 'Feedback',
        },
        {
          id: 'about',
          icon: 'information-circle',
          title: t('settings.aboutApp'),
          type: 'navigation',
          screen: 'About',
        },
      ],
    },
  ];

  const handleItemPress = (item) => {
    if (item.type === 'action') {
      item.onPress?.();
    } else if (item.type === 'navigation') {
      navigation.navigate(item.screen);
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings.title')}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {section.title}
            </Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  {item.type === 'switch' ? (
                    <View
                      style={[
                        styles.settingItem,
                        itemIndex !== section.items.length - 1 && {
                          borderBottomColor: colors.border,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <View style={styles.settingLeft}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                          <Ionicons name={item.icon} size={20} color={colors.primary} />
                        </View>
                        <Text style={[styles.settingTitle, { color: colors.text }]}>
                          {item.title}
                        </Text>
                      </View>
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={colors.card}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.settingItem,
                        itemIndex !== section.items.length - 1 && {
                          borderBottomColor: colors.border,
                          borderBottomWidth: 1,
                        },
                      ]}
                      onPress={() => handleItemPress(item)}
                    >
                      <View style={styles.settingLeft}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                          <Ionicons name={item.icon} size={20} color={colors.primary} />
                        </View>
                        <View>
                          <Text style={[styles.settingTitle, { color: colors.text }]}>
                            {item.title}
                          </Text>
                          {item.subtitle && (
                            <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
                              {item.subtitle}
                            </Text>
                          )}
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.card }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>{t('settings.logout')}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.version, { color: colors.textMuted }]}>
            {t('settings.version')}
          </Text>
        </View>
      </ScrollView>

      {/* Language Modal */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLanguageModalVisible(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('settings.chooseLanguage')}
            </Text>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const selected = item.code === language;
                return (
                  <TouchableOpacity
                    style={[
                      styles.languageItem,
                      { borderBottomColor: colors.border },
                      selected && { backgroundColor: colors.primary + '15' },
                    ]}
                    onPress={() => {
                      setLanguage(item.code);
                      setLanguageModalVisible(false);
                    }}
                  >
                    <Text style={styles.languageFlag}>{item.flag}</Text>
                    <Text style={[styles.languageLabel, { color: colors.text }]}>
                      {item.label}
                    </Text>
                    {selected && (
                      <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  sectionCard: { borderRadius: 16, overflow: 'hidden' },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: { fontSize: 15, fontWeight: '500' },
  settingSubtitle: { fontSize: 13, marginTop: 2 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 8,
  },
  logoutText: { fontSize: 16, fontWeight: '600' },
  footer: { alignItems: 'center', paddingBottom: 40 },
  version: { fontSize: 12 },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 16,
  },
  languageFlag: { fontSize: 28 },
  languageLabel: { fontSize: 16, fontWeight: '500', flex: 1 },
});
