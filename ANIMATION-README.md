# Particle U portfolio update

The opening hero recreates the visible star-field style of the supplied reference with original Canvas animation code. It is a visual recreation, not an extraction of OpenAI's renderer; exact timing and choreography have not been verified against the live reference.

- A nebula resolves into four glowing U ribbons.
- Blue, white, and warm orange stars twinkle and flow along the letter.
- Drag horizontally or vertically to rotate, or focus the canvas and use arrow keys.
- The replay button restarts the reveal.
- Scrolling the opening hero morphs the U toward a spherical star field.
- Motion stops when the hero is offscreen or the tab is hidden.
- Reduced-motion users see the completed shape without continuous motion.
- Mobile uses fewer particles and caps rendering resolution.

The opening labels are Muhammad / Uzair. Your previous hero is now the profile section directly below. All existing sections and assistant functionality are retained. The assistant and old grid background appear below the opening hero, so they do not cover the particle animation or its controls.

## Run and deploy

Use Node.js 22.12+ or Node.js 24.

```sh
npm install
npm run dev
```

Production:

```sh
npm run build
```

On Vercel select Vite, use `npm run build`, and set the output folder to `dist`. No additional API, account, or environment variable is needed for the animation. Existing assistant environment configuration remains separate.

Double-click ANIMATION-PREVIEW.html to view the animation without installing anything. This file demonstrates only the animation, not the complete portfolio.

## Files changed

- src/App.tsx: mounts the particle intro and moves the existing hero to #profile.
- src/components/ParticleHero.tsx: labels, links, replay and scroll binding.
- src/components/particle-field.js: Canvas renderer and interaction lifecycle.
- src/components/particle-field.d.ts: TypeScript API.
- src/components/particle-hero.css: desktop and mobile styling.

To change labels, pass leftLabel and rightLabel to ParticleHero in App.tsx. To force a lower particle count, pass quality="low".
