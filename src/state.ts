import type { GameState, ZoneId } from './types';
import { QUESTIONS } from './data/questions';

export type GameAction =
  | { type: 'START' }
  | { type: 'PERMISSION_GRANTED' }
  | { type: 'PERMISSION_DENIED' }
  | { type: 'PERMISSION_RETRY' }
  | { type: 'CALIBRATION_DONE' }
  | { type: 'ANSWER'; zone: ZoneId }
  | { type: 'NEXT' }
  | { type: 'RETRY' };

export interface Game {
  state: GameState;
  dispatch: (a: GameAction) => void;
  subscribe: (fn: (s: GameState) => void) => () => void;
}

export function createGame(): Game {
  let state: GameState = { phase: 'splash' };
  const listeners = new Set<(s: GameState) => void>();

  function emit() {
    for (const fn of listeners) fn(state);
  }

  const game: Game = {
    get state() {
      return state;
    },
    set state(s: GameState) {
      state = s;
      emit();
    },
    dispatch(a) {
      state = reduce(state, a);
      emit();
    },
    subscribe(fn) {
      listeners.add(fn);
      fn(state);
      return () => {
        listeners.delete(fn);
      };
    },
  };

  return game;
}

function reduce(s: GameState, a: GameAction): GameState {
  switch (a.type) {
    case 'START':
      if (s.phase === 'splash') return { phase: 'permission' };
      return s;

    case 'PERMISSION_GRANTED':
      if (s.phase === 'permission') return { phase: 'calibration' };
      return s;

    case 'PERMISSION_DENIED':
      if (s.phase === 'permission') return { phase: 'permission-denied' };
      return s;

    case 'PERMISSION_RETRY':
      if (s.phase === 'permission-denied') return { phase: 'permission' };
      return s;

    case 'CALIBRATION_DONE':
      if (s.phase === 'calibration') {
        return {
          phase: 'quiz',
          questionIndex: 0,
          score: 0,
          streak: 0,
          bestStreak: 0,
          answers: [null, null, null, null, null],
        };
      }
      return s;

    case 'ANSWER':
      if (s.phase === 'quiz') {
        const q = QUESTIONS[s.questionIndex];
        const correct = a.zone === q.correct;
        const score = s.score + (correct ? 1 : 0);
        const streak = correct ? s.streak + 1 : 0;
        const bestStreak = Math.max(s.bestStreak, streak);
        const answers = s.answers.slice();
        answers[s.questionIndex] = a.zone;
        return {
          phase: 'feedback',
          questionIndex: s.questionIndex,
          correct,
          score,
          streak,
          bestStreak,
          answers,
        };
      }
      return s;

    case 'NEXT':
      if (s.phase === 'feedback') {
        const next = s.questionIndex + 1;
        if (next >= QUESTIONS.length) {
          return {
            phase: 'result',
            score: s.score,
            bestStreak: s.bestStreak,
            answers: s.answers,
          };
        }
        return {
          phase: 'quiz',
          questionIndex: next,
          score: s.score,
          streak: s.streak,
          bestStreak: s.bestStreak,
          answers: s.answers,
        };
      }
      return s;

    case 'RETRY':
      return { phase: 'splash' };
  }
}
