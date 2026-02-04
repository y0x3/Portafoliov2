// ============================================
// DATOS HISTÓRICOS Y FILOSÓFICOS ALEATORIOS
// ============================================
export const historicalFacts = [
  {
    category: 'historia',
    fact: 'La Gran Muralla China es la única estructura hecha por el hombre visible desde el espacio.',
    year: '200 a.C.'
  },
  {
    category: 'filosofía',
    fact: '"Pienso, luego existo" - René Descartes. Esta frase resume el fundamento del pensamiento racional moderno.',
    author: 'René Descartes'
  },
  {
    category: 'ciencia',
    fact: 'Isaac Newton desarrolló las leyes del movimiento mientras estaba en cuarentena durante la peste bubónica de 1665.',
    year: '1665'
  },
  {
    category: 'historia',
    fact: 'Cleopatra vivió más cerca de la llegada del hombre a la Luna que de la construcción de las pirámides de Egipto.',
    year: '30 a.C.'
  },
  {
    category: 'filosofía',
    fact: '"El hombre es la medida de todas las cosas" - Protágoras. Fundamento del pensamiento humanista.',
    author: 'Protágoras'
  },
  {
    category: 'ciencia',
    fact: 'Marie Curie fue la primera persona en ganar dos Premios Nobel en diferentes ciencias (Física y Química).',
    year: '1903-1911'
  },
  {
    category: 'historia',
    fact: 'La imprenta de Gutenberg cambió el mundo en 1440, democratizando el acceso al conocimiento.',
    year: '1440'
  },
  {
    category: 'filosofía',
    fact: '"Solo sé que no sé nada" - Sócrates. La sabiduría comienza reconociendo nuestra ignorancia.',
    author: 'Sócrates'
  },
  {
    category: 'tecnología',
    fact: 'El primer ordenador programable, ENIAC, pesaba 27 toneladas y ocupaba una habitación entera.',
    year: '1945'
  },
  {
    category: 'historia',
    fact: 'Oxford University es más antigua que el Imperio Azteca. Oxford se fundó en 1096, los aztecas en 1325.',
    year: '1096'
  }
];

// ============================================
// SALÓN DE LA FAMA - FIGURAS HISTÓRICAS
// ============================================
export const hallOfFame = {
  scientists: [
    {
      name: 'Albert Einstein',
      field: 'Física',
      achievement: 'Teoría de la Relatividad',
      quote: 'La imaginación es más importante que el conocimiento.',
      year: '1879-1955',
      icon: '🧑‍🔬'
    },
    {
      name: 'Marie Curie',
      field: 'Física y Química',
      achievement: 'Pionera en radioactividad, primera mujer en ganar un Nobel',
      quote: 'Nada en la vida debe ser temido, solamente comprendido.',
      year: '1867-1934',
      icon: '👩‍🔬'
    },
    {
      name: 'Isaac Newton',
      field: 'Física y Matemáticas',
      achievement: 'Leyes del movimiento y gravitación universal',
      quote: 'Si he visto más lejos es porque estoy sentado sobre los hombros de gigantes.',
      year: '1643-1727',
      icon: '🍎'
    },
    {
      name: 'Nikola Tesla',
      field: 'Ingeniería Eléctrica',
      achievement: 'Corriente alterna, bobina de Tesla',
      quote: 'El presente es tuyo, pero el futuro es mío.',
      year: '1856-1943',
      icon: '⚡'
    }
  ],
  philosophers: [
    {
      name: 'Sócrates',
      field: 'Filosofía',
      achievement: 'Método socrático, fundamentos de la filosofía occidental',
      quote: 'Una vida sin examen no merece ser vivida.',
      year: '470-399 a.C.',
      icon: '🤔'
    },
    {
      name: 'Platón',
      field: 'Filosofía',
      achievement: 'Teoría de las Ideas, fundador de la Academia',
      quote: 'La necesidad es la madre de la invención.',
      year: '428-348 a.C.',
      icon: '📚'
    },
    {
      name: 'Aristóteles',
      field: 'Filosofía y Ciencia',
      achievement: 'Lógica, ética, política, biología',
      quote: 'Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto sino un hábito.',
      year: '384-322 a.C.',
      icon: '🎓'
    },
    {
      name: 'Confucio',
      field: 'Filosofía',
      achievement: 'Confucianismo, ética y moral',
      quote: 'Elige un trabajo que te guste y no tendrás que trabajar ni un día de tu vida.',
      year: '551-479 a.C.',
      icon: '☯️'
    }
  ],
  artists: [
    {
      name: 'Leonardo da Vinci',
      field: 'Arte, Ciencia, Ingeniería',
      achievement: 'La Mona Lisa, polímata del Renacimiento',
      quote: 'Aprender nunca cansa la mente.',
      year: '1452-1519',
      icon: '🎨'
    },
    {
      name: 'Ludwig van Beethoven',
      field: 'Música',
      achievement: 'Novena Sinfonía, transformó la música clásica',
      quote: 'La música es una revelación más alta que toda sabiduría y filosofía.',
      year: '1770-1827',
      icon: '🎼'
    },
    {
      name: 'Wolfgang Amadeus Mozart',
      field: 'Música',
      achievement: 'Prodigio musical, más de 600 obras',
      quote: 'La música no está en las notas, sino en el silencio entre ellas.',
      year: '1756-1791',
      icon: '🎵'
    }
  ],
  leaders: [
    {
      name: 'Mahatma Gandhi',
      field: 'Activismo Social',
      achievement: 'Independencia de India mediante la no violencia',
      quote: 'Sé el cambio que quieres ver en el mundo.',
      year: '1869-1948',
      icon: '🕊️'
    },
    {
      name: 'Nelson Mandela',
      field: 'Derechos Humanos',
      achievement: 'Lucha contra el apartheid, presidente de Sudáfrica',
      quote: 'La educación es el arma más poderosa que puedes usar para cambiar el mundo.',
      year: '1918-2013',
      icon: '✊'
    },
    {
      name: 'Martin Luther King Jr.',
      field: 'Derechos Civiles',
      achievement: 'Movimiento por los derechos civiles en EE.UU.',
      quote: 'Tengo un sueño de que un día esta nación se levante.',
      year: '1929-1968',
      icon: '✨'
    }
  ]
};

// ============================================
// BASE DE CONOCIMIENTO PARA PREGUNTAS BÁSICAS
// ============================================
export const knowledgeBase = {
  general: {
    '¿qué hora es?': () => {
      const now = new Date();
      return `Son las ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    },
    '¿qué día es?': () => {
      const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const now = new Date();
      return `Hoy es ${days[now.getDay()]}, ${now.getDate()}`;
    },
    '¿en qué año estamos?': () => {
      return `Estamos en el año ${new Date().getFullYear()}`;
    }
  },
  math: {
    patterns: [
      /cuánto es (\d+) \+ (\d+)/i,
      /cuánto es (\d+) - (\d+)/i,
      /cuánto es (\d+) \* (\d+)/i,
      /cuánto es (\d+) \/ (\d+)/i
    ],
    calculate: (match) => {
      const num1 = parseInt(match[1]);
      const num2 = parseInt(match[2]);
      const operation = match[0].includes('+') ? '+' : 
                       match[0].includes('-') ? '-' :
                       match[0].includes('*') ? '*' : '/';
      
      let result;
      switch(operation) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '*': result = num1 * num2; break;
        case '/': result = num2 !== 0 ? num1 / num2 : 'Error: División por cero'; break;
      }
      
      return `${num1} ${operation} ${num2} = ${result}`;
    }
  },
  definitions: {
    'qué es javascript': 'JavaScript es un lenguaje de programación interpretado, orientado a objetos y basado en prototipos.',
    'qué es html': 'HTML (HyperText Markup Language) es el lenguaje de marcado estándar para crear páginas web.',
    'qué es css': 'CSS (Cascading Style Sheets) es el lenguaje usado para describir la presentación de documentos HTML.',
    'qué es vue': 'Vue.js es un framework progresivo de JavaScript para construir interfaces de usuario.',
    'qué es react': 'React es una biblioteca de JavaScript para construir interfaces de usuario, mantenida por Meta.',
    'qué es python': 'Python es un lenguaje de programación de alto nivel, interpretado y de propósito general.',
    'qué es la ia': 'La Inteligencia Artificial es la simulación de procesos de inteligencia humana por sistemas informáticos.',
    'qué es internet': 'Internet es una red global de computadoras interconectadas que permite el intercambio de información.'
  }
};

// ============================================
// SISTEMA DE DIÁLOGOS MEJORADO
// ============================================
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
        { id: 'contact', label: '📧 Contactar', intent: 'contact' }
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
        { id: 'show_projects', label: '📂 Ver mis proyectos', intent: 'projects' },
        { id: 'show_about', label: '👤 Sobre mí', intent: 'about_me' },
        { id: 'show_skills', label: '💡 Mis habilidades', intent: 'skills' },
        { id: 'contact', label: '📧 Contactar', intent: 'contact' },
        { id: 'spotify', label: '🎵 Abrir Spotify', intent: 'open_spotify' },
        { id: 'fun', label: '🎮 Jugar algo', intent: 'games' },
        { id: 'learn', label: '📚 Aprender algo nuevo', intent: 'learning_menu' }
      ]
    },

    // ============================================
    // MENÚ DE APRENDIZAJE
    // ============================================
    learning_menu: {
      patterns: ['aprender', 'conocimiento', 'historia', 'filosofía', 'cultura'],
      responses: [
        "¡Genial! Me encanta compartir conocimiento. ¿Qué te interesa?"
      ],
      animation: 'thinking',
      buttons: [
        { id: 'random_fact', label: '💡 Dato histórico aleatorio', intent: 'random_fact' },
        { id: 'hall_of_fame', label: '🏆 Salón de la Fama', intent: 'hall_of_fame_menu' },
        { id: 'ask_question', label: '❓ Hacer una pregunta', intent: 'ask_question' },
        { id: 'back', label: '⬅️ Volver al menú', intent: 'help_options' }
      ]
    },

    // ============================================
    // DATO HISTÓRICO ALEATORIO
    // ============================================
    random_fact: {
      patterns: ['dato', 'fact', 'curiosidad', 'cuéntame algo'],
      responses: [],
      getDynamicResponse: () => {
        const fact = historicalFacts[Math.floor(Math.random() * historicalFacts.length)];
        let response = `📚 ${fact.fact}`;
        if (fact.year) response += `\n\n📅 Año: ${fact.year}`;
        if (fact.author) response += `\n\n✍️ ${fact.author}`;
        response += `\n\n🏷️ Categoría: ${fact.category}`;
        return response;
      },
      animation: 'talking',
      buttons: [
        { id: 'another_fact', label: '🔄 Otro dato', intent: 'random_fact' },
        { id: 'hall_of_fame', label: '🏆 Ver personajes históricos', intent: 'hall_of_fame_menu' },
        { id: 'back', label: '⬅️ Volver', intent: 'learning_menu' }
      ]
    },

    // ============================================
    // SALÓN DE LA FAMA - MENÚ
    // ============================================
    hall_of_fame_menu: {
      patterns: ['salón de la fama', 'personajes', 'figuras históricas'],
      responses: [
        "🏆 ¡Bienvenido al Salón de la Fama! Estas son las mentes más brillantes de la historia. ¿Qué categoría te interesa?"
      ],
      animation: 'celebrating',
      buttons: [
        { id: 'scientists', label: '🧑‍🔬 Científicos', intent: 'hall_scientists' },
        { id: 'philosophers', label: '🤔 Filósofos', intent: 'hall_philosophers' },
        { id: 'artists', label: '🎨 Artistas', intent: 'hall_artists' },
        { id: 'leaders', label: '✊ Líderes', intent: 'hall_leaders' },
        { id: 'back', label: '⬅️ Volver', intent: 'learning_menu' }
      ]
    },

    // ============================================
    // SALÓN DE LA FAMA - CIENTÍFICOS
    // ============================================
    hall_scientists: {
      patterns: ['científicos', 'ciencia'],
      responses: [],
      getDynamicResponse: () => {
        let response = "🧑‍🔬 **CIENTÍFICOS LEGENDARIOS**\n\n";
        hallOfFame.scientists.forEach(person => {
          response += `${person.icon} **${person.name}** (${person.year})\n`;
          response += `   📌 ${person.field}\n`;
          response += `   🏆 ${person.achievement}\n`;
          response += `   💬 "${person.quote}"\n\n`;
        });
        return response;
      },
      animation: 'talking',
      buttons: [
        { id: 'philosophers', label: '🤔 Ver Filósofos', intent: 'hall_philosophers' },
        { id: 'artists', label: '🎨 Ver Artistas', intent: 'hall_artists' },
        { id: 'back', label: '⬅️ Volver', intent: 'hall_of_fame_menu' }
      ]
    },

    // ============================================
    // SALÓN DE LA FAMA - FILÓSOFOS
    // ============================================
    hall_philosophers: {
      patterns: ['filósofos', 'filosofía'],
      responses: [],
      getDynamicResponse: () => {
        let response = "🤔 **FILÓSOFOS LEGENDARIOS**\n\n";
        hallOfFame.philosophers.forEach(person => {
          response += `${person.icon} **${person.name}** (${person.year})\n`;
          response += `   📌 ${person.field}\n`;
          response += `   🏆 ${person.achievement}\n`;
          response += `   💬 "${person.quote}"\n\n`;
        });
        return response;
      },
      animation: 'talking',
      buttons: [
        { id: 'scientists', label: '🧑‍🔬 Ver Científicos', intent: 'hall_scientists' },
        { id: 'artists', label: '🎨 Ver Artistas', intent: 'hall_artists' },
        { id: 'back', label: '⬅️ Volver', intent: 'hall_of_fame_menu' }
      ]
    },

    // ============================================
    // SALÓN DE LA FAMA - ARTISTAS
    // ============================================
    hall_artists: {
      patterns: ['artistas', 'arte', 'música'],
      responses: [],
      getDynamicResponse: () => {
        let response = "🎨 **ARTISTAS LEGENDARIOS**\n\n";
        hallOfFame.artists.forEach(person => {
          response += `${person.icon} **${person.name}** (${person.year})\n`;
          response += `   📌 ${person.field}\n`;
          response += `   🏆 ${person.achievement}\n`;
          response += `   💬 "${person.quote}"\n\n`;
        });
        return response;
      },
      animation: 'talking',
      buttons: [
        { id: 'scientists', label: '🧑‍🔬 Ver Científicos', intent: 'hall_scientists' },
        { id: 'leaders', label: '✊ Ver Líderes', intent: 'hall_leaders' },
        { id: 'back', label: '⬅️ Volver', intent: 'hall_of_fame_menu' }
      ]
    },

    // ============================================
    // SALÓN DE LA FAMA - LÍDERES
    // ============================================
    hall_leaders: {
      patterns: ['líderes', 'activistas'],
      responses: [],
      getDynamicResponse: () => {
        let response = "✊ **LÍDERES LEGENDARIOS**\n\n";
        hallOfFame.leaders.forEach(person => {
          response += `${person.icon} **${person.name}** (${person.year})\n`;
          response += `   📌 ${person.field}\n`;
          response += `   🏆 ${person.achievement}\n`;
          response += `   💬 "${person.quote}"\n\n`;
        });
        return response;
      },
      animation: 'talking',
      buttons: [
        { id: 'scientists', label: '🧑‍🔬 Ver Científicos', intent: 'hall_scientists' },
        { id: 'philosophers', label: '🤔 Ver Filósofos', intent: 'hall_philosophers' },
        { id: 'back', label: '⬅️ Volver', intent: 'hall_of_fame_menu' }
      ]
    },

    // ============================================
    // HACER PREGUNTA
    // ============================================
    ask_question: {
      patterns: ['pregunta', 'question', 'dime', 'explica'],
      responses: [
        "¡Claro! Puedo responder preguntas sobre tecnología, matemáticas, o información general. ¿Qué quieres saber?"
      ],
      animation: 'thinking',
      buttons: [
        { id: 'back', label: '⬅️ Volver', intent: 'learning_menu' }
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
        "¿Quieres conocer más sobre Diego? Te puedo mostrar su información."
      ],
      animation: 'talking',
      buttons: [
        { 
          id: 'open_mypc', 
          label: '👤 Ver perfil completo', 
          action: 'openWindow', 
          params: { app: 'mycomputer' } 
        },
        { 
          id: 'open_docs', 
          label: '📄 Ver documentos', 
          action: 'openWindow', 
          params: { app: 'documents' } 
        },
        { id: 'back', label: '⬅️ Volver', intent: 'help_options' }
      ]
    },

    // ============================================
    // HABILIDADES
    // ============================================
    skills: {
      patterns: ['habilidades', 'skills', 'tecnologías', 'stack'],
      responses: [
        "Diego tiene experiencia en varias tecnologías. ¿Quieres ver su perfil completo?"
      ],
      animation: 'thinking',
      buttons: [
        { 
          id: 'open_profile', 
          label: '💡 Ver habilidades completas', 
          action: 'openWindow', 
          params: { app: 'mycomputer' } 
        },
        { id: 'back', label: '⬅️ Volver', intent: 'help_options' }
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
  },

  // ============================================
  // PROCESADOR DE MENSAJES
  // ============================================
  processMessage(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // 1. Verificar preguntas de conocimiento general
    for (const [question, answer] of Object.entries(knowledgeBase.general)) {
      if (lowerMessage.includes(question)) {
        return {
          response: typeof answer === 'function' ? answer() : answer,
          animation: 'talking',
          buttons: [
            { id: 'another', label: '❓ Otra pregunta', intent: 'ask_question' },
            { id: 'back', label: '⬅️ Volver', intent: 'learning_menu' }
          ]
        };
      }
    }
    
    // 2. Verificar operaciones matemáticas
    for (const pattern of knowledgeBase.math.patterns) {
      const match = lowerMessage.match(pattern);
      if (match) {
        return {
          response: `🔢 ${knowledgeBase.math.calculate(match)}`,
          animation: 'thinking',
          buttons: [
            { id: 'another', label: '🔢 Otro cálculo', intent: 'ask_question' },
            { id: 'back', label: '⬅️ Volver', intent: 'learning_menu' }
          ]
        };
      }
    }
    
    // 3. Verificar definiciones
    for (const [key, definition] of Object.entries(knowledgeBase.definitions)) {
      if (lowerMessage.includes(key)) {
        return {
          response: `📖 ${definition}`,
          animation: 'talking',
          buttons: [
            { id: 'another', label: '❓ Otra pregunta', intent: 'ask_question' },
            { id: 'back', label: '⬅️ Volver', intent: 'learning_menu' }
          ]
        };
      }
    }
    
    // 4. Verificar intents normales
    for (const [intentName, intent] of Object.entries(this.intents)) {
      for (const pattern of intent.patterns) {
        if (lowerMessage.includes(pattern)) {
          // Si tiene getDynamicResponse, usarlo
          let response;
          if (intent.getDynamicResponse) {
            response = intent.getDynamicResponse();
          } else {
            response = Array.isArray(intent.responses)
              ? intent.responses[Math.floor(Math.random() * intent.responses.length)]
              : intent.responses;
          }
          
          return {
            response: response,
            animation: intent.animation || 'talking',
            buttons: intent.buttons || [],
            action: intent.action,
            params: intent.params
          };
        }
      }
    }
    
    // 5. Respuesta por defecto
    return {
      response: "🤔 No estoy seguro de entender. ¿Quieres que te muestre lo que puedo hacer?",
      animation: 'thinking',
      buttons: [
        { id: 'help', label: '❓ Ver opciones', intent: 'help_options' },
        { id: 'learn', label: '📚 Aprender algo', intent: 'learning_menu' }
      ]
    };
  },
  
  // ============================================
  // PROCESADOR DE INTENTS (para uso directo)
  // ============================================
  getIntent(intentName) {
    const intent = this.intents[intentName];
    if (!intent) return null;
    
    // Si tiene getDynamicResponse, usarlo
    let response;
    if (intent.getDynamicResponse) {
      response = intent.getDynamicResponse();
    } else {
      response = Array.isArray(intent.responses)
        ? intent.responses[Math.floor(Math.random() * intent.responses.length)]
        : intent.responses;
    }
    
    return {
      response: response,
      animation: intent.animation || 'talking',
      buttons: intent.buttons || [],
      action: intent.action,
      params: intent.params
    };
  }
};