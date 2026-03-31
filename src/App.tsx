import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronUp, ChevronDown, History, List,
  User, Users, Edit3, Trash2, X, AlertCircle, Languages, RotateCw, Menu, Lock, Unlock, LayoutGrid, Plus, Minus
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
  type: 'solo' | 'duo' | 'manual';
  score: number; // 对 manual 模式，此字段可设为 0，因为分数获在 manualScores 里
  winnerIds: PlayerId[];
  loserIds: PlayerId[];
  remark: string;
  manualScores?: Record<PlayerId, number>;
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

// 安全震动辅助
const safeVibrate = (pattern: number | number[]) => {
  try {
    // 1. 基础环境检查
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;

    // 2. iOS 物理层面不支持检查 (通过 userAgent 简单排除以减少无效调用)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) return;

    // 3. 检查用户是否已激活页面 (避免 Intervention 报错)
    // 注意：navigator.userActivation 是较新的 API，需做兼容
    const isActivated = (navigator as any).userActivation ? (navigator as any).userActivation.isActive : true;

    if (isActivated) {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    // 忽略所有干预性错误
  }
};

// --- 辅助界面组件 ---

const TopModeIcon = () => (
  <div className="flex gap-1 h-5 items-center justify-center">
    <div className="w-1.5 h-full bg-red-500 rounded-full shadow-sm" />
    <div className="w-1.5 h-full bg-yellow-400 rounded-full shadow-sm" />
    <div className="w-1.5 h-full bg-blue-500 rounded-full shadow-sm" />
  </div>
);

const BottomModeIcon = () => (
  <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-5 h-5 items-center justify-center">
    <div className="col-start-2 row-start-1 bg-red-500 rounded-[1px]" />
    <div className="col-start-1 row-start-2 bg-blue-500 rounded-[1px]" />
    <div className="col-start-2 row-start-2 bg-gray-300 rounded-[1px]" />
    <div className="col-start-3 row-start-2 bg-blue-500 rounded-[1px]" />
    <div className="col-start-2 row-start-3 bg-red-500 rounded-[1px]" />
  </div>
);

const SwipeControl = ({ children, onSwipeUp, onSwipeDown, className, colorClass, valueKey }: any) => {
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
      className={`${className} ${colorClass} animate-bounce-pop relative flex flex-col items-center justify-center select-none active:brightness-90 transition-all shadow-md rounded-xl overflow-hidden touch-none`}
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
  const [historyView, setHistoryView] = useState<'list' | 'table'>('list');
  const [scoringMode, setScoringMode] = useState<'auto' | 'manual'>('auto');
  const [uiMode, setUiMode] = useState<'full' | 'top' | 'bottom'>('full');

  // 悬浮按钮位置状态 (初始化为 null，组件挂载后计算屏幕边缘)
  const [fabPos, setFabPos] = useState<{ x: number, y: number } | null>(null);

  const [activeModal, setActiveModal] = useState<'none' | 'action' | 'score' | 'history' | 'editName' | 'lang'>('none');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerId | null>(null);
  const [scoreMode, setScoreMode] = useState<'solo' | 'duo'>('solo');
  const [duoPartner, setDuoPartner] = useState<PlayerId | null>(null);

  // 确认框状态
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: any;
    onConfirm: () => void;
  }>({ isOpen: false, message: '', onConfirm: () => { } });

  // 教程状态
  const [tutorialStep, setTutorialStep] = useState<number>(-1); // -1 表示未开始
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showTopControls, setShowTopControls] = useState(true);
  const lastActivity = useRef(Date.now());

  const [lockProgress, setLockProgress] = useState(0);
  const AUTO_LOCK_TIME = 10000; // 10秒

  const resetActivity = () => {
    lastActivity.current = Date.now();
    if (!isLocked) setLockProgress(0);
  };

  // 自动锁定逻辑
  useEffect(() => {
    // 禁用右键
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    window.addEventListener('contextmenu', handleContextMenu);

    const checkIdle = () => {
      if (!isLocked) {
        const elapsed = Date.now() - lastActivity.current;
        const progress = Math.min(100, (elapsed / AUTO_LOCK_TIME) * 100);
        setLockProgress(progress);
        
        if (elapsed > AUTO_LOCK_TIME) {
          setIsLocked(true);
          setIsDrawerOpen(false); // 自动锁定时关闭菜单
          setLockProgress(0);
        }
      } else {
        setLockProgress(0);
      }
    };
    const timer = setInterval(checkIdle, 50);

    window.addEventListener('click', resetActivity);
    window.addEventListener('touchstart', resetActivity);
    window.addEventListener('mousemove', resetActivity);
    window.addEventListener('keydown', resetActivity);

    return () => {
      clearInterval(timer);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', resetActivity);
      window.removeEventListener('touchstart', resetActivity);
      window.removeEventListener('mousemove', resetActivity);
      window.removeEventListener('keydown', resetActivity);
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
        if (data.historyView) setHistoryView(data.historyView);
        if (data.lang) setLang(data.lang);
        if (data.uiMode) setUiMode(data.uiMode);
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
    // 步骤 2(layout), 3(lang), 4(reset) 需要打开菜单
    if (tutorialStep >= 2 && tutorialStep <= 4) {
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
      historyView,
      uiMode,
      lang,
      fabPos
    };
    localStorage.setItem('scoreboard_v5', JSON.stringify(data));
  }, [leftCardIdx, rightCardIdx, middleNum, playerNames, history, historyView, lang, fabPos, isLoaded]);

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
      if (record.type === 'manual' && record.manualScores) {
        Object.entries(record.manualScores).forEach(([pid, val]) => {
          scores[pid as PlayerId] += val;
        });
      } else {
        const { score, winnerIds, loserIds } = record;
        if (record.type === 'solo') {
          winnerIds.forEach(id => scores[id] += score);
          const deduct = score / 3;
          loserIds.forEach(id => scores[id] -= deduct);
        } else {
          winnerIds.forEach(id => scores[id] += score);
          loserIds.forEach(id => scores[id] -= score);
        }
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

  const handleManualScore = (deltas: Record<PlayerId, number>, remarkInput: string) => {
    const newRecord: ScoreRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type: 'manual',
      score: 0,
      winnerIds: (Object.keys(deltas) as PlayerId[]).filter(id => deltas[id] > 0),
      loserIds: (Object.keys(deltas) as PlayerId[]).filter(id => deltas[id] < 0),
      remark: remarkInput || '自',
      manualScores: deltas
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
    setScoringMode('auto');
  };

  const toggleLang = () => {
    setActiveModal('lang');
  };

  const startTutorial = () => setTutorialStep(0);

  const closeTutorial = () => {
    setTutorialStep(-1);
    localStorage.setItem('scoreboard_tutorial_seen', 'true');
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden font-sans text-gray-900 select-none relative">
      
      {/* 可视内容容器 (始终保持 100% 清晰) */}
      <div className={`flex-1 flex flex-col transition-all duration-700 ease-in-out h-full`}>
        {/* 顶部区域 */}
        {showTopControls && (uiMode === 'full' || uiMode === 'top') && (
          <div className={`flex-none p-3 grid grid-cols-3 gap-3 pt-4 transition-all duration-500 ${uiMode === 'top' ? 'h-full flex-1' : 'h-[40%]'}`}>
            <SwipeControl
              className="h-full" colorClass="bg-red-500 text-white"
              onSwipeUp={() => handleCardChange('left', 1)}
              onSwipeDown={() => handleCardChange('left', -1)}
              valueKey={`left-${leftCardIdx}`}
            >
              <div className="text-sm opacity-80 mb-2">{t('redLevel')}</div>
              <div className={`font-bold transition-all ${uiMode === 'top' ? 'text-9xl' : 'text-6xl'}`}>{CARD_SEQUENCE[leftCardIdx]}</div>
              <div className="absolute top-2 opacity-50">{!isLocked && <ChevronUp size={uiMode === 'top' ? 32 : 20} />}</div>
              <div className="absolute bottom-2 opacity-50">{!isLocked && <ChevronDown size={uiMode === 'top' ? 32 : 20} />}</div>
            </SwipeControl>

            <SwipeControl
              className="h-full" colorClass="bg-yellow-400 text-yellow-900"
              onSwipeUp={() => setMiddleNum(p => Math.max(1, p + 1))}
              onSwipeDown={() => setMiddleNum(p => Math.max(1, p - 1))}
              valueKey={`middle-${middleNum}`}
            >
              <div className="text-sm opacity-80 mb-2">{t('round')}</div>
              <div className={`font-mono font-bold transition-all ${uiMode === 'top' ? 'text-9xl' : 'text-7xl'}`}>{middleNum}</div>
              <div className="absolute top-2 opacity-50">{!isLocked && <ChevronUp size={uiMode === 'top' ? 32 : 20} />}</div>
              <div className="absolute bottom-2 opacity-50">{!isLocked && <ChevronDown size={uiMode === 'top' ? 32 : 20} />}</div>
            </SwipeControl>

            <SwipeControl
              className="h-full" colorClass="bg-blue-500 text-white"
              onSwipeUp={() => handleCardChange('right', 1)}
              onSwipeDown={() => handleCardChange('right', -1)}
              valueKey={`right-${rightCardIdx}`}
            >
              <div className="text-sm opacity-80 mb-2">{t('blueLevel')}</div>
              <div className={`font-bold transition-all ${uiMode === 'top' ? 'text-9xl' : 'text-6xl'}`}>{CARD_SEQUENCE[rightCardIdx]}</div>
              <div className="absolute top-2 opacity-50">{!isLocked && <ChevronUp size={uiMode === 'top' ? 32 : 20} />}</div>
              <div className="absolute bottom-2 opacity-50">{!isLocked && <ChevronDown size={uiMode === 'top' ? 32 : 20} />}</div>
            </SwipeControl>
          </div>
        )}

        {/* 底部十字计分盘 */}
        {(uiMode === 'full' || uiMode === 'bottom') && (
          <div className={`p-3 pb-8 relative transition-all duration-500 ${uiMode === 'bottom' ? 'h-full flex-1' : 'flex-1'}`}>
            <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-2">

              <div className="col-start-2 row-start-1">
                <PlayerButton config={INITIAL_PLAYERS.N} name={playerNames.N} score={totalScores.N} onClick={() => { if (scoringMode === 'manual') { setActiveModal('score'); } else { setSelectedPlayer('N'); setActiveModal('action'); } }} />
              </div>

              <div className="col-start-1 row-start-2">
                <PlayerButton config={INITIAL_PLAYERS.W} name={playerNames.W} score={totalScores.W} onClick={() => { if (scoringMode === 'manual') { setActiveModal('score'); } else { setSelectedPlayer('W'); setActiveModal('action'); } }} />
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
                    <History size={uiMode === 'bottom' ? 48 : 24} />
                  </div>
                )}
              </div>

              <div className="col-start-3 row-start-2">
                <PlayerButton config={INITIAL_PLAYERS.E} name={playerNames.E} score={totalScores.E} onClick={() => { if (scoringMode === 'manual') { setActiveModal('score'); } else { setSelectedPlayer('E'); setActiveModal('action'); } }} />
              </div>

              <div className="col-start-2 row-start-3">
                <PlayerButton config={INITIAL_PLAYERS.S} name={playerNames.S} score={totalScores.S} onClick={() => { if (scoringMode === 'manual') { setActiveModal('score'); } else { setSelectedPlayer('S'); setActiveModal('action'); } }} />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* --- 能量喷发/聚拢霓虹动效层 (Energy Burst/Gather Iris) --- */}
      <div className={`fixed inset-0 z-[65] pointer-events-none overflow-hidden`}>
        <svg className="w-full h-full overflow-visible">
          {[
            { color: '#FF0000', delay: '0ms',   dash: 'none',   width: 12, offset: 0 },
            { color: '#FF4500', delay: '30ms',  dash: '60, 30', width: 8,  offset: 5 },
            { color: '#FFD700', delay: '60ms',  dash: 'none',   width: 10, offset: 10 },
            { color: '#32CD32', delay: '90ms',  dash: '30, 15', width: 18, offset: 15 },
            { color: '#00FA9A', delay: '120ms', dash: 'none',   width: 8,  offset: 20 },
            { color: '#00CED1', delay: '150ms', dash: '15, 8',  width: 25, offset: 25 },
            { color: '#1E90FF', delay: '180ms', dash: 'none',   width: 12, offset: 30 },
            { color: '#0000FF', delay: '210ms', dash: '40, 20', width: 30, offset: 35 },
            { color: '#8A2BE2', delay: '240ms', dash: 'none',   width: 15, offset: 40 },
            { color: '#FF00FF', delay: '270ms', dash: '20, 15', width: 40, offset: 45 },
          ].map((ring, i) => (
            <circle 
              key={i}
              cx={fabPos ? fabPos.x + 24 : '100%'} 
              cy={fabPos ? fabPos.y + 24 : '50%'} 
              r={isLocked ? "0" : `${150 + ring.offset}vmax`} 
              fill="none"
              stroke={ring.color}
              strokeWidth={ring.width}
              strokeDasharray={ring.dash}
              style={{ 
                transition: `
                  r 1000ms cubic-bezier(0.15, 1, 0.3, 1) ${ring.delay},
                  opacity 1000ms ease ${ring.delay},
                  transform 1200ms cubic-bezier(0.15, 1, 0.3, 1) ${ring.delay}
                `,
                transformOrigin: `${fabPos ? fabPos.x + 24 : 0}px ${fabPos ? fabPos.y + 24 : 0}px`,
                transform: isLocked ? 'rotate(180deg)' : 'rotate(0deg)',
                opacity: isLocked ? 0.4 : 0, // 降低最大透明度，从 0.9 降至 0.4
                filter: `blur(4px) drop-shadow(0 0 ${isLocked ? 10 : 0}px currentColor)` // 添加模糊并弱化阴影
              }}
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>

      {/* 交互拦截层 (完全透明) */}
      {isLocked && (
        <div 
          className="fixed inset-0 z-[64] bg-transparent touch-none" 
          onClick={(e) => e.stopPropagation()} 
        />
      )}

      {/* --- 悬浮抽屉 (Floating Action Button / Drawer) --- */}
      {fabPos && (
        <DraggableDrawer
          initialPos={fabPos}
          onPosChange={setFabPos}
          t={t}
          onToggleLang={toggleLang}
          onResetLevels={handleResetLevels}
          onStartTutorial={startTutorial}
          showTopControls={showTopControls}
          onToggleTopControls={() => setShowTopControls(prev => !prev)}
          uiMode={uiMode}
          onToggleUiMode={(target: 'top' | 'bottom') => {
            setUiMode(prev => (prev === target ? 'full' : target));
          }}
          lang={lang}
          isLocked={isLocked}
          setIsLocked={setIsLocked}
          lockProgress={lockProgress}
          isOpen={isDrawerOpen}
          setIsOpen={setIsDrawerOpen}
          resetActivity={resetActivity}
        />
      )}

      {/* --- 全局确认弹窗 (Z-Index 100) --- */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150" onClick={() => setConfirmModal(p => ({ ...p, isOpen: false }))}>
          <div className="bg-white w-full max-w-xs rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center" onClick={e => e.stopPropagation()}>
            <AlertCircle size={48} className="text-yellow-500 mb-4" />
            <div className="text-lg text-gray-800 mb-6 font-medium w-full">{confirmModal.message}</div>
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
            <button className="p-4 bg-yellow-100 text-yellow-800 rounded-lg flex items-center justify-center gap-2 active:bg-yellow-200" onClick={() => { setScoringMode('auto'); setScoreMode('solo'); setActiveModal('score'); }}>
              <User size={20} /> {t('soloScore')}
            </button>
            <button className="p-4 bg-purple-100 text-purple-800 rounded-lg flex items-center justify-center gap-2 active:bg-purple-200" onClick={() => { setScoringMode('auto'); setScoreMode('duo'); setActiveModal('score'); }}>
              <Users size={20} /> {t('duoScore')}
            </button>
            <button className="p-4 bg-orange-100 text-orange-800 rounded-lg flex items-center justify-center gap-2 active:bg-orange-200" onClick={() => { setScoringMode('manual'); setActiveModal('score'); }}>
              <LayoutGrid size={20} /> {t('manualMode')}
            </button>
          </div>
        </Modal>
      )}

      {activeModal === 'score' && (
        <Modal onClose={closeModal} title={scoringMode === 'manual' ? t('manualScoreTitle') : (scoreMode === 'solo' ? t('soloTitle') : t('duoTitle'))} zIndex="z-50">
          {scoringMode === 'manual' ? (
            <ManualScoreContent
              players={playerNames}
              onConfirm={handleManualScore}
              t={t}
              confirmModal={setConfirmModal}
            />
          ) : (
            <ScoreInputContent
              mode={scoreMode}
              currentPlayerId={selectedPlayer}
              players={playerNames}
              onConfirm={handleAddScore}
              partner={duoPartner}
              setPartner={setDuoPartner}
              t={t}
            />
          )}
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
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 p-0.5 rounded-lg mr-2">
                <button
                  onClick={() => setHistoryView('list')}
                  className={`p-1.5 rounded-md transition-all ${historyView === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                  title={t('viewList')}
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setHistoryView('table')}
                  className={`p-1.5 rounded-md transition-all ${historyView === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                  title={t('viewTable')}
                >
                  <LayoutGrid size={18} />
                </button>
              </div>
              <button onClick={handleClearHistory} className="p-2 text-red-500 hover:bg-red-50 rounded-full flex gap-1 items-center text-sm font-bold">
                <RotateCw size={16} />
                {t('clearHistory')}
              </button>
            </div>
          }
        >
          <HistoryContent history={history} playerNames={playerNames} onDelete={handleDeleteHistory} t={t} viewMode={historyView} />
        </Modal>
      )}

      {/* --- 教程引导 (Z-Index 110) --- */}
      {tutorialStep >= 0 && (
        <TutorialOverlay
          step={tutorialStep}
          t={t}
          onNext={() => setTutorialStep(prev => prev + 1)}
          onPrev={() => setTutorialStep(prev => Math.max(0, prev - 1))}
          onClose={closeTutorial}
          fabPos={fabPos}
          onToggleLang={toggleLang}
        />
      )}

    </div>
  );
}

// --- 可拖动抽屉组件 ---
const DraggableDrawer = ({ initialPos, onPosChange, onToggleLang, onResetLevels, onStartTutorial, isLocked, setIsLocked, lockProgress, isOpen, setIsOpen, showTopControls, onToggleTopControls, uiMode, onToggleUiMode, resetActivity }: any) => {
  // const [isOpen, setIsOpen] = useState(false); // Moved to parent
  const [pos, setPos] = useState(initialPos);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [unlockProgress, setUnlockProgress] = useState(0);

  // Sync pos with initialPos when it changes (e.g. loaded from storage)
  useEffect(() => {
    setPos(initialPos);
  }, [initialPos.x, initialPos.y]);

  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const dragStartTime = useRef(0);
  const progressTimer = useRef<any>(null);
  const lastUnlockTime = useRef(0);
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

    // 吸附逻辑 (移除对 justUnlocked.current 的拦截，确保始终吸附)
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

  const handleLockPressStart = (e?: React.MouseEvent | React.TouchEvent) => {
    // 阻止意外的重复触发
    if (justUnlocked.current || lockPressActive.current) {
      return;
    }
    
    if (e && 'touches' in e) {
      e.stopPropagation();
    }

    // 重置闲置计时，防止即时锁回
    if (resetActivity) resetActivity();

    // 情况 A: 当前未锁定 -> 点击立即锁定
    if (!isLocked) {
      setIsLocked(true);
      setIsOpen(false); // 手动锁定时关闭菜单
      safeVibrate(10);
      return;
    }

    // 情况 B: 当前已锁定 -> 开启长按解锁定时器
    const startTime = Date.now();
    setUnlockProgress(0);
    lockPressActive.current = true;
    
    // 震动反馈表示“开始充电”
    safeVibrate(15);
    
    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / 800) * 100); // 800ms 解锁
      setUnlockProgress(progress);
      
      if (progress >= 100) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
        lockPressActive.current = false;
        
        setIsLocked(false);
        // 解锁成功再次重置计时
        if (resetActivity) resetActivity();

        lastUnlockTime.current = Date.now();
        justUnlocked.current = true;
        setTimeout(() => { justUnlocked.current = false; }, 1000);
        
        setUnlockProgress(0);
        safeVibrate([30, 50, 30]); // 强力震动反馈
      }
    }, 16);
  };

  const handleLockPressEnd = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e && 'touches' in e) {
      e.stopPropagation();
    }
    
    // 即使没解锁成功，也算是一次活动，重置闲置计时
    if (resetActivity) resetActivity();

    // 无论如何都重置进度状态，防止 UI 卡死
    setUnlockProgress(0);

    if (!lockPressActive.current) return;
    lockPressActive.current = false;

    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  };

  // SVG 进度条计算
  const isUnlocking = isLocked && unlockProgress > 0;
  const radius = isUnlocking ? 32 : 20; // 长按时外扩半径
  const circumference = 2 * Math.PI * radius;
  const activeProgress = isLocked ? unlockProgress : lockProgress;
  const strokeDashoffset = circumference - (activeProgress / 100) * circumference;

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
          transform: isUnlocking ? 'scale(1.3)' : 'none', // 长按时整体放大
          cursor: isLocked ? 'default' : 'grab',
          touchAction: 'none',
          transitionProperty: 'transform, left, top, opacity',
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
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-all relative border-2 border-white ${isLocked ? (unlockProgress > 0 ? 'bg-red-600 scale-110' : 'bg-red-500 animate-[pulse_2s_infinite] ring-4 ring-transparent') : 'bg-gray-400'}`}
            style={{
              ...(isLocked && unlockProgress === 0 ? {
                boxShadow: '0 0 10px rgba(255,0,0,0.5)',
                animation: 'rgb-border 2s linear infinite'
              } : {}),
              backgroundColor: !isLocked && lockProgress > 0 
                ? `rgb(${156 + (220 - 156) * (lockProgress / 100)}, ${163 - 163 * (lockProgress / 100)}, ${175 - 175 * (lockProgress / 100)})` 
                : undefined,
              zIndex: isUnlocking ? 100 : 1,
            }}
            onMouseDown={handleLockPressStart}
            onMouseUp={handleLockPressEnd}
            onMouseLeave={handleLockPressEnd}
            onTouchStart={handleLockPressStart}
            onTouchEnd={handleLockPressEnd}
          >
            {activeProgress > 0 && (
              <svg 
                className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none overflow-visible"
                style={{ width: '100%', height: '100%' }}
              >
                {/* 进度底槽 (Track) - 增强可见性 */}
                {isUnlocking && (
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    fill="transparent"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="6"
                  />
                )}
                {/* 进度条 (Progress) */}
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  fill="transparent"
                  stroke={isUnlocking ? "#dc2626" : (isLocked ? "white" : "#ef4444")}
                  strokeWidth={isUnlocking ? "6" : "4"}
                  strokeDasharray={circumference}
                  style={{ 
                    strokeDashoffset, 
                    transition: isLocked ? 'none' : 'stroke-dashoffset 16ms linear',
                    filter: isUnlocking 
                      ? 'drop-shadow(0 0 4px rgba(0,0,0,0.2)) drop-shadow(0 0 8px rgba(220,38,38,0.4))' 
                      : 'none'
                  }}
                  strokeLinecap="round"
                />
              </svg>
            )}
            {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
          </button>

          {/* 菜单按钮 */}
          <button
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-colors border-2 border-white ${isOpen ? 'bg-gray-700' : 'bg-blue-600'} ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}
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
            {/* 切换仅顶部模式 (RGB 条图标) */}
            <button 
              onClick={() => { setIsOpen(false); onToggleUiMode('top'); }} 
              className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center transition-colors ${uiMode === 'top' ? 'bg-green-400 text-white' : 'bg-white text-blue-600'}`}
            >
              <TopModeIcon />
            </button>

            {/* 切换仅底部模式 (十字图标) */}
            <button 
              onClick={() => { setIsOpen(false); onToggleUiMode('bottom'); }} 
              className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center transition-colors ${uiMode === 'bottom' ? 'bg-green-400 text-white' : 'bg-white text-blue-600'}`}
            >
              <BottomModeIcon />
            </button>

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

const ManualScoreContent = ({ players, onConfirm, t, confirmModal }: any) => {
  const [scores, setScores] = useState<Record<PlayerId, string>>({ N: '', S: '', E: '', W: '' });
  const [remark, setRemark] = useState('');

  const sum = Object.values(scores).reduce((acc, val) => acc + (parseInt(val) || 0), 0);
  const isValid = sum === 0 && Object.values(scores).some(v => v !== '' && parseInt(v) !== 0);

  const handleSubmit = () => {
    if (!isValid) return;

    const deltas: any = {};
    Object.entries(scores).forEach(([id, val]) => {
      deltas[id] = parseInt(val) || 0;
    });

    confirmModal({
      isOpen: true,
      message: (
        <div className="text-left w-full space-y-1">
          <p className="font-bold mb-2">{t('confirmManualMsg')}</p>
          {Object.entries(deltas).map(([id, val]: any) => (
            <div key={id} className="flex justify-between border-b border-gray-100 py-1">
              <span>{players[id]}</span>
              <span className={`font-mono font-bold ${val > 0 ? 'text-blue-600' : val < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                {val > 0 ? `+${val}` : val}
              </span>
            </div>
          ))}
        </div>
      ),
      onConfirm: () => {
        onConfirm(deltas, remark);
        confirmModal((prev: any) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleStep = (id: PlayerId, delta: number) => {
    setScores(prev => ({
      ...prev,
      [id]: ((parseInt(prev[id]) || 0) + delta).toString()
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {(['N', 'S', 'W', 'E'] as PlayerId[]).map(id => (
          <div key={id}>
            <label className="block text-xs text-gray-500 mb-1">{players[id]}</label>
            <div className="flex items-center gap-1">
              <button onClick={() => handleStep(id, -1)} className="p-2 bg-gray-100 rounded-lg active:bg-gray-200">
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={scores[id]}
                onChange={e => setScores(prev => ({ ...prev, [id]: e.target.value }))}
                placeholder="0"
                className="w-full p-2 text-xl font-mono text-center border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-w-0"
              />
              <button onClick={() => handleStep(id, 1)} className="p-2 bg-gray-100 rounded-lg active:bg-gray-200">
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-2 rounded text-center text-sm font-bold ${sum === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {t('sumMustBeZero', { sum: sum.toString() })}
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-2">{t('remarkLabel')}</label>
        <input
          type="text"
          value={remark}
          onChange={e => setRemark(e.target.value)}
          placeholder={t('defaultRemark')}
          className="w-full p-3 text-lg text-center border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 active:bg-blue-700"
      >
        {t('confirmScore')}
      </button>
    </div>
  );
};

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

  const handleStep = (delta: number) => {
    setScore(prev => ((parseInt(prev) || 0) + delta).toString());
  };

  return (
    <div className="space-y-4">
      {/* 移除队友选择，因为现在是自动匹配 */}

      <div>
        <label className="block text-sm text-gray-500 mb-2">{t('scoreValue')}</label>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {candidates.map((c: any) => (
            <button key={c.val} onClick={() => handleCandidateClick(c)} className="py-2 bg-gray-100 rounded text-xs font-medium text-gray-700 active:bg-gray-200 truncate">
              {c.label || c.val}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleStep(-1)} className="p-4 bg-gray-100 rounded-xl active:bg-gray-200 flex-none">
            <Minus size={24} />
          </button>
          <input type="number" value={score} onChange={e => setScore(e.target.value)} placeholder={t('enterScore')} className="flex-1 p-3 text-2xl font-mono text-center border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-w-0" autoFocus />
          <button onClick={() => handleStep(1)} className="p-4 bg-gray-100 rounded-xl active:bg-gray-200 flex-none">
            <Plus size={24} />
          </button>
        </div>
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

const HistoryContent = ({ history, playerNames, onDelete, t, viewMode = 'list' }: any) => {
  const reversedHistory = [...history].reverse();
  if (reversedHistory.length === 0) return <div className="text-center text-gray-400 py-8">{t('noHistory')}</div>;

  if (viewMode === 'table') {
    return (
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">
            <tr>
              {(['N', 'S', 'W', 'E'] as PlayerId[]).map(id => (
                <th key={id} className="px-2 py-3 font-bold text-center border-b">{playerNames[id]}</th>
              ))}
              <th className="px-2 py-3 font-bold border-b">{t('remark')}</th>
              <th className="px-2 py-3 font-bold text-center border-b">{t('delete')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reversedHistory.map((record: ScoreRecord) => {
              const scores: Record<PlayerId, number> = { N: 0, S: 0, W: 0, E: 0 };
              if (record.type === 'manual' && record.manualScores) {
                Object.entries(record.manualScores).forEach(([pid, val]) => {
                  scores[pid as PlayerId] = val;
                });
              } else {
                const { score, winnerIds, loserIds } = record;
                if (record.type === 'solo') {
                  winnerIds.forEach(id => scores[id] = score);
                  const deduct = score / 3;
                  loserIds.forEach(id => scores[id] = -deduct);
                } else {
                  winnerIds.forEach(id => scores[id] = score);
                  loserIds.forEach(id => scores[id] = -score);
                }
              }

              return (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  {(['N', 'S', 'W', 'E'] as PlayerId[]).map(id => {
                    const val = scores[id];
                    return (
                      <td key={id} className={`px-1 py-3 font-mono font-bold text-center ${val > 0 ? 'text-blue-600' : val < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                        {val > 0 ? `+${Number(val.toFixed(1))}` : Number(val.toFixed(1))}
                      </td>
                    );
                  })}
                  <td className="px-2 py-3 text-xs text-gray-600 max-w-[100px] truncate" title={record.remark}>
                    {record.remark}
                  </td>
                  <td className="px-2 py-3 text-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(record.id); }} 
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reversedHistory.map((record: ScoreRecord) => {
        const isManual = record.type === 'manual';
        const bgColor = record.type === 'solo' ? 'bg-yellow-50 border-yellow-200' : 
                        record.type === 'duo' ? 'bg-purple-50 border-purple-200' : 
                        'bg-orange-50 border-orange-200';
        const tagColor = record.type === 'solo' ? 'bg-yellow-100 text-yellow-800' : 
                         record.type === 'duo' ? 'bg-purple-100 text-purple-800' : 
                         'bg-orange-100 text-orange-800';
        const tagName = record.type === 'solo' ? '独' : 
                        record.type === 'duo' ? '对' : '自';

        return (
          <div key={record.id} className={`flex items-center justify-between p-3 rounded-lg border ${bgColor}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-bold px-2 py-0.5 rounded text-xs ${tagColor}`}>
                  {tagName}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {isManual && record.manualScores ? (
                <div className="text-sm flex flex-wrap items-center gap-x-2 gap-y-1">
                  {Object.entries(record.manualScores).map(([id, val]: any) => (
                    <span key={id} className="flex items-center gap-1">
                      <span className="text-gray-500">{playerNames[id]}</span>
                      <span className={`font-mono font-bold ${val > 0 ? 'text-blue-600' : val < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                        {val > 0 ? `+${val}` : val}
                      </span>
                    </span>
                  ))}
                  {record.remark && record.remark !== '自' && (
                    <span className="ml-1 text-xs bg-white/50 px-1 rounded text-gray-600 border border-gray-100">{t('note')}: {record.remark}</span>
                  )}
                </div>
              ) : (
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
              )}
            </div>
            <button onClick={(e) => { e.stopPropagation(); onDelete(record.id); }} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full active:bg-red-100">
              <Trash2 size={20} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

// --- 教程引导组件 ---
const TutorialOverlay = ({ step, t, onNext, onPrev, onClose, fabPos, onToggleLang }: any) => {
  // 定义每一步的目标区域和说明
  const tutorialSteps = [
    {
      target: 'fab', // 悬浮按钮
      title: t('tutorialStep1Title'),
      desc: t('tutorialStep1Desc'),
      cardPosition: 'bottom',
    },
    {
      target: 'lock', // 锁定按钮
      title: t('tutorialLockTitle'),
      desc: t('tutorialLockDesc'),
      cardPosition: 'bottom',
    },
    {
      target: 'layout', // 布局按钮 (新)
      title: t('tutorialLayoutTitle'),
      desc: t('tutorialLayoutDesc'),
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
      cardPosition: 'top',
    },
    {
      target: 'history', // 中间历史区域
      title: t('tutorialStep5Title'),
      desc: t('tutorialStep5Desc'),
      cardPosition: 'top',
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
          left: `${fabPos.x - 10}px`,
          top: `${fabPos.y - 10}px`,
          width: '72px',
          height: '120px', // Cover both main buttons
          borderRadius: '36px'
        };
      case 'lock':
        if (!fabPos) return {};
        return {
          left: `${fabPos.x}px`,
          top: `${fabPos.y}px`,
          width: '48px',
          height: '48px',
          borderRadius: '50%'
        };
      case 'layout':
        if (!fabPos) return {};
        const isUpLayout = fabPos.y > window.innerHeight / 2;
        return {
          left: `${fabPos.x}px`,
          top: isUpLayout ? `${fabPos.y - 56}px` : `${fabPos.y + 112}px`,
          width: '48px',
          height: '48px',
          borderRadius: '50%'
        };
      case 'lang':
        if (!fabPos) return {};
        const isUpLang = fabPos.y > window.innerHeight / 2;
        return {
          left: `${fabPos.x}px`,
          top: isUpLang ? `${fabPos.y - 112}px` : `${fabPos.y + 168}px`,
          width: '48px',
          height: '48px',
          borderRadius: '50%'
        };
      case 'reset':
        if (!fabPos) return {};
        const isUpReset = fabPos.y > window.innerHeight / 2;
        return {
          left: `${fabPos.x}px`,
          top: isUpReset ? `${fabPos.y - 168}px` : `${fabPos.y + 224}px`,
          width: '48px',
          height: '48px',
          borderRadius: '50%'
        };
      case 'levels':
        return {
          left: '0.75rem',
          top: '1rem',
          width: 'calc(100% - 1.5rem)',
          height: '40%',
          borderRadius: '0.75rem'
        };
      case 'round':
        return {
          left: '33.33%',
          top: '1rem',
          width: '33.33%',
          height: '40%',
          borderRadius: '0.75rem'
        };
      case 'players':
        return {
          left: '33.33%',
          top: 'calc(40% + 1rem)',
          width: '33.33%',
          height: 'calc(60% - 3rem)',
          borderRadius: '0.75rem'
        };
      case 'history':
        return {
          left: 'calc(33.33% + 0.5rem)',
          top: 'calc(60% + 0.5rem)',
          width: 'calc(33.33% - 1rem)',
          height: 'calc(20% - 1rem)',
          borderRadius: '0.75rem'
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
          className="absolute border-4 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] pointer-events-none transition-all duration-500 ease-in-out"
          style={highlightStyle}
        />
      )}

      {/* 说明卡片 */}
      <div className={`absolute ${getCardPositionClass()} left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto transition-all duration-500 ease-in-out animate-in fade-in zoom-in-95 duration-300`}>
        <div className="flex items-start gap-3 mb-4 transition-all duration-300" key={step}>
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

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold active:bg-gray-200 text-sm"
          >
            {t('tutorialSkip')}
          </button>
          {step > 0 && (
            <button
              onClick={onPrev}
              className="flex-1 py-3 bg-blue-100 text-blue-700 rounded-xl font-bold active:bg-blue-200 text-sm"
            >
              {t('tutorialPrev')}
            </button>
          )}
          <button
            onClick={isLastStep ? onClose : onNext}
            className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold active:bg-blue-700 text-sm"
          >
            {isLastStep ? t('confirm') : t('tutorialNext')}
          </button>
        </div>

        {/* 进度指示器与版本号 */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <div className="flex justify-center gap-2">
            {tutorialSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${idx === step ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
                  }`}
              />
            ))}
          </div>
          <div className="text-[10px] text-gray-400 font-mono">v1.0.5</div>
        </div>
      </div>
    </div>
  );
};
