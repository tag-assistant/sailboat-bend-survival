'use client';
import { Choice } from '@/data/encounters';

interface Props {
  title: string;
  description: string;
  emoji: string;
  choices: Choice[];
  onChoice: (choice: Choice) => void;
  visible: boolean;
}

function EffectBadge({ label, value }: { label: string; value: number }) {
  if (value === 0) return null;
  const isGood = (label === '💰' || label === '☕' || label === '🎵' || label === '🍕') ? value > 0 : value < 0;
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isGood ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
      {label}{value > 0 ? '+' : ''}{value}
    </span>
  );
}

export default function Encounter({ title, description, emoji, choices, onChoice, visible }: Props) {
  return (
    <div className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Encounter card */}
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-5 mb-4 shadow-xl">
        <div className="text-4xl text-center mb-3">{emoji}</div>
        <h3 className="text-xl font-bold text-white text-center mb-2">{title}</h3>
        <p className="text-gray-300 text-sm text-center leading-relaxed">{description}</p>
      </div>

      {/* Choices */}
      <div className="space-y-2.5">
        {choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => onChoice(choice)}
            className="w-full text-left bg-gray-800/70 hover:bg-gray-700/80 border border-gray-600 hover:border-amber-500/50 
              rounded-xl p-4 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
              group"
          >
            <div className="text-white text-sm font-medium group-hover:text-amber-300 transition-colors">
              {choice.text}
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {choice.effects.caffeine && <EffectBadge label="☕" value={choice.effects.caffeine} />}
              {choice.effects.vibe && <EffectBadge label="🎵" value={choice.effects.vibe} />}
              {choice.effects.hunger && <EffectBadge label="🍕" value={choice.effects.hunger} />}
              {choice.effects.cash && <EffectBadge label="💰" value={choice.effects.cash} />}
              {choice.effects.time && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-400 font-mono">
                  ⏰+{choice.effects.time}m
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
