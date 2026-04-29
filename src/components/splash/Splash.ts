import { el } from '../ui/dom';
import { Button } from '../ui/Button';
import { unlockAudio } from '../../lib/audio';

export function Splash(onStart: () => void): HTMLElement {
  return el('div', { class: 'flex flex-col items-center justify-center h-full px-6 text-center gap-6 font-thai bg-choojai-bg' }, [
    el('div', { class: 'text-sm tracking-widest text-choojai-green font-bold' }, ['CHOOJAI × COWORK']),
    el('h1', { class: 'text-3xl font-bold text-choojai-green-dark leading-tight' }, ['Cowork Quiz', el('br'), '5 ข้อ จีบนิ้วตอบ 🤏']),
    el('p', { class: 'text-base text-choojai-green-dark/80 max-w-xs' }, ['เกมรีวิว session วันนี้ — ใช้กล้อง selfie + จีบนิ้วเลือกคำตอบซ้าย/ขวา']),
    Button({
      label: '▶ เริ่มเล่น',
      onClick: () => { unlockAudio(); onStart(); },
    }),
    el('p', { class: 'text-xs text-choojai-green-dark/50 mt-4' }, ['เปิดบนมือถือเท่านั้น · กล้องไม่ส่งออกที่ไหน']),
  ]);
}
