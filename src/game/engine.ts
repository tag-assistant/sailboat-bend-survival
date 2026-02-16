import * as THREE from "three";

// ============================================================
// TYPES
// ============================================================
interface Zombie {
  mesh: THREE.Group;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  isBoss: boolean;
  attackCooldown: number;
  deathTimer: number | null;
  spawnTimer: number;
  bodyParts: { body: THREE.Mesh; head: THREE.Mesh; armL: THREE.Mesh; armR: THREE.Mesh; legL: THREE.Mesh; legR: THREE.Mesh };
}

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
}

interface GameState {
  hp: number;
  maxHp: number;
  wave: number;
  kills: number;
  startTime: number;
  zombiesRemaining: number;
  waveActive: boolean;
  waveDelay: number;
  paused: boolean;
  gameOver: boolean;
  started: boolean;
  attackCooldown: number;
  hitFlash: number;
  shakeIntensity: number;
  regenTimer: number;
}

// ============================================================
// AUDIO SYSTEM (Web Audio API - procedural sounds)
// ============================================================
class AudioSystem {
  ctx: AudioContext | null = null;
  
  init() {
    this.ctx = new AudioContext();
  }

  ensure() {
    if (!this.ctx) this.init();
    if (this.ctx?.state === "suspended") this.ctx.resume();
  }

  playHit() {
    this.ensure();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + 0.15);
  }

  playAttack() {
    this.ensure();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + 0.2);
  }

  playZombieDeath() {
    this.ensure();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + 0.4);
  }

  playZombieGroan() {
    this.ensure();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80 + Math.random() * 40, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + 0.6);
  }

  playFootstep() {
    this.ensure();
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;
    source.connect(filter).connect(gain).connect(this.ctx.destination);
    source.start();
  }

  playGameOver() {
    this.ensure();
    if (!this.ctx) return;
    const notes = [200, 180, 150, 100];
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, this.ctx!.currentTime + i * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + i * 0.3 + 0.3);
      osc.connect(gain).connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + i * 0.3);
      osc.stop(this.ctx!.currentTime + i * 0.3 + 0.3);
    });
  }

  playWaveStart() {
    this.ensure();
    if (!this.ctx) return;
    const notes = [260, 330, 390, 520];
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + i * 0.12 + 0.2);
      osc.connect(gain).connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + i * 0.12);
      osc.stop(this.ctx!.currentTime + i * 0.12 + 0.2);
    });
  }
}

// ============================================================
// MAIN GAME
// ============================================================
export function startGame(container: HTMLDivElement) {
  const audio = new AudioSystem();

  // --- Three.js Setup ---
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.6;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050510);
  scene.fog = new THREE.FogExp2(0x050510, 0.025);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);

  // --- State ---
  const state: GameState = {
    hp: 100, maxHp: 100, wave: 0, kills: 0, startTime: 0,
    zombiesRemaining: 0, waveActive: false, waveDelay: 0,
    paused: false, gameOver: false, started: false,
    attackCooldown: 0, hitFlash: 0, shakeIntensity: 0, regenTimer: 0 };

  const keys: Record<string, boolean> = {};
  const mouse = { x: 0, y: 0, locked: false };
  let playerYaw = 0;
  const zombies: Zombie[] = [];
  const particles: Particle[] = [];
  let footstepTimer = 0;
  let swordSwingAngle = 0;
  let isAttacking = false;

  // --- HUD ---
  const hud = document.createElement("div");
  hud.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;font-family:'Courier New',monospace;";
  container.appendChild(hud);

  // Vignette overlay
  const vignette = document.createElement("div");
  vignette.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;transition:box-shadow 0.3s;";
  hud.appendChild(vignette);

  // HP Bar
  const hpContainer = document.createElement("div");
  hpContainer.style.cssText = "position:absolute;bottom:40px;left:50%;transform:translateX(-50%);width:300px;height:20px;background:rgba(0,0,0,0.7);border:2px solid #555;border-radius:4px;overflow:hidden;";
  const hpBar = document.createElement("div");
  hpBar.style.cssText = "width:100%;height:100%;background:linear-gradient(90deg,#ff0000,#ff4444);transition:width 0.2s;";
  hpContainer.appendChild(hpBar);
  const hpText = document.createElement("div");
  hpText.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;text-shadow:1px 1px 2px black;";
  hpContainer.appendChild(hpText);
  hud.appendChild(hpContainer);

  // Stats
  const statsDiv = document.createElement("div");
  statsDiv.style.cssText = "position:absolute;top:20px;right:20px;color:#ddd;font-size:14px;text-align:right;text-shadow:1px 1px 3px black;";
  hud.appendChild(statsDiv);

  // Wave announcement
  const waveAnnounce = document.createElement("div");
  waveAnnounce.style.cssText = "position:absolute;top:35%;left:50%;transform:translate(-50%,-50%);color:#ff4444;font-size:48px;font-weight:bold;text-shadow:0 0 20px #ff0000;opacity:0;transition:opacity 0.5s;pointer-events:none;";
  hud.appendChild(waveAnnounce);

  // Crosshair
  const crosshair = document.createElement("div");
  crosshair.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:4px;height:4px;background:rgba(255,255,255,0.6);border-radius:50%;box-shadow:0 0 6px rgba(255,255,255,0.3);";
  hud.appendChild(crosshair);

  // Start screen
  const startScreen = document.createElement("div");
  startScreen.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto;cursor:pointer;";
  startScreen.innerHTML = `
    <div style="color:#ff3333;font-size:48px;font-weight:bold;text-shadow:0 0 30px #ff0000;margin-bottom:10px;letter-spacing:4px;">SAILBOAT BEND</div>
    <div style="color:#ff6666;font-size:28px;text-shadow:0 0 15px #ff0000;margin-bottom:40px;letter-spacing:8px;">SURVIVAL</div>
    <div style="color:#888;font-size:16px;margin-bottom:8px;">WASD to move • Mouse to look • Click to attack</div>
    <div style="color:#888;font-size:16px;margin-bottom:30px;">ESC to pause</div>
    <div style="color:#ff4444;font-size:22px;animation:pulse 1.5s ease-in-out infinite;">CLICK TO BEGIN</div>
    <style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}</style>
  `;
  hud.appendChild(startScreen);

  // Game over screen
  const gameOverScreen = document.createElement("div");
  gameOverScreen.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(20,0,0,0.9);display:none;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto;cursor:pointer;";
  hud.appendChild(gameOverScreen);

  // Pause screen
  const pauseScreen = document.createElement("div");
  pauseScreen.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:none;flex-direction:column;align-items:center;justify-content:center;";
  pauseScreen.innerHTML = `
    <div style="color:white;font-size:48px;font-weight:bold;margin-bottom:30px;">PAUSED</div>
    <div style="color:#aaa;font-size:16px;">WASD — Move</div>
    <div style="color:#aaa;font-size:16px;">Mouse — Look</div>
    <div style="color:#aaa;font-size:16px;">Click — Attack</div>
    <div style="color:#aaa;font-size:16px;margin-top:20px;">ESC — Resume</div>
  `;
  hud.appendChild(pauseScreen);

  // Mobile controls
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  let touchMoveX = 0, touchMoveY = 0, touchLookId: number | null = null;
  let touchMoveId: number | null = null;

  if (isMobile) {
    // Virtual joystick
    const joystickArea = document.createElement("div");
    joystickArea.style.cssText = "position:absolute;bottom:60px;left:40px;width:120px;height:120px;background:rgba(255,255,255,0.1);border:2px solid rgba(255,255,255,0.2);border-radius:50%;pointer-events:auto;";
    const joystickKnob = document.createElement("div");
    joystickKnob.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:40px;height:40px;background:rgba(255,255,255,0.3);border-radius:50%;";
    joystickArea.appendChild(joystickKnob);
    hud.appendChild(joystickArea);

    joystickArea.addEventListener("touchstart", (e) => {
      e.preventDefault();
      touchMoveId = e.changedTouches[0].identifier;
    });
    joystickArea.addEventListener("touchmove", (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchMoveId) {
          const rect = joystickArea.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          touchMoveX = Math.max(-1, Math.min(1, (e.changedTouches[i].clientX - cx) / 50));
          touchMoveY = Math.max(-1, Math.min(1, (e.changedTouches[i].clientY - cy) / 50));
          joystickKnob.style.transform = `translate(calc(-50% + ${touchMoveX * 30}px), calc(-50% + ${touchMoveY * 30}px))`;
        }
      }
    });
    const resetJoystick = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchMoveId) {
          touchMoveX = 0; touchMoveY = 0; touchMoveId = null;
          joystickKnob.style.transform = "translate(-50%, -50%)";
        }
      }
    };
    joystickArea.addEventListener("touchend", resetJoystick);
    joystickArea.addEventListener("touchcancel", resetJoystick);

    // Attack button
    const attackBtn = document.createElement("div");
    attackBtn.style.cssText = "position:absolute;bottom:80px;right:50px;width:80px;height:80px;background:rgba(255,50,50,0.3);border:2px solid rgba(255,50,50,0.5);border-radius:50%;pointer-events:auto;display:flex;align-items:center;justify-content:center;color:#ff4444;font-size:14px;font-weight:bold;";
    attackBtn.textContent = "ATK";
    attackBtn.addEventListener("touchstart", (e) => { e.preventDefault(); performAttack(); });
    hud.appendChild(attackBtn);

    // Look area (right side of screen)
    renderer.domElement.addEventListener("touchstart", (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].clientX > window.innerWidth * 0.4 && touchLookId === null) {
          touchLookId = e.changedTouches[i].identifier;
        }
      }
    });
    renderer.domElement.addEventListener("touchmove", (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchLookId) {
          playerYaw -= e.changedTouches[i].clientX * 0.002;
        }
      }
    });
    renderer.domElement.addEventListener("touchend", (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchLookId) touchLookId = null;
      }
    });
  }

  // --- Build Scene ---

  // Ground
  const groundGeo = new THREE.PlaneGeometry(200, 200);
  const groundMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = false;
  scene.add(ground);

  // Road
  const roadGeo = new THREE.PlaneGeometry(12, 200);
  const roadMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.01;
  scene.add(road);

  // Road markings
  for (let z = -90; z < 90; z += 8) {
    const mark = new THREE.Mesh(
      new THREE.PlaneGeometry(0.3, 3),
      new THREE.MeshBasicMaterial({ color: 0x666600 })
    );
    mark.rotation.x = -Math.PI / 2;
    mark.position.set(0, 0.02, z);
    scene.add(mark);
  }

  // Sidewalks
  [-7, 7].forEach(x => {
    const sidewalk = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.15, 200),
      new THREE.MeshBasicMaterial({ color: 0x333333 })
    );
    sidewalk.position.set(x, 0.075, 0);
    sidewalk.receiveShadow = false;
    scene.add(sidewalk);
  });

  // Ambient light (very dim)
  const ambientLight = new THREE.AmbientLight(0x111122, 0.3);
  scene.add(ambientLight);

  // Moon light
  const moonLight = new THREE.DirectionalLight(0x334466, 0.2);
  moonLight.position.set(50, 80, 30);
  moonLight.castShadow = false;
  scene.add(moonLight);

  // Street lights
  function createStreetLight(x: number, z: number) {
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 5, 8),
      new THREE.MeshBasicMaterial({ color: 0x444444 })
    );
    pole.position.set(x, 2.5, z);
    pole.castShadow = false;
    scene.add(pole);

    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.08, 0.08),
      new THREE.MeshBasicMaterial({ color: 0x444444 })
    );
    arm.position.set(x + (x > 0 ? -0.75 : 0.75), 5, z);
    scene.add(arm);

    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffaa44 })
    );
    bulb.position.set(x + (x > 0 ? -1.5 : 1.5), 4.9, z);
    scene.add(bulb);

    const light = new THREE.PointLight(0xffaa44, 15, 25, 2);
    light.castShadow = false;
    light.position.set(x + (x > 0 ? -1.5 : 1.5), 4.8, z);
    light.castShadow = false;
    scene.add(light);

    // Light cone (volumetric fake)
    const coneGeo = new THREE.ConeGeometry(3, 5, 16, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({ color: 0xffaa44, transparent: true, opacity: 0.03, side: THREE.DoubleSide });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.set(x + (x > 0 ? -1.5 : 1.5), 2.4, z);
    scene.add(cone);
  }

  for (let z = -75; z <= 75; z += 50) {
    createStreetLight(-9, z);
    createStreetLight(9, z);
  }

  // Buildings
  function createBuilding(x: number, z: number, w: number, d: number, h: number) {
    const building = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshBasicMaterial({ color: 0x1a1a2a })
    );
    building.position.set(x, h / 2, z);
    building.castShadow = false;
    building.receiveShadow = false;
    scene.add(building);

    // Windows
    const winMat = new THREE.MeshBasicMaterial({ color: 0x334455 });
    const winLitMat = new THREE.MeshBasicMaterial({ color: 0xffdd88 });
    for (let wy = 1.5; wy < h - 0.5; wy += 2.5) {
      for (let wz = z - d / 2 + 1; wz < z + d / 2; wz += 2.5) {
        const side = x > 0 ? x - w / 2 - 0.01 : x + w / 2 + 0.01;
        const win = new THREE.Mesh(
          new THREE.PlaneGeometry(1, 1.2),
          Math.random() > 0.7 ? winLitMat : winMat
        );
        win.rotation.y = x > 0 ? Math.PI / 2 : -Math.PI / 2;
        win.position.set(side, wy, wz);
        scene.add(win);
      }
    }
  }

  // Left side buildings
  createBuilding(-18, -30, 10, 15, 8);
  createBuilding(-20, 10, 14, 12, 5);
  createBuilding(-16, 45, 8, 18, 10);
  createBuilding(-22, -65, 12, 10, 6);
  createBuilding(-17, 75, 10, 14, 7);

  // Right side buildings
  createBuilding(18, -15, 10, 20, 6);
  createBuilding(20, 30, 14, 15, 9);
  createBuilding(16, 65, 8, 12, 5);
  createBuilding(22, -55, 12, 10, 8);
  createBuilding(19, -80, 10, 14, 7);

  // Palm trees
  function createPalmTree(x: number, z: number) {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.2, 6, 8),
      new THREE.MeshBasicMaterial({ color: 0x4a3520 })
    );
    // Slight lean
    trunk.rotation.z = (Math.random() - 0.5) * 0.2;
    trunk.rotation.x = (Math.random() - 0.5) * 0.1;
    trunk.position.set(x, 3, z);
    trunk.castShadow = false;
    scene.add(trunk);

    // Fronds
    const frondMat = new THREE.MeshBasicMaterial({ color: 0x1a4a1a, side: THREE.DoubleSide });
    for (let i = 0; i < 7; i++) {
      const frond = new THREE.Mesh(
        new THREE.PlaneGeometry(0.6, 3),
        frondMat
      );
      const angle = (i / 7) * Math.PI * 2;
      frond.position.set(x + Math.cos(angle) * 0.8, 6.2, z + Math.sin(angle) * 0.8);
      frond.rotation.set(-0.8, angle, 0);
      scene.add(frond);
    }

    // Coconuts
    const coconutMat = new THREE.MeshBasicMaterial({ color: 0x4a2a0a });
    for (let i = 0; i < 3; i++) {
      const coconut = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), coconutMat);
      const a = Math.random() * Math.PI * 2;
      coconut.position.set(x + Math.cos(a) * 0.2, 5.8, z + Math.sin(a) * 0.2);
      scene.add(coconut);
    }
  }

  const palmPositions = [
    [-10, -40], [-10, 0], [-10, 35], [-10, 70],
    [10, -25], [10, 15], [10, 50], [10, -60],
    [-10, -70], [10, 80],
  ];
  palmPositions.forEach(([x, z]) => createPalmTree(x, z));

  // The M3 (BMW M3 decoration)
  function createM3(x: number, z: number, rot: number) {
    const car = new THREE.Group();

    // Body
    const bodyMat = new THREE.MeshBasicMaterial({ color: 0x1a1a2a });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2, 0.8, 4.5), bodyMat);
    body.position.y = 0.6;
    body.castShadow = false;
    car.add(body);

    // Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.6, 2.2), bodyMat);
    roof.position.set(0, 1.2, -0.3);
    roof.castShadow = false;
    car.add(roof);

    // Windshield
    const glassMat = new THREE.MeshBasicMaterial({ color: 0x445566, transparent: true, opacity: 0.6 });
    const windshield = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.6), glassMat);
    windshield.position.set(0, 1.1, 0.8);
    windshield.rotation.x = -0.3;
    car.add(windshield);

    // Headlights
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffcc });
    [-0.7, 0.7].forEach(xo => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.05), headlightMat);
      hl.position.set(xo, 0.6, 2.28);
      car.add(hl);
    });

    // Taillights
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xff2200 });
    [-0.7, 0.7].forEach(xo => {
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.05), taillightMat);
      tl.position.set(xo, 0.6, -2.28);
      car.add(tl);
    });

    // Wheels
    const wheelMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    [[-0.9, 1.4], [-0.9, -1.4], [0.9, 1.4], [0.9, -1.4]].forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.25, 12), wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, 0.3, wz);
      car.add(wheel);
    });

    // M3 badge glow
    const badge = new THREE.Mesh(
      new THREE.PlaneGeometry(0.3, 0.12),
      new THREE.MeshBasicMaterial({ color: 0x0066ff })
    );
    badge.position.set(0, 0.7, 2.28);
    car.add(badge);

    car.position.set(x, 0, z);
    car.rotation.y = rot;
    scene.add(car);
  }

  createM3(12, -5, 0.1);

  // --- Player ---
  const player = new THREE.Group();
  player.position.set(0, 0, 0);
  scene.add(player);

  // Player body
  const playerBodyMat = new THREE.MeshBasicMaterial({ color: 0x2255aa });
  const playerBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.8, 8, 16), playerBodyMat);
  playerBody.position.y = 1.0;
  playerBody.castShadow = false;
  player.add(playerBody);

  // Player head
  const playerHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xddaa88 })
  );
  playerHead.position.y = 1.7;
  playerHead.castShadow = false;
  player.add(playerHead);

  // Sword
  const sword = new THREE.Group();
  const swordBlade = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 1.0, 0.02),
    new THREE.MeshBasicMaterial({ color: 0xaaaacc })
  );
  swordBlade.position.y = 0.5;
  sword.add(swordBlade);
  const swordHandle = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.25, 0.06),
    new THREE.MeshBasicMaterial({ color: 0x4a2a0a })
  );
  sword.add(swordHandle);
  const swordGuard = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.04, 0.06),
    new THREE.MeshBasicMaterial({ color: 0xccaa44 })
  );
  swordGuard.position.y = 0.12;
  sword.add(swordGuard);
  sword.position.set(0.5, 0.9, 0.3);
  player.add(sword);

  // Player point light
  const playerLight = new THREE.PointLight(0x4488ff, 2, 8, 2);
  playerLight.castShadow = false;
  playerLight.position.y = 1.5;
  player.add(playerLight);

  // --- Zombie Factory ---
  function createZombie(x: number, z: number, wave: number): Zombie {
    const isBoss = wave > 0 && wave % 5 === 0 && zombies.filter(z => z.isBoss).length === 0;
    const scale = isBoss ? 1.8 : 0.8 + Math.random() * 0.5;
    const speed = isBoss ? 2.5 : Math.min(1.5 + wave * 0.15 + Math.random() * 0.5, 5);
    const hp = isBoss ? 50 + wave * 10 : Math.floor(2 + wave * 0.5);
    const damage = isBoss ? 25 : 8 + wave;

    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.scale.setScalar(scale);

    const zombieGreen = 0x2a4a2a;
    const darkGreen = 0x1a3a1a;
    const mat = new THREE.MeshBasicMaterial({ color: isBoss ? 0x4a1a1a : zombieGreen });
    const matDark = new THREE.MeshBasicMaterial({ color: isBoss ? 0x3a0a0a : darkGreen });

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.3), mat);
    body.position.y = 1.1;
    body.castShadow = false;
    group.add(body);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), mat);
    head.position.y = 1.7;
    head.castShadow = false;
    group.add(head);

    // Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000});
    [-0.08, 0.08].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat);
      eye.position.set(ex, 1.75, 0.18);
      group.add(eye);
    });

    // Arms
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.15), matDark);
    armL.position.set(-0.35, 1.05, 0);
    armL.castShadow = false;
    group.add(armL);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.15), matDark);
    armR.position.set(0.35, 1.05, 0);
    armR.castShadow = false;
    group.add(armR);

    // Legs
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.6, 0.18), matDark);
    legL.position.set(-0.12, 0.3, 0);
    legL.castShadow = false;
    group.add(legL);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.6, 0.18), matDark);
    legR.position.set(0.12, 0.3, 0);
    legR.castShadow = false;
    group.add(legR);

    if (isBoss) {
      // Boss crown
      const crown = new THREE.Mesh(
        new THREE.ConeGeometry(0.25, 0.3, 5),
        new THREE.MeshBasicMaterial({ color: 0xffaa00 })
      );
      crown.position.y = 2.0;
      group.add(crown);

      // Boss aura
      const aura = new THREE.PointLight(0xff2200, 5, 10, 2);
      aura.position.y = 1.5;
      group.add(aura);
    }

    scene.add(group);

    return {
      mesh: group, hp, maxHp: hp, speed, damage, isBoss,
      attackCooldown: 0, deathTimer: null, spawnTimer: 0.5,
      bodyParts: { body, head, armL, armR, legL, legR }
    };
  }

  // --- Particles ---
  function spawnParticles(pos: THREE.Vector3, color: number, count: number, speed: number) {
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.08, 0.08),
        new THREE.MeshBasicMaterial({ color, transparent: true })
      );
      mesh.position.copy(pos);
      mesh.position.y += 0.5 + Math.random();
      scene.add(mesh);
      particles.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * speed,
          Math.random() * speed * 0.7,
          (Math.random() - 0.5) * speed
        ),
        life: 0.5 + Math.random() * 0.5 });
    }
  }

  // Spawn burst effect (ground)
  function spawnBurstEffect(pos: THREE.Vector3) {
    spawnParticles(new THREE.Vector3(pos.x, 0, pos.z), 0x443322, 12, 3);
  }

  // --- Wave System ---
  function startWave() {
    state.wave++;
    state.waveActive = true;
    const count = state.wave % 5 === 0 ? 1 + state.wave : 2 + state.wave * 2;
    state.zombiesRemaining = count;

    audio.playWaveStart();
    waveAnnounce.textContent = state.wave % 5 === 0 ? `⚠ BOSS WAVE ${state.wave} ⚠` : `WAVE ${state.wave}`;
    waveAnnounce.style.opacity = "1";
    setTimeout(() => { waveAnnounce.style.opacity = "0"; }, 2000);

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (state.gameOver) return;
        const angle = Math.random() * Math.PI * 2;
        const dist = 25 + Math.random() * 15;
        const z = createZombie(
          player.position.x + Math.cos(angle) * dist,
          player.position.z + Math.sin(angle) * dist,
          state.wave
        );
        zombies.push(z);
        spawnBurstEffect(z.mesh.position);
        if (Math.random() < 0.3) audio.playZombieGroan();
      }, i * 300);
    }
  }

  // --- Combat ---
  function performAttack() {
    if (state.attackCooldown > 0 || state.gameOver || !state.started || state.paused) return;
    isAttacking = true;
    swordSwingAngle = 0;
    state.attackCooldown = 0.4;
    audio.playAttack();

    // Hitbox check
    const attackRange = 2.5;
    const attackAngle = Math.PI / 2; // 90 degree arc
    const playerDir = new THREE.Vector3(-Math.sin(playerYaw), 0, -Math.cos(playerYaw));

    zombies.forEach(z => {
      if (z.deathTimer !== null) return;
      const toZombie = new THREE.Vector3().subVectors(z.mesh.position, player.position);
      toZombie.y = 0;
      const dist = toZombie.length();
      if (dist > attackRange * z.mesh.scale.x) return;
      toZombie.normalize();
      const dot = playerDir.dot(toZombie);
      if (dot > Math.cos(attackAngle / 2)) {
        z.hp -= 1;
        audio.playHit();
        spawnParticles(z.mesh.position, 0x880000, 6, 4);

        // Knockback
        const kb = toZombie.multiplyScalar(0.5);
        z.mesh.position.add(kb);

        if (z.hp <= 0) {
          z.deathTimer = 1.0;
          state.kills++;
          state.zombiesRemaining--;
          audio.playZombieDeath();
          spawnParticles(z.mesh.position, 0x660000, 15, 5);
        }
      }
    });
  }

  // --- Input ---
  window.addEventListener("keydown", (e) => { keys[e.key.toLowerCase()] = true; });
  window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
    if (e.key === "Escape") {
      if (state.gameOver) return;
      if (!state.started) return;
      state.paused = !state.paused;
      pauseScreen.style.display = state.paused ? "flex" : "none";
      if (state.paused) document.exitPointerLock?.();
      else renderer.domElement.requestPointerLock?.();
    }
  });

  // Start game on clicking the start screen
  startScreen.addEventListener("click", () => {
    if (state.started) return;
    state.started = true;
    state.startTime = performance.now();
    startScreen.style.display = "none";
    audio.init();
    if (!isMobile) renderer.domElement.requestPointerLock?.();
    startWave();
  });

  // Restart game on clicking game over screen
  gameOverScreen.addEventListener("click", () => {
    if (!state.gameOver) return;
    restartGame();
  });

  // Canvas click = attack (only during active gameplay)
  renderer.domElement.addEventListener("click", () => {
    if (!state.started || state.gameOver || state.paused) return;
    if (!isMobile) renderer.domElement.requestPointerLock?.();
    performAttack();
  });

  document.addEventListener("pointerlockchange", () => {
    mouse.locked = document.pointerLockElement === renderer.domElement;
  });

  document.addEventListener("mousemove", (e) => {
    if (!mouse.locked) return;
    playerYaw -= e.movementX * 0.003;
  });

  // --- Restart ---
  function restartGame() {
    state.hp = 100; state.wave = 0; state.kills = 0;
    state.startTime = performance.now();
    state.waveActive = false; state.waveDelay = 1;
    state.gameOver = false; state.paused = false;
    state.attackCooldown = 0; state.hitFlash = 0;
    state.shakeIntensity = 0; state.regenTimer = 0;
    player.position.set(0, 0, 0);
    playerYaw = 0;

    // Clear zombies
    zombies.forEach(z => scene.remove(z.mesh));
    zombies.length = 0;

    // Clear particles
    particles.forEach(p => scene.remove(p.mesh));
    particles.length = 0;

    gameOverScreen.style.display = "none";
    if (!isMobile) renderer.domElement.requestPointerLock?.();
    startWave();
  }

  // --- Game Over ---
  function triggerGameOver() {
    state.gameOver = true;
    audio.playGameOver();
    document.exitPointerLock?.();

    const elapsed = (performance.now() - state.startTime) / 1000;
    const minutes = Math.floor(elapsed / 60);
    const seconds = Math.floor(elapsed % 60);

    gameOverScreen.innerHTML = `
      <div style="color:#ff2222;font-size:56px;font-weight:bold;text-shadow:0 0 30px #ff0000;margin-bottom:20px;">YOU DIED</div>
      <div style="color:#cc8888;font-size:24px;margin-bottom:10px;">Survived: ${minutes}:${seconds.toString().padStart(2, "0")}</div>
      <div style="color:#cc8888;font-size:24px;margin-bottom:10px;">Waves: ${state.wave}</div>
      <div style="color:#cc8888;font-size:24px;margin-bottom:30px;">Kills: ${state.kills}</div>
      <div style="color:#ff4444;font-size:20px;animation:pulse 1.5s ease-in-out infinite;">CLICK TO RESTART</div>
      <style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}</style>
    `;
    gameOverScreen.style.display = "flex";
  }

  // --- Game Loop ---
  const clock = new THREE.Clock();

  function update() {
    requestAnimationFrame(update);
    const dt = Math.min(clock.getDelta(), 0.05);

    if (!state.started || state.paused) {
      renderer.render(scene, camera);
      return;
    }

    if (state.gameOver) {
      renderer.render(scene, camera);
      return;
    }

    // --- Player Movement ---
    const moveSpeed = 7;
    let moveX = 0, moveZ = 0;

    if (isMobile) {
      moveX = touchMoveX;
      moveZ = touchMoveY;
    } else {
      if (keys["w"] || keys["arrowup"]) moveZ -= 1;
      if (keys["s"] || keys["arrowdown"]) moveZ += 1;
      if (keys["a"] || keys["arrowleft"]) moveX -= 1;
      if (keys["d"] || keys["arrowright"]) moveX += 1;
    }

    if (moveX !== 0 || moveZ !== 0) {
      const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= len; moveZ /= len;

      const forward = new THREE.Vector3(-Math.sin(playerYaw), 0, -Math.cos(playerYaw));
      const right = new THREE.Vector3(Math.cos(playerYaw), 0, -Math.sin(playerYaw));

      player.position.addScaledVector(forward, -moveZ * moveSpeed * dt);
      player.position.addScaledVector(right, moveX * moveSpeed * dt);

      // Bounds
      player.position.x = Math.max(-90, Math.min(90, player.position.x));
      player.position.z = Math.max(-90, Math.min(90, player.position.z));

      // Footsteps
      footstepTimer -= dt;
      if (footstepTimer <= 0) {
        audio.playFootstep();
        footstepTimer = 0.35;
      }
    }

    player.rotation.y = playerYaw;

    // Sword animation
    if (isAttacking) {
      swordSwingAngle += dt * 15;
      sword.rotation.z = -Math.sin(swordSwingAngle * 2) * 1.5;
      sword.rotation.x = Math.sin(swordSwingAngle) * 0.5;
      if (swordSwingAngle > Math.PI) {
        isAttacking = false;
        sword.rotation.set(0, 0, 0);
      }
    }

    state.attackCooldown = Math.max(0, state.attackCooldown - dt);

    // Slow regen
    state.regenTimer += dt;
    if (state.regenTimer > 5) {
      state.hp = Math.min(state.maxHp, state.hp + 1);
      state.regenTimer = 0;
    }

    // --- Zombies ---
    let groanTimer = Math.random();
    zombies.forEach((z, i) => {
      // Spawn animation
      if (z.spawnTimer > 0) {
        z.spawnTimer -= dt;
        z.mesh.position.y = -2 * z.spawnTimer;
        return;
      }
      z.mesh.position.y = 0;

      // Death
      if (z.deathTimer !== null) {
        z.deathTimer -= dt;
        z.mesh.rotation.x = (1 - z.deathTimer) * Math.PI / 2;
        z.mesh.position.y = -z.deathTimer * 0.5;
        z.mesh.traverse(child => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
            child.material.transparent = true;
            child.material.opacity = Math.max(0, z.deathTimer!);
          }
        });
        if (z.deathTimer <= 0) {
          scene.remove(z.mesh);
          zombies.splice(i, 1);
        }
        return;
      }

      // Chase player
      const toPlayer = new THREE.Vector3().subVectors(player.position, z.mesh.position);
      toPlayer.y = 0;
      const dist = toPlayer.length();

      if (dist > 0.1) {
        toPlayer.normalize();
        z.mesh.position.addScaledVector(toPlayer, z.speed * dt);
        z.mesh.rotation.y = Math.atan2(toPlayer.x, toPlayer.z);
      }

      // Walking animation
      const walkTime = performance.now() * 0.005 * z.speed;
      z.bodyParts.armL.rotation.x = Math.sin(walkTime) * 0.8;
      z.bodyParts.armR.rotation.x = -Math.sin(walkTime) * 0.8;
      z.bodyParts.legL.rotation.x = -Math.sin(walkTime) * 0.6;
      z.bodyParts.legR.rotation.x = Math.sin(walkTime) * 0.6;

      // Arms reach forward when close
      if (dist < 3) {
        z.bodyParts.armL.rotation.x = -1.2 + Math.sin(walkTime * 2) * 0.3;
        z.bodyParts.armR.rotation.x = -1.2 - Math.sin(walkTime * 2) * 0.3;
      }

      // Attack player
      z.attackCooldown = Math.max(0, z.attackCooldown - dt);
      const attackDist = z.isBoss ? 2.5 : 1.2;
      if (dist < attackDist && z.attackCooldown <= 0) {
        state.hp -= z.damage;
        z.attackCooldown = 1.0;
        state.hitFlash = 0.3;
        state.shakeIntensity = 0.3;
        state.regenTimer = 0; // Reset regen timer on hit
        audio.playHit();
        spawnParticles(player.position, 0xff0000, 5, 3);

        if (state.hp <= 0) {
          state.hp = 0;
          triggerGameOver();
        }
      }

      // Random groans
      if (groanTimer < dt * 0.01) {
        audio.playZombieGroan();
        groanTimer = 1;
      }
    });

    // --- Particles ---
    particles.forEach((p, i) => {
      p.life -= dt;
      p.velocity.y -= 9.8 * dt;
      p.mesh.position.addScaledVector(p.velocity, dt);
      if (p.mesh.material instanceof THREE.MeshBasicMaterial) {
        p.mesh.material.opacity = Math.max(0, p.life * 2);
      }
      if (p.life <= 0) {
        scene.remove(p.mesh);
        particles.splice(i, 1);
      }
    });

    // --- Wave management ---
    if (state.waveActive && state.zombiesRemaining <= 0 && zombies.filter(z => z.deathTimer === null).length === 0) {
      state.waveActive = false;
      state.waveDelay = 3;
    }

    if (!state.waveActive && !state.gameOver) {
      state.waveDelay -= dt;
      if (state.waveDelay <= 0) startWave();
    }

    // --- Camera ---
    const cameraOffset = new THREE.Vector3(0, 6, 8);
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYaw);
    const targetCamPos = new THREE.Vector3().addVectors(player.position, cameraOffset);
    camera.position.lerp(targetCamPos, 0.08);

    // Screen shake
    if (state.shakeIntensity > 0) {
      camera.position.x += (Math.random() - 0.5) * state.shakeIntensity;
      camera.position.y += (Math.random() - 0.5) * state.shakeIntensity * 0.5;
      state.shakeIntensity *= 0.9;
      if (state.shakeIntensity < 0.01) state.shakeIntensity = 0;
    }

    camera.lookAt(player.position.x, player.position.y + 1.5, player.position.z);

    // --- Hit flash ---
    state.hitFlash = Math.max(0, state.hitFlash - dt);

    // --- HUD Update ---
    const hpPct = (state.hp / state.maxHp) * 100;
    hpBar.style.width = hpPct + "%";
    hpBar.style.background = hpPct < 30 ? "linear-gradient(90deg,#ff0000,#cc0000)" : "linear-gradient(90deg,#cc0000,#ff3333)";
    hpText.textContent = `${Math.ceil(state.hp)} / ${state.maxHp}`;

    const elapsed = (performance.now() - state.startTime) / 1000;
    const m = Math.floor(elapsed / 60);
    const s = Math.floor(elapsed % 60);
    statsDiv.innerHTML = `
      <div style="font-size:18px;color:#ff6666;font-weight:bold;">Wave ${state.wave}</div>
      <div>Kills: ${state.kills}</div>
      <div>Time: ${m}:${s.toString().padStart(2, "0")}</div>
      <div style="font-size:12px;color:#666;">Zombies: ${zombies.filter(z => z.deathTimer === null).length}</div>
    `;

    // Vignette (damage + low HP)
    const vignetteAlpha = Math.max(state.hitFlash * 2, hpPct < 30 ? 0.3 + Math.sin(performance.now() * 0.005) * 0.1 : 0);
    vignette.style.boxShadow = `inset 0 0 ${80 + (1 - hpPct / 100) * 100}px rgba(255,0,0,${vignetteAlpha})`;

    renderer.render(scene, camera);
  }

  update();

  // Resize handler
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
