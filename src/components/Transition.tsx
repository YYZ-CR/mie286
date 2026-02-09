'use client';

import { IconTarget, IconCheckCircle, IconArrowRight } from './Icons';

interface TransitionProps {
  type: 'practice-done' | 'round-complete';
  roundNumber: number;
  onContinue: () => void;
}

export default function Transition({ type, roundNumber, onContinue }: TransitionProps) {
  const isPracticeDone = type === 'practice-done';

  return (
    <div className="fade-in flex flex-col items-center justify-center h-full px-6">
      <div className="w-full max-w-sm text-center">
        <div className={`icon-box mx-auto mb-6 ${isPracticeDone ? 'icon-box-amber' : 'icon-box-green'}`}>
          {isPracticeDone ? (
            <IconTarget className="text-amber-400" size={28} />
          ) : (
            <IconCheckCircle className="text-emerald-400" size={28} />
          )}
        </div>

        {isPracticeDone ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Practice Complete
            </h2>
            <p className="text-slate-500 text-[15px] mb-8 leading-relaxed max-w-[280px] mx-auto">
              Nice work. Ready for the real round?
              <br />
              <span className="text-purple-400 font-medium">This one counts — 30 seconds.</span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Round {roundNumber} Complete
            </h2>
            <p className="text-slate-500 text-[15px] mb-8 leading-relaxed max-w-[280px] mx-auto">
              Great job. Get ready for Round 2.
              <br />
              <span className="text-cyan-400 font-medium">
                Different beat type this time.
              </span>
            </p>
          </>
        )}

        <button
          onClick={onContinue}
          className="btn-primary group inline-flex items-center gap-2 px-12 py-4 rounded-xl text-[15px] font-semibold tracking-wide"
        >
          <span>CONTINUE</span>
          <IconArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" size={16} />
        </button>
      </div>
    </div>
  );
}
