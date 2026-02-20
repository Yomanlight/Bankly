# BankUP - Application d'Éducation Financière

Une application mobile iOS développée avec React Native et Expo pour l'éducation financière, inspirée de Finary.

## 🚀 Fonctionnalités

- ✅ Interface moderne en dark mode avec design violet/noir
- ✅ Authentification (connexion et inscription)
- ✅ Écran d'accueil avec progression et statistiques
- ✅ Exploration de cours par catégories
- ✅ Profil utilisateur avec récompenses
- ✅ Navigation par onglets
- ✅ Design inspiré de l'image fournie

## 📱 Installation et Démarrage

### Prérequis
- Node.js (version 20.16.0 ou supérieure)
- npm ou yarn
- Expo Go sur votre iPhone (téléchargeable sur l'App Store)

### Installation

1. Les dépendances sont déjà installées, mais si besoin :
```bash
npm install
```

### Démarrer l'application

1. Lancez le serveur de développement :
```bash
npm start
```

2. Un QR code s'affichera dans votre terminal

3. Sur votre iPhone :
   - Ouvrez l'application **Expo Go**
   - Scannez le QR code avec l'appareil photo
   - L'application se chargera automatiquement

## 📂 Structure du Projet

```
BankUP/
├── components/          # Composants réutilisables
│   ├── Button.js       # Bouton avec gradient
│   └── Input.js        # Champ de saisie personnalisé
├── constants/
│   └── Colors.js       # Palette de couleurs
├── navigation/
│   └── AppNavigator.js # Configuration de la navigation
├── screens/            # Écrans de l'application
│   ├── OnboardingScreen.js
│   ├── LoginScreen.js
│   ├── SignUpScreen.js
│   ├── HomeScreen.js
│   ├── ExploreScreen.js
│   └── ProfileScreen.js
├── App.js              # Point d'entrée de l'application
└── app.json            # Configuration Expo

```

## 🎨 Design

L'application utilise un thème sombre avec :
- **Couleur principale** : Violet (#8B5CF6)
- **Arrière-plan** : Noir profond (#0A0A0A)
- **Cartes** : Gris foncé (#1F1F1F)
- **Texte** : Blanc et nuances de gris

## 📚 Technologies Utilisées

- **React Native** : Framework mobile
- **Expo** : Plateforme de développement
- **React Navigation** : Navigation entre écrans
- **Expo Linear Gradient** : Dégradés de couleurs
- **Expo Vector Icons** : Icônes

## 🔧 Commandes Utiles

```bash
# Démarrer le serveur de développement
npm start

# Démarrer en mode web
npm run web

# Réinitialiser le cache
npm start -- --clear

# Installer une nouvelle dépendance
npx expo install nom-du-package
```

## 📱 Test sur iPhone

1. Assurez-vous que votre iPhone et votre ordinateur sont sur le même réseau Wi-Fi
2. Installez l'application **Expo Go** depuis l'App Store
3. Lancez `npm start` dans le terminal
4. Scannez le QR code avec Expo Go
5. L'application se chargera sur votre téléphone

## 🚧 Prochaines Étapes

- [ ] Ajouter l'authentification réelle (Firebase, Supabase, etc.)
- [ ] Implémenter le contenu des cours
- [ ] Ajouter des vidéos et des quiz
- [ ] Créer un système de progression persistant
- [ ] Ajouter des notifications push
- [ ] Implémenter les calculateurs financiers
- [ ] Ajouter l'authentification biométrique

## 📄 Licence

Ce projet est sous licence MIT.

## 👥 Auteur

Développé pour l'éducation financière.
