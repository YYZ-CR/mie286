'use client';

import { useEffect, useState } from 'react';
import { IconTrophy, IconWaveform } from './Icons';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

const COLORS = ['#a855f7', '#c084fc', '#06b6d4', '#67e8f9', '#818cf8'];

export default function ThankYou() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
        color: COLORS[i % COLORS.length],
      })),
    );
  }, []);

  return (
    <div className="fade-in flex flex-col items-center justify-center h-full px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/[0.05] blur-[120px] top-[-10%] right-[-20%] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/[0.04] blur-[100px] bottom-[-10%] left-[-20%] pointer-events-none" />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            animation: `sparkle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      <div className="text-center z-10">
        <div className="icon-box icon-box-purple mx-auto mb-8 w-20 h-20">
          <IconTrophy className="text-purple-400" size={36} />
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
          Thanks for participating
        </h2>
        <p className="text-slate-500 text-[15px] max-w-[260px] mx-auto leading-relaxed">
          Your tap data has been recorded successfully.
        </p>

        <div className="mt-12 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/[0.04]">
          <IconWaveform className="text-slate-600" size={14} />
          <span className="text-[10px] text-slate-600 tracking-[0.15em] uppercase font-medium">
            RhythmTap — MIE286 Study
          </span>
        </div>
      </div>
    </div>
  );
}
