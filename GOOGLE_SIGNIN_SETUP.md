# 🔐 Configuration Google Sign-In pour BankUP

## 📋 Prérequis
- Un projet Firebase configuré (déjà fait ✅)
- Accès à la Firebase Console
- Accès à Google Cloud Console

---

## 🚀 Étapes de configuration

### 1️⃣ Obtenir le Web Client ID (✅ Déjà configuré)

Votre Web Client ID est déjà dans `.env.example`:
```
315729549963-efe12843d4d15e437e528e.apps.googleusercontent.com
```

---

### 2️⃣ Configurer les Client IDs pour iOS et Android

#### **A. Accéder à Google Cloud Console**

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet **bankup-a2f78**
3. Dans le menu ☰ à gauche, allez dans **APIs & Services** > **Credentials**

#### **B. Créer OAuth 2.0 Client ID pour iOS**

1. Cliquez sur **+ CREATE CREDENTIALS** en haut
2. Sélectionnez **OAuth client ID**
3. Choisissez **iOS** comme type d'application
4. Remplissez les informations :
   - **Name**: BankUP iOS
   - **Bundle ID**: Vous devez obtenir votre Bundle ID depuis votre fichier `app.json` ou `app.config.js`
     - Pour Expo, c'est généralement : `com.votreusername.bankup` ou similaire
     - Vous pouvez le trouver en exécutant : `expo config --type introspect`
5. Cliquez sur **CREATE**
6. **Copiez le Client ID iOS généré** (format: `xxx-xxx.apps.googleusercontent.com`)

#### **C. Créer OAuth 2.0 Client ID pour Android**

1. Cliquez à nouveau sur **+ CREATE CREDENTIALS** 
2. Sélectionnez **OAuth client ID**
3. Choisissez **Android** comme type d'application
4. Remplissez les informations :
   - **Name**: BankUP Android
   - **Package name**: Même que votre Bundle ID (ex: `com.votreusername.bankup`)
   - **SHA-1 certificate fingerprint**: 
     - Pour le développement avec Expo, utilisez : 
       ```
       keytool -keystore ~/.android/debug.keystore -list -v
       ```
     - Le mot de passe par défaut est `android`
     - Copiez le SHA-1
5. Cliquez sur **CREATE**
6. **Copiez le Client ID Android généré**

#### **D. Créer Expo Client ID** (optionnel mais recommandé)

1. Cliquez sur **+ CREATE CREDENTIALS**
2. Sélectionnez **OAuth client ID**
3. Choisissez **Web application**
4. **Name**: BankUP Expo
5. Dans **Authorized redirect URIs**, ajoutez :
   ```
   https://auth.expo.io/@votreusername/bankup
   ```
   Remplacez `votreusername` par votre username Expo
6. Cliquez sur **CREATE**
7. **Copiez le Client ID Expo généré**

---

### 3️⃣ Créer le fichier .env

1. Copiez `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```

2. Ouvrez `.env` et remplacez les valeurs :

```env
# Google Sign-In Client IDs
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=315729549963-efe12843d4d15e437e528e.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=VOTRE_IOS_CLIENT_ID_ICI
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=VOTRE_ANDROID_CLIENT_ID_ICI
EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID=VOTRE_EXPO_CLIENT_ID_ICI

# Firebase Project Info (déjà configuré ✅)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBOcEbnZAmfY8bPBpC9kFmdPGbj9z4aHDs
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=bankup-a2f78.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=bankup-a2f78
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=bankup-a2f78.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=315729549963
EXPO_PUBLIC_FIREBASE_APP_ID=1:315729549963:web:efe12843d4d15e437e528e
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-05927SWT13
```

---

### 4️⃣ Mettre à jour AuthContext.js

Ouvrez `context/AuthContext.js` et remplacez les lignes 29-34 par :

```javascript
// Configuration Google Sign-In
const [request, response, promptAsync] = Google.useAuthRequest({
  expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});
```

---

### 5️⃣ Activer Google Sign-In dans Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **bankup-a2f78**
3. Dans le menu de gauche, allez dans **Authentication**
4. Cliquez sur l'onglet **Sign-in method**
5. Trouvez **Google** dans la liste et cliquez dessus
6. Activez le toggle **Enable**
7. Vérifiez que l'email du projet est correct
8. Cliquez sur **Save**

---

## 📱 Obtenir votre Bundle ID pour Expo

Exécutez cette commande pour trouver votre Bundle ID :

```bash
expo config --type introspect | grep -A 5 "bundleIdentifier\|package"
```

Ou regardez dans votre `app.json` :

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.votreusername.bankup"
    },
    "android": {
      "package": "com.votreusername.bankup"
    }
  }
}
```

---

## ✅ Vérification

Après configuration, redémarrez l'app :

```bash
npm start
```

Essayez de vous connecter avec Google depuis l'écran Login ou SignUp !

---

## 🔧 Troubleshooting

### Erreur "idpiframe_initialization_failed" ou "popup_closed_by_user"
- Vérifiez que tous les Client IDs sont corrects dans `.env`
- Vérifiez que le Web Client ID est bien configuré dans Google Cloud Console

### Google Sign-In ne fonctionne pas sur iOS
- Vérifiez que le Bundle ID correspond exactement
- Vérifiez que l'iOS Client ID est bien configuré

### Google Sign-In ne fonctionne pas sur Android
- Vérifiez le SHA-1 certificate fingerprint
- Vérifiez que le Package name correspond exactement

---

## 🎯 Résumé

✅ **Performance optimisée** : Connexion maintenant ultra-rapide !
✅ **Google Sign-In** : Prêt une fois les Client IDs configurés

**3 Client IDs à configurer** :
1. iOS Client ID (pour les appareils iOS)
2. Android Client ID (pour les appareils Android)  
3. Expo Client ID (optionnel, pour le développement)

Une fois configurés, vos utilisateurs pourront se connecter en 1 clic avec Google ! 🚀
