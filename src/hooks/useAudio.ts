import { useEffect, useRef, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import { create } from 'zustand';

interface AudioStore {
  muted: boolean;
  toggle: () => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  muted: false,
  toggle: () => {
    const next = !get().muted;
    Howler.mute(next);
    set({ muted: next });
  },
}));

// Central registry so sounds don't re-initialize on re-renders
const soundRegistry = new Map<string, Howl>();

function getSound(src: string, loop = true, volume = 0.4): Howl {
  if (!soundRegistry.has(src)) {
    soundRegistry.set(
      src,
      new Howl({
        src: [src],
        loop,
        volume,
        preload: true,
      })
    );
  }
  return soundRegistry.get(src)!;
}

// Inline base64-ish tone generator using Web Audio API as fallback
// since we don't have real audio files, we'll generate tones
export function useSynthAudio(pageId: string) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<OscillatorNode[]>([]);
  const gainRef = useRef<GainNode | null>(null);
  const { muted } = useAudioStore();

  const startAmbient = useCallback(() => {
    if (muted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Clean up previous
      nodesRef.current.forEach(n => { try { n.stop(); n.disconnect(); } catch { /* ignore */ } });
      nodesRef.current = [];

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2);
      masterGain.connect(ctx.destination);
      gainRef.current = masterGain;

      // Page-specific chord frequencies for ambient feel
      const chordMap: Record<string, number[]> = {
        entrance: [261.63, 329.63, 392.0, 523.25],     // C major - gentle
        tree: [220.0, 277.18, 329.63, 440.0],           // A minor - deep forest
        garden: [293.66, 369.99, 440.0, 587.33],        // D major - bright
        island: [349.23, 440.0, 523.25, 698.46],        // F major - open sky
        lake: [261.63, 311.13, 392.0, 523.25],          // C minor - mysterious
        constellation: [195.0, 246.94, 293.66, 391.0],  // G minor - cosmic
        sunrise: [261.63, 329.63, 392.0, 523.25],       // C major - triumphant
      };

      const freqs = chordMap[pageId] || chordMap.entrance;
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        // Slow frequency drift for organic feel
        osc.frequency.linearRampToValueAtTime(freq * 1.002, ctx.currentTime + 8);
        osc.frequency.linearRampToValueAtTime(freq, ctx.currentTime + 16);
        oscGain.gain.setValueAtTime(i === 0 ? 0.4 : 0.15, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        nodesRef.current.push(osc);
      });
    } catch { /* AudioContext not available */ }
  }, [pageId, muted]);

  const stopAmbient = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || !gainRef.current) return;
    gainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    setTimeout(() => {
      nodesRef.current.forEach(n => { try { n.stop(); n.disconnect(); } catch { /* ignore */ } });
      nodesRef.current = [];
    }, 1600);
  }, []);

  useEffect(() => {
    startAmbient();
    return () => stopAmbient();
  }, [startAmbient, stopAmbient]);

  useEffect(() => {
    if (muted) {
      gainRef.current?.gain.setValueAtTime(0, audioCtxRef.current?.currentTime ?? 0);
    } else {
      gainRef.current?.gain.linearRampToValueAtTime(0.06, (audioCtxRef.current?.currentTime ?? 0) + 0.5);
    }
  }, [muted]);
}

export function playClick() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch { /* ignore */ }
}

export function playMagic() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.7);
    });
  } catch { /* ignore */ }
}

export { getSound };
