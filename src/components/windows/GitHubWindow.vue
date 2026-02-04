<!-- src/components/windows/GitHubWindow.vue -->
<template>
  <WindowBase
    title="GitHub Projects"
    icon="/ui/iconos/github.png"
    :show-toolbar="true"
    :show-sidebar="true"
    address-bar-text="https://github.com"
    v-bind="$attrs"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
  >
    <!-- Sidebar personalizado -->
    <template #sidebar>
      <div class="sidebar-section">
        <div class="sidebar-title">Navigation</div>
        <div class="sidebar-content">
          <a 
            href="#" 
            class="sidebar-link"
            :class="{ active: currentView === 'profile' }"
            @click.prevent="currentView = 'profile'"
          >
            <img src="/ui/iconos/profile.png" class="sidebar-icon" />
            Profile
          </a>
          <a 
            href="#" 
            class="sidebar-link"
            :class="{ active: currentView === 'repos' }"
            @click.prevent="currentView = 'repos'"
          >
            <img src="/ui/iconos/repositories.png" class="sidebar-icon" />
            Repositories
          </a>
          <a 
            href="#" 
            class="sidebar-link"
            :class="{ active: currentView === 'activity' }"
            @click.prevent="currentView = 'activity'"
          >
            <img src="/ui/iconos/reloj.png" class="sidebar-icon" />
            Activity
          </a>
        </div>
      </div>

      <div class="sidebar-section" v-if="userProfile">
        <div class="sidebar-title">Quick Stats</div>
        <div class="sidebar-content">
          <div class="stat-item">
            <span class="stat-label">📦 Repositories</span>
            <span class="stat-value">{{ userProfile.public_repos }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">👥 Followers</span>
            <span class="stat-value">{{ userProfile.followers }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">👤 Following</span>
            <span class="stat-value">{{ userProfile.following }}</span>
          </div>
        </div>
      </div>

      <div class="sidebar-section">
        <button class="github-link-btn" @click="openGitHub">
          🔗 Open GitHub Profile
        </button>
      </div>
    </template>

    <!-- Contenido principal -->
    <div class="github-content">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading GitHub data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <h2>❌ Error</h2>
        <p>{{ error }}</p>
        <button @click="loadGitHubData">Retry</button>
      </div>

      <!-- Profile View -->
      <div v-else-if="currentView === 'profile' && userProfile" class="profile-view">
        <div class="profile-header">
          <img :src="userProfile.avatar_url" alt="Avatar" class="profile-avatar" />
          <div class="profile-info">
            <h1>{{ userProfile.name || userProfile.login }}</h1>
            <p class="profile-username">@{{ userProfile.login }}</p>
            <p class="profile-bio">{{ userProfile.bio || 'No bio available' }}</p>
            
            <div class="profile-meta">
              <span v-if="userProfile.location">📍 {{ userProfile.location }}</span>
              <span v-if="userProfile.blog">
                🔗 <a :href="userProfile.blog" target="_blank">{{ userProfile.blog }}</a>
              </span>
              <span v-if="userProfile.twitter_username">
                🐦 <a :href="`https://twitter.com/${userProfile.twitter_username}`" target="_blank">
                  @{{ userProfile.twitter_username }}
                </a>
              </span>
            </div>

            <div class="profile-stats">
              <div class="stat-box">
                <div class="stat-number">{{ userProfile.public_repos }}</div>
                <div class="stat-label">Repositories</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">{{ userProfile.followers }}</div>
                <div class="stat-label">Followers</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">{{ userProfile.following }}</div>
                <div class="stat-label">Following</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">{{ userProfile.public_gists }}</div>
                <div class="stat-label">Gists</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Repositories View -->
      <div v-else-if="currentView === 'repos'" class="repos-view">
        <div class="repos-header">
          <h2>📦 Repositories ({{ repos.length }})</h2>
          <div class="repos-controls">
            <select v-model="sortBy" @change="sortRepos">
              <option value="updated">Recently Updated</option>
              <option value="stars">Most Stars</option>
              <option value="forks">Most Forks</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div class="repos-grid">
          <div v-for="repo in sortedRepos" :key="repo.id" class="repo-card">
            <div class="repo-header">
              <h3>
                <a :href="repo.html_url" target="_blank">{{ repo.name }}</a>
              </h3>
              <span v-if="repo.private" class="repo-badge private">Private</span>
              <span v-else class="repo-badge public">Public</span>
            </div>

            <p class="repo-description">
              {{ repo.description || 'No description available' }}
            </p>

            <div class="repo-meta">
              <span v-if="repo.language" class="repo-language">
                <span class="language-dot" :style="{ background: getLanguageColor(repo.language) }"></span>
                {{ repo.language }}
              </span>
              <span class="repo-stat">
                ⭐ {{ repo.stargazers_count }}
              </span>
              <span class="repo-stat">
                🔀 {{ repo.forks_count }}
              </span>
              <span class="repo-stat">
                👁️ {{ repo.watchers_count }}
              </span>
            </div>

            <div class="repo-footer">
              <span class="repo-updated">Updated {{ formatDate(repo.updated_at) }}</span>
              <a :href="repo.html_url" target="_blank" class="repo-link">
                View on GitHub →
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity View -->
      <div v-else-if="currentView === 'activity'" class="activity-view">
        <h2>📊 Recent Activity</h2>
        <div v-if="events.length === 0" class="empty-state">
          <p>Loading activity...</p>
        </div>
        <div v-else class="events-list">
          <div v-for="event in events.slice(0, 15)" :key="event.id" class="event-item">
            <div class="event-icon">{{ getEventIcon(event.type) }}</div>
            <div class="event-content">
              <p class="event-text">
                <strong>{{ event.type }}</strong> on 
                <a :href="`https://github.com/${event.repo.name}`" target="_blank">
                  {{ event.repo.name }}
                </a>
              </p>
              <span class="event-time">{{ formatDate(event.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WindowBase>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import WindowBase from '../WindowBase.vue';

defineEmits(['close', 'minimize', 'maximize', 'focus']);

// ============================================
// CONFIGURACIÓN
// ============================================
const GITHUB_USERNAME = 'y0x3'; // ← CAMBIA ESTO POR TU USERNAME

// ============================================
// ESTADO REACTIVO
// ============================================
const currentView = ref('profile');
const isLoading = ref(false);
const error = ref('');
const userProfile = ref(null);
const repos = ref([]);
const events = ref([]);
const sortBy = ref('updated');

// ============================================
// COMPUTED
// ============================================
const sortedRepos = computed(() => {
  const reposCopy = [...repos.value];
  
  switch (sortBy.value) {
    case 'stars':
      return reposCopy.sort((a, b) => b.stargazers_count - a.stargazers_count);
    case 'forks':
      return reposCopy.sort((a, b) => b.forks_count - a.forks_count);
    case 'name':
      return reposCopy.sort((a, b) => a.name.localeCompare(b.name));
    case 'updated':
    default:
      return reposCopy.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }
});

// ============================================
// LIFECYCLE
// ============================================
onMounted(() => {
  loadGitHubData();
});

// ============================================
// FUNCIONES DE API
// ============================================
const loadGitHubData = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    // Cargar perfil
    const profileRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if (!profileRes.ok) throw new Error('User not found');
    userProfile.value = await profileRes.json();
    
    // Cargar repos
    const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
    if (!reposRes.ok) throw new Error('Failed to load repositories');
    repos.value = await reposRes.json();
    
    // Cargar actividad
    const eventsRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`);
    if (eventsRes.ok) {
      events.value = await eventsRes.json();
    }
    
  } catch (err) {
    console.error('Error loading GitHub data:', err);
    error.value = err.message || 'Failed to load GitHub data';
  } finally {
    isLoading.value = false;
  }
};

// ============================================
// FUNCIONES HELPER
// ============================================
const openGitHub = () => {
  window.open(`https://github.com/${GITHUB_USERNAME}`, '_blank');
};

const sortRepos = () => {
  // Trigger re-computation
  sortBy.value = sortBy.value;
};

const getLanguageColor = (language) => {
  const colors = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#178600',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Vue': '#41b883',
    'React': '#61dafb',
    'HTML': '#e34c26',
    'CSS': '#563d7c'
  };
  return colors[language] || '#8257e5';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

const getEventIcon = (type) => {
  const icons = {
    'PushEvent': '📝',
    'CreateEvent': '✨',
    'DeleteEvent': '🗑️',
    'ForkEvent': '🔀',
    'WatchEvent': '⭐',
    'IssuesEvent': '🐛',
    'PullRequestEvent': '🔀',
    'ReleaseEvent': '🚀',
    'PublicEvent': '🌍'
  };
  return icons[type] || '📌';
};
</script>

<style scoped>
/* ============================================
   LAYOUT PRINCIPAL
   ============================================ */
.github-content {
  height: 100%;
  overflow-y: auto;
  background: #f6f8fa;
  padding: 20px;
}

/* ============================================
   SIDEBAR
   ============================================ */
.sidebar-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;  /* ← IMPORTANTE: Evita que se deforme */
  image-rendering: pixelated;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 8px;  /* ← Espacio entre icono y texto */
  padding: 8px 12px;
  color: #666;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s;
  cursor: pointer;
}

.sidebar-link:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #0969da;
}

.sidebar-link.active {
  background: rgba(9, 105, 218, 0.1);
  color: #0969da;
  font-weight: 600;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;  /* ← NUEVO */
  padding: 8px 0;
  font-size: 11px;
}

.stat-label {
  color: #666;
  flex: 1;  /* ← NUEVO: Ocupa el espacio disponible */
}

.stat-value {
  font-weight: bold;
  color: #0969da;
  flex-shrink: 0;  /* ← NUEVO: No se comprime */
}

.github-link-btn {
  width: calc(100% - 32px);
  margin: 16px;
  padding: 10px 16px;
  background: #0969da;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 12px;  /* ← NUEVO */
}

.github-link-btn:hover {
  background: #0860ca;
}

/* ============================================
   LOADING & ERROR
   ============================================ */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e1e4e8;
  border-top-color: #0969da;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state h2 {
  color: #d1242f;
  margin-bottom: 10px;
}

.error-state button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #0969da;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* ============================================
   PROFILE VIEW
   ============================================ */
.profile-header {
  display: flex;
  gap: 30px;
  background: white;
  padding: 30px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid #e1e4e8;
}

.profile-info {
  flex: 1;
}

.profile-info h1 {
  font-size: 28px;
  margin: 0 0 5px 0;
  color: #24292f;
}

.profile-username {
  font-size: 18px;
  color: #57606a;
  margin: 0 0 15px 0;
}

.profile-bio {
  font-size: 14px;
  color: #24292f;
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #57606a;
}

.profile-meta a {
  color: #0969da;
  text-decoration: none;
}

.profile-meta a:hover {
  text-decoration: underline;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
}

.stat-box {
  text-align: center;
  padding: 15px;
  background: #f6f8fa;
  border-radius: 6px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #0969da;
}

.stat-label {
  font-size: 12px;
  color: #57606a;
  margin-top: 5px;
}

/* ============================================
   REPOS VIEW
   ============================================ */
.repos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.repos-header h2 {
  margin: 0;
  color: #24292f;
}

.repos-controls select {
  padding: 8px 12px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: white;
  font-size: 13px;
  cursor: pointer;
}

.repos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.repo-card {
  background: white;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid #d0d7de;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
}

.repo-card:hover {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.repo-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.repo-header h3 {
  margin: 0;
  font-size: 16px;
  flex: 1;
}

.repo-header a {
  color: #0969da;
  text-decoration: none;
}

.repo-header a:hover {
  text-decoration: underline;
}

.repo-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
}

.repo-badge.public {
  background: #ddf4ff;
  color: #0969da;
}

.repo-badge.private {
  background: #fff8c5;
  color: #633c01;
}

.repo-description {
  font-size: 13px;
  color: #57606a;
  margin: 0 0 15px 0;
  line-height: 1.5;
  flex: 1;
}

.repo-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #57606a;
  margin-bottom: 10px;
}

.repo-language {
  display: flex;
  align-items: center;
  gap: 5px;
}

.language-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.repo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #d0d7de;
  font-size: 12px;
}

.repo-updated {
  color: #57606a;
}

.repo-link {
  color: #0969da;
  text-decoration: none;
  font-weight: 500;
}

.repo-link:hover {
  text-decoration: underline;
}

/* ============================================
   ACTIVITY VIEW
   ============================================ */
.activity-view h2 {
  margin: 0 0 20px 0;
  color: #24292f;
}

.events-list {
  background: white;
  border-radius: 6px;
  border: 1px solid #d0d7de;
}

.event-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border-bottom: 1px solid #d0d7de;
}

.event-item:last-child {
  border-bottom: none;
}

.event-icon {
  font-size: 20px;
}

.event-content {
  flex: 1;
}

.event-text {
  margin: 0 0 5px 0;
  font-size: 13px;
  color: #24292f;
}

.event-text a {
  color: #0969da;
  text-decoration: none;
}

.event-text a:hover {
  text-decoration: underline;
}

.event-time {
  font-size: 12px;
  color: #57606a;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #57606a;
}

/* ============================================
   SCROLLBAR
   ============================================ */
.github-content::-webkit-scrollbar {
  width: 12px;
}

.github-content::-webkit-scrollbar-track {
  background: #f6f8fa;
}

.github-content::-webkit-scrollbar-thumb {
  background: #d0d7de;
  border-radius: 6px;
}

.github-content::-webkit-scrollbar-thumb:hover {
  background: #afb8c1;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .repos-grid {
    grid-template-columns: 1fr;
  }
}
</style>