export interface ProgressRingHandle {
  root: HTMLElement;
  setProgress: (p: number) => void;
  setVisible: (v: boolean) => void;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

export function ProgressRing(): ProgressRingHandle {
  const SIZE = 44;
  const STROKE = 4;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'absolute pointer-events-none');
  svg.setAttribute(
    'style',
    `width:${SIZE}px;height:${SIZE}px;transform:translate(-50%,-50%);opacity:0;transition:opacity 100ms;`
  );
  svg.setAttribute('viewBox', `0 0 ${SIZE} ${SIZE}`);

  const bg = document.createElementNS(SVG_NS, 'circle');
  bg.setAttribute('cx', `${SIZE / 2}`);
  bg.setAttribute('cy', `${SIZE / 2}`);
  bg.setAttribute('r', `${R}`);
  bg.setAttribute('fill', 'none');
  bg.setAttribute('stroke', 'rgba(255,255,255,0.25)');
  bg.setAttribute('stroke-width', `${STROKE}`);

  const arc = document.createElementNS(SVG_NS, 'circle');
  arc.setAttribute('cx', `${SIZE / 2}`);
  arc.setAttribute('cy', `${SIZE / 2}`);
  arc.setAttribute('r', `${R}`);
  arc.setAttribute('fill', 'none');
  arc.setAttribute('stroke', '#69B609');
  arc.setAttribute('stroke-width', `${STROKE}`);
  arc.setAttribute('stroke-linecap', 'round');
  arc.setAttribute('stroke-dasharray', `${C}`);
  arc.setAttribute('stroke-dashoffset', `${C}`);
  arc.setAttribute('transform', `rotate(-90 ${SIZE / 2} ${SIZE / 2})`);

  svg.appendChild(bg);
  svg.appendChild(arc);

  const root = svg as unknown as HTMLElement;

  return {
    root,
    setProgress(p) {
      const clamped = Math.min(Math.max(p, 0), 1);
      arc.setAttribute('stroke-dashoffset', `${C * (1 - clamped)}`);
    },
    setVisible(v) {
      root.style.opacity = v ? '1' : '0';
    },
  };
}

export function setRingPosition(handle: ProgressRingHandle, xPct: number, yPct: number): void {
  const e = handle.root;
  e.style.left = `${xPct * 100}%`;
  e.style.top = `${yPct * 100}%`;
}
