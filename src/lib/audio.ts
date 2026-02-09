/**
 * Web Audio API utility for generating precise 1kHz, 10ms click sounds.
 * Uses the audio hardware clock for timing accuracy independent of JS main thread.
 */

export function playClick(audioContext: AudioContext, time?: number) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 1000; // 1 kHz
  oscillator.type = 'sine';

  const t = time ?? audioContext.currentTime;

  // Sharp attack, 10ms duration
  gainNode.gain.setValueAtTime(0.5, t);
  gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.01);

  oscillator.start(t);
  oscillator.stop(t + 0.015); // small buffer past the gain ramp
}
