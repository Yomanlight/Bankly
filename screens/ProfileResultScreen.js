import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import FloatingParticles from '../components/FloatingParticles';

export default function ProfileResultScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { profile, answers, initialBalance } = route.params;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('AdvisorSelection', { initialBalance });
  };

  return (
    <LinearGradient colors={[colors.background, colors.backgroundSecondary]} style={styles.container}>
      {/* Particules en arrière-plan */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <FloatingParticles count={25} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                backgroundColor: profile.color + '20',
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Ionicons name={profile.icon} size={80} color={profile.color} />
          </Animated.View>

          <Animated.Text
            style={[
              styles.title,
              { color: colors.text, opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {profile.title}
          </Animated.Text>

          <Animated.View
            style={[
              styles.badge,
              {
                backgroundColor: profile.color + '20',
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: profile.color }]}>
              Ton profil d'investisseur
            </Text>
          </Animated.View>
        </View>

        {/* Description */}
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>À propos de ton profil</Text>
          </View>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {profile.description}
          </Text>
        </Animated.View>

        {/* Recommendations */}
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="bulb" size={24} color={profile.color} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Recommandations pour toi</Text>
          </View>
          
          {profile.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={[styles.bullet, { backgroundColor: profile.color }]} />
              <Text style={[styles.recommendationText, { color: colors.text }]}>{rec}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Profile Characteristics */}
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="analytics" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Caractéristiques</Text>
          </View>

          <View style={styles.characteristics}>
            {profile.type === 'prudent' && (
              <>
                <CharacteristicItem icon="shield-checkmark" label="Sécurité prioritaire" color={colors.success} colors={colors} />
                <CharacteristicItem icon="trending-down" label="Faible volatilité" color={colors.success} colors={colors} />
                <CharacteristicItem icon="time" label="Court à moyen terme" color={colors.primary} colors={colors} />
              </>
            )}
            {profile.type === 'equilibre' && (
              <>
                <CharacteristicItem icon="git-branch" label="Diversification" color={colors.primary} colors={colors} />
                <CharacteristicItem icon="analytics" label="Volatilité modérée" color={colors.primary} colors={colors} />
                <CharacteristicItem icon="calendar" label="Moyen à long terme" color={colors.primary} colors={colors} />
              </>
            )}
            {profile.type === 'dynamique' && (
              <>
                <CharacteristicItem icon="rocket" label="Recherche de performance" color={colors.warning} colors={colors} />
                <CharacteristicItem icon="pulse" label="Volatilité acceptée" color={colors.warning} colors={colors} />
                <CharacteristicItem icon="infinite" label="Horizon long terme" color={colors.warning} colors={colors} />
              </>
            )}
          </View>
        </Animated.View>

        {/* Next Steps */}
        <Animated.View
          style={[
            styles.card,
            styles.nextStepsCard,
            {
              backgroundColor: colors.primary + '10',
              borderColor: colors.primary,
              opacity: fadeAnim,
            },
          ]}
        >
          <Ionicons name="compass" size={32} color={colors.primary} />
          <Text style={[styles.nextStepsTitle, { color: colors.text }]}>
            Prêt à commencer ton parcours ?
          </Text>
          <Text style={[styles.nextStepsText, { color: colors.textMuted }]}>
            Découvre nos cours adaptés à ton profil et commence à investir intelligemment.
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: profile.color }]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Commencer l'aventure</Text>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

    </LinearGradient>
  );
}

function CharacteristicItem({ icon, label, color, colors }) {
  return (
    <View style={styles.characteristicItem}>
      <View style={[styles.characteristicIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.characteristicLabel, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  badge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  characteristics: {
    gap: 12,
  },
  characteristicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  characteristicIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characteristicLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  nextStepsCard: {
    alignItems: 'center',
    borderWidth: 2,
  },
  nextStepsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  nextStepsText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
