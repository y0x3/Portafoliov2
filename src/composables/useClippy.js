// src/composables/useClippy.js
import { ref, computed, inject } from 'vue';
import { dialogSystem } from './clippyDialogs';

export function useClippy() {
  const isChatOpen = ref(false);
  const currentIntent = ref('greeting');
  const currentAnimation = ref('idle');
  const conversationHistory = ref([]);
  const userInput = ref('');
  
  // Inyectar windowManager desde Home.vue
  const windowManager = inject('windowManager');
  
  // ============================================
  // COMPUTED
  // ============================================
  const currentIntentData = computed(() => {
    return dialogSystem.intents[currentIntent.value] || {};
  });
  
  const currentMessage = computed(() => {
    const responses = currentIntentData.value.responses || [];
    if (responses.length === 0) return 'Hola, ¿en qué puedo ayudarte?';
    return responses[Math.floor(Math.random() * responses.length)];
  });
  
  const currentButtons = computed(() => {
    return currentIntentData.value.buttons || [];
  });
  
  const allowTextInput = computed(() => {
    return currentIntentData.value.allowInput !== false;
  });
  
  // ============================================
  // FUNCIONES
  // ============================================
  
  // Cambiar animación temporalmente
  const setAnimation = (anim, duration = 3000) => {
    currentAnimation.value = anim;
    setTimeout(() => {
      currentAnimation.value = 'idle';
    }, duration);
  };
  
  // Procesar un intent
  const processIntent = (intentId) => {
    const intent = dialogSystem.intents[intentId];
    if (!intent) {
      console.warn('Intent no encontrado:', intentId);
      return;
    }
    
    currentIntent.value = intentId;
    
    // Agregar mensaje al historial
    conversationHistory.value.push({
      type: 'assistant',
      message: currentMessage.value,
      timestamp: Date.now()
    });
    
    // Cambiar animación
    if (intent.animation) {
      setAnimation(intent.animation);
    }
    
    // Ejecutar acción si existe
    if (intent.action) {
      executeAction(intent.action, intent.params);
    }
  };
  
  // Ejecutar acciones
  const executeAction = (action, params = {}) => {
    if (action === 'openWindow' && windowManager && params.app) {
      setTimeout(() => {
        windowManager.openWindow(params.app, params.data);
        setAnimation('celebrating', 2000);
      }, 500);
    }
  };
  
  // Manejar click en botón
  const handleButtonClick = (button) => {
    console.log('🔘 Clippy: Botón clickeado:', button);
    
    // Agregar selección del usuario al historial
    conversationHistory.value.push({
      type: 'user',
      message: button.label,
      timestamp: Date.now()
    });
    
    // Si el botón tiene una acción directa
    if (button.action) {
      executeAction(button.action, button.params);
    }
    
    // Si el botón lleva a otro intent
    if (button.intent) {
      setTimeout(() => {
        processIntent(button.intent);
      }, 300);
    }
  };
  
  // Enviar mensaje de texto
  const sendMessage = (message) => {
    if (!message || !message.trim()) return;
    
    console.log('💬 Clippy: Mensaje recibido:', message);
    
    // Agregar al historial
    conversationHistory.value.push({
      type: 'user',
      message: message,
      timestamp: Date.now()
    });
    
    // Buscar intent que coincida
    const matchedIntent = findMatchingIntent(message);
    
    if (matchedIntent) {
      setTimeout(() => {
        processIntent(matchedIntent);
      }, 500);
    } else {
      // No entendió, mostrar opciones de ayuda
      setTimeout(() => {
        currentIntent.value = 'help_options';
        conversationHistory.value.push({
          type: 'assistant',
          message: 'No estoy seguro de entender. ¿Puedo ayudarte con algo de esto?',
          timestamp: Date.now()
        });
        setAnimation('confused');
      }, 500);
    }
  };
  
  // Buscar intent que coincida con el texto
  const findMatchingIntent = (text) => {
    const lowerText = text.toLowerCase();
    
    for (const [intentId, intent] of Object.entries(dialogSystem.intents)) {
      if (intent.patterns && intent.patterns.some(pattern => 
        lowerText.includes(pattern.toLowerCase())
      )) {
        return intentId;
      }
    }
    
    return null;
  };
  
  // Toggle chat
  const toggleChat = () => {
    isChatOpen.value = !isChatOpen.value;
    
    if (isChatOpen.value) {
      // Al abrir, mostrar saludo
      processIntent('greeting');
    }
  };
  
  // Cerrar chat
  const closeChat = () => {
    isChatOpen.value = false;
    setAnimation('waving', 2000);
  };
  
  // Mostrar saludo inicial (llamado desde ClippyAssistant)
  const showGreeting = () => {
    if (!isChatOpen.value) {
      setAnimation('waving', 3000);
    }
  };
  
  return {
    // Estado
    isChatOpen,
    currentMessage,
    currentAnimation,
    currentButtons,
    conversationHistory,
    allowTextInput,
    userInput,
    
    // Funciones
    toggleChat,
    closeChat,
    handleButtonClick,
    sendMessage,
    showGreeting
  };
}