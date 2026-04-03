import { useState, useEffect, useRef } from 'react';
import {
  ChevronUp, ChevronDown, History, List,
  LayoutGrid
} from 'lucide-react';
import { LANGUAGES, type Lang } from './i18n';
import type { PlayerId, PlayerConfig } from './types/scoring';
import { CARD_SEQUENCE } from './types/scoring';
import { useScoring } from './hooks/useScoring';
import { useI18n } from './hooks/useI18n';
import { useSecurity } from './hooks/useSecurity';
import { storageAdapter } from './utils/storage';

// Components
import { Modal } from './components/Common/Modal';
import { SwipeControl } from './components/Common/SwipeControl';
import { PlayerButton } from './components/Common/PlayerButton';
import { ManualScoreContent } from './components/Scoring/ManualScoreContent';
import { ScoreInputContent } from './components/Scoring/ScoreInputContent';
import { HistoryContent } from './components/History/HistoryContent';
import { TutorialOverlay } from './components/Tutorial/TutorialOverlay';
import { DraggableDrawer } from './components/Layout/DraggableDrawer';
import { PWAUpdatePrompt } from './components/Layout/PWAUpdatePrompt';

// --- 类型定义 ---

interface InternalPlayerConfig extends PlayerConfig {
  id: PlayerId;
  defaultName: string;
  color: 'red' | 'blue';
  position: 'top' | 'bottom' | 'left' | 'right';
}

const INITIAL_PLAYERS: Record<PlayerId, InternalPlayerConfig> = {
  N: { id: 'N', defaultName: 'north', color: 'red', position: 'top' },
  S: { id: 'S', defaultName: 'south', color: 'red', position: 'bottom' },
  W: { id: 'W', defaultName: 'west', color: 'blue', position: 'left' },
  E: { id: 'E', defaultName: 'east', color: 'blue', position: 'right' },
};

const SOLO_CANDIDATES = [
  { val: 15, label: '15 (6⚡)', defaultRemark: '6⚡' },
  { val: 30, label: '30 (7⚡)', defaultRemark: '7⚡' },
  { val: 45, label: '45 (8⚡)', defaultRemark: '8⚡' },
  { val: 60, label: '60 (王⚡)', defaultRemark: '王⚡' },
];

export default function App() {
  const scoring = useScoring();
  const { lang, t, changeLang, isLoaded: i18nLoaded } = useI18n();
  const security = useSecurity(() => {
    setIsDrawerOpen(false); // 自动锁定时关闭菜单
  });

  const { isLocked, recordActivity } = security;

  // --- 状态 ---
  const [playerNames, setPlayerNames] = useState<Record<PlayerId, string>>({
    N: '北', S: '南', W: '西', E: '东'
  });

  const [historyView, setHistoryView] = useState<'list' | 'table'>('list');
  const [scoringMode, setScoringMode] = useState<'auto' | 'manual'>('auto');
  const [uiMode, setUiMode] = useState<'full' | 'top' | 'bottom'>('full');
  const [fabPos, setFabPos] = useState<{ x: number, y: number } | null>(null);
  const [activeModal, setActiveModal] = useState<'none' | 'action' | 'score' | 'history' | 'editName' | 'lang'>('none');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerId | null>(null);
  const [scoreMode, setScoreMode] = useState<'solo' | 'duo'>('solo');
  const [duoPartner, setDuoPartner] = useState<PlayerId | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: any;
    onConfirm: () => void;
  }>({ isOpen: false, message: '', onConfirm: () => { } });

  const [tutorialStep, setTutorialStep] = useState<number>(-1);
  const preTutorialUiMode = useRef<typeof uiMode>(uiMode);

  useEffect(() => {
    if (tutorialStep >= 0) {
      if (uiMode !== 'full' && preTutorialUiMode.current === 'full') {
        preTutorialUiMode.current = uiMode;
      }
      setUiMode('full');
    } else if (scoring.isLoaded && i18nLoaded) {
      setUiMode(preTutorialUiMode.current);
    }
  }, [tutorialStep, scoring.isLoaded, i18nLoaded]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    window.addEventListener('contextmenu', handleContextMenu);

    window.addEventListener('click', recordActivity);
    window.addEventListener('touchstart', recordActivity);
    window.addEventListener('mousemove', recordActivity);
    window.addEventListener('keydown', recordActivity);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', recordActivity);
      window.removeEventListener('touchstart', recordActivity);
      window.removeEventListener('mousemove', recordActivity);
      window.removeEventListener('keydown', recordActivity);
    };
  }, [recordActivity]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFabPos({ x: window.innerWidth - 60, y: window.innerHeight / 2 });
    }
    const data = storageAdapter.get();
    const hasSeenTutorial = localStorage.getItem('scoreboard_tutorial_seen');
    if (data.playerNames) setPlayerNames(data.playerNames);
    if (data.historyView) setHistoryView(data.historyView);
    if (data.uiMode) setUiMode(data.uiMode);
    if (data.fabPos) {
      const { x, y } = data.fabPos;
      const sw = window.innerWidth;
      const sh = window.innerHeight;
      setFabPos({ x: Math.min(Math.max(10, x), sw - 58), y: Math.min(Math.max(10, y), sh - 114) });
    } else if (lang === 'en') {
      setPlayerNames({ N: 'North', S: 'South', W: 'West', E: 'East' });
    }
    if (!hasSeenTutorial) setTimeout(() => setTutorialStep(0), 500);
  }, [i18nLoaded]);

  useEffect(() => {
    if (tutorialStep >= 2 && tutorialStep <= 4) setIsDrawerOpen(true);
    else if (tutorialStep !== -1) setIsDrawerOpen(false);
  }, [tutorialStep]);

  useEffect(() => {
    if (!scoring.isLoaded) return;
    storageAdapter.update({ playerNames, historyView, uiMode, fabPos });
  }, [playerNames, historyView, fabPos, uiMode, scoring.isLoaded]);

  const handleCardChange = (side: 'left' | 'right', delta: number) => scoring.updateLevel(side, delta, CARD_SEQUENCE.length);

  const handleResetLevels = () => {
    setConfirmModal({
      isOpen: true,
      message: t('confirmResetLevel'),
      onConfirm: () => {
        scoring.resetLevels();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleAddScore = (points: number, remarkInput: string) => {
    if (!selectedPlayer) return;
    const winnerIds: PlayerId[] = [selectedPlayer];
    if (scoreMode === 'duo' && duoPartner) winnerIds.push(duoPartner);
    let finalRemark = remarkInput.trim() || SOLO_CANDIDATES.find(c => c.val === points)?.defaultRemark || String(points);
    scoring.addScore(scoreMode, winnerIds, points, finalRemark);
    closeModal();
  };

  const handleManualScore = (deltas: Record<PlayerId, number>, remarkInput: string) => {
    scoring.addManualScore(deltas, remarkInput);
    closeModal();
  };

  const handleDeleteHistory = (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: t('confirmDelete'),
      onConfirm: () => {
        scoring.deleteRecord(id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleUpdateName = (newName: string) => {
    if (selectedPlayer && newName.trim()) setPlayerNames(prev => ({ ...prev, [selectedPlayer]: newName.trim() }));
    closeModal();
  };

  const closeModal = () => {
    setActiveModal('none');
    setSelectedPlayer(null);
    setDuoPartner(null);
    setScoringMode('auto');
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden font-sans text-gray-900 select-none relative">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className={`flex-none p-3 grid grid-cols-3 gap-3 pt-4 transition-all duration-500 ease-in-out overflow-hidden ${uiMode === 'top' ? 'h-full opacity-100' : uiMode === 'bottom' ? 'h-0 p-0 opacity-0 pointer-events-none' : 'h-[40%] opacity-100'}`}>
          <SwipeControl className="h-full" colorClass="bg-red-500 text-white" onSwipeUp={() => handleCardChange('left', 1)} onSwipeDown={() => handleCardChange('left', -1)} valueKey={`left-${scoring.levels.left}`}>
            <div className="text-sm opacity-80 mb-2">{t('redLevel')}</div>
            <div className={`font-bold transition-all ${uiMode === 'top' ? 'text-9xl' : 'text-6xl'}`}>{CARD_SEQUENCE[scoring.levels.left]}</div>
            <div className="absolute top-2 opacity-50">{!isLocked && <ChevronUp size={uiMode === 'top' ? 32 : 20} />}</div>
            <div className="absolute bottom-2 opacity-50">{!isLocked && <ChevronDown size={uiMode === 'top' ? 32 : 20} />}</div>
          </SwipeControl>
          <SwipeControl className="h-full" colorClass="bg-yellow-400 text-yellow-900" onSwipeUp={() => scoring.incrementRound()} onSwipeDown={() => scoring.decrementRound()} valueKey={`middle-${scoring.round}`}>
            <div className="text-sm opacity-80 mb-2">{t('round')}</div>
            <div className={`font-mono font-bold transition-all ${uiMode === 'top' ? 'text-9xl' : 'text-7xl'}`}>{scoring.round}</div>
            <div className="absolute top-2 opacity-50">{!isLocked && <ChevronUp size={uiMode === 'top' ? 32 : 20} />}</div>
            <div className="absolute bottom-2 opacity-50">{!isLocked && <ChevronDown size={uiMode === 'top' ? 32 : 20} />}</div>
          </SwipeControl>
          <SwipeControl className="h-full" colorClass="bg-blue-500 text-white" onSwipeUp={() => handleCardChange('right', 1)} onSwipeDown={() => handleCardChange('right', -1)} valueKey={`right-${scoring.levels.right}`}>
            <div className="text-sm opacity-80 mb-2">{t('blueLevel')}</div>
            <div className={`font-bold transition-all ${uiMode === 'top' ? 'text-9xl' : 'text-6xl'}`}>{CARD_SEQUENCE[scoring.levels.right]}</div>
            <div className="absolute top-2 opacity-50">{!isLocked && <ChevronUp size={uiMode === 'top' ? 32 : 20} />}</div>
            <div className="absolute bottom-2 opacity-50">{!isLocked && <ChevronDown size={uiMode === 'top' ? 32 : 20} />}</div>
          </SwipeControl>
        </div>

        <div className={`relative p-3 pb-8 transition-all duration-500 ease-in-out overflow-hidden ${uiMode === 'bottom' ? 'h-full flex-1 opacity-100' : uiMode === 'top' ? 'h-0 p-0 opacity-0 pointer-events-none' : 'flex-1 opacity-100'}`}>
          <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-2">
            <div className="col-start-2 row-start-1"><PlayerButton config={INITIAL_PLAYERS.N} name={playerNames.N} score={scoring.totalScores.N} onClick={() => { if (scoringMode === 'manual') setActiveModal('score'); else { setSelectedPlayer('N'); setActiveModal('action'); } }} /></div>
            <div className="col-start-1 row-start-2"><PlayerButton config={INITIAL_PLAYERS.W} name={playerNames.W} score={scoring.totalScores.W} onClick={() => { if (scoringMode === 'manual') setActiveModal('score'); else { setSelectedPlayer('W'); setActiveModal('action'); } }} /></div>
            <div className="col-start-2 row-start-2 bg-gray-200 rounded-xl shadow-inner relative active:bg-gray-300 transition-colors overflow-hidden flex flex-col text-xs" onClick={() => setActiveModal('history')}>
              <div className="flex-1 w-full border-b border-gray-300 flex items-center justify-center relative px-1"><div className="text-red-600 font-bold text-center line-clamp-1 overflow-hidden w-full" style={{ wordBreak: 'break-all' }}>{scoring.aggregatedRemarks.N}</div></div>
              <div className="flex-1 w-full flex border-b border-gray-300">
                <div className="flex-1 h-full border-r border-gray-300 flex items-center justify-center relative px-1"><div className="text-blue-600 font-bold text-center line-clamp-1 overflow-hidden w-full" style={{ wordBreak: 'break-all' }}>{scoring.aggregatedRemarks.W}</div></div>
                <div className="flex-1 h-full flex items-center justify-center relative px-1"><div className="text-blue-600 font-bold text-center line-clamp-1 overflow-hidden w-full" style={{ wordBreak: 'break-all' }}>{scoring.aggregatedRemarks.E}</div></div>
              </div>
              <div className="flex-1 w-full flex items-center justify-center relative px-1"><div className="text-red-600 font-bold text-center line-clamp-1 overflow-hidden w-full" style={{ wordBreak: 'break-all' }}>{scoring.aggregatedRemarks.S}</div></div>
              {!scoring.aggregatedRemarks.N && !scoring.aggregatedRemarks.S && !scoring.aggregatedRemarks.W && !scoring.aggregatedRemarks.E && <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none"><History size={uiMode === 'bottom' ? 48 : 24} /></div>}
            </div>
            <div className="col-start-3 row-start-2"><PlayerButton config={INITIAL_PLAYERS.E} name={playerNames.E} score={scoring.totalScores.E} onClick={() => { if (scoringMode === 'manual') setActiveModal('score'); else { setSelectedPlayer('E'); setActiveModal('action'); } }} /></div>
            <div className="col-start-2 row-start-3"><PlayerButton config={INITIAL_PLAYERS.S} name={playerNames.S} score={scoring.totalScores.S} onClick={() => { if (scoringMode === 'manual') setActiveModal('score'); else { setSelectedPlayer('S'); setActiveModal('action'); } }} /></div>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-[65] pointer-events-none overflow-hidden`}>
        <svg className="w-full h-full overflow-visible">
          {[
            { color: '#FF0000', delay: '0ms', dash: 'none', width: 12, offset: 0 },
            { color: '#FF4500', delay: '30ms', dash: '60, 30', width: 8, offset: 5 },
            { color: '#FFD700', delay: '60ms', dash: 'none', width: 10, offset: 10 },
            { color: '#32CD32', delay: '90ms', dash: '30, 15', width: 18, offset: 15 },
            { color: '#00FA9A', delay: '120ms', dash: 'none', width: 8, offset: 20 },
            { color: '#00CED1', delay: '150ms', dash: '15, 8', width: 25, offset: 25 },
            { color: '#1E90FF', delay: '180ms', dash: 'none', width: 12, offset: 30 },
            { color: '#0000FF', delay: '210ms', dash: '40, 20', width: 30, offset: 35 },
            { color: '#8A2BE2', delay: '240ms', dash: 'none', width: 15, offset: 40 },
            { color: '#FF00FF', delay: '270ms', dash: '20, 15', width: 40, offset: 45 },
          ].map((ring, i) => (
            <circle key={i} cx={fabPos ? fabPos.x + 24 : '100%'} cy={fabPos ? fabPos.y + 24 : '50%'} r={isLocked ? "0" : `${150 + ring.offset}vmax`} fill="none" stroke={ring.color} strokeWidth={ring.width} strokeDasharray={ring.dash} style={{ transition: `r 1000ms cubic-bezier(0.15, 1, 0.3, 1) ${ring.delay}, opacity 1000ms ease ${ring.delay}, transform 1200ms cubic-bezier(0.15, 1, 0.3, 1) ${ring.delay}`, transformOrigin: `${fabPos ? fabPos.x + 24 : 0}px ${fabPos ? fabPos.y + 24 : 0}px`, transform: isLocked ? 'rotate(180deg)' : 'rotate(0deg)', opacity: isLocked ? 0.4 : 0, filter: `blur(4px) drop-shadow(0 0 ${isLocked ? 10 : 0}px currentColor)` }} strokeLinecap="round" />
          ))}
        </svg>
      </div>

      {isLocked && <div className="fixed inset-0 z-[64] bg-transparent touch-none" onClick={(e) => e.stopPropagation()} />}

      {fabPos && (
        <DraggableDrawer
          initialPos={fabPos} onPosChange={setFabPos} onResetLevels={handleResetLevels} onStartTutorial={() => setTutorialStep(0)}
          uiMode={uiMode} onToggleUiMode={(target: 'full' | 'top' | 'bottom') => setUiMode(prev => (prev === target ? 'full' : target))}
          isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} onToggleLang={() => setActiveModal('lang')}
          security={security}
        />
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setConfirmModal(p => ({ ...p, isOpen: false }))}>
          <div className="bg-white w-full max-w-xs rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center" onClick={e => e.stopPropagation()}>
            <div className="text-lg text-gray-800 mb-6 font-medium w-full">{confirmModal.message}</div>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirmModal(p => ({ ...p, isOpen: false }))} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold">{t('cancel')}</button>
              <button onClick={confirmModal.onConfirm} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">{t('confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'action' && selectedPlayer && (
        <Modal onClose={closeModal} title={t('actionTitle', { name: playerNames[selectedPlayer] })}>
          <div className="grid grid-cols-1 gap-3">
            <button className="p-4 bg-gray-100 rounded-lg flex items-center justify-center gap-2" onClick={() => setActiveModal('editName')}>修改名字</button>
            <button className="p-4 bg-yellow-100 text-yellow-800 rounded-lg flex items-center justify-center gap-2" onClick={() => { setScoreMode('solo'); setActiveModal('score'); }}>{t('soloScore')}</button>
            <button className="p-4 bg-purple-100 text-purple-800 rounded-lg flex items-center justify-center gap-2" onClick={() => { setScoreMode('duo'); setActiveModal('score'); }}>{t('duoScore')}</button>
            <button className="p-4 bg-orange-100 text-orange-800 rounded-lg flex items-center justify-center gap-2" onClick={() => { setScoringMode('manual'); setActiveModal('score'); }}>{t('manualMode')}</button>
          </div>
        </Modal>
      )}

      {activeModal === 'score' && (
        <Modal onClose={closeModal} title={scoringMode === 'manual' ? t('manualScoreTitle') : (scoreMode === 'solo' ? t('soloTitle') : t('duoTitle'))}>
          {scoringMode === 'manual' ? <ManualScoreContent players={playerNames} onConfirm={handleManualScore} t={t} confirmModal={setConfirmModal} /> : <ScoreInputContent mode={scoreMode} currentPlayerId={selectedPlayer} players={playerNames} onConfirm={handleAddScore} partner={duoPartner} setPartner={setDuoPartner} t={t} soloCandidates={SOLO_CANDIDATES} />}
        </Modal>
      )}

      {activeModal === 'editName' && selectedPlayer && (
        <Modal onClose={closeModal} title={t('editNameTitle')}>
          <input value={playerNames[selectedPlayer]} onChange={e => handleUpdateName(e.target.value)} className="w-full p-3 border rounded-lg mb-4 text-center text-lg" autoFocus />
          <button onClick={closeModal} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">{t('save')}</button>
        </Modal>
      )}

      {activeModal === 'lang' && (
        <Modal onClose={closeModal} title={t('settings')} zIndex="z-[120]">
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(LANGUAGES).map(([key, config]) => (
              <button key={key} onClick={() => { changeLang(key as Lang); closeModal(); }} className={`p-4 rounded-lg flex items-center justify-between ${lang === key ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50'}`}>
                <span className="text-lg font-medium">{config.name}</span>
                {lang === key && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {activeModal === 'history' && (
        <Modal onClose={closeModal} title={t('historyTitle')} headerAction={<div className="flex bg-gray-100 p-0.5 rounded-lg"><button onClick={() => setHistoryView('list')} className={`p-1.5 rounded-md ${historyView === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}><List size={18} /></button><button onClick={() => setHistoryView('table')} className={`p-1.5 rounded-md ${historyView === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}><LayoutGrid size={18} /></button></div>}>
          <HistoryContent history={scoring.history} playerNames={playerNames} onDelete={handleDeleteHistory} t={t} viewMode={historyView} initialPlayers={INITIAL_PLAYERS} />
        </Modal>
      )}

      {tutorialStep >= 0 && <TutorialOverlay step={tutorialStep} t={t} onNext={() => setTutorialStep(prev => prev + 1)} onPrev={() => setTutorialStep(prev => Math.max(0, prev - 1))} onClose={() => { setTutorialStep(-1); localStorage.setItem('scoreboard_tutorial_seen', 'true'); }} fabPos={fabPos} onToggleLang={() => setActiveModal('lang')} />}
      
      <PWAUpdatePrompt />
    </div>
  );
}
