// app.jsx — Spill Joy main application
// Flow: Ask screen → Result screen (quote + breathing exercise)
// Breathing: 4-7-8 cycle (inhale 4s, hold 7s, exhale 8s)

const { useState, useEffect, useRef, useCallback } = React;

// ─── Breathing patterns ────────────────────────────────────────────
const PATTERNS = {
  '4-7-8': { inhale: 4, hold: 7, exhale: 8 },
  '4-4-4': { inhale: 4, hold: 4, exhale: 4 },
  '4-2-6': { inhale: 4, hold: 2, exhale: 6 },
};

const DEFAULT_PALETTE      = 'dawn';
const DEFAULT_PATTERN      = '4-7-8';
const DEFAULT_SCIENCE_OPEN = true;

// ─── Breathing controller hook ─────────────────────────────────────
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

// ─── Ask screen ────────────────────────────────────────────────────
function AskScreen({ onSubmit, tone }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const canSubmit = value.trim().length > 0;
  const handleSubmit = () => { if (canSubmit) onSubmit(value.trim()); };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.6s ease',
    }}>
      <BreathingCircle size={460} phase="idle" accent={tone.accent} paper={tone.bg} ink={tone.ink}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
          <div style={{
            fontSize: 28, fontWeight: 500,
            color: tone.ink, letterSpacing: -0.4,
            textAlign: 'center', lineHeight: 1.2,
          }}>
            How are you feeling?
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}
          >
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="type an emotion"
              aria-label="How are you feeling?"
              style={{
                width: 220, textAlign: 'center',
                border: 'none', outline: 'none',
                borderBottom: `1px solid ${tone.ink}33`,
                background: 'transparent',
                fontFamily: 'inherit', fontSize: 18,
                color: tone.ink, padding: '6px 2px',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e)  => { e.target.style.borderBottomColor = tone.accent; }}
              onBlur={(e)   => { e.target.style.borderBottomColor = `${tone.ink}33`; }}
            />
            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                border: 'none', cursor: canSubmit ? 'pointer' : 'default',
                fontFamily: 'inherit', fontSize: 15, fontWeight: 500,
                letterSpacing: 0.2, padding: '12px 28px', borderRadius: 999,
                background: tone.ink, color: tone.bg,
                opacity: canSubmit ? 1 : 0.35,
                transition: 'opacity 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              }}
            >
              Feel better
            </button>
          </form>
        </div>
      </BreathingCircle>
    </div>
  );
}

// ─── Hold-to-breathe button ────────────────────────────────────────
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

  return (
    <button
      onPointerDown={down}
      onPointerUp={up}
      onPointerLeave={up}
      onPointerCancel={up}
      aria-label="Hold to start breathing exercise"
      style={{
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
      }}
    >
      {label}
    </button>
  );
}

// ─── Science explainer ─────────────────────────────────────────────
function ScienceNote({ open, onToggle, tone }) {
  return (
    <div style={{
      maxWidth: 520, textAlign: 'left',
      overflow: 'hidden',
      transition: 'max-height 0.5s ease, opacity 0.4s ease, margin-top 0.4s ease',
      maxHeight: open ? 260 : 24,
      marginTop: open ? 8 : 0,
    }}>
      {!open && (
        <div style={{ textAlign: 'center' }}>
          <button onClick={onToggle} style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 12, letterSpacing: 0.5,
            color: tone.ink, opacity: 0.55,
            borderBottom: `1px dashed ${tone.ink}44`, padding: '0 0 1px',
          }}>
            why does this help?
          </button>
        </div>
      )}
      {open && (
        <div style={{
          padding: '16px 20px',
          background: `${tone.accent}14`,
          border: `1px solid ${tone.accent}33`,
          borderRadius: 14,
          fontSize: 13, lineHeight: 1.55,
          color: tone.ink, opacity: 0.82,
        }}>
          <div style={{
            fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase',
            opacity: 0.6, marginBottom: 6,
          }}>
            Why this helps
          </div>
          Slow, paced breathing activates the <em>vagus nerve</em> — the long wandering
          nerve that tells your body it's safe. A longer exhale than inhale tips the
          nervous system from <em>fight-or-flight</em> toward <em>rest-and-digest</em>.
          You're not distracting yourself from the feeling; you're giving your body
          the one signal it can act on right now.
          <button onClick={onToggle} style={{
            display: 'block', marginTop: 10,
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 12, color: tone.ink, opacity: 0.55,
            padding: 0,
          }}>
            hide
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Result screen ─────────────────────────────────────────────────
function ResultScreen({ emotion, quote, onAnother, onReset, tone, pattern }) {
  const [breathing,    setBreathing]    = useState(false);
  const [scienceOpen,  setScienceOpen]  = useState(DEFAULT_SCIENCE_OPEN);
  const { phase, progress, cycle } = useBreathing(breathing, pattern);

  const circleContent = breathing ? (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 26, fontWeight: 500, color: tone.ink, letterSpacing: -0.3, textTransform: 'lowercase', opacity: 0.9 }}>
        {phase === 'inhale' ? 'breathe in' : phase === 'hold' ? 'hold' : phase === 'exhale' ? 'let go' : '…'}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: tone.ink, opacity: 0.45 }}>
        cycle {cycle + 1}
      </div>
    </div>
  ) : (
    <div style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.4, color: tone.ink, textAlign: 'center', letterSpacing: -0.2, padding: '0 4px' }}>
      <span style={{ fontSize: 32, lineHeight: 0, verticalAlign: '-0.15em', color: tone.accent, marginRight: 2 }}>"</span>
      {quote}
      <span style={{ fontSize: 32, lineHeight: 0, verticalAlign: '-0.3em',  color: tone.accent, marginLeft: 2 }}>"</span>
    </div>
  );

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 26, padding: '40px 24px',
      animation: 'fadeIn 0.7s ease',
    }}>
      <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: tone.ink, opacity: 0.45 }}>
        you said · <span style={{ opacity: 0.85, letterSpacing: 1 }}>{emotion}</span>
      </div>

      <BreathingCircle size={460} phase={phase} progress={progress} accent={tone.accent} paper={tone.bg} ink={tone.ink}>
        {circleContent}
      </BreathingCircle>

      <HoldToBreathe onActiveChange={setBreathing} tone={tone} phase={phase} />

      <ScienceNote open={scienceOpen} onToggle={() => setScienceOpen((v) => !v)} tone={tone} />

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <GhostLink onClick={onAnother} color={`${tone.ink}70`} hoverColor={tone.ink}>another phrase ↻</GhostLink>
        <span style={{ color: tone.ink, opacity: 0.2, alignSelf: 'center' }}>·</span>
        <GhostLink onClick={onReset}   color={`${tone.ink}70`} hoverColor={tone.ink}>start over</GhostLink>
      </div>
    </div>
  );
}

// ─── Root app ──────────────────────────────────────────────────────
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

  return (
    <div style={{
      position: 'fixed', inset: 0,
      fontFamily: '"Inter", -apple-system, system-ui, sans-serif',
      color: tone.ink,
      overflow: 'hidden',
    }}>
      {/* Aurora — slowly shifting gradient background */}
      <AuroraBackground palette={DEFAULT_PALETTE} speed={1} />

      {/* Wordmark — top left */}
      <div style={{
        position: 'absolute', top: 22, left: 26, zIndex: 10,
        fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
        color: tone.ink, opacity: 0.5,
        fontWeight: 500,
      }}>
        spill joy
      </div>


      {/* Screens */}
      {screen === 'ask' && (
        <AskScreen onSubmit={handleSubmit} tone={tone} />
      )}
      {screen === 'result' && (
        <ResultScreen
          emotion={emotion}
          quote={QUOTES[quoteIdx]}
          onAnother={another}
          onReset={reset}
          tone={tone}
          pattern={pattern}
        />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
