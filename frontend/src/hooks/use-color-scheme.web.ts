import { useSyncExternalStore } from 'react';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 *
 * Uses useSyncExternalStore instead of a setState-in-effect: the color scheme comes
 * from an external source (the prefers-color-scheme media query), so React's
 * recommended pattern is to subscribe to it directly instead of hydrating with a flag.
 */

const getServerSnapshot = () => 'light';

function subscribe(callback: () => void) {
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function getSnapshot() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useColorScheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}