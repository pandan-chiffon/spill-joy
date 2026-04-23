'use strict';

const { useState, useEffect, useRef, useCallback } = React;
const ce = React.createElement;

// ─── Quotes ───────────────────────────────────────────────────────────────────
const QUOTES = [
  "You've handled worse Tuesdays than this one.",
  "That thing you're overthinking? It's going to work out fine.",
  "Take the nap. Drink the water. Send the text tomorrow.",
  "You're doing better than you think you are — check your receipts.",
  "It's okay to not have it all figured out by 3pm.",
  "Small steps still move you forward. You're not stuck.",
  "The thing you're worrying about probably won't happen. And if it does, you'll handle it.",
  "You don't need to earn your rest. You already deserve it.",
  "Someone is glad you exist today, even if they haven't texted yet.",
  "Your best is allowed to look different on different days.",
  "You're allowed to outgrow things that used to fit you.",
  "The email can wait. Your peace can't.",
  "You've survived 100% of your hard days. That's a pretty good track record.",
  "It's not lazy to need a break. It's human.",
  "Whatever you're building is taking longer than you wanted, but it's still growing.",
  "You don't have to be perfect to be worth knowing.",
  "Sometimes the most productive thing you can do is nothing for a while.",
  "Your gut feeling about that situation? Trust it.",
  "Tomorrow is a new shot at this. Tonight, just breathe.",
  "You're not failing; you're just in the messy middle of figuring it out.",
  "The project doesn't need to be perfect; it needs to be done.",
  "Your pace is your pace. Stop looking at everyone else's timeline.",
  "Your \"good enough\" is probably someone else's \"how do they do it?\"",
  "It's not procrastination if you're letting an idea marinate.",
  "You can be grateful for the opportunity and tired from it at the same time.",
  "The thing you're putting off? It'll take 12 minutes. Just start.",
  "You don't need to have the solution right now. Asking questions counts.",
  "You're allowed to outgrow friends without it being a betrayal.",
  "It's brave to say \"I'm struggling\" instead of \"I'm fine.\"",
  "The version of you that needs help is just as worthy as the version that doesn't.",
  "You're not running out of ideas; you're just tired. Rest refills the well.",
  "Inspiration comes when you start moving, not when you're waiting to move.",
  "Today doesn't get to define your whole month.",
  "Sometimes the win is just getting to bedtime. That counts.",
  "You're not lazy; you're depleted. There's a difference.",
  "It's okay if the only thing you did today was survive it.",
  "The guilt you feel about resting is just noise. Ignore it.",
  "This feeling has an expiration date, even if you can't see it yet.",
  "You don't have to solve everything right now. Just get through the hour.",
  "It's okay to not be grateful for the lesson while you're learning it.",
  "Your nervous system is overwhelmed, not broken. Be gentle with it.",
  "Some days you just need to exist horizontally. Do it without apology.",
  "The world will keep turning if you log off for a day.",
  "You don't have to turn this pain into poetry. You can just feel it.",
  "It's okay to cry about something small when the big things are too heavy.",
  "You're not behind; you're just taking the scenic route through this mess.",
  "Sometimes the bravest thing is admitting today is not your day.",
  "Your worth isn't tied to your productivity. Write that on your mirror.",
  "It's okay to ask for help even if you \"should\" be able to handle it.",
  "This won't be the hardest thing you ever do. You've got proof you can survive.",
  "Tomorrow is a reset button. For now, just get there.",
  "Breathe. That's enough for right now.",
  "You're making more progress than you can see.",
  "It's okay to want more and appreciate what you have.",
  "The hard part is usually just starting. You're past that now.",
  "You're exactly where you need to be to get where you're going.",
  "Don't rush the thing that's trying to grow.",
  "You don't have to explain yourself today.",
  "Sometimes the bravest thing is just showing up.",
  "Let it be messy for a while. It won't always be.",
  "You're doing better than your worries say you are.",
  "The answer you're looking for is closer than you think.",
  "It's fine to not have a plan for once.",
  "You're allowed to take up room. All of it.",
  "Whatever you're feeling is valid, even if it's inconvenient.",
  "You don't have to earn the good thing that's coming.",
  "Rest is part of the process, not a pause from it.",
  "You've survived enough to know you can handle this.",
  "It's okay if today looks different than you expected.",
  "Trust yourself a little more. You've got good instincts.",
  "This feeling won't last forever. Nothing does, and that's the good news.",
];

// ─── Aurora palettes ──────────────────────────────────────────────────────────
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

// ─── Breathing patterns ───────────────────────────────────────────────────────
const PATTERNS = {
  '4-7-8': { inhale: 4, hold: 7, exhale: 8 },
  '4-4-4': { inhale: 4, hold: 4, exhale: 4 },
  '4-2-6': { inhale: 4, hold: 2, exhale: 6 },
};

const DEFAULT_PALETTE      = 'dawn';
const DEFAULT_PATTERN      = '4-7-8';
const DEFAULT_SCIENCE_OPEN = true;

// ─── Aurora background ────────────────────────────────────────────────────────
function AuroraBackground({ palette = 'dawn', speed = 1 }) {
  const p = PALETTES[palette] || PALETTES.dawn;
  const durations = [58, 74, 92, 110].map((d) => d / speed);
  const delays = [0, -18, -37, -55];

  const svgNoise = "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";

  const keyframes = `
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
  `;

  return ce('div', {
    style: {
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: p.base,
      transition: 'background 1.2s ease',
      pointerEvents: 'none',
    },
  },
    ...p.blobs.map((b, i) => ce('div', { key: i, style: {
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
    }})),
    ce('div', { style: {
      position: 'absolute', inset: 0,
      backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svgNoise)}")`,
      opacity: 0.06,
      mixBlendMode: 'overlay',
    }}),
    ce('div', { style: {
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse 70% 60% at center, transparent 30%, ${p.ink}1a 100%)`,
    }}),
    ce('style', null, keyframes)
  );
}

// ─── Breathing circle ─────────────────────────────────────────────────────────
function BreathingCircle({ size = 460, phase = 'idle', progress = 0, accent = '#c97b5b', paper = '#f6ecdc', ink = '#3a2e2a', children }) {
  const idleRef = useRef(0);
  const [, tick] = useState(0);

  useEffect(() => {
    if (phase !== 'idle') return;
    let raf;
    const t0 = performance.now();
    const loop = (t) => {
      idleRef.current = ((t - t0) / 1000) % 6;
      tick((v) => v + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  let scale = 1;
  if (phase === 'idle') {
    const t = idleRef.current / 6;
    scale = 0.97 + 0.025 * Math.sin(t * Math.PI * 2);
  } else if (phase === 'inhale') {
    const eased = 1 - Math.pow(1 - progress, 2);
    scale = 0.80 + eased * 0.25;
  } else if (phase === 'hold') {
    scale = 1.05;
  } else if (phase === 'exhale') {
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    scale = 1.05 - eased * 0.25;
  }

  const r     = size / 2;
  const core  = r * 0.52 * scale;
  const mid   = r * 0.72 * scale;
  const outer = r * 0.92 * scale;

  return ce('div', { style: { position: 'relative', width: size, height: size } },
    ce('div', { style: {
      position: 'absolute', left: '50%', top: '50%',
      width: core * 2, height: core * 2,
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.42)',
      backdropFilter: 'blur(18px) saturate(1.1)',
      WebkitBackdropFilter: 'blur(18px) saturate(1.1)',
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.6), 0 10px 40px ${ink}22, 0 2px 8px ${ink}11`,
      border: '1px solid rgba(255,255,255,0.5)',
      transition: 'width 0.25s ease, height 0.25s ease',
    }}),
    ce('svg', {
      width: size, height: size,
      viewBox: `0 0 ${size} ${size}`,
      style: { display: 'block', position: 'absolute', inset: 0, pointerEvents: 'none' },
      'aria-hidden': 'true',
    },
      ce('defs', null,
        ce('radialGradient', { id: 'sj-glow', cx: '50%', cy: '50%', r: '50%' },
          ce('stop', { offset: '0%',   stopColor: accent, stopOpacity: '0.22' }),
          ce('stop', { offset: '60%',  stopColor: accent, stopOpacity: '0.06' }),
          ce('stop', { offset: '100%', stopColor: accent, stopOpacity: '0'    })
        )
      ),
      ce('circle', { cx: r, cy: r, r: outer + 30, fill: 'url(#sj-glow)' }),
      ce('circle', { cx: r, cy: r, r: outer, fill: 'none', stroke: ink, strokeOpacity: '0.14', strokeWidth: '1' }),
      ce('circle', { cx: r, cy: r, r: mid,   fill: 'none', stroke: ink, strokeOpacity: '0.22', strokeWidth: '1' })
    ),
    ce('div', {
      style: {
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: size * 0.15,
      },
    }, children)
  );
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────
function GhostLink({ children, onClick, color = 'rgba(0,0,0,0.45)', hoverColor = 'rgba(0,0,0,0.75)' }) {
  return ce('button', {
    onClick,
    style: {
      border: 'none', background: 'transparent', cursor: 'pointer',
      fontFamily: 'inherit', fontSize: 13, color,
      letterSpacing: 0.3, padding: '6px 8px', transition: 'color 0.2s',
    },
    onMouseEnter: (e) => { e.currentTarget.style.color = hoverColor; },
    onMouseLeave: (e) => { e.currentTarget.style.color = color; },
  }, children);
}

// ─── Responsive size hook ─────────────────────────────────────────────────────
// Phones (< 480px) shrink the breathing circle so it fits within the viewport
// and stays horizontally centered. iPad (>= 480px) and desktop keep 460.
function useResponsiveCircleSize(desktopSize = 460, mobileBreakpoint = 480, mobileGutter = 16) {
  const get = () => {
    if (typeof window === 'undefined') return desktopSize;
    const w = window.innerWidth;
    if (w >= mobileBreakpoint) return desktopSize;
    return Math.max(240, Math.min(desktopSize, w - mobileGutter * 2));
  };
  const [size, setSize] = useState(get);
  useEffect(() => {
    const onResize = () => setSize(get());
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);
  return size;
}

// ─── Breathing controller hook ────────────────────────────────────────────────
function useBreathing(active, pattern) {
  const [phase,    setPhase]    = useState('idle');
  const [progress, setProgress] = useState(0);
  const [cycle,    setCycle]    = useState(0);
  const rafRef   = useRef(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      setPhase('idle');
      setProgress(0);
      return;
    }
    const { inhale, hold, exhale } = pattern;
    const cycleLen = inhale + hold + exhale;
    startRef.current = performance.now();

    const tick = (now) => {
      const elapsed = (now - startRef.current) / 1000;
      const t = elapsed % cycleLen;
      setCycle(Math.floor(elapsed / cycleLen));
      if (t < inhale) {
        setPhase('inhale');
        setProgress(t / inhale);
      } else if (t < inhale + hold) {
        setPhase('hold');
        setProgress((t - inhale) / hold);
      } else {
        setPhase('exhale');
        setProgress((t - inhale - hold) / exhale);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, pattern]);

  return { phase, progress, cycle };
}

// ─── Hold-to-breathe button ───────────────────────────────────────────────────
function HoldToBreathe({ onActiveChange, tone, phase }) {
  const [active, setActive] = useState(false);

  const down = useCallback((e) => {
    e.preventDefault();
    setActive(true);
    onActiveChange(true);
  }, [onActiveChange]);

  const up = useCallback(() => {
    setActive(false);
    onActiveChange(false);
  }, [onActiveChange]);

  const label = !active
    ? 'Hold to breathe'
    : phase === 'inhale' ? 'Breathe in'
    : phase === 'hold'   ? 'Hold'
    : phase === 'exhale' ? 'Breathe out'
    : 'Hold to breathe';

  return ce('button', {
    onPointerDown: down,
    onPointerUp: up,
    onPointerLeave: up,
    onPointerCancel: up,
    'aria-label': 'Hold to start breathing exercise',
    style: {
      border: `1px solid ${tone.ink}26`,
      background: active ? tone.ink : 'transparent',
      color: active ? tone.bg : tone.ink,
      fontFamily: 'inherit', fontSize: 14, letterSpacing: 0.5,
      padding: '14px 28px', borderRadius: 999,
      cursor: 'pointer', userSelect: 'none',
      WebkitUserSelect: 'none', touchAction: 'none',
      transition: 'background 0.4s ease, color 0.4s ease, transform 0.2s ease',
      transform: active ? 'scale(0.98)' : 'scale(1)',
      minWidth: 190,
    },
  }, label);
}

// ─── Science explainer ────────────────────────────────────────────────────────
function ScienceNote({ open, onToggle, tone }) {
  return ce('div', {
    style: {
      maxWidth: 520, textAlign: 'left',
      overflow: 'hidden',
      transition: 'max-height 0.5s ease, opacity 0.4s ease, margin-top 0.4s ease',
      maxHeight: open ? 260 : 24,
      marginTop: open ? 8 : 0,
    },
  },
    !open ? ce('div', { style: { textAlign: 'center' } },
      ce('button', {
        onClick: onToggle,
        style: {
          border: 'none', background: 'transparent', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 12, letterSpacing: 0.5,
          color: tone.ink, opacity: 0.55,
          borderBottom: `1px dashed ${tone.ink}44`, padding: '0 0 1px',
        },
      }, 'why does this help?')
    ) : null,
    open ? ce('div', {
      style: {
        padding: '16px 20px',
        background: `${tone.accent}14`,
        border: `1px solid ${tone.accent}33`,
        borderRadius: 14,
        fontSize: 13, lineHeight: 1.55,
        color: tone.ink, opacity: 0.82,
      },
    },
      ce('div', {
        style: { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 },
      }, 'Why this helps'),
      'Slow, paced breathing activates the ',
      ce('em', null, 'vagus nerve'),
      ' \u2014 the long wandering nerve that tells your body it\u2019s safe. A longer exhale than inhale tips the nervous system from ',
      ce('em', null, 'fight-or-flight'),
      ' toward ',
      ce('em', null, 'rest-and-digest'),
      '. You\u2019re not distracting yourself from the feeling; you\u2019re giving your body the one signal it can act on right now.',
      ce('button', {
        onClick: onToggle,
        style: {
          display: 'block', marginTop: 10,
          border: 'none', background: 'transparent', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 12, color: tone.ink, opacity: 0.55,
          padding: 0,
        },
      }, 'hide')
    ) : null
  );
}

// ─── Ask screen ───────────────────────────────────────────────────────────────
function AskScreen({ onSubmit, tone }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const circleSize = useResponsiveCircleSize();

  const canSubmit = value.trim().length > 0;
  const handleSubmit = () => { if (canSubmit) onSubmit(value.trim()); };

  return ce('div', {
    style: {
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.6s ease',
    },
  },
    ce(BreathingCircle, { size: circleSize, phase: 'idle', accent: tone.accent, paper: tone.bg, ink: tone.ink },
      ce('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' } },
        ce('div', { style: { fontSize: 28, fontWeight: 500, color: tone.ink, letterSpacing: -0.4, textAlign: 'center', lineHeight: 1.2 } },
          'How are you feeling?'
        ),
        ce('form', {
          onSubmit: (e) => { e.preventDefault(); handleSubmit(); },
          style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 },
        },
          ce('input', {
            ref: inputRef,
            value: value,
            onChange: (e) => setValue(e.target.value),
            placeholder: 'type an emotion',
            'aria-label': 'How are you feeling?',
            style: {
              width: 220, textAlign: 'center',
              border: 'none', outline: 'none',
              borderBottom: `1px solid ${tone.ink}33`,
              background: 'transparent',
              fontFamily: 'inherit', fontSize: 18,
              color: tone.ink, padding: '6px 2px',
              transition: 'border-color 0.2s',
            },
            onFocus: (e) => { e.target.style.borderBottomColor = tone.accent; },
            onBlur:  (e) => { e.target.style.borderBottomColor = `${tone.ink}33`; },
          }),
          ce('button', {
            type: 'submit',
            disabled: !canSubmit,
            style: {
              border: 'none', cursor: canSubmit ? 'pointer' : 'default',
              fontFamily: 'inherit', fontSize: 15, fontWeight: 500,
              letterSpacing: 0.2, padding: '12px 28px', borderRadius: 999,
              background: tone.ink, color: tone.bg,
              opacity: canSubmit ? 1 : 0.35,
              transition: 'opacity 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            },
          }, 'Feel better')
        )
      )
    )
  );
}

// ─── Result screen ────────────────────────────────────────────────────────────
function ResultScreen({ emotion, quote, onAnother, onReset, tone, pattern }) {
  const [breathing,   setBreathing]   = useState(false);
  const [scienceOpen, setScienceOpen] = useState(DEFAULT_SCIENCE_OPEN);
  const { phase, progress, cycle } = useBreathing(breathing, pattern);
  const circleSize = useResponsiveCircleSize();

  const circleContent = breathing
    ? ce('div', { style: { textAlign: 'center' } },
        ce('div', { style: { fontSize: 26, fontWeight: 500, color: tone.ink, letterSpacing: -0.3, textTransform: 'lowercase', opacity: 0.9 } },
          phase === 'inhale' ? 'breathe in' : phase === 'hold' ? 'hold' : phase === 'exhale' ? 'let go' : '\u2026'
        ),
        ce('div', { style: { marginTop: 10, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: tone.ink, opacity: 0.45 } },
          'cycle ' + (cycle + 1)
        )
      )
    : ce('div', { style: { fontSize: 20, fontWeight: 500, lineHeight: 1.4, color: tone.ink, textAlign: 'center', letterSpacing: -0.2, padding: '0 4px' } },
        ce('span', { style: { fontSize: 32, lineHeight: 0, verticalAlign: '-0.15em', color: tone.accent, marginRight: 2 } }, '\u201C'),
        quote,
        ce('span', { style: { fontSize: 32, lineHeight: 0, verticalAlign: '-0.3em', color: tone.accent, marginLeft: 2 } }, '\u201D')
      );

  return ce('div', {
    style: {
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 26, padding: '40px 24px',
      animation: 'fadeIn 0.7s ease',
    },
  },
    ce('div', { style: { fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: tone.ink, opacity: 0.45 } },
      'you said \u00B7 ',
      ce('span', { style: { opacity: 0.85, letterSpacing: 1 } }, emotion)
    ),
    ce(BreathingCircle, { size: circleSize, phase: phase, progress: progress, accent: tone.accent, paper: tone.bg, ink: tone.ink },
      circleContent
    ),
    ce(HoldToBreathe, { onActiveChange: setBreathing, tone: tone, phase: phase }),
    ce(ScienceNote, { open: scienceOpen, onToggle: () => setScienceOpen((v) => !v), tone: tone }),
    ce('div', { style: { display: 'flex', gap: 8, marginTop: 4 } },
      ce(GhostLink, { onClick: onAnother, color: `${tone.ink}70`, hoverColor: tone.ink }, 'another phrase \u21BB'),
      ce('span', { style: { color: tone.ink, opacity: 0.2, alignSelf: 'center' } }, '\u00B7'),
      ce(GhostLink, { onClick: onReset, color: `${tone.ink}70`, hoverColor: tone.ink }, 'start over')
    )
  );
}

// ─── Root app ─────────────────────────────────────────────────────────────────
function App() {
  const [screen,   setScreen]   = useState('ask');
  const [emotion,  setEmotion]  = useState('');
  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));

  const palette = PALETTES[DEFAULT_PALETTE];
  const tone    = { bg: palette.base, accent: palette.accent, ink: palette.ink };
  const pattern = PATTERNS[DEFAULT_PATTERN];

  const handleSubmit = (text) => {
    setEmotion(text);
    setQuoteIdx(Math.floor(Math.random() * QUOTES.length));
    setScreen('result');
  };

  const another = () => {
    let next = quoteIdx;
    while (next === quoteIdx && QUOTES.length > 1) next = Math.floor(Math.random() * QUOTES.length);
    setQuoteIdx(next);
  };

  const reset = () => { setScreen('ask'); setEmotion(''); };

  return ce('div', {
    style: {
      position: 'fixed', inset: 0,
      fontFamily: '"Inter", -apple-system, system-ui, sans-serif',
      color: tone.ink,
      overflow: 'hidden',
    },
  },
    ce(AuroraBackground, { palette: DEFAULT_PALETTE, speed: 1 }),
    ce('div', {
      style: {
        position: 'absolute', top: 22, left: 26, zIndex: 10,
        fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
        color: tone.ink, opacity: 0.5, fontWeight: 500,
      },
    }, 'spill joy'),
    screen === 'ask'
      ? ce(AskScreen, { onSubmit: handleSubmit, tone: tone })
      : null,
    screen === 'result'
      ? ce(ResultScreen, {
          emotion: emotion,
          quote: QUOTES[quoteIdx],
          onAnother: another,
          onReset: reset,
          tone: tone,
          pattern: pattern,
        })
      : null
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(ce(App, null));
