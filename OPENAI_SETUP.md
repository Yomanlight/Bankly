# 🤖 Guide d'intégration de l'API OpenAI dans BankUP

## 📋 Prérequis

1. **Compte OpenAI** : Créez un compte sur [platform.openai.com](https://platform.openai.com)
2. **Clé API** : Générez une clé API depuis votre tableau de bord OpenAI
3. **Crédits** : Assurez-vous d'avoir des crédits disponibles (environ 0,001€ par conversation)

## 🔑 Configuration de la clé API

### Étape 1 : Obtenir votre clé API

1. Connectez-vous à [platform.openai.com](https://platform.openai.com)
2. Allez dans **API keys** dans le menu de gauche
3. Cliquez sur **Create new secret key**
4. Donnez un nom à votre clé (ex: "BankUP-Dev")
5. **Copiez immédiatement la clé** (vous ne pourrez plus la voir après)

### Étape 2 : Configurer la clé dans l'application

Ouvrez le fichier `services/openai.js` et remplacez :

```javascript
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';
```

Par :

```javascript
const OPENAI_API_KEY = 'sk-proj-xxxxxxxxxxxxxxxxxxxxx'; // Votre vraie clé API
```

⚠️ **IMPORTANT** : Ne commitez JAMAIS votre clé API sur Git !

### Étape 3 (Optionnel) : Utiliser une variable d'environnement

Pour plus de sécurité, vous pouvez utiliser des variables d'environnement :

1. Installez `react-native-dotenv` :
```bash
npm install react-native-dotenv
```

2. Créez un fichier `.env` à la racine :
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

3. Modifiez `services/openai.js` :
```javascript
import { OPENAI_API_KEY } from '@env';
```

4. Ajoutez `.env` dans votre `.gitignore`

## 🎯 Fonctionnalités implémentées

### ✅ Chat IA personnalisé par conseiller

Chaque conseiller financier a une personnalité et une expertise distincte :

- **Emma** (💼) : Experte en Investissement
  - Conseils sur actions, ETF, crypto
  - Analyse de risque
  - Construction de portefeuille

- **Alex** (💰) : Coach Budgétaire
  - Création de budget
  - Astuces d'économie
  - Objectifs d'épargne

- **Jules** (📈) : Planificateur Financier
  - Plans à long terme
  - Retraite et immobilier
  - Optimisation fiscale

### ✅ Suggestions de questions

Au démarrage de chaque conversation, 4 questions pertinentes sont suggérées selon le conseiller.

### ✅ Historique de conversation

L'IA se souvient de toute la conversation pour des réponses contextuelles.

### ✅ Gestion d'erreurs

- Messages d'erreur clairs en français
- Alertes pour configuration manquante
- Fallback gracieux en cas d'échec

## 💰 Coûts estimés

### Modèle utilisé : `gpt-4o-mini`

- **Input** : $0.15 / 1M tokens (~0,0001€ par message)
- **Output** : $0.60 / 1M tokens (~0,0004€ par réponse)

**Estimation** : Une conversation de 50 messages coûte environ **0,025€**

### Optimisations implémentées

- Limitation à 300 tokens par réponse
- Instructions système concises
- Réponses courtes (3-4 phrases)
- Pas de streaming (coût fixe par appel)

## 🚀 Utilisation

1. Cliquez sur le badge du conseiller (en haut à droite du Dashboard)
2. Le chat s'ouvre avec un message de bienvenue
3. Cliquez sur une suggestion ou tapez votre question
4. L'IA répond de manière contextuelle selon le conseiller sélectionné

## 🔧 Personnalisation

### Modifier les prompts système

Dans `services/openai.js`, fonction `getAdvisorSystemPrompt()`, vous pouvez :
- Ajuster la personnalité
- Modifier l'expertise
- Changer le style de réponse
- Adapter le ton

### Ajuster les paramètres de l'API

Dans la fonction `sendMessageToOpenAI()` :
```javascript
{
  model: 'gpt-4o-mini',      // Modèle utilisé
  max_tokens: 300,            // Longueur max de réponse
  temperature: 0.7,           // Créativité (0-2)
  frequency_penalty: 0.3,     // Éviter répétitions
  presence_penalty: 0.3,      // Diversité des sujets
}
```

## 🛡️ Sécurité

### ⚠️ À NE JAMAIS FAIRE :

- ❌ Commiter la clé API sur Git
- ❌ Partager la clé publiquement
- ❌ Utiliser la clé côté client en production

### ✅ Bonnes pratiques :

- ✅ Utiliser des variables d'environnement
- ✅ Créer une clé par environnement (dev/prod)
- ✅ Révoquer immédiatement les clés compromises
- ✅ Implémenter un backend pour la production

## 🐛 Résolution de problèmes

### Erreur : "Configuration de l'API requise"
➡️ La clé API n'est pas configurée dans `services/openai.js`

### Erreur : "Limite d'utilisation atteinte"
➡️ Vous avez dépassé votre quota. Attendez ou ajoutez des crédits.

### Erreur : "Erreur de connexion"
➡️ Vérifiez votre connexion internet

### Les réponses sont génériques
➡️ Vérifiez que le `selectedAdvisor` est bien passé à l'API

## 📚 Ressources

- [Documentation OpenAI](https://platform.openai.com/docs)
- [Pricing OpenAI](https://openai.com/pricing)
- [Best Practices](https://platform.openai.com/docs/guides/production-best-practices)

## 🎓 Prochaines étapes

Pour améliorer l'intégration :

1. **Backend API** : Créer une API intermédiaire pour sécuriser la clé
2. **Streaming** : Implémenter le streaming pour des réponses en temps réel
3. **Mémorisation** : Sauvegarder les conversations dans Firestore
4. **Analyse** : Tracker l'utilisation et les coûts
5. **Fine-tuning** : Entraîner un modèle personnalisé pour chaque conseiller

---

**Besoin d'aide ?** Consultez la documentation officielle OpenAI ou contactez le support.
