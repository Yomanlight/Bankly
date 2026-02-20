import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/Button';
import Logo from '../components/Logo';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      {/* Logo avec effet de cercle */}
      <View style={styles.logoContainer}>
        <Logo size="large" />
        {/* Cercles décoratifs */}
        <View style={[styles.decorCircle, styles.decorCircle1, { backgroundColor: colors.primary }]} />
        <View style={[styles.decorCircle, styles.decorCircle2, { backgroundColor: colors.primary }]} />
        <View style={[styles.decorCircle, styles.decorCircle3, { backgroundColor: colors.primary }]} />
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('onboarding.subtitle')}
        </Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          {t('onboarding.description')}
        </Text>
      </View>

      {/* Boutons */}
      <View style={styles.buttonContainer}>
        <Button
          title={t('onboarding.start')}
          onPress={() => navigation.navigate('SignUp')}
          style={styles.button}
        />
        <Button
          title={t('onboarding.login')}
          onPress={() => navigation.navigate('Login')}
          variant="outline"
          style={styles.button}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.15,
  },
  decorCircle1: {
    width: 80,
    height: 80,
    top: 50,
    left: 30,
  },
  decorCircle2: {
    width: 60,
    height: 60,
    top: 100,
    right: 40,
  },
  decorCircle3: {
    width: 50,
    height: 50,
    bottom: 80,
    left: 50,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 12,
  },
});
