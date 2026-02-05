// src/data/catAnimations.js

// 🔥 Variable para almacenar la función de reproducción de sonido
let globalPlaySoundEffect = null;

// 🔥 NUEVO: Control de gatos bloqueados (no pueden recibir clicks)
const blockedCats = new Set(); // Set de nombres de gatos bloqueados

export const catAnimationSystem = {
  states: {
    WALKING: 'walking',
    SITTING: 'sitting',
    STANDING: 'standing',
    RUNNING: 'running',
    ANGRY: 'angry',
    LEAVING: 'leaving',
    SLEEPING: 'sleeping',
    LOVING: 'loving'
  },

  catProfiles: {
    Kuro: {
      name: 'Kuro',
      gifs: {
        walking: '/ui/gatos/kurowalking.gif',
        sitting: '/ui/gatos/kurositting.png',
        standing: '/ui/gatos/kurostanding.png',
        running: '/ui/gatos/kurowalking.gif',
        angry: '/ui/gatos/kurostanding.png',
        leaving: '/ui/gatos/kurowalking.gif',
        sleeping: '/ui/gatos/kurositting.png',
        loving: '/ui/gatos/kurowalking.gif'
      },
      sounds: {
        run: '/sounds/cat-run.mp3',
        angry: '/ui/gatos/kuroenojado.mp3',
        leave: '/sounds/cat-leave.mp3'
      },
      speed: 2,
      runSpeed: 5,
      color: '#ff0000',
      clickCount: 0,
      clickTimeout: null,
      personality: 'angry'
    },
    Karawita: {
      name: 'Karawita',
      gifs: {
        walking: '/ui/gatos/karawitawalking.gif',
        sitting: '/ui/gatos/karawitasitting.png',
        standing: '/ui/gatos/karawitastanding.png',
        running: '/ui/gatos/karawitawalking.gif',
        angry: '/ui/gatos/karawitastanding.png',
        leaving: '/ui/gatos/karawitawalking.gif',
        sleeping: '/ui/gatos/karawitasleeping.png',
        loving: '/ui/gatos/karawitawalking.gif'
      },
      sounds: {
        sleep: '/ui/gatos/karawitaronroneo.mp3'
      },
      speed: 1.5,
      runSpeed: 4.5,
      color: '#FFD700',
      clickCount: 0,
      clickTimeout: null,
      personality: 'sleepy'
    },
    Mishita: {
      name: 'Mishita',
      gifs: {
        walking: '/ui/gatos/MadamKuriwalinking.gif',
        sitting: '/ui/gatos/MadamKurisitting.png',
        standing: '/ui/gatos/MadamKuristanding.png',
        running: '/ui/gatos/MadamKuriwalinking.gif',
        angry: '/ui/gatos/MadamKuristanding.png',
        leaving: '/ui/gatos/MadamKuriwalinking.gif',
        sleeping: '/ui/gatos/MadamKurisitting.png',
        loving: '/ui/gatos/MadamKuriwalinking.gif'
      },
      sounds: {
        love: '/ui/gatos/mishitalove.mp3'
      },
      speed: 2.5,
      runSpeed: 6,
      color: '#87CEEB',
      clickCount: 0,
      clickTimeout: null,
      personality: 'loving'
    }
  },

  transitions: {
    walking: ['sitting', 'standing'],
    sitting: ['standing', 'walking'],
    standing: ['sitting', 'walking'],
    running: ['walking'],
    angry: ['leaving'],
    leaving: [],
    sleeping: ['walking'],
    loving: ['walking']
  },

  getNextState(currentState) {
    const possibleStates = this.transitions[currentState];
    if (!possibleStates || possibleStates.length === 0) return currentState;
    return possibleStates[Math.floor(Math.random() * possibleStates.length)];
  },

  setSoundEffectFunction(playSoundEffect) {
    globalPlaySoundEffect = playSoundEffect;
    console.log('✅ Función de sonido registrada en catAnimations');
  },

  // 🔥 Reproducir sonido simple
  playSound(soundPath) {
    if (!soundPath) return;
    
    console.log('🔊 Reproduciendo sonido:', soundPath);
    
    if (globalPlaySoundEffect) {
      globalPlaySoundEffect(soundPath);
      return;
    }
    
    // Fallback
    try {
      const audio = new Audio(soundPath);
      audio.volume = 0.2;
      audio.play().catch(err => {
        console.warn('⚠️ No se pudo reproducir:', err);
      });
    } catch (err) {
      console.error('❌ Error al crear audio:', err);
    }
  },

  // 🔥 NUEVO: Verificar si un gato está bloqueado
  isCatBlocked(catName) {
    return blockedCats.has(catName);
  },

  // 🔥 NUEVO: Bloquear gato por X tiempo
  blockCat(catName, duration) {
    console.log(`🔒 Bloqueando ${catName} por ${duration}ms`);
    blockedCats.add(catName);
    
    setTimeout(() => {
      blockedCats.delete(catName);
      console.log(`🔓 ${catName} desbloqueado`);
    }, duration);
  },

  handleCatClick(catName) {
    const profile = this.catProfiles[catName];
    if (!profile) return null;

    // 🔥 BLOQUEO: Si el gato está bloqueado, ignorar click
    if (this.isCatBlocked(catName)) {
      console.log(`⛔ ${catName} está bloqueado, ignorando click`);
      return null;
    }

    profile.clickCount++;

    if (profile.clickTimeout) {
      clearTimeout(profile.clickTimeout);
    }

    // KURO - Se enoja y se va
    if (profile.personality === 'angry') {
      if (profile.clickCount >= 2) {
        profile.clickCount = 0;
        this.playSound(profile.sounds.angry);
        
        const duration = 8000;
        this.blockCat(catName, duration); // 🔥 Bloquear
        
        return {
          action: 'leave',
          state: 'angry',
          duration: duration,
          sound: profile.sounds.leave
        };
      }

      profile.clickTimeout = setTimeout(() => {
        profile.clickCount = 0;
      }, 5000);

      this.playSound(profile.sounds.run);
      
      const duration = 3000;
      this.blockCat(catName, duration); // 🔥 Bloquear
      
      return {
        action: 'run',
        state: 'running',
        duration: duration
      };
    }

    // KARAWITA - Se duerme
    if (profile.personality === 'sleepy') {
      profile.clickCount = 0;
      this.playSound(profile.sounds.sleep);
      
      const duration = 13000;
      this.blockCat(catName, duration); // 🔥 Bloquear
      
      return {
        action: 'sleep',
        state: 'sleeping',
        duration: duration
      };
    }

    // MISHITA - Muestra amor y sigue el mouse
    if (profile.personality === 'loving') {
      profile.clickCount = 0;
      this.playSound(profile.sounds.love);
      
      const duration = 10000;
      this.blockCat(catName, duration); // 🔥 Bloquear
      
      return {
        action: 'love',
        state: 'loving',
        duration: duration
      };
    }

    return null;
  },

  resetClickCount(catName) {
    const profile = this.catProfiles[catName];
    if (profile) {
      profile.clickCount = 0;
      if (profile.clickTimeout) {
        clearTimeout(profile.clickTimeout);
        profile.clickTimeout = null;
      }
    }
    // 🔥 También desbloquear el gato
    blockedCats.delete(catName);
  }
};