import { useState, useEffect, useMemo, useCallback } from 'react';
import type { PlayerId, ScoreRecord } from '../types/scoring';
import { storageAdapter } from '../utils/storage';

export function useScoring() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [history, setHistory] = useState<ScoreRecord[]>([]);
  const [leftCardIdx, setLeftCardIdx] = useState(0);
  const [rightCardIdx, setRightCardIdx] = useState(0);
  const [middleNum, setMiddleNum] = useState(1);

  // --- Persistence ---

  useEffect(() => {
    const data = storageAdapter.get();
    if (data.history) setHistory(data.history);
    if (data.leftCardIdx !== undefined) setLeftCardIdx(data.leftCardIdx);
    if (data.rightCardIdx !== undefined) setRightCardIdx(data.rightCardIdx);
    if (data.middleNum !== undefined) setMiddleNum(data.middleNum);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    storageAdapter.update({
      history,
      leftCardIdx,
      rightCardIdx,
      middleNum,
    });
  }, [history, leftCardIdx, rightCardIdx, middleNum, isLoaded]);

  // --- Calculations ---

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

  const aggregatedRemarks = useMemo(() => {
    const remarks: Record<PlayerId, string> = { N: '', S: '', W: '', E: '' };
    (['N', 'S', 'W', 'E'] as PlayerId[]).forEach(pid => {
      const playerRecords = history.filter(h => h.winnerIds.includes(pid) && h.remark);
      remarks[pid] = playerRecords.map(r => r.remark).join('、');
    });
    return remarks;
  }, [history]);

  // --- Actions ---

  const addScore = useCallback((mode: 'solo' | 'duo', winnerIds: PlayerId[], score: number, remark: string) => {
    const allIds: PlayerId[] = ['N', 'S', 'W', 'E'];
    const loserIds = allIds.filter(id => !winnerIds.includes(id));

    const newRecord: ScoreRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type: mode,
      score,
      winnerIds,
      loserIds,
      remark,
    };

    setHistory(prev => [...prev, newRecord]);
  }, []);

  const addManualScore = useCallback((deltas: Record<PlayerId, number>, remark: string) => {
    const sum = Object.values(deltas).reduce((a, b) => a + b, 0);
    if (sum !== 0) {
      throw new Error("Zero-sum validation failed");
    }

    const newRecord: ScoreRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type: 'manual',
      score: 0,
      winnerIds: (Object.keys(deltas) as PlayerId[]).filter(id => deltas[id] > 0),
      loserIds: (Object.keys(deltas) as PlayerId[]).filter(id => deltas[id] < 0),
      remark: remark || '自',
      manualScores: deltas,
    };

    setHistory(prev => [...prev, newRecord]);
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setMiddleNum(1);
  }, []);

  const updateLevel = useCallback((side: 'left' | 'right', delta: number, sequenceLength: number) => {
    const setter = side === 'left' ? setLeftCardIdx : setRightCardIdx;
    setter(prev => {
      const next = prev + delta;
      if (next < 0) return sequenceLength - 1;
      if (next >= sequenceLength) return 0;
      return next;
    });
  }, []);

  const resetLevels = useCallback(() => {
    setLeftCardIdx(0);
    setRightCardIdx(0);
  }, []);

  const incrementRound = useCallback(() => setMiddleNum(p => p + 1), []);
  const decrementRound = useCallback(() => setMiddleNum(p => Math.max(1, p - 1)), []);

  return {
    history,
    totalScores,
    aggregatedRemarks,
    levels: { left: leftCardIdx, right: rightCardIdx },
    round: middleNum,
    isLoaded,
    addScore,
    addManualScore,
    deleteRecord,
    clearHistory,
    updateLevel,
    resetLevels,
    incrementRound,
    decrementRound,
    setRound: setMiddleNum,
  };
}
