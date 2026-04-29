import { el } from '../ui/dom';
import { PinchCursor } from '../quiz/PinchCursor';
import { createHandTracker } from '../../hooks/useHandTracker';
import type { CameraHandle } from '../../lib/camera';

export interface CalibrationHandle { root: HTMLElement; cleanup: () => void; }

export async function Calibration(camera: CameraHandle, onDone: () => void): Promise<CalibrationHandle> {
  const root = el('div', { class: 'relative h-full w-full bg-black overflow-hidden font-thai' });

  const v = camera.video;
  v.style.position = 'absolute'; v.style.inset = '0';
  v.style.width = '100%'; v.style.height = '100%'; v.style.objectFit = 'cover';
  v.style.transform = 'scaleX(-1)';
  root.appendChild(v);
  if (v.srcObject !== camera.stream) v.srcObject = camera.stream;
  v.play().catch(() => {});

  const cursor = PinchCursor(); root.appendChild(cursor.root);

  root.appendChild(el('div', { class: 'absolute top-3 left-3 right-3 z-10 text-center text-white text-lg font-bold drop-shadow-lg' }, [
    'ลองยกมือ 🤚 จีบนิ้ว 🤏',
  ]));

  const hint = el('div', { class: 'absolute bottom-6 left-3 right-3 text-center text-white/80 text-sm drop-shadow' }, ['เห็นจุดเขียวเมื่อจีบนิ้ว']);
  root.appendChild(hint);

  const tracker = await createHandTracker();
  let done = false;
  const finish = () => { if (done) return; done = true; tracker.stop(); onDone(); };

  tracker.start(v, (frame) => {
    cursor.setPosition(frame.pinching ? frame.cursor : null);
    if (frame.pinching) finish();
  });

  setTimeout(finish, 5000);

  return { root, cleanup: () => { tracker.stop(); } };
}
