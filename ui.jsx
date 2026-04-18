// ui.jsx — shared UI primitives for Spill Joy

function SoftButton({ children, primary, onClick, onPointerDown, onPointerUp, onPointerLeave, style = {}, ...rest }) {
  return (
    <button
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      style={{
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 15,
        fontWeight: 500,
        letterSpacing: 0.2,
        padding: '12px 28px',
        borderRadius: 999,
        background: primary ? 'currentColor' : 'transparent',
        color: 'inherit',
        boxShadow: primary ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
        transition: 'transform 0.12s ease, opacity 0.2s ease',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

function GhostLink({ children, onClick, color = 'rgba(0,0,0,0.45)', hoverColor = 'rgba(0,0,0,0.75)' }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 13,
        color,
        letterSpacing: 0.3,
        padding: '6px 8px',
        transition: 'color 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = hoverColor; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = color; }}
    >
      {children}
    </button>
  );
}

window.SoftButton = SoftButton;
window.GhostLink = GhostLink;
