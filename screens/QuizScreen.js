import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../context/StatsContext';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Qu'est-ce que la règle du 50/30/20 pour gérer son budget ?",
    options: [
      "50% épargne, 30% besoins, 20% loisirs",
      "50% besoins, 30% loisirs, 20% épargne",
      "50% loisirs, 30% épargne, 20% besoins",
      "50% investissement, 30% épargne, 20% dépenses"
    ],
    correctAnswer: 1,
    explanation: "La règle 50/30/20 recommande : 50% pour les besoins essentiels, 30% pour les envies/loisirs, et 20% pour l'épargne."
  },
  {
    id: 2,
    question: "Quel est le meilleur moment pour commencer à investir ?",
    options: [
      "Après 40 ans",
      "Le plus tôt possible",
      "Quand on a 100 000€",
      "Jamais, c'est trop risqué"
    ],
    correctAnswer: 1,
    explanation: "Plus vous commencez tôt, plus votre argent a le temps de fructifier grâce aux intérêts composés."
  },
  {
    id: 3,
    question: "Qu'est-ce qu'un fonds d'urgence ?",
    options: [
      "De l'argent pour les vacances",
      "3 à 6 mois de dépenses de côté",
      "Un crédit disponible",
      "L'argent des impôts"
    ],
    correctAnswer: 1,
    explanation: "Un fonds d'urgence représente 3 à 6 mois de dépenses courantes, accessible rapidement en cas de problème."
  },
  {
    id: 4,
    question: "Quelle est la différence entre un actif et un passif ?",
    options: [
      "Pas de différence",
      "Un actif rapporte de l'argent, un passif en coûte",
      "Un actif coûte de l'argent, un passif en rapporte",
      "Les deux rapportent de l'argent"
    ],
    correctAnswer: 1,
    explanation: "Un actif met de l'argent dans votre poche (investissements, bien loué...), un passif en retire (crédit, voiture...)."
  },
  {
    id: 5,
    question: "Quel est le taux d'intérêt moyen du Livret A en 2024 ?",
    options: [
      "1%",
      "2%",
      "3%",
      "5%"
    ],
    correctAnswer: 2,
    explanation: "Le Livret A offre un taux de 3% depuis août 2023, ce qui reste modeste face à l'inflation."
  }
];

export default function QuizScreen({ navigation }) {
  const { user } = useAuth();
  const { addActivity, updateStreak } = useStats();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleAnswer = (index) => {
    if (showExplanation) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === question.correctAnswer) {
      setScore(score + 10);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      
      // Ajouter l'activité dans Firebase
      await addActivity({
        type: 'quiz_passed',
        title: 'Quiz Finance réussi',
        description: `Score : ${score}/${QUIZ_QUESTIONS.length * 10} points`,
        icon: 'trophy',
        color: '#F59E0B',
        points: score,
      });

      // Mettre à jour la série
      await updateStreak();
      
      Alert.alert(
        '🎉 Quiz Terminé !',
        `Vous avez gagné ${score} points !`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  if (quizCompleted) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#EC4899', '#8B5CF6']} style={styles.resultContainer}>
          <Ionicons name="trophy" size={80} color="#FFFFFF" />
          <Text style={styles.resultTitle}>Bravo !</Text>
          <Text style={styles.resultScore}>{score} / {QUIZ_QUESTIONS.length * 10} points</Text>
          <Text style={styles.resultText}>
            Vous avez répondu correctement à {score / 10} sur {QUIZ_QUESTIONS.length} questions !
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Retour au Dashboard</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#1F2937']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              Question {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
            </Text>
            <Text style={styles.scoreText}>Score : {score} pts</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }]} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Question */}
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{question.question}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && (index === question.correctAnswer ? styles.correctOption : styles.wrongOption),
                  showExplanation && index === question.correctAnswer && styles.correctOption,
                ]}
                onPress={() => handleAnswer(index)}
                disabled={showExplanation}
              >
                <View style={styles.optionContent}>
                  <View style={[styles.optionCircle, selectedAnswer === index && styles.selectedCircle]}>
                    {showExplanation && index === question.correctAnswer && (
                      <Ionicons name="checkmark" size={20} color="#10B981" />
                    )}
                    {showExplanation && selectedAnswer === index && index !== question.correctAnswer && (
                      <Ionicons name="close" size={20} color="#EF4444" />
                    )}
                  </View>
                  <Text style={[styles.optionText, selectedAnswer === index && styles.selectedOptionText]}>
                    {option}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Explanation */}
          {showExplanation && (
            <View style={styles.explanationCard}>
              <View style={styles.explanationHeader}>
                <Ionicons 
                  name={selectedAnswer === question.correctAnswer ? "checkmark-circle" : "information-circle"} 
                  size={24} 
                  color={selectedAnswer === question.correctAnswer ? "#10B981" : "#8B5CF6"} 
                />
                <Text style={styles.explanationTitle}>
                  {selectedAnswer === question.correctAnswer ? "Bonne réponse !" : "Explications"}
                </Text>
              </View>
              <Text style={styles.explanationText}>{question.explanation}</Text>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Question Suivante' : 'Voir le Résultat'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressInfo: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#374151',
    marginHorizontal: 24,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  content: {
    padding: 24,
  },
  questionCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#374151',
  },
  correctOption: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  wrongOption: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#6B7280',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    borderColor: '#8B5CF6',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#E5E7EB',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  explanationCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  explanationText: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 22,
    marginBottom: 20,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  resultText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
