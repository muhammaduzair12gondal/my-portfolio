export interface ParticleOptions {
  interactive?: boolean;
  centerX?: number;
  quality?: 'low' | 'high';
  background?: string;
}
export interface ParticleField { destroy(): void; replay(): void; setMorph(value: number): void; }
export function createParticleField(canvas: HTMLCanvasElement, options?: ParticleOptions): ParticleField;
