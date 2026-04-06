/**
 * Cleartrip + Trippy Design System Tokens
 * Source of truth for colors, typography, spacing, and radii.
 */

export const Colors = {
  // ── Core Brand (Transactional) ──────────────────────────────────
  orange:        '#FF4F17',   // Primary CTA — Book, Search, Start
  orangeLight:   '#FFF0EB',

  // ── Trippy AI Theme ─────────────────────────────────────────────
  purple:        '#7B3FF2',   // AI actions, user chat bubbles, AI Top Pick
  purpleLight:   '#F8F5FF',   // AI reasoning block backgrounds
  purpleSoft:    '#EDE8FF',   // AI banner tint

  // ── Secondary Action ─────────────────────────────────────────────
  black:         '#1A1A1A',   // [Add], [Select], headings, nav backgrounds
  blackSoft:     '#2D2D2D',

  // ── Semantic ─────────────────────────────────────────────────────
  green:         '#00A656',   // Booked, Free cancellation, savings
  greenLight:    '#E6F7EF',
  red:           '#D32F2F',   // Remove, alert
  redLight:      '#FDECEA',
  blue:          '#2274E0',   // Rating scores, text links ("More Details")
  blueLight:     '#EBF2FD',
  yellow:        '#F59E0B',   // Star icon

  // ── Neutrals ─────────────────────────────────────────────────────
  white:         '#FFFFFF',
  bg:            '#F8FAFC',   // slate-50 — scrolling canvas
  cardBg:        '#F1F5F9',   // slate-100
  border:        '#E2E8F0',   // slate-200
  borderDark:    '#CBD5E1',   // slate-300
  divider:       '#E2E8F0',

  // ── Text ─────────────────────────────────────────────────────────
  textPrimary:   '#0F172A',   // slate-900
  textSecondary: '#64748B',   // slate-500
  textMuted:     '#94A3B8',   // slate-400
  textWhite:     '#FFFFFF',

  // ── Timeline ─────────────────────────────────────────────────────
  timelineDash:  '#CBD5E1',   // slate-300

  // ── Shadows ──────────────────────────────────────────────────────
  shadowColor:   '#000',

  // ── Tab indicators ───────────────────────────────────────────────
  tabInactive:   '#94A3B8',
  tabActive:     '#FF4F17',
};

export const Fonts = {
  regular:   { fontFamily: 'Inter_400Regular' },
  medium:    { fontFamily: 'Inter_500Medium' },
  semibold:  { fontFamily: 'Inter_600SemiBold' },
  bold:      { fontFamily: 'Inter_700Bold' },
  extrabold: { fontFamily: 'Inter_800ExtraBold' },
};

export const Radius = {
  xs:     6,
  sm:     12,    // Standard rectangular buttons
  md:     16,    // Inner images, small cards
  lg:     20,    // Main cards
  xl:     24,    // Large cards
  xxl:    32,    // Modals & bottom sheets (top corners)
  full:   9999,
};

export const Spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,      // Screen horizontal padding
  xxl:  24,
  xxxl: 32,
};
