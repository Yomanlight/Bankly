import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function LessonDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);

  // Données du cours - Budget personnel
  const lesson = {
    id: 1,
    title: 'Budget Personnel',
    description: 'Apprenez à créer et gérer votre budget mensuel efficacement',
    duration: '45 min',
    level: 'Débutant',
    modules: [
      {
        id: 1,
        title: 'Introduction au budget',
        duration: '10 min',
        content: `Un budget personnel est un outil essentiel pour gérer vos finances. Il vous permet de :

• Suivre vos revenus et dépenses
• Identifier les économies potentielles
• Atteindre vos objectifs financiers
• Éviter les dettes inutiles

La règle 50/30/20 :
• 50% pour les besoins essentiels (logement, nourriture)
• 30% pour les envies (loisirs, sorties)
• 20% pour l'épargne et le remboursement de dettes`,
        keyPoints: [
          'Un budget vous donne le contrôle de vos finances',
          'La règle 50/30/20 est un bon point de départ',
          'Révisez votre budget mensuellement',
        ],
      },
      {
        id: 2,
        title: 'Créer son premier budget',
        duration: '15 min',
        content: `Étapes pour créer votre budget :

1. Listez tous vos revenus mensuels
   - Salaire net
   - Revenus complémentaires
   - Aides ou allocations

2. Identifiez vos dépenses fixes
   - Loyer/prêt immobilier
   - Assurances
   - Abonnements
   - Factures récurrentes

3. Estimez vos dépenses variables
   - Alimentation
   - Transport
   - Loisirs
   - Imprévus

4. Calculez la différence
   Revenus - Dépenses = Capacité d'épargne`,
        keyPoints: [
          'Soyez réaliste avec vos estimations',
          'N\'oubliez pas les dépenses annuelles',
          'Prévoyez un fonds d\'urgence',
        ],
      },
      {
        id: 3,
        title: 'Suivre et ajuster',
        duration: '10 min',
        content: `Le suivi est crucial pour la réussite :

📱 Utilisez des applications :
• Gestionnaires de budget
• Notifications de dépenses
• Rapports mensuels automatiques

📊 Analysez vos habitudes :
• Où va vraiment votre argent ?
• Quelles dépenses sont évitables ?
• Comment optimiser vos achats ?

🎯 Ajustez régulièrement :
• Chaque mois, comparez prévu vs réel
• Identifiez les écarts
• Adaptez vos catégories si nécessaire`,
        keyPoints: [
          'Le suivi régulier est la clé du succès',
          'Soyez flexible et ajustez votre budget',
          'Célébrez vos victoires financières',
        ],
      },
      {
        id: 4,
        title: 'Exercice pratique',
        duration: '10 min',
        content: `Mise en pratique :

✏️ À faire maintenant :
1. Téléchargez l'outil de budget
2. Entrez vos revenus du mois dernier
3. Listez toutes vos dépenses
4. Catégorisez chaque dépense
5. Identifiez 3 postes à optimiser

💡 Conseil du pro :
Gardez tous vos reçus pendant un mois pour avoir une vision complète de vos dépenses réelles.

🎓 Quiz final :
Testez vos connaissances avec notre quiz de 5 questions pour valider ce module.`,
        keyPoints: [
          'La pratique rend parfait',
          'Commencez petit, pensez grand',
          'Demandez de l\'aide si nécessaire',
        ],
      },
    ],
  };

  const currentModuleData = lesson.modules[currentModule];
  const progress = ((completedModules.length / lesson.modules.length) * 100).toFixed(0);

  const handleCompleteModule = () => {
    if (!completedModules.includes(currentModule)) {
      setCompletedModules([...completedModules, currentModule]);
    }
    if (currentModule < lesson.modules.length - 1) {
      setCurrentModule(currentModule + 1);
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {lesson.title}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            Module {currentModule + 1}/{lesson.modules.length}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: colors.text }]}>Progression</Text>
            <Text style={[styles.progressPercent, { color: colors.primary }]}>{progress}%</Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View 
              style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} 
            />
          </View>
        </View>

        {/* Module Navigation */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.modulesScroll}
          contentContainerStyle={styles.modulesContainer}
        >
          {lesson.modules.map((module, index) => (
            <TouchableOpacity
              key={module.id}
              style={[
                styles.moduleChip,
                { 
                  backgroundColor: currentModule === index ? colors.primary : colors.card,
                  borderColor: completedModules.includes(index) ? colors.success : colors.border,
                }
              ]}
              onPress={() => setCurrentModule(index)}
            >
              {completedModules.includes(index) && (
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              )}
              <Text style={[
                styles.moduleChipText,
                { color: currentModule === index ? colors.text : colors.textSecondary }
              ]}>
                {index + 1}. {module.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Module Content */}
        <View style={styles.content}>
          <View style={[styles.moduleHeader, { backgroundColor: colors.card }]}>
            <View>
              <Text style={[styles.moduleTitle, { color: colors.text }]}>
                {currentModuleData.title}
              </Text>
              <View style={styles.moduleMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>
                    {currentModuleData.duration}
                  </Text>
                </View>
              </View>
            </View>
            {completedModules.includes(currentModule) && (
              <Ionicons name="checkmark-circle" size={32} color={colors.success} />
            )}
          </View>

          <View style={[styles.contentCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.contentText, { color: colors.text }]}>
              {currentModuleData.content}
            </Text>
          </View>

          {/* Key Points */}
          <View style={[styles.keyPointsCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
            <Text style={[styles.keyPointsTitle, { color: colors.text }]}>
              📌 Points clés à retenir
            </Text>
            {currentModuleData.keyPoints.map((point, index) => (
              <View key={index} style={styles.keyPointItem}>
                <View style={[styles.keyPointBullet, { backgroundColor: colors.primary }]} />
                <Text style={[styles.keyPointText, { color: colors.text }]}>
                  {point}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.prevButton, { backgroundColor: colors.backgroundSecondary }]}
          onPress={() => currentModule > 0 && setCurrentModule(currentModule - 1)}
          disabled={currentModule === 0}
        >
          <Ionicons 
            name="chevron-back" 
            size={20} 
            color={currentModule === 0 ? colors.textMuted : colors.text} 
          />
          <Text style={[
            styles.prevButtonText,
            { color: currentModule === 0 ? colors.textMuted : colors.text }
          ]}>
            Précédent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={handleCompleteModule}
        >
          <Text style={styles.nextButtonText}>
            {currentModule === lesson.modules.length - 1 ? 'Terminer' : 'Suivant'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  progressSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  modulesScroll: {
    marginBottom: 20,
  },
  modulesContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  moduleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  moduleChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 24,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  moduleMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  contentCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 24,
  },
  keyPointsCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  keyPointsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  keyPointBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  keyPointText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  prevButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  prevButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
