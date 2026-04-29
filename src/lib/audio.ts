type SfxName = 'click' | 'correct' | 'wrong';

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function setMuted(v: boolean): void {
  muted = v;
}

export function isMuted(): boolean {
  return muted;
}

function tone(
  freq: number,
  durationMs: number,
  type: OscillatorType = 'sine',
  startOffsetSec = 0,
  gain = 0.15,
): void {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + startOffsetSec);
  g.gain.setValueAtTime(0, ac.currentTime + startOffsetSec);
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + startOffsetSec + 0.01);
  g.gain.exponentialRampToValueAtTime(
    0.0001,
    ac.currentTime + startOffsetSec + durationMs / 1000,
  );
  osc.connect(g).connect(ac.destination);
  osc.start(ac.currentTime + startOffsetSec);
  osc.stop(ac.currentTime + startOffsetSec + durationMs / 1000 + 0.05);
}

export function playSfx(name: SfxName): void {
  if (muted) return;
  switch (name) {
    case 'click':
      tone(880, 60, 'square', 0, 0.08);
      break;
    case 'correct':
      tone(523.25, 150, 'sine', 0, 0.15); // C5
      tone(659.25, 150, 'sine', 0.05, 0.15); // E5
      tone(783.99, 250, 'sine', 0.1, 0.15); // G5
      break;
    case 'wrong':
      tone(220, 200, 'sawtooth', 0, 0.12); // A3
      tone(165, 350, 'sawtooth', 0.1, 0.12); // E3
      break;
  }
}

/** Call once after first user gesture to unlock AudioContext on iOS. */
export function unlockAudio(): void {
  const ac = getCtx();
  if (ac.state === 'suspended') void ac.resume();
}
