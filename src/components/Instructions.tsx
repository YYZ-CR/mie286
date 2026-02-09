'use client';

import { IconEye, IconVolume, IconStar, IconArrowRight } from './Icons';

interface InstructionsProps {
  onContinue: () => void;
}

export default function Instructions({ onContinue }: InstructionsProps) {
  return (
    <div className="fade-in flex flex-col items-center justify-center h-full px-6">
      <div className="w-full max-w-sm">
        <div className="card p-8">
          <h2 className="text-[22px] font-bold text-white text-center mb-7 tracking-tight">
            How to Play
          </h2>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 step-number">1</div>
              <div>
                <p className="text-white text-[14px] font-medium mb-0.5">
                  Follow the beat
                </p>
                <p className="text-slate-500 text-[13px] leading-relaxed">
                  A beat will play or flash — tap the circle in sync with it.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 step-number">2</div>
              <div>
                <p className="text-white text-[14px] font-medium mb-0.5">
                  Two rounds
                </p>
                <p className="text-slate-500 text-[13px] leading-relaxed flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-purple-400">
                    <IconEye size={13} /> Visual
                  </span>
                  <span className="text-slate-600">&amp;</span>
                  <span className="inline-flex items-center gap-1 text-cyan-400">
                    <IconVolume size={13} /> Audio
                  </span>
                  — different beat types.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 step-number">3</div>
              <div>
                <p className="text-white text-[14px] font-medium mb-0.5">
                  30 seconds each
                </p>
                <p className="text-slate-500 text-[13px] leading-relaxed">
                  Timer starts from your first tap.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-500/[0.08] border border-amber-500/15 flex items-center justify-center">
                <IconStar className="text-amber-400" size={12} />
              </div>
              <div>
                <p className="text-white text-[14px] font-medium mb-0.5">
                  Practice first
                </p>
                <p className="text-slate-500 text-[13px] leading-relaxed">
                  A short warm-up before each real round.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="btn-primary group w-full mt-8 py-4 rounded-xl text-[15px] font-semibold tracking-wide flex items-center justify-center gap-2"
          >
            <span>CONTINUE</span>
            <IconArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
