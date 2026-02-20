import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
  Image, Animated, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../context/UserStatsContext';
import { sendMessageToOpenAI, getConversationStarters } from '../services/openai';

const ADVISOR_INFO = {
  emma: {
    name: 'Emma',
    role: 'Experte en Investissement',
    gradient: ['#8B5CF6', '#EC4899'],
    accentColor: '#8B5CF6',
    image: require('../assets/advisors/emma.png'),
    welcomeMessage:
      "Bonjour ! Je suis Emma, votre experte en investissement. Je suis là pour vous aider à développer votre patrimoine avec des stratégies adaptées à votre profil. Comment puis-je vous aider aujourd'hui ?",
  },
  alex: {
    name: 'Alex',
    role: 'Coach Budgétaire',
    gradient: ['#3B82F6', '#06B6D4'],
    accentColor: '#3B82F6',
    image: require('../assets/advisors/alex.png'),
    welcomeMessage:
      "Salut ! Moi c'est Alex, votre coach budgétaire personnel. Je suis là pour vous aider à mieux gérer vos finances au quotidien et atteindre vos objectifs d'épargne. Par quoi commençons-nous ?",
  },
  jules: {
    name: 'Jules',
    role: 'Planificateur Financier',
    gradient: ['#10B981', '#84CC16'],
    accentColor: '#10B981',
    image: require('../assets/advisors/jules.png'),
    welcomeMessage:
      "Bonjour ! Je suis Jules, votre planificateur financier. Mon rôle est de vous guider étape par étape vers vos objectifs financiers avec une approche structurée. Quels sont vos projets ?",
  },
};

/* ─── Animated typing dots ─── */
function TypingDots({ color }) {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600 - i * 150),
        ])
      )
    );
    const parallel = Animated.parallel(animations);
    parallel.start();
    return () => parallel.stop();
  }, []);

  return (
    <View style={typingStyles.row}>
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={[typingStyles.dot, { backgroundColor: color, transform: [{ translateY: dot }] }]}
        />
      ))}
    </View>
  );
}

const typingStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 4, paddingVertical: 2 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

/* ─── Timestamp helper ─── */
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ─── Main Screen ─── */
export default function ChatScreen({ navigation }) {
  const { user } = useAuth();
  const { stats } = useUserStats();
  const scrollViewRef = useRef();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const advisor = ADVISOR_INFO[user?.selectedAdvisor] || ADVISOR_INFO.emma;
  const suggestions = getConversationStarters(user?.selectedAdvisor || 'emma');

  const userData = {
    accountBalance: user?.accountBalance || 0,
    investorProfile: user?.investorProfile || 'non défini',
    totalPoints: stats?.totalPoints || 0,
    level: stats?.level || 1,
    coursesCompleted: stats?.coursesCompleted || 0,
    streakDays: stats?.streakDays || 0,
  };

  useEffect(() => {
    setMessages([
      { id: 1, text: advisor.welcomeMessage, isUser: false, timestamp: new Date() },
    ]);
  }, []);

  const handleSend = async (messageText = null) => {
    const textToSend = messageText || message;
    if (!textToSend.trim() || isLoading) return;

    setShowSuggestions(false);

    const userMessage = { id: Date.now(), text: textToSend, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    const newHistory = [...conversationHistory, { role: 'user', content: textToSend }];
    setConversationHistory(newHistory);

    try {
      const aiResponse = await sendMessageToOpenAI(
        newHistory,
        user?.selectedAdvisor || 'emma',
        user?.name || user?.displayName || '',
        userData
      );

      const botResponse = { id: Date.now() + 1, text: aiResponse, isUser: false, timestamp: new Date() };
      setMessages(prev => [...prev, botResponse]);
      setConversationHistory([...newHistory, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);

      const errorMsg = {
        id: Date.now() + 1,
        text: `Désolé, ${error.message}. En attendant, n'hésitez pas à explorer nos modules de formation.`,
        isUser: false,
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);

      if (error.message.includes('Configuration')) {
        Alert.alert(
          'Configuration requise',
          "La clé API OpenAI doit être configurée dans services/openai.js pour utiliser l'IA conversationnelle.",
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.avatarWrap}>
            <Image source={advisor.image} style={styles.avatarImage} resizeMode="cover" />
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{advisor.name}</Text>
            <Text style={[styles.headerRole, { color: advisor.accentColor }]}>{advisor.role}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Gradient accent line */}
      <LinearGradient
        colors={advisor.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accentLine}
      />

      {/* ── Chat area ── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.flex}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, index) => (
            <View key={msg.id}>
              {/* Message bubble */}
              <View style={[styles.row, msg.isUser ? styles.rowRight : styles.rowLeft]}>
                {/* Advisor mini avatar */}
                {!msg.isUser && (
                  <Image source={advisor.image} style={styles.miniAvatar} resizeMode="cover" />
                )}

                <View style={styles.bubbleWrapper}>
                  {msg.isUser ? (
                    <LinearGradient
                      colors={['#7C3AED', '#8B5CF6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[styles.bubble, styles.userBubble]}
                    >
                      <Text style={styles.userText}>{msg.text}</Text>
                    </LinearGradient>
                  ) : (
                    <View
                      style={[
                        styles.bubble,
                        styles.advisorBubble,
                        { borderLeftColor: advisor.accentColor },
                        msg.isError && styles.errorBubble,
                      ]}
                    >
                      <Text style={styles.advisorText}>{msg.text}</Text>
                    </View>
                  )}
                  <Text style={[styles.timestamp, msg.isUser && styles.timestampRight]}>
                    {formatTime(msg.timestamp)}
                  </Text>
                </View>
              </View>

              {/* Horizontal suggestion chips after welcome */}
              {index === 0 && !msg.isUser && showSuggestions && (
                <View style={styles.chipsSection}>
                  <Text style={styles.chipsLabel}>Questions suggérées</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                    {suggestions.map((s, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.chip, { borderColor: advisor.accentColor + '55' }]}
                        onPress={() => handleSend(s)}
                        disabled={isLoading}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.chipText, { color: advisor.accentColor }]}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <View style={[styles.row, styles.rowLeft]}>
              <Image source={advisor.image} style={styles.miniAvatar} resizeMode="cover" />
              <View style={[styles.bubble, styles.advisorBubble, { borderLeftColor: advisor.accentColor }]}>
                <TypingDots color={advisor.accentColor} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* ── Input bar ── */}
        <View style={styles.inputBar}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder={`Demandez à ${advisor.name}...`}
              placeholderTextColor="#6B7280"
              multiline
              maxLength={500}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={!message.trim() || isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={message.trim() && !isLoading ? advisor.gradient : ['#374151', '#374151']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendBtn}
              >
                <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 58,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: '#0F1117',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2330',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1E2330',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    position: 'relative',
    backgroundColor: '#1E2330',
    overflow: 'visible',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#0F1117',
  },
  headerText: { flex: 1 },
  headerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  headerRole: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  moreBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1E2330',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Accent line */
  accentLine: {
    height: 2,
  },

  /* Messages */
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },

  miniAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    backgroundColor: '#1E2330',
  },

  bubbleWrapper: { maxWidth: '78%' },

  bubble: {
    borderRadius: 18,
    paddingVertical: 11,
    paddingHorizontal: 15,
  },
  userBubble: {
    borderBottomRightRadius: 5,
  },
  advisorBubble: {
    backgroundColor: '#161B27',
    borderBottomLeftRadius: 5,
    borderLeftWidth: 3,
  },
  errorBubble: {
    backgroundColor: '#2D1515',
    borderLeftColor: '#EF4444',
  },

  userText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    fontWeight: '500',
  },
  advisorText: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 22,
  },

  timestamp: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 4,
    marginLeft: 4,
  },
  timestampRight: {
    textAlign: 'right',
    marginRight: 4,
  },

  /* Suggestion chips */
  chipsSection: {
    marginBottom: 16,
    marginLeft: 38,
  },
  chipsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    backgroundColor: '#161B27',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    maxWidth: 220,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },

  /* Input bar */
  inputBar: {
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    backgroundColor: '#0F1117',
    borderTopWidth: 1,
    borderTopColor: '#1E2330',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#161B27',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2D3748',
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#E5E7EB',
    maxHeight: 110,
    paddingVertical: 8,
    lineHeight: 22,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
