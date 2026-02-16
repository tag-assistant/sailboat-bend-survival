'use client';

const WIN_MESSAGES = [
  "You survived Fort Lauderdale. Most impressive.",
  "The M3 is parked. The beer is cold. You made it.",
  "Tag is proud. Your Oura score will be terrible though.",
  "You beat Florida. Florida will be back tomorrow.",
  "Jake is already asking about tomorrow's plans. Run.",
  "Copilot couldn't have written a better day.",
  "Sailboat Bend's finest. Vibe: immaculate.",
];

interface Props {
  vibe: number;
  cash: number;
  encounters: number;
  onRestart: () => void;
}

export default function Victory({ vibe, cash, encounters, onRestart }: Props) {
  const msg = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-950 via-gray-950 to-gray-950 text-white p-6 relative overflow-hidden animate-fade-in">
      {/* Confetti-like particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          >
            {['🎉', '⛵', '🍺', '⛳', '🚗', '✨', '🎵'][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        <div className="text-7xl mb-4">🏆</div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-300 to-emerald-300 bg-clip-text text-transparent mb-2">
          YOU SURVIVED
        </h1>
        <p className="text-lg text-gray-300 mb-1">Made it from 7 AM to Midnight</p>
        <p className="text-gray-400 italic mb-6">&ldquo;{msg}&rdquo;</p>
        
        <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-5 mb-6 space-y-3">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Final Stats</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500">Vibe</div>
              <div className="text-lg font-bold text-purple-400">{vibe}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500">Cash</div>
              <div className="text-lg font-bold text-green-400">${cash}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500">Encounters</div>
              <div className="text-lg font-bold text-white">{encounters}</div>
            </div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-emerald-500 text-white font-bold text-lg rounded-xl
            hover:from-amber-400 hover:to-emerald-400 transform hover:scale-105 active:scale-95
            transition-all duration-200 shadow-lg shadow-emerald-500/20"
        >
          PLAY AGAIN
        </button>
        <p className="text-gray-600 text-xs mt-3">Every run is different 🎲</p>
      </div>
    </div>
  );
}
