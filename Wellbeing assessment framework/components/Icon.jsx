
const CDN = 'https://unpkg.com/lucide@0.544.0/dist/umd/lucide.min.js';
const pascal = (s) => String(s).replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

function lib() {
  const l = typeof window !== 'undefined' ? window.lucide : null;
  return l ? (l.icons || l) : null;
}

/**
 * Lucide line icon, inherited colour, 1.7px stroke (Lifed's weight).
 * Requires <script src="https://unpkg.com/lucide@0.544.0/dist/umd/lucide.min.js"> on the page;
 * falls back to a flat CDN image if the library is missing.
 */
function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.7, title, style = {}, className = '' }) {
  const [, tick] = React.useState(0);
  React.useEffect(() => {
    if (lib()) return;
    let n = 0;
    const t = setInterval(() => { if (lib() || ++n > 40) { clearInterval(t); tick((v) => v + 1); } }, 100);
    if (!document.querySelector(`script[src="${CDN}"]`)) {
      const s = document.createElement('script'); s.src = CDN; document.head.appendChild(s);
    }
    return () => clearInterval(t);
  }, []);

  const node = (lib() || {})[pascal(name)];
  const common = {
    className,
    role: title ? 'img' : undefined,
    'aria-label': title,
    'aria-hidden': title ? undefined : 'true',
    style: { display: 'block', flex: '0 0 auto', ...style },
  };
  if (!node) {
    return <img src={`https://unpkg.com/lucide-static@0.544.0/icons/${name}.svg`} width={size} height={size} alt={title || ''} {...common} />;
  }
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      {...common}
    >
      {node.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }))}
    </svg>
  );
}

if (typeof module !== 'undefined') { module.exports = { Icon }; }
if (typeof window !== 'undefined') { window.Icon = Icon; }
