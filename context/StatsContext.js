import React, { createContext, useState, useContext, useEffect } from 'react';
import { doc, setDoc, getDoc, collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const StatsContext = createContext({});

export const useStats = () => useContext(StatsContext);

export const StatsProvider = ({ children }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    score: 0,
    grade: 'Débutant',
    totalPoints: 0,
    coursesCompleted: 0,
    quizzesPassed: 0,
    gamesPlayed: 0,
    currentStreak: 0,
    totalMinutes: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les stats de l'utilisateur
  useEffect(() => {
    if (user?.uid) {
      loadUserStats();
      loadUserActivities();
    }
  }, [user?.uid]);

  const loadUserStats = async () => {
    if (!user?.uid) return;

    try {
      const statsDoc = await getDoc(doc(db, 'userStats', user.uid));
      
      if (statsDoc.exists()) {
        setStats(statsDoc.data());
      } else {
        // Créer des stats initiales
        const initialStats = {
          score: 0,
          grade: 'Débutant',
          totalPoints: 0,
          coursesCompleted: 0,
          quizzesPassed: 0,
          gamesPlayed: 0,
          currentStreak: 0,
          totalMinutes: 0,
          lastActivityDate: new Date().toISOString(),
        };
        await setDoc(doc(db, 'userStats', user.uid), initialStats);
        setStats(initialStats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserActivities = async () => {
    if (!user?.uid) return;

    try {
      const activitiesRef = collection(db, 'userActivities', user.uid, 'activities');
      const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(20));
      const snapshot = await getDocs(q);
      
      const activitiesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setActivities(activitiesList);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  // Calculer le grade basé sur le score
  const calculateGrade = (score) => {
    if (score >= 900) return { name: 'Expert', icon: 'trophy', color: '#F59E0B', gradient: ['#F59E0B', '#EF4444'] };
    if (score >= 700) return { name: 'Avancé', icon: 'star', color: '#8B5CF6', gradient: ['#8B5CF6', '#EC4899'] };
    if (score >= 500) return { name: 'Intermédiaire', icon: 'trending-up', color: '#3B82F6', gradient: ['#3B82F6', '#06B6D4'] };
    return { name: 'Débutant', icon: 'leaf', color: '#10B981', gradient: ['#10B981', '#84CC16'] };
  };

  // Ajouter des points et une activité
  const addActivity = async (activityData) => {
    if (!user?.uid) return;

    try {
      const { type, title, description, points, icon, color } = activityData;

      // Calculer le nouveau score
      const newScore = stats.score + points;
      const newTotalPoints = stats.totalPoints + points;
      const grade = calculateGrade(newScore);

      // Mettre à jour les stats selon le type d'activité
      const updatedStats = {
        ...stats,
        score: newScore,
        grade: grade.name,
        totalPoints: newTotalPoints,
        lastActivityDate: new Date().toISOString(),
      };

      if (type === 'course_completed') {
        updatedStats.coursesCompleted = (stats.coursesCompleted || 0) + 1;
      } else if (type === 'quiz_passed') {
        updatedStats.quizzesPassed = (stats.quizzesPassed || 0) + 1;
      } else if (type === 'game_played') {
        updatedStats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
      }

      // Sauvegarder les stats
      await setDoc(doc(db, 'userStats', user.uid), updatedStats);
      setStats(updatedStats);

      // Ajouter l'activité
      const activity = {
        type,
        title,
        description,
        icon: icon || 'checkmark-circle',
        color: color || '#10B981',
        points,
        timestamp: new Date().toISOString(),
      };

      const activitiesRef = collection(db, 'userActivities', user.uid, 'activities');
      await addDoc(activitiesRef, activity);

      // Recharger les activités
      await loadUserActivities();

      return { success: true, newScore, grade };
    } catch (error) {
      console.error('Error adding activity:', error);
      return { success: false, error: error.message };
    }
  };

  // Mettre à jour le temps d'étude
  const updateStudyTime = async (minutes) => {
    if (!user?.uid) return;

    try {
      const updatedStats = {
        ...stats,
        totalMinutes: (stats.totalMinutes || 0) + minutes,
      };

      await setDoc(doc(db, 'userStats', user.uid), updatedStats);
      setStats(updatedStats);
    } catch (error) {
      console.error('Error updating study time:', error);
    }
  };

  // Mettre à jour la série
  const updateStreak = async () => {
    if (!user?.uid) return;

    try {
      const today = new Date().toDateString();
      const lastActivity = stats.lastActivityDate ? new Date(stats.lastActivityDate).toDateString() : null;
      
      let newStreak = stats.currentStreak || 0;
      
      if (lastActivity !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastActivity === yesterdayStr) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }

        const updatedStats = {
          ...stats,
          currentStreak: newStreak,
          lastActivityDate: new Date().toISOString(),
        };

        await setDoc(doc(db, 'userStats', user.uid), updatedStats);
        setStats(updatedStats);

        // Si série de 7 jours, ajouter un badge
        if (newStreak === 7) {
          await addActivity({
            type: 'streak',
            title: 'Série de 7 jours',
            description: 'Vous apprenez tous les jours !',
            icon: 'flame',
            color: '#EF4444',
            points: 100,
          });
        }
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const value = {
    stats,
    activities,
    loading,
    addActivity,
    updateStudyTime,
    updateStreak,
    calculateGrade,
    refreshStats: loadUserStats,
    refreshActivities: loadUserActivities,
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
};
