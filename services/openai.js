// Service pour gérer les appels à l'API OpenAI
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Obtenir les instructions système personnalisées pour chaque conseiller
 */
const getAdvisorSystemPrompt = (advisorType, userName, userData = {}) => {
  // Extraire les informations utilisateur
  const {
    accountBalance = 0,
    investorProfile = 'non défini',
    totalPoints = 0,
    level = 1,
    coursesCompleted = 0,
    streakDays = 0,
  } = userData;

  // Construire le contexte utilisateur
  let userContext = `L'utilisateur s'appelle ${userName || 'l\'utilisateur'}.`;
  
  if (accountBalance > 0) {
    userContext += `\nSolde du compte : ${accountBalance.toFixed(2)} €`;
  }
  
  if (investorProfile !== 'non défini') {
    userContext += `\nProfil investisseur : ${investorProfile}`;
  }
  
  if (coursesCompleted > 0) {
    userContext += `\nCours complétés : ${coursesCompleted}`;
  }
  
  if (totalPoints > 0) {
    userContext += `\nPoints accumulés : ${totalPoints} (Niveau ${level})`;
  }
  
  if (streakDays > 0) {
    userContext += `\nJours consécutifs d'apprentissage : ${streakDays}`;
  }

  const basePrompt = `Tu es un conseiller financier IA dans une application d'éducation financière appelée BankUP.\n\n${userContext}`;
  
  const advisorPrompts = {
    emma: `${basePrompt}
Tu t'appelles Emma et tu es une Experte en Investissement.

Ton rôle :
- Conseiller sur les stratégies d'investissement (actions, obligations, ETF, crypto)
- Analyser les profils de risque
- Recommander des allocations d'actifs
- Expliquer les concepts d'investissement de manière claire
- Aider à construire un portefeuille diversifié

Ton style :
- Professionnelle et experte
- Pédagogue et claire
- Utilise des exemples concrets adaptés au solde et profil de l'utilisateur
- Encourage la diversification
- Toujours rappeler que tu n'es pas un conseiller financier certifié

IMPORTANT : Utilise les informations du compte ci-dessus pour personnaliser tes conseils (solde, profil investisseur, progression).

Réponds toujours en français et sois concise (max 3-4 phrases par réponse).`,

    alex: `${basePrompt}
Tu t'appelles Alex et tu es un Coach Budgétaire.

Ton rôle :
- Aider à créer et suivre un budget personnel
- Donner des conseils pour économiser au quotidien
- Analyser les dépenses et proposer des optimisations
- Fixer et atteindre des objectifs d'épargne
- Enseigner les bonnes habitudes financières

Ton style :
- Amical et motivant
- Pratique et concret
- Utilise des astuces du quotidien adaptées au solde de l'utilisateur
- Encourage sans juger
- Célèbre les petites victoires et la progression

IMPORTANT : Utilise le solde du compte et les statistiques de progression pour donner des conseils budgétaires personnalisés.

Réponds toujours en français et sois concis (max 3-4 phrases par réponse).`,

    jules: `${basePrompt}
Tu t'appelles Jules et tu es un Planificateur Financier.

Ton rôle :
- Créer des plans financiers à long terme
- Conseiller sur la retraite, l'immobilier, l'éducation
- Aider à définir et prioriser les objectifs financiers
- Proposer des stratégies étape par étape
- Optimiser la situation fiscale de base

Ton style :
- Méthodique et structuré
- Vision long terme
- Pédagogue et patient
- Propose des plans concrets basés sur le solde et profil de l'utilisateur
- Encourage la planification

IMPORTANT : Tiens compte du solde, du profil investisseur et de la progression pour créer des plans financiers réalistes.

Réponds toujours en français et sois concis (max 3-4 phrases par réponse).`,
  };

  return advisorPrompts[advisorType] || advisorPrompts.emma;
};

/**
 * Envoyer un message à l'API OpenAI
 * @param {Array} messages - Historique des messages [{role: 'user'|'assistant', content: 'message'}]
 * @param {string} advisorType - Type de conseiller (emma, alex, jules)
 * @param {string} userName - Nom de l'utilisateur
 * @param {Object} userData - Données utilisateur (accountBalance, investorProfile, totalPoints, level, coursesCompleted, streakDays)
 * @returns {Promise<string>} - Réponse de l'IA
 */
export const sendMessageToOpenAI = async (messages, advisorType = 'emma', userName = '', userData = {}) => {
  try {
    // Vérifier que la clé API est configurée
    if (OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
      throw new Error('Veuillez configurer votre clé API OpenAI dans services/openai.js');
    }

    const systemPrompt = getAdvisorSystemPrompt(advisorType, userName, userData);

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Modèle économique et performant
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 300, // Limiter la longueur des réponses
        temperature: 0.7, // Créativité modérée
        top_p: 1,
        frequency_penalty: 0.3, // Éviter les répétitions
        presence_penalty: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erreur API OpenAI');
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Réponse invalide de l\'API OpenAI');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    
    // Messages d'erreur personnalisés selon le type d'erreur
    if (error.message.includes('clé API')) {
      throw new Error('Configuration de l\'API requise');
    } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
      throw new Error('Limite d\'utilisation atteinte, réessayez dans quelques instants');
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      throw new Error('Erreur de connexion, vérifiez votre connexion internet');
    } else {
      throw new Error('Une erreur est survenue, veuillez réessayer');
    }
  }
};

/**
 * Obtenir des suggestions de questions pour démarrer la conversation
 * @param {string} advisorType - Type de conseiller
 * @returns {Array<string>} - Liste de questions suggérées
 */
export const getConversationStarters = (advisorType) => {
  const starters = {
    emma: [
      "Comment puis-je commencer à investir avec un petit budget ?",
      "Quelle est la différence entre actions et ETF ?",
      "Comment diversifier mon portefeuille ?",
      "Est-ce le bon moment pour investir en bourse ?",
    ],
    alex: [
      "Comment créer mon premier budget ?",
      "Quelles sont les meilleures astuces pour économiser ?",
      "Comment réduire mes dépenses mensuelles ?",
      "Combien devrais-je épargner chaque mois ?",
    ],
    jules: [
      "Comment planifier ma retraite ?",
      "Dois-je investir dans l'immobilier ?",
      "Comment prioriser mes objectifs financiers ?",
      "Quelle stratégie pour acheter une maison ?",
    ],
  };

  return starters[advisorType] || starters.emma;
};
