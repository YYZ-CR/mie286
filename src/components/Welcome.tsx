'use client';

import { IconWaveform, IconPlay } from './Icons';

interface WelcomeProps {
  onStart: () => void;
}

export default function Welcome({ onStart }: WelcomeProps) {
  return (
    <div className="fade-in flex flex-col items-center justify-center h-full px-6">
      {/* Ambient glow blobs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/[0.04] blur-[120px] top-[-10%] left-[-20%] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/[0.03] blur-[100px] bottom-[-5%] right-[-15%] pointer-events-none" />

      {/* Logo */}
      <div className="mb-4 text-center z-10">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/[0.06] flex items-center justify-center">
            <IconWaveform className="text-purple-400" size={20} />
          </div>
        </div>
        <h1 className="text-5xl sm:text-6xl font-black logo-glow bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent tracking-tight leading-tight">
          RhythmTap
        </h1>
        <p className="mt-3 text-slate-500 text-sm tracking-[0.15em] uppercase font-medium">
          Test your rhythm. Tap to the beat.
        </p>
      </div>

      {/* Decorative animated ring */}
      <div className="relative my-14 z-10">
        <div className="absolute inset-0 w-40 h-40 rounded-full bg-purple-500/[0.06] animate-ping-slow" />
        <div className="absolute inset-[-12px] w-[184px] h-[184px] rounded-full border border-purple-500/[0.08] animate-spin-slow" />
        <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] shadow-[0_0_80px_rgba(168,85,247,0.08)] flex items-center justify-center backdrop-blur-sm">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/[0.08] to-cyan-500/[0.05] border border-white/[0.04] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400/30 to-cyan-400/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="btn-primary group z-10 flex items-center gap-3 px-12 py-4 rounded-2xl text-[15px] font-semibold tracking-wide"
      >
        <span>START</span>
        <IconPlay className="w-4 h-4 transition-transform group-hover:translate-x-0.5" size={16} />
      </button>

      <p className="mt-10 text-[10px] text-slate-700 text-center z-10 tracking-[0.12em] uppercase">
        MIE286 Research Study — Rhythm Synchronization
      </p>
    </div>
  );
}
