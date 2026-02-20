# 📱 Guide : Partager BankUP avec Vos Amis

## 🚀 Option 1 : RAPIDE - Tunnel Expo (5 minutes)

### **Étapes :**

1. **Arrêter le serveur actuel** (Ctrl+C dans le terminal)

2. **Lancer avec tunnel :**
   ```bash
   npx expo start --tunnel
   ```

3. **Attendre le QR code** (1-2 minutes)

4. **Partager le QR code ou le lien** à vos amis

5. **Vos amis :**
   - Installent **Expo Go** sur leur téléphone
   - Scannent le QR code
   - Testent l'app ! 🎉

**Avantage :** Fonctionne de n'importe où, pas besoin d'être sur le même WiFi

---

## 🌐 Option 2 : PROFESSIONNEL - EAS Update

### **Configuration initiale (une seule fois) :**

1. **Installer EAS CLI :**
   ```bash
   npm install -g eas-cli
   ```

2. **Se connecter à Expo :**
   ```bash
   eas login
   ```

3. **Configurer EAS Update :**
   ```bash
   eas update:configure
   ```

4. **Publier une mise à jour :**
   ```bash
   eas update --branch production --message "Version de test pour amis"
   ```

5. **Récupérer le lien :**
   - EAS vous donne un lien permanent
   - Exemple : `exp://u.expo.dev/update/...`

### **Ensuite pour chaque nouvelle version :**
```bash
eas update --branch production --message "Nouvelle version"
```

**Avantages :**
- ✅ Lien permanent et public
- ✅ Vos amis reçoivent les mises à jour automatiquement
- ✅ Professionnel et fiable
- ✅ Gratuit avec compte Expo

---

## 📦 Option 3 : APP STANDALONE - Build APK/IPA

### **Pour Android (APK) :**

1. **Configurer EAS Build :**
   ```bash
   eas build:configure
   ```

2. **Build preview :**
   ```bash
   eas build --platform android --profile preview
   ```

3. **Télécharger l'APK** (lien donné après le build)

4. **Envoyer l'APK** à vos amis (WhatsApp, email, etc.)

5. **Vos amis installent l'APK** directement (pas besoin d'Expo Go)

**Temps de build :** 15-20 minutes  
**Avantage :** Vraie app Android installable

### **Pour iOS (TestFlight) :**

1. **Build pour iOS :**
   ```bash
   eas build --platform ios --profile preview
   ```

2. **Soumettre à TestFlight**

3. **Inviter vos amis** via TestFlight

**Plus complexe mais professionnel**

---

## 📱 Ce Que Vos Amis Doivent Faire

### **Avec Expo Go (Options 1 & 2) :**

1. **Installer Expo Go :**
   - Android : [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS : [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Scanner votre QR code** ou ouvrir votre lien

3. **Créer un compte** dans BankUP

4. **Tester !** 🎉

### **Avec APK (Option 3 - Android uniquement) :**

1. **Télécharger l'APK** que vous leur envoyez

2. **Autoriser l'installation** depuis des sources inconnues

3. **Installer l'APK**

4. **Lancer BankUP** comme une vraie app !

---

## 🎯 Ma Recommandation

### **Pour tester MAINTENANT (5 min) :**
```bash
npx expo start --tunnel
```
→ Partagez le QR code, vos amis testent immédiatement !

### **Pour une VRAIE beta (30 min setup) :**
```bash
npm install -g eas-cli
eas login
eas update:configure
eas update --branch production
```
→ Lien permanent, professionnel, mises à jour auto !

### **Pour une APP STANDALONE (1h) :**
```bash
eas build --platform android --profile preview
```
→ Vraie app Android, installable sans Expo Go !

---

## ⚠️ Important

### **Avant de partager, vérifiez :**

1. ✅ Firebase est bien configuré (sinon vos amis ne pourront pas créer de compte)
2. ✅ Toutes les fonctionnalités marchent
3. ✅ Pas de données de test sensibles dans le code
4. ✅ Les clés API sont dans `.env` (pas exposées)

### **Limites Expo Go :**
- Fonctionne bien pour 90% des cas
- Certaines fonctionnalités natives avancées nécessitent un build standalone
- BankUP fonctionne parfaitement avec Expo Go ! ✅

---

## 🆘 Troubleshooting

### **"Port 8081 already in use"**
→ Arrêtez le serveur actuel (Ctrl+C) puis relancez

### **"Unable to connect"**
→ Vérifiez que vous êtes connecté à Internet (pour tunnel)

### **"Something went wrong"**
→ Effacez le cache : `npx expo start --clear`

### **Amis ne peuvent pas scanner le QR code**
→ Utilisez l'option "Tunnel" : `npx expo start --tunnel`

---

## 📊 Comparaison

| Méthode | Temps Setup | Gratuit | Besoin Expo Go | Lien Permanent |
|---------|-------------|---------|----------------|----------------|
| **Tunnel** | 5 min | ✅ | ✅ | ❌ |
| **EAS Update** | 30 min | ✅ | ✅ | ✅ |
| **APK/IPA Build** | 1h | ✅ | ❌ | ✅ |

---

## 🎉 Résumé

**AUJOURD'HUI - Solution la plus rapide :**
```bash
# Arrêtez le serveur actuel (Ctrl+C)
npx expo start --tunnel
# Partagez le QR code à vos amis !
```

**DEMAIN - Solution professionnelle :**
```bash
npm install -g eas-cli
eas login
eas update:configure
eas update --branch production
# Lien permanent pour vos amis !
```

**Vos amis installent Expo Go, scannent, et testent BankUP ! 🚀📱**
