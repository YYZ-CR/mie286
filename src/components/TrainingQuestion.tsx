'use client';

import { IconMusic } from './Icons';

interface TrainingQuestionProps {
  onAnswer: (hasTraining: boolean) => void;
}

export default function TrainingQuestion({ onAnswer }: TrainingQuestionProps) {
  return (
    <div className="fade-in flex flex-col items-center justify-center h-full px-6">
      <div className="w-full max-w-sm">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="icon-box icon-box-purple mx-auto mb-5">
              <IconMusic className="text-purple-400" size={26} />
            </div>
            <h2 className="text-[22px] font-bold text-white mb-3 tracking-tight">
              Quick Question
            </h2>
            <p className="text-slate-400 text-[15px] leading-relaxed">
              Do you have{' '}
              <span className="text-purple-400 font-semibold">5 or more years</span>{' '}
              of musical or vocal training?
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onAnswer(true)}
              className="flex-1 py-4 rounded-xl text-[15px] font-semibold
                bg-white/[0.04] border border-white/[0.08]
                text-white hover:bg-purple-500/15 hover:border-purple-500/30
                active:scale-[0.97] transition-all duration-200"
            >
              Yes
            </button>
            <button
              onClick={() => onAnswer(false)}
              className="flex-1 py-4 rounded-xl text-[15px] font-semibold
                bg-white/[0.04] border border-white/[0.08]
                text-white hover:bg-cyan-500/15 hover:border-cyan-500/30
                active:scale-[0.97] transition-all duration-200"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
