'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type Coin = {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  active: boolean;
  landed: boolean;
  bounceCount: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
};

type Tear = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

type FloatingText = {
  x: number;
  y: number;
  text: string;
  life: number;
  opacity: number;
};

type Pig = {
  x: number;
  y: number;
  width: number;
  height: number;
  legAngle: number;
  isEating: boolean;
  blinkTimer: number;
  isBlinking: boolean;
  // Properties for tripping/sitting/crying sequence
  isTripping: boolean;
  tripTimer: number;
  isSitting: boolean;
  sitTimer: number;
  isCrying: boolean;
  rotation: number;
};

type PigAnimationProps = {
  className?: string;
};

export function PigAnimation({ className }: PigAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const PIG_SCALE = 0.84;
  const COIN_SCALE = 0.8;
  const COIN_SIZE = 14;

  const playCoinSound = () => {
    // Optional: Add audio logic here
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const GROUND_OFFSET = 60;
    const PIG_SPEED = 0.7;
    const COIN_SPAWN_RATE = 50; // Increased spawn attempt frequency

    let frameCount = 0;

    // Mouse tracking for hover effect
    let mousePos = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const pig: Pig = {
      x: -100,
      y: 0,
      width: 80,
      height: 50,
      legAngle: 0,
      isEating: false,
      blinkTimer: 0,
      isBlinking: false,
      isTripping: false,
      tripTimer: 0,
      isSitting: false,
      sitTimer: 0,
      isCrying: false,
      rotation: 0,
    };

    let coins: Coin[] = [];
    let particles: Particle[] = [];
    let tears: Tear[] = [];
    let floatingTexts: FloatingText[] = [];

    const drawCoin = (x: number, y: number, size = 10, scale = 1) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
      ctx.strokeStyle = '#DAA520';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(-3, -3, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();

      ctx.fillStyle = '#DAA520';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('₱', 0, 1);

      ctx.restore();
    };

    const drawParticles = () => {
      particles.forEach((p) => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });
    };

    const drawTears = () => {
      tears.forEach((t) => {
        ctx.globalAlpha = Math.min(1, t.life);
        ctx.fillStyle = '#60a5fa'; // Slightly lighter blue for visibility
        ctx.beginPath();
        // Teardrop shape
        ctx.arc(t.x, t.y, 2.5, 0, Math.PI * 2);
        // Add a trail or stretch based on velocity for effect
        ctx.moveTo(t.x - 2, t.y);
        ctx.lineTo(t.x, t.y - 5);
        ctx.lineTo(t.x + 2, t.y);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });
    };

    const drawFloatingTexts = () => {
      floatingTexts.forEach((t) => {
        ctx.globalAlpha = t.opacity;
        ctx.fillStyle = '#16a34a'; // Green color for money
        ctx.font = 'bold 14px Arial';
        ctx.fillText(t.text, t.x, t.y);
        ctx.globalAlpha = 1.0;
      });
    };

    const drawPig = (
      x: number,
      y: number,
      legAngle: number,
      scale = 1,
      isEating = false,
      isBlinking = false,
      rotation = 0,
      isCrying = false,
      isTripping = false,
      isSitting = false,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation); // Apply trip/sit rotation
      ctx.scale(scale, scale);

      const bodyWidth = 60;
      const bodyHeight = 40;

      // --- Back Legs ---
      ctx.fillStyle = '#DDDDDD';
      // Left Back Leg
      ctx.save();
      ctx.translate(-10, bodyHeight / 2 - 5);
      if (isSitting) {
        // Tucked forward when sitting
        ctx.rotate(1.2);
      } else if (isTripping) {
        // Splayed back when tripping
        ctx.rotate(-1.0);
      } else {
        ctx.rotate(Math.sin(legAngle) * 0.4);
      }
      ctx.beginPath();
      ctx.roundRect(-4, 0, 8, 18, 4);
      ctx.fill();
      ctx.restore();

      // Right Back Leg
      ctx.save();
      ctx.translate(10, bodyHeight / 2 - 5);
      if (isSitting) {
        // Tucked forward when sitting
        ctx.rotate(1.0);
      } else if (isTripping) {
        // Splayed back when tripping
        ctx.rotate(-0.8);
      } else {
        ctx.rotate(Math.cos(legAngle) * 0.4);
      }
      ctx.beginPath();
      ctx.roundRect(-4, 0, 8, 18, 4);
      ctx.fill();
      ctx.restore();

      // --- Body Main ---
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(0, 0, bodyWidth / 2, bodyHeight / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // --- Head Circle ---
      ctx.beginPath();
      ctx.arc(bodyWidth / 2 - 5, -8, 22, 0, Math.PI * 2);
      ctx.fill();

      // --- Mouth & Snout Logic ---
      if (isEating && !isCrying && !isTripping && !isSitting) {
        // Open Mouth (dark cavity)
        ctx.fillStyle = '#6f1d1b';
        ctx.beginPath();
        ctx.ellipse(bodyWidth / 2 + 8, 2, 8, 8, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Snout (Shifted up and rotated)
        ctx.save();
        ctx.translate(bodyWidth / 2 + 12, -12);
        ctx.rotate(-0.4);
        ctx.fillStyle = '#FFD1DC';
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(3, -1, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        // Normal or Crying Snout
        ctx.fillStyle = '#FFD1DC';
        ctx.beginPath();
        ctx.ellipse(bodyWidth / 2 + 12, -5, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(bodyWidth / 2 + 15, -6, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Ear ---
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(bodyWidth / 2 - 5, -20);
      ctx.lineTo(bodyWidth / 2 + 5, -35);
      ctx.lineTo(bodyWidth / 2 + 15, -18);
      ctx.fill();

      // --- Eye Logic ---
      if (isCrying) {
        // Sad Eyes (Curves)
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Draw an arch for closed sad eye
        ctx.arc(bodyWidth / 2 + 2, -10, 3, Math.PI, 0);
        ctx.stroke();
      } else if (isTripping) {
        // X eyes for impact
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Left line
        ctx.moveTo(bodyWidth / 2, -14);
        ctx.lineTo(bodyWidth / 2 + 5, -9);
        // Right line
        ctx.moveTo(bodyWidth / 2 + 5, -14);
        ctx.lineTo(bodyWidth / 2, -9);
        ctx.stroke();
      } else if (isBlinking) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bodyWidth / 2, -12);
        ctx.lineTo(bodyWidth / 2 + 6, -12);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(bodyWidth / 2 + 2, -12, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Front Legs ---
      ctx.fillStyle = '#FFFFFF';

      // Left Front Leg
      ctx.save();
      ctx.translate(-10, bodyHeight / 2 - 2);
      if (isSitting) {
        // Straight down acting as support
        ctx.rotate(0.2);
      } else if (isTripping) {
        // Flailing forward
        ctx.rotate(0.8);
      } else {
        ctx.rotate(-Math.sin(legAngle) * 0.4);
      }
      ctx.beginPath();
      ctx.roundRect(-4, 0, 8, 18, 4);
      ctx.fill();
      ctx.restore();

      // Right Front Leg
      ctx.save();
      ctx.translate(10, bodyHeight / 2 - 2);
      if (isSitting) {
        // Straight down acting as support
        ctx.rotate(-0.1);
      } else if (isTripping) {
        // Flailing forward
        ctx.rotate(1.0);
      } else {
        ctx.rotate(-Math.cos(legAngle) * 0.4);
      }
      ctx.beginPath();
      ctx.roundRect(-4, 0, 8, 18, 4);
      ctx.fill();
      ctx.restore();

      // --- Tail ---
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-bodyWidth / 2, -5);
      ctx.bezierCurveTo(
        -bodyWidth / 2 - 15,
        -15,
        -bodyWidth / 2 - 15,
        5,
        -bodyWidth / 2 - 5,
        0,
      );
      ctx.stroke();

      ctx.restore();
    };

    const update = () => {
      const width = canvas.width;
      const height = canvas.height;
      const floorY = height - GROUND_OFFSET;

      if (width === 0) return;

      ctx.clearRect(0, 0, width, height);

      // --- Coin Spawning ---
      const activeCoins = coins.filter((c) => c.active);

      // Limit to 5 coins
      if (activeCoins.length < 5 && frameCount % COIN_SPAWN_RATE === 0) {
        // Determine the reference X to spawn after.
        // We want to spawn ahead of the pig AND ahead of any existing active coins
        // to maintain a clean line and avoid "backfilling" or "left spawning".
        const furthestX = activeCoins.reduce(
          (max, c) => Math.max(max, c.x),
          pig.x,
        );

        // Random position strictly ahead of the furthest point
        const minSpawnDistance = 150;
        const spawnRange = 250;
        const spawnX =
          furthestX + minSpawnDistance + Math.random() * spawnRange;

        coins.push({
          x: spawnX,
          y: -30,
          targetY: floorY - 8,
          vy: 6,
          active: true,
          landed: false,
          bounceCount: 0,
        });
      }

      // --- Update Coins ---
      coins.forEach((coin) => {
        if (!coin.active) return;

        if (!coin.landed) {
          coin.y += coin.vy;
          if (coin.y >= coin.targetY) {
            coin.y = coin.targetY;
            if (coin.bounceCount < 2) {
              coin.vy = -coin.vy * 0.4;
              coin.bounceCount += 1;
            } else {
              coin.landed = true;
            }
          } else {
            coin.vy += 0.5;
          }
        }
      });

      // --- Reset Pig Position ---
      if (pig.x > width + 60) {
        pig.x = -80;
        coins = [];
        particles = [];
        floatingTexts = [];
        tears = []; // Clear tears

        // Reset states
        pig.isTripping = false;
        pig.isSitting = false;
        pig.isCrying = false;
        pig.rotation = 0;

        coins.push({
          x: 150, // Fixed starter coin ahead of spawn
          y: floorY - 8,
          targetY: floorY - 8,
          vy: 0,
          active: true,
          landed: true,
          bounceCount: 2,
        });
      }

      // --- Trip / Sit / Cry Sequence Logic ---

      // 1. Trigger Trip on Hover (Collision Detection)
      if (
        !pig.isTripping &&
        !pig.isSitting &&
        !pig.isCrying &&
        pig.x > 0 &&
        pig.x < width - 100
      ) {
        const pigCenterY = floorY - 20 + pig.y;
        const dx = mousePos.x - pig.x;
        const dy = mousePos.y - pigCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // If cursor is within ~45px of pig center
        if (dist < 45) {
          pig.isTripping = true;
          pig.tripTimer = 0;
          // Initial impact bounce
        }
      }

      if (pig.isTripping) {
        pig.tripTimer++;

        // Exaggerated faceplant rotation (nose down 0.8 rads)
        if (pig.rotation < 0.8) {
          pig.rotation += 0.15;
        }

        // Slight bounce effect for impact
        if (pig.tripTimer < 10) {
          pig.y = -Math.sin(pig.tripTimer * 0.5) * 5;
        } else {
          pig.y = 0;
        }

        // Transition to Sitting after faceplant pause
        if (pig.tripTimer > 50) {
          pig.isTripping = false;
          pig.isSitting = true;
          pig.sitTimer = 0;
          // Start rotation from faceplant angle
          pig.rotation = 0.8;
        }
      } else if (pig.isSitting) {
        pig.sitTimer++;

        // Rotate body up to sitting position (slightly tilted back)
        // Target -0.2 rads
        const targetRotation = -0.2;
        if (pig.rotation > targetRotation) {
          pig.rotation -= 0.05;
        }

        // Start crying after being seated for a moment
        if (pig.sitTimer > 30) {
          pig.isCrying = true;
        }

        if (pig.isCrying) {
          // Shake slightly while crying - more intense for exaggerated effect
          pig.rotation = -0.2 + Math.sin(frameCount * 0.8) * 0.05;

          // Spawn Tears - Fountain style
          if (frameCount % 4 === 0) {
            // Increased spawn rate
            // Calculate eye position based on rotation
            // Eye is approx at (32, -12) relative to center
            const eyeX = 32;
            const eyeY = -12;
            const rx =
              Math.cos(pig.rotation) * eyeX - Math.sin(pig.rotation) * eyeY;
            const ry =
              Math.sin(pig.rotation) * eyeX + Math.cos(pig.rotation) * eyeY;

            // Exaggerated spray: Random horizontal velocity + strong upward burst
            const spread = (Math.random() - 0.5) * 6; // Wider spread
            const upForce = -2 - Math.random() * 2; // Shoot up!

            tears.push({
              x: pig.x + rx,
              y: floorY - 20 + ry,
              vx: spread,
              vy: upForce,
              life: 1.0,
            });
          }
        }

        // End sitting/crying state
        if (pig.sitTimer > 250) {
          // Sit for ~4 seconds
          pig.isSitting = false;
          pig.isCrying = false;
          pig.rotation = 0;
          pig.sitTimer = 0;
        }
      }

      // --- Blinking Logic ---
      // Only blink if not crying
      if (!pig.isCrying && !pig.isTripping) {
        pig.blinkTimer++;
        if (pig.blinkTimer > 150 + Math.random() * 100) {
          pig.isBlinking = true;
          if (pig.blinkTimer > 260) {
            pig.isBlinking = false;
            pig.blinkTimer = 0;
          }
        }
      }

      // --- Pig Movement & Eating ---
      let moving = false;
      pig.isEating = false;

      // Only move if not tripping or sitting
      if (!pig.isTripping && !pig.isSitting) {
        // Find the closest active coin ahead of the pig
        const candidates = coins.filter(
          (coin) => coin.active && coin.x > pig.x - 10,
        );
        // Sort by distance (x position) so pig targets the closest one first
        candidates.sort((a, b) => a.x - b.x);
        const targetCoin = candidates[0];

        if (targetCoin) {
          const dx = targetCoin.x - (pig.x + 30);

          if (dx > 5) {
            moving = true;
            pig.x += PIG_SPEED;
          } else if (dx < -5) {
            moving = true;
            pig.x += PIG_SPEED * 0.5;
          }

          // Open mouth when close to a landed coin
          if (Math.abs(dx) < 60 && targetCoin.landed) {
            pig.isEating = true;
          }

          const dist = Math.abs(dx);
          if (dist < 15 && targetCoin.landed) {
            targetCoin.active = false;
            playCoinSound();

            // Spawn Particles
            for (let i = 0; i < 6; i++) {
              particles.push({
                x: pig.x + 40 + Math.random() * 10,
                y: floorY - 10 + Math.random() * 5,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 1) * 4,
                life: 1.0,
                color: Math.random() > 0.5 ? '#FFD700' : '#FFFFFF',
              });
            }

            // Spawn Floating Text
            floatingTexts.push({
              x: pig.x + 40,
              y: floorY - 40,
              text: '+₱',
              life: 1.0,
              opacity: 1,
            });
          }
        } else {
          pig.x += PIG_SPEED;
          moving = true;
        }

        pig.legAngle += moving ? 0.15 : 0;
      }

      // --- Update & Draw Particles ---
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Gravity
        p.life -= 0.05;
      });
      particles = particles.filter((p) => p.life > 0);

      // --- Update & Draw Tears ---
      tears.forEach((t) => {
        t.x += t.vx; // Horizontal movement
        t.y += t.vy; // Vertical movement
        t.vy += 0.25; // Strong gravity for arc shape
        t.life -= 0.015;
      });
      tears = tears.filter((t) => t.life > 0);

      // --- Update & Draw Floating Text ---
      floatingTexts.forEach((t) => {
        t.y -= 0.8; // Float up
        t.life -= 0.02;
        t.opacity = t.life;
      });
      floatingTexts = floatingTexts.filter((t) => t.life > 0);

      // --- Draw Shadows ---
      const shadowScale = PIG_SCALE;
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.beginPath();
      // Adjust shadow when tripping
      const shadowX = pig.isTripping || pig.isSitting ? pig.x + 10 : pig.x;
      const shadowY = pig.y; // Follow pig Y bounce
      ctx.ellipse(
        shadowX,
        floorY + 8 * shadowScale + shadowY,
        30 * shadowScale,
        5 * shadowScale,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // --- Draw Scene Elements ---
      coins = coins.filter((coin) => coin.active || coin.y < floorY + 100);

      coins.forEach((coin) => {
        if (coin.active) drawCoin(coin.x, coin.y, COIN_SIZE, COIN_SCALE);
      });

      drawPig(
        pig.x,
        floorY - 20 + pig.y, // Apply Y offset (bounce)
        pig.legAngle,
        PIG_SCALE,
        pig.isEating,
        pig.isBlinking,
        pig.rotation,
        pig.isCrying,
        pig.isTripping,
        pig.isSitting,
      );
      drawParticles();
      drawTears();
      drawFloatingTexts();

      frameCount += 1;
      requestRef.current = window.requestAnimationFrame(update);
    };

    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    requestRef.current = window.requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) {
        window.cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn('block h-full w-full pointer-events-none', className)}
    />
  );
}

export default PigAnimation;
