# 🔥 Activer Google Sign-In dans Firebase - OBLIGATOIRE

## ⚠️ Cette étape est OBLIGATOIRE pour que Google Sign-In fonctionne !

### Étape 1 : Accéder à Firebase Console

1. Allez sur : https://console.firebase.google.com/
2. Sélectionnez votre projet : **bankup-a2f78**

### Étape 2 : Activer Google Authentication

1. Dans le menu de gauche, cliquez sur **Authentication** (icône 🔐)
2. Cliquez sur l'onglet **Sign-in method** en haut
3. Dans la liste des providers, trouvez **Google**
4. Cliquez sur **Google**
5. Activez le toggle **Enable** (il doit devenir bleu/vert)
6. Vérifiez que l'email du projet est correct (devrait être votre email)
7. **Cliquez sur SAVE** (très important !)

### Étape 3 : Vérification

Après avoir cliqué sur Save, vous devriez voir :
- ✅ Google apparaît avec le statut **Enabled**
- ✅ Un petit logo Google en couleur (pas grisé)

### C'est tout ! 🎉

Une fois activé dans Firebase, retournez dans votre app et essayez de vous connecter avec Google.

La connexion devrait maintenant fonctionner sur le web !

---

## 🔧 Si ça ne marche toujours pas

Vérifiez dans Firebase Console → Authentication → Settings → Authorized domains :
- Assurez-vous que `localhost` est dans la liste
- Si ce n'est pas le cas, ajoutez-le

---

## 📱 Pour tester sur mobile (iOS/Android)

Le code actuel fonctionne déjà sur le web. Pour mobile, vous devrez :
1. Configurer les Client IDs iOS/Android dans `.env`
2. Suivre le guide dans `GOOGLE_SIGNIN_SETUP.md`

Mais pour commencer, **testez d'abord sur le web** ! C'est plus simple.
