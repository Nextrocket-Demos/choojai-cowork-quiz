import { HandLandmarker, FilesetResolver, type HandLandmarkerResult } from '@mediapipe/tasks-vision';
import type { Point } from '../types';
import { mirrorX, midpoint, distance } from '../lib/geometry';

const WASM_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';
const MODEL_PATH = `${import.meta.env.BASE_URL}models/hand_landmarker.task`;

export interface HandFrame {
  pinching: boolean;
  cursor: Point | null;        // normalized 0-1, mirrored for selfie
  pinchDistance: number | null;
}

const PINCH_THRESHOLD = 0.05;

export interface HandTracker {
  start: (video: HTMLVideoElement, onFrame: (frame: HandFrame) => void) => void;
  stop: () => void;
}

export async function createHandTracker(): Promise<HandTracker> {
  const vision = await FilesetResolver.forVisionTasks(WASM_BASE);
  const landmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: MODEL_PATH, delegate: 'GPU' },
    runningMode: 'VIDEO',
    numHands: 1,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  let rafId: number | null = null;
  let running = false;

  function loop(video: HTMLVideoElement, onFrame: (f: HandFrame) => void): void {
    if (!running) return;
    if (video.readyState >= 2) {
      const result: HandLandmarkerResult = landmarker.detectForVideo(video, performance.now());
      onFrame(toHandFrame(result));
    }
    rafId = requestAnimationFrame(() => loop(video, onFrame));
  }

  return {
    start(video, onFrame) {
      running = true;
      loop(video, onFrame);
    },
    stop() {
      running = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    },
  };
}

function toHandFrame(result: HandLandmarkerResult): HandFrame {
  const hands = result.landmarks;
  if (!hands || hands.length === 0) return { pinching: false, cursor: null, pinchDistance: null };
  const lm = hands[0];
  const thumbTip = { x: lm[4].x, y: lm[4].y };
  const indexTip = { x: lm[8].x, y: lm[8].y };
  const dist = distance(thumbTip, indexTip);
  const mid = midpoint(thumbTip, indexTip);
  const cursor: Point = { x: mirrorX(mid.x), y: mid.y }; // selfie mirror
  return { pinching: dist < PINCH_THRESHOLD, cursor, pinchDistance: dist };
}
