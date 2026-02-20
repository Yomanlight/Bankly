import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  Animated,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function BalanceModal({ visible, onClose, currentBalance, onSave }) {
  const [amount, setAmount] = useState('');
  const [operation, setOperation] = useState('add'); // 'add' or 'subtract'
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const keyboardAnim = useRef(new Animated.Value(0)).current;

  // Gérer les événements du clavier
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        Animated.timing(keyboardAnim, {
          toValue: -e.endCoordinates.height / 2,
          duration: Platform.OS === 'ios' ? e.duration : 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (e) => {
        setKeyboardHeight(0);
        Animated.timing(keyboardAnim, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? e.duration : 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Montant invalide', 'Veuillez entrer un montant valide');
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const amountValue = parseFloat(amount);
    const newBalance = operation === 'add' 
      ? currentBalance + amountValue 
      : currentBalance - amountValue;

    if (newBalance < 0) {
      Alert.alert('Solde insuffisant', 'Le solde ne peut pas être négatif');
      setIsLoading(false);
      return;
    }

    await onSave(newBalance);
    setIsLoading(false);
    setAmount('');
    onClose();
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setAmount('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
        </View>
      </TouchableWithoutFeedback>

      <Animated.View 
        style={[
          styles.modalContainer,
          {
            transform: [
              { translateY: Animated.add(slideAnim, keyboardAnim) }
            ],
          },
        ]}
      >
          <View style={styles.handle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Modifier le solde</Text>
              <Text style={styles.currentBalance}>Solde actuel: {currentBalance.toFixed(2)} €</Text>
            </View>

            {/* Operation Selector */}
            <View style={styles.operationSelector}>
          <TouchableOpacity
            style={[styles.operationButton, operation === 'add' && styles.operationButtonActive]}
            onPress={() => {
              setOperation('add');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={operation === 'add' ? ['#10B981', '#059669'] : ['#F3F4F6', '#F3F4F6']}
              style={styles.operationGradient}
            >
              <Ionicons 
                name="add-circle" 
                size={24} 
                color={operation === 'add' ? '#FFFFFF' : '#6B7280'} 
              />
              <Text style={[styles.operationText, operation === 'add' && styles.operationTextActive]}>
                Ajouter
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.operationButton, operation === 'subtract' && styles.operationButtonActive]}
            onPress={() => {
              setOperation('subtract');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={operation === 'subtract' ? ['#EF4444', '#DC2626'] : ['#F3F4F6', '#F3F4F6']}
              style={styles.operationGradient}
            >
              <Ionicons 
                name="remove-circle" 
                size={24} 
                color={operation === 'subtract' ? '#FFFFFF' : '#6B7280'} 
              />
              <Text style={[styles.operationText, operation === 'subtract' && styles.operationTextActive]}>
                Retirer
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Montant</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
            <Text style={styles.currency}>€</Text>
          </View>
        </View>

        {/* Preview */}
        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Nouveau solde</Text>
          <Text style={styles.previewValue}>
            {amount && parseFloat(amount) > 0
              ? (operation === 'add' 
                  ? (currentBalance + parseFloat(amount)).toFixed(2)
                  : (currentBalance - parseFloat(amount)).toFixed(2))
              : currentBalance.toFixed(2)} €
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, (!amount || isLoading) && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!amount || isLoading}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={amount && !isLoading ? ['#8B5CF6', '#7C3AED'] : ['#D1D5DB', '#D1D5DB']}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Sauvegarde...' : 'Confirmer'}
              </Text>
              {!isLoading && <Ionicons name="checkmark" size={20} color="#FFFFFF" />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 8,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#4B5563',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  currentBalance: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  operationSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  operationButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  operationButtonActive: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  operationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  operationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  operationTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4B5563',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingVertical: 12,
  },
  currency: {
    fontSize: 24,
    fontWeight: '600',
    color: '#9CA3AF',
    marginLeft: 8,
  },
  preview: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  previewValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4B5563',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
