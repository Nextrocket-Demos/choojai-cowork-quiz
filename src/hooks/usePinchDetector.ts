import { pointInRect } from '../lib/geometry';
import type { HandFrame } from './useHandTracker';
import type { PinchEvent, PinchPhase, Point, Rect, ZoneId } from '../types';

export interface PinchDetectorOptions {
  holdMs: number;
  zones: Record<ZoneId, Rect>;
  onEvent: (e: PinchEvent) => void;
}

export interface PinchDetector {
  tick: (frame: HandFrame, nowMs: number) => void;
  reset: () => void;
}

export function createPinchDetector(opts: PinchDetectorOptions): PinchDetector {
  let phase: PinchPhase = 'IDLE';
  let zone: ZoneId | null = null;
  let holdStart = 0;
  let confirmedThisHold = false;

  function emit(progress: number, cursor: Point | null): void {
    opts.onEvent({ phase, zone, progress, cursor });
  }

  function whichZone(p: Point): ZoneId | null {
    if (pointInRect(p, opts.zones.left))  return 'left';
    if (pointInRect(p, opts.zones.right)) return 'right';
    return null;
  }

  function reset(): void {
    phase = 'IDLE';
    zone = null;
    holdStart = 0;
    confirmedThisHold = false;
  }

  function tick(frame: HandFrame, nowMs: number): void {
    if (!frame.pinching || !frame.cursor) {
      reset();
      emit(0, frame.cursor);
      return;
    }

    const z = whichZone(frame.cursor);

    if (z === null) {
      reset();
      emit(0, frame.cursor);
      return;
    }

    if (zone !== z) {
      zone = z;
      holdStart = nowMs;
      confirmedThisHold = false;
      phase = 'HOVERING';
      emit(0, frame.cursor);
      return;
    }

    const elapsed = nowMs - holdStart;
    const progress = Math.min(elapsed / opts.holdMs, 1);

    if (progress >= 1 && !confirmedThisHold) {
      phase = 'CONFIRMED';
      confirmedThisHold = true;
      emit(1, frame.cursor);
      return;
    }
    if (confirmedThisHold) return; // hold pinch open after confirm without re-firing

    phase = elapsed > 0 ? 'CONFIRMING' : 'HOVERING';
    emit(progress, frame.cursor);
  }

  return { tick, reset };
}
