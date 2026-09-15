/**
 * ============================================================================
 * FRUIT SLICER ARCADE - CORE ENGINE & GAME LOGIC (PRO VISUAL OVERHAUL)
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. GLOBAL CONFIGURATION & CONSTANTS
     ========================================================================== */
  const STORAGE_KEY_HIGH_SCORES = 'fruitSlicerHighScores_v2';
  const STORAGE_KEY_BEST_SCORE = 'fruitSlicerBestScore_v2';
  const STORAGE_KEY_SOUND = 'fruitSlicerSoundEnabled';

  // Fruit Types Definition with Realistic Colors & Inner Flesh Configurations
  const FRUIT_TYPES = [
    {
      id: 'apple',
      name: 'Green Apple',
      radius: 42,
      score: 1,
      skinColor: '#8ee617',
      darkSkinColor: '#4c8a08',
      highlightColor: '#c7fa69',
      fleshColor: '#f9fbe8',
      innerRimColor: '#d6ed9d',
      seedColor: '#3b1d06',
      juiceColors: ['#8ee617', '#baf54c', '#5ca30a', '#ffffff'],
      emoji: '🍏'
    },
    {
      id: 'pineapple',
      name: 'Pineapple',
      radius: 48,
      score: 3,
      skinColor: '#e08714',
      darkSkinColor: '#7a3e02',
      fleshColor: '#ffd633',
      innerRimColor: '#ffe97a',
      coreColor: '#fff5b3',
      seedColor: '#522900',
      juiceColors: ['#ffd633', '#ffa500', '#fff080', '#e08714'],
      emoji: '🍍'
    },
    {
      id: 'banana',
      name: 'Banana',
      radius: 40,
      score: 2,
      skinColor: '#ffde38',
      darkSkinColor: '#a8850a',
      fleshColor: '#fffde6',
      innerRimColor: '#fff8b3',
      seedColor: '#706020',
      juiceColors: ['#ffde38', '#fffde6', '#ffffff'],
      emoji: '🍌'
    },
    {
      id: 'watermelon',
      name: 'Watermelon',
      radius: 46,
      score: 1,
      skinColor: '#1a4f15',
      darkSkinColor: '#0e2b0b',
      stripeColor: '#439932',
      fleshColor: '#ea1f34',
      innerRimColor: '#d8f5c1',
      seedColor: '#170c06',
      juiceColors: ['#ea1f34', '#ff4d61', '#328c25'],
      emoji: '🍉'
    },
    {
      id: 'orange',
      name: 'Orange',
      radius: 42,
      score: 1,
      skinColor: '#ff7700',
      darkSkinColor: '#c45100',
      fleshColor: '#ffa61a',
      innerRimColor: '#fff7e6',
      seedColor: '#ffffff',
      juiceColors: ['#ff7700', '#ffa61a', '#ffe066'],
      emoji: '🍊'
    },
    {
      id: 'strawberry',
      name: 'Strawberry',
      radius: 36,
      score: 2,
      skinColor: '#e0123d',
      darkSkinColor: '#8a0320',
      fleshColor: '#ff6987',
      innerRimColor: '#ffe0e6',
      seedColor: '#fed44b',
      juiceColors: ['#e0123d', '#ff6987', '#329c3b'],
      emoji: '🍓'
    },
    {
      id: 'lemon',
      name: 'Lemon',
      radius: 38,
      score: 1,
      skinColor: '#ffe066',
      darkSkinColor: '#cca300',
      fleshColor: '#fff099',
      innerRimColor: '#fffae6',
      seedColor: '#e6d88e',
      juiceColors: ['#ffe066', '#fff099', '#ffffff'],
      emoji: '🍋'
    },
    {
      id: 'lime',
      name: 'Lime',
      radius: 36,
      score: 1,
      skinColor: '#34c759',
      darkSkinColor: '#1e8035',
      fleshColor: '#7fe68e',
      innerRimColor: '#e2fae0',
      seedColor: '#bdfa9d',
      juiceColors: ['#34c759', '#7fe68e', '#ffffff'],
      emoji: '🟢'
    },
    {
      id: 'kiwi',
      name: 'Kiwi',
      radius: 37,
      score: 2,
      skinColor: '#8b5a2b',
      darkSkinColor: '#5c3a1b',
      fleshColor: '#7bc63d',
      innerRimColor: '#d6f599',
      seedColor: '#1c2414',
      juiceColors: ['#7bc63d', '#8b5a2b', '#d6f599'],
      emoji: '🥝'
    }
  ];

  /* ==========================================================================
     2. AUDIO SYSTEM
     ========================================================================== */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = localStorage.getItem(STORAGE_KEY_SOUND) !== 'false';
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem(STORAGE_KEY_SOUND, this.enabled ? 'true' : 'false');
      return this.enabled;
    }

    playSlice() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.12);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.12);
      } catch (e) {}
    }

    playCombo() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const t = this.ctx.currentTime + idx * 0.05;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 0.2);
        });
      } catch (e) {}
    }

    playBombExplosion() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.4);

        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.4);
      } catch (e) {}
    }

    playButtonClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.05);
      } catch (e) {}
    }

    playGameOver() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const notes = [400, 350, 300, 220];
        notes.forEach((freq, idx) => {
          const t = this.ctx.currentTime + idx * 0.12;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 0.25);
        });
      } catch (e) {}
    }
  }

  /* ==========================================================================
     3. PARTICLE SYSTEM
     ========================================================================== */
  class Particle {
    constructor(x, y, vx, vy, color, radius, life, shape = 'circle') {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.radius = radius;
      this.life = life;
      this.maxLife = life;
      this.gravity = 0.25;
      this.shape = shape;
      this.rotation = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.life -= 1;
      this.rotation += this.vRot;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      const alpha = Math.max(0, this.life / this.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      } else if (this.shape === 'spark') {
        ctx.beginPath();
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(this.radius, 0);
        ctx.lineTo(0, this.radius * 2.5);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      } else if (this.shape === 'smoke') {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * (1 + (1 - alpha) * 1.5), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Wall Juice Splatter (Stuck to background wall)
  // Wall Juice Splatter (Stuck to background wall matching fruit juice)
  class WallSplatter {
    constructor(x, y, color, permanent = false) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = 26 + Math.random() * 34;
      this.life = permanent ? 999999 : 450;
      this.maxLife = this.life;
      this.permanent = permanent;
      this.blobs = [];

      // Organic splatter lobes + splash droplets
      const lobeCount = 7 + Math.floor(Math.random() * 5);
      for (let i = 0; i < lobeCount; i++) {
        const angle = (i / lobeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const dist = (0.4 + Math.random() * 0.9) * this.radius;
        this.blobs.push({
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          r: (0.25 + Math.random() * 0.55) * (this.radius * 0.45)
        });
      }

      // Satellite spray droplets
      this.droplets = [];
      const dropCount = 5 + Math.floor(Math.random() * 6);
      for (let d = 0; d < dropCount; d++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = this.radius * (1.1 + Math.random() * 1.3);
        this.droplets.push({
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          r: 2 + Math.random() * 3.5
        });
      }
    }

    update() {
      if (!this.permanent) this.life--;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      const alpha = this.permanent ? 0.55 : Math.min(1, this.life / 60) * 0.58;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;

      // Central splat pool
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.52, 0, Math.PI * 2);
      ctx.fill();

      // Splat arms
      this.blobs.forEach(b => {
        ctx.beginPath();
        ctx.arc(this.x + b.dx, this.y + b.dy, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Flying satellite juice droplets
      this.droplets.forEach(d => {
        ctx.beginPath();
        ctx.arc(this.x + d.dx, this.y + d.dy, d.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }
  }

  /* ==========================================================================
     4. GAME ENTITIES (Fruit, FruitHalf, Bomb) - REALISTIC VISUAL RENDERING
     ========================================================================== */
  class Fruit {
    constructor(typeConfig, canvasWidth, canvasHeight) {
      this.type = typeConfig;
      this.radius = typeConfig.radius;
      this.sliced = false;

      this.x = this.radius * 2 + Math.random() * (canvasWidth - this.radius * 4);
      this.y = canvasHeight + this.radius;

      const targetX = canvasWidth * 0.25 + Math.random() * (canvasWidth * 0.5);
      const targetY = canvasHeight * 0.15 + Math.random() * (canvasHeight * 0.25);

      const dx = targetX - this.x;
      const dy = targetY - this.y;
      this.gravity = 0.38 + Math.random() * 0.06;

      const timeToApex = Math.sqrt((2 * Math.abs(dy)) / this.gravity);
      this.vy = -this.gravity * timeToApex;
      this.vx = dx / timeToApex;

      this.rotation = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.08;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.rotation += this.vRot;
    }

    draw(ctx) {
      if (this.sliced) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      // Realistic Drop Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 8;

      const id = this.type.id;
      const r = this.radius;

      if (id === 'apple') {
        // GREEN APPLE (Granny Smith realistic shape & texture)
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.82);
        ctx.bezierCurveTo(r * 0.55, -r * 1.05, r * 1.08, -r * 0.45, r * 1.02, r * 0.25);
        ctx.bezierCurveTo(r * 0.95, r * 0.9, r * 0.45, r * 1.05, 0, r * 0.88);
        ctx.bezierCurveTo(-r * 0.45, r * 1.05, -r * 0.95, r * 0.9, -r * 1.02, r * 0.25);
        ctx.bezierCurveTo(-r * 1.08, -r * 0.45, -r * 0.55, -r * 1.05, 0, -r * 0.82);
        ctx.closePath();

        const aGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r * 1.1);
        aGrad.addColorStop(0, '#d4fa75');
        aGrad.addColorStop(0.25, '#8ee617');
        aGrad.addColorStop(0.7, '#5ea80c');
        aGrad.addColorStop(1, '#346604');
        ctx.fillStyle = aGrad;
        ctx.fill();

        ctx.shadowColor = 'transparent';

        // Tiny skin speckles / lenticels
        ctx.fillStyle = 'rgba(235, 255, 180, 0.35)';
        for (let s = 0; s < 10; s++) {
          const ang = s * 0.65;
          const dist = (0.25 + (s % 5) * 0.12) * r;
          ctx.beginPath();
          ctx.arc(Math.cos(ang) * dist, Math.sin(ang) * dist, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Specular glossy reflection curve
        ctx.beginPath();
        ctx.ellipse(-r * 0.35, -r * 0.42, r * 0.38, r * 0.18, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();

        // Woody brown stem
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.82);
        ctx.quadraticCurveTo(r * 0.15, -r * 1.2, r * 0.28, -r * 1.35);
        ctx.strokeStyle = '#472b0e';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Fresh green leaf
        ctx.beginPath();
        ctx.moveTo(r * 0.12, -r * 1.15);
        ctx.quadraticCurveTo(r * 0.5, -r * 1.3, r * 0.45, -r * 1.1);
        ctx.quadraticCurveTo(r * 0.3, -r * 1.05, r * 0.12, -r * 1.15);
        ctx.fillStyle = '#65a812';
        ctx.fill();

      } else if (id === 'pineapple') {
        // PINEAPPLE (Textured diamond scales + spiky emerald crown)
        const pw = r * 0.88;
        const ph = r * 1.15;
        ctx.beginPath();
        ctx.ellipse(0, 0, pw, ph, 0, 0, Math.PI * 2);
        const pGrad = ctx.createRadialGradient(-pw * 0.3, -ph * 0.3, pw * 0.15, 0, 0, ph * 1.1);
        pGrad.addColorStop(0, '#fce05d');
        pGrad.addColorStop(0.3, '#e89b1c');
        pGrad.addColorStop(0.8, '#b86104');
        pGrad.addColorStop(1, '#663200');
        ctx.fillStyle = pGrad;
        ctx.fill();

        ctx.shadowColor = 'transparent';

        // Diamond scale lattice pattern
        ctx.strokeStyle = 'rgba(90, 42, 4, 0.6)';
        ctx.lineWidth = 2.2;
        const rows = 5;
        for (let row = -rows; row <= rows; row++) {
          const y = (row / rows) * ph * 0.85;
          const wAtY = Math.sqrt(Math.max(0, 1 - (y / ph) ** 2)) * pw;
          ctx.beginPath();
          ctx.moveTo(-wAtY, y - 10);
          ctx.lineTo(wAtY, y + 10);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-wAtY, y + 10);
          ctx.lineTo(wAtY, y - 10);
          ctx.stroke();
        }

        // Golden eye center dots
        for (let ry = -3; ry <= 3; ry++) {
          for (let rx = -2; rx <= 2; rx++) {
            const sx = rx * (pw * 0.42) + (ry % 2 === 0 ? 0 : pw * 0.21);
            const sy = ry * (ph * 0.25);
            if ((sx / pw) ** 2 + (sy / ph) ** 2 < 0.75) {
              ctx.beginPath();
              ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
              ctx.fillStyle = '#ffcf33';
              ctx.fill();
              ctx.beginPath();
              ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = '#612a00';
              ctx.fill();
            }
          }
        }

        // Spiky Crown leaves
        for (let leaf = -5; leaf <= 5; leaf++) {
          ctx.save();
          const lAngle = (leaf * 0.18) + (Math.sin(leaf) * 0.05);
          ctx.rotate(lAngle);
          ctx.beginPath();
          ctx.moveTo(-6, -ph * 0.85);
          ctx.quadraticCurveTo(0, -ph * 1.55 - Math.abs(leaf) * 4, leaf * 5, -ph * 1.65 - Math.abs(leaf) * 6);
          ctx.quadraticCurveTo(6, -ph * 1.35, 6, -ph * 0.85);
          ctx.closePath();
          const leafGrad = ctx.createLinearGradient(0, -ph * 0.85, 0, -ph * 1.7);
          leafGrad.addColorStop(0, '#1c5e12');
          leafGrad.addColorStop(0.5, '#35a822');
          leafGrad.addColorStop(1, '#1b6311');
          ctx.fillStyle = leafGrad;
          ctx.fill();
          ctx.strokeStyle = '#54c73e';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }

      } else if (id === 'banana') {
        // BANANA (Crescent shape with 3D facet shading, green tip, brown stem)
        ctx.beginPath();
        ctx.moveTo(-r * 0.95, r * 0.4);
        ctx.bezierCurveTo(-r * 0.5, -r * 0.85, r * 0.5, -r * 0.85, r * 1.1, -r * 0.2);
        ctx.bezierCurveTo(r * 1.15, -r * 0.15, r * 1.1, -r * 0.05, r * 0.95, -r * 0.05);
        ctx.bezierCurveTo(r * 0.45, -r * 0.55, -r * 0.4, -r * 0.55, -r * 0.85, r * 0.5);
        ctx.closePath();

        const bGrad = ctx.createLinearGradient(-r, -r, r, r);
        bGrad.addColorStop(0, '#fced56');
        bGrad.addColorStop(0.5, '#f5ce1b');
        bGrad.addColorStop(1, '#dbad09');
        ctx.fillStyle = bGrad;
        ctx.fill();

        ctx.shadowColor = 'transparent';

        // Longitudinal facet line
        ctx.beginPath();
        ctx.moveTo(-r * 0.9, r * 0.45);
        ctx.bezierCurveTo(-r * 0.45, -r * 0.7, r * 0.48, -r * 0.7, r * 1.02, -r * 0.12);
        ctx.strokeStyle = 'rgba(153, 115, 8, 0.45)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Stem (green tinted)
        ctx.beginPath();
        ctx.moveTo(-r * 0.95, r * 0.4);
        ctx.lineTo(-r * 1.12, r * 0.58);
        ctx.strokeStyle = '#6b8214';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Brown blossom tip
        ctx.beginPath();
        ctx.arc(r * 1.1, -r * 0.18, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#422808';
        ctx.fill();

      } else if (id === 'watermelon') {
        // WATERMELON (Forest green sphere with wavy jagged lime stripes)
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        const wmGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
        wmGrad.addColorStop(0, '#2d7a22');
        wmGrad.addColorStop(0.5, '#195412');
        wmGrad.addColorStop(1, '#0e330a');
        ctx.fillStyle = wmGrad;
        ctx.fill();

        ctx.shadowColor = 'transparent';

        // Jagged Wavy Lime Stripes
        ctx.strokeStyle = '#4ecc29';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        for (let s = -2; s <= 2; s++) {
          const sy = s * (r * 0.35);
          ctx.beginPath();
          for (let x = -r * 0.85; x <= r * 0.85; x += 12) {
            const y = sy + Math.sin(x * 0.15 + s) * 7;
            if (x === -r * 0.85) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Gloss arc
        ctx.beginPath();
        ctx.ellipse(-r * 0.35, -r * 0.35, r * 0.35, r * 0.18, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fill();

      } else if (id === 'strawberry') {
        // STRAWBERRY (Heart cone with golden achenes and calyx)
        ctx.beginPath();
        ctx.moveTo(0, r * 1.05);
        ctx.bezierCurveTo(-r * 0.8, r * 0.5, -r * 1.05, -r * 0.4, -r * 0.5, -r * 0.85);
        ctx.bezierCurveTo(-r * 0.2, -r * 1.0, 0, -r * 0.8, 0, -r * 0.8);
        ctx.bezierCurveTo(0, -r * 0.8, r * 0.2, -r * 1.0, r * 0.5, -r * 0.85);
        ctx.bezierCurveTo(r * 1.05, -r * 0.4, r * 0.8, r * 0.5, 0, r * 1.05);
        ctx.closePath();

        const sbGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r * 1.1);
        sbGrad.addColorStop(0, '#ff4769');
        sbGrad.addColorStop(0.3, '#e6123a');
        sbGrad.addColorStop(0.8, '#a80222');
        sbGrad.addColorStop(1, '#5c0012');
        ctx.fillStyle = sbGrad;
        ctx.fill();

        ctx.shadowColor = 'transparent';

        // Golden achenes (seeds) in pits
        for (let sy = -2; sy <= 3; sy++) {
          for (let sx = -3; sx <= 3; sx++) {
            const px = sx * 9 + (sy % 2 === 0 ? 4 : 0);
            const py = sy * 10;
            if (Math.abs(px) < r * 0.7 && py < r * 0.8) {
              ctx.beginPath();
              ctx.arc(px, py, 1.8, 0, Math.PI * 2);
              ctx.fillStyle = '#ffe359';
              ctx.fill();
            }
          }
        }

        // Green Leafy Calyx crown
        for (let c = -2; c <= 2; c++) {
          ctx.beginPath();
          ctx.moveTo(0, -r * 0.8);
          ctx.lineTo(c * 12, -r * 1.15);
          ctx.lineTo((c + 0.5) * 8, -r * 0.85);
          ctx.fillStyle = '#2ca31d';
          ctx.fill();
        }

      } else {
        // ORANGE / LEMON / LIME / KIWI (Realistic Citrus with dimpled texture)
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.25, this.type.skinColor);
        grad.addColorStop(0.85, this.type.darkSkinColor);
        grad.addColorStop(1, '#2b1400');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.shadowColor = 'transparent';

        // Dimpled skin stippling
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let d = 0; d < 12; d++) {
          const a = d * 0.52;
          const dist = (0.2 + (d % 5) * 0.14) * r;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * dist, Math.sin(a) * dist, 1, 0, Math.PI * 2);
          ctx.fill();
        }

        // Specular gloss
        ctx.beginPath();
        ctx.ellipse(-r * 0.35, -r * 0.35, r * 0.32, r * 0.16, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();

        // Small stem button
        ctx.beginPath();
        ctx.arc(0, -r * 0.9, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#2f6617';
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // ULTRA-REALISTIC SLICED FRUIT HALVES (Matching Reference Image)
  class FruitHalf {
    constructor(typeConfig, x, y, sliceAngle, isRightHalf) {
      this.type = typeConfig;
      this.radius = typeConfig.radius;
      this.x = x;
      this.y = y;
      this.sliceAngle = sliceAngle;
      this.isRightHalf = isRightHalf;

      const pushDir = isRightHalf ? 1 : -1;
      const perpAngle = sliceAngle + Math.PI / 2;

      const pushSpeed = 5 + Math.random() * 4;
      this.vx = Math.cos(perpAngle) * pushSpeed * pushDir + (Math.random() - 0.5) * 2;
      this.vy = Math.sin(perpAngle) * pushSpeed * pushDir - (2 + Math.random() * 3);
      this.gravity = 0.42;

      this.rotation = sliceAngle;
      this.vRot = pushDir * (0.12 + Math.random() * 0.15);
      this.life = 120;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.rotation += this.vRot;
      this.life--;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      const side = this.isRightHalf ? 1 : -1;
      const r = this.radius;
      const id = this.type.id;

      if (id === 'apple') {
        // GREEN APPLE SLICED HALF (Crisp pale flesh, green rim, star core & seeds)
        // Outer green peel shell
        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#4c8a08';
        ctx.fill();

        // Granny Smith green peel edge
        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.94, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.94, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#7dd317';
        ctx.fill();

        // Sub-peel pale celadon ring
        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.88, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.88, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#d8f2a5';
        ctx.fill();

        // Crisp pale ivory flesh
        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.82, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.82, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#fbfde8';
        ctx.fill();

        // Star-shaped core cavity
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.35);
        ctx.quadraticCurveTo(side * r * 0.35, 0, 0, r * 0.35);
        ctx.fillStyle = '#c5e096';
        ctx.fill();

        // Teardrop Apple Seeds
        ctx.save();
        ctx.translate(side * (r * 0.18), -r * 0.08);
        ctx.rotate(side * 0.3);
        ctx.beginPath();
        ctx.ellipse(0, 0, 4.5, 2.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#3b1804';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-1, -0.8, 0.9, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(side * (r * 0.14), r * 0.12);
        ctx.rotate(side * -0.4);
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 2.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#3b1804';
        ctx.fill();
        ctx.restore();

      } else if (id === 'pineapple') {
        // PINEAPPLE SLICED HALF (Concentric ring layers, central core, scaly rind)
        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#8a4b00';
        ctx.fill();

        // Scaly rind teeth along perimeter
        ctx.fillStyle = '#d97d09';
        for (let a = -1.3; a <= 1.3; a += 0.32) {
          const ang = (this.isRightHalf ? 0 : Math.PI) + a;
          ctx.beginPath();
          ctx.arc(Math.cos(ang) * r, Math.sin(ang) * r, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Rind inner border
        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.88, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.88, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#ffb300';
        ctx.fill();

        // Sunny golden-yellow juicy pulp
        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.82, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.82, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        const pFlesh = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r * 0.85);
        pFlesh.addColorStop(0, '#fff3a8');
        pFlesh.addColorStop(0.3, '#ffd633');
        pFlesh.addColorStop(0.75, '#f5ad00');
        pFlesh.addColorStop(1, '#db8f00');
        ctx.fillStyle = pFlesh;
        ctx.fill();

        // Concentric fibrous rings
        ctx.strokeStyle = 'rgba(255, 245, 179, 0.65)';
        ctx.lineWidth = 1.8;
        for (let rad = 0.35; rad <= 0.68; rad += 0.16) {
          ctx.beginPath();
          if (this.isRightHalf) ctx.arc(0, 0, r * rad, -Math.PI / 2, Math.PI / 2);
          else ctx.arc(0, 0, r * rad, Math.PI / 2, -Math.PI / 2);
          ctx.stroke();
        }

        // Radiating fibrous juice rays
        ctx.strokeStyle = 'rgba(217, 134, 0, 0.5)';
        ctx.lineWidth = 1.2;
        for (let a = -1.3; a <= 1.3; a += 0.22) {
          const ang = (this.isRightHalf ? 0 : Math.PI) + a;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * (r * 0.26), Math.sin(ang) * (r * 0.26));
          ctx.lineTo(Math.cos(ang) * (r * 0.78), Math.sin(ang) * (r * 0.78));
          ctx.stroke();
        }

        // Fibrous central core
        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.25, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.25, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#fff6bd';
        ctx.fill();

      } else if (id === 'banana') {
        // BANANA SLICED HALF (Creamy cut face, 3-star center, yellow peel)
        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#e8b809';
        ctx.fill();

        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.92, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.92, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#ffde38';
        ctx.fill();

        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.84, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.84, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#fffdf0';
        ctx.fill();

        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.78, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.78, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#fffbe0';
        ctx.fill();

        // 3-point star seed speckles
        ctx.fillStyle = '#8f7b3b';
        ctx.beginPath();
        ctx.arc(side * (r * 0.12), -4, 1.5, 0, Math.PI * 2);
        ctx.arc(side * (r * 0.18), 0, 1.5, 0, Math.PI * 2);
        ctx.arc(side * (r * 0.12), 4, 1.5, 0, Math.PI * 2);
        ctx.fill();

      } else if (id === 'watermelon') {
        // WATERMELON SLICED HALF (Deep crimson pulp, pale inner rind, black seeds)
        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#103d0b';
        ctx.fill();

        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.9, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.9, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#def7c3';
        ctx.fill();

        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.82, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.82, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        const wmFlesh = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r * 0.82);
        wmFlesh.addColorStop(0, '#ff3b53');
        wmFlesh.addColorStop(0.7, '#ea1f34');
        wmFlesh.addColorStop(1, '#c70e22');
        ctx.fillStyle = wmFlesh;
        ctx.fill();

        // Teardrop black seeds
        ctx.fillStyle = '#170c06';
        for (let a = -1.1; a <= 1.1; a += 0.55) {
          const ang = (this.isRightHalf ? 0 : Math.PI) + a;
          const sx = Math.cos(ang) * (r * 0.48);
          const sy = Math.sin(ang) * (r * 0.48);
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(ang + Math.PI / 2);
          ctx.beginPath();
          ctx.ellipse(0, 0, 4.2, 2.4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-1, -0.6, 0.7, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.restore();
        }

      } else if (['orange', 'lemon', 'lime'].includes(id)) {
        // CITRUS SLICED HALF (Segmented wedges with white pith lines)
        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = this.type.darkSkinColor;
        ctx.fill();

        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.92, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.92, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#fff6eb';
        ctx.fill();

        // Juicy segmented wedges
        const segments = 5;
        for (let s = 0; s < segments; s++) {
          const startA = (this.isRightHalf ? -Math.PI / 2 : Math.PI / 2) + (s * (Math.PI / segments)) + 0.05;
          const endA = startA + (Math.PI / segments) - 0.09;
          ctx.beginPath();
          ctx.moveTo(Math.cos(startA) * (r * 0.18), Math.sin(startA) * (r * 0.18));
          ctx.arc(0, 0, r * 0.85, startA, endA);
          ctx.lineTo(Math.cos(endA) * (r * 0.18), Math.sin(endA) * (r * 0.18));
          ctx.closePath();
          ctx.fillStyle = this.type.fleshColor;
          ctx.fill();
        }

        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.18, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.18, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = '#fff6eb';
        ctx.fill();

      } else {
        // GENERIC / STRAWBERRY / KIWI HALF
        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = this.type.darkSkinColor;
        ctx.fill();

        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.92, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.92, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = this.type.innerRimColor;
        ctx.fill();

        ctx.beginPath();
        if (this.isRightHalf) ctx.arc(0, 0, r * 0.85, -Math.PI / 2, Math.PI / 2);
        else ctx.arc(0, 0, r * 0.85, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = this.type.fleshColor;
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // BOMB OBJECT (Matching Evil Grinning Face from Reference Image)
  class Bomb {
    constructor(canvasWidth, canvasHeight) {
      this.radius = 38;
      this.sliced = false;

      this.x = this.radius * 2 + Math.random() * (canvasWidth - this.radius * 4);
      this.y = canvasHeight + this.radius;

      const targetX = canvasWidth * 0.3 + Math.random() * (canvasWidth * 0.4);
      const targetY = canvasHeight * 0.2 + Math.random() * (canvasHeight * 0.2);

      const dx = targetX - this.x;
      const dy = targetY - this.y;
      this.gravity = 0.38;

      const timeToApex = Math.sqrt((2 * Math.abs(dy)) / this.gravity);
      this.vy = -this.gravity * timeToApex;
      this.vx = dx / timeToApex;

      this.rotation = 0;
      this.vRot = (Math.random() - 0.5) * 0.05;
      this.fuseTimer = 0;
    }

    update(engine) {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.rotation += this.vRot;
      this.fuseTimer++;

      if (engine && engine.particles) {
        // Fuse position
        const fuseX = this.x + Math.sin(this.rotation) * 36;
        const fuseY = this.y - Math.cos(this.rotation) * 36;

        // Fiery Spark Explosion from the burning fuse!
        const sparkColors = ['#ffffff', '#fff75c', '#ffaa00', '#ff3300'];
        for (let i = 0; i < 2; i++) {
          const spColor = sparkColors[Math.floor(Math.random() * sparkColors.length)];
          const spSpeed = 1 + Math.random() * 3.5;
          const spAngle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
          engine.particles.push(
            new Particle(fuseX, fuseY, Math.cos(spAngle) * spSpeed, Math.sin(spAngle) * spSpeed, spColor, 2 + Math.random() * 2.5, 15, 'spark')
          );
        }
      }
    }

    draw(ctx) {
      if (this.sliced) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      // Outer Red Glow Hazard Aura
      ctx.shadowColor = 'rgba(255, 34, 68, 0.65)';
      ctx.shadowBlur = 20;

      // Solid Metallic Black Cast-Iron Sphere
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      const bGrad = ctx.createRadialGradient(-this.radius * 0.35, -this.radius * 0.35, 4, 0, 0, this.radius);
      bGrad.addColorStop(0, '#555861');
      bGrad.addColorStop(0.35, '#222326');
      bGrad.addColorStop(0.85, '#0e0e10');
      bGrad.addColorStop(1, '#050506');
      ctx.fillStyle = bGrad;
      ctx.fill();

      ctx.shadowColor = 'transparent';

      // Glossy metallic rim light
      ctx.beginPath();
      ctx.ellipse(-this.radius * 0.35, -this.radius * 0.35, this.radius * 0.32, this.radius * 0.15, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.fill();

      // Top iron neck collar
      ctx.fillStyle = '#3a3a40';
      ctx.fillRect(-8, -this.radius - 6, 16, 7);
      ctx.fillStyle = '#686b75';
      ctx.fillRect(-7, -this.radius - 5, 14, 2);

      // Sinuous rope fuse
      ctx.beginPath();
      ctx.moveTo(0, -this.radius - 6);
      ctx.quadraticCurveTo(12, -this.radius - 16, 4, -this.radius - 24);
      ctx.strokeStyle = '#c49a56';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Burning ember tip
      ctx.beginPath();
      ctx.arc(4, -this.radius - 24, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ff4400';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(4, -this.radius - 24, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // MENACING EVIL GRINNING FACE (Matching Reference Image)
      // Slanted Sinister Eyes glowing red/orange
      ctx.fillStyle = '#ff2600';
      ctx.shadowColor = '#ff2200';
      ctx.shadowBlur = 10;

      // Left Eye
      ctx.beginPath();
      ctx.moveTo(-16, -10);
      ctx.lineTo(-6, -6);
      ctx.lineTo(-14, -4);
      ctx.closePath();
      ctx.fill();

      // Right Eye
      ctx.beginPath();
      ctx.moveTo(16, -10);
      ctx.lineTo(6, -6);
      ctx.lineTo(14, -4);
      ctx.closePath();
      ctx.fill();

      // Evil Jagged-Teethed Grinning Mouth
      ctx.beginPath();
      // Upper lip with jagged fangs
      ctx.moveTo(-18, 4);
      ctx.lineTo(-12, 10);
      ctx.lineTo(-7, 5);
      ctx.lineTo(0, 11);
      ctx.lineTo(7, 5);
      ctx.lineTo(12, 10);
      ctx.lineTo(18, 4);
      // Lower lip with upward jagged fangs
      ctx.quadraticCurveTo(14, 18, 0, 20);
      ctx.quadraticCurveTo(-14, 18, -18, 4);
      ctx.closePath();
      ctx.fillStyle = '#ff1a00';
      ctx.fill();

      // Bright fiery center glow inside the teeth
      ctx.strokeStyle = '#ff9900';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.restore();
    }
  }

  /* ==========================================================================
     5. KATANA SWORD BLADE TRAIL (Golden Slicing Arc with White Core & Sparks)
     ========================================================================== */
  class BladeTrail {
    constructor() {
      this.points = [];
      this.maxPoints = 16;
    }

    addPoint(x, y) {
      this.points.push({ x, y, time: Date.now() });
      if (this.points.length > this.maxPoints) {
        this.points.shift();
      }
    }

    update() {
      const now = Date.now();
      this.points = this.points.filter(p => now - p.time < 190);
    }

    draw(ctx) {
      if (this.points.length < 3) return;
      ctx.save();

      const pts = this.points;
      const head = pts[pts.length - 1];
      const prev = pts[pts.length - 2];
      const headAngle = Math.atan2(head.y - prev.y, head.x - prev.x);

      // Outer Golden Katana Aura & Glow
      ctx.shadowColor = '#ffbb00';
      ctx.shadowBlur = 24;
      ctx.strokeStyle = 'rgba(255, 190, 20, 0.45)';
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }
      ctx.stroke();

      // Warm Gold Blade Core
      ctx.shadowColor = '#ffe600';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#ffd000';
      ctx.lineWidth = 9;
      ctx.stroke();

      // Razor-sharp dynamic tapered blade body
      const leftPts = [];
      const rightPts = [];

      for (let i = 0; i < pts.length - 1; i++) {
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        const progress = i / (pts.length - 1);
        const w = (Math.sin(progress * Math.PI) * 7.5) + 1.8;

        leftPts.push({
          x: p1.x + Math.cos(angle + Math.PI / 2) * w,
          y: p1.y + Math.sin(angle + Math.PI / 2) * w
        });
        rightPts.push({
          x: p1.x + Math.cos(angle - Math.PI / 2) * w,
          y: p1.y + Math.sin(angle - Math.PI / 2) * w
        });
      }

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      leftPts.forEach(p => ctx.lineTo(p.x, p.y));

      const tipDist = 14;
      ctx.lineTo(head.x + Math.cos(headAngle) * tipDist, head.y + Math.sin(headAngle) * tipDist);

      for (let i = rightPts.length - 1; i >= 0; i--) {
        ctx.lineTo(rightPts[i].x, rightPts[i].y);
      }
      ctx.closePath();

      const bGrad = ctx.createLinearGradient(pts[0].x, pts[0].y, head.x, head.y);
      bGrad.addColorStop(0, '#ff9900');
      bGrad.addColorStop(0.4, '#ffea75');
      bGrad.addColorStop(1, '#ffffff');
      ctx.fillStyle = bGrad;
      ctx.fill();

      // Pure Incandescent White Razor Cutting Edge
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }
      ctx.stroke();

      ctx.restore();
    }
  }

  /* ==========================================================================
     6. MAIN GAME ENGINE
     ========================================================================== */
  class GameEngine {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.container = document.getElementById('fruitcontainer');

      this.sound = new SoundEngine();
      this.blade = new BladeTrail();

      this.state = 'MENU';
      this.score = 0;
      this.bestScore = parseInt(localStorage.getItem(STORAGE_KEY_BEST_SCORE) || '0', 10);
      this.lives = 3;
      this.elapsedFrames = 0;

      this.fruits = [];
      this.fruitHalves = [];
      this.bombs = [];
      this.particles = [];
      this.wallSplatters = [];
      this.woodCanvas = null;

      // Background Image Loader (Dojo Wood with Warrior Engravings & Red Curtains)
      this.bgImage = new Image();
      this.bgImage.src = 'background.jpg';

      this.isSwiping = false;
      this.swipePath = [];
      this.currentSwipeSlices = 0;
      this.swipeSlicePoints = [];

      this.spawnTimer = 0;

      this.initDOM();
      this.initInputEvents();
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());

      this.initDefaultSplatters();

      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    initDefaultSplatters() {
      const w = this.canvas.width || 800;
      const h = this.canvas.height || 600;
      this.wallSplatters.push(new WallSplatter(w * 0.28, h * 0.48, '#8ee617', true));
      this.wallSplatters.push(new WallSplatter(w * 0.68, h * 0.32, '#ffd633', true));
      this.wallSplatters.push(new WallSplatter(w * 0.48, h * 0.4, '#ea1f34', true));
    }

    initDOM() {
      this.scoreEl = document.getElementById('scoreValue');
      this.bestScoreEl = document.getElementById('bestScoreValue');

      this.startScreen = document.getElementById('startScreen');
      this.howToModal = document.getElementById('howToPlayModal');
      this.pauseScreen = document.getElementById('pauseScreen');
      this.gameOverScreen = document.getElementById('gameOverScreen');
      this.comboOverlay = document.getElementById('comboOverlay');

      this.finalScoreEl = document.getElementById('finalScoreVal');
      this.finalBestEl = document.getElementById('finalBestVal');
      this.leaderboardBody = document.getElementById('leaderboardBody');
      this.soundTextEl = document.getElementById('soundText');

      this.updateScoreUI();
      this.renderLeaderboard();

      document.getElementById('playBtn').addEventListener('click', () => {
        this.sound.playButtonClick();
        this.startGame();
      });

      document.getElementById('closeHowToBtn').addEventListener('click', () => {
        this.sound.playButtonClick();
        this.howToModal.classList.remove('active');
      });

      document.getElementById('pauseBtn').addEventListener('click', () => {
        if (this.state === 'PLAYING') {
          this.sound.playButtonClick();
          this.pauseGame();
        }
      });

      document.getElementById('resumeBtn').addEventListener('click', () => {
        this.sound.playButtonClick();
        this.resumeGame();
      });

      document.getElementById('restartPauseBtn').addEventListener('click', () => {
        this.sound.playButtonClick();
        this.startGame();
      });

      document.getElementById('mainMenuPauseBtn').addEventListener('click', () => {
        this.sound.playButtonClick();
        this.showMenu();
      });

      document.getElementById('restartGameOverBtn').addEventListener('click', () => {
        this.sound.playButtonClick();
        this.startGame();
      });

      document.getElementById('mainMenuGameOverBtn').addEventListener('click', () => {
        this.sound.playButtonClick();
        this.showMenu();
      });
    }

    resizeCanvas() {
      const rect = this.container.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      this.woodCanvas = null; // reset wood background cache on resize
    }

    initInputEvents() {
      const getPos = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        return {
          x: (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left,
          y: (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top
        };
      };

      const startSwipe = (e) => {
        if (this.state !== 'PLAYING') return;
        this.isSwiping = true;
        const pos = getPos(e);
        this.swipePath = [pos];
        this.blade.addPoint(pos.x, pos.y);
        this.currentSwipeSlices = 0;
        this.swipeSlicePoints = [];
      };

      const moveSwipe = (e) => {
        if (!this.isSwiping || this.state !== 'PLAYING') return;
        const pos = getPos(e);
        const lastPos = this.swipePath[this.swipePath.length - 1];

        this.swipePath.push(pos);
        this.blade.addPoint(pos.x, pos.y);

        // Golden Katana Blade Spark particles on swipe
        if (Math.random() < 0.4) {
          this.particles.push(
            new Particle(pos.x, pos.y, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, '#ffe066', 2.4, 14, 'spark')
          );
        }

        if (lastPos) {
          this.checkSlicingCollision(lastPos, pos);
        }
      };

      const endSwipe = () => {
        if (this.isSwiping && this.currentSwipeSlices >= 3) {
          this.triggerCombo(this.currentSwipeSlices, this.swipeSlicePoints);
        }
        this.isSwiping = false;
        this.swipePath = [];
      };

      this.canvas.addEventListener('pointerdown', startSwipe);
      this.canvas.addEventListener('pointermove', moveSwipe);
      this.canvas.addEventListener('pointerup', endSwipe);
      this.canvas.addEventListener('pointercancel', endSwipe);
    }

    showMenu() {
      this.state = 'MENU';
      this.clearEntities();
      this.startScreen.classList.add('active');
      this.pauseScreen.classList.remove('active');
      this.gameOverScreen.classList.remove('active');
      this.howToModal.classList.remove('active');
    }

    startGame() {
      this.state = 'PLAYING';
      this.score = 0;
      this.lives = 3;
      this.elapsedFrames = 0;
      this.spawnTimer = 0;

      this.clearEntities();
      this.updateScoreUI();
      this.updateLivesUI();

      this.startScreen.classList.remove('active');
      this.pauseScreen.classList.remove('active');
      this.gameOverScreen.classList.remove('active');
    }

    pauseGame() {
      if (this.state === 'PLAYING') {
        this.state = 'PAUSED';
        this.pauseScreen.classList.add('active');
      }
    }

    resumeGame() {
      if (this.state === 'PAUSED') {
        this.state = 'PLAYING';
        this.pauseScreen.classList.remove('active');
      }
    }

    gameOver() {
      this.state = 'GAME_OVER';
      this.sound.playGameOver();

      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        localStorage.setItem(STORAGE_KEY_BEST_SCORE, this.bestScore.toString());
      }

      this.saveHighScore(this.score);
      this.updateScoreUI();
      this.renderLeaderboard();

      this.finalScoreEl.textContent = this.score;
      this.finalBestEl.textContent = this.bestScore;
      this.gameOverScreen.classList.add('active');
    }

    clearEntities() {
      this.fruits = [];
      this.fruitHalves = [];
      this.bombs = [];
      this.particles = [];
    }

    updateScoreUI() {
      this.scoreEl.textContent = this.score;
      this.bestScoreEl.textContent = this.bestScore;
    }

    updateLivesUI() {
      const badge1 = document.getElementById('life1');
      const badge2 = document.getElementById('life2');
      const badge3 = document.getElementById('life3');

      if (!badge1) return;

      if (this.lives < 3) badge3.classList.add('lost'); else badge3.classList.remove('lost');
      if (this.lives < 2) badge2.classList.add('lost'); else badge2.classList.remove('lost');
      if (this.lives < 1) badge1.classList.add('lost'); else badge1.classList.remove('lost');
    }

    updateSpawning() {
      if (this.state !== 'PLAYING') return;

      this.spawnTimer++;
      const dynamicInterval = Math.max(45, 110 - Math.floor(this.score / 6));

      if (this.spawnTimer >= dynamicInterval) {
        this.spawnTimer = 0;
        this.spawnWave();
      }
    }

    spawnWave() {
      const count = Math.min(5, 1 + Math.floor(Math.random() * (1 + Math.floor(this.score / 8))));
      const bombChance = Math.min(0.28, 0.05 + (this.score / 150));

      for (let i = 0; i < count; i++) {
        if (Math.random() < bombChance) {
          this.bombs.push(new Bomb(this.canvas.width, this.canvas.height));
        } else {
          const type = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
          this.fruits.push(new Fruit(type, this.canvas.width, this.canvas.height));
        }
      }
    }

    checkSlicingCollision(p1, p2) {
      const sliceAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

      this.fruits.forEach(fruit => {
        if (!fruit.sliced && this.lineIntersectsCircle(p1, p2, { x: fruit.x, y: fruit.y, r: fruit.radius })) {
          fruit.sliced = true;
          this.score += fruit.type.score;
          this.updateScoreUI();
          this.currentSwipeSlices++;
          this.swipeSlicePoints.push({ x: fruit.x, y: fruit.y });

          this.sound.playSlice();

          this.fruitHalves.push(new FruitHalf(fruit.type, fruit.x, fruit.y, sliceAngle, false));
          this.fruitHalves.push(new FruitHalf(fruit.type, fruit.x, fruit.y, sliceAngle, true));

          this.addJuiceSplash(fruit.x, fruit.y, fruit.type);
        }
      });

      this.bombs.forEach(bomb => {
        if (!bomb.sliced && this.lineIntersectsCircle(p1, p2, { x: bomb.x, y: bomb.y, r: bomb.radius })) {
          bomb.sliced = true;
          this.triggerBombExplosion(bomb.x, bomb.y);
        }
      });
    }

    lineIntersectsCircle(p1, p2, c) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.sqrt(dx * dx + dy * dy);

      if (len === 0) return false;

      const u = ((c.x - p1.x) * dx + (c.y - p1.y) * dy) / (len * len);
      const clampU = Math.max(0, Math.min(1, u));

      const nearestX = p1.x + clampU * dx;
      const nearestY = p1.y + clampU * dy;

      const distSq = (c.x - nearestX) ** 2 + (c.y - nearestY) ** 2;
      return distSq <= c.r ** 2;
    }

    addJuiceSplash(x, y, type) {
      for (let i = 0; i < 22; i++) {
        const color = type.juiceColors[Math.floor(Math.random() * type.juiceColors.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 9;
        this.particles.push(
          new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 3 + Math.random() * 4.5, 35 + Math.random() * 20)
        );
      }

      if (Math.random() < 0.65) {
        this.wallSplatters.push(new WallSplatter(x, y, type.juiceColors[0]));
        if (this.wallSplatters.length > 12) this.wallSplatters.splice(3, 1);
      }
    }

    triggerBombExplosion(x, y) {
      this.sound.playBombExplosion();
      this.lives--;
      this.updateLivesUI();

      this.container.classList.add('shake-screen');
      setTimeout(() => this.container.classList.remove('shake-screen'), 450);

      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 14;
        const color = i % 2 === 0 ? '#ff2244' : '#ffcc00';
        this.particles.push(
          new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 4 + Math.random() * 6, 45, 'spark')
        );
      }

      if (this.lives <= 0) {
        this.gameOver();
      }
    }

    triggerCombo(count, points) {
      const bonus = count;
      this.score += bonus;
      this.updateScoreUI();
      this.sound.playCombo();

      let avgX = this.canvas.width / 2;
      let avgY = this.canvas.height / 2;
      if (points && points.length > 0) {
        avgX = points.reduce((acc, p) => acc + p.x, 0) / points.length;
        avgY = points.reduce((acc, p) => acc + p.y, 0) / points.length;
      }

      // Combo praise matching reference image: "GOOD JOB! +5"
      let phrase = 'GOOD JOB!';
      if (count === 3) phrase = 'COMBO!';
      else if (count === 4) phrase = 'AWESOME!';
      else if (count >= 5) phrase = 'GOOD JOB!';

      const popup = document.createElement('div');
      popup.className = 'combo-popup';
      popup.style.left = `${avgX}px`;
      popup.style.top = `${avgY}px`;
      popup.innerHTML = `
        <div class="combo-title">${phrase}</div>
        <div class="combo-bonus">+${bonus}</div>
      `;

      this.comboOverlay.appendChild(popup);
      setTimeout(() => {
        if (popup.parentNode) popup.parentNode.removeChild(popup);
      }, 1100);
    }

    addSpark(x, y) {
      this.particles.push(
        new Particle(x, y, (Math.random() - 0.5) * 3, -1 - Math.random() * 3, '#ffea00', 2.5, 14, 'spark')
      );
    }

    getHighScores() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_HIGH_SCORES) || '[]');
      } catch (e) {
        return [];
      }
    }

    saveHighScore(scoreVal) {
      if (scoreVal <= 0) return;
      let scores = this.getHighScores();
      scores.push({
        score: scoreVal,
        date: new Date().toLocaleDateString()
      });
      scores.sort((a, b) => b.score - a.score);
      scores = scores.slice(0, 5);

      try {
        localStorage.setItem(STORAGE_KEY_HIGH_SCORES, JSON.stringify(scores));
      } catch (e) {}
    }

    renderLeaderboard() {
      if (!this.leaderboardBody) return;
      const scores = this.getHighScores();
      this.leaderboardBody.innerHTML = '';

      if (!scores.length) {
        this.leaderboardBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#a8917e;">No High Scores Yet</td></tr>';
        return;
      }

      scores.forEach((entry, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>#${idx + 1}</td>
          <td style="color:#ffcc00; font-weight:800;">${entry.score}</td>
          <td>${entry.date}</td>
        `;
        this.leaderboardBody.appendChild(tr);
      });
    }

    /* ==========================================================================
       7. HORIZONTAL MAHOGANY DOJO WOOD PLANK BACKGROUND & CRIMSON CURTAINS
       ========================================================================== */
    initWoodBackgroundCache(w, h) {
      if (!this.woodCanvas) {
        this.woodCanvas = document.createElement('canvas');
      }
      if (this.woodCanvas.width === w && this.woodCanvas.height === h) {
        return;
      }
      this.woodCanvas.width = w;
      this.woodCanvas.height = h;
      const ctx = this.woodCanvas.getContext('2d');

      // 1. Rich Warm Mahogany Wood Base Gradient
      const baseGrad = ctx.createLinearGradient(0, 0, 0, h);
      baseGrad.addColorStop(0, '#2b1408');
      baseGrad.addColorStop(0.3, '#42220f');
      baseGrad.addColorStop(0.6, '#361b0c');
      baseGrad.addColorStop(1, '#1e0d05');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Horizontal Planks (5 Planks)
      const plankCount = 5;
      const plankH = h / plankCount;

      for (let i = 0; i < plankCount; i++) {
        const py = i * plankH;

        // Horizontal plank lighting gradient
        const pGrad = ctx.createLinearGradient(0, py, 0, py + plankH);
        pGrad.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
        pGrad.addColorStop(0.06, 'rgba(255, 190, 110, 0.09)');
        pGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
        pGrad.addColorStop(0.94, 'rgba(0, 0, 0, 0.25)');
        pGrad.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
        ctx.fillStyle = pGrad;
        ctx.fillRect(0, py, w, plankH);

        // Horizontal Seam Dark Groove
        ctx.fillStyle = '#0a0401';
        ctx.fillRect(0, py, w, 5);

        // Plank Seam Golden Highlight Edge
        ctx.fillStyle = 'rgba(255, 200, 120, 0.12)';
        ctx.fillRect(0, py + 5, w, 2);

        // Horizontal Wavy Wood Grain Lines
        ctx.strokeStyle = 'rgba(25, 10, 3, 0.2)';
        ctx.lineWidth = 1.6;
        for (let g = 0; g < 7; g++) {
          const gy = py + 8 + g * (plankH / 8);
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.bezierCurveTo(
            w * 0.33, gy + (i % 2 === 0 ? 12 : -12),
            w * 0.66, gy + (i % 2 === 0 ? -12 : 12),
            w, gy
          );
          ctx.stroke();
        }

        // Wood Knots on some planks
        if (i === 1 || i === 3) {
          const knotX = w * (i === 1 ? 0.38 : 0.72);
          const knotY = py + plankH * 0.5;
          ctx.save();
          ctx.translate(knotX, knotY);
          ctx.scale(2.2, 1);
          for (let k = 4; k > 0; k--) {
            ctx.beginPath();
            ctx.arc(0, 0, k * 5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(20, 8, 2, ${0.12 + k * 0.04})`;
            ctx.lineWidth = 1.8;
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // 3. Faint Ancient Warrior Silhouette Engravings Etched in Wood
      ctx.save();
      ctx.strokeStyle = 'rgba(15, 6, 2, 0.32)';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      // Warrior 1 (Gladiator with sword)
      ctx.beginPath();
      ctx.arc(w * 0.38, h * 0.44, 13, 0, Math.PI * 2);
      ctx.moveTo(w * 0.38, h * 0.46);
      ctx.lineTo(w * 0.38, h * 0.58);
      ctx.lineTo(w * 0.34, h * 0.72);
      ctx.moveTo(w * 0.38, h * 0.58);
      ctx.lineTo(w * 0.42, h * 0.72);
      ctx.moveTo(w * 0.38, h * 0.48);
      ctx.lineTo(w * 0.46, h * 0.42);
      ctx.lineTo(w * 0.53, h * 0.35);
      ctx.stroke();

      // Warrior 2 (Spear & Shield)
      ctx.beginPath();
      ctx.arc(w * 0.62, h * 0.44, 13, 0, Math.PI * 2);
      ctx.moveTo(w * 0.62, h * 0.46);
      ctx.lineTo(w * 0.62, h * 0.58);
      ctx.lineTo(w * 0.58, h * 0.72);
      ctx.moveTo(w * 0.62, h * 0.58);
      ctx.lineTo(w * 0.66, h * 0.72);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(w * 0.58, h * 0.52, 15, 22, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w * 0.52, h * 0.42);
      ctx.lineTo(w * 0.74, h * 0.38);
      ctx.stroke();
      ctx.restore();

      // 4. Crimson Velvet Corner Drapes
      ctx.save();
      const leftCurtain = ctx.createLinearGradient(0, 0, w * 0.22, h * 0.35);
      leftCurtain.addColorStop(0, '#5a0610');
      leftCurtain.addColorStop(0.4, '#8a0a18');
      leftCurtain.addColorStop(0.8, '#4a030c');
      leftCurtain.addColorStop(1, 'rgba(50, 2, 8, 0)');
      ctx.fillStyle = leftCurtain;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w * 0.24, 0);
      ctx.bezierCurveTo(w * 0.18, h * 0.22, w * 0.1, h * 0.35, 0, h * 0.46);
      ctx.closePath();
      ctx.fill();

      const rightCurtain = ctx.createLinearGradient(w, 0, w * 0.78, h * 0.35);
      rightCurtain.addColorStop(0, '#5a0610');
      rightCurtain.addColorStop(0.4, '#8a0a18');
      rightCurtain.addColorStop(0.8, '#4a030c');
      rightCurtain.addColorStop(1, 'rgba(50, 2, 8, 0)');
      ctx.fillStyle = rightCurtain;
      ctx.beginPath();
      ctx.moveTo(w, 0);
      ctx.lineTo(w * 0.76, 0);
      ctx.bezierCurveTo(w * 0.82, h * 0.22, w * 0.9, h * 0.35, w, h * 0.46);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 5. Warm Central Spotlight & Vignette
      const spot = ctx.createRadialGradient(w / 2, h * 0.45, w * 0.1, w / 2, h * 0.45, w * 0.75);
      spot.addColorStop(0, 'rgba(255, 185, 90, 0.14)');
      spot.addColorStop(0.65, 'rgba(0, 0, 0, 0.15)');
      spot.addColorStop(1, 'rgba(8, 3, 1, 0.7)');
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, w, h);
    }

    drawWoodBackground() {
      const w = this.canvas.width;
      const h = this.canvas.height;
      if (this.bgImage && this.bgImage.complete && this.bgImage.naturalWidth > 0) {
        this.ctx.drawImage(this.bgImage, 0, 0, w, h);
        return;
      }
      this.initWoodBackgroundCache(w, h);
      this.ctx.drawImage(this.woodCanvas, 0, 0);
    }

    /* ==========================================================================
       8. MAIN ENGINE ANIMATION LOOP
       ========================================================================== */
    loop() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.drawWoodBackground();

      this.wallSplatters.forEach(splat => splat.draw(this.ctx));
      this.wallSplatters = this.wallSplatters.filter(s => s.life > 0);

      if (this.state === 'MENU') {
        if (Math.random() < 0.02) {
          const type = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
          this.fruits.push(new Fruit(type, this.canvas.width, this.canvas.height));
        }
      }

      if (this.state === 'PLAYING') {
        this.updateSpawning();
        this.elapsedFrames++;
      }

      this.fruits.forEach(fruit => {
        if (this.state !== 'PAUSED') fruit.update();
        fruit.draw(this.ctx);

        if (this.state === 'PLAYING' && !fruit.sliced && fruit.y > this.canvas.height + fruit.radius + 50) {
          fruit.sliced = true;
          this.lives--;
          this.updateLivesUI();
          if (this.lives <= 0) {
            this.gameOver();
          }
        }
      });
      this.fruits = this.fruits.filter(f => !f.sliced && f.y <= this.canvas.height + f.radius + 60);

      this.fruitHalves.forEach(half => {
        if (this.state !== 'PAUSED') half.update();
        half.draw(this.ctx);
      });
      this.fruitHalves = this.fruitHalves.filter(h => h.life > 0);

      this.bombs.forEach(bomb => {
        if (this.state !== 'PAUSED') bomb.update(this);
        bomb.draw(this.ctx);
      });
      this.bombs = this.bombs.filter(b => !b.sliced && b.y <= this.canvas.height + b.radius + 60);

      this.particles.forEach(p => {
        if (this.state !== 'PAUSED') p.update();
        p.draw(this.ctx);
      });
      this.particles = this.particles.filter(p => p.life > 0);

      this.blade.update();
      this.blade.draw(this.ctx);

      requestAnimationFrame(this.loop);
    }
  }

  if (document.readyState !== 'loading') {
    window.gameInstance = new GameEngine();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      window.gameInstance = new GameEngine();
    });
  }
})();
