/* @ds-bundle: {"format":4,"namespace":"LifedDesignSystem_d86b5c","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"ProgramCard","sourcePath":"components/cards/ProgramCard.jsx"},{"name":"StatCard","sourcePath":"components/cards/StatCard.jsx"},{"name":"StepCard","sourcePath":"components/cards/StepCard.jsx"},{"name":"TestimonialCard","sourcePath":"components/cards/TestimonialCard.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SearchBar","sourcePath":"components/forms/SearchBar.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Toggle","sourcePath":"components/forms/Toggle.jsx"},{"name":"CategoryTabs","sourcePath":"components/navigation/CategoryTabs.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"a0b45af8e193","components/buttons/IconButton.jsx":"6db2c270007f","components/cards/ProgramCard.jsx":"030a6b5e9f3a","components/cards/StatCard.jsx":"621ae322bb11","components/cards/StepCard.jsx":"190413ee33f4","components/cards/TestimonialCard.jsx":"dcd56717b862","components/display/Avatar.jsx":"0fe8e548e295","components/display/Badge.jsx":"ff0228b4031d","components/display/Tag.jsx":"7c5d4406b613","components/forms/Input.jsx":"c00507ed483e","components/forms/SearchBar.jsx":"afb828e8cae6","components/forms/Textarea.jsx":"8c4b12c2aec9","components/forms/Toggle.jsx":"98231785610d","components/navigation/CategoryTabs.jsx":"5ae2a564fa70","components/navigation/NavBar.jsx":"390931321aad","ui_kits/website/App.jsx":"bd9874f63373","ui_kits/website/Home.jsx":"6531a922fe64","ui_kits/website/ProgramDetail.jsx":"8d1da3e11ced","ui_kits/website/Programs.jsx":"b958d82092aa","ui_kits/website/SiteChrome.jsx":"c213ee4d4d64","ui_kits/website/data.js":"6b214ce52f8c","ui_kits/website/lib.jsx":"4ef09934afde"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LifedDesignSystem_d86b5c = window.LifedDesignSystem_d86b5c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: {
    height: 'var(--control-height-sm)',
    padX: '18px',
    font: 'var(--fs-body-sm)'
  },
  md: {
    height: 'var(--control-height-md)',
    padX: '24px',
    font: 'var(--fs-label)'
  },
  lg: {
    height: 'var(--control-height-lg)',
    padX: 'var(--control-pad-x)',
    font: 'var(--fs-body-lg)'
  }
};
const palette = {
  primary: {
    bg: 'var(--color-brand)',
    bgHover: 'var(--color-brand-hover)',
    bgActive: 'var(--color-brand-pressed)',
    fg: 'var(--text-on-brand)',
    border: 'transparent',
    shadow: 'var(--shadow-brand)'
  },
  accent: {
    bg: 'var(--color-accent)',
    bgHover: 'var(--color-accent-hover)',
    bgActive: 'var(--color-accent-pressed)',
    fg: 'var(--text-on-brand)',
    border: 'transparent',
    shadow: '0 10px 30px rgba(95,187,70,0.22)'
  },
  secondary: {
    bg: 'transparent',
    bgHover: 'var(--surface-brand-soft)',
    bgActive: 'var(--teal-100)',
    fg: 'var(--text-brand)',
    border: 'var(--border-brand)',
    shadow: 'none'
  },
  ghost: {
    bg: 'transparent',
    bgHover: 'var(--surface-subtle)',
    bgActive: 'var(--grey-100)',
    fg: 'var(--text-brand)',
    border: 'transparent',
    shadow: 'none'
  }
};

/**
 * Lifed primary action button. Pill-soft brand geometry (16px radius),
 * Nunito Semibold label. Variants: primary (teal), accent (green),
 * secondary (teal outline), ghost.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  uppercase = false,
  iconLeft,
  iconRight,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const s = sizes[size] || sizes.md;
  const p = palette[variant] || palette.primary;
  const bg = disabled ? 'var(--grey-200)' : active ? p.bgActive : hover ? p.bgHover : p.bg;
  const fg = disabled ? 'var(--grey-500)' : p.fg;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      width: fullWidth ? '100%' : 'auto',
      height: s.height,
      padding: `0 ${s.padX}`,
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: s.font,
      letterSpacing: uppercase ? '0.06em' : 'var(--ls-label)',
      textTransform: uppercase ? 'uppercase' : 'none',
      color: fg,
      background: bg,
      border: `var(--border-width-strong) solid ${disabled ? 'var(--grey-200)' : p.border}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: !disabled && variant === 'primary' && !active ? p.shadow : 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transform: active && !disabled ? 'translateY(1px)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: 40,
  md: 48,
  lg: 56
};

/**
 * Circular / square icon-only button. Used for search submit, profile,
 * and toolbar actions on Lifed surfaces.
 */
function IconButton({
  icon,
  variant = 'primary',
  size = 'md',
  shape = 'circle',
  disabled = false,
  ariaLabel,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const dim = sizes[size] || sizes.md;
  const palettes = {
    primary: {
      bg: 'var(--color-brand)',
      bgHover: 'var(--color-brand-hover)',
      fg: 'var(--text-on-brand)',
      border: 'transparent'
    },
    accent: {
      bg: 'var(--color-accent)',
      bgHover: 'var(--color-accent-hover)',
      fg: 'var(--text-on-brand)',
      border: 'transparent'
    },
    soft: {
      bg: 'var(--surface-brand-soft)',
      bgHover: 'var(--teal-100)',
      fg: 'var(--text-brand)',
      border: 'transparent'
    },
    outline: {
      bg: 'var(--surface-card)',
      bgHover: 'var(--surface-subtle)',
      fg: 'var(--text-brand)',
      border: 'var(--border-default)'
    },
    ghost: {
      bg: 'transparent',
      bgHover: 'var(--surface-subtle)',
      fg: 'var(--text-secondary)',
      border: 'transparent'
    }
  };
  const p = palettes[variant] || palettes.primary;
  const bg = disabled ? 'var(--grey-200)' : hover ? p.bgHover : p.bg;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      color: disabled ? 'var(--grey-500)' : p.fg,
      background: bg,
      border: `var(--border-width) solid ${disabled ? 'var(--grey-200)' : p.border}`,
      borderRadius: shape === 'circle' ? 'var(--radius-pill)' : 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transform: active && !disabled ? 'scale(0.94)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest), icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/cards/StatCard.jsx
try { (() => {
/**
 * Stat card — big brand-teal figure with a bold label and supporting line.
 * Used in the impact section ("1 in 3", "80–90%").
 */
function StatCard({
  value,
  label,
  description,
  align = 'left',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      padding: '24px',
      textAlign: align,
      alignItems: align === 'center' ? 'center' : 'flex-start',
      background: 'var(--surface-card)',
      border: 'var(--border-width) solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-extrabold)',
      fontSize: 'var(--fs-display)',
      lineHeight: 1,
      color: 'var(--color-brand)',
      letterSpacing: 'var(--ls-display)'
    }
  }, value), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-h4)',
      color: 'var(--text-primary)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-secondary)',
      maxWidth: 260
    }
  }, description));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/StepCard.jsx
try { (() => {
/**
 * Step card — a stage in "The Lifed Way" (Discover · Book · Experience · Sustain).
 * Numbered eyebrow, icon medallion, title and description.
 */
function StepCard({
  step,
  icon,
  title,
  description,
  tone = 'brand',
  style
}) {
  const medallion = tone === 'accent' ? {
    bg: 'var(--surface-accent-soft)',
    fg: 'var(--green-700)'
  } : {
    bg: 'var(--surface-brand-soft)',
    fg: 'var(--teal-700)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      padding: '24px',
      background: 'var(--surface-card)',
      border: 'var(--border-width) solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      height: '100%',
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-md)',
      background: medallion.bg,
      color: medallion.fg
    }
  }, icon), step != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-extrabold)',
      fontSize: 32,
      color: 'var(--grey-200)',
      lineHeight: 1
    }
  }, String(step).padStart(2, '0'))), /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-h4)',
      color: 'var(--text-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-sm)',
      lineHeight: 1.6,
      color: 'var(--text-secondary)',
      textWrap: 'pretty'
    }
  }, description));
}
Object.assign(__ds_scope, { StepCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/StepCard.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
const sizes = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 80
};
function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
}

/**
 * Avatar — circular user image with initials fallback and optional ring.
 * Used for Healthmates, testimonials and account.
 */
function Avatar({
  src,
  name,
  size = 'md',
  ring = false,
  style
}) {
  const dim = sizes[size] || sizes.md;
  const fontSize = Math.round(dim * 0.38);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      flex: 'none',
      borderRadius: '50%',
      background: 'var(--surface-brand-soft)',
      color: 'var(--teal-800)',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize,
      overflow: 'hidden',
      boxShadow: ring ? '0 0 0 3px var(--surface-page), 0 0 0 5px var(--color-brand)' : 'none',
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name || '',
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials(name) || '?');
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/cards/TestimonialCard.jsx
try { (() => {
/**
 * Testimonial card — real-person quote with avatar, name and role.
 * Warm, human tone; soft aqua accent quote mark.
 */
function TestimonialCard({
  quote,
  name,
  role,
  avatar,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '28px 24px',
      background: 'var(--surface-card)',
      border: 'var(--border-width) solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      height: '100%',
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-extrabold)',
      fontSize: 48,
      lineHeight: 0.6,
      color: 'var(--teal-200)',
      height: 24
    }
  }, "\u201C"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      flex: 1,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-lg)',
      lineHeight: 1.55,
      color: 'var(--text-primary)',
      textWrap: 'pretty'
    }
  }, quote), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    src: avatar,
    name: name,
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-primary)'
    }
  }, name), role && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)'
    }
  }, role))));
}
Object.assign(__ds_scope, { TestimonialCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/TestimonialCard.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
const tones = {
  brand: {
    bg: 'rgba(0,174,157,0.92)',
    fg: 'var(--text-on-brand)'
  },
  accent: {
    bg: 'rgba(95,187,70,0.95)',
    fg: 'var(--text-on-brand)'
  },
  neutral: {
    bg: 'var(--grey-800)',
    fg: 'var(--lifed-white)'
  },
  light: {
    bg: 'var(--lifed-white)',
    fg: 'var(--text-primary)'
  },
  success: {
    bg: 'var(--success-surface)',
    fg: 'var(--green-800)'
  }
};

/**
 * Small badge — duration ("5 Days / 4 Nights"), status, ribbon overlays on
 * program imagery. Softer 8px radius, slightly translucent brand tones.
 */
function Badge({
  children,
  tone = 'brand',
  icon,
  style
}) {
  const t = tones[tone] || tones.brand;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '5px 12px',
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--fw-bold)',
      fontSize: '12px',
      letterSpacing: '0.01em',
      color: t.fg,
      background: t.bg,
      borderRadius: 'var(--radius-sm)',
      boxShadow: tone === 'light' ? 'var(--shadow-sm)' : 'none',
      backdropFilter: tone === 'brand' || tone === 'accent' ? 'blur(4px)' : 'none',
      whiteSpace: 'nowrap',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, icon), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
const tones = {
  brand: {
    bg: 'var(--surface-brand-soft)',
    fg: 'var(--teal-800)'
  },
  accent: {
    bg: 'var(--surface-accent-soft)',
    fg: 'var(--green-800)'
  },
  neutral: {
    bg: 'var(--grey-100)',
    fg: 'var(--grey-700)'
  },
  solid: {
    bg: 'var(--color-brand)',
    fg: 'var(--text-on-brand)'
  },
  outline: {
    bg: 'transparent',
    fg: 'var(--text-brand)'
  }
};

/**
 * Chip / tag — categories, locations, filters. Pill shape, optional icon.
 * `interactive` adds hover + selected styling for filter chips.
 */
function Tag({
  children,
  tone = 'brand',
  icon,
  selected = false,
  interactive = false,
  onClick,
  size = 'md',
  style
}) {
  const [hover, setHover] = React.useState(false);
  const t = selected ? tones.solid : tones[tone] || tones.brand;
  const pad = size === 'sm' ? '4px 10px' : '6px 14px';
  const fs = size === 'sm' ? '12px' : 'var(--fs-body-sm)';
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: pad,
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: fs,
      color: t.fg,
      background: hover && !selected ? 'var(--teal-100)' : t.bg,
      border: tone === 'outline' && !selected ? 'var(--border-width) solid var(--border-brand)' : 'var(--border-width) solid transparent',
      borderRadius: 'var(--radius-pill)',
      cursor: interactive ? 'pointer' : 'default',
      whiteSpace: 'nowrap',
      transition: 'background var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, icon), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/cards/ProgramCard.jsx
try { (() => {
function MetaRow({
  icon,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'var(--text-secondary)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-sm)'
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--text-brand)',
      flex: 'none'
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, children));
}

/**
 * Program card — the core Lifed listing unit. Cover image with duration badge,
 * title, meta rows (duration + host centre), and a footer with location pill
 * and a Details action. Soft 24px radius, gentle shadow that lifts on hover.
 */
function ProgramCard({
  image,
  title,
  badge,
  duration,
  center,
  location,
  durationIcon,
  centerIcon,
  locationIcon,
  onDetails,
  detailsLabel = 'Details',
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: 300,
      background: 'var(--surface-card)',
      border: 'var(--border-width) solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(-4px)' : 'none',
      transition: 'box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4 / 3',
      background: 'linear-gradient(135deg, var(--lifed-aqua), var(--lifed-aqua-green))',
      overflow: 'hidden'
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title || '',
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: hover ? 'scale(1.05)' : 'scale(1)',
      transition: 'transform var(--dur-slow) var(--ease-standard)'
    }
  }), badge && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 12,
      left: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "brand",
    icon: durationIcon
  }, badge))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '16px'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-h4)',
      lineHeight: 1.25,
      color: 'var(--text-primary)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }
  }, duration && /*#__PURE__*/React.createElement(MetaRow, {
    icon: durationIcon
  }, duration), center && /*#__PURE__*/React.createElement(MetaRow, {
    icon: centerIcon
  }, center)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border-subtle)',
      margin: '2px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px'
    }
  }, location && /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    tone: "brand",
    size: "sm",
    icon: locationIcon
  }, location), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm",
    uppercase: true,
    onClick: onDetails
  }, detailsLabel))));
}
Object.assign(__ds_scope, { ProgramCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ProgramCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Text input with optional leading icon, label and helper/error text.
 * 16px radius, subtle border that turns teal on focus.
 */
function Input({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  type = 'text',
  iconLeft,
  size = 'md',
  error,
  helper,
  disabled = false,
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const heights = {
    sm: 'var(--control-height-sm)',
    md: 'var(--control-height-md)',
    lg: 'var(--control-height-lg)'
  };
  const inputId = id || React.useId();
  const borderColor = error ? 'var(--error)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      width: '100%',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      height: heights[size] || heights.md,
      padding: '0 16px',
      background: disabled ? 'var(--surface-subtle)' : 'var(--surface-card)',
      border: `var(--border-width) solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus && !error ? 'var(--shadow-focus)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)'
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: focus ? 'var(--text-brand)' : 'var(--text-muted)'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-primary)'
    }
  }, rest))), (error || helper) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-caption)',
      color: error ? 'var(--error)' : 'var(--text-muted)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchBar.jsx
try { (() => {
function Segment({
  icon,
  label,
  value,
  onClick,
  grow
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: grow ? '1 1 0' : 'none',
      minWidth: 0,
      padding: '10px 20px',
      border: 'none',
      textAlign: 'left',
      background: hover ? 'var(--surface-subtle)' : 'transparent',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      transition: 'background var(--dur-fast) var(--ease-standard)'
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--text-brand)',
      flex: 'none'
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '12px',
      color: 'var(--text-muted)',
      lineHeight: 1.2
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--fs-body-sm)',
      color: value ? 'var(--text-primary)' : 'var(--text-muted)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, value || 'Add')));
}

/**
 * Lifed hero search bar — Where / When / Who segments + teal search button,
 * with optional AI-search (LEWIS) toggle row. Composite booking control.
 */
function SearchBar({
  fields,
  onSearch,
  aiToggle = false,
  aiIcon,
  searchIcon,
  aiLabel = 'Enable AI powered Search. Type in your words.',
  style
}) {
  const segs = fields || [{
    key: 'where',
    label: 'Where',
    value: ''
  }, {
    key: 'when',
    label: 'When',
    value: ''
  }, {
    key: 'who',
    label: 'Who',
    value: ''
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      gap: '8px',
      width: '100%',
      maxWidth: 860,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '8px',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-md)'
    }
  }, segs.map((f, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: f.key || i
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      alignSelf: 'stretch',
      margin: '8px 0',
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement(Segment, {
    icon: f.icon,
    label: f.label,
    value: f.value,
    onClick: f.onClick,
    grow: i === 0
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onSearch,
    "aria-label": "Search",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none',
      width: 52,
      height: 52,
      marginLeft: 4,
      border: 'none',
      borderRadius: '50%',
      background: 'var(--color-brand)',
      color: 'var(--text-on-brand)',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-brand)',
      transition: 'background var(--dur-fast) var(--ease-standard)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--color-brand-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'var(--color-brand)'
  }, searchIcon || /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20
    }
  }, "\u2315"))), aiToggle && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '4px 20px',
      color: 'var(--text-secondary)'
    }
  }, aiIcon, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-sm)'
    }
  }, aiLabel)));
}
Object.assign(__ds_scope, { SearchBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchBar.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Multi-line text input matching Input styling. */
function Textarea({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  rows = 4,
  error,
  helper,
  disabled = false,
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || React.useId();
  const borderColor = error ? 'var(--error)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      width: '100%',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    id: inputId,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    rows: rows,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      resize: 'vertical',
      padding: '12px 16px',
      background: disabled ? 'var(--surface-subtle)' : 'var(--surface-card)',
      border: `var(--border-width) solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-primary)',
      outline: 'none',
      boxShadow: focus && !error ? 'var(--shadow-focus)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)'
    }
  }, rest)), (error || helper) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-caption)',
      color: error ? 'var(--error)' : 'var(--text-muted)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/forms/Toggle.jsx
try { (() => {
/**
 * Toggle switch — used for "Enable AI powered Search" (LEWIS) and settings.
 * Teal track when on, smooth knob slide (no bounce).
 */
function Toggle({
  checked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  id,
  style
}) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  const inputId = id || React.useId();
  const dims = size === 'sm' ? {
    w: 38,
    h: 22,
    k: 16
  } : {
    w: 46,
    h: 26,
    k: 20
  };
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": on,
    id: inputId,
    tabIndex: 0,
    onClick: toggle,
    onKeyDown: e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    },
    style: {
      position: 'relative',
      width: dims.w,
      height: dims.h,
      flex: 'none',
      background: on ? 'var(--color-brand)' : 'var(--grey-300)',
      borderRadius: 'var(--radius-pill)',
      transition: 'background var(--dur-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: (dims.h - dims.k) / 2,
      left: on ? dims.w - dims.k - (dims.h - dims.k) / 2 : (dims.h - dims.k) / 2,
      width: dims.k,
      height: dims.k,
      background: 'var(--lifed-white)',
      borderRadius: '50%',
      boxShadow: 'var(--shadow-sm)',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Toggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Toggle.jsx", error: String((e && e.message) || e) }); }

// components/navigation/CategoryTabs.jsx
try { (() => {
/**
 * Category tabs — icon + label with a teal underline on the active tab.
 * Mirrors the Wellness / Recovery / Movement switcher on lifedhealth.com.
 */
function CategoryTabs({
  tabs = [],
  active,
  onChange,
  style
}) {
  const [internal, setInternal] = React.useState(tabs[0]?.key);
  const current = active !== undefined ? active : internal;
  const select = key => {
    if (active === undefined) setInternal(key);
    onChange && onChange(key);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'stretch',
      gap: '8px',
      borderBottom: 'var(--border-width) solid var(--border-subtle)',
      ...style
    }
  }, tabs.map(t => {
    const on = t.key === current;
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      type: "button",
      onClick: () => select(t.key),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '12px 24px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: on ? 'var(--text-brand)' : 'var(--text-muted)',
        borderBottom: on ? '3px solid var(--color-brand)' : '3px solid transparent',
        marginBottom: -1,
        transition: 'color var(--dur-fast) var(--ease-standard)'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.color = 'var(--text-secondary)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.color = 'var(--text-muted)';
      }
    }, t.icon && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex'
      }
    }, t.icon), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 'var(--fw-semibold)',
        fontSize: 'var(--fs-body-sm)'
      }
    }, t.label));
  }));
}
Object.assign(__ds_scope, { CategoryTabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/CategoryTabs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
/**
 * Top navigation bar. Two surfaces: `solid` (white, for inner pages) and
 * `overlay` (transparent white text, for use over hero imagery).
 * Pass `logoSrc` (brand logo) and a `links` array; `actions` renders on the right.
 */
function NavBar({
  logoSrc,
  logoAlt = 'Lifed',
  links = [],
  activeHref,
  onNavigate,
  actions,
  variant = 'solid',
  style
}) {
  const overlay = variant === 'overlay';
  const linkColor = overlay ? 'rgba(255,255,255,0.92)' : 'var(--text-primary)';
  const activeColor = overlay ? '#fff' : 'var(--text-brand)';
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      padding: '16px 32px',
      width: '100%',
      boxSizing: 'border-box',
      background: overlay ? 'transparent' : 'var(--surface-card)',
      borderBottom: overlay ? 'none' : 'var(--border-width) solid var(--border-subtle)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate('/');
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      flex: 'none'
    }
  }, logoSrc ? /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: logoAlt,
    style: {
      height: 30,
      width: 'auto'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-extrabold)',
      fontSize: 24,
      color: overlay ? '#fff' : 'var(--color-brand)',
      letterSpacing: '0.02em'
    }
  }, "LIFED")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '28px',
      flex: 1
    }
  }, links.map(l => {
    const active = l.href === activeHref;
    return /*#__PURE__*/React.createElement("a", {
      key: l.href,
      href: l.href,
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(l.href);
      },
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 'var(--fw-semibold)',
        fontSize: 'var(--fs-body-sm)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        color: active ? activeColor : linkColor,
        borderBottom: active ? `2px solid ${activeColor}` : '2px solid transparent',
        paddingBottom: 2,
        transition: 'color var(--dur-fast) var(--ease-standard)'
      }
    }, l.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      flex: 'none'
    }
  }, actions));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/App.jsx
try { (() => {
// App shell / router — Lifed website UI kit
function App() {
  const [screen, setScreen] = useState('home');
  const [programId, setProgramId] = useState(null);
  const navigate = dest => {
    const core = ['home', 'programs'];
    setScreen(core.includes(dest) ? dest : 'home');
    window.scrollTo({
      top: 0
    });
  };
  const openProgram = id => {
    setProgramId(id);
    setScreen('detail');
    window.scrollTo({
      top: 0
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: 'var(--surface-page)'
    }
  }, screen === 'home' && /*#__PURE__*/React.createElement(Home, {
    onNavigate: navigate,
    onOpenProgram: openProgram
  }), screen === 'programs' && /*#__PURE__*/React.createElement(Programs, {
    onNavigate: navigate,
    onOpenProgram: openProgram
  }), screen === 'detail' && /*#__PURE__*/React.createElement(ProgramDetail, {
    programId: programId,
    onNavigate: navigate,
    onOpenProgram: openProgram
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
// Home screen — Lifed website UI kit
const {
  SearchBar,
  CategoryTabs,
  ProgramCard,
  StatCard,
  StepCard,
  TestimonialCard,
  Button,
  Tag
} = window.LifedDesignSystem_d86b5c;
function Section({
  eyebrow,
  title,
  subtitle,
  children,
  bg,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: bg || 'transparent',
      padding: '72px 40px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, (eyebrow || title) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 36
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-brand)',
      marginBottom: 10
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--fs-h2)',
      color: 'var(--text-primary)',
      letterSpacing: '-0.01em'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-lg)',
      color: 'var(--text-secondary)',
      maxWidth: 640
    }
  }, subtitle)), children));
}
function Home({
  onNavigate,
  onOpenProgram
}) {
  const D = window.LifedData;
  const [cat, setCat] = useState('wellness');
  const shown = D.programs.filter(p => p.cat === cat).slice(0, 4);
  const iconFor = {
    duration: 'clock',
    center: 'house',
    location: 'map-pin'
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      minHeight: 620,
      background: 'linear-gradient(115deg, #0a4842 0%, #00ae9d 60%, #5fbb46 130%)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.5,
      background: 'radial-gradient(1200px 500px at 80% -10%, rgba(255,255,255,0.25), transparent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    variant: "overlay",
    active: "home",
    onNavigate: onNavigate
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 2,
      maxWidth: 1200,
      margin: '0 auto',
      padding: '48px 40px 72px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 60,
      lineHeight: 1.02,
      color: '#fff',
      letterSpacing: '-0.02em',
      maxWidth: 680
    }
  }, "Live Well.", /*#__PURE__*/React.createElement("br", null), "Every Single Day."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '20px 0 36px',
      fontFamily: 'var(--font-body)',
      fontSize: 20,
      color: 'rgba(255,255,255,0.92)',
      maxWidth: 560,
      lineHeight: 1.5
    }
  }, "Discover and experience wellness, functional movement and recovery programs \u2014 curated with trusted Healthmates around the world."), /*#__PURE__*/React.createElement(SearchBar, {
    aiToggle: true,
    style: {
      maxWidth: 880
    },
    aiIcon: /*#__PURE__*/React.createElement(LI, {
      name: "sparkles",
      size: 16,
      color: "var(--text-brand)"
    }),
    aiLabel: "Enable AI-powered Search with LEWIS. Just type in your words.",
    searchIcon: /*#__PURE__*/React.createElement(LI, {
      name: "search",
      size: 20,
      color: "#fff"
    }),
    fields: [{
      key: 'where',
      label: 'Where',
      value: 'Kerala, India',
      icon: /*#__PURE__*/React.createElement(LI, {
        name: "map-pin",
        size: 18
      })
    }, {
      key: 'when',
      label: 'When',
      value: 'Apr 9 – Jun 5',
      icon: /*#__PURE__*/React.createElement(LI, {
        name: "calendar",
        size: 18
      })
    }, {
      key: 'who',
      label: 'Who',
      value: '2 Guests',
      icon: /*#__PURE__*/React.createElement(LI, {
        name: "users",
        size: 18
      })
    }],
    onSearch: () => onNavigate('programs')
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-brand-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '18px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      color: 'var(--teal-800)'
    }
  }, /*#__PURE__*/React.createElement(LI, {
    name: "sun",
    size: 22,
    color: "var(--teal-700)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--fs-h4)'
    }
  }, "Join the Lifed journey \u2014 it's easier when signed in")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    uppercase: true,
    onClick: () => onNavigate('login')
  }, "Sign In"))), /*#__PURE__*/React.createElement(Section, {
    eyebrow: "Curated Wellbeing Programs",
    title: "Thoughtfully designed journeys for every stage of life"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement(CategoryTabs, {
    active: cat,
    onChange: setCat,
    tabs: D.categories.map(c => ({
      key: c.key,
      label: c.label,
      icon: /*#__PURE__*/React.createElement(LI, {
        name: c.icon,
        size: 22
      })
    }))
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 24
    }
  }, shown.map(p => /*#__PURE__*/React.createElement(ProgramCard, {
    key: p.id,
    image: undefined,
    style: {
      maxWidth: 'none'
    },
    badge: p.duration,
    title: p.title,
    duration: p.duration,
    center: p.center,
    location: p.location,
    durationIcon: /*#__PURE__*/React.createElement(LI, {
      name: iconFor.duration,
      size: 14
    }),
    centerIcon: /*#__PURE__*/React.createElement(LI, {
      name: iconFor.center,
      size: 14
    }),
    locationIcon: /*#__PURE__*/React.createElement(LI, {
      name: iconFor.location,
      size: 13
    }),
    onDetails: () => onOpenProgram(p.id)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    uppercase: true,
    size: "lg",
    onClick: () => onNavigate('programs'),
    iconRight: /*#__PURE__*/React.createElement(LI, {
      name: "arrow-right",
      size: 18
    })
  }, "View All Programs"))), /*#__PURE__*/React.createElement(Section, {
    bg: "var(--grey-50)",
    eyebrow: "Why Lifed",
    title: "Wellbeing is a practice, not a patch"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, D.stats.map(s => /*#__PURE__*/React.createElement(StatCard, {
    key: s.label,
    value: s.value,
    label: s.label,
    description: s.desc
  })))), /*#__PURE__*/React.createElement(Section, {
    eyebrow: "The Lifed Way",
    title: "From discovery to daily practice"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 24
    }
  }, D.steps.map((s, i) => /*#__PURE__*/React.createElement(StepCard, {
    key: s.title,
    step: i + 1,
    tone: s.tone,
    icon: /*#__PURE__*/React.createElement(LI, {
      name: s.icon,
      size: 24
    }),
    title: s.title,
    description: s.desc
  })))), /*#__PURE__*/React.createElement(Section, {
    bg: "var(--surface-brand-soft)",
    eyebrow: "Real People. Real Shifts.",
    title: "What happens when wellbeing becomes a practice"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, D.testimonials.map(t => /*#__PURE__*/React.createElement(TestimonialCard, {
    key: t.name,
    quote: t.quote,
    name: t.name,
    role: t.role
  })))), /*#__PURE__*/React.createElement(Section, {
    eyebrow: "Regenerative Wellbeing",
    title: "Have a healthy break with curated programs"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20
    }
  }, D.personas.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: p,
    style: {
      position: 'relative',
      height: 200,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    tint: `linear-gradient(135deg, ${['#d6edea', '#e6f4d0', '#bce29e', '#93ddd4', '#c8ede8', '#dcefce'][i]}, #93ddd4)`,
    label: `${p} imagery`,
    radius: "0"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(10,72,66,0.72), transparent 60%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 20,
      bottom: 18,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 22
    }
  }, p, " Wellbeing")))))), /*#__PURE__*/React.createElement(Section, {
    bg: "var(--grey-50)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 40,
      alignItems: 'center',
      background: 'linear-gradient(120deg, #0a4842, #00ae9d)',
      borderRadius: 'var(--radius-xl)',
      padding: 48,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 38,
      color: '#fff',
      lineHeight: 1.1,
      letterSpacing: '-0.01em'
    }
  }, "The difference in building a healthier culture starts with you."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '18px 0 28px',
      fontFamily: 'var(--font-body)',
      fontSize: 18,
      color: 'rgba(255,255,255,0.9)',
      maxWidth: 460
    }
  }, "Set up and onboard your wellbeing experience with Lifed. Create impact. Grow it sustainably, year-round."), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    uppercase: true,
    onClick: () => onNavigate('healthmate')
  }, "Become a Healthmate")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 220
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    tint: "linear-gradient(135deg,#e6f4d0,#bce29e)",
    label: "Healthmate imagery",
    radius: "var(--radius-lg)"
  })))), /*#__PURE__*/React.createElement(SiteFooter, {
    onNavigate: onNavigate
  }));
}
Object.assign(window, {
  Home
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ProgramDetail.jsx
try { (() => {
// Program detail + booking screen — Lifed website UI kit
const {
  Button,
  Tag,
  Badge,
  Avatar,
  IconButton,
  Input
} = window.LifedDesignSystem_d86b5c;
function BookingCard({
  program,
  onBook
}) {
  const dates = ['Apr 09 – Apr 15', 'May 12 – May 18', 'Jun 02 – Jun 08'];
  const [date, setDate] = useState(dates[0]);
  const [guests, setGuests] = useState(2);
  const total = program.price * guests;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 24,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 32,
      color: 'var(--text-primary)'
    }
  }, "$", program.price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--text-muted)',
      fontSize: 'var(--fs-body-sm)'
    }
  }, "/ person")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 20,
      color: 'var(--text-secondary)',
      fontSize: 'var(--fs-body-sm)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(LI, {
    name: "star",
    size: 14,
    color: "var(--color-accent)"
  }), " 4.9 \xB7 128 reviews"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-primary)',
      marginBottom: 8
    }
  }, "Choose your dates"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginBottom: 18
    }
  }, dates.map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    type: "button",
    onClick: () => setDate(d),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 14px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      textAlign: 'left',
      background: date === d ? 'var(--surface-brand-soft)' : 'var(--surface-card)',
      border: `2px solid ${date === d ? 'var(--color-brand)' : 'var(--border-default)'}`,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-primary)',
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(LI, {
    name: "calendar",
    size: 16,
    color: "var(--text-brand)"
  }), " ", d), date === d && /*#__PURE__*/React.createElement(LI, {
    name: "check",
    size: 16,
    color: "var(--color-brand)"
  })))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-primary)',
      marginBottom: 8
    }
  }, "Guests"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      border: '2px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-primary)'
    }
  }, guests, " ", guests === 1 ? 'Guest' : 'Guests'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    variant: "soft",
    size: "sm",
    ariaLabel: "Fewer",
    icon: /*#__PURE__*/React.createElement(LI, {
      name: "minus",
      size: 16
    }),
    onClick: () => setGuests(g => Math.max(1, g - 1))
  }), /*#__PURE__*/React.createElement(IconButton, {
    variant: "soft",
    size: "sm",
    ariaLabel: "More",
    icon: /*#__PURE__*/React.createElement(LI, {
      name: "plus",
      size: 16
    }),
    onClick: () => setGuests(g => Math.min(8, g + 1))
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '14px 0',
      borderTop: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-body)',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, "$", program.price, " \xD7 ", guests), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 18,
      color: 'var(--text-primary)'
    }
  }, "$", total.toLocaleString())), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    uppercase: true,
    onClick: () => onBook({
      date,
      guests,
      total
    })
  }, "Book Program"), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      margin: '12px 0 0',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)'
    }
  }, "Free cancellation up to 14 days before"));
}
function Confirmation({
  program,
  booking,
  onClose,
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: 'rgba(10,72,66,0.45)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-xl)',
      maxWidth: 440,
      width: '100%',
      padding: 40,
      textAlign: 'center',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 72,
      height: 72,
      borderRadius: '50%',
      background: 'var(--surface-accent-soft)',
      color: 'var(--green-700)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check",
    size: 36,
    strokeWidth: 2.5
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 26,
      color: 'var(--text-primary)'
    }
  }, "You're booked in!"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 20px',
      fontFamily: 'var(--font-body)',
      color: 'var(--text-secondary)',
      lineHeight: 1.5
    }
  }, "Your place on ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-primary)'
    }
  }, program.title), " is confirmed for ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-primary)'
    }
  }, booking.date), ", ", booking.guests, " ", booking.guests === 1 ? 'guest' : 'guests', "."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 16,
      marginBottom: 24,
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, "Total paid"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--text-primary)'
    }
  }, "$", booking.total.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    onClick: onClose
  }, "Keep Browsing"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: () => {
      onClose();
      onNavigate('home');
    }
  }, "Done"))));
}
function ProgramDetail({
  programId,
  onNavigate,
  onOpenProgram
}) {
  const D = window.LifedData;
  const program = D.programs.find(p => p.id === programId) || D.programs[0];
  const [tab, setTab] = useState('overview');
  const [booking, setBooking] = useState(null);
  const related = D.programs.filter(p => p.id !== program.id && p.cat === program.cat).slice(0, 3);
  const highlights = [{
    icon: 'salad',
    text: 'Sattvic full-board meals'
  }, {
    icon: 'bed-double',
    text: 'Private ensuite stay'
  }, {
    icon: 'stethoscope',
    text: 'Daily practitioner consult'
  }, {
    icon: 'leaf',
    text: 'Herbal therapies included'
  }];
  const itinerary = [{
    d: 'Day 1',
    t: 'Arrival & Assessment',
    x: 'Dosha consultation, welcome ritual and a grounding evening meditation.'
  }, {
    d: 'Day 2–3',
    t: 'Cleanse & Release',
    x: 'Guided Panchakarma therapies, gentle movement and breathwork.'
  }, {
    d: 'Day 4–5',
    t: 'Restore & Rebuild',
    x: 'Personalised yoga, nourishment and nervous-system regulation.'
  }, {
    d: 'Day 6–7',
    t: 'Integrate & Sustain',
    x: 'Take-home practice plan with SMALL Habits micro-tools.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    variant: "solid",
    active: "programs",
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '24px 40px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-secondary)',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate('home');
    },
    style: {
      color: 'var(--text-secondary)'
    }
  }, "Home"), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-right",
    size: 14
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate('programs');
    },
    style: {
      color: 'var(--text-secondary)'
    }
  }, "Programs"), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-right",
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-brand)',
      fontWeight: 700,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: 320
    }
  }, program.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 12,
      height: 380,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    tint: program.tint,
    label: "Program hero",
    radius: "var(--radius-lg)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "light",
    icon: /*#__PURE__*/React.createElement(LI, {
      name: "clock",
      size: 12
    })
  }, program.duration))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    tint: "linear-gradient(135deg,#e6f4d0,#93ddd4)",
    label: "Detail",
    radius: "var(--radius-lg)"
  }), /*#__PURE__*/React.createElement(Photo, {
    tint: "linear-gradient(135deg,#d6edea,#bce29e)",
    label: "Detail",
    radius: "var(--radius-lg)"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 40px 72px',
      display: 'grid',
      gridTemplateColumns: '1.7fr 1fr',
      gap: 48,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: "brand"
  }, D.categories.find(c => c.key === program.cat)?.label), /*#__PURE__*/React.createElement(Tag, {
    tone: "accent"
  }, "Curated for Lifed")), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '0 0 14px',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 38,
      color: 'var(--text-primary)',
      lineHeight: 1.12,
      letterSpacing: '-0.01em'
    }
  }, program.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap',
      marginBottom: 24,
      color: 'var(--text-secondary)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(LI, {
    name: "map-pin",
    size: 16,
    color: "var(--text-brand)"
  }), " ", program.location), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(LI, {
    name: "house",
    size: 16,
    color: "var(--text-brand)"
  }), " ", program.center), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(LI, {
    name: "clock",
    size: 16,
    color: "var(--text-brand)"
  }), " ", program.duration)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 14,
      padding: '20px',
      background: 'var(--surface-subtle)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: 28
    }
  }, highlights.map(h => /*#__PURE__*/React.createElement("div", {
    key: h.text,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-brand-soft)',
      color: 'var(--teal-700)',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(LI, {
    name: h.icon,
    size: 20
  })), h.text))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      borderBottom: '1px solid var(--border-subtle)',
      marginBottom: 22
    }
  }, [['overview', 'Overview'], ['itinerary', 'Itinerary'], ['host', 'Your Healthmate']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    type: "button",
    onClick: () => setTab(k),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0 0 12px',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 'var(--fs-body)',
      color: tab === k ? 'var(--text-brand)' : 'var(--text-muted)',
      borderBottom: `3px solid ${tab === k ? 'var(--color-brand)' : 'transparent'}`,
      marginBottom: -1
    }
  }, l))), tab === 'overview' && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-lg)',
      color: 'var(--text-secondary)',
      lineHeight: 1.7
    }
  }, /*#__PURE__*/React.createElement("p", null, program.blurb), /*#__PURE__*/React.createElement("p", null, "Every Lifed program is shaped together with the expert, centre and community that hosts it \u2014 built for Lifed, not relisted. This is non-clinical, proactive wellbeing: it helps you live well rather than waiting for things to break.")), tab === 'itinerary' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, itinerary.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.d,
    style: {
      display: 'grid',
      gridTemplateColumns: '96px 1fr',
      gap: 16,
      padding: '16px 0',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--text-brand)',
      fontSize: 'var(--fs-body-sm)'
    }
  }, it.d), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: 4
    }
  }, it.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--text-secondary)',
      fontSize: 'var(--fs-body-sm)',
      lineHeight: 1.6
    }
  }, it.x))))), tab === 'host' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      alignItems: 'flex-start',
      padding: 24,
      background: 'var(--surface-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: program.center,
    size: "xl",
    ring: true
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--fs-h4)',
      color: 'var(--text-primary)'
    }
  }, program.center), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      margin: '4px 0 12px',
      color: 'var(--text-brand)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-sm)',
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement(LI, {
    name: "badge-check",
    size: 16
  }), " Verified Lifed Healthmate"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      color: 'var(--text-secondary)',
      lineHeight: 1.6
    }
  }, "A trusted centre with over a decade of practice, hosting curated residential and session-based programs for the Lifed community.")))), /*#__PURE__*/React.createElement(BookingCard, {
    program: program,
    onBook: setBooking
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--grey-50)',
      padding: '56px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 24px',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--fs-h2)',
      color: 'var(--text-primary)'
    }
  }, "You might also like"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, related.map(p => {
    const {
      ProgramCard
    } = window.LifedDesignSystem_d86b5c;
    return /*#__PURE__*/React.createElement(ProgramCard, {
      key: p.id,
      style: {
        maxWidth: 'none'
      },
      badge: p.duration,
      title: p.title,
      duration: p.duration,
      center: p.center,
      location: p.location,
      durationIcon: /*#__PURE__*/React.createElement(LI, {
        name: "clock",
        size: 14
      }),
      centerIcon: /*#__PURE__*/React.createElement(LI, {
        name: "house",
        size: 14
      }),
      locationIcon: /*#__PURE__*/React.createElement(LI, {
        name: "map-pin",
        size: 13
      }),
      onDetails: () => onOpenProgram(p.id)
    });
  })))), /*#__PURE__*/React.createElement(SiteFooter, {
    onNavigate: onNavigate
  }), booking && /*#__PURE__*/React.createElement(Confirmation, {
    program: program,
    booking: booking,
    onClose: () => setBooking(null),
    onNavigate: onNavigate
  }));
}
Object.assign(window, {
  ProgramDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ProgramDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Programs.jsx
try { (() => {
// Programs listing screen — Lifed website UI kit
const {
  ProgramCard,
  CategoryTabs,
  Tag,
  SearchBar,
  Button
} = window.LifedDesignSystem_d86b5c;
function Programs({
  onNavigate,
  onOpenProgram
}) {
  const D = window.LifedData;
  const [cat, setCat] = useState('all');
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Residential', 'Session-based', 'Ayurveda', 'Yoga', 'Meditation'];
  const list = cat === 'all' ? D.programs : D.programs.filter(p => p.cat === cat);
  const iconFor = {
    duration: 'clock',
    center: 'house',
    location: 'map-pin'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    variant: "solid",
    active: "programs",
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-brand-soft)',
      padding: '48px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-secondary)',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate('home');
    },
    style: {
      color: 'var(--text-secondary)'
    }
  }, "Home"), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-right",
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-brand)',
      fontWeight: 700
    }
  }, "Programs")), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 44,
      color: 'var(--text-primary)',
      letterSpacing: '-0.02em'
    }
  }, "Curated Wellbeing Programs"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 24px',
      fontFamily: 'var(--font-body)',
      fontSize: 18,
      color: 'var(--text-secondary)',
      maxWidth: 620
    }
  }, "Residential stays and session-based workshops, drawn from trusted practices around the world."), /*#__PURE__*/React.createElement(SearchBar, {
    style: {
      maxWidth: 760
    },
    searchIcon: /*#__PURE__*/React.createElement(LI, {
      name: "search",
      size: 20,
      color: "#fff"
    }),
    fields: [{
      key: 'where',
      label: 'Where',
      value: 'Anywhere',
      icon: /*#__PURE__*/React.createElement(LI, {
        name: "map-pin",
        size: 18
      })
    }, {
      key: 'when',
      label: 'When',
      value: 'Any week',
      icon: /*#__PURE__*/React.createElement(LI, {
        name: "calendar",
        size: 18
      })
    }, {
      key: 'who',
      label: 'Who',
      value: '2 Guests',
      icon: /*#__PURE__*/React.createElement(LI, {
        name: "users",
        size: 18
      })
    }],
    onSearch: () => {}
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '28px 40px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(CategoryTabs, {
    active: cat,
    onChange: setCat,
    tabs: [{
      key: 'all',
      label: 'All',
      icon: /*#__PURE__*/React.createElement(LI, {
        name: "layout-grid",
        size: 22
      })
    }, ...D.categories.map(c => ({
      key: c.key,
      label: c.label,
      icon: /*#__PURE__*/React.createElement(LI, {
        name: c.icon,
        size: 22
      })
    }))]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, filters.map(f => /*#__PURE__*/React.createElement(Tag, {
    key: f,
    interactive: true,
    selected: filter === f,
    onClick: () => setFilter(f)
  }, f))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(LI, {
    name: "sliders-horizontal",
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, list.length, " programs \xB7 sorted by relevance")))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '24px 40px 72px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 24
    }
  }, list.map(p => /*#__PURE__*/React.createElement(ProgramCard, {
    key: p.id,
    style: {
      maxWidth: 'none'
    },
    badge: p.duration,
    title: p.title,
    duration: p.duration,
    center: p.center,
    location: p.location,
    durationIcon: /*#__PURE__*/React.createElement(LI, {
      name: iconFor.duration,
      size: 14
    }),
    centerIcon: /*#__PURE__*/React.createElement(LI, {
      name: iconFor.center,
      size: 14
    }),
    locationIcon: /*#__PURE__*/React.createElement(LI, {
      name: iconFor.location,
      size: 13
    }),
    onDetails: () => onOpenProgram(p.id)
  })))), /*#__PURE__*/React.createElement(SiteFooter, {
    onNavigate: onNavigate
  }));
}
Object.assign(window, {
  Programs
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Programs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteChrome.jsx
try { (() => {
// Site header + footer chrome for the Lifed website UI kit
const {
  NavBar,
  Button,
  IconButton
} = window.LifedDesignSystem_d86b5c;
const NAV_LINKS = [{
  label: 'Programs',
  href: 'programs'
}, {
  label: 'Lifed Story',
  href: 'story'
}, {
  label: 'Sustainability',
  href: 'sustainability'
}, {
  label: 'Blog',
  href: 'blog'
}];
function SiteHeader({
  variant = 'solid',
  active,
  onNavigate
}) {
  const overlay = variant === 'overlay';
  return /*#__PURE__*/React.createElement(NavBar, {
    variant: variant,
    logoSrc: overlay ? '../../assets/lifed-logo-white.png' : '../../assets/lifed-logo.png',
    links: NAV_LINKS,
    activeHref: active,
    onNavigate: onNavigate,
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate('healthmate');
      },
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 'var(--fw-semibold)',
        fontSize: 'var(--fs-body-sm)',
        color: overlay ? '#fff' : 'var(--text-primary)',
        textDecoration: 'none',
        whiteSpace: 'nowrap'
      }
    }, "Become a Healthmate"), /*#__PURE__*/React.createElement(IconButton, {
      variant: overlay ? 'soft' : 'outline',
      ariaLabel: "Menu",
      icon: /*#__PURE__*/React.createElement(LI, {
        name: "layout-grid",
        size: 18
      })
    }), /*#__PURE__*/React.createElement(IconButton, {
      variant: overlay ? 'soft' : 'outline',
      ariaLabel: "Account",
      icon: /*#__PURE__*/React.createElement(LI, {
        name: "user",
        size: 18
      })
    }))
  });
}
function SiteFooter({
  onNavigate
}) {
  const linkStyle = {
    display: 'block',
    color: 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
    fontSize: 'var(--fs-body-sm)',
    padding: '5px 0',
    fontFamily: 'var(--font-body)'
  };
  const head = {
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--fw-bold)',
    fontSize: 'var(--fs-body)',
    color: '#fff',
    margin: '0 0 10px'
  };
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--grey-800)',
      color: '#fff',
      padding: '56px 40px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr 1fr 1.2fr',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/lifed-logo-white.png",
    alt: "Lifed",
    style: {
      height: 30,
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 'var(--fs-body-sm)',
      lineHeight: 1.6,
      maxWidth: 300,
      margin: 0
    }
  }, "Empowering wellness, sustainability and conscious living through community-driven, real-world experiences."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 18
    }
  }, ['instagram', 'facebook', 'linkedin', 'youtube'].map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement(LI, {
    name: s,
    size: 16
  }))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: head
  }, "Explore"), NAV_LINKS.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.href,
    href: "#",
    style: linkStyle,
    onClick: e => {
      e.preventDefault();
      onNavigate(l.href);
    }
  }, l.label))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: head
  }, "Company"), ['Terms & Conditions', 'Privacy Policy', 'Refund Policy', 'Shipping & Return'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: linkStyle,
    onClick: e => e.preventDefault()
  }, l))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: head
  }, "Contact"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: linkStyle,
    onClick: e => e.preventDefault()
  }, "support@lifedhealth.com"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: linkStyle,
    onClick: e => e.preventDefault()
  }, "+91 7356 028 642"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...linkStyle,
      color: 'rgba(255,255,255,0.55)'
    }
  }, "Mon\u2013Sat \xB7 9:00\u201318:00 IST"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '32px auto 0',
      paddingTop: 20,
      borderTop: '1px solid rgba(255,255,255,0.12)',
      color: 'rgba(255,255,255,0.5)',
      fontSize: 'var(--fs-caption)',
      fontFamily: 'var(--font-body)'
    }
  }, "\xA9 2024\u20132026 Holobiont Pvt Ltd. All rights reserved."));
}
Object.assign(window, {
  SiteHeader,
  SiteFooter,
  NAV_LINKS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteChrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
// Lifed UI-kit sample data (mirrors real programs & copy from lifedhealth.com)
window.LifedData = {
  categories: [{
    key: 'wellness',
    label: 'Wellness',
    icon: 'heart-handshake'
  }, {
    key: 'recovery',
    label: 'Recovery',
    icon: 'refresh-cw'
  }, {
    key: 'movement',
    label: 'Movement',
    icon: 'move'
  }],
  programs: [{
    id: 'ojas',
    cat: 'recovery',
    title: 'Ojas Renewal: 7-Day Ayurvedic Reset for Digital Workers',
    duration: '7 Days / 6 Nights',
    center: 'Vaidyagrama Healing Village',
    location: 'Wayanad, India',
    price: 1490,
    tint: 'linear-gradient(135deg,#d6edea,#bce29e)',
    blurb: 'If you work in front of a screen for most of your day, your body already knows the cost. The neck that carries the weight of your attention, the eyes that forgot how to rest, the breath that turned shallow somewhere between meetings.'
  }, {
    id: 'mental',
    cat: 'wellness',
    title: '7-Day Holistic Mental Wellness Program',
    duration: '7 Days / 6 Nights',
    center: 'Santhigiri Ashram',
    location: 'Ernakulam, India',
    price: 1290,
    tint: 'linear-gradient(135deg,#e6f4d0,#93ddd4)',
    blurb: 'Somewhere between the deadlines and the devices, the mind forgot how to be still. This is a seven-day residential Ayurvedic journey back to a quieter, clearer self.'
  }, {
    id: 'women',
    cat: 'wellness',
    title: "5-Day Women's Well-Being Program",
    duration: '5 Days / 4 Nights',
    center: 'Kalari Kovilakom',
    location: 'Ernakulam, India',
    price: 980,
    tint: 'linear-gradient(135deg,#d6edea,#e6f4d0)',
    blurb: "A woman's body carries more than most wellness programs acknowledge: the accumulated weight of hormonal shifts, irregular rhythms, and quiet exhaustion. This program meets you there."
  }, {
    id: 'samya',
    cat: 'movement',
    title: 'Samya: 7-Day Yoga, Culture & Nature Retreat',
    duration: '7 Days / 6 Nights',
    center: 'Munnar Hills Collective',
    location: 'Munnar, India',
    price: 1150,
    tint: 'linear-gradient(135deg,#bce29e,#93ddd4)',
    blurb: 'Most retreats ask you to sit still and go inward. Samya asks you to move through the world and find yourself along the way — through asana, hill trails and shared meals.'
  }, {
    id: 'restore',
    cat: 'recovery',
    title: '5-Day Restore: Ayurvedic Balance & Recovery',
    duration: '5 Days / 4 Nights',
    center: 'Aadhi Wellness',
    location: 'Puducherry, India',
    price: 890,
    tint: 'linear-gradient(135deg,#d6edea,#c8ede8)',
    blurb: 'The 5-Day Restore Program is an Ayurvedic wellness retreat for those moments when fatigue has become too familiar and stress has quietly set the pace of your days.'
  }, {
    id: 'forest',
    cat: 'movement',
    title: 'Alternate Way of Living in a Forest Community',
    duration: '7 Days / 6 Nights',
    center: 'Art Forest Residency',
    location: 'Puducherry, India',
    price: 760,
    tint: 'linear-gradient(135deg,#e6f4d0,#bce29e)',
    blurb: 'The Art Forest Residency is not just a retreat, but a return — to soil, to slowness, to a community that lives close to the land. New participants join every Monday.'
  }, {
    id: 'know',
    cat: 'movement',
    title: 'Know Thyself: Embodied Awareness Yoga',
    duration: '5 Sessions · Mon–Fri',
    center: 'Cochin Yoga Shala',
    location: 'Cochin, India',
    price: 240,
    tint: 'linear-gradient(135deg,#93ddd4,#d6edea)',
    blurb: 'Most of us have developed a complicated relationship with our own bodies — not through injury, but through years of not listening. This is a practice of coming home.'
  }, {
    id: 'inner',
    cat: 'wellness',
    title: 'The Inner Reset',
    duration: '3 Sessions',
    center: 'Cochin Mindfulness Studio',
    location: 'Cochin, India',
    price: 120,
    tint: 'linear-gradient(135deg,#e6f4d0,#c8ede8)',
    blurb: 'The Inner Reset is a guided 3-session meditation program designed to help you slow down, release mental and emotional overload, and return to a steadier baseline.'
  }],
  steps: [{
    icon: 'search',
    title: 'Discover',
    desc: 'Search by goal, condition, or curiosity. Our platform surfaces the most relevant programs, practitioners and products for your exact need.'
  }, {
    icon: 'calendar-check',
    title: 'Book',
    desc: "Seamlessly book live, in-person or hybrid programs from certified Healthmates — with full transparency on what's included.",
    tone: 'accent'
  }, {
    icon: 'sparkles',
    title: 'Experience',
    desc: 'Show up, engage fully, and let the transformation begin. Every Lifed experience is designed to move you — physically, mentally and emotionally.'
  }, {
    icon: 'repeat',
    title: 'Sustain',
    desc: 'SMALL Habits carries your experience into daily life — practice-driven micro-tools that make wellbeing stick beyond the session.',
    tone: 'accent'
  }],
  stats: [{
    value: '1 in 3',
    label: 'Adults Affected',
    desc: 'Living with chronic lifestyle-related conditions'
  }, {
    value: '80–90%',
    label: 'Drop-out Rate',
    desc: 'From standard wellness programs within the first few weeks'
  }, {
    value: '50–60%',
    label: 'Projected Rise',
    desc: 'In mental & lifestyle-related conditions by 2030'
  }],
  testimonials: [{
    quote: "This isn't another wellness retreat. It's like installing the right software for being human. My daily health map actually makes sense now.",
    name: 'Ajitha Devan',
    role: 'Teacher & Cancer Survivor'
  }, {
    quote: 'The 10-minute practice became the most grounding part of my day. Each tool felt intentional and guided — no fluff, just quiet impact.',
    name: 'Ajmal Sezhad',
    role: 'IFS Officer'
  }, {
    quote: "I've tried so many mindfulness tools before, but SMALL Habits was different — simple, beautiful, and surprisingly powerful.",
    name: 'Gargie Boss',
    role: 'Advocate, Supreme Court'
  }],
  personas: ['Corporate', 'Women', 'Elderly', 'Communities', 'Children', 'Family']
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

// ui_kits/website/lib.jsx
try { (() => {
// Shared helpers for the Lifed website UI kit
const {
  useState,
  useEffect,
  useRef
} = React;

// Lucide icon renderer
function LI({
  name,
  size = 20,
  color,
  strokeWidth = 1.75,
  style
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          'stroke-width': strokeWidth
        }
      });
    }
  }, [name, size, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      color,
      ...style
    }
  });
}

// Tinted photography placeholder (this is a recreation — real imagery gets dropped in later)
function Photo({
  tint,
  label = 'Program imagery',
  radius = 'var(--radius-lg)',
  style,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      background: tint || 'linear-gradient(135deg, var(--lifed-aqua), var(--lifed-aqua-green))',
      borderRadius: radius,
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      color: 'rgba(10,72,66,0.35)'
    }
  }, /*#__PURE__*/React.createElement(LI, {
    name: "image",
    size: 26,
    color: "rgba(10,72,66,0.35)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase'
    }
  }, label)), children);
}
Object.assign(window, {
  LI,
  Photo
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/lib.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.ProgramCard = __ds_scope.ProgramCard;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.StepCard = __ds_scope.StepCard;

__ds_ns.TestimonialCard = __ds_scope.TestimonialCard;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SearchBar = __ds_scope.SearchBar;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Toggle = __ds_scope.Toggle;

__ds_ns.CategoryTabs = __ds_scope.CategoryTabs;

__ds_ns.NavBar = __ds_scope.NavBar;

})();
