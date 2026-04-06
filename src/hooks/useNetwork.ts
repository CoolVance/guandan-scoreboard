import { useState, useEffect } from 'react';

/**
 * Hook to track browser network connection status and PWA offline readiness.
 */
export function useNetwork() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isOfflineReady, setIsOfflineReady] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service Worker offline readiness check
    if ('serviceWorker' in navigator) {
      // Check current registration
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg?.active) {
          setIsOfflineReady(true);
        }
      });

      // Listen for activation
      const handleStateChange = (e: any) => {
        if (e.target.state === 'activated') {
          setIsOfflineReady(true);
        }
      };

      navigator.serviceWorker.ready.then(reg => {
        if (reg.active) {
          setIsOfflineReady(true);
          reg.active.addEventListener('statechange', handleStateChange);
        } else if (reg.installing) {
          reg.installing.addEventListener('statechange', handleStateChange);
        } else if (reg.waiting) {
          reg.waiting.addEventListener('statechange', handleStateChange);
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isOfflineReady };
}
