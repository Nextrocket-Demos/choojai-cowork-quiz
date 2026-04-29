import { clear } from './components/ui/dom';
import { Splash } from './components/splash/Splash';
import { PermissionGate } from './components/permission/PermissionGate';
import { Calibration } from './components/calibration/Calibration';
import { QuizScreen } from './components/quiz/QuizScreen';
import { Feedback } from './components/feedback/Feedback';
import { ResultScreen } from './components/result/ResultScreen';
import { QUESTIONS } from './data/questions';
import type { Game } from './state';
import type { CameraHandle } from './lib/camera';

export function mountRouter(screenRoot: HTMLElement, cameraRoot: HTMLElement, game: Game): void {
  let camera: CameraHandle | null = null;
  let cleanup: (() => void) | null = null;
  let videoMounted = false;

  function mountVideo(c: CameraHandle): void {
    if (videoMounted) return;
    const v = c.video;
    v.style.position = 'absolute';
    v.style.inset = '0';
    v.style.width = '100%';
    v.style.height = '100%';
    v.style.objectFit = 'cover';
    v.style.transform = 'scaleX(-1)';
    cameraRoot.appendChild(v);
    if (v.srcObject !== c.stream) v.srcObject = c.stream;
    v.play().catch(() => {});
    videoMounted = true;
  }

  function unmountVideo(): void {
    if (camera && camera.video.parentElement === cameraRoot) {
      cameraRoot.removeChild(camera.video);
    }
    videoMounted = false;
  }

  function showCamera(visible: boolean): void {
    cameraRoot.style.display = visible ? 'block' : 'none';
  }

  game.subscribe(async (s) => {
    if (cleanup) { cleanup(); cleanup = null; }
    clear(screenRoot);

    switch (s.phase) {
      case 'splash':
        if (camera) { unmountVideo(); camera.stop(); camera = null; }
        showCamera(false);
        screenRoot.appendChild(Splash(() => game.dispatch({ type: 'START' })));
        return;

      case 'permission':
      case 'permission-denied':
        showCamera(false);
        screenRoot.appendChild(
          PermissionGate({
            denied: s.phase === 'permission-denied',
            onGranted: (h) => {
              camera = h;
              mountVideo(h);
              game.dispatch({ type: 'PERMISSION_GRANTED' });
            },
            onDenied: () => game.dispatch({ type: 'PERMISSION_DENIED' }),
          })
        );
        return;

      case 'calibration': {
        if (!camera) return;
        mountVideo(camera);
        showCamera(true);
        const handle = await Calibration(camera, () => game.dispatch({ type: 'CALIBRATION_DONE' }));
        screenRoot.appendChild(handle.root);
        cleanup = handle.cleanup;
        return;
      }

      case 'quiz': {
        if (!camera) return;
        mountVideo(camera);
        showCamera(true);
        const q = QUESTIONS[s.questionIndex];
        const handle = await QuizScreen({
          question: q, index: s.questionIndex, total: QUESTIONS.length,
          score: s.score, streak: s.streak, camera,
          onAnswer: (zone) => game.dispatch({ type: 'ANSWER', zone }),
        });
        screenRoot.appendChild(handle.root);
        cleanup = handle.cleanup;
        return;
      }

      case 'feedback': {
        showCamera(true);
        const q = QUESTIONS[s.questionIndex];
        screenRoot.appendChild(Feedback(q, s.correct, () => game.dispatch({ type: 'NEXT' })));
        return;
      }

      case 'result':
        if (camera) { unmountVideo(); camera.stop(); camera = null; }
        showCamera(false);
        screenRoot.appendChild(ResultScreen({
          score: s.score, total: QUESTIONS.length, bestStreak: s.bestStreak, answers: s.answers,
          onRetry: () => game.dispatch({ type: 'RETRY' }),
        }));
        return;
    }
  });
}
