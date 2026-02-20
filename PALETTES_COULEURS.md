# 🎨 Palettes de Couleurs - BankUP

## Vue d'Ensemble

L'application BankUP utilise deux palettes de couleurs complètes pour offrir une expérience optimale en mode sombre et clair.

---

## 🌙 DARK MODE (Thème par Défaut)

### Couleurs Principales
| Nom | Hex | Utilisation | Exemple |
|-----|-----|-------------|---------|
| **Primary** | `#8B5CF6` | Boutons, liens, accents | 🟣 Violet principal |
| **Primary Dark** | `#7C3AED` | Dégradés, hover | 🟣 Violet foncé |
| **Primary Light** | `#A78BFA` | Highlights, badges | 🟣 Violet clair |

### Arrière-plans
| Nom | Hex | Utilisation |
|-----|-----|-------------|
| **Background** | `#0A0A0A` | Fond principal (noir profond) |
| **Background Secondary** | `#1A1A1A` | Fond secondaire, dégradés |
| **Card** | `#1F1F1F` | Cartes, conteneurs |
| **Input Background** | `#161616` | Champs de saisie |

### Textes
| Nom | Hex | Utilisation |
|-----|-----|-------------|
| **Text** | `#FFFFFF` | Texte principal (blanc) |
| **Text Secondary** | `#9CA3AF` | Texte secondaire (gris moyen) |
| **Text Muted** | `#6B7280` | Texte désactivé, placeholders |

### États & Actions
| Nom | Hex | Utilisation | Emoji |
|-----|-----|-------------|-------|
| **Success** | `#10B981` | Succès, validations | ✅ Vert |
| **Error** | `#EF4444` | Erreurs, alertes | ❌ Rouge |
| **Warning** | `#F59E0B` | Avertissements, info | ⚠️ Orange |

### Bordures
| Nom | Hex | Utilisation |
|-----|-----|-------------|
| **Border** | `#2D2D2D` | Séparateurs, contours |

---

## ☀️ LIGHT MODE

### Couleurs Principales
| Nom | Hex | Utilisation | Exemple |
|-----|-----|-------------|---------|
| **Primary** | `#8B5CF6` | Boutons, liens, accents | 🟣 Violet (identique) |
| **Primary Dark** | `#7C3AED` | Dégradés, hover | 🟣 Violet foncé |
| **Primary Light** | `#A78BFA` | Highlights, badges | 🟣 Violet clair |

### Arrière-plans
| Nom | Hex | Utilisation |
|-----|-----|-------------|
| **Background** | `#FFFFFF` | Fond principal (blanc) |
| **Background Secondary** | `#F9FAFB` | Fond secondaire, subtil |
| **Card** | `#FFFFFF` | Cartes (avec ombres) |
| **Input Background** | `#F9FAFB` | Champs de saisie |

### Textes
| Nom | Hex | Utilisation |
|-----|-----|-------------|
| **Text** | `#1F2937` | Texte principal (gris très foncé) |
| **Text Secondary** | `#6B7280` | Texte secondaire |
| **Text Muted** | `#9CA3AF` | Texte désactivé, placeholders |

### États & Actions
| Nom | Hex | Utilisation | Emoji |
|-----|-----|-------------|-------|
| **Success** | `#10B981` | Succès, validations | ✅ Vert (identique) |
| **Error** | `#EF4444` | Erreurs, alertes | ❌ Rouge (identique) |
| **Warning** | `#F59E0B` | Avertissements | ⚠️ Orange (identique) |

### Bordures
| Nom | Hex | Utilisation |
|-----|-----|-------------|
| **Border** | `#E5E7EB` | Séparateurs, contours (gris clair) |

---

## 📝 Guide d'Utilisation

### Comment utiliser les couleurs dans le code

```javascript
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { colors } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Bonjour</Text>
      <Button color={colors.primary} />
    </View>
  );
}
```

### Transparence et Opacité

Pour ajouter de la transparence, utilisez la notation avec opacité:

```javascript
// 20% d'opacité
backgroundColor: colors.primary + '20'

// 50% d'opacité  
backgroundColor: colors.primary + '80'

// Exemples d'utilisation
<View style={{ backgroundColor: colors.primary + '20' }}>
  {/* Fond violet très léger */}
</View>
```

### Dégradés

```javascript
<LinearGradient
  colors={[colors.primary, colors.primaryDark]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  {/* Contenu */}
</LinearGradient>
```

---

## 🎯 Principes de Design

### Contraste
- **Dark Mode:** Contraste élevé (blanc sur noir)
- **Light Mode:** Contraste suffisant (gris foncé sur blanc)
- Les deux modes respectent les standards WCAG AA

### Hiérarchie Visuelle
1. **Texte principal:** `colors.text`
2. **Texte secondaire:** `colors.textSecondary`
3. **Texte désactivé:** `colors.textMuted`

### Couleurs d'Action
- **Actions principales:** `colors.primary` (Violet)
- **Actions positives:** `colors.success` (Vert)
- **Actions destructrices:** `colors.error` (Rouge)
- **Avertissements:** `colors.warning` (Orange)

### Espacement et Respirabilité
- Utilisez `colors.card` pour les conteneurs
- `colors.border` pour les séparateurs subtils
- `colors.backgroundSecondary` pour les sections alternées

---

## 🔄 Comparaison Visuelle

### Dark Mode
```
┌─────────────────────────────────┐
│  #0A0A0A (Background)           │
│  ┌───────────────────────────┐  │
│  │ #1F1F1F (Card)            │  │
│  │                           │  │
│  │ #FFFFFF (Text)            │  │
│  │ #9CA3AF (Text Secondary)  │  │
│  │                           │  │
│  │ ┌─────────────────────┐   │  │
│  │ │ #8B5CF6 (Button)    │   │  │
│  │ └─────────────────────┘   │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### Light Mode
```
┌─────────────────────────────────┐
│  #FFFFFF (Background)           │
│  ┌───────────────────────────┐  │
│  │ #FFFFFF (Card + Shadow)   │  │
│  │                           │  │
│  │ #1F2937 (Text)            │  │
│  │ #6B7280 (Text Secondary)  │  │
│  │                           │  │
│  │ ┌─────────────────────┐   │  │
│  │ │ #8B5CF6 (Button)    │   │  │
│  │ └─────────────────────┘   │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## 🎨 Palette Complète (Référence Rapide)

### Dark Mode Hex Codes
```
Primary:      #8B5CF6
PrimaryDark:  #7C3AED
PrimaryLight: #A78BFA
Background:   #0A0A0A
BgSecondary:  #1A1A1A
Card:         #1F1F1F
Text:         #FFFFFF
TextSecond:   #9CA3AF
TextMuted:    #6B7280
Success:      #10B981
Error:        #EF4444
Warning:      #F59E0B
Border:       #2D2D2D
Input:        #161616
```

### Light Mode Hex Codes
```
Primary:      #8B5CF6
PrimaryDark:  #7C3AED
PrimaryLight: #A78BFA
Background:   #FFFFFF
BgSecondary:  #F9FAFB
Card:         #FFFFFF
Text:         #1F2937
TextSecond:   #6B7280
TextMuted:    #9CA3AF
Success:      #10B981
Error:        #EF4444
Warning:      #F59E0B
Border:       #E5E7EB
Input:        #F9FAFB
```

---

## 🔧 Configuration

Les couleurs sont définies dans:
- **Fichier:** `/constants/Colors.js`
- **Exports:** `DarkColors`, `LightColors`, `Colors` (par défaut)

Le thème actif est géré par:
- **Context:** `/context/ThemeContext.js`
- **Hook:** `useTheme()`
- **Persistance:** AsyncStorage

---

**Palette Design:** Inspirée de Tailwind CSS et adaptée pour une app financière moderne.
