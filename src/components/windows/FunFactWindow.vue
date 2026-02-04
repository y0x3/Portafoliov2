<template>
  <WindowBase
    :title="windowTitle"
    :icon="windowIcon"
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    :is-maximized="isMaximized"
    :is-active="isActive"
    :is-minimized="isMinimized"
    :z-index="zIndex"
    :show-toolbar="false"
    :show-sidebar="false"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
  >
    <!-- Contenido principal -->
    <div class="fun-fact-window">
      <div class="fun-fact-header">
        <div class="icon">🎲</div>
        <h2>¿Sabías que...?</h2>
      </div>

      <div class="fun-fact-content">
        <div class="fact-card">
          <p class="fact-text">{{ currentFact }}</p>
        </div>

        <div class="fun-fact-footer">
          <button
            @click="getNewFact"
            class="next-btn"
            :class="{ 'disabled-btn': noMoreFacts }"
            :disabled="noMoreFacts"
          >
            {{ noMoreFacts ? '🎉 Fin' : '🔄 Otro dato curioso' }}
          </button>
        </div>
      </div>
    </div>
  </WindowBase>
</template>

<script>
import WindowBase from '../WindowBase.vue';

export default {
  name: 'FunFactWindow',
  components: {
    WindowBase
  },
  props: {
    x: { type: Number, default: 100 },
    y: { type: Number, default: 50 },
    width: { type: Number, default: 500 },
    height: { type: Number, default: 400 },
    isMaximized: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isMinimized: { type: Boolean, default: false },
    zIndex: { type: Number, default: 1 }
  },
  emits: ['close', 'minimize', 'maximize', 'focus'],
  data() {
    return {
      windowTitle: '¿Sabías que...?',
      windowIcon: '/ui/iconos/vite.svg',
      noMoreFacts: false,

      funFacts: [
        "El primer ratón de computadora fue inventado en 1964 por Douglas Engelbart. Estaba hecho de madera con dos ruedas de metal. 🖱️",
        "El término 'bug' viene de 1947 cuando Grace Hopper encontró una polilla real en el Mark II. La guardó y escribió 'First actual case of bug being found'. 🐛",
        "El primer videojuego comercial fue Computer Space en 1971. Pong salió en 1972 y fue el primero en ser masivamente exitoso. 🎮",
        "Python fue nombrado así por Guido van Rossum en honor a 'Monty Python's Flying Circus', su show de comedia favorito. 🐍",
        "El primer emoji fue creado en 1999 por Shigetaka Kurita para NTT DoCoMo. Eran 176 símbolos de 12×12 píxeles. 😊",
        "El primer disco duro de 1 GB fue el IBM 3380 en 1980. Pesaba 250 kg y costaba entre $40,000-$200,000 dólares. 💾",
        "La primera página web fue creada por Tim Berners-Lee el 6 de agosto de 1991. Aún está accesible en http://info.cern.ch 🌐",
        "Java se llamó originalmente Oak, luego Green, y finalmente Java por el café que tomaba el equipo de desarrollo. ☕",
        "Creeper (1971) fue el primer programa autorreplicante. Bob Thomas lo creó para ARPANET y mostraba: 'I'M THE CREEPER: CATCH ME IF YOU CAN'. 🦠",
        "Wi-Fi es una marca comercial de Wi-Fi Alliance. No significa nada, fue elegida porque sonaba como Hi-Fi. 📡",
        "Ray Tomlinson envió el primer email en 1971 entre dos computadoras junto a él. No recuerda el mensaje, probablemente 'QWERTYUIOP'. 📧",
        "Según estudios de 2023, '123456' sigue siendo la contraseña más común, seguida de '123456789' y 'password'. 🔐",
        "Brian Eno compuso el sonido de Windows 95 en un Mac. Le tomó semanas crear los 3.25 segundos finales. 🎵",
        "Symbolics.com fue el primer dominio .com registrado el 15 de marzo de 1985. Aún existe como sitio web histórico. 🌐",
        "Larry Tesler de Xerox PARC inventó copiar/cortar/pegar en 1973. Apple lo adoptó en 1983 y Microsoft en 1987. ⌨️",
        "Dennis Ritchie creó el lenguaje C entre 1972-1973 en Bell Labs. Diseñó C para reescribir Unix. 💻",
        "Linus Torvalds creó Git en 2005 por necesidad. El sistema anterior (BitKeeper) dejó de ser gratuito para Linux. 🐧",
        "El IBM Simon lanzado en 1994 tenía pantalla táctil, email y apps. Costaba $1,100 dólares con contrato. 📱",
        "El software del Apollo 11 (1969) fue programado por Margaret Hamilton y su equipo. Tenía solo 72KB de memoria. 🚀",
        "El error 404 viene del 'Room 404' en el CERN donde estaba el servidor web original. Es una leyenda urbana, en realidad es el código HTTP. 🔍",
        "YouTube fue lanzado el 14 de febrero de 2005 por tres ex-empleados de PayPal. El primer video fue 'Me at the zoo' de 18 segundos. 🎥",
        "El robot de Android fue diseñado por Irina Blok en 2007. Se inspiró en los símbolos de los baños públicos. 🤖",
        "Ada Lovelace escribió el primer algoritmo para la máquina analítica de Babbage en 1843. Es considerada la primera programadora. 👩‍💻",
        "Minecraft usa texturas de 16×16 píxeles por bloque desde su creación en 2009. Los paquetes de recursos pueden cambiar esto. ⛏️",
        "El término 'pixel' fue acuñado en 1965, combinando 'picture' y 'element' por ingenieros de Standford. 🖼️",
        "Nintendo y Sony desarrollaron juntos la PlayStation, pero rompieron el acuerdo en 1991. Sony continuó sola y lanzó la PS1 en 1994. 🎮",
        "El teclado QWERTY fue patentado por Christopher Sholes en 1878 para máquinas de escribir. Separaba letras comunes para evitar atascos. ⌨️",
        "Google se llamó 'BackRub' en 1996 porque analizaba los 'back links'. Larry Page y Sergey Brin lo renombraron a 'Googol' pero lo escribieron mal. 🔍",
        "El icono de guardar 💾 representa un floppy disk de 3.5 pulgadas. Sony dejó de producirlos en 2011. 💾",
        "El Xerox Alto (1973) fue el primer ordenador con GUI. Costaba $40,000 y nunca se vendió comercialmente. Steve Jobs lo vio en 1979. 🖥️",
        "Brendan Eich creó JavaScript en 10 días en mayo de 1995 para Netscape. Originalmente se llamó Mocha, luego LiveScript. ⚡",
        "La primera webcam (1991) en Cambridge vigilaba una cafetera Trojan para saber si había café sin levantarse. Funcionó hasta 2001. ☕",
        "El código del Apollo Guidance Computer está en GitHub desde 2016. Tiene comentarios graciosos de los programadores de 1969. 🚀",
        "El 'beep' del PC original de IBM (1981) venía del speaker interno y se usaba para diagnósticos POST al encender. 🔊",
        "Jack Dorsey envió el primer tweet el 21 de marzo de 2006 a las 9:50pm: 'just setting up my twttr'. Twitter se llamaba 'twttr' inicialmente. 🐦",
        "Android nombró versiones 1.5-9.0 con postres en orden alfabético: Cupcake, Donut, Eclair... hasta Pie. Desde 10.0 solo usan números. 🍰",
        "Las pantallas OLED consumen menos batería en modo oscuro porque los píxeles negros están apagados. En LCD están encendidos con filtro negro. 🌙",
        "Tim Berners-Lee especificó HTML en 1991. La primera versión tenía 18 elementos. HTML5 (2014) tiene más de 100. 🏗️",
        "El Xerox Alto (1973) tenía un ratón de tres botones. Apple Lisa (1983) lo redujo a uno. El mouse de DOS tenía dos botones. 🖱️",
        "El primer antivirus comercial fue desarrollado en 1987 por Andreas Lüning y Kai Figge (Ultimate Virus Killer) para Atari ST. 🛡️",
        "Los disquetes de 3.5 pulgadas (1984) tenían una carcasa rígida de plástico para proteger el disco magnético. Almacenaban 1.44 MB. 💾",
        "El procesador Intel 4004 (1971) fue el primer microprocesador comercial. Tenía 2,300 transistores y corría a 740 KHz. 🔧",
        "El lenguaje de programación COBOL fue creado en 1959 por Grace Hopper y su equipo. Todavía se usa en bancos y gobiernos. 🏦",
        "El Nokia 1011 (1992) fue el primer teléfono GSM masivo. Almacenaba 99 números y mostraba mensajes de texto en pantalla. 📱",
        "Steve Wozniak diseñó el Apple I en 1976 usando solo 60 chips. Se vendían por $666.66 porque a Woz le gustaban los números repetidos. 🍎",
        "El disco compacto (CD) fue desarrollado conjuntamente por Philips y Sony entre 1979-1982. Los primeros se vendieron en 1982 en Japón. 💿",
        "Linux fue anunciado por Linus Torvalds el 25 de agosto de 1991 en un mensaje de Usenet como 'un sistema operativo gratis'. 🐧",
        "El protocolo TCP/IP fue diseñado por Vint Cerf y Bob Kahn en 1973. Se convirtió en estándar de ARPANET en 1983. 🌐",
        "La impresora de matriz de puntos fue inventada en 1968 por OKI. Las agujas golpeaban una cinta entintada contra el papel. 🖨️",
        "El USB fue desarrollado por Intel, Microsoft, IBM y otros en 1996. USB 1.0 transfería datos a 1.5 Mb/s. 🔌",
        "La memoria RAM dinámica (DRAM) fue inventada por Robert Dennard de IBM en 1968. Revolucionó la informática personal. 🧠"
      ],

      usedFactIds: [],
      currentFact: ''
    };
  },
  mounted() {
    this.getNewFact();
  },
  methods: {
    getNewFact() {
      // Si ya no hay más datos
      if (this.usedFactIds.length >= this.funFacts.length) {
        return; // No hacer nada si ya se acabaron
      }

      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * this.funFacts.length);
      } while (this.usedFactIds.includes(randomIndex));

      this.usedFactIds.push(randomIndex);
      this.currentFact = this.funFacts[randomIndex];

      // Verificar si acabamos de mostrar el último dato
      if (this.usedFactIds.length >= this.funFacts.length) {
        this.noMoreFacts = true;
        // Mostrar mensaje después de un breve delay
        setTimeout(() => {
          this.currentFact = '¡Ya viste todos los datos curiosos! 🎉✨ Gracias por leer.';
        }, 2000);
      }
    }
  }
};
</script>


<style scoped>
* {
  box-sizing: border-box;
}

.fun-fact-window {
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.fun-fact-header {
  text-align: center;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.fun-fact-header .icon {
  font-size: 2.5em;
  animation: float 3s ease-in-out infinite;
  display: inline-block;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.fun-fact-header h2 {
  margin: 10px 0;
  font-size: 1.5em;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 600;
}

.fun-fact-content {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.fact-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 10px;
  border-radius: 12px;
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  margin-bottom: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.fact-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
}

.fact-icon {
  font-size: 2em;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.fact-text {
  font-size: 1em;
  line-height: 1.6;
  margin: 0;
  color: #333333;
  font-weight: 500;
  padding: 15px;
}

.fun-fact-footer {
  text-align: center;
  flex-shrink: 0;
}

.next-btn {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.3);
  position: relative;
  overflow: hidden;
}

.next-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.next-btn:hover::before {
  width: 300px;
  height: 300px;
}

.next-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(74, 144, 226, 0.4);
}

.next-btn:active {
  transform: translateY(0px);
  box-shadow: 0 2px 4px rgba(74, 144, 226, 0.3);
}

.disabled-btn {
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%) !important;
  cursor: not-allowed !important;
  opacity: 0.7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.disabled-btn:hover {
  transform: none !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

.disabled-btn::before {
  display: none;
}
</style>