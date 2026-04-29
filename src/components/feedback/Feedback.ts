import { el } from '../ui/dom';
import { playSfx } from '../../lib/audio';
import type { Question } from '../../types';

export function Feedback(q: Question, correct: boolean, onDone: () => void): HTMLElement {
  playSfx(correct ? 'correct' : 'wrong');

  const root = el('div', { class: `absolute inset-0 flex flex-col items-center justify-center gap-4 font-thai text-center px-6 ${correct ? 'bg-choojai-green-soft' : 'bg-red-50'}` }, [
    el('div', { class: 'text-7xl' }, [correct ? '✅' : '❌']),
    el('div', { class: 'text-2xl font-bold text-choojai-green-dark' }, [correct ? 'ถูกต้อง!' : 'ยังนะ']),
    el('div', { class: 'text-base text-choojai-green-dark/80 max-w-xs' }, [q.explanation]),
    el('div', { class: 'text-xs text-choojai-green-dark/50 mt-4' }, ['ข้อต่อไป...']),
  ]);

  setTimeout(onDone, 2200);
  return root;
}
