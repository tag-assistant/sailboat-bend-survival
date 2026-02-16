export interface Location {
  id: string;
  name: string;
  emoji: string;
  timeRange: [number, number]; // minutes from midnight
  bgClass: string;
  description: string;
}

export const LOCATIONS: Location[] = [
  {
    id: 'morning',
    name: 'Sailboat Bend Apartment',
    emoji: '🏠',
    timeRange: [420, 540],
    bgClass: 'from-indigo-950 to-orange-900',
    description: 'Your apartment in Sailboat Bend. Coffee machine is calling.',
  },
  {
    id: 'commute',
    name: 'M3 Competition',
    emoji: '🚗',
    timeRange: [540, 600],
    bgClass: 'from-orange-900 to-amber-800',
    description: 'Tanzanite Blue M3 Competition. S58 inline-6 singing on Las Olas.',
  },
  {
    id: 'work',
    name: 'GitHub HQ (Remote)',
    emoji: '💻',
    timeRange: [600, 900],
    bgClass: 'from-slate-900 to-purple-950',
    description: 'Field Solutions Engineering. Demos, Copilot, and Slack fires.',
  },
  {
    id: 'golf',
    name: 'Golf Course',
    emoji: '⛳',
    timeRange: [900, 1020],
    bgClass: 'from-green-950 to-emerald-900',
    description: 'Working on that swing. Florida sun is unforgiving.',
  },
  {
    id: 'happyhour',
    name: 'Happy Hour',
    emoji: '🍺',
    timeRange: [1020, 1200],
    bgClass: 'from-amber-950 to-red-950',
    description: 'Tarpon River Brewing → Batch FTL → Las Olas bar crawl.',
  },
  {
    id: 'night',
    name: 'Home — Night Mode',
    emoji: '🌙',
    timeRange: [1200, 1440],
    bgClass: 'from-gray-950 to-indigo-950',
    description: 'WoW raids, OSRS grinding, and roommate chaos with Jake.',
  },
];
