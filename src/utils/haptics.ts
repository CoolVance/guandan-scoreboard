/**
 * Safety Haptic Feedback Utility
 * Handles device vibration with environment checks and standard patterns.
 */

export const safeVibrate = (pattern: number | number[]) => {
  try {
    // 1. Basic environment check
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;

    // 2. Simple iOS check (physical layer doesn't support generic vibrate)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) return;

    // 3. User activation check (modern browsers requirement)
    const isActivated = (navigator as any).userActivation 
      ? (navigator as any).userActivation.isActive 
      : true;

    if (isActivated) {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    // Ignore intervention errors
  }
};

/**
 * Triggered when the app is manually or automatically locked.
 */
export const vibrateLock = () => safeVibrate(10);

/**
 * Triggered during the long-press "charging" phase.
 */
export const vibrateCharging = () => safeVibrate(15);

/**
 * Triggered when the app is successfully unlocked.
 */
export const vibrateUnlock = () => safeVibrate([30, 50, 30]);
