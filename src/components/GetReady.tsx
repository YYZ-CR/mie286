'use client';

import { useState, useEffect, useCallback } from 'react';
import { IconEye, IconVolume } from './Icons';
import type { Condition } from '@/lib/types';

interface GetReadyProps {
  condition: Condition;
  roundNumber: number;
  isPractice: boolean;
  onCountdownComplete: () => void;
}

export default function GetReady({
  condition,
  roundNumber,
  isPractice,
  onCountdownComplete,
}: GetReadyProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  const onComplete = useCallback(onCountdownComplete, [onCountdownComplete]);

  useEffect(() => {
    const infoTimer = setTimeout(() => {
      setShowInfo(false);
      setCountdown(3);
    }, 2500);
    return () => clearTimeout(infoTimer);
  }, []);

  useEffect(() => {
    if (countdown === null || showInfo) return;
    if (countdown === 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 800);
    return () => clearTimeout(timer);
  }, [countdown, showInfo, onComplete]);

  const isVisual = condition === 'visual';

  return (
    <div className="fade-in flex flex-col items-center justify-center h-full px-6">
      {showInfo ? (
        <div className="text-center fade-in">
          {/* Label */}
          <div className="mb-5">
            {isPractice ? (
              <span className="badge badge-amber">Practice</span>
            ) : (
              <span className="badge badge-purple">Round {roundNumber}</span>
            )}
          </div>

          {/* Icon */}
          <div className={`icon-box mx-auto mb-6 ${isVisual ? 'icon-box-purple' : 'icon-box-cyan'}`}>
            {isVisual ? (
              <IconEye className="text-purple-400" size={28} />
            ) : (
              <IconVolume className="text-cyan-400" size={28} />
            )}
          </div>

          {/* Text */}
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
            {isVisual ? 'Watch the Flash' : 'Listen to the Beat'}
          </h2>
          <p className="text-slate-500 text-[15px] max-w-[260px] mx-auto leading-relaxed">
            {isVisual
              ? 'The circle will flash — tap along with it'
              : 'A click will play — tap along with it'}
          </p>
        </div>
      ) : (
        <div key={countdown} className="countdown-pop">
          <span className="text-[120px] font-black tabular-nums bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent drop-shadow-[0_0_60px_rgba(168,85,247,0.3)]">
            {countdown}
          </span>
        </div>
      )}
    </div>
  );
}
