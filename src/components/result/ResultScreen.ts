import { el } from '../ui/dom';
import { Button } from '../ui/Button';
import { QUESTIONS } from '../../data/questions';
import type { ZoneId } from '../../types';

export interface ResultOpts { score: number; total: number; bestStreak: number; answers: Array<ZoneId | null>; onRetry: () => void; }

export function ResultScreen({ score, total, bestStreak, answers, onRetry }: ResultOpts): HTMLElement {
  const dots = QUESTIONS.map((q, i) => {
    const ans = answers[i];
    const correct = ans !== null && ans === q.correct;
    return el('div', { class: `w-3 h-3 rounded-full ${ans === null ? 'bg-gray-300' : correct ? 'bg-choojai-green' : 'bg-red-400'}` });
  });

  const share = async () => {
    const text = `Choojai Cowork Quiz: ${score}/${total} 🔥 streak ${bestStreak}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Choojai Cowork Quiz', text }); } catch { /* user cancelled */ }
    } else {
      try { await navigator.clipboard.writeText(text); alert('Copied to clipboard!'); } catch { /* ignore */ }
    }
  };

  return el('div', { class: 'flex flex-col items-center justify-center h-full px-6 gap-5 font-thai bg-choojai-bg text-center' }, [
    el('div', { class: 'text-sm tracking-widest text-choojai-green font-bold' }, ['CHOOJAI × COWORK']),
    el('div', { class: 'text-6xl font-bold text-choojai-green-dark' }, [`${score} / ${total}`]),
    el('div', { class: 'text-lg text-choojai-green-dark' }, [`🔥 STREAK ${bestStreak}`]),
    el('div', { class: 'flex gap-2 justify-center mt-2' }, dots),
    el('div', { class: 'flex flex-col gap-3 mt-4 w-full max-w-xs' }, [
      Button({ label: '📤 แชร์คะแนน', onClick: share, variant: 'primary' }),
      Button({ label: '↻ เล่นอีกรอบ',   onClick: onRetry, variant: 'secondary' }),
    ]),
  ]);
}
