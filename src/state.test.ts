import { describe, it, expect } from 'vitest';
import { createGame, type GameAction } from './state';
import { QUESTIONS } from './data/questions';

// Kept per task spec; underscore-prefixed to satisfy noUnusedLocals.
function _dispatch(state: ReturnType<typeof createGame>['state'], actions: GameAction[]) {
  const game = createGame();
  game.state = state;
  for (const a of actions) game.dispatch(a);
  return game.state;
}
void _dispatch;

describe('game state machine', () => {
  it('starts on splash', () => {
    expect(createGame().state.phase).toBe('splash');
  });

  it('transitions splash → permission on START', () => {
    const g = createGame();
    g.dispatch({ type: 'START' });
    expect(g.state.phase).toBe('permission');
  });

  it('transitions permission → calibration on PERMISSION_GRANTED', () => {
    const g = createGame();
    g.dispatch({ type: 'START' });
    g.dispatch({ type: 'PERMISSION_GRANTED' });
    expect(g.state.phase).toBe('calibration');
  });

  it('transitions calibration → quiz Q0 on CALIBRATION_DONE', () => {
    const g = createGame();
    g.dispatch({ type: 'START' });
    g.dispatch({ type: 'PERMISSION_GRANTED' });
    g.dispatch({ type: 'CALIBRATION_DONE' });
    expect(g.state.phase).toBe('quiz');
    if (g.state.phase === 'quiz') expect(g.state.questionIndex).toBe(0);
  });

  it('records correct answer and increments streak', () => {
    const g = createGame();
    g.dispatch({ type: 'START' });
    g.dispatch({ type: 'PERMISSION_GRANTED' });
    g.dispatch({ type: 'CALIBRATION_DONE' });
    g.dispatch({ type: 'ANSWER', zone: QUESTIONS[0].correct });
    expect(g.state.phase).toBe('feedback');
    if (g.state.phase === 'feedback') {
      expect(g.state.correct).toBe(true);
      expect(g.state.score).toBe(1);
      expect(g.state.streak).toBe(1);
    }
  });

  it('resets streak on wrong answer but keeps best streak', () => {
    const g = createGame();
    g.dispatch({ type: 'START' });
    g.dispatch({ type: 'PERMISSION_GRANTED' });
    g.dispatch({ type: 'CALIBRATION_DONE' });
    g.dispatch({ type: 'ANSWER', zone: QUESTIONS[0].correct });
    g.dispatch({ type: 'NEXT' });
    const wrong = QUESTIONS[1].correct === 'left' ? 'right' : 'left';
    g.dispatch({ type: 'ANSWER', zone: wrong });
    if (g.state.phase === 'feedback') {
      expect(g.state.streak).toBe(0);
      expect(g.state.bestStreak).toBe(1);
    }
  });

  it('reaches result after the 5th NEXT', () => {
    const g = createGame();
    g.dispatch({ type: 'START' });
    g.dispatch({ type: 'PERMISSION_GRANTED' });
    g.dispatch({ type: 'CALIBRATION_DONE' });
    for (let i = 0; i < 5; i++) {
      g.dispatch({ type: 'ANSWER', zone: QUESTIONS[i].correct });
      g.dispatch({ type: 'NEXT' });
    }
    expect(g.state.phase).toBe('result');
    if (g.state.phase === 'result') expect(g.state.score).toBe(5);
  });

  it('handles PERMISSION_DENIED', () => {
    const g = createGame();
    g.dispatch({ type: 'START' });
    g.dispatch({ type: 'PERMISSION_DENIED' });
    expect(g.state.phase).toBe('permission-denied');
  });

  it('RETRY from result goes back to splash', () => {
    const g = createGame();
    g.state = { phase: 'result', score: 3, bestStreak: 2, answers: ['left', 'right', 'left', 'right', 'left'] };
    g.dispatch({ type: 'RETRY' });
    expect(g.state.phase).toBe('splash');
  });
});
