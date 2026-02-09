export type Condition = 'visual' | 'auditory';

export interface TrialData {
  condition: Condition;
  isPractice: boolean;
  bpm: number;
  beatTimestamps: number[];
  tapTimestamps: number[];
  durationMs: number;
}

export type GamePhase =
  | 'welcome'
  | 'training'
  | 'instructions'
  | 'get-ready'
  | 'tapping'
  | 'practice-done'
  | 'transition'
  | 'thank-you';
