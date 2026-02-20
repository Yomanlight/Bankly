export const QUESTIONNAIRE_DATA = [
  // Section 1: Profil général et situation personnelle
  {
    id: 'age',
    section: 'Profil général',
    sectionNumber: 1,
    type: 'input',
    question: 'Quel âge as-tu ?',
    placeholder: 'Ex: 25',
    keyboardType: 'numeric',
    points: { min: 0, max: 0 }, // Pas de points pour démographie
  },
  {
    id: 'situation',
    section: 'Profil général',
    sectionNumber: 1,
    type: 'multipleChoice',
    question: 'Quelle est ta situation actuelle ?',
    options: [
      { value: 'student', label: 'Étudiant', icon: 'school-outline' },
      { value: 'young_active', label: 'Jeune actif', icon: 'briefcase-outline' },
      { value: 'active', label: 'Actif expérimenté', icon: 'trending-up-outline' },
      { value: 'entrepreneur', label: 'Entrepreneur', icon: 'rocket-outline' },
    ],
    points: { min: 0, max: 0 },
  },
  {
    id: 'monthly_income',
    section: 'Profil général',
    sectionNumber: 1,
    type: 'multipleChoice',
    question: 'Quels sont tes revenus mensuels moyens ?',
    options: [
      { value: '<1000', label: 'Moins de 1000€', subtitle: 'Revenus modestes' },
      { value: '1000-2000', label: '1000€ - 2000€', subtitle: 'Revenus moyens' },
      { value: '2000-3000', label: '2000€ - 3000€', subtitle: 'Revenus confortables' },
      { value: '>3000', label: 'Plus de 3000€', subtitle: 'Revenus élevés' },
    ],
    points: { min: 0, max: 0 },
  },
  {
    id: 'has_savings',
    section: 'Profil général',
    sectionNumber: 1,
    type: 'multipleChoice',
    question: 'As-tu déjà une épargne ?',
    options: [
      { value: 'yes', label: 'Oui, j\'ai déjà épargné', icon: 'checkmark-circle' },
      { value: 'no', label: 'Non, pas encore', icon: 'close-circle' },
    ],
    points: { min: 0, max: 0 },
  },
  {
    id: 'savings_amount',
    section: 'Profil général',
    sectionNumber: 1,
    type: 'multipleChoice',
    question: 'Combien as-tu déjà mis de côté ?',
    condition: { field: 'has_savings', value: 'yes' },
    options: [
      { value: '<1000', label: 'Moins de 1000€' },
      { value: '1000-5000', label: '1000€ - 5000€' },
      { value: '5000-10000', label: '5000€ - 10000€' },
      { value: '>10000', label: 'Plus de 10000€' },
    ],
    points: { min: 0, max: 0 },
  },
  {
    id: 'invest_percentage',
    section: 'Profil général',
    sectionNumber: 1,
    type: 'multipleChoice',
    question: 'Quelle part de ton épargne es-tu prêt à investir ?',
    options: [
      { value: '0-10', label: '0% - 10%', subtitle: 'Très prudent', points: 1 },
      { value: '10-30', label: '10% - 30%', subtitle: 'Prudent', points: 2 },
      { value: '30-50', label: '30% - 50%', subtitle: 'Équilibré', points: 3 },
      { value: '50-70', label: '50% - 70%', subtitle: 'Dynamique', points: 4 },
      { value: '>70', label: 'Plus de 70%', subtitle: 'Très dynamique', points: 5 },
    ],
    points: { min: 1, max: 5 },
  },

  // Section 2: Expérience et connaissances financières
  {
    id: 'has_invested',
    section: 'Expérience financière',
    sectionNumber: 2,
    type: 'multipleChoice',
    question: 'As-tu déjà investi ton argent ?',
    options: [
      { value: 'yes', label: 'Oui, j\'ai déjà investi', icon: 'trending-up' },
      { value: 'no', label: 'Non, jamais', icon: 'close-circle' },
    ],
    points: { yes: 2, no: 1 },
  },
  {
    id: 'investment_types',
    section: 'Expérience financière',
    sectionNumber: 2,
    type: 'multipleChoice',
    question: 'Si oui, dans quoi as-tu investi ?',
    condition: { field: 'has_invested', value: 'yes' },
    multiple: true,
    options: [
      { value: 'livret', label: 'Livret A / LDDS', icon: 'wallet-outline', points: 1 },
      { value: 'assurance_vie', label: 'Assurance vie', icon: 'shield-checkmark-outline', points: 2 },
      { value: 'actions', label: 'Actions en bourse', icon: 'trending-up-outline', points: 4 },
      { value: 'cryptos', label: 'Cryptomonnaies', icon: 'logo-bitcoin', points: 5 },
      { value: 'immobilier', label: 'Immobilier', icon: 'home-outline', points: 3 },
    ],
  },
  {
    id: 'knowledge_level',
    section: 'Expérience financière',
    sectionNumber: 2,
    type: 'multipleChoice',
    question: 'Comment évalues-tu tes connaissances en finance ?',
    options: [
      { value: 'beginner', label: 'Débutant', subtitle: 'Je débute dans la finance', points: 1 },
      { value: 'intermediate', label: 'Intermédiaire', subtitle: 'J\'ai quelques connaissances', points: 3 },
      { value: 'advanced', label: 'Confirmé', subtitle: 'Je maîtrise bien le sujet', points: 5 },
    ],
    points: { min: 1, max: 5 },
  },
  {
    id: 'loss_reaction',
    section: 'Expérience financière',
    sectionNumber: 2,
    type: 'multipleChoice',
    question: 'Que ferais-tu si ton investissement perdait 10% en un mois ?',
    options: [
      { value: 'sell', label: 'Je vends immédiatement', subtitle: 'Pour limiter les pertes', points: 1 },
      { value: 'wait', label: 'J\'attends que ça remonte', subtitle: 'Pas de panique', points: 3 },
      { value: 'buy_more', label: 'J\'en profite pour investir plus', subtitle: 'Les prix sont bas!', points: 5 },
    ],
    points: { min: 1, max: 5 },
  },
  {
    id: 'investment_meaning',
    section: 'Expérience financière',
    sectionNumber: 2,
    type: 'multipleChoice',
    question: 'À ton avis, investir signifie surtout :',
    options: [
      { value: 'secure', label: 'Sécuriser mon argent', icon: 'shield-checkmark', points: 1 },
      { value: 'grow', label: 'Faire croître mon patrimoine', icon: 'trending-up', points: 3 },
      { value: 'risk', label: 'Prendre des risques calculés', icon: 'rocket', points: 5 },
    ],
    points: { min: 1, max: 5 },
  },

  // Section 3: Objectifs d'investissement
  {
    id: 'investment_goal',
    section: 'Objectifs',
    sectionNumber: 3,
    type: 'multipleChoice',
    question: 'Pourquoi veux-tu investir ?',
    options: [
      { value: 'long_term', label: 'Épargne long terme', subtitle: 'Pour ma retraite', icon: 'time-outline', points: 3 },
      { value: 'project', label: 'Financer un projet', subtitle: 'Achat immobilier, etc.', icon: 'home-outline', points: 2 },
      { value: 'income', label: 'Générer des revenus', subtitle: 'Revenus passifs', icon: 'cash-outline', points: 3 },
      { value: 'speculation', label: 'Spéculer', subtitle: 'Gains rapides', icon: 'flash-outline', points: 5 },
    ],
    points: { min: 2, max: 5 },
  },
  {
    id: 'investment_duration',
    section: 'Objectifs',
    sectionNumber: 3,
    type: 'multipleChoice',
    question: 'Combien de temps comptes-tu laisser ton argent investi ?',
    options: [
      { value: '<1', label: 'Moins d\'1 an', subtitle: 'Court terme', points: 1 },
      { value: '1-3', label: '1 à 3 ans', subtitle: 'Moyen terme', points: 2 },
      { value: '3-5', label: '3 à 5 ans', subtitle: 'Moyen-long terme', points: 3 },
      { value: '>5', label: 'Plus de 5 ans', subtitle: 'Long terme', points: 5 },
    ],
    points: { min: 1, max: 5 },
  },
  {
    id: 'max_loss',
    section: 'Objectifs',
    sectionNumber: 3,
    type: 'multipleChoice',
    question: 'Quelle perte maximale serais-tu prêt à accepter ?',
    options: [
      { value: '0', label: '0%', subtitle: 'Aucune perte acceptable', points: 1 },
      { value: '5', label: '5%', subtitle: 'Perte très limitée', points: 2 },
      { value: '15', label: '15%', subtitle: 'Perte modérée', points: 3 },
      { value: '20+', label: '20% ou plus', subtitle: 'Perte importante acceptable', points: 5 },
    ],
    points: { min: 1, max: 5 },
  },

  // Section 4: Comportement face au risque
  {
    id: 'drop_reaction',
    section: 'Comportement au risque',
    sectionNumber: 4,
    type: 'multipleChoice',
    question: 'Si ton investissement baisse de 10% en un mois, que fais-tu ?',
    options: [
      { value: 'sell_immediately', label: 'Je vends immédiatement', subtitle: 'Pour éviter de perdre plus', points: 1 },
      { value: 'wait', label: 'J\'attends que la situation s\'améliore', subtitle: 'Patience', points: 3 },
      { value: 'buy_more', label: 'J\'en profite pour investir davantage', subtitle: 'Les prix sont plus bas', points: 5 },
    ],
    points: { min: 1, max: 5 },
  },
  {
    id: 'investment_choice',
    section: 'Comportement au risque',
    sectionNumber: 4,
    type: 'multipleChoice',
    question: 'On te propose deux placements. Tu choisis lequel ?',
    options: [
      { value: 'safe', label: 'Placement sûr à 2% par an', subtitle: 'Garanti sans risque', points: 1 },
      { value: 'risky', label: 'Placement risqué à 8%', subtitle: 'Avec possibilité de perte', points: 5 },
    ],
    points: { min: 1, max: 5 },
  },
  {
    id: 'fomo_reaction',
    section: 'Comportement au risque',
    sectionNumber: 4,
    type: 'multipleChoice',
    question: 'Ton ami dit qu\'une action a doublé en une semaine. Tu fais quoi ?',
    options: [
      { value: 'research', label: 'Je me renseigne d\'abord', subtitle: 'Analyse avant action', points: 3 },
      { value: 'test', label: 'J\'investis un petit montant', subtitle: 'Pour tester', points: 4 },
      { value: 'jump_in', label: 'J\'investis rapidement', subtitle: 'Pour ne pas rater le train', points: 1 },
    ],
    points: { min: 1, max: 5 },
  },
  {
    id: 'game_reaction',
    section: 'Comportement au risque',
    sectionNumber: 4,
    type: 'multipleChoice',
    question: 'À un jeu où tu peux gagner 100€ ou tout perdre :',
    options: [
      { value: 'no_play', label: 'Je ne joue pas', points: 1 },
      { value: 'once', label: 'Je tente une fois', points: 3 },
      { value: 'multiple', label: 'Je tente plusieurs fois', subtitle: 'Pour maximiser mes chances', points: 5 },
    ],
    points: { min: 1, max: 5 },
  },
  {
    id: 'time_preference',
    section: 'Comportement au risque',
    sectionNumber: 4,
    type: 'multipleChoice',
    question: '1000€ maintenant ou 1500€ dans un an ?',
    options: [
      { value: 'now', label: '1000€ tout de suite', subtitle: 'Je préfère l\'immédiat', points: 2 },
      { value: 'later', label: '1500€ dans un an', subtitle: 'Je sais patienter', points: 4 },
    ],
    points: { min: 2, max: 4 },
  },
  {
    id: 'temporary_loss_feeling',
    section: 'Comportement au risque',
    sectionNumber: 4,
    type: 'multipleChoice',
    question: 'Face à l\'idée de perdre temporairement de l\'argent :',
    options: [
      { value: 'stress', label: 'Du stress, je préfère éviter', subtitle: 'Toute perte m\'inquiète', points: 1 },
      { value: 'concern', label: 'Un peu d\'inquiétude', subtitle: 'Ça fait partie du jeu', points: 3 },
      { value: 'no_fear', label: 'Aucune peur', subtitle: 'Le long terme compense', points: 5 },
    ],
    points: { min: 1, max: 5 },
  },
  {
    id: 'risk_level',
    section: 'Comportement au risque',
    sectionNumber: 4,
    type: 'multipleChoice',
    question: 'Quel niveau de risque acceptes-tu ?',
    options: [
      { value: 'low', label: 'Faible risque, faible rendement', subtitle: 'Sécurité avant tout', points: 1 },
      { value: 'moderate', label: 'Risque modéré, rendement moyen', subtitle: 'Équilibre', points: 3 },
      { value: 'high', label: 'Risque élevé, fort rendement', subtitle: 'J\'accepte la volatilité', points: 5 },
    ],
    points: { min: 1, max: 5 },
  },

  // Section 5: Solde initial
  {
    id: 'initial_balance',
    section: 'Solde initial',
    sectionNumber: 5,
    type: 'input',
    question: 'Avec quel solde aimerais-tu commencer ton parcours financier ?',
    placeholder: 'Ex: 1000',
    keyboardType: 'numeric',
    required: true,
    points: { min: 0, max: 0 },
  },
];

export const calculateProfile = (answers) => {
  let totalPoints = 0;
  let maxPoints = 0;

  QUESTIONNAIRE_DATA.forEach((question) => {
    if (question.points && question.points.max > 0) {
      const answer = answers[question.id];
      if (answer) {
        if (question.type === 'multipleChoice') {
          const selectedOption = question.options.find(opt => opt.value === answer);
          if (selectedOption && selectedOption.points) {
            totalPoints += selectedOption.points;
          }
        }
        maxPoints += question.points.max;
      }
    }
  });

  const percentage = (totalPoints / maxPoints) * 100;

  if (percentage < 35) {
    return {
      type: 'prudent',
      title: 'Profil Prudent',
      icon: 'shield-checkmark',
      color: '#10B981',
      description: 'Tu privilégies la sécurité et acceptes peu de risque. Tes investissements seront orientés vers des placements stables et prévisibles.',
      recommendations: [
        'Livret A et LDDS pour l\'épargne de précaution',
        'Fonds euros en assurance vie',
        'Obligations d\'État',
        'SCPI (immobilier indirect)',
      ],
    };
  } else if (percentage < 65) {
    return {
      type: 'equilibre',
      title: 'Profil Équilibré',
      icon: 'trending-up',
      color: '#8B5CF6',
      description: 'Tu recherches un compromis entre rendement et sécurité. Tu acceptes une certaine volatilité pour obtenir de meilleurs rendements.',
      recommendations: [
        'Mix 60% fonds euros / 40% unités de compte',
        'ETF diversifiés (actions + obligations)',
        'PEA pour optimiser la fiscalité',
        'Un peu de cryptomonnaies (5-10%)',
      ],
    };
  } else {
    return {
      type: 'dynamique',
      title: 'Profil Dynamique',
      icon: 'rocket',
      color: '#F59E0B',
      description: 'Tu vises un rendement à long terme et acceptes la volatilité. Tu es à l\'aise avec les fluctuations de marché.',
      recommendations: [
        'ETF actions internationales (S&P 500, World)',
        'Actions en direct (PEA)',
        'Cryptomonnaies (Bitcoin, Ethereum)',
        'Investissements thématiques (tech, green energy)',
      ],
    };
  }
};

export const getSectionProgress = (answers) => {
  const sections = [1, 2, 3, 4, 5];
  return sections.map(sectionNumber => {
    const sectionQuestions = QUESTIONNAIRE_DATA.filter(q => q.sectionNumber === sectionNumber);
    const answeredQuestions = sectionQuestions.filter(q => answers[q.id]);
    return {
      number: sectionNumber,
      total: sectionQuestions.length,
      answered: answeredQuestions.length,
      percentage: (answeredQuestions.length / sectionQuestions.length) * 100,
    };
  });
};
