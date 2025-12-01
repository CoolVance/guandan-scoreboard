import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronUp, ChevronDown, History,
  User, Users, Edit3, Trash2, X, AlertCircle, Languages, RotateCw, Menu, Lock, Unlock
} from 'lucide-react';

// --- 类型定义 ---

type PlayerId = 'N' | 'S' | 'W' | 'E';
import { LANGUAGES, TRANSLATIONS, type Lang } from './i18n';

interface PlayerConfig {
  id: PlayerId;
  defaultName: string;
  color: 'red' | 'blue';
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface ScoreRecord {
  id: string;
  timestamp: number;
  type: 'solo' | 'duo';
  score: number;
  winnerIds: PlayerId[];
  loserIds: PlayerId[];
  remark: string;
}

// 扑克牌序列
const CARD_SEQUENCE = [
  '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A1', 'A2', 'A3'
];

// 初始玩家配置
const INITIAL_PLAYERS: Record<PlayerId, PlayerConfig> = {
  N: { id: 'N', defaultName: 'north', color: 'red', position: 'top' },
  S: { id: 'S', defaultName: 'south', color: 'red', position: 'bottom' },
  W: { id: 'W', defaultName: 'west', color: 'blue', position: 'left' },
  E: { id: 'E', defaultName: 'east', color: 'blue', position: 'right' },
};

// 独赢候选项配置 (带默认备注)
const SOLO_CANDIDATES = [
  { val: 15, label: '15 (6⚡)', defaultRemark: '6⚡' },
  { val: 30, label: '30 (7⚡)', defaultRemark: '7⚡' },
  { val: 45, label: '45 (8⚡)', defaultRemark: '8⚡' },
  { val: 60, label: '60 (王⚡)', defaultRemark: '王⚡' },
];

// --- 主组件 ---

export default function App() {
  // --- 状态 ---
  const [lang, setLang] = useState<Lang>('zh');
  const t = (key: keyof typeof TRANSLATIONS['zh'], params?: Record<string, string>) => {
    let text = TRANSLATIONS[lang][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  const [leftCardIdx, setLeftCardIdx] = useState(0);
  const [rightCardIdx, setRightCardIdx] = useState(0);
  const [middleNum, setMiddleNum] = useState(1);

  const [playerNames, setPlayerNames] = useState<Record<PlayerId, string>>({
    N: '北', S: '南', W: '西', E: '东'
  });

  const [history, setHistory] = useState<ScoreRecord[]>([]);

  // 悬浮按钮位置状态 (初始化为 null，组件挂载后计算屏幕边缘)
  const [fabPos, setFabPos] = useState<{ x: number, y: number } | null>(null);

  const [activeModal, setActiveModal] = useState<'none' | 'action' | 'score' | 'history' | 'editName' | 'lang'>('none');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerId | null>(null);
  const [scoreMode, setScoreMode] = useState<'solo' | 'duo'>('solo');
  const [duoPartner, setDuoPartner] = useState<PlayerId | null>(null);

  // 确认框状态
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, message: '', onConfirm: () => { } });

  // 教程状态
  const [tutorialStep, setTutorialStep] = useState<number>(-1); // -1 表示未开始
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const lastActivity = useRef(Date.now());

  // 自动锁定逻辑
  useEffect(() => {
    const checkIdle = () => {
      if (!isLocked && Date.now() - lastActivity.current > 10000) {
        setIsLocked(true);
      }
    };
    const timer = setInterval(checkIdle, 1000);

    const updateActivity = () => {
      lastActivity.current = Date.now();
    };

    window.addEventListener('click', updateActivity);
    window.addEventListener('touchstart', updateActivity);
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);

    return () => {
      clearInterval(timer);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, [isLocked]);

  // --- 初始化与持久化 ---
  useEffect(() => {
    // 简单的语言检测
    const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    setLang(browserLang);

    // 初始化悬浮球位置 (屏幕右侧中间)
    if (typeof window !== 'undefined') {
      setFabPos({ x: window.innerWidth - 60, y: window.innerHeight / 2 });
    }

    const saved = localStorage.getItem('scoreboard_v5');
    const hasSeenTutorial = localStorage.getItem('scoreboard_tutorial_seen');

    if (saved) {
      try {
        const data = JSON.parse(saved);
        setLeftCardIdx(data.leftCardIdx ?? 0);
        setRightCardIdx(data.rightCardIdx ?? 0);
        setMiddleNum(data.middleNum ?? 1);
        setPlayerNames(data.playerNames ?? { N: '北', S: '南', W: '西', E: '东' });
        setHistory(data.history ?? []);
        if (data.lang) setLang(data.lang);
        if (data.fabPos) {
          const { x, y } = data.fabPos;
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;
          const safeX = Number.isFinite(x) ? Math.min(Math.max(10, x), screenWidth - 58) : screenWidth - 60;
          const safeY = Number.isFinite(y) ? Math.min(Math.max(10, y), screenHeight - 114) : screenHeight / 2;
          setFabPos({ x: safeX, y: safeY });
        }
      } catch (e) {
        console.error("Load failed", e);
      }
    } else {
      if (browserLang === 'en') {
        setPlayerNames({ N: 'North', S: 'South', W: 'West', E: 'East' });
      }
    }

    setIsLoaded(true);

    // 新增: 如果未见过教程，则触发教程
    if (!hasSeenTutorial) {
      setTimeout(() => setTutorialStep(0), 500);
    }
  }, []);

  // 教程期间自动打开/关闭菜单
  useEffect(() => {
    if (tutorialStep === 2 || tutorialStep === 3) {
      setIsDrawerOpen(true);
    } else if (tutorialStep !== -1) {
      setIsDrawerOpen(false);
    }
  }, [tutorialStep]);

  useEffect(() => {
    if (!isLoaded) return;
    const data = {
      leftCardIdx,
      rightCardIdx,
      middleNum,
      playerNames,
      history,
      lang,
      fabPos
    };
    localStorage.setItem('scoreboard_v5', JSON.stringify(data));
  }, [leftCardIdx, rightCardIdx, middleNum, playerNames, history, lang, fabPos, isLoaded]);

  // 自动选择队友
  useEffect(() => {
    if (activeModal === 'score' && scoreMode === 'duo' && selectedPlayer) {
      const myColor = INITIAL_PLAYERS[selectedPlayer].color;
      const partner = Object.values(INITIAL_PLAYERS).find(p => p.color === myColor && p.id !== selectedPlayer);
      if (partner) setDuoPartner(partner.id);
    }
  }, [activeModal, scoreMode, selectedPlayer]);

  // --- 衍生状态计算 ---

  const totalScores = useMemo(() => {
    const scores: Record<PlayerId, number> = { N: 0, S: 0, W: 0, E: 0 };
    history.forEach(record => {
      const { score, winnerIds, loserIds } = record;
      if (record.type === 'solo') {
        winnerIds.forEach(id => scores[id] += score);
        const deduct = score / 3;
        loserIds.forEach(id => scores[id] -= deduct);
      } else {
        winnerIds.forEach(id => scores[id] += score);
        loserIds.forEach(id => scores[id] -= score);
      }
    });
    return scores;
  }, [history]);

  // 计算聚合备注 (拼接显示)
  const aggregatedRemarks = useMemo(() => {
    const remarks: Record<PlayerId, string> = { N: '', S: '', W: '', E: '' };

    // 遍历四个玩家
    (['N', 'S', 'W', 'E'] as PlayerId[]).forEach(pid => {
      // 找到该玩家作为赢家且有备注的所有记录
      const playerRecords = history.filter(h => h.winnerIds.includes(pid) && h.remark);
      // 拼接
      remarks[pid] = playerRecords.map(r => r.remark).join('、');
    });

    return remarks;
  }, [history]);

  // --- 交互处理 ---

  const handleCardChange = (side: 'left' | 'right', delta: number) => {
    const setter = side === 'left' ? setLeftCardIdx : setRightCardIdx;
    setter(prev => {
      const next = prev + delta;
      if (next < 0) return CARD_SEQUENCE.length - 1;
      if (next >= CARD_SEQUENCE.length) return 0;
      return next;
    });
  };

  const handleResetLevels = () => {
    setConfirmModal({
      isOpen: true,
      message: t('confirmResetLevel'),
      onConfirm: () => {
        setLeftCardIdx(0);
        setRightCardIdx(0);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleClearHistory = () => {
    setConfirmModal({
      isOpen: true,
      message: t('confirmClearHistory'),
      onConfirm: () => {
        setHistory([]);
        setMiddleNum(1);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setActiveModal('none');
      }
    });
  };

  const handleAddScore = (points: number, remarkInput: string) => {
    if (!selectedPlayer) return;

    const winnerIds: PlayerId[] = [selectedPlayer];
    if (scoreMode === 'duo' && duoPartner) {
      winnerIds.push(duoPartner);
    }

    const allIds: PlayerId[] = ['N', 'S', 'E', 'W'];
    const loserIds = allIds.filter(id => !winnerIds.includes(id));

    // 默认备注逻辑
    let finalRemark = remarkInput.trim();
    if (!finalRemark) {
      // 检查是否有特定分数对应的默认备注
      const matchCandidate = SOLO_CANDIDATES.find(c => c.val === points);
      if (matchCandidate && matchCandidate.defaultRemark) {
        finalRemark = matchCandidate.defaultRemark;
      } else {
        // 兜底：如果没匹配且没输入，显示分数
        finalRemark = String(points);
      }
    }

    const newRecord: ScoreRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type: scoreMode,
      score: points,
      winnerIds,
      loserIds,
      remark: finalRemark
    };

    setHistory(prev => [...prev, newRecord]);
    closeModal();
  };

  const handleDeleteHistory = (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: t('confirmDelete'),
      onConfirm: () => {
        const newHistory = history.filter(h => h.id !== id);
        setHistory(newHistory);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleUpdateName = (newName: string) => {
    if (selectedPlayer && newName.trim()) {
      setPlayerNames(prev => ({ ...prev, [selectedPlayer]: newName.trim() }));
    }
    closeModal();
  };

  const closeModal = () => {
    setActiveModal('none');
    setSelectedPlayer(null);
    setDuoPartner(null);
  };

  const toggleLang = () => {
    setActiveModal('lang');
  };

  const startTutorial = () => {
    setTutorialStep(0);
  };

  const nextTutorialStep = () => {
    setTutorialStep(prev => prev + 1);
  };

  const closeTutorial = () => {
    setTutorialStep(-1);
    localStorage.setItem('scoreboard_tutorial_seen', 'true');
  };

  // --- 界面组件 ---

  const SwipeControl = ({ children, onSwipeUp, onSwipeDown, className, colorClass }: any) => {
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
        className={`${className} ${colorClass} relative flex flex-col items-center justify-center select-none active:brightness-90 transition-all shadow-md rounded-xl overflow-hidden touch-none`}
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

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden font-sans text-gray-900 select-none relative">

      {/* 顶部区域 */}
      <div className="flex-none h-[40%] p-3 grid grid-cols-3 gap-3 pt-4">
        <SwipeControl
          className="h-full" colorClass="bg-red-500 text-white"
          onSwipeUp={() => handleCardChange('left', 1)}
          onSwipeDown={() => handleCardChange('left', -1)}
        >
          <div className="text-sm opacity-80 mb-2">{t('redLevel')}</div>
          <div className="text-6xl font-bold">{CARD_SEQUENCE[leftCardIdx]}</div>
          <div className="absolute top-2 opacity-50">{!isLocked && <ChevronUp size={20} />}</div>
          <div className="absolute bottom-2 opacity-50">{!isLocked && <ChevronDown size={20} />}</div>
        </SwipeControl>

        <SwipeControl
          className="h-full" colorClass="bg-yellow-400 text-yellow-900"
          onSwipeUp={() => setMiddleNum(p => Math.max(1, p + 1))}
          onSwipeDown={() => setMiddleNum(p => Math.max(1, p - 1))}
        >
          <div className="text-sm opacity-80 mb-2">{t('round')}</div>
          <div className="text-7xl font-mono font-bold">{middleNum}</div>
          <div className="absolute top-2 opacity-50">{!isLocked && <ChevronUp size={20} />}</div>
          <div className="absolute bottom-2 opacity-50">{!isLocked && <ChevronDown size={20} />}</div>
        </SwipeControl>

        <SwipeControl
          className="h-full" colorClass="bg-blue-500 text-white"
          onSwipeUp={() => handleCardChange('right', 1)}
          onSwipeDown={() => handleCardChange('right', -1)}
        >
          <div className="text-sm opacity-80 mb-2">{t('blueLevel')}</div>
          <div className="text-6xl font-bold">{CARD_SEQUENCE[rightCardIdx]}</div>
          <div className="absolute top-2 opacity-50">{!isLocked && <ChevronUp size={20} />}</div>
          <div className="absolute bottom-2 opacity-50">{!isLocked && <ChevronDown size={20} />}</div>
        </SwipeControl>
      </div>

      {/* 底部十字计分盘 */}
      <div className="flex-1 p-3 pb-8 relative">
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-2">

          <div className="col-start-2 row-start-1">
            <PlayerButton config={INITIAL_PLAYERS.N} name={playerNames.N} score={totalScores.N} onClick={() => { setSelectedPlayer('N'); setActiveModal('action'); }} />
          </div>

          <div className="col-start-1 row-start-2">
            <PlayerButton config={INITIAL_PLAYERS.W} name={playerNames.W} score={totalScores.W} onClick={() => { setSelectedPlayer('W'); setActiveModal('action'); }} />
          </div>

          {/* 中间灰色区域 - 三段式布局 */}
          <div className="col-start-2 row-start-2 bg-gray-200 rounded-xl shadow-inner relative active:bg-gray-300 transition-colors overflow-hidden flex flex-col text-xs"
            onClick={() => setActiveModal('history')}>

            {/* 上部：北 */}
            <div className="flex-1 w-full border-b border-gray-300 flex items-center justify-center relative px-1">
              <div className="text-red-600 font-bold text-center line-clamp-1 overflow-hidden w-full" style={{ wordBreak: 'break-all' }}>{aggregatedRemarks.N}</div>
            </div>

            {/* 中部：西 | 东 */}
            <div className="flex-1 w-full flex border-b border-gray-300">
              <div className="flex-1 h-full border-r border-gray-300 flex items-center justify-center relative px-1">
                <div className="text-blue-600 font-bold text-center line-clamp-1 overflow-hidden w-full" style={{ wordBreak: 'break-all' }}>{aggregatedRemarks.W}</div>
              </div>
              <div className="flex-1 h-full flex items-center justify-center relative px-1">
                <div className="text-blue-600 font-bold text-center line-clamp-1 overflow-hidden w-full" style={{ wordBreak: 'break-all' }}>{aggregatedRemarks.E}</div>
              </div>
            </div>

            {/* 下部：南 */}
            <div className="flex-1 w-full flex items-center justify-center relative px-1">
              <div className="text-red-600 font-bold text-center line-clamp-1 overflow-hidden w-full" style={{ wordBreak: 'break-all' }}>{aggregatedRemarks.S}</div>
            </div>

            {/* 如果全空，显示历史图标 */}
            {!aggregatedRemarks.N && !aggregatedRemarks.S && !aggregatedRemarks.W && !aggregatedRemarks.E && (
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <History size={24} />
              </div>
            )}
          </div>

          <div className="col-start-3 row-start-2">
            <PlayerButton config={INITIAL_PLAYERS.E} name={playerNames.E} score={totalScores.E} onClick={() => { setSelectedPlayer('E'); setActiveModal('action'); }} />
          </div>

          <div className="col-start-2 row-start-3">
            <PlayerButton config={INITIAL_PLAYERS.S} name={playerNames.S} score={totalScores.S} onClick={() => { setSelectedPlayer('S'); setActiveModal('action'); }} />
          </div>

        </div>
      </div>

      {/* --- 悬浮抽屉 (Floating Action Button / Drawer) --- */}
      {fabPos && (
        <DraggableDrawer
          initialPos={fabPos}
          onPosChange={setFabPos}
          t={t}
          onToggleLang={toggleLang}
          onResetLevels={handleResetLevels}
          onStartTutorial={startTutorial}
          lang={lang}
          isLocked={isLocked}
          setIsLocked={setIsLocked}
          isOpen={isDrawerOpen}
          setIsOpen={setIsDrawerOpen}
        />
      )}

      {/* 锁定遮罩层 */}
      {isLocked && (
        <div className="fixed inset-0 z-[65] bg-transparent" style={{ touchAction: 'none' }} onClick={(e) => { e.stopPropagation(); }} />
      )}

      {/* --- 全局确认弹窗 (Z-Index 100) --- */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150" onClick={() => setConfirmModal(p => ({ ...p, isOpen: false }))}>
          <div className="bg-white w-full max-w-xs rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center" onClick={e => e.stopPropagation()}>
            <AlertCircle size={48} className="text-yellow-500 mb-4" />
            <p className="text-lg text-gray-800 mb-6 font-medium">{confirmModal.message}</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirmModal(p => ({ ...p, isOpen: false }))} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold active:bg-gray-200">{t('cancel')}</button>
              <button onClick={confirmModal.onConfirm} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold active:bg-red-600">{t('confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 功能模态框 (Z-Index 50) --- */}

      {activeModal === 'action' && selectedPlayer && (
        <Modal onClose={closeModal} title={t('actionTitle', { name: playerNames[selectedPlayer] })} zIndex="z-50">
          <div className="grid grid-cols-1 gap-3">
            <button className="p-4 bg-gray-100 rounded-lg flex items-center justify-center gap-2 active:bg-gray-200" onClick={() => setActiveModal('editName')}>
              <Edit3 size={20} /> {t('editName')}
            </button>
            <button className="p-4 bg-yellow-100 text-yellow-800 rounded-lg flex items-center justify-center gap-2 active:bg-yellow-200" onClick={() => { setScoreMode('solo'); setActiveModal('score'); }}>
              <User size={20} /> {t('soloScore')}
            </button>
            <button className="p-4 bg-purple-100 text-purple-800 rounded-lg flex items-center justify-center gap-2 active:bg-purple-200" onClick={() => { setScoreMode('duo'); setActiveModal('score'); }}>
              <Users size={20} /> {t('duoScore')}
            </button>
          </div>
        </Modal>
      )}

      {activeModal === 'score' && selectedPlayer && (
        <Modal onClose={closeModal} title={scoreMode === 'solo' ? t('soloTitle') : t('duoTitle')} zIndex="z-50">
          <ScoreInputContent
            mode={scoreMode}
            currentPlayerId={selectedPlayer}
            players={playerNames}
            onConfirm={handleAddScore}
            partner={duoPartner}
            setPartner={setDuoPartner}
            t={t}
          />
        </Modal>
      )}

      {activeModal === 'editName' && selectedPlayer && (
        <Modal onClose={closeModal} title={t('editNameTitle')} zIndex="z-50">
          <EditNameContent initialName={playerNames[selectedPlayer]} onConfirm={handleUpdateName} t={t} />
        </Modal>
      )}

      {activeModal === 'lang' && (
        <Modal onClose={closeModal} title={t('settings')} zIndex="z-[120]">
          <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
            {Object.entries(LANGUAGES).map(([key, config]) => (
              <button
                key={key}
                onClick={() => { setLang(key as Lang); closeModal(); }}
                className={`p-4 rounded-lg flex items-center justify-between transition-colors ${lang === key ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <span className="text-lg font-medium">{config.name}</span>
                {lang === key && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {activeModal === 'history' && (
        <Modal
          onClose={closeModal}
          title={t('historyTitle')}
          zIndex="z-50"
          headerAction={
            <button onClick={handleClearHistory} className="p-2 text-red-500 hover:bg-red-50 rounded-full flex gap-1 items-center text-sm font-bold">
              <RotateCw size={16} />
              {t('clearHistory')}
            </button>
          }
        >
          <HistoryContent history={history} playerNames={playerNames} onDelete={handleDeleteHistory} t={t} />
        </Modal>
      )}

      {/* --- 教程引导 (Z-Index 110) --- */}
      {tutorialStep >= 0 && (
        <TutorialOverlay
          step={tutorialStep}
          t={t}
          onNext={nextTutorialStep}
          onClose={closeTutorial}
          fabPos={fabPos}
          onToggleLang={toggleLang}
        />
      )}

    </div>
  );
}

// --- 可拖动抽屉组件 ---
const DraggableDrawer = ({ initialPos, onPosChange, onToggleLang, onResetLevels, onStartTutorial, isLocked, setIsLocked, isOpen, setIsOpen }: any) => {
  // const [isOpen, setIsOpen] = useState(false); // Moved to parent
  const [pos, setPos] = useState(initialPos);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Sync pos with initialPos when it changes (e.g. loaded from storage)
  useEffect(() => {
    setPos(initialPos);
  }, [initialPos.x, initialPos.y]);

  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const dragStartTime = useRef(0);
  const lockTimer = useRef<any>(null);
  const lastUnlockTime = useRef(0);
  const startPos = useRef({ x: 0, y: 0 });
  const justUnlocked = useRef(false);
  const lockPressActive = useRef(false);

  // 窗口大小改变时重新吸附
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
    if (isLocked) return; // Prevent dragging when locked
    isDragging.current = true;
    setIsDraggingState(true);
    dragStartTime.current = Date.now();
    offset.current = { x: clientX - pos.x, y: clientY - pos.y };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging.current || isLocked) return; // Prevent dragging when locked
    setPos({
      x: clientX - offset.current.x,
      y: clientY - offset.current.y
    });
  };

  const handleEnd = () => {
    if (isLocked) {
      isDragging.current = false;
      setIsDraggingState(false);
      return;
    }

    if (!isDragging.current) return;
    isDragging.current = false;
    setIsDraggingState(false);

    if (justUnlocked.current) return;

    // 吸附逻辑
    const screenWidth = window.innerWidth;
    const isLeft = pos.x + 24 < screenWidth / 2;
    const newX = isLeft ? 10 : screenWidth - 58;
    let newY = Math.max(10, Math.min(window.innerHeight - 114, pos.y));

    const newPos = { x: newX, y: newY };
    setPos(newPos);
    onPosChange(newPos);
  };

  // 鼠标事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked) return; // Prevent dragging when locked
    handleStart(e.clientX, e.clientY);

    const onMouseMove = (ev: MouseEvent) => {
      handleMove(ev.clientX, ev.clientY);
    };

    const onMouseUp = (ev: MouseEvent) => {
      // 这里的 handleEnd 需要使用最新的 pos，但由于闭包问题，直接调用 handleEnd 可能拿不到最新的 pos
      // 所以我们重新计算一次位置来做吸附
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (isLocked) return; // Prevent dragging when locked

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

  // 锁定按钮逻辑
  const handleLockPressStart = () => {
    if (isLocked) {
      // 长按解锁
      lockTimer.current = setTimeout(() => {
        setIsLocked(false);
        lastUnlockTime.current = Date.now();
        justUnlocked.current = true;
        setTimeout(() => { justUnlocked.current = false; }, 500);
        // 可以加个震动反馈
        if (navigator.vibrate) navigator.vibrate(50);
      }, 1000);
    }
    startPos.current = pos;
    lockPressActive.current = true;
  };

  const handleLockPressEnd = () => {
    if (!lockPressActive.current) return;
    lockPressActive.current = false;

    if (lockTimer.current) {
      clearTimeout(lockTimer.current);
      lockTimer.current = null;
    }

    if (!isLocked) {
      // 防止解锁后立即误触锁定 (500ms 冷却)
      if (Date.now() - lastUnlockTime.current < 500) return;

      // 检查是否发生了移动
      const moveDist = Math.sqrt(Math.pow(pos.x - startPos.current.x, 2) + Math.pow(pos.y - startPos.current.y, 2));
      if (moveDist > 5) return; // 如果移动超过 5px，则认为是拖动，不触发锁定

      // 如果是点击（非拖动），则锁定
      // 使用 dragStartTime 判断点击时长
      if (Date.now() - dragStartTime.current < 200) {
        setIsLocked(true);
      }
    }
  };

  return (
    <>
      {/* 遮罩层 (仅展开时显示) */}
      {isOpen && (
        <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
      )}

      {/* 抽屉容器 */}
      <div
        className={`fixed z-[70] flex flex-col gap-2 items-center ${isDraggingState ? 'transition-none' : 'transition-all duration-300 ease-out'}`}
        style={{
          left: pos.x,
          top: pos.y,
          transform: isOpen ? 'none' : 'none',
          cursor: isLocked ? 'default' : 'grab',
          touchAction: 'none'
        }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => {
          e.stopPropagation();
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={handleEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="relative flex flex-col gap-2">
          {/* 锁定按钮 */}
          <button
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-all ${isLocked ? 'bg-red-500 animate-[pulse_2s_infinite] ring-4 ring-transparent border-2 border-white/20' : 'bg-gray-400'}`}
            style={isLocked ? {
              boxShadow: '0 0 10px rgba(255,0,0,0.5)',
              animation: 'rgb-border 2s linear infinite'
            } : {}}
            onMouseDown={handleLockPressStart}
            onMouseUp={handleLockPressEnd}
            onMouseLeave={handleLockPressEnd}
            onTouchStart={handleLockPressStart}
            onTouchEnd={handleLockPressEnd}
          >
            {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
          </button>

          {/* 菜单按钮 */}
          <button
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-colors ${isOpen ? 'bg-gray-700' : 'bg-blue-600'} ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => {
              if (isLocked) return;
              // 区分点击和拖动
              if (Date.now() - dragStartTime.current < 200) {
                setIsOpen(!isOpen);
              }
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* 展开的菜单项 */}
          <div className={`absolute ${pos.y > window.innerHeight / 2 ? 'bottom-28 origin-bottom' : 'top-28 origin-top'} left-0 w-12 flex flex-col gap-2 transition-all duration-200 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
            {/* 语言切换 */}
            <button onClick={() => { setIsOpen(false); onToggleLang(); }} className="w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-50 flex items-center justify-center text-blue-600">
              <Languages size={20} />
            </button>

            {/* 重置级别 */}
            <button onClick={() => { setIsOpen(false); onResetLevels(); }} className="w-12 h-12 bg-white text-red-600 rounded-full shadow-md hover:bg-red-50 flex items-center justify-center">
              <RotateCw size={20} />
            </button>

            {/* 教程 */}
            <button onClick={() => { setIsOpen(false); onStartTutorial(); }} className="w-12 h-12 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50 flex items-center justify-center">
              <AlertCircle size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// --- 子组件拆分 ---

const PlayerButton = ({ config, name, score, onClick }: any) => {
  const isRed = config.color === 'red';
  return (
    <button onClick={onClick} className={`w-full h-full rounded-xl flex flex-col items-center justify-center shadow-md active:scale-95 transition-transform ${isRed ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
      <div className="text-sm opacity-90 mb-1">{name}</div>
      <div className="text-3xl font-bold font-mono">{score > 0 ? `+${Number(score.toFixed(1))}` : Number(score.toFixed(1))}</div>
    </button>
  );
};

const Modal = ({ onClose, title, children, zIndex = 'z-50', headerAction }: any) => (
  <div className={`fixed inset-0 bg-black/50 ${zIndex} flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200`} onClick={onClose}>
    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 flex-none">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="flex items-center gap-2">
          {headerAction}
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X size={20} /></button>
        </div>
      </div>
      <div className="p-4 overflow-y-auto flex-1">{children}</div>
    </div>
  </div>
);

const ScoreInputContent = ({ mode, currentPlayerId, onConfirm, partner, setPartner, t }: any) => {
  const [score, setScore] = useState<string>('');
  const [remark, setRemark] = useState('');

  // 自动设置队友
  useEffect(() => {
    if (mode === 'duo') {
      const partnerMap: Record<string, PlayerId> = { N: 'S', S: 'N', W: 'E', E: 'W' };
      setPartner(partnerMap[currentPlayerId]);
    }
  }, [mode, currentPlayerId, setPartner]);

  const candidates = mode === 'solo'
    ? SOLO_CANDIDATES
    : [
      { val: 10, label: '10', defaultRemark: '10' },
      { val: 15, label: '15', defaultRemark: '15' },
      { val: 20, label: '20', defaultRemark: '20' },
      { val: 25, label: '25', defaultRemark: '25' }
    ];

  const isValid = score && (mode === 'solo' || partner);

  const handleCandidateClick = (c: any) => {
    setScore(c.val.toString());
    if (c.defaultRemark) {
      setRemark(c.defaultRemark);
    }
  };

  return (
    <div className="space-y-4">
      {/* 移除队友选择，因为现在是自动匹配 */}

      <div>
        <label className="block text-sm text-gray-500 mb-2">{t('scoreValue')}</label>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {candidates.map((c: any) => (
            <button key={c.val} onClick={() => handleCandidateClick(c)} className="py-2 bg-gray-100 rounded text-xs font-medium text-gray-700 active:bg-gray-200 truncate">
              {c.label || c.val}
            </button>
          ))}
        </div>
        <input type="number" value={score} onChange={e => setScore(e.target.value)} placeholder={t('enterScore')} className="w-full p-3 text-2xl font-mono text-center border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" autoFocus />
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-2">{t('remarkLabel')}</label>
        <input type="text" value={remark} onChange={e => setRemark(e.target.value)} placeholder={t('defaultRemark')} className="w-full p-3 text-xl text-center border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      <button onClick={() => onConfirm(parseInt(score), remark)} disabled={!isValid} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 active:bg-blue-700">
        {t('confirmScore')}
      </button>
    </div>
  );
};

const EditNameContent = ({ initialName, onConfirm, t }: any) => {
  const [name, setName] = useState(initialName);
  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-lg mb-4 text-center text-lg" />
      <button onClick={() => onConfirm(name)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">{t('save')}</button>
    </>
  );
};

const HistoryContent = ({ history, playerNames, onDelete, t }: any) => {
  const reversedHistory = [...history].reverse();
  if (reversedHistory.length === 0) return <div className="text-center text-gray-400 py-8">{t('noHistory')}</div>;

  return (
    <div className="space-y-3">
      {reversedHistory.map((record: ScoreRecord) => (
        <div key={record.id} className={`flex items-center justify-between p-3 rounded-lg border ${record.type === 'solo' ? 'bg-yellow-50 border-yellow-200' : 'bg-purple-50 border-purple-200'}`}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-bold px-2 py-0.5 rounded text-xs ${record.type === 'solo' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'}`}>
                {record.type === 'solo' ? '独' : '对'}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="text-sm flex flex-wrap items-center gap-1">
              {record.winnerIds.map((id: PlayerId) => {
                const isRed = INITIAL_PLAYERS[id].color === 'red';
                return (
                  <span key={id} className={`px-1.5 py-0.5 rounded text-xs font-bold ${isRed ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {playerNames[id]}
                  </span>
                );
              })}
              <span className="mx-1 text-gray-400">{t('won')}</span>
              <span className="font-mono font-bold text-blue-600">+{record.score}</span>
              {record.remark && <span className="ml-2 text-xs bg-white/50 px-1 rounded text-gray-600 border border-gray-200">{t('note')}: {record.remark}</span>}
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onDelete(record.id); }} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full active:bg-red-100">
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

// --- 教程引导组件 ---
const TutorialOverlay = ({ step, t, onNext, onClose, fabPos, onToggleLang }: any) => {
  // 定义每一步的目标区域和说明
  const tutorialSteps = [
    {
      target: 'fab', // 悬浮按钮
      title: t('tutorialStep1Title'),
      desc: t('tutorialStep1Desc'),
      cardPosition: 'bottom', // 卡片位置
    },
    {
      target: 'lock', // 锁定按钮
      title: t('tutorialLockTitle'),
      desc: t('tutorialLockDesc'),
      cardPosition: 'bottom',
    },
    {
      target: 'lang', // 语言切换
      title: t('tutorialLangTitle'),
      desc: t('tutorialLangDesc'),
      cardPosition: 'bottom',
    },
    {
      target: 'reset', // 重置级别
      title: t('tutorialResetTitle'),
      desc: t('tutorialResetDesc'),
      cardPosition: 'bottom',
    },
    {
      target: 'levels', // 顶部级别区域
      title: t('tutorialStep2Title'),
      desc: t('tutorialStep2Desc'),
      cardPosition: 'bottom',
    },
    {
      target: 'round', // 中间局数
      title: t('tutorialStep3Title'),
      desc: t('tutorialStep3Desc'),
      cardPosition: 'bottom',
    },
    {
      target: 'players', // 玩家按钮
      title: t('tutorialStep4Title'),
      desc: t('tutorialStep4Desc'),
      cardPosition: 'top', // 这一步卡片放在顶部
    },
    {
      target: 'history', // 中间历史区域
      title: t('tutorialStep5Title'),
      desc: t('tutorialStep5Desc'),
      cardPosition: 'top', // 这一步卡片也放在顶部
    },
  ];

  const currentStep = tutorialSteps[step];
  const isLastStep = step >= tutorialSteps.length - 1;

  // 根据目标计算高亮区域
  const getHighlightStyle = () => {
    if (!currentStep) return {};

    switch (currentStep.target) {
      case 'fab':
        if (!fabPos) return {};
        return {
          left: fabPos.x - 10,
          top: fabPos.y - 10,
          width: 72,
          height: 120, // Cover both buttons
          borderRadius: '36px'
        };
      case 'lock':
        if (!fabPos) return {};
        return {
          left: fabPos.x,
          top: fabPos.y,
          width: 48,
          height: 48,
          borderRadius: '50%'
        };
      case 'lang':
        if (!fabPos) return {};
        const isUp = fabPos.y > window.innerHeight / 2;
        return {
          left: fabPos.x,
          top: isUp ? fabPos.y - 168 : fabPos.y + 112,
          width: 48,
          height: 48,
          borderRadius: '50%'
        };
      case 'reset':
        if (!fabPos) return {};
        const isUpReset = fabPos.y > window.innerHeight / 2;
        return {
          left: fabPos.x,
          top: isUpReset ? fabPos.y - 112 : fabPos.y + 168,
          width: 48,
          height: 48,
          borderRadius: '50%'
        };
      case 'levels':
        return {
          left: '0.75rem',
          top: '1rem',
          right: '0.75rem',
          height: '40%',
        };
      case 'round':
        return {
          left: '33.33%',
          top: '1rem',
          width: '33.33%',
          height: '40%',
        };
      case 'players':
        return {
          left: '33.33%',
          top: 'calc(40% + 1rem)',
          width: '33.33%',
          bottom: '2rem',
        };
      case 'history':
        return {
          left: 'calc(33.33% + 0.5rem)',
          top: 'calc(60% + 0.5rem)',
          width: 'calc(33.33% - 1rem)',
          height: 'calc(20% - 1rem)',
        };
      default:
        return {};
    }
  };

  const highlightStyle = getHighlightStyle();

  // 根据步骤决定卡片位置
  const getCardPositionClass = () => {
    if (currentStep?.cardPosition === 'top') {
      return 'top-20';
    }
    return 'bottom-20';
  };

  return (
    <div className="fixed inset-0 z-[110] pointer-events-none">
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/70 pointer-events-auto" onClick={onClose} />

      {/* 高亮区域 (镂空效果) */}
      {currentStep && (
        <div
          className="absolute rounded-xl border-4 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] pointer-events-none animate-pulse"
          style={highlightStyle}
        />
      )}

      {/* 说明卡片 */}
      <div className={`absolute ${getCardPositionClass()} left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto animate-in slide-in-from-bottom duration-300`}>
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle size={32} className="text-blue-500 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{currentStep?.title}</h3>
              <button onClick={onToggleLang} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                <Languages size={20} />
              </button>
            </div>
            <p className="text-gray-600 leading-relaxed">{currentStep?.desc}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold active:bg-gray-200"
          >
            {t('tutorialSkip')}
          </button>
          <button
            onClick={isLastStep ? onClose : onNext}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold active:bg-blue-700"
          >
            {isLastStep ? t('confirm') : t('tutorialNext')}
          </button>
        </div>

        {/* 进度指示器 */}
        <div className="flex justify-center gap-2 mt-4">
          {tutorialSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${idx === step ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};