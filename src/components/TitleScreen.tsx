'use client';

interface Props {
  onStart: () => void;
}

export default function TitleScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950 text-white p-4 relative overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Skyline silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
        <svg viewBox="0 0 800 120" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,120 L0,80 L30,80 L30,60 L50,60 L50,40 L70,40 L70,60 L90,60 L90,80 L120,80 L120,50 L140,50 L140,30 L160,30 L160,50 L180,50 L180,70 L200,70 L200,45 L210,45 L210,25 L230,25 L230,45 L250,45 L250,65 L280,65 L280,55 L300,55 L300,35 L320,35 L320,55 L340,55 L340,75 L370,75 L370,40 L380,40 L380,20 L400,20 L400,40 L420,40 L420,60 L450,60 L450,50 L470,50 L470,30 L490,30 L490,50 L510,50 L510,70 L540,70 L540,45 L560,45 L560,25 L580,25 L580,45 L600,45 L600,65 L630,65 L630,55 L660,55 L660,35 L680,35 L680,55 L700,55 L700,75 L730,75 L730,60 L750,60 L750,40 L770,40 L770,60 L800,60 L800,120 Z" fill="currentColor" className="text-indigo-400" />
          <path d="M0,120 L0,100 L100,100 L100,90 L150,90 L150,95 L250,95 L250,85 L300,85 L300,95 L400,95 L400,88 L500,88 L500,95 L600,95 L600,92 L700,92 L700,98 L800,98 L800,120 Z" fill="currentColor" className="text-indigo-300" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md mx-auto animate-fade-in">
        {/* Title */}
        <div className="text-center">
          <div className="text-5xl mb-3">⛵</div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent tracking-tight">
            SAILBOAT BEND
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-300 tracking-widest mt-1">
            SURVIVAL
          </h2>
          <div className="mt-3 w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 text-center text-sm max-w-xs leading-relaxed">
          Survive one day as a Fort Lauderdale tech bro. Navigate coffee, Copilot bugs, Florida Man, and happy hour. 
          Make it to midnight with your <span className="text-purple-400">Vibe</span> intact.
        </p>

        {/* Stats preview */}
        <div className="grid grid-cols-4 gap-3 text-center text-xs">
          <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700">
            <div className="text-lg">☕</div>
            <div className="text-gray-400">Caffeine</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700">
            <div className="text-lg">🎵</div>
            <div className="text-gray-400">Vibe</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700">
            <div className="text-lg">🍕</div>
            <div className="text-gray-400">Hunger</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700">
            <div className="text-lg">💰</div>
            <div className="text-gray-400">Cash</div>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="mt-4 px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xl rounded-xl 
            hover:from-amber-400 hover:to-orange-500 transform hover:scale-105 active:scale-95
            transition-all duration-200 shadow-lg shadow-amber-500/20 tracking-wide"
        >
          START DAY
        </button>

        <p className="text-gray-600 text-xs">7 AM → Midnight • Survive or Vibe Die</p>
      </div>
    </div>
  );
}
