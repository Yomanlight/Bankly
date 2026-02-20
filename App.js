import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserStatsProvider } from './context/UserStatsContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { StatsProvider } from './context/StatsContext';
import AppNavigator from './navigation/AppNavigator';

// Composant pour gérer le chargement initial
function AppContent() {
  const { isDarkMode } = useTheme();
  const { initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#0A0A0A' : '#FFFFFF'
      }}>
        <ActivityIndicator size="large" color={isDarkMode ? '#8B5CF6' : '#7C3AED'} />
      </View>
    );
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </>
  );
}

// Composant principal de l'application
export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <StatsProvider>
            <UserStatsProvider>
              <AppContent />
            </UserStatsProvider>
          </StatsProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
