import type { PlayerId, ScoreRecord } from './scoring';
import type { Lang } from '../i18n';

export interface ScoreboardStorage {
  // Scoring Module
  history?: ScoreRecord[];
  leftCardIdx?: number;
  rightCardIdx?: number;
  middleNum?: number;
  
  // i18n Module
  lang?: Lang;
  
  // App/UI State
  playerNames?: Record<PlayerId, string>;
  historyView?: 'list' | 'table';
  uiMode?: 'full' | 'top' | 'bottom';
  fabPos?: { x: number, y: number } | null;
  
  // System
  version?: string;
}
