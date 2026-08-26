import React, { useEffect, useRef } from 'react';
import { WeatherTheme } from '../types';

interface WeatherCanvasBackgroundProps {
  theme: WeatherTheme;
  windSpeedKph?: number;
  isDay?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  phase?: number;
  length?: number;
  type?: string;
  rotation?: number;
  vRot?: number;
}

interface Splash {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const WeatherCanvasBackground: React.FC<WeatherCanvasBackgroundProps> = ({
  theme,
  windSpeedKph = 14,
  isDay = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Photographic high-resolution cinematic backdrop mapping matching the reference image's golden mountain lake aesthetic
  const getBackdropStyle = () => {
    switch (theme) {
      case 'sunny':
      case 'partly-cloudy-day':
        return {
          backgroundImage: `
            radial-gradient(circle at 18% 28%, rgba(251, 191, 36, 0.45) 0%, rgba(245, 158, 11, 0.25) 25%, transparent 60%),
            radial-gradient(circle at 85% 15%, rgba(56, 189, 248, 0.3) 0%, transparent 50%),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.4) 0%, rgba(10, 15, 30, 0.75) 100%),
            url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop')
          `,
        };
      case 'clear-night':
      case 'partly-cloudy-night':
        return {
          backgroundImage: `
            radial-gradient(circle at 75% 25%, rgba(34, 211, 238, 0.3) 0%, transparent 45%),
            linear-gradient(to bottom, rgba(2, 6, 23, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%),
            url('https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?q=80&w=2000&auto=format&fit=crop')
          `,
        };
      case 'rain':
      case 'thunderstorm':
        return {
          backgroundImage: `
            radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.7) 0%, rgba(2, 6, 23, 0.9) 100%),
            url('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2000&auto=format&fit=crop')
          `,
        };
      case 'snow':
        return {
          backgroundImage: `
            radial-gradient(circle at 50% 20%, rgba(224, 242, 254, 0.35) 0%, transparent 50%),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.85) 100%),
            url('https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=2000&auto=format&fit=crop')
          `,
        };
      case 'fog':
      case 'cloudy':
      case 'overcast':
      default:
        return {
          backgroundImage: `
            radial-gradient(circle at 40% 30%, rgba(148, 163, 184, 0.3) 0%, transparent 50%),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0.85) 100%),
            url('https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=2000&auto=format&fit=crop')
          `,
        };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const splashes: Splash[] = [];
    let lightningTimer = 0;
    let lightningFlashAlpha = 0;
    let shootingStarTimer = 0;

    const windFactor = Math.min(Math.max((windSpeedKph - 5) / 30, -1), 2);

    const initParticles = () => {
      particles.length = 0;
      splashes.length = 0;

      if (theme === 'rain' || theme === 'thunderstorm') {
        const count = theme === 'thunderstorm' ? 140 : 100;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * (width + 200) - 100,
            y: Math.random() * height,
            vx: 2 + windFactor * 4 + (Math.random() - 0.5),
            vy: 14 + Math.random() * 10,
            size: 1 + Math.random() * 1.5,
            length: 15 + Math.random() * 20,
            alpha: 0.3 + Math.random() * 0.5,
            maxAlpha: 0.8,
          });
        }
      } else if (theme === 'snow') {
        const count = 80;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 1.5 + windFactor * 2,
            vy: 0.8 + Math.random() * 2,
            size: 2 + Math.random() * 3.5,
            alpha: 0.4 + Math.random() * 0.6,
            maxAlpha: 1,
            phase: Math.random() * Math.PI * 2,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.04,
          });
        }
      } else if (theme === 'clear-night' || theme === 'partly-cloudy-night') {
        const count = 100;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0,
            size: 0.8 + Math.random() * 2,
            alpha: Math.random(),
            maxAlpha: 0.4 + Math.random() * 0.6,
            phase: Math.random() * Math.PI * 2,
          });
        }
      } else if (theme === 'sunny' || theme === 'partly-cloudy-day') {
        const count = 45;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6 + windFactor * 0.4,
            vy: -0.3 - Math.random() * 0.6,
            size: 2 + Math.random() * 4,
            alpha: 0.2 + Math.random() * 0.4,
            maxAlpha: 0.6,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    initParticles();

    let shootingStar: { x: number; y: number; vx: number; vy: number; length: number; alpha: number } | null = null;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Handle lightning
      if (theme === 'thunderstorm') {
        lightningTimer++;
        if (lightningTimer > 180 && Math.random() < 0.02) {
          lightningFlashAlpha = 0.7 + Math.random() * 0.3;
          lightningTimer = 0;
        }

        if (lightningFlashAlpha > 0) {
          ctx.fillStyle = `rgba(220, 240, 255, ${lightningFlashAlpha * 0.35})`;
          ctx.fillRect(0, 0, width, height);
          lightningFlashAlpha *= 0.85;
          if (lightningFlashAlpha < 0.01) lightningFlashAlpha = 0;
        }
      }

      // Handle Rain & Splashes
      if (theme === 'rain' || theme === 'thunderstorm') {
        ctx.strokeStyle = theme === 'thunderstorm' ? 'rgba(180, 220, 255, 0.65)' : 'rgba(160, 210, 255, 0.55)';
        ctx.lineWidth = 1.2;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 1.5, p.y + (p.length || 15));
          ctx.stroke();

          p.x += p.vx;
          p.y += p.vy;

          if (p.y > height - 20) {
            if (Math.random() < 0.3) {
              splashes.push({
                x: p.x,
                y: height - 10 + (Math.random() - 0.5) * 8,
                radius: 1,
                maxRadius: 6 + Math.random() * 6,
                alpha: 0.6,
              });
            }
            p.y = -20;
            p.x = Math.random() * (width + 200) - 100;
          }
        }

        for (let s = splashes.length - 1; s >= 0; s--) {
          const sp = splashes[s];
          ctx.beginPath();
          ctx.ellipse(sp.x, sp.y, sp.radius * 2, sp.radius * 0.6, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(180, 220, 255, ${sp.alpha})`;
          ctx.stroke();

          sp.radius += 0.4;
          sp.alpha -= 0.04;
          if (sp.alpha <= 0 || sp.radius >= sp.maxRadius) {
            splashes.splice(s, 1);
          }
        }
      }

      // Handle Snow
      else if (theme === 'snow') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.phase = (p.phase || 0) + 0.02;
          p.x += p.vx + Math.sin(p.phase) * 0.8;
          p.y += p.vy;

          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          if (p.x > width + 10) p.x = -10;
          if (p.x < -10) p.x = width + 10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240, 248, 255, ${p.alpha})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Handle Stars & Night
      else if (theme === 'clear-night' || theme === 'partly-cloudy-night') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.phase = (p.phase || 0) + 0.03;
          const currentAlpha = 0.2 + (Math.sin(p.phase) + 1) * 0.5 * p.maxAlpha;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
          if (p.size > 1.5) {
            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(167, 243, 208, 0.8)';
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        shootingStarTimer++;
        if (shootingStarTimer > 240 && !shootingStar && Math.random() < 0.02) {
          shootingStar = {
            x: Math.random() * (width * 0.7),
            y: Math.random() * (height * 0.3),
            vx: 8 + Math.random() * 6,
            vy: 4 + Math.random() * 4,
            length: 80 + Math.random() * 60,
            alpha: 1,
          };
          shootingStarTimer = 0;
        }

        if (shootingStar) {
          ctx.beginPath();
          const grad = ctx.createLinearGradient(
            shootingStar.x,
            shootingStar.y,
            shootingStar.x - shootingStar.vx * 4,
            shootingStar.y - shootingStar.vy * 4
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.alpha})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(shootingStar.x - shootingStar.vx * 4, shootingStar.y - shootingStar.vy * 4);
          ctx.stroke();

          shootingStar.x += shootingStar.vx;
          shootingStar.y += shootingStar.vy;
          shootingStar.alpha -= 0.025;

          if (shootingStar.alpha <= 0 || shootingStar.x > width || shootingStar.y > height) {
            shootingStar = null;
          }
        }
      }

      // Handle Sunny Solar Motes
      else if (theme === 'sunny' || theme === 'partly-cloudy-day') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.phase = (p.phase || 0) + 0.015;
          p.x += p.vx + Math.sin(p.phase) * 0.3;
          p.y += p.vy;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 230, 160, ${p.alpha * 0.6})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(251, 191, 36, 0.7)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, windSpeedKph, isDay]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-1000"
      style={getBackdropStyle()}
    >
      {/* Dynamic Sun Flare Overlay on top-left / golden hour lighting */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-slate-950/70 via-transparent to-amber-500/10 pointer-events-none" />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
