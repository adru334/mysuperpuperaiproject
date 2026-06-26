// Procedural audio synthesis for retro sound effects using Web Audio API

let audioCtx: AudioContext | null = null;
let globalVolume = parseFloat(localStorage.getItem('crypto_office_volume') || '0.5');

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const SoundManager = {
  getVolume(): number {
    return globalVolume;
  },
  setVolume(vol: number) {
    globalVolume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('crypto_office_volume', globalVolume.toString());
  },

  playBleep(pitch: number = 150, type: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'square', duration = 0.04) {
    if (globalVolume <= 0) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(pitch + (Math.random() * 20 - 10), ctx.currentTime);

      gain.gain.setValueAtTime(0.08 * globalVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context error or browser restriction
    }
  },

  playClick() {
    if (globalVolume <= 0) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.05 * globalVolume, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
  },

  playRing() {
    if (globalVolume <= 0) return;
    try {
      const ctx = getAudioContext();
      const playPulse = (start: number) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(850, start);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(440, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.04 * globalVolume, start + 0.02);
        gain.gain.linearRampToValueAtTime(0.04 * globalVolume, start + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(start);
        osc2.start(start);
        osc1.stop(start + 0.22);
        osc2.stop(start + 0.22);
      };

      const now = ctx.currentTime;
      playPulse(now);
      playPulse(now + 0.25);
    } catch (e) {}
  },

  playSuccess() {
    if (globalVolume <= 0) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const playNote = (freq: number, start: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.06 * globalVolume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.02);
      };

      playNote(523.25, now, 0.1); // C5
      playNote(659.25, now + 0.08, 0.1); // E5
      playNote(783.99, now + 0.16, 0.12); // G5
      playNote(1046.50, now + 0.24, 0.22); // C6
    } catch (e) {}
  },

  playFail() {
    if (globalVolume <= 0) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.4);

      gain.gain.setValueAtTime(0.08 * globalVolume, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(now + 0.45);
    } catch (e) {}
  },

  playAlarm() {
    if (globalVolume <= 0) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.2);
      osc.frequency.linearRampToValueAtTime(600, now + 0.4);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05 * globalVolume, now + 0.05);
      gain.gain.linearRampToValueAtTime(0.05 * globalVolume, now + 0.35);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(now + 0.41);
    } catch (e) {}
  },

  playBlock() {
    if (globalVolume <= 0) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(800, now + 0.06);

      gain.gain.setValueAtTime(0.06 * globalVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(now + 0.16);
    } catch (e) {}
  }
};
