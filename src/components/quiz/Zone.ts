import { el } from '../ui/dom';
import type { ZoneId } from '../../types';

export interface ZoneHandle {
  root: HTMLElement;
  setActive: (active: boolean) => void;
  setProgress: (p: number) => void;
}

export function Zone(id: ZoneId, label: string): ZoneHandle {
  const isLeft = id === 'left';
  const positionCls = isLeft ? 'left-2' : 'right-2';
  const colorCls = isLeft
    ? 'bg-zone-left/70 border-zone-left-bd text-orange-900'
    : 'bg-zone-right/70 border-zone-right-bd text-choojai-green-dark';

  const ring = el('div', { class: 'absolute inset-0 rounded-2xl pointer-events-none transition-shadow duration-150' });
  const fill = el('div', { class: 'absolute bottom-0 left-0 right-0 bg-choojai-green/30 rounded-b-2xl', style: 'height:0%; transition: height 80ms linear;' });
  const text = el('div', { class: 'relative font-thai font-bold text-base text-center px-2 leading-tight' }, [label]);

  const root = el(
    'div',
    {
      class: `absolute top-1/2 -translate-y-1/2 ${positionCls} w-[28%] h-[55%] flex items-center justify-center rounded-2xl border-2 ${colorCls} backdrop-blur-sm overflow-hidden`,
    },
    [fill, text, ring]
  );

  return {
    root,
    setActive(active) {
      ring.style.boxShadow = active ? `0 0 24px ${isLeft ? '#FF9F40' : '#69B609'}` : 'none';
    },
    setProgress(p) {
      fill.style.height = `${Math.round(Math.min(Math.max(p, 0), 1) * 100)}%`;
    },
  };
}
