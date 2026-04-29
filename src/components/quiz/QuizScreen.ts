import { el, clear } from '../ui/dom';
import { QuestionCard } from './QuestionCard';
import { Zone } from './Zone';
import { PinchCursor } from './PinchCursor';
import { ProgressRing, setRingPosition } from './ProgressRing';
import { createPinchDetector } from '../../hooks/usePinchDetector';
import { createHandTracker } from '../../hooks/useHandTracker';
import { playSfx } from '../../lib/audio';
import { vibrate } from '../../lib/haptic';
import type { CameraHandle } from '../../lib/camera';
import type { Question, ZoneId, Rect } from '../../types';

export interface QuizScreenOpts {
  question: Question;
  index: number;
  total: number;
  score: number;
  streak: number;
  camera: CameraHandle;
  onAnswer: (zone: ZoneId) => void;
}

export interface QuizScreenHandle { root: HTMLElement; cleanup: () => void; }

const LEFT_RECT:  Rect = { x: 0.04, y: 0.225, width: 0.28, height: 0.55 };
const RIGHT_RECT: Rect = { x: 0.68, y: 0.225, width: 0.28, height: 0.55 };

export async function QuizScreen(opts: QuizScreenOpts): Promise<QuizScreenHandle> {
  const root = el('div', { class: 'relative h-full w-full bg-black overflow-hidden font-thai' });

  // Video — mirrored selfie
  const video = opts.camera.video;
  video.style.position = 'absolute';
  video.style.inset = '0';
  video.style.width = '100%';
  video.style.height = '100%';
  video.style.objectFit = 'cover';
  video.style.transform = 'scaleX(-1)'; // mirror display
  root.appendChild(video);

  // Overlays
  root.appendChild(QuestionCard({ index: opts.index, total: opts.total, questionText: opts.question.question }));

  const leftZone  = Zone('left',  opts.question.leftLabel);
  const rightZone = Zone('right', opts.question.rightLabel);
  root.append(leftZone.root, rightZone.root);

  const cursor = PinchCursor(); root.appendChild(cursor.root);
  const ring = ProgressRing();   root.appendChild(ring.root);

  // HUD
  const hud = el('div', { class: 'absolute bottom-3 left-3 right-3 flex justify-center items-center text-white/90 text-sm font-bold drop-shadow' });
  const updateHud = (s: number, st: number) => { hud.textContent = `🔥 STREAK ${st} · SCORE ${s}/${opts.total}`; };
  updateHud(opts.score, opts.streak);
  root.appendChild(hud);

  // Hand tracker + pinch detector
  const tracker = await createHandTracker();
  let answered = false;

  const detector = createPinchDetector({
    holdMs: 1500,
    zones: { left: LEFT_RECT, right: RIGHT_RECT },
    onEvent: (e) => {
      cursor.setPosition(e.cursor);
      ring.setVisible(e.phase === 'HOVERING' || e.phase === 'CONFIRMING');
      ring.setProgress(e.progress);
      if (e.cursor) setRingPosition(ring, e.cursor.x, e.cursor.y);

      leftZone.setActive(e.zone === 'left');
      rightZone.setActive(e.zone === 'right');
      leftZone.setProgress(e.zone === 'left' ? e.progress : 0);
      rightZone.setProgress(e.zone === 'right' ? e.progress : 0);

      if (e.phase === 'CONFIRMED' && e.zone && !answered) {
        answered = true;
        playSfx('click');
        vibrate(50);
        tracker.stop();
        opts.onAnswer(e.zone);
      }
    },
  });

  tracker.start(video, (frame) => detector.tick(frame, performance.now()));

  return {
    root,
    cleanup() {
      tracker.stop();
      clear(root);
    },
  };
}
