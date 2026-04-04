import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Menu, X, Languages, RotateCw, AlertCircle, CloudOff } from 'lucide-react';
import { TopModeIcon, BottomModeIcon } from '../Common/Icons';
import { useNetwork } from '../../hooks/useNetwork';

interface DraggableDrawerProps {
  initialPos: { x: number, y: number };
  onPosChange: (pos: { x: number, y: number }) => void;
  onResetLevels: () => void;
  onStartTutorial: () => void;
  uiMode: 'full' | 'top' | 'bottom';
  onToggleUiMode: (target: 'full' | 'top' | 'bottom') => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onToggleLang: () => void;
  security: any;
}

export const DraggableDrawer = ({
  initialPos, onPosChange, onResetLevels, onStartTutorial,
  uiMode, onToggleUiMode, isOpen, setIsOpen, onToggleLang,
  security
}: DraggableDrawerProps) => {
  const { isOnline } = useNetwork();
  const { isLocked, setIsLocked, lockProgress, unlockProgress, startUnlocking, stopUnlocking } = security;
  const [pos, setPos] = useState(initialPos);
  const [isDraggingState, setIsDraggingState] = useState(false);

  useEffect(() => {
    setPos(initialPos);
  }, [initialPos.x, initialPos.y]);

  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const dragStartTime = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setPos((prevPos: { x: number; y: number }) => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isLeft = prevPos.x < screenWidth / 2;
        const newX = isLeft ? 10 : screenWidth - 58;
        const newY = Math.max(10, Math.min(screenHeight - 114, prevPos.y));
        return { x: newX, y: newY };
      });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const handleStart = (clientX: number, clientY: number) => {
    if (isLocked) return;
    isDragging.current = true;
    setIsDraggingState(true);
    dragStartTime.current = Date.now();
    offset.current = { x: clientX - pos.x, y: clientY - pos.y };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging.current || isLocked) return;
    setPos({ x: clientX - offset.current.x, y: clientY - offset.current.y });
  };

  const handleEnd = () => {
    if (isLocked || !isDragging.current) {
      isDragging.current = false;
      setIsDraggingState(false);
      return;
    }
    isDragging.current = false;
    setIsDraggingState(false);
    const screenWidth = window.innerWidth;
    const isLeft = pos.x + 24 < screenWidth / 2;
    const newX = isLeft ? 10 : screenWidth - 58;
    let newY = Math.max(10, Math.min(window.innerHeight - 114, pos.y));
    const newPos = { x: newX, y: newY };
    setPos(newPos);
    onPosChange(newPos);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked) return;
    handleStart(e.clientX, e.clientY);
    const onMouseMove = (ev: MouseEvent) => handleMove(ev.clientX, ev.clientY);
    const onMouseUp = (ev: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (isLocked) return;
      isDragging.current = false;
      const currentX = ev.clientX - offset.current.x;
      const currentY = ev.clientY - offset.current.y;
      const screenWidth = window.innerWidth;
      const isLeft = currentX + 24 < screenWidth / 2;
      const newX = isLeft ? 10 : screenWidth - 58;
      const newY = Math.max(10, Math.min(window.innerHeight - 114, currentY));
      const newPos = { x: newX, y: newY };
      setPos(newPos);
      onPosChange(newPos);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleLockPressStart = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e && 'touches' in e) e.stopPropagation();
    
    if (!isLocked) {
      setIsLocked(true);
      setIsOpen(false);
      return;
    }
    
    startUnlocking();
  };

  const handleLockPressEnd = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e && 'touches' in e) e.stopPropagation();
    stopUnlocking();
  };

  const isUnlocking = isLocked && unlockProgress > 0;
  const radius = isUnlocking ? 32 : 20;
  const circumference = 2 * Math.PI * radius;
  const activeProgress = isLocked ? unlockProgress : lockProgress;
  const strokeDashoffset = circumference - (activeProgress / 100) * circumference;

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />}
      <div
        className={`fixed z-[70] flex flex-col gap-2 items-center ${isDraggingState ? 'transition-none' : 'transition-all duration-300 ease-out'}`}
        style={{
          left: pos.x,
          top: pos.y,
          transform: isUnlocking ? 'scale(1.3)' : 'none',
          cursor: isLocked ? 'default' : 'grab',
          touchAction: 'none',
          transitionProperty: 'transform, left, top, opacity',
        }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => { e.stopPropagation(); handleMove(e.touches[0].clientX, e.touches[0].clientY); }}
        onTouchEnd={handleEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="relative flex flex-col gap-2">
          <button
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-all relative border-2 border-white ${isLocked ? (unlockProgress > 0 ? 'bg-red-600 scale-110' : 'bg-team-red animate-[pulse_2s_infinite] ring-4 ring-transparent') : 'bg-gray-400'}`}
            style={{
              ...(isLocked && unlockProgress === 0 ? { boxShadow: '0 0 10px rgba(239,68,68,0.5)', animation: 'rgb-border 2s linear infinite' } : {}),
              backgroundColor: !isLocked && lockProgress > 0 ? `rgb(${156 + (220 - 156) * (lockProgress / 100)}, ${163 - 163 * (lockProgress / 100)}, ${175 - 175 * (lockProgress / 100)})` : undefined,
              zIndex: isUnlocking ? 100 : 1,
            }}
            onMouseDown={handleLockPressStart}
            onMouseUp={handleLockPressEnd}
            onMouseLeave={handleLockPressEnd}
            onTouchStart={handleLockPressStart}
            onTouchEnd={handleLockPressEnd}
          >
            {activeProgress > 0 && (
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none overflow-visible" style={{ width: '100%', height: '100%' }}>
                {isUnlocking && <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke="rgba(0,0,0,0.1)" strokeWidth="6" />}
                <circle
                  cx="50%" cy="50%" r={radius} fill="transparent"
                  stroke={isUnlocking ? "#dc2626" : (isLocked ? "white" : "var(--color-team-red)")}
                  strokeWidth={isUnlocking ? "6" : "4"}
                  strokeDasharray={circumference}
                  style={{ strokeDashoffset, transition: isLocked ? 'none' : 'stroke-dashoffset 16ms linear', filter: isUnlocking ? 'drop-shadow(0 0 4px rgba(0,0,0,0.2)) drop-shadow(0 0 8px rgba(220,38,38,0.4))' : 'none' }}
                  strokeLinecap="round"
                />
              </svg>
            )}
            <div className="relative w-5 h-5 flex items-center justify-center">
              <Lock size={20} className={`absolute transition-all duration-300 transform ${isLocked ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`} />
              <Unlock size={20} className={`absolute transition-all duration-300 transform ${isLocked ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
            </div>
          </button>

          <button
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-colors border-2 border-white ${isOpen ? 'bg-gray-700' : 'bg-team-blue'} ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => { if (!isLocked && Date.now() - dragStartTime.current < 200) setIsOpen(!isOpen); }}
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <Menu size={24} className={`absolute transition-all duration-300 transform ${isOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
              <X size={24} className={`absolute transition-all duration-300 transform ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
            </div>
          </button>

          <div className={`absolute ${pos.y > window.innerHeight / 2 ? 'bottom-28 origin-bottom flex-col-reverse' : 'top-28 origin-top flex-col'} left-0 w-12 flex gap-2 transition-all duration-200 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
            {!isOnline && (
              <div className="w-12 h-12 bg-amber-100 border border-amber-200 rounded-full flex items-center justify-center text-amber-600 animate-pulse" title="离线模式">
                <CloudOff size={20} />
              </div>
            )}
            <button onClick={() => onToggleUiMode(uiMode === 'full' ? 'top' : (uiMode === 'top' ? 'bottom' : 'full'))} className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center transition-all duration-300 relative overflow-hidden ${uiMode !== 'full' ? 'bg-green-400 text-white' : 'bg-white text-blue-600'}`}>
              <div className="absolute inset-0 flex items-center justify-center"><TopModeIcon active={uiMode === 'top' || uiMode === 'full'} /></div>
              <div className="absolute inset-0 flex items-center justify-center"><BottomModeIcon active={uiMode === 'bottom'} /></div>
            </button>
            <button onClick={() => { setIsOpen(false); onToggleLang(); }} className="w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-50 flex items-center justify-center text-blue-600"><Languages size={20} /></button>
            <button onClick={() => { setIsOpen(false); onResetLevels(); }} className="w-12 h-12 bg-white text-red-600 rounded-full shadow-md hover:bg-red-50 flex items-center justify-center"><RotateCw size={20} /></button>
            <button onClick={() => { setIsOpen(false); onStartTutorial(); }} className="w-12 h-12 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50 flex items-center justify-center"><AlertCircle size={20} /></button>
          </div>
        </div>
      </div>
    </>
  );
};
