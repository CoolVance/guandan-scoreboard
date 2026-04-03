import React, { useRef } from 'react';

interface SwipeControlProps {
  children: React.ReactNode;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  className?: string;
  colorClass?: string;
  valueKey: string;
}

export const SwipeControl = ({ children, onSwipeUp, onSwipeDown, className, colorClass, valueKey }: SwipeControlProps) => {
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 30) {
      if (diff > 0) onSwipeUp();
      else onSwipeDown();
    }
    touchStartY.current = null;
  };

  return (
    <div
      key={valueKey}
      className={`${className} ${colorClass} animate-pop relative flex flex-col items-center justify-center select-none active:brightness-90 transition-all shadow-md rounded-button overflow-hidden touch-none`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute top-0 left-0 w-full h-1/4 z-10 opacity-0" onClick={(e) => { e.stopPropagation(); onSwipeDown(); }}></div>
      <div className="absolute bottom-0 left-0 w-full h-1/4 z-10 opacity-0" onClick={(e) => { e.stopPropagation(); onSwipeUp(); }}></div>
      {children}
    </div>
  );
};
