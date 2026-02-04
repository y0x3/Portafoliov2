// src/data/catAnimations.js

export const catAnimationSystem = {
  states: {
    WALKING: 'walking',
    SITTING: 'sitting',
    STANDING: 'standing'
  },

  // 👇 Configuración por gato
  catProfiles: {
    Kuro: {
      name: 'Kuro',
      gifs: {
        walking: '/ui/gatos/kurowalking.gif',
        sitting: '/ui/gatos/kurositting.png',
        standing: '/ui/gatos/kurostanding.png'
      },
      speed: 2,
      color: '#ff0000' // Rosa para el nombre
    },
    Karawita: {
      name: 'Karawita',
      gifs: {
        walking: '/ui/gatos/karawitawalking.gif',
        sitting: '/ui/gatos/karawitasitting.png',
        standing: '/ui/gatos/karawitastanding.png'
      },
      speed: 1.5,
      color: '#FFD700' // Dorado para el nombre
    },
    Mishita: {
      name: 'Mishita',
      gifs: {
        walking: '/ui/gatos/MadamKuriwalinking.gif',
        sitting: '/ui/gatos/MadamKurisitting.png',
        standing: '/ui/gatos/MadamKuristanding.png'
      },
      speed: 2.5,
      color: '#87CEEB' // Azul cielo para el nombre
    }
  },

  transitions: {
    walking: ['sitting', 'standing'],
    sitting: ['standing', 'walking'],
    standing: ['sitting', 'walking']
  },

  getNextState(currentState) {
    const possibleStates = this.transitions[currentState];
    return possibleStates[Math.floor(Math.random() * possibleStates.length)];
  }
};