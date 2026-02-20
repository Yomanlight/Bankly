import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, Image, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const ADVISORS = [
  {
    id: 'emma',
    name: 'Emma',
    role: 'Experte en Investissement',
    description: 'Spécialiste des stratégies de croissance et investissements long terme.',
    gradient: ['#8B5CF6', '#EC4899'],
    accentColor: '#8B5CF6',
    image: require('../assets/advisors/emma.png'),
    personality: 'Stratégique & Analytique',
    specialty: ['ETF', 'Actions', 'Patrimoine'],
    users: '8.4k',
    rating: '4.9',
  },
  {
    id: 'alex',
    name: 'Alex',
    role: 'Coach Budgétaire',
    description: 'Vous aide à économiser et gérer vos dépenses au quotidien efficacement.',
    gradient: ['#3B82F6', '#06B6D4'],
    accentColor: '#3B82F6',
    image: require('../assets/advisors/alex.png'),
    personality: 'Pratique & Bienveillant',
    specialty: ['Budget', 'Épargne', 'Quotidien'],
    users: '12.1k',
    rating: '4.8',
  },
  {
    id: 'jules',
    name: 'Jules',
    role: 'Planificateur Financier',
    description: 'Vous guide vers vos objectifs financiers étape par étape avec méthode.',
    gradient: ['#10B981', '#84CC16'],
    accentColor: '#10B981',
    image: require('../assets/advisors/jules.png'),
    personality: 'Méthodique & Motivant',
    specialty: ['Retraite', 'Immobilier', 'Objectifs'],
    users: '6.7k',
    rating: '4.9',
  },
];

export default function AdvisorSelectionScreen({ navigation, route }) {
  const { updateUserProfile } = useAuth();
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const initialBalance = route.params?.initialBalance || 0;

  const selected = ADVISORS.find((a) => a.id === selectedAdvisor);

  const handleContinue = async () => {
    if (!selectedAdvisor) {
      Alert.alert('Choisissez votre conseiller', 'Veuillez sélectionner un conseiller pour continuer');
      return;
    }
    setIsLoading(true);
    try {
      const result = await updateUserProfile({
        selectedAdvisor,
        accountBalance: initialBalance,
        onboardingCompleted: true,
      });
      if (result?.success) {
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Erreur', result?.error || 'Impossible de sauvegarder votre choix.');
      }
    } catch (error) {
      Alert.alert('Erreur', "Une erreur inattendue s'est produite.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0A0A0A', '#111827']} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowDot} />
            <Text style={styles.eyebrow}>DERNIÈRE ÉTAPE</Text>
          </View>
          <Text style={styles.title}>Choisissez{'\n'}votre Coach IA</Text>
          <Text style={styles.subtitle}>
            Un expert personnalisé qui vous accompagne vers vos objectifs financiers
          </Text>
        </View>

        {/* Cards */}
        {ADVISORS.map((advisor) => {
          const isSelected = selectedAdvisor === advisor.id;
          return (
            <TouchableOpacity
              key={advisor.id}
              activeOpacity={0.85}
              onPress={() => setSelectedAdvisor(advisor.id)}
            >
              <View
                style={[
                  styles.card,
                  isSelected && {
                    borderColor: advisor.accentColor,
                    borderWidth: 2,
                    shadowColor: advisor.accentColor,
                    shadowOpacity: 0.4,
                    shadowRadius: 20,
                    elevation: 10,
                  },
                ]}
              >
                {/* Banner */}
                <LinearGradient
                  colors={advisor.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.banner}
                >
                  {/* Stats top-left */}
                  <View style={styles.bannerStats}>
                    <View style={styles.statChip}>
                      <Ionicons name="star" size={11} color="#FFFFFF" />
                      <Text style={styles.statChipText}>{advisor.rating}</Text>
                    </View>
                    <View style={styles.statChip}>
                      <Ionicons name="people" size={11} color="#FFFFFF" />
                      <Text style={styles.statChipText}>{advisor.users}</Text>
                    </View>
                  </View>

                  {/* Advisor image right side */}
                  <Image
                    source={advisor.image}
                    style={styles.bannerImage}
                    resizeMode="contain"
                  />

                  {/* Selected checkmark */}
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                    </View>
                  )}
                </LinearGradient>

                {/* Content */}
                <View style={styles.cardBody}>
                  <View style={styles.cardTopRow}>
                    <View style={styles.nameBlock}>
                      <Text style={styles.advisorName}>{advisor.name}</Text>
                      <Text style={[styles.advisorRole, { color: advisor.accentColor }]}>
                        {advisor.role}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.personalityBadge,
                        { backgroundColor: advisor.accentColor + '22' },
                      ]}
                    >
                      <Text style={[styles.personalityText, { color: advisor.accentColor }]}>
                        {advisor.personality}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.description}>{advisor.description}</Text>

                  {/* Specialty tags */}
                  <View style={styles.tags}>
                    {advisor.specialty.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* CTA Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedAdvisor || isLoading}
          style={styles.ctaWrapper}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={
              selected ? selected.gradient : ['#374151', '#374151']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaButton}
          >
            {isLoading ? (
              <Text style={styles.ctaText}>Chargement...</Text>
            ) : (
              <>
                <Text style={styles.ctaText}>
                  {selected
                    ? `Choisir ${selected.name}`
                    : 'Sélectionnez un coach'}
                </Text>
                {selected && (
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                )}
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.replace('MainTabs')}
        >
          <Text style={styles.skipText}>Passer cette étape</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingTop: 64,
    paddingBottom: 48,
    paddingHorizontal: 20,
  },

  // Header
  header: { marginBottom: 36 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  eyebrowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5CF6',
    letterSpacing: 2,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    lineHeight: 46,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    lineHeight: 22,
  },

  // Card
  card: {
    backgroundColor: '#161B27',
    borderRadius: 22,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2D3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  banner: {
    height: 155,
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 14,
  },
  bannerStats: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerImage: {
    position: 'absolute',
    right: 12,
    bottom: 0,
    width: 130,
    height: 145,
  },
  checkBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Card body
  cardBody: { padding: 18 },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  nameBlock: { flex: 1, marginRight: 10 },
  advisorName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  advisorRole: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  personalityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  personalityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 14,
  },
  tags: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag: {
    backgroundColor: '#2D3748',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBD5E1',
  },

  // CTA
  ctaWrapper: { marginTop: 8, marginBottom: 16 },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 19,
    borderRadius: 18,
    gap: 10,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Skip
  skipButton: { alignItems: 'center', paddingVertical: 12 },
  skipText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
});
