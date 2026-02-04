// src/data/clippyDialogs.js

export const dialogSystem = {
  intents: {
    // ============================================
    // SALUDO
    // ============================================
    greeting: {
      patterns: ['hola', 'hello', 'hi', 'buenas', 'hey'],
      responses: [
        "¡Hola! 👋 Soy Clippy, tu asistente personal. ¿En qué puedo ayudarte hoy?",
        "¡Hey! Bienvenido. Estoy aquí para ayudarte.",
        "¡Hola! ¿Qué te gustaría hacer?"
      ],
      animation: 'waving',
      buttons: [
        { id: 'help', label: '❓ ¿Qué puedes hacer?', intent: 'help_options' },
        { id: 'projects', label: '📂 Ver proyectos', intent: 'projects' },
        { id: 'contact', label: '📧 Contactar', intent: 'contact' },
        { id: 'my_cats', label: '🐱 Mis gatos', intent: 'my_cats' }
      ]
    },

    // ============================================
    // OPCIONES DE AYUDA
    // ============================================
    help_options: {
      patterns: ['ayuda', 'help', 'qué puedes hacer', 'opciones'],
      responses: [
        "Puedo ayudarte con varias cosas. ¿Qué te gustaría hacer?"
      ],
      animation: 'thinking',
      buttons: [
        { id: 'back', label: '⬅️ Volver al menú', intent: 'greeting' },
        { id: 'show_about', label: '👤 Sobre mí', intent: 'about_me' },
        { id: 'spotify', label: '🎵 Abrir Spotify', intent: 'open_spotify' },
        { id: 'fun', label: '🎮 Jugar algo', intent: 'games' },
        { id: 'hall_of_fame', label: '🏆 Salón de la Fama', intent: 'hall_of_fame' },
        { id: 'fun_fact', label: '🎲 Dato curioso', intent: 'fun_fact' }
      ]
    },

    // ============================================
    // PROYECTOS
    // ============================================
    projects: {
      patterns: ['proyectos', 'projects', 'portafolio', 'trabajos'],
      responses: [
        "¡Genial! Tengo varios proyectos interesantes. ¿Cuál te gustaría explorar?"
      ],
      animation: 'talking',
      buttons: [
        { 
          id: 'all_projects', 
          label: '🌐 Ver todos mis proyectos', 
          action: 'openWindow', 
          params: { app: 'internetexplorer' } 
        },
        { 
          id: 'github', 
          label: '💻 Ver repositorios de GitHub', 
          action: 'openWindow', 
          params: { app: 'github' } 
        },
        { id: 'back', label: '⬅️ Volver al menú', intent: 'help_options' }
      ]
    },

    // ============================================
    // SOBRE MÍ
    // ============================================
    about_me: {
      patterns: ['sobre ti', 'about', 'quien eres', 'cv', 'curriculum'],
      responses: [
        "¡Claro! Abriendo mi información para ti 👤",
        "¡Perfecto! Te muestro toda mi información profesional 💼"
      ],
      animation: 'talking',
      action: 'openWindow',
      params: { app: 'mycomputer' },
      buttons: [
        { id: 'back', label: '⬅️ Volver al menú', intent: 'help_options' }
      ]
    },

    // ============================================
    // CONTACTO
    // ============================================
    contact: {
      patterns: ['contacto', 'contact', 'email', 'escribir'],
      responses: [
        "¿Quieres contactar con Diego? Puedo abrirte su información de contacto."
      ],
      animation: 'talking',
      buttons: [
        { 
          id: 'open_outlook', 
          label: '📧 Abrir contactos', 
          action: 'openWindow', 
          params: { app: 'outlook' } 
        },
        { id: 'back', label: '⬅️ Volver', intent: 'help_options' }
      ]
    },

    // ============================================
    // SPOTIFY
    // ============================================
    open_spotify: {
      patterns: ['música', 'music', 'spotify', 'reproducir'],
      responses: [
        "¡Perfecto! Abriendo Spotify para ti 🎵",
        "¡Vamos a escuchar algo de música! 🎶"
      ],
      animation: 'celebrating',
      action: 'openWindow',
      params: { app: 'spotify' },
      buttons: [
        { id: 'back', label: '⬅️ Volver al menú', intent: 'help_options' }
      ]
    },

    // ============================================
    // JUEGOS
    // ============================================
    games: {
      patterns: ['juego', 'game', 'jugar', 'divertir'],
      responses: [
        "¿Quieres jugar? Tengo Buscaminas disponible."
      ],
      animation: 'celebrating',
      buttons: [
        { 
          id: 'minesweeper', 
          label: '💣 Jugar Buscaminas', 
          action: 'openWindow', 
          params: { app: 'minesweeper' } 
        },
        { id: 'back', label: '⬅️ Volver', intent: 'help_options' }
      ]
    },

    // ============================================
    // SALÓN DE LA FAMA
    // ============================================
    hall_of_fame: {
      patterns: ['salón de la fama', 'hall of fame', 'personajes', 'históricos'],
      responses: [
        "¡Excelente elección! Abriendo el Salón de la Fama con las mentes más brillantes de la historia 🏆"
      ],
      animation: 'celebrating',
      action: 'openWindow',
      params: { app: 'halloffame' },
      buttons: [
        { id: 'back', label: '⬅️ Volver al menú', intent: 'help_options' }
      ]
    },

    // ============================================
    // DATO CURIOSO
    // ============================================
    fun_fact: {
      patterns: ['dato curioso', 'fun fact', 'curiosidad', 'sabías que'],
      responses: [
        "¡Interesante! Abriendo un dato curioso para ti 🎲",
        "¡Prepárate para aprender algo nuevo! 💡"
      ],
      animation: 'thinking',
      action: 'openWindow',
      params: { app: 'funfact' },
      buttons: [
        { id: 'back', label: '⬅️ Volver al menú', intent: 'help_options' }
      ]
    },

    // ============================================
    // MIS GATOS
    // ============================================
    my_cats: {
      patterns: ['gatos', 'cats', 'gatitos', 'michis'],
      responses: [
        "Te presento a mis gatos",
        "¡Conoce a mis michis!"
      ],
      animation: 'celebrating',
      action: 'openWindow',
      params: { app: 'mycats' },
      buttons: [
        { id: 'back', label: '⬅️ Volver al menú', intent: 'greeting' }
      ]
    },

    // ============================================
    // DESPEDIDA
    // ============================================
    goodbye: {
      patterns: ['adiós', 'bye', 'chao', 'hasta luego'],
      responses: [
        "¡Hasta luego! Si necesitas algo más, aquí estaré 👋",
        "¡Nos vemos! No dudes en llamarme si necesitas ayuda."
      ],
      animation: 'waving',
      buttons: []
    }
  }  // 👈 Aquí cierra "intents" correctamente
};