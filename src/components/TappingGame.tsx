'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { playClick } from '@/lib/audio';
import { IconEye, IconVolume } from './Icons';
import type { TrialData, Condition } from '@/lib/types';

interface TappingGameProps {
  condition: Condition;
  bpm: number;
  isPractice: boolean;
  duration: number;
  audioContext: AudioContext | null;
  onComplete: (data: TrialData) => void;
}

export default function TappingGame({
  condition,
  bpm,
  isPractice,
  duration,
  audioContext,
  onComplete,
}: TappingGameProps) {
  const [tapCount, setTapCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [started, setStarted] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [countdown, setCountdown] = useState(3); // 3, 2, 1, 0 (0 = ready)

  const circleRef = useRef<HTMLDivElement>(null);
  const beatStartTimeRef = useRef(0);
  const firstTapTimeRef = useRef<number | null>(null);
  const tapTimestampsRef = useRef<number[]>([]);
  const beatTimestampsRef = useRef<number[]>([]);
  const animFrameRef = useRef(0);
  const completedRef = useRef(false);
  const countdownRef = useRef(countdown);
  const onCompleteRef = useRef(onComplete);
  const audioContextRef = useRef(audioContext);

  onCompleteRef.current = onComplete;
  audioContextRef.current = audioContext;
  countdownRef.current = countdown;

  const beatInterval = 60000 / bpm;
  const isVisual = condition === 'visual';

  // ── Beat scheduler & game loop ───────────────────────────────────
  useEffect(() => {
    // Reset on mount (critical for React Strict Mode which re-runs effects)
    completedRef.current = false;
    firstTapTimeRef.current = null;
    tapTimestampsRef.current = [];
    beatTimestampsRef.current = [];

    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const startTime = performance.now();
    beatStartTimeRef.current = startTime;

    let nextBeatTime = 0;
    const audioCtxStart = audioContext?.currentTime ?? 0;

    const loop = () => {
      if (completedRef.current) return;

      const elapsed = performance.now() - startTime;

      while (nextBeatTime <= elapsed + 25) {
        beatTimestampsRef.current.push(nextBeatTime);

        if (condition === 'visual') {
          // Use state-driven flash for reliability
          setIsFlashing(true);
          setTimeout(() => setIsFlashing(false), 150);
        }

        if (condition === 'auditory' && audioContext) {
          const audioTime = audioCtxStart + nextBeatTime / 1000;
          const safeTime = Math.max(audioTime, audioContext.currentTime + 0.002);
          playClick(audioContext, safeTime);
        }

        nextBeatTime += beatInterval;
      }

      if (firstTapTimeRef.current !== null) {
        const sinceFirstTap = elapsed - firstTapTimeRef.current;
        const remaining = Math.max(0, duration - sinceFirstTap);
        setTimeRemaining(remaining);

        if (sinceFirstTap >= duration) {
          completedRef.current = true;
          onCompleteRef.current({
            condition,
            isPractice,
            bpm,
            beatTimestamps: [...beatTimestampsRef.current],
            tapTimestamps: [...tapTimestampsRef.current],
            durationMs: sinceFirstTap,
          });
          return;
        }
      }

      if (elapsed > 60000 && firstTapTimeRef.current === null) {
        completedRef.current = true;
        onCompleteRef.current({
          condition,
          isPractice,
          bpm,
          beatTimestamps: [...beatTimestampsRef.current],
          tapTimestamps: [],
          durationMs: 0,
        });
        return;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      completedRef.current = true;
      cancelAnimationFrame(animFrameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Countdown timer (3 → 2 → 1 → go) ────────────────────────────
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ── Tap handler — uses native DOM event for max reliability ──────
  const processedRef = useRef(0);

  const registerTap = useCallback((clientX: number, clientY: number) => {
    // Deduplicate: ignore taps within 30ms of each other
    const now = Date.now();
    if (now - processedRef.current < 30) return;
    processedRef.current = now;

    if (completedRef.current) return;
    if (countdownRef.current > 0) return; // ignore taps during countdown

    // Resume AudioContext if browser suspended it
    const ctx = audioContextRef.current;
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }

    const ts = performance.now() - beatStartTimeRef.current;

    if (firstTapTimeRef.current === null) {
      firstTapTimeRef.current = ts;
      setStarted(true);
    }

    tapTimestampsRef.current.push(ts);
    setTapCount((prev) => prev + 1);

    if (navigator.vibrate) navigator.vibrate(8);
  }, []);

  // Attach native DOM listeners for maximum compatibility
  useEffect(() => {
    const el = document.getElementById('tap-zone');
    if (!el) return;

    const onMouse = (e: MouseEvent) => {
      if (e.button !== 0) return;
      registerTap(e.clientX, e.clientY);
    };

    const onTouch = (e: TouchEvent) => {
      e.preventDefault(); // prevent double-fire
      const t = e.touches[0] || e.changedTouches[0];
      if (t) registerTap(t.clientX, t.clientY);
    };

    el.addEventListener('mousedown', onMouse);
    el.addEventListener('touchstart', onTouch, { passive: false });

    return () => {
      el.removeEventListener('mousedown', onMouse);
      el.removeEventListener('touchstart', onTouch);
    };
  }, [registerTap]);

  // ── Render ───────────────────────────────────────────────────────
  const progress = started ? ((duration - timeRemaining) / duration) * 100 : 0;

  return (
    <div
      id="tap-zone"
      className="relative flex flex-col items-center justify-between h-full py-6 px-4 select-none"
      style={{ touchAction: 'none', cursor: 'pointer' }}
    >
      {/* ── Header ── */}
      <div className="w-full max-w-sm z-10">
        {isPractice && (
          <div className="text-center mb-3">
            <span className="badge badge-amber text-[9px]">Practice</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              background: isVisual
                ? 'linear-gradient(90deg, #a855f7, #c084fc)'
                : 'linear-gradient(90deg, #06b6d4, #67e8f9)',
            }}
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-[0.15em]">
            {isVisual ? <IconEye size={11} /> : <IconVolume size={11} />}
            {isVisual ? 'Visual' : 'Audio'}
          </span>
          <span className="text-[11px] font-mono text-slate-600 tabular-nums">
            {started ? `${Math.ceil(timeRemaining / 1000)}s` : 'Waiting\u2026'}
          </span>
        </div>
      </div>

      {/* ── Tap circle ── */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Circle with state-driven flash */}
        <div className="relative">
          {/* Countdown or hint — absolutely positioned above circle so circle doesn't move */}
          {countdown > 0 ? (
            <div className="absolute bottom-full left-0 right-0 mb-4 flex justify-center">
              <div key={countdown} className="countdown-pop text-center">
                <span className="text-[80px] leading-none font-black tabular-nums bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent drop-shadow-[0_0_60px_rgba(168,85,247,0.4)]">
                  {countdown}
                </span>
                <p className="text-slate-400 text-sm tracking-widest uppercase mt-1">
                  {countdown === 3 ? 'Get ready' : countdown === 2 ? 'Watch the beat' : 'Almost...'}
                </p>
              </div>
            </div>
          ) : !started ? (
            <div className="absolute bottom-full left-0 right-0 mb-6 text-center text-slate-600 text-[13px] tracking-wide animate-pulse">
              Tap anywhere to start
            </div>
          ) : null}
          <div
            className={`absolute inset-[-16px] rounded-full border ${
              isVisual ? 'border-purple-500/[0.08]' : 'border-cyan-500/[0.08]'
            } animate-spin-slow`}
          />
          <div
            ref={circleRef}
            className={`
              w-44 h-44 sm:w-48 sm:h-48 rounded-full
              flex items-center justify-center border
              transition-all duration-100 ease-out
              ${isFlashing
                ? 'bg-purple-500/60 border-purple-400/60 shadow-[0_0_80px_rgba(168,85,247,0.6),0_0_120px_rgba(168,85,247,0.3)] scale-105'
                : isVisual
                  ? 'bg-purple-500/[0.05] border-purple-500/20 shadow-[0_0_60px_rgba(168,85,247,0.08)]'
                  : 'bg-cyan-500/[0.05] border-cyan-500/20 shadow-[0_0_60px_rgba(6,182,212,0.08)]'
              }
            `}
          >
            <div
              className={`w-24 h-24 rounded-full border flex items-center justify-center ${
                isFlashing
                  ? 'border-purple-300/40'
                  : isVisual ? 'border-purple-500/10' : 'border-cyan-500/10'
              }`}
            >
              <span
                className={`text-[13px] font-bold tracking-[0.25em] uppercase ${
                  isFlashing
                    ? 'text-white/60'
                    : isVisual ? 'text-purple-400/30' : 'text-cyan-400/30'
                }`}
              >
                TAP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tap counter ── */}
      <div className="text-center pb-2 z-10">
        <div
          className={`text-5xl font-black tabular-nums transition-colors duration-200 ${
            started ? 'text-white' : 'text-white/20'
          }`}
        >
          {tapCount}
        </div>
        <div className="text-[9px] text-slate-600 uppercase tracking-[0.25em] mt-1 font-semibold">
          taps
        </div>
      </div>
    </div>
  );
}
