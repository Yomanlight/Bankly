import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/Input';

export default function BudgetCalculatorScreen({ navigation }) {
  const { colors } = useTheme();
  
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState({
    housing: '',
    food: '',
    transport: '',
    entertainment: '',
    savings: '',
    other: '',
  });
  
  const [showResults, setShowResults] = useState(false);

  const calculateBudget = () => {
    const totalIncome = parseFloat(income) || 0;
    const totalExpenses = Object.values(expenses).reduce(
      (sum, val) => sum + (parseFloat(val) || 0),
      0
    );
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((parseFloat(expenses.savings) || 0) / totalIncome) * 100 : 0;
    
    return {
      totalIncome,
      totalExpenses,
      balance,
      savingsRate: savingsRate.toFixed(1),
    };
  };

  const results = calculateBudget();
  
  const expenseCategories = [
    { key: 'housing', label: 'Logement (loyer, charges)', icon: 'home', recommended: 30 },
    { key: 'food', label: 'Alimentation', icon: 'fast-food', recommended: 15 },
    { key: 'transport', label: 'Transport', icon: 'car', recommended: 15 },
    { key: 'entertainment', label: 'Loisirs', icon: 'game-controller', recommended: 10 },
    { key: 'savings', label: 'Épargne', icon: 'wallet', recommended: 20 },
    { key: 'other', label: 'Autres', icon: 'ellipsis-horizontal', recommended: 10 },
  ];

  const handleCalculate = () => {
    setShowResults(true);
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Calculateur de Budget</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Calculez votre budget mensuel et découvrez comment optimiser vos finances
          </Text>
        </View>

        {/* Income Input */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Revenus mensuels</Text>
          <Input
            placeholder="2500"
            value={income}
            onChangeText={setIncome}
            keyboardType="numeric"
            icon="cash"
          />
        </View>

        {/* Expenses Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Dépenses mensuelles</Text>
          {expenseCategories.map((category) => (
            <View key={category.key} style={styles.expenseItem}>
              <View style={styles.expenseHeader}>
                <View style={styles.expenseLabel}>
                  <Ionicons name={category.icon} size={20} color={colors.primary} />
                  <Text style={[styles.expenseLabelText, { color: colors.text }]}>
                    {category.label}
                  </Text>
                </View>
                <Text style={[styles.recommendedText, { color: colors.textMuted }]}>
                  Recommandé: {category.recommended}%
                </Text>
              </View>
              <Input
                placeholder="0"
                value={expenses[category.key]}
                onChangeText={(value) => setExpenses({ ...expenses, [category.key]: value })}
                keyboardType="numeric"
              />
            </View>
          ))}
        </View>

        {/* Calculate Button */}
        <TouchableOpacity
          style={[styles.calculateButton, { backgroundColor: colors.primary }]}
          onPress={handleCalculate}
        >
          <Text style={styles.calculateButtonText}>Calculer mon budget</Text>
        </TouchableOpacity>

        {/* Results */}
        {showResults && (
          <View style={styles.resultsSection}>
            <Text style={[styles.resultsTitle, { color: colors.text }]}>Résultats</Text>
            
            {/* Summary Cards */}
            <View style={styles.summaryGrid}>
              <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
                <Ionicons name="trending-up" size={24} color={colors.success} />
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {results.totalIncome.toFixed(2)}€
                </Text>
                <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
                  Revenus
                </Text>
              </View>
              
              <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
                <Ionicons name="trending-down" size={24} color={colors.error} />
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {results.totalExpenses.toFixed(2)}€
                </Text>
                <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
                  Dépenses
                </Text>
              </View>
            </View>

            {/* Balance Card */}
            <View style={[styles.balanceCard, { backgroundColor: results.balance >= 0 ? colors.success + '20' : colors.error + '20' }]}>
              <View style={styles.balanceHeader}>
                <Text style={[styles.balanceLabel, { color: colors.text }]}>Balance</Text>
                <Ionicons 
                  name={results.balance >= 0 ? 'checkmark-circle' : 'alert-circle'} 
                  size={32} 
                  color={results.balance >= 0 ? colors.success : colors.error} 
                />
              </View>
              <Text style={[styles.balanceValue, { color: results.balance >= 0 ? colors.success : colors.error }]}>
                {results.balance >= 0 ? '+' : ''}{results.balance.toFixed(2)}€
              </Text>
              <Text style={[styles.balanceDescription, { color: colors.textSecondary }]}>
                {results.balance >= 0 
                  ? 'Excellent ! Vous épargnez ' + Math.abs(results.balance).toFixed(2) + '€ par mois'
                  : 'Attention ! Vous dépensez ' + Math.abs(results.balance).toFixed(2) + '€ de plus que vos revenus'
                }
              </Text>
            </View>

            {/* Savings Rate */}
            <View style={[styles.savingsCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.savingsLabel, { color: colors.text }]}>Taux d'épargne</Text>
              <Text style={[styles.savingsValue, { color: colors.primary }]}>
                {results.savingsRate}%
              </Text>
              <Text style={[styles.savingsDescription, { color: colors.textMuted }]}>
                {parseFloat(results.savingsRate) >= 20 
                  ? '🎉 Excellent ! L\'idéal est de 20%' 
                  : '💡 Essayez d\'atteindre 20% d\'épargne'}
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  expenseItem: {
    marginBottom: 16,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expenseLabelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recommendedText: {
    fontSize: 12,
  },
  calculateButton: {
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    paddingHorizontal: 24,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  balanceCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balanceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  savingsCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  savingsLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  savingsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  savingsDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
});
