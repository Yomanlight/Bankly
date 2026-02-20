import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const UserStatsContext = createContext({});

export const useUserStats = () => useContext(UserStatsContext);

export const UserStatsProvider = ({ children }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTimeSpent: 0, // en secondes
    coursesCompleted: 0,
    coursesInProgress: 0,
    quizzesTaken: 0,
    quizzesScore: 0,
    missionsCompleted: [],
    lastActiveDate: null,
    streakDays: 0,
    totalPoints: 0,
    level: 1,
    badges: [],
  });
  
  const [isTracking, setIsTracking] = useState(false);
  const sessionStartTime = useRef(null);
  const timeIntervalRef = useRef(null);

  // Listener Firestore pour synchroniser les stats
  useEffect(() => {
    if (!user?.uid) return;

    const statsDocRef = doc(db, 'userStats', user.uid);
    
    const unsubscribe = onSnapshot(statsDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setStats(docSnapshot.data());
      } else {
        // Initialiser les stats si elles n'existent pas
        const initialStats = {
          totalTimeSpent: 0,
          coursesCompleted: 0,
          coursesInProgress: 0,
          quizzesTaken: 0,
          quizzesScore: 0,
          missionsCompleted: [],
          lastActiveDate: new Date().toISOString(),
          streakDays: 1,
          totalPoints: 0,
          level: 1,
          badges: [],
          createdAt: new Date().toISOString(),
        };
        setStats(initialStats);
        setDoc(statsDocRef, initialStats).catch(err => {
          console.error('Error creating initial stats:', err);
        });
      }
    }, (error) => {
      console.error('Firestore stats listener error:', error);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Démarrer le tracking du temps
  const startTracking = () => {
    if (!isTracking && user?.uid) {
      setIsTracking(true);
      sessionStartTime.current = Date.now();
      
      // Sauvegarder toutes les 30 secondes
      timeIntervalRef.current = setInterval(() => {
        saveTimeSpent();
      }, 30000);
    }
  };

  // Arrêter le tracking du temps
  const stopTracking = () => {
    if (isTracking) {
      setIsTracking(false);
      saveTimeSpent();
      
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    }
  };

  // Sauvegarder le temps passé
  const saveTimeSpent = async () => {
    if (!user?.uid || !sessionStartTime.current) return;

    const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
    const newTotalTime = stats.totalTimeSpent + sessionDuration;

    try {
      await setDoc(doc(db, 'userStats', user.uid), {
        ...stats,
        totalTimeSpent: newTotalTime,
        lastActiveDate: new Date().toISOString(),
      }, { merge: true });

      sessionStartTime.current = Date.now();
    } catch (error) {
      console.error('Error saving time spent:', error);
    }
  };

  // Tracking automatique au montage/démontage
  useEffect(() => {
    startTracking();
    return () => stopTracking();
  }, [user?.uid]);

  // Mettre à jour une statistique
  const updateStats = async (updates) => {
    if (!user?.uid) return;

    try {
      const updatedStats = { ...stats, ...updates };
      
      await setDoc(doc(db, 'userStats', user.uid), updatedStats, { merge: true });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating stats:', error);
      return { success: false, error: error.message };
    }
  };

  // Compléter un cours
  const completeCourse = async (courseId) => {
    const newCoursesCompleted = stats.coursesCompleted + 1;
    const points = 100; // Points gagnés pour compléter un cours
    
    return updateStats({
      coursesCompleted: newCoursesCompleted,
      totalPoints: stats.totalPoints + points,
      level: Math.floor(newCoursesCompleted / 5) + 1, // Niveau basé sur les cours complétés
    });
  };

  // Compléter un quiz
  const completeQuiz = async (score) => {
    return updateStats({
      quizzesTaken: stats.quizzesTaken + 1,
      quizzesScore: stats.quizzesScore + score,
      totalPoints: stats.totalPoints + score,
    });
  };

  // Compléter une mission
  const completeMission = async (missionId) => {
    if (stats.missionsCompleted.includes(missionId)) {
      return { success: false, error: 'Mission already completed' };
    }

    const points = 50; // Points pour une mission
    
    return updateStats({
      missionsCompleted: [...stats.missionsCompleted, missionId],
      totalPoints: stats.totalPoints + points,
    });
  };

  // Ajouter un badge
  const addBadge = async (badge) => {
    if (stats.badges.some(b => b.id === badge.id)) {
      return { success: false, error: 'Badge already earned' };
    }

    return updateStats({
      badges: [...stats.badges, { ...badge, earnedAt: new Date().toISOString() }],
    });
  };

  // Calculer le streak
  const updateStreak = async () => {
    const lastActive = stats.lastActiveDate ? new Date(stats.lastActiveDate) : null;
    const today = new Date();
    
    if (!lastActive) {
      return updateStats({ streakDays: 1, lastActiveDate: today.toISOString() });
    }

    const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Streak continue
      return updateStats({ 
        streakDays: stats.streakDays + 1, 
        lastActiveDate: today.toISOString() 
      });
    } else if (daysDiff > 1) {
      // Streak cassé
      return updateStats({ 
        streakDays: 1, 
        lastActiveDate: today.toISOString() 
      });
    }
    
    return { success: true };
  };

  // Formater le temps passé
  const formatTimeSpent = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const value = {
    stats,
    updateStats,
    completeCourse,
    completeQuiz,
    completeMission,
    addBadge,
    updateStreak,
    formatTimeSpent,
    startTracking,
    stopTracking,
  };

  return (
    <UserStatsContext.Provider value={value}>
      {children}
    </UserStatsContext.Provider>
  );
};
