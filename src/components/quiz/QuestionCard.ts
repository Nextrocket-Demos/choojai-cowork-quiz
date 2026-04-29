import { el } from '../ui/dom';

export interface QuestionCardOpts { index: number; total: number; questionText: string; }

export function QuestionCard({ index, total, questionText }: QuestionCardOpts): HTMLElement {
  return el('div', { class: 'absolute top-3 left-3 right-3 z-10 flex flex-col items-center gap-2 font-thai pointer-events-none' }, [
    el('div', { class: 'bg-choojai-green text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider' }, [`CHOOJAI · Q ${index + 1}/${total}`]),
    el('div', { class: 'bg-choojai-bg/95 border-2 border-choojai-green rounded-xl p-3 text-center text-choojai-green-dark text-base font-semibold leading-snug shadow' }, [questionText]),
  ]);
}
