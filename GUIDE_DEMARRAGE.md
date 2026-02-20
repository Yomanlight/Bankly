# 🚀 Guide de Démarrage Rapide - BankUP

## Comment tester l'application sur votre iPhone avec Expo Go

### Étape 1 : Télécharger Expo Go
1. Ouvrez l'**App Store** sur votre iPhone
2. Recherchez **Expo Go**
3. Téléchargez et installez l'application

### Étape 2 : Lancer le serveur de développement
1. Ouvrez un terminal dans le dossier du projet
2. Exécutez la commande :
   ```bash
   npm start
   ```
3. Attendez que le QR code s'affiche dans le terminal

### Étape 3 : Scanner le QR code
1. Ouvrez l'application **Expo Go** sur votre iPhone
2. Appuyez sur **Scan QR code**
3. Scannez le QR code affiché dans votre terminal
4. L'application BankUP se chargera automatiquement sur votre téléphone

### ⚠️ Important
- Assurez-vous que votre iPhone et votre ordinateur sont connectés au **même réseau Wi-Fi**
- Si le QR code ne fonctionne pas, vous pouvez taper manuellement l'URL affichée (exp://...)

## 📱 Fonctionnalités à tester

### 1. Écran d'accueil (Onboarding)
- Design avec logo circulaire et effets visuels
- Boutons "Commencer" et "Se connecter"

### 2. Inscription
- Formulaire avec nom, email, mot de passe
- Case à cocher pour les conditions d'utilisation
- Options de connexion sociale (Google, Apple)

### 3. Connexion
- Formulaire email/mot de passe
- Option "Mot de passe oublié"
- Authentification biométrique

### 4. Accueil
- Carte de progression avec gradient violet
- Statistiques (cours complétés, temps d'étude, série)
- Liste des cours avec barre de progression
- Actions rapides (calculateurs)

### 5. Explorer
- Barre de recherche
- Grille de catégories avec icônes colorées
- Liste des cours populaires avec notes et durée
- Recommandations personnalisées

### 6. Profil
- Avatar personnalisable
- Badges et récompenses
- Statistiques détaillées
- Menu de paramètres
- Option de déconnexion

## 🎨 Thème de Conception

L'application utilise un **thème sombre élégant** :
- Couleur principale : **Violet** (#8B5CF6)
- Fond : **Noir profond** (#0A0A0A)
- Accents : Vert (succès), Rouge (erreur), Orange (warning)

## 🔧 Commandes Utiles

```bash
# Démarrer l'application
npm start

# Réinitialiser le cache si problème
npm start -- --clear

# Voir les options disponibles
npm start -- --help
```

## 💡 Astuces

- Secouez votre téléphone pour ouvrir le menu de développement
- Le rechargement automatique (hot reload) est activé par défaut
- Les modifications de code se reflètent instantanément sur votre téléphone

## 🐛 Résolution de Problèmes

### Le QR code ne fonctionne pas
- Vérifiez que vous êtes sur le même réseau Wi-Fi
- Essayez de redémarrer le serveur (Ctrl+C puis `npm start`)
- Utilisez l'option "Entrer l'URL manuellement" dans Expo Go

### L'application ne se charge pas
- Vérifiez votre connexion Internet
- Attendez quelques secondes, le premier chargement peut être lent
- Vérifiez les erreurs dans le terminal

### Erreur de dépendances
```bash
rm -rf node_modules
npm install
npm start
```

## 📞 Support

Pour toute question ou problème :
1. Consultez la documentation Expo : https://docs.expo.dev
2. Vérifiez les logs dans le terminal
3. Inspectez les erreurs dans l'application Expo Go

Bon développement ! 🎉
