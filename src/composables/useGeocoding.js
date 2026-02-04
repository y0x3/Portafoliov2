// src/composables/useGeocoding.js
import { ref } from 'vue';

export function useGeocoding() {
  const coordinatesCache = ref({});
  const loading = ref(false);
  const CACHE_KEY = 'halloffame_coordinates_cache';
  const CACHE_VERSION = '1.0';

  /**
   * Carga el caché desde localStorage
   */
  function loadCacheFromStorage() {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const { version, data } = JSON.parse(stored);
        if (version === CACHE_VERSION) {
          coordinatesCache.value = data;
          console.log(`✅ Caché de coordenadas cargado: ${Object.keys(data).length} ciudades`);
          return true;
        }
      }
    } catch (error) {
      console.error('Error cargando caché:', error);
    }
    return false;
  }

  /**
   * Guarda el caché en localStorage
   */
  function saveCacheToStorage() {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          version: CACHE_VERSION,
          data: coordinatesCache.value,
          timestamp: Date.now()
        })
      );
    } catch (error) {
      console.error('Error guardando caché:', error);
    }
  }

  /**
   * Obtiene coordenadas de una ciudad usando Nominatim (OpenStreetMap)
   */
  async function getCityCoordinates(cityName) {
    if (coordinatesCache.value[cityName]) {
      return coordinatesCache.value[cityName];
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(cityName)}&` +
        `format=json&` +
        `limit=1&` +
        `addressdetails=1`,
        {
          headers: {
            'User-Agent': 'HallOfFameApp/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.length > 0) {
        const coords = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name
        };

        coordinatesCache.value[cityName] = coords;
        saveCacheToStorage();
        
        console.log(`📍 ${cityName} → (${coords.lat}, ${coords.lng})`);
        return coords;
      }

      console.warn(`⚠️ No se encontró: ${cityName}`);
      return null;
    } catch (error) {
      console.error(`❌ Error geocoding ${cityName}:`, error);
      return null;
    }
  }

  /**
   * Pre-carga coordenadas para múltiples ciudades
   */
  async function preloadCities(cities) {
    loading.value = true;
    
    const citiesToLoad = cities.filter(city => !coordinatesCache.value[city]);
    
    if (citiesToLoad.length === 0) {
      console.log('✅ Todas las ciudades ya están en caché');
      loading.value = false;
      return;
    }

    console.log(`🗺️ Cargando ${citiesToLoad.length} ciudades...`);
    
    for (const city of citiesToLoad) {
      await getCityCoordinates(city);
      // Esperar 1.1 segundos entre requests para respetar rate limit
      await new Promise(resolve => setTimeout(resolve, 1100));
    }
    
    console.log('✅ Geocoding completado');
    loading.value = false;
  }

  /**
   * Convierte coordenadas lat/lng a posición en mapa de imagen (%)
   */
  function latLngToMapPosition(lat, lng) {
    // Longitud: conversión directa
    const x = ((lng + 180) / 360) * 100;
    
    // Latitud: proyección Mercator
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
    const y = (1 - (mercN / Math.PI)) * 50;

    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    };
  }

  /**
   * Limpia el caché (útil para desarrollo)
   */
  function clearCache() {
    coordinatesCache.value = {};
    localStorage.removeItem(CACHE_KEY);
    console.log('🗑️ Caché limpiado');
  }

  // Cargar caché al inicializar
  loadCacheFromStorage();

  return {
    coordinatesCache,
    loading,
    getCityCoordinates,
    preloadCities,
    latLngToMapPosition,
    clearCache,
    loadCacheFromStorage,
    saveCacheToStorage
  };
}