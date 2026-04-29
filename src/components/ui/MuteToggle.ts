import { el } from './dom';
import { isMuted, setMuted } from '../../lib/audio';

export function MuteToggle(): HTMLElement {
  const btn = el('button', {
    class: 'fixed top-3 right-3 z-50 w-11 h-11 rounded-full bg-white/80 border border-choojai-green text-xl flex items-center justify-center shadow active:scale-95',
    'aria-label': 'Toggle sound',
  });
  const render = () => { btn.textContent = isMuted() ? '🔇' : '🔊'; };
  render();
  btn.addEventListener('click', () => { setMuted(!isMuted()); render(); });
  return btn;
}
