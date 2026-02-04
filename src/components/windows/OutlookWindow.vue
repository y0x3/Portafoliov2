<!-- src/components/windows/OutlookWindow.vue -->
<template>
  <WindowBase
    title="Outlook Express - Contactos"
    icon="/vite.svg"
    :show-toolbar="true"
    :show-sidebar="true"
    address-bar-text="Contactos"
    v-bind="$attrs"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
  >
    <!-- Sidebar -->
    <template #sidebar>
      <div class="sidebar-section">
        <div class="sidebar-title">Contactos</div>
        <div class="sidebar-content">
          <a href="#" class="sidebar-link" @click.prevent="scrollTo('github')">
            <img src="/ui/iconos/github.png" />
            GitHub
          </a>
          <a href="#" class="sidebar-link" @click.prevent="scrollTo('linkedin')">
            <img src="/ui/iconos/linkedin_icon.png" />
            LinkedIn
          </a>
          <a href="#" class="sidebar-link" @click.prevent="scrollTo('instagram')">
            <img src="/ui/iconos/Instagram Old.png" />
            Instagram
          </a>
          <a href="#" class="sidebar-link" @click.prevent="scrollTo('gmail')">
            <img src="/ui/iconos/icono-gmail.png" />
            Gmail
          </a>
          <a href="#" class="sidebar-link" @click.prevent="scrollTo('whatsapp')">
            <img src="/ui/iconos/Whatsapp.png" />
            WhatsApp
          </a>
        </div>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">Mensaje Directo</div>
        <div class="sidebar-content">
          <a href="#" class="sidebar-link" @click.prevent="scrollTo('direct-message')">
            <img src="/ui/iconos/icono-gmail.png" />
            Enviar Email
          </a>
        </div>
      </div>
    </template>

    <!-- Contenido principal -->
    <div class="outlook-content">
      <div class="outlook-header">
        <img src="/ui/iconos/Contacts.png" class="outlook-logo" />
        <div class="outlook-info">
          <h1>¡Contáctame!</h1>
          <p>Estoy disponible en múltiples plataformas</p>
        </div>
      </div>

      <div class="contacts-grid">
        <div 
          v-for="contact in contacts" 
          :key="contact.id"
          :id="contact.id"
          class="contact-card"
        >
          <div class="contact-icon">
            <img :src="contact.icon" :alt="contact.name" />
          </div>
          <div class="contact-info">
            <h3>{{ contact.name }}</h3>
            <p class="contact-description">{{ contact.description }}</p>
            <div class="contact-details">
              <span class="contact-type">{{ contact.type }}</span>
              <span class="contact-value" :class="{ 'blurred': !revealedContacts[contact.id] && contact.needsReveal }">
                {{ revealedContacts[contact.id] || !contact.needsReveal ? contact.value : contact.hiddenValue }}
              </span>
            </div>
            
            <!-- Si el contacto necesita revelarse -->
            <button 
              v-if="contact.needsReveal && !revealedContacts[contact.id]"
              @click="revealContact(contact.id)"
              class="contact-button reveal-button"
            >
              {{ contact.revealButtonText }}
            </button>
            
            <!-- Si ya está revelado o no necesita revelarse -->
            <a 
              v-else
              :href="contact.url" 
              target="_blank"
              class="contact-button"
              @click.stop
            >
              {{ contact.buttonText }}
            </a>
            
            <!-- Botón de copiar para contactos revelados -->
            <button
              v-if="contact.needsReveal && revealedContacts[contact.id]"
              @click="copyToClipboard(contact.value, contact.name)"
              class="copy-button"
              :class="{ 'copied': copiedContact === contact.id }"
            >
              {{ copiedContact === contact.id ? '✓ Copiado' : '📋 Copiar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Sección de mensaje directo -->
      <div id="direct-message" class="direct-message-section">
        <h2>📧 Envíame un mensaje directo</h2>
        <form class="message-form" @submit.prevent="sendMessage">
          <div class="form-group">
            <label>Tu nombre:</label>
            <input type="text" v-model="messageForm.name" required />
          </div>
          <div class="form-group">
            <label>Tu email:</label>
            <input type="email" v-model="messageForm.email" required />
          </div>
          <div class="form-group">
            <label>Mensaje:</label>
            <textarea v-model="messageForm.message" rows="5" required></textarea>
          </div>
          <button type="submit" class="send-button">Enviar Mensaje</button>
        </form>
      </div>
    </div>
  </WindowBase>
</template>

<script setup>
import { ref } from 'vue';
import WindowBase from '../WindowBase.vue';
import emailjs from '@emailjs/browser';

defineEmits(['close', 'minimize', 'maximize', 'focus']);

// Estado de contactos revelados
const revealedContacts = ref({});
const copiedContact = ref(null);

// Formulario de mensaje
const messageForm = ref({
  name: '',
  email: '',
  message: ''
});

const sendMessage = async () => {
  try {
   
    await emailjs.send(
      'service_unlzqwi',    
      'template_w8c90h3',   
      {
        from_name: messageForm.value.name,
        from_email: messageForm.value.email,
        message: messageForm.value.message,
        to_email: 'diegocontrerasmunoz123@gmail.com' 
      },
      't3W6m491dDVOxNiGG'      
    );

    alert('✅ ¡Mensaje enviado exitosamente!');
    
    // Resetear formulario
    messageForm.value = {
      name: '',
      email: '',
      message: ''
    };
  } catch (error) {
    console.error('Error al enviar:', error);
    alert('❌ Error al enviar el mensaje. Intenta de nuevo.');
  }
};

// Lista de contactos
const contacts = ref([
  {
    id: 'github',
    name: 'GitHub',
    description: 'Revisa mi código y proyectos open source',
    type: 'Username',
    value: '@y0x3',
    icon: '/ui/iconos/github.png',
    url: 'https://github.com/y0x3',
    buttonText: '💻 Ver GitHub',
    needsReveal: false
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Conectemos profesionalmente',
    type: 'Profile',
    value: 'Diego Contreras',
    icon: '/ui/iconos/linkedin_icon.png',
    url: 'https://www.linkedin.com/in/diegocontrerasmunoz/',
    buttonText: '🔗 Ver LinkedIn',
    needsReveal: false
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Sígueme para ver mi vida personal y proyectos creativos',
    type: 'Handle',
    value: '@y0x3sh',
    icon: '/ui/iconos/Instagram Old.png',
    url: 'https://www.instagram.com/y0x3sh/',
    buttonText: '📸 Seguir en Instagram',
    needsReveal: false
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Escríbeme por correo electrónico',
    type: 'Email',
    value: 'diegocontrerasmunoz123@gmail.com',
    hiddenValue: '••••••••••••@gmail.com',
    icon: '/ui/iconos/icono-gmail.png',
    url: 'mailto:diegocontrerasmunoz123@gmail.com',
    buttonText: '📧 Enviar Email',
    revealButtonText: '👁️ Ver Email',
    needsReveal: true
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Escríbeme directamente para consultas rápidas',
    type: 'Phone',
    value: '+52 771 263 7337',
    hiddenValue: '+52 ••• ••• ••••',
    icon: '/ui/iconos/Whatsapp.png',
    url: 'https://wa.me/527712637337',
    buttonText: '💬 Enviar WhatsApp',
    revealButtonText: '👁️ Ver Número',
    needsReveal: true
  }
]);

const scrollTo = (sectionId) => {
  const element = document.getElementById(sectionId);
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const revealContact = (contactId) => {
  revealedContacts.value[contactId] = true;
};

const copyToClipboard = async (text, contactName) => {
  try {
    await navigator.clipboard.writeText(text);
    copiedContact.value = contactName;
    
    // Resetear el estado después de 2 segundos
    setTimeout(() => {
      copiedContact.value = null;
    }, 2000);
  } catch (err) {
    console.error('Error al copiar:', err);
    alert('No se pudo copiar al portapapeles');
  }
};
</script>

<style scoped>
* img{
  image-rendering: pixelated;
}

.outlook-content {
  padding: 20px;
}

.outlook-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #06b4e3;
  border-radius: 8px;
  margin-bottom: 30px;
  color: white;
}

.outlook-logo {
  width: 64px;
  height: 64px;
}

.outlook-info h1 {
  font-size: 24px;
  margin: 0 0 5px 0;
}

.outlook-info p {
  font-size: 12px;
  margin: 0;
  opacity: 0.9;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.contact-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  scroll-margin-top: 20px;
}

.contact-card:hover {
  border-color: #0078d4;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 120, 212, 0.15);
}

.contact-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 15px;
}

.contact-icon img {
  width: 100%;
  height: 100%;
}

.contact-info h3 {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px 0;
}

.contact-description {
  font-size: 10px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.contact-type {
  font-size: 9px;
  color: #999;
  text-transform: uppercase;
}

.contact-value {
  font-size: 11px;
  color: #0078d4;
  font-weight: bold;
  transition: all 0.3s ease;
}

.contact-value.blurred {
  filter: blur(4px);
  user-select: none;
  color: #999;
}

.contact-button {
  display: inline-block;
  padding: 8px 16px;
  background: linear-gradient(135deg, #0078d4 0%, #00bcf2 100%);
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.contact-button:hover {
  background: linear-gradient(135deg, #00bcf2 0%, #0078d4 100%);
  transform: scale(1.05);
}

.reveal-button {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.reveal-button:hover {
  background: linear-gradient(135deg, #20c997 0%, #28a745 100%);
}

.copy-button {
  display: inline-block;
  padding: 6px 12px;
  margin-left: 8px;
  background: linear-gradient(135deg, #6c757d 0%, #868e96 100%);
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-button:hover {
  background: linear-gradient(135deg, #868e96 0%, #6c757d 100%);
  transform: scale(1.05);
}

.copy-button.copied {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

/* Formulario de mensaje */
.direct-message-section {
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 25px;
  scroll-margin-top: 20px;
}

.direct-message-section h2 {
  font-size: 18px;
  color: #333;
  margin: 0 0 20px 0;
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 11px;
  color: #555;
}

.form-group input,
.form-group textarea {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 11px;
  background: white;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0078d4;
}

.send-button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #0078d4 0%, #00bcf2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.send-button:hover {
  background: linear-gradient(135deg, #00bcf2 0%, #0078d4 100%);
  transform: scale(1.02);
}

/* Sidebar */
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: #0054e3;
  text-decoration: none;
  font-size: 11px;
  transition: background 0.2s;
  border-radius: 3px;
  cursor: pointer;
}

.sidebar-link:hover {
  background: rgba(0, 120, 212, 0.1);
}

.sidebar-link.active {
  background: rgba(0, 120, 212, 0.15);
  font-weight: bold;
}

.sidebar-link img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Responsive */
@media (max-width: 768px) {
  .contacts-grid {
    grid-template-columns: 1fr;
  }
}
</style>