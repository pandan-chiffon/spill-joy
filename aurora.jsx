// aurora.jsx — slow-drifting aurora gradient background for Spill Joy
// Six palettes, each chosen to feel alive but calming.
// Blob motion uses very long animation loops (60–120 s) so the gradient
// shifts are perceptible without being distracting.

const PALETTES = {
  dawn: {
    label: 'Dawn',
    base: '#f6ecdc',
    ink: '#3a2e2a',
    accent: '#c97b5b',
    blobs: [
      { color: '#f4b5a0', x: 15, y: 20, size: 60 },
      { color: '#e9c8d8', x: 75, y: 30, size: 70 },
      { color: '#c9b8dc', x: 30, y: 75, size: 65 },
      { color: '#f3d9a0', x: 80, y: 80, size: 55 },
    ],
  },
  tide: {
    label: 'Tide',
    base: '#e8eff0',
    ink: '#243238',
    accent: '#5a8a95',
    blobs: [
      { color: '#a8c8d0', x: 20, y: 25, size: 65 },
      { color: '#c4dcd0', x: 80, y: 20, size: 60 },
      { color: '#e8b896', x: 25, y: 80, size: 55 },
      { color: '#b0b8d4', x: 78, y: 75, size: 65 },
    ],
  },
  meadow: {
    label: 'Meadow',
    base: '#eef0e2',
    ink: '#2a3528',
    accent: '#6f8a55',
    blobs: [
      { color: '#bcd4a4', x: 15, y: 30, size: 65 },
      { color: '#f1d49a', x: 78, y: 25, size: 60 },
      { color: '#d4b8c8', x: 25, y: 78, size: 55 },
      { color: '#a8c4b8', x: 80, y: 75, size: 70 },
    ],
  },
  dusk: {
    label: 'Dusk',
    base: '#ece4ea',
    ink: '#2e2838',
    accent: '#8a6a98',
    blobs: [
      { color: '#c4a8d0', x: 20, y: 25, size: 70 },
      { color: '#f0b8a8', x: 78, y: 30, size: 60 },
      { color: '#a8b8d4', x: 25, y: 78, size: 65 },
      { color: '#e8c4a8', x: 80, y: 78, size: 55 },
    ],
  },
  honey: {
    label: 'Honey',
    base: '#f3ecde',
    ink: '#3a2e1e',
    accent: '#c48c3a',
    blobs: [
      { color: '#f0cc8c', x: 18, y: 25, size: 65 },
      { color: '#e8a894', x: 78, y: 30, size: 55 },
      { color: '#d4c08a', x: 25, y: 78, size: 60 },
      { color: '#c8b4a0', x: 80, y: 78, size: 70 },
    ],
  },
  bloom: {
    label: 'Bloom',
    base: '#f0e8ee',
    ink: '#2e2a3a',
    accent: '#a06a9a',
    blobs: [
      { color: '#f4a8c4', x: 18, y: 22, size: 62 },
      { color: '#b8c4ea', x: 78, y: 25, size: 66 },
      { color: '#f0c89a', x: 25, y: 80, size: 58 },
      { color: '#c4a8e0', x: 80, y: 76, size: 68 },
    ],
  },
};

function AuroraBackground({ palette = 'dawn', speed = 1 }) {
  const p = PALETTES[palette] || PALETTES.dawn;
  const durations = [58, 74, 92, 110].map((d) => d / speed);
  const delays = [0, -18, -37, -55];

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: p.base,
      transition: 'background 1.2s ease',
      pointerEvents: 'none',
    }}>
      {p.blobs.map((b, i) => (
        <div key={`${palette}-${i}`} style={{
          position: 'absolute',
          width: `${b.size}vmax`,
          height: `${b.size}vmax`,
          left: `${b.x}%`,
          top: `${b.y}%`,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle at center, ${b.color} 0%, ${b.color}cc 25%, ${b.color}00 60%)`,
          filter: 'blur(40px)',
          opacity: 0.85,
          animation: `sj-drift-${i} ${durations[i]}s ease-in-out ${delays[i]}s infinite`,
          willChange: 'transform',
        }} />
      ))}

      {/* Subtle film grain — breaks up colour banding */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
            <filter id='n'>
              <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
              <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0'/>
            </filter>
            <rect width='100%' height='100%' filter='url(%23n)'/>
          </svg>`
        )}")`,
        opacity: 0.06,
        mixBlendMode: 'overlay',
      }} />

      {/* Soft vignette — pulls the eye toward center */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 60% at center, transparent 30%, ${p.ink}1a 100%)`,
      }} />

      <style>{`
        @keyframes sj-drift-0 {
          0%   { transform: translate(-50%,-50%) translate(0,0) scale(1); }
          33%  { transform: translate(-50%,-50%) translate(6vw,4vh) scale(1.08); }
          66%  { transform: translate(-50%,-50%) translate(-4vw,7vh) scale(0.95); }
          100% { transform: translate(-50%,-50%) translate(0,0) scale(1); }
        }
        @keyframes sj-drift-1 {
          0%   { transform: translate(-50%,-50%) translate(0,0) scale(1); }
          30%  { transform: translate(-50%,-50%) translate(-7vw,3vh) scale(0.92); }
          60%  { transform: translate(-50%,-50%) translate(-3vw,-6vh) scale(1.1); }
          100% { transform: translate(-50%,-50%) translate(0,0) scale(1); }
        }
        @keyframes sj-drift-2 {
          0%   { transform: translate(-50%,-50%) translate(0,0) scale(1); }
          40%  { transform: translate(-50%,-50%) translate(5vw,-5vh) scale(1.12); }
          75%  { transform: translate(-50%,-50%) translate(8vw,3vh) scale(0.96); }
          100% { transform: translate(-50%,-50%) translate(0,0) scale(1); }
        }
        @keyframes sj-drift-3 {
          0%   { transform: translate(-50%,-50%) translate(0,0) scale(1); }
          35%  { transform: translate(-50%,-50%) translate(-5vw,-4vh) scale(1.05); }
          70%  { transform: translate(-50%,-50%) translate(4vw,-7vh) scale(0.93); }
          100% { transform: translate(-50%,-50%) translate(0,0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="sj-drift"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

window.AuroraBackground = AuroraBackground;
window.PALETTES = PALETTES;
