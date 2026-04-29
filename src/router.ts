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

export function mountRouter(root: HTMLElement, game: Game): void {
  let camera: CameraHandle | null = null;
  let cleanup: (() => void) | null = null;

  game.subscribe(async (s) => {
    if (cleanup) { cleanup(); cleanup = null; }
    clear(root);

    switch (s.phase) {
      case 'splash':
        if (camera) { camera.stop(); camera = null; }
        root.appendChild(Splash(() => game.dispatch({ type: 'START' })));
        return;

      case 'permission':
      case 'permission-denied':
        root.appendChild(
          PermissionGate({
            denied: s.phase === 'permission-denied',
            onGranted: (h) => { camera = h; game.dispatch({ type: 'PERMISSION_GRANTED' }); },
            onDenied: () => game.dispatch({ type: 'PERMISSION_DENIED' }),
          })
        );
        return;

      case 'calibration': {
        if (!camera) return;
        const handle = await Calibration(camera, () => game.dispatch({ type: 'CALIBRATION_DONE' }));
        root.appendChild(handle.root);
        cleanup = handle.cleanup;
        return;
      }

      case 'quiz': {
        if (!camera) return;
        const q = QUESTIONS[s.questionIndex];
        const handle = await QuizScreen({
          question: q, index: s.questionIndex, total: QUESTIONS.length,
          score: s.score, streak: s.streak, camera,
          onAnswer: (zone) => game.dispatch({ type: 'ANSWER', zone }),
        });
        root.appendChild(handle.root);
        cleanup = handle.cleanup;
        return;
      }

      case 'feedback': {
        const q = QUESTIONS[s.questionIndex];
        root.appendChild(Feedback(q, s.correct, () => game.dispatch({ type: 'NEXT' })));
        return;
      }

      case 'result':
        if (camera) { camera.stop(); camera = null; }
        root.appendChild(ResultScreen({
          score: s.score, total: QUESTIONS.length, bestStreak: s.bestStreak, answers: s.answers,
          onRetry: () => game.dispatch({ type: 'RETRY' }),
        }));
        return;
    }
  });
}
