import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Dimensions, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import FloatingParticles from '../components/FloatingParticles';
import QuestionMultipleChoice from '../components/QuestionMultipleChoice';
import QuestionInput from '../components/QuestionInput';
import { QUESTIONNAIRE_DATA, calculateProfile, getSectionProgress } from '../data/questionnaireData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileQuestionnaireScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { email, password, name } = route.params || {};
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(null);

  const currentQuestion = QUESTIONNAIRE_DATA[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONNAIRE_DATA.length) * 100;
  const sectionProgress = getSectionProgress(answers);

  useEffect(() => {
    animateQuestionIn();
  }, [currentQuestionIndex]);

  // Créer le PanResponder pour les swipes
  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Détecter un swipe horizontal significatif
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Swipe vers la droite (suivant)
        if (gestureState.dx < -50 && gestureState.vx < -0.3) {
          handleNext();
        }
        // Swipe vers la gauche (précédent)
        else if (gestureState.dx > 50 && gestureState.vx > 0.3) {
          handlePrevious();
        }
      },
    });
  }, [currentQuestionIndex, answers]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const animateQuestionIn = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (currentQuestionIndex < QUESTIONNAIRE_DATA.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const profile = calculateProfile(answers);

    try {
      // Extraire le solde initial
      const initialBalance = parseFloat(answers['initial_balance']) || 0;

      // Sauvegarder le profil avec le solde initial
      await AsyncStorage.setItem('userProfile', JSON.stringify({
        answers,
        profile,
        initialBalance,
        completedAt: new Date().toISOString(),
      }));

      // Sauvegarder les infos utilisateur si elles existent
      if (email && password && name) {
        await AsyncStorage.setItem('userInfo', JSON.stringify({
          email,
          name,
          password, // En production, ne jamais stocker le password en clair!
        }));
      }

      // Naviguer vers l'écran de résultat avec le solde initial
      navigation.replace('ProfileResult', { profile, answers, initialBalance });
    } catch (error) {
      console.error('Erreur sauvegarde profil:', error);
      setIsLoading(false);
    }
  };

  const skipQuestion = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentQuestionIndex < QUESTIONNAIRE_DATA.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Check condition
  const shouldShowQuestion = () => {
    if (!currentQuestion.condition) return true;
    const conditionField = currentQuestion.condition.field;
    const conditionValue = currentQuestion.condition.value;
    return answers[conditionField] === conditionValue;
  };

  useEffect(() => {
    // Skip questions that don't meet conditions
    if (!shouldShowQuestion() && currentQuestionIndex < QUESTIONNAIRE_DATA.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, answers]);

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multipleChoice':
        return (
          <QuestionMultipleChoice
            question={currentQuestion.question}
            options={currentQuestion.options}
            selectedValue={answers[currentQuestion.id]}
            onSelect={handleAnswer}
          />
        );
      case 'input':
        return (
          <QuestionInput
            question={currentQuestion.question}
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.id] || ''}
            onChangeText={handleAnswer}
            keyboardType={currentQuestion.keyboardType}
          />
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={[colors.background, colors.backgroundSecondary]} style={styles.container}>
      {/* Particules en arrière-plan */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <FloatingParticles count={20} />
      </View>
      {/* Header */}
      <View style={[styles.header, { zIndex: 1 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            {currentQuestion.section} • Question {currentQuestionIndex + 1}/{QUESTIONNAIRE_DATA.length}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textMuted }]}>
          {Math.round(progress)}% complété
        </Text>
      </View>

      {/* Section Progress Dots */}
      <View style={styles.sectionDots}>
        {sectionProgress.map((section, idx) => {
          const isCurrent = currentQuestion.sectionNumber === section.number;
          const isCompleted = section.percentage > 0;
          
          return (
            <View key={idx} style={styles.sectionDot}>
              {isCurrent ? (
                <View style={{ 
                  width: 18, 
                  height: 18, 
                  borderRadius: 9,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}>
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.primary,
                  }} />
                </View>
              ) : (
                <View
                  style={[
                    styles.sectionDotCircle,
                    {
                      backgroundColor: isCompleted ? colors.primary : colors.border,
                      opacity: isCompleted ? 1 : 0.3,
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Question Content */}
      <Animated.View
        {...(panResponder.current?.panHandlers || {})}
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {renderQuestion()}
        </ScrollView>
      </Animated.View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        {currentQuestionIndex > 0 ? (
          <TouchableOpacity
            style={[styles.navButton, styles.secondaryButton, { borderColor: colors.border }]}
            onPress={handlePrevious}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
            <Text style={[styles.navButtonText, { color: colors.text }]}>Précédent</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {!currentQuestion.required && currentQuestionIndex < QUESTIONNAIRE_DATA.length - 1 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={skipQuestion}
          >
            <Text style={[styles.skipText, { color: colors.textMuted }]}>Passer</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.primaryButton,
            {
              backgroundColor: answers[currentQuestion.id] ? colors.primary : colors.border,
              opacity: answers[currentQuestion.id] ? 1 : 0.5,
            },
          ]}
          onPress={handleNext}
          disabled={!answers[currentQuestion.id] || isLoading}
        >
          <Text style={[styles.navButtonText, { color: '#FFFFFF' }]}>
            {currentQuestionIndex === QUESTIONNAIRE_DATA.length - 1 ? 'Terminer' : 'Suivant'}
          </Text>
          <Ionicons name={currentQuestionIndex === QUESTIONNAIRE_DATA.length - 1 ? 'checkmark' : 'arrow-forward'} size={20} color="#FFFFFF" />
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 16,
  },
  sectionDot: {
    alignItems: 'center',
  },
  sectionDotCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 30,
    gap: 8,
    backgroundColor: 'transparent',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    flex: 1,
    maxWidth: 140,
  },
  primaryButton: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
