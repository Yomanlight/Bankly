import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../context/StatsContext';
import { useLanguage } from '../context/LanguageContext';
import BalanceModal from '../components/BalanceModal';
// import { AnimatedNumber, AnimatedPercentage } from '../components/AnimatedNumber';
// import StatCard from '../components/StatCard';
// import ProgressCard from '../components/ProgressCard';
// import PerformanceChart from '../components/PerformanceChart';

export default function DashboardScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, updateUserProfile } = useAuth();
  const { stats, calculateGrade, refreshStats } = useStats();
  const { t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const [balanceModalVisible, setBalanceModalVisible] = useState(false);

  const userScore = stats?.score || 0;
  const grade = calculateGrade(userScore);
  const scoreToNext = userScore >= 900 ? 1000 : (Math.ceil(userScore / 200) * 200);
  const progressToNext = ((userScore % 200) / 200) * 100;

  const accountBalance = user?.accountBalance || 0;
  const monthlyChange = +125.50;

  const courses = [
    { id: 1, title: t('dashboard.courses.budget'), progress: 75, duration: '2h 30min', icon: 'wallet-outline', color: '#8B5CF6', students: '12.5k' },
    { id: 2, title: t('dashboard.courses.stocks'), progress: 45, duration: '3h 15min', icon: 'trending-up-outline', color: '#3B82F6', students: '8.2k' },
    { id: 3, title: t('dashboard.courses.savings'), progress: 0, duration: '1h 45min', icon: 'cash-outline', color: '#10B981', students: '15k' },
  ];

  const games = [
    { id: 1, title: t('dashboard.games.quiz.title'), description: t('dashboard.games.quiz.description'), icon: 'help-circle-outline', color: '#EC4899', points: 50 },
    { id: 2, title: t('dashboard.games.budget.title'), description: t('dashboard.games.budget.description'), icon: 'game-controller-outline', color: '#06B6D4', points: 100 },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshStats();
    setRefreshing(false);
  };

  return (
    <LinearGradient colors={[colors.background, colors.backgroundSecondary]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{t('dashboard.greeting')}</Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || user?.displayName || user?.email?.split('@')[0] || t('dashboard.advisor')}
            </Text>
          </View>
          {user?.selectedAdvisor ? (
            <TouchableOpacity 
              style={styles.advisorBadge}
              onPress={() => navigation.navigate('Chat')}
              activeOpacity={0.7}
            >
              <Text style={styles.advisorText}>
                {user.selectedAdvisor === 'emma' ? '💼 Emma' : 
                 user.selectedAdvisor === 'alex' ? '💰 Alex' : 
                 user.selectedAdvisor === 'jules' ? '📈 Jules' : t('dashboard.advisor')}
              </Text>
              <Ionicons name="chatbubble-outline" size={16} color="#8B5CF6" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.advisorBadge}
              onPress={() => navigation.navigate('AdvisorSelection')}
              activeOpacity={0.7}
            >
              <Text style={styles.advisorText}>{t('dashboard.chooseAdvisor')}</Text>
              <Ionicons name="add-circle-outline" size={16} color="#8B5CF6" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          )}
        </View>

        {/* Score Card avec Grade */}
        <View style={styles.scoreCard}>
          <LinearGradient colors={grade.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.scoreGradient}>
            <View style={styles.scoreHeader}>
              <View>
                <Text style={styles.scoreLabel}>{t('dashboard.learningScore')}</Text>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreValue}>{userScore}</Text>
                  <View style={styles.gradeBadge}>
                    <Ionicons name={grade.icon} size={16} color="#FFFFFF" />
                    <Text style={styles.gradeText}>{grade.name}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressToNext}%` }]} />
              </View>
              <Text style={styles.progressText}>{scoreToNext - userScore} {t('dashboard.pointsToNext')}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Solde du Compte */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t('dashboard.accountBalance')}</Text>
          <View style={styles.balanceMainRow}>
            <View style={styles.balanceContent}>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceValue}>{accountBalance.toFixed(2)} €</Text>
                <View style={[styles.changeIndicator, monthlyChange >= 0 ? styles.changePositive : styles.changeNegative]}>
                  <Ionicons name={monthlyChange >= 0 ? 'trending-up' : 'trending-down'} size={12} color={monthlyChange >= 0 ? '#10B981' : '#EF4444'} />
                  <Text style={[styles.changeText, { color: monthlyChange >= 0 ? '#10B981' : '#EF4444' }]}>
                    {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(2)} €
                  </Text>
                </View>
              </View>
              <Text style={styles.balanceSubtitle}>{t('dashboard.thisMonth')}</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setBalanceModalVisible(true)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cours Disponibles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.popularCourses')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Courses')}>
              <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          {courses.map((course) => (
            <TouchableOpacity key={course.id} style={styles.courseCard} activeOpacity={0.7}>
              <View style={[styles.courseIcon, { backgroundColor: course.color + '20' }]}>
                <Ionicons name={course.icon} size={24} color={course.color} />
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <View style={styles.courseDetails}>
                  <View style={styles.courseDetailItem}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.courseDetailText}>{course.duration}</Text>
                  </View>
                  <View style={styles.courseDetailItem}>
                    <Ionicons name="people-outline" size={14} color="#6B7280" />
                    <Text style={styles.courseDetailText}>{course.students}</Text>
                  </View>
                </View>
                {course.progress > 0 && (
                  <View style={styles.courseProgressContainer}>
                    <View style={styles.courseProgressBar}>
                      <View style={[styles.courseProgressFill, { width: `${course.progress}%`, backgroundColor: course.color }]} />
                    </View>
                    <Text style={styles.courseProgressText}>{course.progress}%</Text>
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Jeux et Quiz */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.gamesQuiz')}</Text>
          </View>
          <View style={styles.gamesGrid}>
            {games.map((game) => (
              <TouchableOpacity 
                key={game.id} 
                style={styles.gameCard} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate(game.id === 1 ? 'QuizScreen' : 'BudgetGame')}
              >
                <View style={[styles.gameIcon, { backgroundColor: game.color + '20' }]}>
                  <Ionicons name={game.icon} size={32} color={game.color} />
                </View>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameDescription}>{game.description}</Text>
                <View style={styles.gamePoints}>
                  <Ionicons name="trophy-outline" size={14} color="#F59E0B" />
                  <Text style={styles.gamePointsText}>+{game.points} pts</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Balance Modal */}
      <BalanceModal
        visible={balanceModalVisible}
        onClose={() => setBalanceModalVisible(false)}
        currentBalance={accountBalance}
        onSave={async (newBalance) => {
          const result = await updateUserProfile({ accountBalance: newBalance });
          if (result.success) {
            Alert.alert(t('common.success'), t('dashboard.balanceUpdated'));
          } else {
            Alert.alert(t('common.error'), t('dashboard.balanceError'));
          }
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 24, 
    paddingTop: 60, 
    paddingBottom: 24 
  },
  greeting: { fontSize: 16, marginBottom: 4 },
  userName: { fontSize: 28, fontWeight: 'bold', letterSpacing: -1 },
  advisorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  advisorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  scoreCard: { marginHorizontal: 24, marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  scoreGradient: { padding: 20 },
  scoreHeader: { marginBottom: 16 },
  scoreLabel: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', opacity: 0.9, marginBottom: 8 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scoreValue: { fontSize: 48, fontWeight: '700', color: '#FFFFFF', letterSpacing: -2 },
  gradeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  gradeText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  progressContainer: { marginTop: 8 },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#FFFFFF', opacity: 0.9, marginTop: 8 },
  balanceCard: { marginHorizontal: 24, marginBottom: 24, backgroundColor: '#1F2937', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  balanceLabel: { fontSize: 14, fontWeight: '600', color: '#9CA3AF', marginBottom: 12 },
  balanceMainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceContent: { flex: 1 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  balanceValue: { fontSize: 32, fontWeight: '700', color: '#FFFFFF' },
  changeIndicator: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  changePositive: { backgroundColor: '#F0FDF4' },
  changeNegative: { backgroundColor: '#FEF2F2' },
  changeText: { fontSize: 13, fontWeight: '600' },
  balanceSubtitle: { fontSize: 13, color: '#9CA3AF' },
  addButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  seeAllText: { fontSize: 14, fontWeight: '600', color: '#8B5CF6' },
  courseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2937', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  courseIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  courseInfo: { flex: 1 },
  courseTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 6 },
  courseDetails: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  courseDetailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  courseDetailText: { fontSize: 13, color: '#9CA3AF' },
  courseProgressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  courseProgressBar: { flex: 1, height: 4, backgroundColor: '#374151', borderRadius: 2, overflow: 'hidden' },
  courseProgressFill: { height: '100%', borderRadius: 2 },
  courseProgressText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF', width: 36 },
  gamesGrid: { flexDirection: 'row', gap: 12 },
  gameCard: { flex: 1, backgroundColor: '#1F2937', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  gameIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  gameTitle: { fontSize: 15, fontWeight: '600', color: '#FFFFFF', textAlign: 'center', marginBottom: 4 },
  gameDescription: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginBottom: 12 },
  gamePoints: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  gamePointsText: { fontSize: 12, fontWeight: '600', color: '#F59E0B' },
});
