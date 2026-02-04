// src/composables/useClippyAnimations.js

/**
 * Mapeo de animaciones de Clippy
 * Puedes usar GIFs reales de Clippy o crear los tuyos propios
 */
export const clippyAnimations = {
  idle: '/ui/iconos/clippy/clippy.gif',
  talking: '/ui/iconos/clippy/clippy.gif',
  thinking: '/ui/iconos/clippy/clippy.gif',
  celebrating: '/ui/iconos/clippy/clippy.gif',
  waving: '/ui/iconos/clippy/clippy.gif',
  confused: '/ui/iconos/clippy/clippy.gif',
  typing: '/ui/iconos/clippy/clippy.gif'
};


export function useClippyAnimations() {
  const playAnimation = (name, duration = 3000) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    });
  };
  
  return {
    clippyAnimations,
    playAnimation
  };
}