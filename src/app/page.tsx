'use client';

import { useState, useRef, useCallback } from 'react';
import Welcome from '@/components/Welcome';
import TrainingQuestion from '@/components/TrainingQuestion';
import Instructions from '@/components/Instructions';
import GetReady from '@/components/GetReady';
import TappingGame from '@/components/TappingGame';
import Transition from '@/components/Transition';
import ThankYou from '@/components/ThankYou';
import { supabase } from '@/lib/supabase';
import type { Condition, TrialData, GamePhase } from '@/lib/types';

const PRACTICE_DURATION = 10_000; // 10 seconds
const REAL_DURATION = 30_000; // 30 seconds

function randomBpm(): number {
  return Math.floor(Math.random() * 41) + 80; // 80–120 inclusive
}

export default function Home() {
  // ── State ──────────────────────────────────────────────────────
  const [phase, setPhase] = useState<GamePhase>('welcome');
  const [musicalTraining, setMusicalTraining] = useState(false);
  const [conditionOrder, setConditionOrder] = useState<Condition[]>([
    'visual',
    'auditory',
  ]);
  const [bpms, setBpms] = useState({ visual: 100, auditory: 100 });
  const [currentRound, setCurrentRound] = useState(0); // 0 or 1
  const [isPractice, setIsPractice] = useState(true);

  // Refs for values needed inside async callbacks
  const participantIdRef = useRef<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const conditionOrderRef = useRef(conditionOrder);
  const bpmsRef = useRef(bpms);

  // Keep refs in sync
  conditionOrderRef.current = conditionOrder;
  bpmsRef.current = bpms;

  // Derived
  const currentCondition = conditionOrder[currentRound];
  const currentBpm = bpms[currentCondition];

  // ── Handlers ───────────────────────────────────────────────────

  /** Welcome → Training question */
  const handleStart = useCallback(() => {
    // Create AudioContext (requires user gesture)
    audioContextRef.current = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();

    // Randomise condition order
    const order: Condition[] =
      Math.random() < 0.5
        ? ['visual', 'auditory']
        : ['auditory', 'visual'];
    setConditionOrder(order);
    conditionOrderRef.current = order;

    // Random BPMs for each condition
    const newBpms = { visual: randomBpm(), auditory: randomBpm() };
    setBpms(newBpms);
    bpmsRef.current = newBpms;

    setPhase('training');
  }, []);

  /** Training question → Instructions */
  const handleTrainingAnswer = useCallback((hasTraining: boolean) => {
    setMusicalTraining(hasTraining);
    setPhase('instructions');
  }, []);

  /** Instructions → Get Ready (first practice). Also creates participant in Supabase. */
  const handleInstructionsComplete = useCallback(async () => {
    // Proceed immediately
    setCurrentRound(0);
    setIsPractice(true);
    setPhase('tapping');

    // Create participant record in background
    if (supabase) {
      try {
        const { data } = await supabase
          .from('participants')
          .insert({
            musical_training: musicalTraining,
            condition_order: `${conditionOrderRef.current[0]}_first`,
            user_agent: navigator.userAgent,
          })
          .select('id')
          .single();

        if (data) {
          participantIdRef.current = data.id;
        }
      } catch (e) {
        console.error('Failed to create participant:', e);
      }
    }
  }, [musicalTraining]);

  /** Countdown done → Start tapping */
  const handleCountdownComplete = useCallback(() => {
    setPhase('tapping');
  }, []);

  /** Save trial to Supabase (fire-and-forget) */
  const saveTrial = useCallback(async (trialData: TrialData) => {
    if (!supabase || !participantIdRef.current) return;
    try {
      await supabase.from('trials').insert({
        participant_id: participantIdRef.current,
        condition: trialData.condition,
        is_practice: trialData.isPractice,
        bpm: trialData.bpm,
        beat_timestamps: trialData.beatTimestamps,
        tap_timestamps: trialData.tapTimestamps,
        duration_ms: trialData.durationMs,
      });
    } catch (e) {
      console.error('Failed to save trial:', e);
    }
  }, []);

  /** Tapping round ended */
  const handleTrialComplete = useCallback(
    (trialData: TrialData) => {
      // Save to Supabase
      saveTrial(trialData);

      if (isPractice) {
        // Practice ended → show "practice done" screen
        setPhase('practice-done');
      } else if (currentRound === 0) {
        // Real round 1 ended → transition to round 2
        setPhase('transition');
      } else {
        // Real round 2 ended → done!
        setPhase('thank-you');
      }
    },
    [isPractice, currentRound, saveTrial],
  );

  /** Practice done → Get ready for real round */
  const handlePracticeDone = useCallback(() => {
    setIsPractice(false);
    setPhase('tapping');
  }, []);

  /** Round 1 complete → Get ready for round 2 practice */
  const handleTransition = useCallback(() => {
    setCurrentRound(1);
    setIsPractice(true);
    setPhase('tapping');
  }, []);

  // ── Render ─────────────────────────────────────────────────────
  return (
    <main className="h-[100dvh] w-full overflow-hidden relative z-10">
      {phase === 'welcome' && <Welcome onStart={handleStart} />}

      {phase === 'training' && (
        <TrainingQuestion onAnswer={handleTrainingAnswer} />
      )}

      {phase === 'instructions' && (
        <Instructions onContinue={handleInstructionsComplete} />
      )}

      {phase === 'get-ready' && (
        <GetReady
          key={`ready-${currentRound}-${isPractice}`}
          condition={currentCondition}
          roundNumber={currentRound + 1}
          isPractice={isPractice}
          onCountdownComplete={handleCountdownComplete}
        />
      )}

      {phase === 'tapping' && (
        <TappingGame
          key={`tap-${currentRound}-${isPractice}`}
          condition={currentCondition}
          bpm={currentBpm}
          isPractice={isPractice}
          duration={isPractice ? PRACTICE_DURATION : REAL_DURATION}
          audioContext={audioContextRef.current}
          onComplete={handleTrialComplete}
        />
      )}

      {phase === 'practice-done' && (
        <Transition
          type="practice-done"
          roundNumber={currentRound + 1}
          onContinue={handlePracticeDone}
        />
      )}

      {phase === 'transition' && (
        <Transition
          type="round-complete"
          roundNumber={1}
          onContinue={handleTransition}
        />
      )}

      {phase === 'thank-you' && <ThankYou />}
    </main>
  );
}
