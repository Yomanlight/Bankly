import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStats } from '../context/StatsContext';

const INITIAL_BUDGET = 2000;
const TARGET_SAVINGS = 400; // 20% du budget

const EXPENSE_CATEGORIES = [
  { id: 'rent', name: 'Loyer', icon: 'home', minAmount: 600, maxAmount: 1000, essential: true },
  { id: 'food', name: 'Alimentation', icon: 'restaurant', minAmount: 200, maxAmount: 400, essential: true },
  { id: 'transport', name: 'Transport', icon: 'car', minAmount: 50, maxAmount: 200, essential: true },
  { id: 'utilities', name: 'Factures', icon: 'flash', minAmount: 100, maxAmount: 150, essential: true },
  { id: 'entertainment', name: 'Loisirs', icon: 'game-controller', minAmount: 0, maxAmount: 300, essential: false },
  { id: 'shopping', name: 'Shopping', icon: 'cart', minAmount: 0, maxAmount: 300, essential: false },
  { id: 'health', name: 'Santé', icon: 'medical', minAmount: 50, maxAmount: 150, essential: true },
  { id: 'subscriptions', name: 'Abonnements', icon: 'tv', minAmount: 0, maxAmount: 100, essential: false },
];

export default function BudgetGameScreen({ navigation }) {
  const { addActivity, updateStreak } = useStats();
  const [expenses, setExpenses] = useState({});
  const [gamePhase, setGamePhase] = useState('setup'); // setup, result

  const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + (val || 0), 0);
  const remaining = INITIAL_BUDGET - totalExpenses;
  const savings = remaining > 0 ? remaining : 0;

  const handleExpenseChange = (categoryId, amount) => {
    setExpenses({
      ...expenses,
      [categoryId]: amount,
    });
  };

  const incrementExpense = (categoryId, step) => {
    const current = expenses[categoryId] || 0;
    const category = EXPENSE_CATEGORIES.find(c => c.id === categoryId);
    const newAmount = Math.max(0, Math.min(category.maxAmount, current + step));
    handleExpenseChange(categoryId, newAmount);
  };

  const calculateScore = () => {
    let score = 0;
    
    // Points pour les dépenses essentielles dans la fourchette
    EXPENSE_CATEGORIES.filter(c => c.essential).forEach(category => {
      const amount = expenses[category.id] || 0;
      if (amount >= category.minAmount && amount <= category.maxAmount) {
        score += 20;
      }
    });

    // Points pour l'épargne
    if (savings >= TARGET_SAVINGS) {
      score += 40;
    } else {
      score += Math.floor((savings / TARGET_SAVINGS) * 40);
    }

    return Math.min(100, score);
  };

  const handleValidate = async () => {
    const score = calculateScore();
    const rating = getRating(score);
    
    // Enregistrer l'activité dans Firebase
    await addActivity({
      type: 'game_played',
      title: 'Défi Budget complété',
      description: `Score : ${score}/100 - ${rating.text}`,
      icon: 'game-controller',
      color: '#06B6D4',
      points: score,
    });

    // Mettre à jour la série
    await updateStreak();
    
    setGamePhase('result');
  };

  const getRating = (score) => {
    if (score >= 90) return { emoji: '🏆', text: 'Expert', color: '#F59E0B' };
    if (score >= 70) return { emoji: '⭐', text: 'Très Bien', color: '#8B5CF6' };
    if (score >= 50) return { emoji: '👍', text: 'Bien', color: '#3B82F6' };
    return { emoji: '💪', text: 'À améliorer', color: '#10B981' };
  };

  if (gamePhase === 'result') {
    const score = calculateScore();
    const rating = getRating(score);
    
    return (
      <View style={styles.container}>
        <LinearGradient colors={[rating.color, '#8B5CF6']} style={styles.resultContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButtonTop}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.resultEmoji}>{rating.emoji}</Text>
          <Text style={styles.resultTitle}>{rating.text}</Text>
          <Text style={styles.resultScore}>{score} / 100 points</Text>
          
          <View style={styles.resultStats}>
            <View style={styles.resultStat}>
              <Text style={styles.resultStatValue}>{totalExpenses} €</Text>
              <Text style={styles.resultStatLabel}>Dépenses</Text>
            </View>
            <View style={styles.resultStat}>
              <Text style={styles.resultStatValue}>{savings} €</Text>
              <Text style={styles.resultStatLabel}>Épargne</Text>
            </View>
            <View style={styles.resultStat}>
              <Text style={styles.resultStatValue}>{Math.round((savings/INITIAL_BUDGET)*100)}%</Text>
              <Text style={styles.resultStatLabel}>Taux</Text>
            </View>
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Conseils</Text>
            {savings < TARGET_SAVINGS && (
              <Text style={styles.tipText}>• Essayez d'épargner au moins 20% de vos revenus</Text>
            )}
            <Text style={styles.tipText}>• Priorisez les dépenses essentielles</Text>
            <Text style={styles.tipText}>• Limitez les dépenses non essentielles</Text>
          </View>

          <View style={styles.resultButtons}>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => {
                setExpenses({});
                setGamePhase('setup');
              }}
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButtonResult} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>Dashboard</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#1F2937']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Défi Budget</Text>
            <Text style={styles.headerSubtitle}>Gérez {INITIAL_BUDGET}€ de revenus</Text>
          </View>
        </View>

        <View style={styles.budgetSummary}>
          <View style={styles.budgetRow}>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Budget</Text>
              <Text style={styles.budgetValue}>{INITIAL_BUDGET} €</Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Dépenses</Text>
              <Text style={[styles.budgetValue, { color: '#EF4444' }]}>{totalExpenses} €</Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Reste</Text>
              <Text style={[styles.budgetValue, { color: remaining < 0 ? '#EF4444' : '#10B981' }]}>
                {remaining} €
              </Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {EXPENSE_CATEGORIES.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIcon}>
                  <Ionicons name={category.icon} size={24} color="#8B5CF6" />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryRange}>
                    {category.essential ? 'Essentiel' : 'Optionnel'} · {category.minAmount}-{category.maxAmount}€
                  </Text>
                </View>
                <Text style={styles.categoryAmount}>{expenses[category.id] || 0} €</Text>
              </View>
              
              <View style={styles.controls}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => incrementExpense(category.id, -50)}
                >
                  <Ionicons name="remove" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                
                <View style={styles.sliderContainer}>
                  <View style={styles.sliderTrack}>
                    <View 
                      style={[
                        styles.sliderFill, 
                        { width: `${((expenses[category.id] || 0) / category.maxAmount) * 100}%` }
                      ]} 
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => incrementExpense(category.id, 50)}
                >
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity 
            style={[styles.validateButton, remaining < 0 && styles.validateButtonDisabled]} 
            onPress={handleValidate}
            disabled={remaining < 0}
          >
            <Text style={styles.validateButtonText}>
              {remaining < 0 ? 'Budget dépassé !' : 'Valider mon Budget'}
            </Text>
            {remaining >= 0 && <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />}
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    gap: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonTop: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  budgetSummary: {
    marginHorizontal: 24,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetItem: {
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  categoryCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  categoryRange: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    flex: 1,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  validateButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  validateButtonDisabled: {
    backgroundColor: '#EF4444',
  },
  validateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 32,
  },
  resultStats: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 32,
  },
  resultStat: {
    alignItems: 'center',
  },
  resultStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  resultStatLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tipsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    lineHeight: 20,
  },
  resultButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  backButtonResult: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
