import { el } from './dom';

export interface ButtonOpts { label: string; onClick: () => void; variant?: 'primary' | 'secondary'; }

export function Button({ label, onClick, variant = 'primary' }: ButtonOpts): HTMLButtonElement {
  const cls =
    variant === 'primary'
      ? 'bg-choojai-green text-white font-thai font-semibold text-lg py-4 px-8 rounded-2xl shadow-lg active:scale-95 transition-transform'
      : 'bg-white text-choojai-green-dark border-2 border-choojai-green font-thai font-semibold text-base py-3 px-6 rounded-xl active:scale-95 transition-transform';
  const b = el('button', { class: cls }, [label]);
  b.addEventListener('click', onClick);
  return b;
}
