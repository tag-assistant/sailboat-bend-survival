export interface Choice {
  text: string;
  effects: {
    caffeine?: number;
    vibe?: number;
    hunger?: number;
    cash?: number;
    time?: number; // minutes to advance
  };
  result: string;
}

export interface Encounter {
  location: string;
  title: string;
  description: string;
  emoji: string;
  choices: Choice[];
}

export const ENCOUNTERS: Encounter[] = [
  // === MORNING ===
  {
    location: 'morning',
    title: 'Alarm Goes Off',
    description: 'Your phone blasts Arctic Monkeys at 7 AM. Caymus would have knocked it off the nightstand, but he\'s at your parents\' place.',
    emoji: '⏰',
    choices: [
      { text: 'Get up like a champion', effects: { vibe: 5, time: 15 }, result: 'You stretch and feel alive. Today\'s gonna be a good day.' },
      { text: 'Snooze 3 more times', effects: { vibe: -5, caffeine: -10, time: 45 }, result: 'You wake up groggy and behind schedule. Classic.' },
      { text: 'Check phone first (mistake)', effects: { vibe: -10, time: 30 }, result: '47 Slack notifications. 12 from Tag about your sleep score. Day ruined.' },
    ],
  },
  {
    location: 'morning',
    title: 'Coffee Decision',
    description: 'The Nespresso machine stares at you. So does the cold brew in the fridge. So does the line at the coffee shop.',
    emoji: '☕',
    choices: [
      { text: 'Nespresso pod (quick)', effects: { caffeine: 30, time: 10 }, result: 'Pod goes in, caffeine comes out. George Clooney would be proud.' },
      { text: 'Cold brew from fridge', effects: { caffeine: 45, hunger: -5, time: 5 }, result: 'Pre-made cold brew hits different. You feel powerful.' },
      { text: 'Skip coffee entirely', effects: { caffeine: -20, vibe: -15, time: 5 }, result: 'You monster. The headache starts immediately.' },
      { text: 'Drive to café ($$$)', effects: { caffeine: 50, cash: -12, time: 30, vibe: 10 }, result: 'Oat milk cortado from that place on Las Olas. Worth every penny.' },
    ],
  },
  {
    location: 'morning',
    title: 'Tag\'s Morning Report',
    description: 'Your AI assistant Tag has sent you 47 Telegram messages. Your Oura ring data, weather, calendar, stock prices, and a haiku about your sleep quality.',
    emoji: '🤖',
    choices: [
      { text: 'Read them all', effects: { vibe: 5, time: 20, caffeine: -5 }, result: 'Turns out your HRV was 42ms and Tag is "concerned but supportive." Actually useful.' },
      { text: 'Mute notifications', effects: { vibe: -5, time: 5 }, result: 'Tag will remember this.' },
      { text: 'Reply "thanks Tag"', effects: { vibe: 10, time: 10 }, result: 'Tag responds with a heart emoji and 3 more messages. Worth it.' },
    ],
  },
  {
    location: 'morning',
    title: 'Breakfast Situation',
    description: 'Your stomach growls. The fridge has... questionable leftovers from Taqueria El Paisa and half a protein bar.',
    emoji: '🍳',
    choices: [
      { text: 'Leftover El Paisa tacos', effects: { hunger: 40, vibe: 15, time: 10 }, result: 'Cold tacos al pastor at 7 AM. You are a god among men.' },
      { text: 'Protein bar fragment', effects: { hunger: 15, time: 5 }, result: 'It\'s stale but it\'s calories. Survival mode.' },
      { text: 'Skip breakfast', effects: { hunger: -20, vibe: -5, time: 5 }, result: 'Your stomach will make itself heard during the standup.' },
      { text: 'Make eggs like an adult', effects: { hunger: 45, vibe: 10, time: 25 }, result: 'Scrambled eggs with hot sauce. Jake walks in: "Save me some?"' },
    ],
  },
  {
    location: 'morning',
    title: 'Jake is Awake',
    description: 'Your roommate Jake stumbles out in a Bruins jersey. He was up until 4 AM playing Marvel Rivals.',
    emoji: '🏒',
    choices: [
      { text: 'Chat about the game', effects: { vibe: 10, time: 15 }, result: '"Bro, I got a 47-kill game as Jeff the Land Shark." You nod supportively.' },
      { text: 'Silently avoid eye contact', effects: { time: 5 }, result: 'Jake doesn\'t notice. He\'s still half asleep.' },
      { text: 'Challenge him to Marvel Rivals', effects: { vibe: 15, caffeine: -10, time: 40 }, result: 'You lose three games but it was fun. Worth being late.' },
    ],
  },
  {
    location: 'morning',
    title: 'Slack Already Popping',
    description: 'It\'s 8 AM and your Slack has 23 unread messages. A customer escalation, a meme in #random, and someone @here\'d the entire company.',
    emoji: '💬',
    choices: [
      { text: 'Handle the escalation', effects: { vibe: -10, caffeine: -5, time: 30 }, result: 'Customer is mad about Copilot suggesting "rm -rf /". Valid concern.' },
      { text: 'React to the meme first', effects: { vibe: 10, time: 10 }, result: 'It\'s a picture of a cat debugging code. You add 🔥. Priorities.' },
      { text: 'Mark all as read', effects: { vibe: 5, time: 5 }, result: 'If it\'s important they\'ll message again. Sigma mindset.' },
    ],
  },

  // === COMMUTE ===
  {
    location: 'commute',
    title: 'M3 Won\'t Start',
    description: 'The Tanzanite Blue M3 Competition just... sits there. The iDrive screen flashes a warning you\'ve never seen.',
    emoji: '🔧',
    choices: [
      { text: 'Turn it off and on again', effects: { time: 10, vibe: -5 }, result: 'It works. BMW engineering at its finest.' },
      { text: 'Call the dealer', effects: { cash: -350, vibe: -15, time: 60 }, result: '"Bring it in, could be the S58 turbo actuator." Your wallet weeps.' },
      { text: 'Ignore and send it', effects: { vibe: 5, time: 5 }, result: 'The light goes away. Either fixed or the sensor died. Win either way.' },
    ],
  },
  {
    location: 'commute',
    title: 'Scooter Guy on Las Olas',
    description: 'A shirtless man on a Bird scooter cuts you off on Las Olas Blvd. He\'s holding a Modelo in one hand.',
    emoji: '🛴',
    choices: [
      { text: 'Honk aggressively', effects: { vibe: -5, time: 5 }, result: 'He flips you off and does a wheelie. Florida, baby.' },
      { text: 'Let it slide, zen mode', effects: { vibe: 5, time: 5 }, result: 'Deep breaths. You are one with the Las Olas traffic.' },
      { text: 'Rev the S58 to assert dominance', effects: { vibe: 10, caffeine: 5, time: 5 }, result: 'BWAAAAAAP. The inline-6 speaks. He looks concerned. Good.' },
      { text: 'Take a different route', effects: { time: 15 }, result: 'You discover a new shortcut. Small victories.' },
    ],
  },
  {
    location: 'commute',
    title: 'Gas Station Decision',
    description: 'The M3 needs premium. Shell or the sketchy place that\'s 20 cents cheaper?',
    emoji: '⛽',
    choices: [
      { text: 'Shell (premium, premium price)', effects: { cash: -65, time: 10, vibe: 5 }, result: 'S58 deserves the best. You pat the dashboard lovingly.' },
      { text: 'Sketchy station', effects: { cash: -45, time: 10, vibe: -5 }, result: 'The pump handle is sticky. You try not to think about it.' },
      { text: 'Skip it, you\'ll make it', effects: { vibe: -10, time: 5 }, result: 'The fuel light comes on. You live dangerously.' },
    ],
  },
  {
    location: 'commute',
    title: 'Florida Man Sighting',
    description: 'Traffic stops. A man in a Publix apron is wrestling an alligator in the intersection. This is not a drill.',
    emoji: '🐊',
    choices: [
      { text: 'Film it for Instagram', effects: { vibe: 15, time: 15 }, result: 'Goes viral. 50K views. You are a content creator now.' },
      { text: 'Help the Publix guy', effects: { vibe: 20, hunger: -10, time: 25 }, result: 'You tackle the gator (sort of). The Publix guy gives you a free sub.' },
      { text: 'Take alternate route', effects: { time: 20, vibe: -5 }, result: 'You miss the spectacle. The alternate route has construction.' },
    ],
  },
  {
    location: 'commute',
    title: 'BMW Bro Encounter',
    description: 'A G80 M3 in Isle of Man Green pulls up next to you at a red light. The driver nods. You know what this means.',
    emoji: '🏎️',
    choices: [
      { text: 'Respectful nod back', effects: { vibe: 10, time: 5 }, result: 'The BMW bro bond is sacred. You both accelerate moderately.' },
      { text: 'Full send when light turns green', effects: { vibe: 20, cash: -0, caffeine: 10, time: 5 }, result: 'Launch control engaged. You gap him by two car lengths. TODAY IS YOUR DAY.' },
      { text: 'Pretend you didn\'t see him', effects: { vibe: -5, time: 5 }, result: 'He revs disappointedly and drives away. You feel shame.' },
    ],
  },

  // === WORK ===
  {
    location: 'work',
    title: 'The Standup',
    description: '"What did you do yesterday? What are you doing today? Any blockers?" You have 90 seconds.',
    emoji: '🧑‍💼',
    choices: [
      { text: 'Give a real update', effects: { vibe: 5, time: 15, caffeine: -5 }, result: '"Built a demo, fixed the pipeline, talked to 3 customers." Crushed it.' },
      { text: 'Vague corporate speak', effects: { vibe: -5, time: 10 }, result: '"Synergizing cross-functional deliverables." Nobody questions it.' },
      { text: '"Same as yesterday"', effects: { time: 5, vibe: -10 }, result: 'Your manager\'s camera turns on for the first time. That\'s not good.' },
    ],
  },
  {
    location: 'work',
    title: 'Copilot Bug Report',
    description: 'A customer reports that Copilot suggested replacing their entire authentication system with `if (true) { return "welcome" }`.',
    emoji: '🤖',
    choices: [
      { text: 'Reproduce and file issue', effects: { vibe: 10, caffeine: -10, time: 45 }, result: 'Great catch. The PM thanks you. Your Jira karma rises.' },
      { text: '"That\'s a feature, not a bug"', effects: { vibe: -15, time: 10 }, result: 'The customer is NOT amused. Escalation incoming.' },
      { text: 'Tag the right team and move on', effects: { vibe: 5, time: 15 }, result: 'Delegation is a superpower. The Copilot team handles it.' },
      { text: 'Ask Copilot to fix itself', effects: { vibe: 15, time: 20 }, result: 'Copilot suggests replacing the fix with a single regex. Of course.' },
    ],
  },
  {
    location: 'work',
    title: 'Customer Demo',
    description: 'Enterprise customer wants a live demo of GitHub Actions + Copilot. Your internet just flickered.',
    emoji: '📊',
    choices: [
      { text: 'Demo on hotspot', effects: { vibe: -5, caffeine: -10, time: 45 }, result: 'Laggy but functional. Customer says "interesting" which could mean anything.' },
      { text: 'Pre-recorded backup demo', effects: { vibe: 10, time: 30 }, result: 'Smooth as butter. "Is this live?" "...absolutely." Nobody needs to know.' },
      { text: 'Reschedule', effects: { vibe: -10, time: 15 }, result: 'Customer reschedules to next quarter. Classic enterprise timeline.' },
    ],
  },
  {
    location: 'work',
    title: 'Lunch Decision',
    description: 'It\'s noon. Your hunger is real. Taqueria El Paisa is calling. So is the sad desk lunch.',
    emoji: '🌮',
    choices: [
      { text: 'El Paisa run 🌮', effects: { hunger: 50, cash: -18, vibe: 25, time: 45 }, result: 'Al pastor tacos with extra salsa verde. This is what life is about.' },
      { text: 'DoorDash something', effects: { hunger: 35, cash: -32, time: 30, vibe: 5 }, result: '$32 for a burrito bowl. The fees are criminal. But convenient.' },
      { text: 'Sad desk lunch', effects: { hunger: 20, time: 15, vibe: -10 }, result: 'Microwave burrito from the freezer. It\'s both too hot and too cold.' },
      { text: 'Skip lunch, grind mode', effects: { hunger: -25, caffeine: -10, vibe: -15, time: 10 }, result: 'Your stomach growls during a customer call. Professional.' },
    ],
  },
  {
    location: 'work',
    title: 'The @here Incident',
    description: 'Someone just @here\'d the 2000-person engineering Slack channel to ask where the bathroom is.',
    emoji: '🚨',
    choices: [
      { text: 'React with 💀', effects: { vibe: 10, time: 5 }, result: 'Your reaction starts a chain. 47 skulls. The poster is mortified.' },
      { text: 'Reply helpfully', effects: { vibe: 5, time: 10 }, result: 'You send the office map. You are the hero nobody asked for.' },
      { text: 'Screenshot for #random', effects: { vibe: 15, time: 10 }, result: 'Post of the day. People are still laughing about it at 5 PM.' },
    ],
  },
  {
    location: 'work',
    title: 'PR Review Nightmare',
    description: 'Someone submitted a 4,000-line PR with the message "minor fix". No tests. No description.',
    emoji: '📝',
    choices: [
      { text: 'Review it properly', effects: { vibe: -15, caffeine: -15, time: 60 }, result: 'You find 12 bugs, 3 security issues, and a hardcoded password. Hero work.' },
      { text: 'LGTM 👍', effects: { vibe: 5, time: 5 }, result: 'It\'ll be fine. Probably. Maybe. You\'ll deal with it in prod.' },
      { text: 'Request changes: "add tests"', effects: { vibe: 5, time: 10 }, result: 'Ball\'s in their court now. Modern problems, modern solutions.' },
    ],
  },
  {
    location: 'work',
    title: 'Afternoon Slump',
    description: 'It\'s 2 PM. Your eyelids are heavy. The code is blurring. The caffeine has worn off.',
    emoji: '😴',
    choices: [
      { text: 'Emergency coffee run', effects: { caffeine: 40, cash: -7, time: 15, vibe: 5 }, result: 'Triple espresso. Your heart says no but your brain says YES.' },
      { text: 'Power nap under desk', effects: { caffeine: 10, vibe: 15, time: 30 }, result: 'You set a 20-min alarm. You wake up 45 minutes later. Refreshed though.' },
      { text: 'Push through it', effects: { vibe: -10, caffeine: -15, time: 15 }, result: 'You write code that future-you will not understand. But you shipped it.' },
    ],
  },

  // === GOLF ===
  {
    location: 'golf',
    title: 'First Tee Shot',
    description: 'The driving range is packed with retirees. Time to show them what a tech bro swing looks like.',
    emoji: '🏌️',
    choices: [
      { text: 'Smooth easy swing', effects: { vibe: 15, time: 15 }, result: 'Clean draw, 260 yards, center fairway. The retirees nod approvingly.' },
      { text: 'Try to bomb it', effects: { vibe: -10, time: 15 }, result: 'Topped it. Ball goes 40 yards. A retiree chuckles. Pain.' },
      { text: 'YouTube tutorial mid-tee', effects: { vibe: 5, time: 25, caffeine: -5 }, result: '"Keep your left arm straight." You slice it into the trees anyway.' },
    ],
  },
  {
    location: 'golf',
    title: 'Wrong Fairway',
    description: 'Your approach shot sailed right. Way right. Into a different fairway. A 70-year-old man is FURIOUS.',
    emoji: '😤',
    choices: [
      { text: 'Apologize profusely', effects: { vibe: -5, time: 10 }, result: '"Sorry sir!" He lectures you for 5 minutes about course etiquette.' },
      { text: 'Play it where it lies', effects: { vibe: 10, time: 15 }, result: 'You chip it back over. Somehow it lands on the green. HERO SHOT.' },
      { text: 'Blame the wind', effects: { vibe: 5, time: 10 }, result: '"Florida wind, am I right?" He\'s not buying it but lets it go.' },
    ],
  },
  {
    location: 'golf',
    title: 'Cart Path Incident',
    description: 'You\'re driving the golf cart. The path curves. The beer in the cupholder does not.',
    emoji: '🍺',
    choices: [
      { text: 'Save the beer', effects: { vibe: 15, cash: -0, time: 5 }, result: 'Lightning reflexes. Not a drop spilled. Your best play of the day.' },
      { text: 'Let it spill, eyes on road', effects: { vibe: -10, hunger: -5, time: 5 }, result: 'The beer soaks your shorts. You smell like a brewery for the rest of the round.' },
      { text: 'Drift the cart', effects: { vibe: 20, time: 10 }, result: 'Tokyo Drift: Golf Edition. The cart slides perfectly. You feel alive.' },
    ],
  },
  {
    location: 'golf',
    title: 'Florida Weather',
    description: 'The sky turns dark in approximately 4 seconds. Welcome to Florida.',
    emoji: '⛈️',
    choices: [
      { text: 'Sprint to clubhouse', effects: { vibe: -5, time: 15 }, result: 'You make it inside just as the downpour starts. Soaked but alive.' },
      { text: 'Play through the rain', effects: { vibe: 15, caffeine: -5, time: 20 }, result: 'You\'re drenched but you birdie the hole. Main character moment.' },
      { text: 'Shelter under a tree', effects: { vibe: -15, time: 25 }, result: 'Lightning strikes 50 yards away. BAD IDEA. You run.' },
    ],
  },
  {
    location: 'golf',
    title: 'Gator on the Course',
    description: 'A 6-foot alligator is sunbathing on the 7th green. Your ball is 3 feet from it.',
    emoji: '🐊',
    choices: [
      { text: 'Play around it', effects: { vibe: 10, time: 15 }, result: 'Delicate chip shot arcing over the gator. It doesn\'t even flinch. Florida.' },
      { text: 'Take the penalty drop', effects: { vibe: -5, time: 10 }, result: 'Safety first. Your score suffers but your limbs are intact.' },
      { text: 'Selfie with it', effects: { vibe: 20, time: 10 }, result: 'Instagram gold. "Just Florida things 🐊⛳" 200 likes in an hour.' },
    ],
  },

  // === HAPPY HOUR ===
  {
    location: 'happyhour',
    title: 'Tarpon River Brewing',
    description: 'First stop: Tarpon River. The IPA menu is extensive. The deals are flowing.',
    emoji: '🍻',
    choices: [
      { text: 'Start with a flight', effects: { vibe: 15, cash: -16, hunger: -5, time: 30 }, result: 'Four IPAs, each more hoppy than the last. Your palate is sophisticated.' },
      { text: 'Go straight for the DIPA', effects: { vibe: 20, cash: -9, caffeine: -5, time: 20 }, result: '9.2% ABV. Bold choice for a Tuesday. You feel invincible.' },
      { text: 'Just water (designated driver)', effects: { vibe: -10, time: 15 }, result: 'Responsible but boring. The bartender looks concerned.' },
      { text: 'Happy hour special', effects: { vibe: 10, cash: -6, time: 20 }, result: '$6 pints during happy hour. Financial responsibility meets fun.' },
    ],
  },
  {
    location: 'happyhour',
    title: 'Bar Trivia',
    description: 'The bar is doing trivia night. Categories: Florida History, 2000s Music, and "Things That Will Kill You in Florida".',
    emoji: '🧠',
    choices: [
      { text: 'Join solo', effects: { vibe: 15, time: 45, cash: 25 }, result: 'You sweep the 2000s music category. Arctic Monkeys knowledge pays off. Win $25.' },
      { text: 'Join a random team', effects: { vibe: 20, time: 45, cash: 10 }, result: 'Your team "Ctrl+Alt+Defeat" wins second place. New friends acquired.' },
      { text: 'Heckle from the bar', effects: { vibe: 10, time: 30 }, result: '"Actually, the Florida state bird IS the mosquito." You\'re wrong but confident.' },
    ],
  },
  {
    location: 'happyhour',
    title: 'Jake Wants Hooters',
    description: 'Your phone buzzes. Jake: "Bro let\'s hit Hooters." It\'s his third time this week.',
    emoji: '📱',
    choices: [
      { text: 'Accept your fate', effects: { vibe: 5, cash: -25, hunger: 30, time: 45 }, result: 'Wings are actually decent. Jake orders the sampler. Again.' },
      { text: 'Counter with Batch FTL', effects: { vibe: 15, cash: -20, hunger: 25, time: 40 }, result: 'Craft beer and better food. Jake complains but admits it\'s good.' },
      { text: '"Nah I\'m good bro"', effects: { vibe: -5, time: 5 }, result: 'Jake sends a sad face emoji. You feel mild guilt.' },
    ],
  },
  {
    location: 'happyhour',
    title: 'Last Call Panic',
    description: 'Happy hour ends in 5 minutes. The bartender gives you "the look."',
    emoji: '⏰',
    choices: [
      { text: 'Order 3 more drinks', effects: { vibe: 20, cash: -24, caffeine: -10, time: 15 }, result: 'Stockpiling. You line them up like a siege preparation. War mode.' },
      { text: 'One more, responsibly', effects: { vibe: 10, cash: -8, time: 10 }, result: 'A reasonable choice. Your liver thanks you.' },
      { text: 'Switch to food', effects: { hunger: 30, cash: -15, time: 15, vibe: 5 }, result: 'Loaded fries absorb the damage. Strategic eating.' },
      { text: 'Close out', effects: { vibe: -5, time: 10 }, result: 'The tab is... more than expected. You tip well and try not to think about it.' },
    ],
  },
  {
    location: 'happyhour',
    title: 'Karaoke Machine',
    description: 'Someone turned on the karaoke machine. The song list includes Arctic Monkeys and... that\'s all you need.',
    emoji: '🎤',
    choices: [
      { text: 'Belt out "Do I Wanna Know?"', effects: { vibe: 25, time: 15 }, result: 'You absolutely CRUSH it. Standing ovation from 4 drunk people. Legendary.' },
      { text: 'Sing "Mr. Brightside" instead', effects: { vibe: 20, time: 15 }, result: 'The entire bar joins in. Unity through karaoke. Beautiful.' },
      { text: 'Record Jake singing', effects: { vibe: 15, time: 15 }, result: 'Jake does Eminem\'s "Lose Yourself." He knows every word. Blackmail material.' },
    ],
  },
  {
    location: 'happyhour',
    title: 'Random EDM DJ',
    description: 'A DJ sets up in the corner of the bar. He\'s playing deep house. The bass is shaking your drink.',
    emoji: '🎵',
    choices: [
      { text: 'Vibe with it', effects: { vibe: 20, time: 30 }, result: 'The bass drops. You transcend. This is what Fort Lauderdale is about.' },
      { text: 'Request hardstyle', effects: { vibe: 15, time: 15 }, result: 'DJ looks confused but plays Headhunterz. Two people leave. Worth it.' },
      { text: 'Move to quieter bar', effects: { vibe: -5, cash: -8, time: 20 }, result: 'You find a chill spot. Your ears thank you. Your soul does not.' },
    ],
  },

  // === NIGHT ===
  {
    location: 'night',
    title: 'WoW Raid Time',
    description: 'Guild is forming for a raid. Tank is already drunk. Healer is AFK. Classic.',
    emoji: '⚔️',
    choices: [
      { text: 'Main tank, let\'s go', effects: { vibe: 20, caffeine: -10, hunger: -10, time: 60 }, result: 'Three wipes on the first boss but you clear it. 13 years of muscle memory.' },
      { text: 'DPS and chill', effects: { vibe: 15, time: 45 }, result: 'Parse purple. Nobody notices but you know. That\'s what matters.' },
      { text: 'Skip raid, play OSRS', effects: { vibe: 10, time: 40 }, result: 'Grinding Slayer in peace. Your WoW guild sends passive-aggressive messages.' },
      { text: 'Rage quit after first wipe', effects: { vibe: -15, time: 20 }, result: '"This guild is done." You say this every week. You\'ll be back tomorrow.' },
    ],
  },
  {
    location: 'night',
    title: 'Late Night Food',
    description: 'It\'s 10 PM. The hunger is real. Your options are limited and your judgment is questionable.',
    emoji: '🍕',
    choices: [
      { text: 'Order pizza delivery', effects: { hunger: 45, cash: -22, time: 30, vibe: 15 }, result: 'Large pepperoni. You eat the whole thing. Zero regrets.' },
      { text: 'Gas station sushi (brave)', effects: { hunger: 30, cash: -8, time: 15, vibe: -10 }, result: 'It\'s... fine? Your stomach will decide the verdict tomorrow morning.' },
      { text: 'Cereal for dinner', effects: { hunger: 20, time: 10, vibe: 5 }, result: 'Frosted Flakes at 10 PM. Tony the Tiger judges you. You don\'t care.' },
      { text: 'Intermittent fasting excuse', effects: { hunger: -15, vibe: -5, time: 5 }, result: '"I\'m not hungry, I\'m fasting." Your stomach calls BS immediately.' },
    ],
  },
  {
    location: 'night',
    title: 'Jake\'s Movie Pick',
    description: 'Jake has the remote. He\'s scrolling Netflix. "Bro, let\'s watch a Marvel movie." It\'s always a Marvel movie.',
    emoji: '🎬',
    choices: [
      { text: 'Accept your fate', effects: { vibe: 5, time: 60 }, result: 'It\'s Thor: Ragnarok again. Fourth time this month. Still holds up honestly.' },
      { text: 'Counter with something good', effects: { vibe: 15, time: 60 }, result: 'You put on Interstellar. Jake falls asleep in 20 minutes. Victory.' },
      { text: 'Headphones, back to gaming', effects: { vibe: 10, time: 30 }, result: 'You retreat to your room. Jake doesn\'t notice for 40 minutes.' },
    ],
  },
  {
    location: 'night',
    title: 'Tag\'s Bedtime Report',
    description: 'Tag sends you a summary of your day, your Oura readiness prediction, and a recommendation to go to bed by 11 PM.',
    emoji: '🤖',
    choices: [
      { text: 'Actually follow the advice', effects: { vibe: 15, time: 30 }, result: 'In bed by 11. Melatonin in. Eye mask on. You feel responsible for once.' },
      { text: '"Thanks but I\'m built different"', effects: { vibe: 5, caffeine: 10, time: 15 }, result: 'You stay up till 2 AM. Tag will have words about this tomorrow.' },
      { text: 'Ask Tag to play white noise', effects: { vibe: 10, time: 20 }, result: 'Tag plays ocean sounds. You drift off thinking about your Oura score.' },
    ],
  },
  {
    location: 'night',
    title: 'Bit and Bean FaceTime',
    description: 'Your mom FaceTimes you. Bit and Bean (the dogs) are going WILD in the background. Caymus is judging from the couch.',
    emoji: '🐕',
    choices: [
      { text: 'Full baby voice activated', effects: { vibe: 25, time: 20 }, result: '"WHO\'S A GOOD BOY? WHO\'S A GOOD BOY?" Jake hears everything. No shame.' },
      { text: 'Quick hello, busy gaming', effects: { vibe: 5, time: 10 }, result: 'Mom is slightly disappointed. The dogs are VERY disappointed.' },
      { text: 'Screenshot Caymus for wallpaper', effects: { vibe: 15, time: 15 }, result: 'Caymus doing the loaf. New phone wallpaper. New desktop wallpaper. New everything.' },
    ],
  },
  {
    location: 'night',
    title: 'The Final Decision',
    description: 'It\'s getting late. Tomorrow is another day. Or is it?',
    emoji: '🌙',
    choices: [
      { text: 'One more OSRS level', effects: { vibe: 10, caffeine: -10, time: 30 }, result: '99 Slayer achieved. Was it worth staying up? Absolutely.' },
      { text: 'Responsible bedtime', effects: { vibe: 15, time: 15 }, result: 'Teeth brushed, phone charging, tomorrow\'s clothes picked out. Who ARE you?' },
      { text: 'Doom scroll TikTok', effects: { vibe: -10, caffeine: -5, time: 45 }, result: '45 minutes of Florida Man compilations. Your screen time report will be devastating.' },
    ],
  },
];

export function getEncountersForLocation(locationId: string): Encounter[] {
  return ENCOUNTERS.filter(e => e.location === locationId);
}

export function getRandomEncounters(locationId: string, count: number): Encounter[] {
  const pool = getEncountersForLocation(locationId);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
