export interface GameState {
  screen: 'title' | 'playing' | 'gameover' | 'victory';
  caffeine: number;
  vibe: number;
  hunger: number;
  cash: number;
  time: number; // minutes from midnight, 420 = 7AM
  locationIndex: number;
  encounterIndex: number;
  encountersCompleted: number;
  shakeScreen: boolean;
  particles: boolean;
  log: string[];
  deathMessage: string;
}

export const INITIAL_STATE: GameState = {
  screen: 'title',
  caffeine: 30,
  vibe: 70,
  hunger: 40,
  cash: 200,
  time: 420,
  locationIndex: 0,
  encounterIndex: 0,
  encountersCompleted: 0,
  shakeScreen: false,
  particles: false,
  log: [],
  deathMessage: '',
};

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

export interface HighScore {
  vibe: number;
  cash: number;
  time: string;
  encounters: number;
  won: boolean;
  date: string;
}

export function getHighScores(): HighScore[] {
  try {
    return JSON.parse(localStorage.getItem('sbs-highscores') || '[]');
  } catch { return []; }
}

export function saveHighScore(score: HighScore) {
  const scores = getHighScores();
  scores.push(score);
  scores.sort((a, b) => (b.won ? 1 : 0) - (a.won ? 1 : 0) || b.encounters - a.encounters);
  localStorage.setItem('sbs-highscores', JSON.stringify(scores.slice(0, 10)));
}
