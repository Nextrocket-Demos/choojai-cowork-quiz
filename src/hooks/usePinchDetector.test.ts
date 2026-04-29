import { describe, it, expect, beforeEach } from 'vitest';
import { createPinchDetector } from './usePinchDetector';
import type { Rect, PinchEvent } from '../types';

const leftZone:  Rect = { x: 0.0, y: 0.3, width: 0.3, height: 0.4 };
const rightZone: Rect = { x: 0.7, y: 0.3, width: 0.3, height: 0.4 };

function collect() {
  const events: PinchEvent[] = [];
  return { events, push: (e: PinchEvent) => events.push(e) };
}

function last(events: PinchEvent[]): PinchEvent | undefined {
  return events.length === 0 ? undefined : events[events.length - 1];
}

describe('pinchDetector FSM', () => {
  let detector: ReturnType<typeof createPinchDetector>;
  let sink: ReturnType<typeof collect>;

  beforeEach(() => {
    sink = collect();
    detector = createPinchDetector({ holdMs: 1500, zones: { left: leftZone, right: rightZone }, onEvent: sink.push });
  });

  it('emits IDLE when no pinch', () => {
    detector.tick({ pinching: false, cursor: { x: 0.5, y: 0.5 }, pinchDistance: 0.2 }, 0);
    expect(last(sink.events)?.phase).toBe('IDLE');
  });

  it('emits HOVERING when pinch enters left zone', () => {
    detector.tick({ pinching: true, cursor: { x: 0.1, y: 0.5 }, pinchDistance: 0.02 }, 0);
    const evt = last(sink.events)!;
    expect(evt.phase).toBe('HOVERING');
    expect(evt.zone).toBe('left');
    expect(evt.progress).toBe(0);
  });

  it('progresses to CONFIRMED after 1500ms held in same zone', () => {
    detector.tick({ pinching: true, cursor: { x: 0.1, y: 0.5 }, pinchDistance: 0.02 }, 0);
    detector.tick({ pinching: true, cursor: { x: 0.1, y: 0.5 }, pinchDistance: 0.02 }, 800);
    expect(last(sink.events)?.phase).toBe('CONFIRMING');
    detector.tick({ pinching: true, cursor: { x: 0.1, y: 0.5 }, pinchDistance: 0.02 }, 1500);
    expect(last(sink.events)?.phase).toBe('CONFIRMED');
    expect(last(sink.events)?.zone).toBe('left');
  });

  it('resets when pinch released mid-hold', () => {
    detector.tick({ pinching: true, cursor: { x: 0.1, y: 0.5 }, pinchDistance: 0.02 }, 0);
    detector.tick({ pinching: false, cursor: null, pinchDistance: null }, 500);
    expect(last(sink.events)?.phase).toBe('IDLE');
  });

  it('resets when cursor leaves the zone', () => {
    detector.tick({ pinching: true, cursor: { x: 0.1, y: 0.5 }, pinchDistance: 0.02 }, 0);
    detector.tick({ pinching: true, cursor: { x: 0.5, y: 0.5 }, pinchDistance: 0.02 }, 500);
    expect(last(sink.events)?.phase).toBe('IDLE');
  });

  it('does not re-confirm after CONFIRMED until reset', () => {
    detector.tick({ pinching: true, cursor: { x: 0.1, y: 0.5 }, pinchDistance: 0.02 }, 0);
    detector.tick({ pinching: true, cursor: { x: 0.1, y: 0.5 }, pinchDistance: 0.02 }, 1500);
    detector.tick({ pinching: true, cursor: { x: 0.1, y: 0.5 }, pinchDistance: 0.02 }, 2000);
    const confirmedCount = sink.events.filter((e) => e.phase === 'CONFIRMED').length;
    expect(confirmedCount).toBe(1);
  });
});
