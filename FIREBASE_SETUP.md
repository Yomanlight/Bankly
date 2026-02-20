# Configuration Firebase pour BankUP

## ✅ Ce qui est déjà configuré

- Firebase SDK installé et configuré
- Authentification email/mot de passe fonctionnelle
- Firestore Database connecté
- AuthContext pour gérer l'état d'authentification
- Navigation conditionnelle basée sur l'authentification
- Bouton de déconnexion dans les paramètres

## 🔧 Configuration Google Sign-In (À compléter)

### 1. Configuration Firebase Console

#### A. Récupérer les Client IDs

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **bankup-a2f78**
3. Allez dans **Authentication** → **Sign-in method**
4. Cliquez sur **Google** (déjà activé)
5. Vous verrez le **Web client ID** - notez-le

#### B. Configuration pour iOS (si vous développez pour iOS)

1. Dans Firebase Console, allez dans **Project Settings** (⚙️ icône)
2. Téléchargez le fichier **GoogleService-Info.plist**
3. Dans ce fichier, trouvez la valeur de `CLIENT_ID` (iOS Client ID)

#### C. Configuration pour Android (si vous développez pour Android)

1. Dans Firebase Console, allez dans **Project Settings**
2. Téléchargez le fichier **google-services.json**
3. Le Client ID Android se trouve dans ce fichier

### 2. Mise à jour du code

Ouvrez le fichier `context/AuthContext.js` et remplacez les placeholders par vos vrais Client IDs :

```javascript
const [request, response, promptAsync] = Google.useAuthRequest({
  expoClientId: 'VOTRE_EXPO_CLIENT_ID', // Client ID Expo (optionnel)
  iosClientId: 'VOTRE_IOS_CLIENT_ID',   // Client ID iOS
  androidClientId: 'VOTRE_ANDROID_CLIENT_ID', // Client ID Android
  webClientId: '315729549963-efe12843d4d15e437e528e.apps.googleusercontent.com', // Déjà configuré
});
```

### 3. Configuration app.json (Expo)

Si vous utilisez Expo, ajoutez cette configuration dans votre `app.json` :

```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

### 4. Obtenir les Client IDs pour différentes plateformes

#### Pour Web (déjà configuré) ✅
```
Web Client ID: 315729549963-efe12843d4d15e437e528e.apps.googleusercontent.com
```

#### Pour iOS
1. Dans Firebase Console → Project Settings → Votre app iOS
2. Téléchargez GoogleService-Info.plist
3. Trouvez CLIENT_ID dans le fichier

#### Pour Android
1. Dans Firebase Console → Project Settings → Votre app Android
2. Téléchargez google-services.json
3. Trouvez le client_id OAuth dans le fichier

#### Pour Expo (optionnel)
Si vous utilisez Expo Go pour tester :
1. Le client ID Expo peut être le même que le Web Client ID
2. Ou créez un nouveau OAuth 2.0 Client ID de type "Web application" dans Google Cloud Console

### 5. Test de l'authentification Google

Une fois les Client IDs configurés :

1. Redémarrez votre application Expo
2. Allez sur l'écran de connexion
3. Cliquez sur le bouton Google
4. Vous devriez voir la popup de connexion Google
5. Après connexion, vous serez redirigé vers le questionnaire de profil

## 📱 Fonctionnalités implémentées

### Authentification
- ✅ Connexion email/mot de passe
- ✅ Inscription email/mot de passe
- 🔄 Google Sign-In (nécessite configuration des Client IDs)
- 🔄 Apple Sign-In (désactivé, à implémenter)
- 🔄 Biométrie (désactivé, à implémenter)

### Gestion des données
- ✅ Stockage des utilisateurs dans Firestore
- ✅ Sauvegarde du profil utilisateur
- ✅ Mise à jour du profil utilisateur
- ✅ Persistance de l'authentification avec AsyncStorage

### Navigation
- ✅ Navigation conditionnelle (authentifié vs non-authentifié)
- ✅ Écran de chargement pendant l'initialisation
- ✅ Déconnexion avec confirmation
- ✅ Redirection automatique après connexion/déconnexion

## 🔐 Sécurité

### Bonnes pratiques implémentées
- ✅ Validation des mots de passe (minimum 6 caractères)
- ✅ Validation des emails
- ✅ Confirmation du mot de passe à l'inscription
- ✅ Gestion sécurisée des erreurs Firebase
- ✅ Persistance sécurisée avec AsyncStorage

### À améliorer
- [ ] Ajouter la vérification d'email
- [ ] Implémenter la réinitialisation de mot de passe
- [ ] Ajouter la validation avancée des mots de passe (caractères spéciaux, etc.)
- [ ] Implémenter la limite de tentatives de connexion

## 📚 Structure des données Firestore

### Collection: `users`
```javascript
{
  uid: "user_firebase_uid",
  email: "user@example.com",
  name: "Nom de l'utilisateur",
  createdAt: "2024-11-03T19:00:00.000Z",
  // Données du questionnaire de profil
  investorProfile: {
    type: "Prudent" | "Équilibré" | "Dynamique",
    score: 45,
    // ...autres données du questionnaire
  }
}
```

## 🚀 Utilisation dans le code

### Utiliser l'authentification dans un composant

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, signIn, signUp, signInWithGoogle, logout, loading } = useAuth();

  // Vérifier si l'utilisateur est connecté
  if (user) {
    console.log('Utilisateur connecté:', user.email);
  }

  // Connexion
  const handleLogin = async () => {
    const result = await signIn(email, password);
    if (result.success) {
      // Connexion réussie
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    await logout();
  };
}
```

## 🐛 Dépannage

### Google Sign-In ne fonctionne pas
1. Vérifiez que tous les Client IDs sont correctement configurés
2. Vérifiez que l'authentification Google est activée dans Firebase Console
3. Redémarrez l'application Expo après modification des Client IDs
4. Vérifiez les logs de la console pour les erreurs

### L'utilisateur est déconnecté au redémarrage
- Vérifiez qu'AsyncStorage est correctement installé
- La persistance est automatique avec Firebase Auth

### Erreurs de navigation
- Assurez-vous que l'utilisateur est bien authentifié avant d'accéder aux écrans protégés
- L'AuthContext gère automatiquement la navigation conditionnelle

## 📞 Support

Pour toute question sur Firebase :
- Documentation Firebase Auth: https://firebase.google.com/docs/auth
- Documentation Expo Auth Session: https://docs.expo.dev/versions/latest/sdk/auth-session/

---

**Note**: Ce projet utilise Firebase SDK v9+ (modular API) avec React Native et Expo.
