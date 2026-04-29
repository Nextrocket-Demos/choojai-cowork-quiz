export type ZoneId = 'left' | 'right';

export type GameState =
  | { phase: 'splash' }
  | { phase: 'permission' }
  | { phase: 'permission-denied' }
  | { phase: 'calibration' }
  | { phase: 'quiz'; questionIndex: number; score: number; streak: number; bestStreak: number; answers: Array<ZoneId | null> }
  | { phase: 'feedback'; questionIndex: number; correct: boolean; score: number; streak: number; bestStreak: number; answers: Array<ZoneId | null> }
  | { phase: 'result'; score: number; bestStreak: number; answers: Array<ZoneId | null> };

export interface Question {
  id: number;
  block: 'Block 1' | 'Block 2' | 'Block 3' | 'Block 4';
  goal?: 'A' | 'B' | 'C';
  question: string;
  leftLabel: string;
  rightLabel: string;
  correct: ZoneId;
  explanation: string;
}

export interface Rect { x: number; y: number; width: number; height: number; }
export interface Point { x: number; y: number; }

export type PinchPhase = 'IDLE' | 'HOVERING' | 'CONFIRMING' | 'CONFIRMED';
export interface PinchEvent { phase: PinchPhase; zone: ZoneId | null; progress: number; cursor: Point | null; }
