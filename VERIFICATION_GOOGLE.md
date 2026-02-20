# ✅ Checklist complète - Google Sign-In

## 🔥 ÉTAPE 1 : Firebase Console (CRITIQUE !)

Allez sur : **https://console.firebase.google.com/**

### A. Activer Google Sign-In
1. Sélectionnez le projet **bankup-a2f78**
2. Menu de gauche : **Authentication** (icône 🔐)
3. Onglet **Sign-in method** (en haut)
4. Dans la liste, trouvez **Google**
5. Cliquez sur la ligne **Google**
6. **ACTIVEZ le toggle "Enable"** (doit devenir bleu/vert)
7. Vérifiez l'email de support
8. **CLIQUEZ SUR "SAVE"** ← TRÈS IMPORTANT !

### B. Vérifier les domaines autorisés
1. Toujours dans **Authentication**
2. Onglet **Settings**
3. Scrollez vers **Authorized domains**
4. Vérifiez que ces domaines sont présents :
   - ✅ `localhost`
   - ✅ `bankup-a2f78.firebaseapp.com`
5. Si `localhost` manque, cliquez sur **Add domain** et ajoutez-le

---

## 🌐 ÉTAPE 2 : Google Cloud Console (si l'erreur persiste)

Allez sur : **https://console.cloud.google.com/**

### A. Configurer l'écran de consentement OAuth
1. Sélectionnez le projet **bankup-a2f78**
2. Menu ☰ → **APIs & Services** → **OAuth consent screen**
3. Si pas encore configuré :
   - Choisissez **External**
   - Cliquez sur **CREATE**
4. Remplissez :
   - **App name** : BankUP
   - **User support email** : Votre email
   - **Developer contact** : Votre email
   - Cliquez sur **SAVE AND CONTINUE**
5. **Scopes** : Cliquez sur **SAVE AND CONTINUE** (scopes par défaut OK)
6. **Test users** :
   - Cliquez sur **+ ADD USERS**
   - Ajoutez votre email (celui que vous utilisez pour tester)
   - Cliquez sur **SAVE AND CONTINUE**

### B. Vérifier le Web Client ID
1. Menu ☰ → **APIs & Services** → **Credentials**
2. Trouvez votre **Web client** (celui qui finit par `.apps.googleusercontent.com`)
3. Cliquez dessus
4. Vérifiez **Authorized JavaScript origins** :
   - ✅ `http://localhost:8082` (ou 8081)
   - Si manquant, ajoutez-le
5. Vérifiez **Authorized redirect URIs** :
   - ✅ `https://bankup-a2f78.firebaseapp.com/__/auth/handler`
   - Si manquant, ajoutez-le
6. **CLIQUEZ SUR "SAVE"**

---

## 🔧 ÉTAPE 3 : Vérifier le fichier .env

Ouvrez `.env` et vérifiez :

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=315729549963-efe12843d4d15e437e528e.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=315729549963-jvcs478ut2td3ub1l7rv52f9ri51p1bp.apps.googleusercontent.com

EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBOcEbnZAmfY8bPBpC9kFmdPGbj9z4aHDs
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=bankup-a2f78.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=bankup-a2f78
```

✅ Toutes ces valeurs doivent être présentes (pas de "VOTRE_...")

---

## 🚀 ÉTAPE 4 : Relancer l'application

```bash
# Arrêtez le serveur (Ctrl+C)
npm start -- --clear
```

Attendez que le QR code apparaisse, puis :
- Appuyez sur **W** pour ouvrir dans le navigateur web

---

## 🧪 ÉTAPE 5 : Tester Google Sign-In

1. Dans le navigateur, allez sur la page de Login ou SignUp
2. Cliquez sur le bouton Google (icône Google)
3. Une popup Google devrait s'ouvrir
4. Sélectionnez votre compte
5. Vous devriez être connecté ! ✅

---

## ⚠️ Si ça ne marche TOUJOURS pas

### Erreur "Accès bloqué : erreur d'autorisation"
- ❌ Google Sign-In **n'est PAS activé** dans Firebase Console
- ❌ Votre email **n'est PAS** dans les test users de Google Cloud Console
- ❌ L'écran de consentement OAuth **n'est PAS configuré**

### Erreur "auth/popup-closed-by-user"
- ✅ C'est normal si vous fermez la popup
- Réessayez simplement

### Erreur "auth/unauthorized-domain"
- ❌ `localhost` n'est pas dans les domaines autorisés de Firebase
- Retournez à **Firebase Console** → **Authentication** → **Settings** → **Authorized domains**

### La popup ne s'ouvre pas
- Vérifiez que votre navigateur n'a pas bloqué les popups
- Essayez un autre navigateur (Chrome recommandé)

---

## 📸 Captures d'écran attendues

### Firebase Console - Authentication
✅ Vous devriez voir "Google" avec le statut **"Enabled"** en vert

### Google Cloud Console - OAuth consent screen
✅ Status devrait être "Testing" avec votre email dans "Test users"

---

## 🆘 Besoin d'aide ?

Si après TOUTES ces étapes ça ne marche pas :
1. Faites une capture d'écran de l'erreur exacte
2. Vérifiez la console du navigateur (F12) pour voir les erreurs
3. Copiez le message d'erreur complet

---

## ✅ Une fois que ça marche

Google Sign-In fonctionnera sur :
- ✅ Web (navigateur) immédiatement
- 📱 iOS/Android nécessitent les autres Client IDs (voir GOOGLE_SIGNIN_SETUP.md)
