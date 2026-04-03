export type PlayerId = 'N' | 'S' | 'W' | 'E';

export interface PlayerConfig {
  id: PlayerId;
  defaultName: string;
  color: 'red' | 'blue';
  position: 'top' | 'bottom' | 'left' | 'right';
}

export interface ScoreRecord {
  id: string;
  timestamp: number;
  type: 'solo' | 'duo' | 'manual';
  score: number;
  winnerIds: PlayerId[];
  loserIds: PlayerId[];
  remark: string;
  manualScores?: Record<PlayerId, number>;
}

export const CARD_SEQUENCE = [
  '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A1', 'A2', 'A3'
];
