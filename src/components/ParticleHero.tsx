'use client';
import { useEffect, useRef } from 'react';
import { createParticleField } from './particle-field.js';
import './particle-hero.css';

export default function ParticleHero({ leftLabel = 'Muhammad', rightLabel = 'Uzair', quality }: { leftLabel?: string; rightLabel?: string; quality?: 'low' | 'high' }) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const field = useRef<ReturnType<typeof createParticleField> | null>(null);
  const section = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!canvas.current || !section.current) return;
    field.current = createParticleField(canvas.current, { interactive: true, quality });
    const onScroll = () => {
      if (!section.current || !field.current) return;
      const rect = section.current.getBoundingClientRect();
      field.current.setMorph(Math.min(1, Math.max(0, -rect.top / (rect.height * .8))));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll);field.current?.destroy();field.current = null; };
  }, [quality]);
  return <section id="hero" className="uzair-particle-hero" ref={section} aria-label="Muhammad Uzair portfolio introduction">
    <canvas className="uzair-particles" ref={canvas} tabIndex={0} role="img" aria-label="Glowing particle U. Drag or use arrow keys to rotate." />
    <h1 className="uzair-particle-name"><span>{leftLabel}</span><span>{rightLabel}</span></h1>
    <div className="uzair-particle-footer">
      <p>Full-stack development <span> / </span> AI integration</p>
      <div className="uzair-intro-actions"><a href="#profile">Meet the developer <span aria-hidden="true">↓</span></a><a href="#projects">View my work <span aria-hidden="true">↗</span></a></div>
    </div>
    <button type="button" className="uzair-particle-replay" onClick={() => field.current?.replay()} aria-label="Replay particle animation">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 7M4 4v6h6" /></svg>
    </button>
  </section>;
}
