import { useState, useEffect, useRef, useCallback } from 'react';
import { vibrateLock, vibrateCharging, vibrateUnlock } from '../utils/haptics';

const AUTO_LOCK_TIME = 10000; // 10 seconds
const UNLOCK_DURATION = 800;  // 800ms

export function useSecurity(onAutoLock?: () => void) {
  const [isLocked, setIsLocked] = useState(false);
  const [lockProgress, setLockProgress] = useState(0);
  const [unlockProgress, setUnlockProgress] = useState(0);

  const lastActivity = useRef(Date.now());
  const unlockTimer = useRef<any>(null);
  const lockPressActive = useRef(false);

  const recordActivity = useCallback(() => {
    lastActivity.current = Date.now();
    if (!isLocked) setLockProgress(0);
  }, [isLocked]);

  const lock = useCallback(() => {
    setIsLocked(true);
    setLockProgress(0);
    vibrateLock();
    if (onAutoLock) onAutoLock();
  }, [onAutoLock]);

  const unlock = useCallback(() => {
    setIsLocked(false);
    setUnlockProgress(0);
    vibrateUnlock();
    recordActivity();
  }, [recordActivity]);

  // --- Auto-lock Timer ---
  useEffect(() => {
    const checkIdle = () => {
      if (!isLocked) {
        const elapsed = Date.now() - lastActivity.current;
        const progress = Math.min(100, (elapsed / AUTO_LOCK_TIME) * 100);
        setLockProgress(progress);
        
        if (elapsed > AUTO_LOCK_TIME) {
          lock();
        }
      } else {
        setLockProgress(0);
      }
    };

    const interval = setInterval(checkIdle, 50);
    return () => clearInterval(interval);
  }, [isLocked, lock]);

  // --- Manual Unlock Charging Algorithm ---
  const startUnlocking = useCallback(() => {
    if (!isLocked || lockPressActive.current) return;
    
    lockPressActive.current = true;
    setUnlockProgress(0);
    vibrateCharging();

    const startTime = Date.now();
    unlockTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / UNLOCK_DURATION) * 100);
      setUnlockProgress(progress);

      if (progress >= 100) {
        clearInterval(unlockTimer.current);
        unlockTimer.current = null;
        lockPressActive.current = false;
        unlock();
      }
    }, 16);
  }, [isLocked, unlock]);

  const stopUnlocking = useCallback(() => {
    lockPressActive.current = false;
    setUnlockProgress(0);
    if (unlockTimer.current) {
      clearInterval(unlockTimer.current);
      unlockTimer.current = null;
    }
  }, []);

  return {
    isLocked,
    lockProgress,
    unlockProgress,
    recordActivity,
    lock,
    startUnlocking,
    stopUnlocking,
    setIsLocked // Still allow manual control if needed
  };
}
