'use client';

const DEATH_MESSAGES = [
  "Your vibe died faster than your golf ball finding water.",
  "Even Tag couldn't save you from that one.",
  "The M3 is fine though. The M3 is always fine.",
  "Jake sends his condolences from Hooters.",
  "Copilot suggested you try `git revert life`.",
  "Your Oura ring says your stress level is... yes.",
  "Florida Man wins again.",
  "Bit and Bean would be disappointed. Caymus doesn't care.",
  "Your guild will need a new tank.",
  "At least your credit score survived.",
  "The bartender at Tarpon River pours one out for you.",
  "Your LinkedIn still says 'Senior Field Solutions Engineer'. For now.",
];

interface Props {
  vibe: number;
  cash: number;
  time: string;
  encounters: number;
  deathMessage: string;
  onRestart: () => void;
}

export default function GameOver({ cash, time, encounters, deathMessage, onRestart }: Props) {
  const msg = deathMessage || DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)];
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-950 via-gray-950 to-gray-950 text-white p-6 animate-fade-in">
      <div className="max-w-md w-full text-center">
        {/* Skull */}
        <div className="text-7xl mb-4 animate-bounce-slow">💀</div>
        
        <h1 className="text-4xl font-bold text-red-400 mb-2">VIBE CHECK FAILED</h1>
        <p className="text-gray-400 text-lg mb-6 italic">&ldquo;{msg}&rdquo;</p>
        
        {/* Stats */}
        <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-5 mb-6 space-y-3">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Run Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500">Died At</div>
              <div className="text-lg font-bold text-white">{time}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500">Encounters</div>
              <div className="text-lg font-bold text-white">{encounters}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500">Cash Left</div>
              <div className="text-lg font-bold text-green-400">${cash}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500">Vibe</div>
              <div className="text-lg font-bold text-red-400">DEAD</div>
            </div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-lg rounded-xl
            hover:from-red-500 hover:to-orange-500 transform hover:scale-105 active:scale-95
            transition-all duration-200 shadow-lg shadow-red-500/20"
        >
          TRY AGAIN
        </button>
        <p className="text-gray-600 text-xs mt-3">Maybe don&apos;t skip coffee this time</p>
      </div>
    </div>
  );
}
