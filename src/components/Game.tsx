'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, INITIAL_STATE, formatTime, clamp, saveHighScore } from '@/lib/gameState';
import { LOCATIONS } from '@/data/locations';
import { Choice, getRandomEncounters, Encounter as EncounterType } from '@/data/encounters';
import { playClick, playGood, playBad, playGameOver, playVictory, playTransition } from '@/lib/audio';
import ResourceBar from './ResourceBar';
import Encounter from './Encounter';
import TitleScreen from './TitleScreen';
import GameOver from './GameOver';
import Victory from './Victory';

function getLocationIndex(time: number): number {
  for (let i = LOCATIONS.length - 1; i >= 0; i--) {
    if (time >= LOCATIONS[i].timeRange[0]) return i;
  }
  return 0;
}

export default function Game() {
  const [state, setState] = useState<GameState>({ ...INITIAL_STATE });
  const [encounters, setEncounters] = useState<EncounterType[]>([]);
  const [currentEncounter, setCurrentEncounter] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [encounterVisible, setEncounterVisible] = useState(true);
  const [flash, setFlash] = useState<Record<string, 'good' | 'bad' | null>>({});
  const [transitioning, setTransitioning] = useState(false);
  const [locationName, setLocationName] = useState('');
  const prevLocationRef = useRef(0);

  // Generate encounters for a location
  const generateEncounters = useCallback((locIndex: number) => {
    const loc = LOCATIONS[locIndex];
    const count = locIndex === 2 ? 4 : locIndex === 4 ? 3 : 2; // more encounters at work/happy hour
    const encs = getRandomEncounters(loc.id, count);
    setEncounters(encs);
    setCurrentEncounter(0);
    setResult(null);
    setEncounterVisible(true);
  }, []);

  const startGame = useCallback(() => {
    playClick();
    const newState = { ...INITIAL_STATE, screen: 'playing' as const };
    setState(newState);
    generateEncounters(0);
    prevLocationRef.current = 0;
  }, [generateEncounters]);

  const handleChoice = useCallback((choice: Choice) => {
    playClick();
    
    setState(prev => {
      const e = choice.effects;
      const newVibe = clamp((prev.vibe) + (e.vibe || 0));
      const newCaffeine = clamp(prev.caffeine + (e.caffeine || 0));
      const newHunger = clamp(prev.hunger + (e.hunger || 0));
      const newCash = Math.max(0, prev.cash + (e.cash || 0));
      const newTime = prev.time + (e.time || 15);
      
      // Flash effects
      const newFlash: Record<string, 'good' | 'bad' | null> = {};
      if (e.vibe) newFlash.vibe = e.vibe > 0 ? 'good' : 'bad';
      if (e.caffeine) newFlash.caffeine = e.caffeine > 0 ? 'good' : 'bad';
      if (e.hunger) newFlash.hunger = e.hunger > 0 ? 'good' : 'bad';
      if (e.cash) newFlash.cash = e.cash > 0 ? 'good' : 'bad';
      setFlash(newFlash);

      // Sound effects
      if (e.vibe && e.vibe > 10) playGood();
      else if (e.vibe && e.vibe < -10) playBad();

      // Shake on bad
      const shake = (e.vibe !== undefined && e.vibe < -5);

      // Check game over
      if (newVibe <= 0) {
        playGameOver();
        saveHighScore({
          vibe: 0, cash: newCash, time: formatTime(newTime),
          encounters: prev.encountersCompleted + 1, won: false, date: new Date().toISOString(),
        });
        return {
          ...prev, vibe: 0, caffeine: newCaffeine, hunger: newHunger,
          cash: newCash, time: newTime, screen: 'gameover' as const,
          encountersCompleted: prev.encountersCompleted + 1,
          shakeScreen: shake,
        };
      }

      // Check victory
      if (newTime >= 1440) {
        playVictory();
        saveHighScore({
          vibe: newVibe, cash: newCash, time: 'Midnight',
          encounters: prev.encountersCompleted + 1, won: true, date: new Date().toISOString(),
        });
        return {
          ...prev, vibe: newVibe, caffeine: newCaffeine, hunger: newHunger,
          cash: newCash, time: 1440, screen: 'victory' as const,
          encountersCompleted: prev.encountersCompleted + 1,
        };
      }

      return {
        ...prev, vibe: newVibe, caffeine: newCaffeine, hunger: newHunger,
        cash: newCash, time: newTime, shakeScreen: shake,
        encountersCompleted: prev.encountersCompleted + 1,
      };
    });

    setResult(choice.result);
  }, []);

  // Advance to next encounter or location
  const handleContinue = useCallback(() => {
    playClick();
    setResult(null);
    setFlash({});

    const nextEnc = currentEncounter + 1;
    const newLocIndex = getLocationIndex(state.time);

    // Check if we need a location transition
    if (newLocIndex !== prevLocationRef.current) {
      setTransitioning(true);
      setLocationName(LOCATIONS[newLocIndex].name);
      playTransition();
      prevLocationRef.current = newLocIndex;
      
      setTimeout(() => {
        generateEncounters(newLocIndex);
        setTransitioning(false);
      }, 1500);
      return;
    }

    if (nextEnc < encounters.length) {
      setEncounterVisible(false);
      setTimeout(() => {
        setCurrentEncounter(nextEnc);
        setEncounterVisible(true);
      }, 300);
    } else {
      // Generate more encounters for current location
      generateEncounters(newLocIndex);
    }
  }, [currentEncounter, encounters.length, state.time, generateEncounters]);

  // Clear shake
  useEffect(() => {
    if (state.shakeScreen) {
      const t = setTimeout(() => setState(p => ({ ...p, shakeScreen: false })), 500);
      return () => clearTimeout(t);
    }
  }, [state.shakeScreen]);

  // Clear flash
  useEffect(() => {
    if (Object.keys(flash).length > 0) {
      const t = setTimeout(() => setFlash({}), 700);
      return () => clearTimeout(t);
    }
  }, [flash]);

  if (state.screen === 'title') return <TitleScreen onStart={startGame} />;
  if (state.screen === 'gameover') return (
    <GameOver vibe={0} cash={state.cash} time={formatTime(state.time)}
      encounters={state.encountersCompleted} deathMessage={state.deathMessage}
      onRestart={() => setState({ ...INITIAL_STATE })} />
  );
  if (state.screen === 'victory') return (
    <Victory vibe={state.vibe} cash={state.cash}
      encounters={state.encountersCompleted}
      onRestart={() => setState({ ...INITIAL_STATE })} />
  );

  const loc = LOCATIONS[getLocationIndex(state.time)];
  const enc = encounters[currentEncounter];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${loc.bgClass} text-white transition-all duration-1000 ${state.shakeScreen ? 'animate-shake' : ''}`}>
      {/* Location transition overlay */}
      {transitioning && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <div className="text-5xl mb-4">{LOCATIONS[getLocationIndex(state.time)].emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-2">{locationName}</h2>
            <p className="text-gray-400">{formatTime(state.time)}</p>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto p-4 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{loc.emoji}</span>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">{loc.name}</h2>
              <p className="text-xs text-gray-400">{loc.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-mono font-bold text-amber-400">{formatTime(state.time)}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              {state.encountersCompleted} encounters
            </div>
          </div>
        </div>

        {/* Time progress bar */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700 rounded-full"
            style={{ width: `${((state.time - 420) / (1440 - 420)) * 100}%` }}
          />
        </div>

        {/* Resources */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6 bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-gray-800">
          <ResourceBar label="Caffeine" emoji="☕" value={state.caffeine} max={100} color="bg-amber-500" flash={flash.caffeine || null} />
          <ResourceBar label="Vibe" emoji="🎵" value={state.vibe} max={100} color="bg-purple-500" flash={flash.vibe || null} />
          <ResourceBar label="Hunger" emoji="🍕" value={state.hunger} max={100} color="bg-orange-500" flash={flash.hunger || null} />
          <ResourceBar label="Cash" emoji="💰" value={state.cash} max={300} color="bg-green-500" isCash flash={flash.cash || null} />
        </div>

        {/* Low resource warnings */}
        {state.vibe <= 20 && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-2 mb-4 text-center text-sm text-red-300 animate-pulse">
            ⚠️ Vibe critical! One bad choice and it&apos;s over...
          </div>
        )}
        {state.caffeine <= 10 && (
          <div className="bg-amber-900/30 border border-amber-800 rounded-lg p-2 mb-4 text-center text-sm text-amber-300">
            ☕ Running on fumes... need caffeine
          </div>
        )}

        {/* Result display */}
        {result ? (
          <div className="animate-fade-in">
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-5 mb-4 shadow-xl text-center">
              <p className="text-gray-200 text-sm leading-relaxed mb-4">{result}</p>
              <button
                onClick={handleContinue}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl
                  transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Continue →
              </button>
            </div>
          </div>
        ) : enc ? (
          <Encounter
            title={enc.title}
            description={enc.description}
            emoji={enc.emoji}
            choices={enc.choices}
            onChoice={handleChoice}
            visible={encounterVisible}
          />
        ) : null}
      </div>
    </div>
  );
}
