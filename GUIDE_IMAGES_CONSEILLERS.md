# 📸 Guide - Images des Conseillers IA

## 📁 Où placer les images ?

Créez le dossier et ajoutez vos images PNG :

```
BankUP/
  └── assets/
      └── advisors/
          ├── emma.png
          ├── alex.png
          └── jules.png
```

---

## 🎨 Spécifications des images

### **Dimensions recommandées :**
- **Taille** : 400x400px minimum
- **Format** : PNG avec fond transparent
- **Poids** : < 500KB par image

### **Conseils de design :**
- ✅ Fond transparent (PNG)
- ✅ Personnages centrés
- ✅ Style cohérent entre les 3 images
- ✅ Couleurs vives et modernes

---

## 👥 Les 3 Conseillers

### **Emma** - `emma.png`
- 💼 Experte en Investissement
- Couleurs suggérées : Violet/Rose (#8B5CF6, #EC4899)
- Personnalité : Professionnelle, stratégique

### **Alex** - `alex.png`
- 💰 Coach Budgétaire
- Couleurs suggérées : Bleu/Cyan (#3B82F6, #06B6D4)
- Personnalité : Accessible, pratique

### **Jules** - `jules.png`
- 📈 Planificateur Financier
- Couleurs suggérées : Vert/Lime (#10B981, #84CC16)
- Personnalité : Méthodique, organisé

---

## 🔧 Comment ajouter les images

### **Étape 1 : Créer le dossier**
```bash
mkdir assets/advisors
```

### **Étape 2 : Ajouter vos images**
Copiez vos 3 fichiers PNG dans `assets/advisors/` :
- `emma.png`
- `alex.png`
- `jules.png`

### **Étape 3 : Relancer l'app**
```bash
npm start -- --clear
```

---

## 🎯 Rendu dans l'app

Les images s'affichent dans :
1. ✅ **AdvisorSelectionScreen** - Sélection du conseiller (100x100px)
2. ✅ **ChatScreen** - Header du chat (à venir)
3. ✅ **Dashboard** - Badge du conseiller (à venir)

---

## ⚠️ Important

**Noms de fichiers exacts :**
- ❌ `Emma.png` - INCORRECT
- ✅ `emma.png` - CORRECT

**Les noms doivent être en minuscules !**

---

## 🎨 Exemples de styles de personnages

### **Style recommandé : Illustrations modernes**
- Flat design
- Couleurs vives
- Formes simples
- Fond transparent

### **Outils suggérés pour créer les personnages :**
- Figma (gratuit)
- Adobe Illustrator
- Canva (templates personnages)
- Midjourney / DALL-E (IA)

---

## 📊 Structure finale

```
assets/
└── advisors/
    ├── emma.png     (400x400px, PNG, ~300KB)
    ├── alex.png     (400x400px, PNG, ~300KB)
    └── jules.png    (400x400px, PNG, ~300KB)
```

---

## ✅ Checklist

- [ ] Dossier `assets/advisors/` créé
- [ ] `emma.png` ajouté
- [ ] `alex.png` ajouté
- [ ] `jules.png` ajouté
- [ ] Noms en minuscules
- [ ] Format PNG avec fond transparent
- [ ] App relancée avec `npm start -- --clear`

---

**Une fois les images ajoutées, elles s'afficheront automatiquement dans l'écran de sélection ! 🎉**
