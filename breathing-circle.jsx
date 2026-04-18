// breathing-circle.jsx — animated SVG ring for Spill Joy
// Idle: gentle 6-second sinusoidal pulse.
// Breathing: scales through inhale → hold → exhale driven by the parent.

function BreathingCircle({
  size = 460,
  phase = 'idle',
  progress = 0,
  accent = '#c97b5b',
  paper = '#f6ecdc',
  ink = '#3a2e2a',
  children,
}) {
  const { useRef, useState, useEffect } = React;

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
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    scale = 1.05 - eased * 0.25;
  }

  const r = size / 2;
  const core  = r * 0.52 * scale;
  const mid   = r * 0.72 * scale;
  const outer = r * 0.92 * scale;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Frosted glass core — readable over the aurora */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '50%',
        width: core * 2, height: core * 2,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.42)',
        backdropFilter: 'blur(18px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.1)',
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.6), 0 10px 40px ${ink}22, 0 2px 8px ${ink}11`,
        border: '1px solid rgba(255,255,255,0.5)',
        transition: 'width 0.25s ease, height 0.25s ease',
      }} />

      <svg
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ display: 'block', position: 'absolute', inset: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="sj-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={accent} stopOpacity="0.22" />
            <stop offset="60%"  stopColor={accent} stopOpacity="0.06" />
            <stop offset="100%" stopColor={accent} stopOpacity="0"    />
          </radialGradient>
        </defs>
        <circle cx={r} cy={r} r={outer + 30} fill="url(#sj-glow)" />
        <circle cx={r} cy={r} r={outer} fill="none" stroke={ink} strokeOpacity="0.14" strokeWidth="1" />
        <circle cx={r} cy={r} r={mid}   fill="none" stroke={ink} strokeOpacity="0.22" strokeWidth="1" />
      </svg>

      {/* Content slot — centered inside the frosted core */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: size * 0.15,
      }}>
        {children}
      </div>
    </div>
  );
}

window.BreathingCircle = BreathingCircle;
