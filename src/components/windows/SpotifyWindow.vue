<!-- src/components/windows/SpotifyWindow.vue -->
<template>
  <WindowBase
    title="Spotify"
    icon="/ui/iconos/spotify.png"
    :show-toolbar="false"
    :show-sidebar="true"
    v-bind="$attrs"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
  >
    <!-- Sidebar personalizado de Spotify -->
    <template #sidebar>
      <!-- Logo de Spotify -->
      <div class="spotify-logo">
        <img src="/ui/iconos/spotify.png" alt="Spotify" />
        <span>Spotify</span>
      </div>

      <!-- Menú principal -->
      <div class="sidebar-section">
        <div class="sidebar-content">
          <a href="#" class="sidebar-link" :class="{active: currentView === 'home'}" @click.prevent="currentView = 'home'; selectedPlaylist = null">
            <span class="icon">🏠</span>
            Home
          </a>
          <a href="#" class="sidebar-link" :class="{active: currentView === 'search'}" @click.prevent="currentView = 'search'; selectedPlaylist = null">
            <span class="icon">🔍</span>
            Search
          </a>
          <a href="#" class="sidebar-link" :class="{active: currentView === 'library'}" @click.prevent="currentView = 'library'; selectedPlaylist = null">
            <span class="icon">📚</span>
            Your Library
          </a>
        </div>
      </div>

      <!-- Separador -->
      <div class="sidebar-divider"></div>

      <!-- Playlists -->
      <div class="sidebar-section">
        <div class="sidebar-title">Playlists</div>
        <div class="sidebar-content">
          <a 
            href="#" 
            class="sidebar-link playlist-link"
            :class="{ active: selectedPlaylist === 'demo' }"
            @click.prevent="selectedPlaylist = 'demo'; currentView = 'playlist'"
          >
            <span class="icon">🎵</span>
            Demo Playlist
          </a>
        </div>
      </div>

      <!-- Separador -->
      <div class="sidebar-divider"></div>

      <!-- Botón para conectar con API -->
      <div class="sidebar-section">
        <button class="connect-spotify-btn" @click="connectSpotify">
          <span class="icon">🔗</span>
          Connect with Spotify
        </button>
        <p class="connect-info">Login to access your playlists</p>
      </div>
    </template>

    <!-- Contenido principal -->
    <div class="spotify-main-content">
      <!-- Header con título de la vista actual -->
      <div class="spotify-header">
        <h1>{{ getViewTitle }}</h1>
      </div>

      <!-- Contenido según vista -->
      <div class="spotify-content">
        <!-- Vista: Demo Playlist -->
        <div v-if="selectedPlaylist === 'demo'" class="playlist-view">
          <!-- Info de la playlist -->
          <div class="playlist-info">
            <img src="https://picsum.photos/200/200?random=playlist" alt="Playlist Cover" class="playlist-cover" />
            <div class="playlist-details">
              <p class="playlist-type">PLAYLIST</p>
              <h2 class="playlist-title">Demo Playlist</h2>
              <p class="playlist-description">Aquí está mi playlist personal, con la música que más escucho. Si quieres una mejor experiencia, puedes usar Connect with Spotify para conectar tu cuenta y reproducir directamente desde Spotify.</p>
              <p class="playlist-meta">{{ demoPlaylist.length }} songs</p>
            </div>
          </div>

          <!-- Controles de la playlist -->
          <div class="playlist-controls">
            <button class="play-all-btn" @click="playPlaylist">
              <span v-if="!isPlaying">
                <img src="/ui/iconos/icono-play.png" class="icono-play">
              </span>
              <span v-else>
                <img src="/ui/iconos/icono-pause.png" class="icono-pause">
              </span>
              {{ isPlaying ? 'Pause' : 'Play' }}
            </button>
            
            <!-- Botón shuffle -->
            <button class="play-all-btn shuffle-btn" @click="shufflePlay" title="Shuffle">
              🔀 
            </button>
          </div>

          <!-- Lista de canciones -->
          <div class="songs-list">
            <!-- Header de la tabla -->
            <div class="songs-header">
              <div class="col-number">#</div>
              <div class="col-title">TITLE</div>
              <div class="col-artist">ARTIST</div>
              <div class="col-album">ALBUM</div>
              <div class="col-duration">⏱️</div>
            </div>

            <!-- Canciones -->
            <div 
              v-for="(song, index) in demoPlaylist" 
              :key="song.id"
              class="song-row"
              :class="{ 
                active: currentSong?.id === song.id,
                playing: currentSong?.id === song.id && isPlaying 
              }"
              @click="handleSongClick(song)"
            >
              <div class="col-number">
                <span v-if="currentSong?.id !== song.id || !isPlaying">{{ index + 1 }}</span>
                <span v-else class="playing-icon">🔊</span>
              </div>
              <div class="col-title">
                <img :src="song.cover" alt="" class="song-mini-cover" />
                <span>{{ song.title }}</span>
              </div>
              <div class="col-artist">{{ song.artist }}</div>
              <div class="col-album">{{ song.album }}</div>
              <div class="col-duration">{{ formatDuration(song.duration) }}</div>
            </div>
          </div>
        </div>

        <!-- Vista: Home -->
        <div v-else-if="currentView === 'home'" class="home-view">
          <!-- Info de la playlist -->
          <div class="playlist-info">
            <img src="https://picsum.photos/200/200?random=playlist" alt="Playlist Cover" class="playlist-cover" />
            <div class="playlist-details">
              <p class="playlist-type">PLAYLIST</p>
              <h2 class="playlist-title">Demo Playlist</h2>
              <p class="playlist-description">Aquí está mi playlist personal, con la música que más escucho. Si quieres una mejor experiencia, puedes usar Connect with Spotify para conectar tu cuenta y reproducir directamente desde Spotify.</p>
              <p class="playlist-meta">{{ demoPlaylist.length }} songs</p>
            </div>
          </div>

          <!-- Controles de la playlist -->
          <div class="playlist-controls">
            <button class="play-all-btn" @click="playPlaylist">
              <span v-if="!isPlaying">
                <img src="/ui/iconos/icono-play.png" class="icono-play">
              </span>
              <span v-else>
                <img src="/ui/iconos/icono-pause.png" class="icono-pause">
              </span>
              {{ isPlaying ? 'Pause' : 'Play' }}
            </button>
            
            <!-- Botón shuffle -->
            <button class="play-all-btn shuffle-btn" @click="shufflePlay" title="Shuffle">
              🔀 
            </button>
          </div>

          <!-- Lista de canciones -->
          <div class="songs-list">
            <!-- Header de la tabla -->
            <div class="songs-header">
              <div class="col-number">#</div>
              <div class="col-title">TITLE</div>
              <div class="col-artist">ARTIST</div>
              <div class="col-album">ALBUM</div>
              <div class="col-duration">⏱️</div>
            </div>

            <!-- Canciones -->
            <div 
              v-for="(song, index) in demoPlaylist" 
              :key="song.id"
              class="song-row"
              :class="{ 
                active: currentSong?.id === song.id,
                playing: currentSong?.id === song.id && isPlaying 
              }"
              @click="handleSongClick(song)"
            >
              <div class="col-number">
                <span v-if="currentSong?.id !== song.id || !isPlaying">{{ index + 1 }}</span>
                <span v-else class="playing-icon">🔊</span>
              </div>
              <div class="col-title">
                <img :src="song.cover" alt="" class="song-mini-cover" />
                <span>{{ song.title }}</span>
              </div>
              <div class="col-artist">{{ song.artist }}</div>
              <div class="col-album">{{ song.album }}</div>
              <div class="col-duration">{{ formatDuration(song.duration) }}</div>
            </div>
          </div>
        </div>

        <!-- Vista: Search -->
        <div v-else-if="currentView === 'search'" class="search-view">
          <div class="search-container">
            <h2>Search</h2>
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="What do you want to listen to?"
                class="search-input"
              />
            </div>

            <!-- Resultados de búsqueda -->
            <div v-if="searchResults.length > 0" class="search-results">
              <h3>Results for "{{ searchQuery }}"</h3>
              <div class="songs-list">
                <!-- Header de la tabla -->
                <div class="songs-header">
                  <div class="col-number">#</div>
                  <div class="col-title">TITLE</div>
                  <div class="col-artist">ARTIST</div>
                  <div class="col-album">ALBUM</div>
                  <div class="col-genre">GENRE</div>
                  <div class="col-duration">⏱️</div>
                </div>

                <!-- Canciones encontradas -->
                <div 
                  v-for="(song, index) in searchResults" 
                  :key="song.id"
                  class="song-row"
                  :class="{ 
                    active: currentSong?.id === song.id,
                    playing: currentSong?.id === song.id && isPlaying 
                  }"
                  @click="handleSongClick(song)"
                >
                  <div class="col-number">
                    <span v-if="currentSong?.id !== song.id || !isPlaying">{{ index + 1 }}</span>
                    <span v-else class="playing-icon">🔊</span>
                  </div>
                  <div class="col-title">
                    <img :src="song.cover" alt="" class="song-mini-cover" />
                    <span>{{ song.title }}</span>
                  </div>
                  <div class="col-artist">{{ song.artist }}</div>
                  <div class="col-album">{{ song.album }}</div>
                  <div class="col-genre">
                    <span class="genre-badge">{{ song.genre }}</span>
                  </div>
                  <div class="col-duration">{{ formatDuration(song.duration) }}</div>
                </div>
              </div>
            </div>

            <!-- Sin resultados -->
            <div v-else-if="searchQuery.trim() !== ''" class="no-results">
              <p>No results found for "{{ searchQuery }}"</p>
            </div>

            <!-- Mensaje inicial -->
            <div v-else class="search-prompt">
              <p>Start typing to search for songs, artists, or albums</p>
            </div>
          </div>
        </div>

        <!-- Vista: Library -->
        <div v-else-if="currentView === 'library'" class="library-view">
          <h2>Your Library</h2>
          <div class="library-filters">
            <button 
              v-for="genre in availableGenres" 
              :key="genre"
              class="genre-filter-btn"
              :class="{ active: selectedGenre === genre }"
              @click="selectedGenre = selectedGenre === genre ? null : genre"
            >
              {{ genre }}
            </button>
          </div>

          <div class="library-content">
            <!-- Mostrar canciones por género -->
            <div v-for="genre in displayGenres" :key="genre" class="genre-section">
              <h3 class="genre-title">
                {{ getGenreIcon(genre) }} {{ genre }}
                <span class="song-count">({{ getGenreSongs(genre).length }} songs)</span>
              </h3>
              
              <div class="songs-list">
                <!-- Header de la tabla -->
                <div class="songs-header">
                  <div class="col-number">#</div>
                  <div class="col-title">TITLE</div>
                  <div class="col-artist">ARTIST</div>
                  <div class="col-album">ALBUM</div>
                  <div class="col-duration">⏱️</div>
                </div>

                <!-- Canciones del género -->
                <div 
                  v-for="(song, index) in getGenreSongs(genre)" 
                  :key="song.id"
                  class="song-row"
                  :class="{ 
                    active: currentSong?.id === song.id,
                    playing: currentSong?.id === song.id && isPlaying 
                  }"
                  @click="handleSongClick(song)"
                >
                  <div class="col-number">
                    <span v-if="currentSong?.id !== song.id || !isPlaying">{{ index + 1 }}</span>
                    <span v-else class="playing-icon">🔊</span>
                  </div>
                  <div class="col-title">
                    <img :src="song.cover" alt="" class="song-mini-cover" />
                    <span>{{ song.title }}</span>
                  </div>
                  <div class="col-artist">{{ song.artist }}</div>
                  <div class="col-album">{{ song.album }}</div>
                  <div class="col-duration">{{ formatDuration(song.duration) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Player fijo en la parte inferior -->
      <div class="spotify-player">
        <!-- Canción actual -->
        <div class="player-song-info">
          <img 
            :src="currentSong?.cover || 'https://via.placeholder.com/56'" 
            alt="" 
            class="player-cover"
          />
          <div class="player-track-info">
            <div class="player-song-title">{{ currentSong?.title || 'No song playing' }}</div>
            <div class="player-song-artist">{{ currentSong?.artist || '' }}</div>
          </div>
        </div>

        <!-- Controles centrales -->
        <div class="player-controls-center">
          <!-- Botones de control -->
          <div class="player-buttons">
            <button class="player-btn" @click="previousSong" title="Previous">
              ⏮️
            </button>
            <button class="player-btn player-btn-main" @click="togglePlay" title="Play/Pause">
              <span v-if="!isPlaying">▶️</span>
              <span v-else>⏸️</span>
            </button>
            <button class="player-btn" @click="nextSong" title="Next">
              ⏭️
            </button>
            <button class="player-btn" @click="shufflePlay" title="Shuffle">
              🔀
            </button>
          </div>

          <!-- Barra de progreso -->
          <div class="player-progress">
            <span class="time-current">{{ formatDuration(currentTime) }}</span>
            <div class="progress-bar" @click="handleSeek">
              <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            <span class="time-total">{{ formatDuration(currentSong?.duration || 0) }}</span>
          </div>
        </div>

        <!-- Controles derecha (volumen) -->
        <div class="player-controls-right">
          <button class="player-btn" @click="toggleMute" title="Mute">
            <span v-if="volume > 0">🔊</span>
            <span v-else>🔇</span>
          </button>
          <div class="volume-control">
            <input 
              type="range" 
              min="0" 
              max="100" 
              :value="volume"
              @input="handleVolumeChange"
              class="volume-slider"
            />
          </div>
        </div>
      </div>
    </div>
  </WindowBase>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import WindowBase from '../WindowBase.vue';
import { useGlobalAudio } from '@/composables/useGlobalAudio';

defineEmits(['close', 'minimize', 'maximize', 'focus']);

// ============================================
// AUDIO GLOBAL
// ============================================
const {
  isPlaying,
  currentSong,
  currentTime,
  volume,
  setPlaylist,
  playSong,
  togglePlay,
  nextSong,
  previousSong,
  seekTo,
  setVolume,
  toggleMute,
  stopPlayback,
  shufflePlay
} = useGlobalAudio();

// ============================================
// ESTADO REACTIVO
// ============================================
const currentView = ref('home');
const selectedPlaylist = ref(null);
const searchQuery = ref('');
const selectedGenre = ref(null);

// Playlist de demostración con géneros
const demoPlaylist = ref([
  {
    id: 'demo-1',
    title: 'Write This Down',
    artist: '2Pac, Pop Smoke',
    album: 'Unknown ',
    duration: 798,
    genre: 'Hip Hop',
    cover: 'https://picsum.photos/200/200?random=1',
    audioUrl: '/ui/music/demo/2Pac, Pop Smoke - Write This Down.mp3'
  },
  {
    id: 'demo-2',
    title: 'The Nights',
    artist: 'Avicii',
    album: 'The Days / Nights EP',
    duration: 187,
    genre: 'Electronic',
    cover: 'https://picsum.photos/200/200?random=2',
    audioUrl: '/ui/music/demo/Avicii - The Nights.mp3'
  },
  {
    id: 'demo-3',
    title: 'Aint No Sunshine',
    artist: 'Bill Withers',
    album: 'Just As I Am',
    duration: 129,
    genre: 'Soul',
    cover: 'https://picsum.photos/200/200?random=3',
    audioUrl: '/ui/music/demo/Bill Withers-AintNoSunshine.mp3'
  },
  {
    id: 'demo-4',
    title: 'Danse Macabre',
    artist: 'Camille Saint-Saëns',
    album: 'Op. 40',
    duration: 142,
    genre: 'Classical',
    cover: 'https://picsum.photos/200/200?random=4',
    audioUrl: '/ui/music/demo/Camille Saint-Saens - Danse Macabre.mp3'
  },
  {
    id: 'demo-5',
    title: 'C´est la Mort',
    artist: 'Canserbero',
    album: 'Muerte',
    duration: 459,
    genre: 'Hip Hop',
    cover: 'https://picsum.photos/200/200?random=5',
    audioUrl: '/ui/music/demo/Canserbero - Cest la Mort.mp3'
  },
  {
    id: 'demo-6',
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    duration: 404,
    genre: 'Rock',
    cover: 'https://picsum.photos/200/200?random=6',
    audioUrl: '/ui/music/demo/Eagles - Hotel California (Live 1977).mp3'
  },
  {
    id: 'demo-7',
    title: 'El Lago de los Cisnes',
    artist: 'Chaikovski',
    album: 'Swan Lake, Op. 20',
    duration: 586,
    genre: 'Classical',
    cover: 'https://picsum.photos/200/200?random=7',
    audioUrl: '/ui/music/demo/El Lago de los Cisnes - Chaikovski.mp3'
  },
  {
    id: 'demo-8',
    title: 'Nocturne in C# Minor',
    artist: 'Chopin',
    album: 'Nocturnes',
    duration: 276,
    genre: 'Classical',
    cover: 'https://picsum.photos/200/200?random=8',
    audioUrl: '/ui/music/demo/F. Chopin _ Nocturne in c sharp minor for violin and piano YuEun Kim.mp3'
  },
  {
    id: 'demo-9',
    title: 'Faint',
    artist: 'Linkin Park',
    album: 'Meteora',
    duration: 162,
    genre: 'Rock',
    cover: 'https://picsum.photos/200/200?random=9',
    audioUrl: '/ui/music/demo/Faint.mp3'
  },
  {
    id: 'demo-10',
    title: 'For Whom The Bell Tolls',
    artist: 'Metallica',
    album: 'Ride the Lightning',
    duration: 309,
    genre: 'Metal',
    cover: 'https://picsum.photos/200/200?random=10',
    audioUrl: '/ui/music/demo/For Whom The Bell Tolls.mp3'
  },
  {
    id: 'demo-11',
    title: 'The Sky is Crying',
    artist: 'Gary B.B. Coleman',
    album: 'The Sky Is Crying',
    duration: 309,
    genre: 'Blues',
    cover: 'https://picsum.photos/200/200?random=11',
    audioUrl: '/ui/music/demo/Gary B.B. Coleman - The Sky is Crying.mp3'
  },
  {
    id: 'demo-12',
    title: 'Anoana',
    artist: 'Heilung',
    album: 'Single',
    duration: 299,
    genre: 'Folk',
    cover: 'https://picsum.photos/200/200?random=12',
    audioUrl: '/ui/music/demo/Heilung  Anoana.mp3'
  },
  {
    id: 'demo-13',
    title: 'It Was A Good Day',
    artist: 'Ice Cube',
    album: 'The Predator',
    duration: 306,
    genre: 'Hip Hop',
    cover: 'https://picsum.photos/200/200?random=13',
    audioUrl: '/ui/music/demo/Ice Cube - It Was A Good Day.mp3'
  },
  {
    id: 'demo-14',
    title: 'The Trooper',
    artist: 'Iron Maiden',
    album: 'Piece of Mind',
    duration: 263,
    genre: 'Metal',
    cover: 'https://picsum.photos/200/200?random=14',
    audioUrl: '/ui/music/demo/Iron Maiden - The Trooper.mp3'
  },
  {
    id: 'demo-15',
    title: 'REPARTIENDO ARTE',
    artist: 'KASE.O',
    album: 'El Círculo',
    duration: 281,
    genre: 'Hip Hop',
    cover: 'https://picsum.photos/200/200?random=15',
    audioUrl: '/ui/music/demo/KASE.O - REPARTIENDO ARTE.mp3'
  },
  {
    id: 'demo-16',
    title: 'Stairway To Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    duration: 281,
    genre: 'Rock',
    cover: 'https://picsum.photos/200/200?random=16',
    audioUrl: '/ui/music/demo/Led Zeppelin - Stairway To Heaven.mp3'
  },
  {
    id: 'demo-17',
    title: '光 LUZ',
    artist: 'Lil Supa',
    album: 'Serio',
    duration: 269,
    genre: 'Hip Hop',
    cover: 'https://picsum.photos/200/200?random=17',
    audioUrl: '/ui/music/demo/Lil Supa - 光 LUZ.mp3'
  },
  {
    id: 'demo-18',
    title: 'Shadow Of The Day',
    artist: 'Linkin Park',
    album: 'Minutes to Midnight',
    duration: 290,
    genre: 'Rock',
    cover: 'https://picsum.photos/200/200?random=18',
    audioUrl: '/ui/music/demo/Linkin Park - Shadow Of The Day.mp3'
  },
  {
    id: 'demo-19',
    title: 'Lost',
    artist: 'Linkin Park',
    album: 'Meteora (20th Anniversary Edition)',
    duration: 198,
    genre: 'Rock',
    cover: 'https://picsum.photos/200/200?random=19',
    audioUrl: '/ui/music/demo/Lost [Official Music Video] - Linkin Park.mp3'
  },
  {
    id: 'demo-20',
    title: 'Nessun dorma',
    artist: 'Luciano Pavarotti',
    album: 'Turandot',
    duration: 195,
    genre: 'Opera',
    cover: 'https://picsum.photos/200/200?random=20',
    audioUrl: '/ui/music/demo/Luciano Pavarotti Nessun dorma.mp3'
  },
  {
    id: 'demo-21',
    title: 'Mil Vidas',
    artist: 'Nach',
    album: 'Un Día en Suburbia',
    duration: 250,
    genre: 'Hip Hop',
    cover: 'https://picsum.photos/200/200?random=21',
    audioUrl: '/ui/music/demo/Mil Vidas.mp3'
  },
  {
    id: 'demo-22',
    title: 'Ace Of Spades',
    artist: 'Motörhead',
    album: 'Ace of Spades',
    duration: 164,
    genre: 'Metal',
    cover: 'https://picsum.photos/200/200?random=22',
    audioUrl: '/ui/music/demo/Motörhead  Ace Of Spades.mp3'
  },
  {
    id: 'demo-23',
    title: 'Lacrimosa',
    artist: 'Mozart',
    album: 'Requiem',
    duration: 200,
    genre: 'Classical',
    cover: 'https://picsum.photos/200/200?random=23',
    audioUrl: '/ui/music/demo/Mozart - Lacrimosa.mp3'
  },
  {
    id: 'demo-24',
    title: 'N.I.B.',
    artist: 'Black Sabbath',
    album: 'Black Sabbath',
    duration: 366,
    genre: 'Metal',
    cover: 'https://picsum.photos/200/200?random=24',
    audioUrl: '/ui/music/demo/N.I.B..mp3'
  },
  {
    id: 'demo-25',
    title: 'Feeling Good',
    artist: 'Nina Simone',
    album: 'I Put a Spell on You',
    duration: 182,
    genre: 'Jazz',
    cover: 'https://picsum.photos/200/200?random=25',
    audioUrl: '/ui/music/demo/Nina Simone - Feeling Good.mp3'
  },
  {
    id: 'demo-26',
    title: 'No Somos Ciegos',
    artist: 'Violadores del verso',
    album: 'Vicios y Virtudes',
    duration: 315,
    genre: 'Hip Hop',
    cover: 'https://picsum.photos/200/200?random=26',
    audioUrl: '/ui/music/demo/No Somos Ciegos.mp3'
  },
  {
    id: 'demo-27',
    title: 'One More Light',
    artist: 'Linkin Park',
    album: 'One More Light',
    duration: 270,
    genre: 'Rock',
    cover: 'https://picsum.photos/200/200?random=27',
    audioUrl: '/ui/music/demo/One More Light.mp3'
  },
  {
    id: 'demo-28',
    title: 'Ozelot',
    artist: 'Luz',
    album: 'Dimensiones y cuerdas II',
    duration: 206,
    genre: 'Hip Hop',
    cover: 'https://picsum.photos/200/200?random=28',
    audioUrl: '/ui/music/demo/Ozelot - Luz [Dimensiones y cuerdas II].mp3'
  },
  {
    id: 'demo-29',
    title: 'Crazy Train',
    artist: 'Ozzy Osbourne',
    album: 'Blizzard of Ozz',
    duration: 206,
    genre: 'Metal',
    cover: 'https://picsum.photos/200/200?random=29',
    audioUrl: '/ui/music/demo/Ozzy Osbourne - Crazy Train.mp3'
  },
  {
    id: 'demo-30',
    title: 'The Devil Went Down To Georgia',
    artist: 'Primus',
    album: 'Suck on This',
    duration: 274,
    genre: 'Rock',
    cover: 'https://picsum.photos/200/200?random=30',
    audioUrl: '/ui/music/demo/Primus - The Devil Went Down To Georgia.mp3'
  },
  {
    id: 'demo-31',
    title: 'Love Of My Life [Rock In Rio 85]',
    artist: 'Queen',
    album: 'Rock in Rio',
    duration: 264,
    genre: 'Rock',
    cover: 'https://picsum.photos/200/200?random=31',
    audioUrl: '/ui/music/demo/Queen - Love Of My Life [Rock In Rio 85].mp3'
  },
  {
    id: 'demo-32',
    title: 'POR AMOR AL ODIO',
    artist: 'Rafael Lechowski',
    album: 'Donde duele, inspira',
    duration: 438,
    genre: 'Hip Hop',
    cover: 'https://picsum.photos/200/200?random=32',
    audioUrl: '/ui/music/demo/Rafael Lechowski  - POR AMOR AL ODIO.mp3'
  },
  {
    id: 'demo-33',
    title: 'Ca´t Stop',
    artist: 'Red Hot Chili Peppers',
    album: 'By the Way',
    duration: 278,
    genre: 'Rock',
    cover: 'https://picsum.photos/200/200?random=33',
    audioUrl: '/ui/music/demo/Red Hot Chili Peppers - Cant Stop.mp3'
  },
  {
    id: 'demo-34',
    title: 'Represa',
    artist: 'Kamada',
    album: 'Represa',
    duration: 220,
    genre: 'Hip Hop',
    cover: 'https://picsum.photos/200/200?random=34',
    audioUrl: '/ui/music/demo/Represa.mp3'
  },
  {
    id: 'demo-35',
    title: 'Still Loving You',
    artist: 'Scorpions',
    album: 'Love at First Sting',
    duration: 287,
    genre: 'Rock',
    cover: 'https://picsum.photos/200/200?random=35',
    audioUrl: '/ui/music/demo/Scorpions - Still Loving You (Official Video).mp3'
  },
  {
    id: 'demo-36',
    title: '100 FRASES',
    artist: 'SHARIF',
    album: 'A Ras de Sueño',
    duration: 360,
    genre: 'Hip Hop',
    cover: 'https://picsum.photos/200/200?random=36',
    audioUrl: '/ui/music/demo/SHARIF - 100 FRASES.mp3'
  },
  {
    id: 'demo-37',
    title: 'Goodbye',
    artist: 'Slipknot',
    album: '.5: The Gray Chapter',
    duration: 274,
    genre: 'Metal',
    cover: 'https://picsum.photos/200/200?random=37',
    audioUrl: '/ui/music/demo/Slipknot Goodbye.mp3'
  },
  {
    id: 'demo-38',
    title: 'Lonely Day',
    artist: 'System Of A Down',
    album: 'Hypnotize',
    duration: 171,
    genre: 'Metal',
    cover: 'https://picsum.photos/200/200?random=38',
    audioUrl: '/ui/music/demo/System Of A Down - Lonely Day.mp3'
  },
  {
    id: 'demo-39',
    title: 'Don´t Let Me Down (Take 1)',
    artist: 'The Beatles',
    album: 'Let It Be (Super Deluxe)',
    duration: 265,
    genre: 'Rock',
    cover: 'https://picsum.photos/200/200?random=39',
    audioUrl: '/ui/music/demo/The Beatles - Dont Let Me Down (Take 1).mp3'
  },
  {
    id: 'demo-40',
    title: 'The Messenger',
    artist: 'Linkin Park',
    album: 'A Thousand Suns',
    duration: 182,
    genre: 'Rock',
    cover: 'https://picsum.photos/200/200?random=40',
    audioUrl: '/ui/music/demo/The Messenger - Linkin Park (A Thousands Suns).mp3'
  },
  {
    id: 'demo-41',
    title: 'Tornado Of Souls',
    artist: 'Megadeth',
    album: 'Rust in Peace',
    duration: 322,
    genre: 'Metal',
    cover: 'https://picsum.photos/200/200?random=41',
    audioUrl: '/ui/music/demo/Tornado Of Souls.mp3'
  },
  {
    id: 'demo-42',
    title: 'LA SOLEDAD COMIENZA',
    artist: 'XHELAZZ',
    album: 'Esencia',
    duration: 251,
    genre: 'Hip Hop',
    cover: 'https://picsum.photos/200/200?random=42',
    audioUrl: '/ui/music/demo/XHELAZZ - LA SOLEDAD COMIENZA.mp3'
  }
]);

// ============================================
// LIFECYCLE
// ============================================
onMounted(() => {
  // Configurar la playlist al montar el componente
  setPlaylist(demoPlaylist.value);
});

// ============================================
// COMPUTED
// ============================================
const getViewTitle = computed(() => {
  if (selectedPlaylist.value === 'demo') return 'Demo Playlist';
  if (currentView.value === 'home') return 'Home';
  if (currentView.value === 'search') return 'Search';
  if (currentView.value === 'library') return 'Your Library';
  return 'Spotify';
});

const progressPercentage = computed(() => {
  if (!currentSong.value) return 0;
  return (currentTime.value / currentSong.value.duration) * 100;
});

// Resultados de búsqueda
const searchResults = computed(() => {
  if (searchQuery.value.trim() === '') return [];
  
  const query = searchQuery.value.toLowerCase();
  return demoPlaylist.value.filter(song => 
    song.title.toLowerCase().includes(query) ||
    song.artist.toLowerCase().includes(query) ||
    song.album.toLowerCase().includes(query) ||
    song.genre.toLowerCase().includes(query)
  );
});

// Géneros disponibles
const availableGenres = computed(() => {
  const genres = [...new Set(demoPlaylist.value.map(song => song.genre))];
  return genres.sort();
});

// Géneros a mostrar en Library
const displayGenres = computed(() => {
  if (selectedGenre.value) {
    return [selectedGenre.value];
  }
  return availableGenres.value;
});

// ============================================
// FUNCIONES DE REPRODUCCIÓN (usan el composable global)
// ============================================
const handleSongClick = (song) => {
  if (currentSong.value?.id === song.id) {
    togglePlay();
  } else {
    playSong(song);
  }
};

const playPlaylist = () => {
  if (!currentSong.value && demoPlaylist.value.length > 0) {
    playSong(demoPlaylist.value[0]);
  } else {
    togglePlay();
  }
};

const handleSeek = (event) => {
  if (!currentSong.value) return;
  
  const progressBar = event.currentTarget;
  const clickX = event.offsetX;
  const width = progressBar.offsetWidth;
  const percentage = clickX / width;
  
  seekTo(currentSong.value.duration * percentage);
};

const handleVolumeChange = (event) => {
  const newVolume = parseInt(event.target.value);
  setVolume(newVolume);
};

// ============================================
// FUNCIONES DE LIBRARY
// ============================================
const getGenreSongs = (genre) => {
  return demoPlaylist.value.filter(song => song.genre === genre);
};

const getGenreIcon = (genre) => {
  const icons = {
    'Hip Hop': '🎤',
    'Rock': '🎸',
    'Metal': '🤘',
    'Classical': '🎻',
    'Electronic': '🎹',
    'Jazz': '🎺',
    'Soul': '💿',
    'Blues': '🎵',
    'Folk': '🪕',
    'Opera': '🎭'
  };
  return icons[genre] || '🎵';
};

// ============================================
// FUNCIÓN DE CONEXIÓN CON SPOTIFY
// ============================================
const connectSpotify = () => {
  alert('Por el monento mi cuenta de spotify es nueva, por lo que no tengo permisos para usar la api :(  ');
  // Aquí irá la lógica de OAuth después
};

// ============================================
// UTILIDADES
// ============================================
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.icono-play,
.icono-pause{
    height: 15%;
    width: 15%;
}
/* ============================================
   LAYOUT PRINCIPAL
   ============================================ */
.spotify-main-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(to bottom, #1a1a1a 0%, #121212 100%);
  color: #fff;
}

/* ============================================
   SIDEBAR PERSONALIZADO
   ============================================ */
.spotify-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.spotify-logo img {
  width: 32px;
  height: 32px;
}

.sidebar-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 8px 16px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  color: #b3b3b3;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.sidebar-link:hover {
  color: #fff;
}

.sidebar-link.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.sidebar-link .icon {
  font-size: 20px;
}

.playlist-link {
  font-size: 13px;
}

.connect-spotify-btn {
  width: calc(100% - 32px);
  margin: 16px;
  padding: 10px 16px;
  background: #1db954;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
}

.connect-spotify-btn:hover {
  background: #1ed760;
}

.connect-info {
  text-align: center;
  font-size: 11px;
  color: #b3b3b3;
  margin: 0 16px 16px;
}

/* ============================================
   HEADER
   ============================================ */
.spotify-header {
  padding: 24px 32px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
}

.spotify-header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: bold;
}

/* ============================================
   CONTENIDO
   ============================================ */
.spotify-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 32px 100px 32px;
}

/* Vista Home/Search/Library */
.home-view,
.search-view,
.library-view {
  padding: 40px 0;
  text-align: center;
}

.home-view h2,
.search-view h2,
.library-view h2 {
  font-size: 24px;
  margin-bottom: 16px;
}

.home-view p,
.search-view p,
.library-view p {
  color: #b3b3b3;
  margin: 8px 0;
}

/* ============================================
   PLAYLIST VIEW
   ============================================ */
.playlist-info {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.playlist-cover {
  width: 200px;
  height: 200px;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  background: #333;
}

.playlist-details {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.playlist-type {
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  margin: 0 0 8px 0;
}

.playlist-title {
  font-size: 48px;
  font-weight: bold;
  margin: 0 0 16px 0;
}

.playlist-description {
  color: #b3b3b3;
  margin: 0 0 8px 0;
}

.playlist-meta {
  font-size: 14px;
  color: #b3b3b3;
  margin: 0;
}

/* Controles de playlist */
.playlist-controls {
  margin-bottom: 24px;
}

.play-all-btn {
  padding: 12px 32px;
  background: #1db954;
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.play-all-btn:hover {
  background: #1ed760;
  transform: scale(1.05);
}

/* ============================================
   LISTA DE CANCIONES
   ============================================ */
.songs-list {
  margin-top: 24px;
}

.songs-header {
  display: grid;
  grid-template-columns: 50px 2fr 1.5fr 1.5fr 80px;
  gap: 16px;
  padding: 8px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #b3b3b3;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.song-row {
  display: grid;
  grid-template-columns: 50px 2fr 1.5fr 1.5fr 80px;
  gap: 16px;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  align-items: center;
}

.song-row:hover {
  background: rgba(255, 255, 255, 0.1);
}

.song-row.active {
  background: rgba(29, 185, 84, 0.2);
}

.col-number {
  text-align: center;
  color: #b3b3b3;
}

.playing-icon {
  color: #1db954;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.col-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

.song-mini-cover {
  width: 40px;
  height: 40px;
  object-fit: cover;
  background: #333;
}

.col-artist,
.col-album {
  color: #b3b3b3;
}

.col-duration {
  text-align: right;
  color: #b3b3b3;
}

/* ============================================
   PLAYER
   ============================================ */
.spotify-player {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background: #181818;
  border-top: 1px solid #282828;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
}

/* Información de la canción */
.player-song-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;
}

.player-cover {
  width: 56px;
  height: 56px;
  object-fit: cover;
  background: #333;
}

.player-track-info {
  overflow: hidden;
}

.player-song-title {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-song-artist {
  font-size: 12px;
  color: #b3b3b3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Controles centrales */
.player-controls-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 722px;
}

.player-buttons {
  display: flex;
  gap: 16px;
  align-items: center;
}

.player-btn {
  background: none;
  border: none;
  color: #b3b3b3;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s;
}

.player-btn:hover {
  color: #fff;
}

.player-btn-main {
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.player-btn-main:hover {
  transform: scale(1.06);
}

/* Barra de progreso */
.player-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.time-current,
.time-total {
  font-size: 11px;
  color: #b3b3b3;
  min-width: 40px;
}

.time-current {
  text-align: right;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #4d4d4d;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: #1db954;
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-bar:hover .progress-fill {
  background: #1ed760;
}

/* Controles de volumen */
.player-controls-right {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}

.volume-control {
  width: 100px;
}

.volume-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: #4d4d4d;
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* ============================================
   SCROLLBAR PERSONALIZADO
   ============================================ */
.spotify-content::-webkit-scrollbar {
  width: 12px;
}

.spotify-content::-webkit-scrollbar-track {
  background: #121212;
}

.spotify-content::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 6px;
}

.spotify-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.shuffle-btn {
  background: #1a1a1a; /* Más oscuro */
  border: 2px solid #1db954; /* Borde verde */
}

.shuffle-btn:hover {
  background: #282828;
  border-color: #1ed760;
  transform: scale(1.05);
}
</style>