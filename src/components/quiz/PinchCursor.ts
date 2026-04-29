import { el } from '../ui/dom';
import type { Point } from '../../types';

export interface PinchCursorHandle {
  root: HTMLElement;
  setPosition: (p: Point | null) => void;
}

export function PinchCursor(): PinchCursorHandle {
  const dot = el('div', {
    class: 'absolute pointer-events-none rounded-full transition-opacity duration-100',
    style: 'width:14px;height:14px;background:#69B609;box-shadow:0 0 14px #69B609;opacity:0;transform:translate(-50%,-50%);',
  });
  return {
    root: dot,
    setPosition(p) {
      if (!p) { dot.style.opacity = '0'; return; }
      dot.style.opacity = '1';
      dot.style.left = `${p.x * 100}%`;
      dot.style.top  = `${p.y * 100}%`;
    },
  };
}
