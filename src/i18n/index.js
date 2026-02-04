import { createI18n } from 'vue-i18n'

const messages = {
  es: {
    window: {
      close: 'Cerrar',
      minimize: 'Minimizar',
      maximize: 'Maximizar'
    },
    funFacts: {
      title: '¿Sabías que...?',
      next: 'Otro dato curioso',
      end: 'Fin',
      finished: '¡Ya viste todos los datos curiosos! 🎉✨ Gracias por leer.'
    }
  },
  en: {
    window: {
      close: 'Close',
      minimize: 'Minimize',
      maximize: 'Maximize'
    },
    funFacts: {
      title: 'Did you know...?',
      next: 'Another fun fact',
      end: 'End',
      finished: 'You\'ve seen all the fun facts! 🎉✨ Thanks for reading.'
    }
  }
}

const i18n = createI18n({
  locale: 'es', // idioma por defecto
  fallbackLocale: 'en',
  messages
})

export default i18n