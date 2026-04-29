"use client";

import { useEffect, useRef } from "react";

export function CanvasStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      // Ensure we cover the entire section, not just the window. 
      // Using parentElement to get the section dimensions.
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      alpha: number;
      alphaChange: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.radius = Math.random() * 2.5; // Larger stars
        this.color = Math.random() > 0.8 ? "#3B82F6" : "#ffffff";
        this.alpha = Math.random();
        // Super-Nova twinkle effect
        this.alphaChange = (Math.random() * 0.05) + 0.01;
        if (Math.random() > 0.5) this.alphaChange *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.alpha += this.alphaChange;
        if (this.alpha <= 0 || this.alpha >= 1) {
          this.alphaChange = -this.alphaChange;
        }
        this.draw();
      }
    }

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 6000); // denser
      for (let i = 0; i < Math.min(numParticles, 400); i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => p.update());
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none mix-blend-screen"
    />
  );
}
