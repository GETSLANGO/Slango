/**
 * Mobile Typography System
 * Ensures readable fonts across all device sizes
 */

import { Platform, PixelRatio } from 'react-native';

/**
 * Normalize font sizes for different screen densities
 */
const normalize = (size) => {
  const scale = PixelRatio.get();
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(size));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(size)) - 2;
  }
};

/**
 * Typography scale optimized for mobile readability
 */
export const typography = {
  // Headings
  h1: {
    fontSize: normalize(32),
    fontWeight: '700',
    lineHeight: normalize(40),
    letterSpacing: 0.5,
  },
  h2: {
    fontSize: normalize(28),
    fontWeight: '700',
    lineHeight: normalize(36),
    letterSpacing: 0.25,
  },
  h3: {
    fontSize: normalize(24),
    fontWeight: '600',
    lineHeight: normalize(32),
  },
  h4: {
    fontSize: normalize(20),
    fontWeight: '600',
    lineHeight: normalize(28),
  },
  h5: {
    fontSize: normalize(18),
    fontWeight: '600',
    lineHeight: normalize(26),
  },
  h6: {
    fontSize: normalize(16),
    fontWeight: '600',
    lineHeight: normalize(24),
  },

  // Body text
  body1: {
    fontSize: normalize(18),
    fontWeight: '400',
    lineHeight: normalize(28),
  },
  body2: {
    fontSize: normalize(16),
    fontWeight: '400',
    lineHeight: normalize(24),
  },
  body3: {
    fontSize: normalize(14),
    fontWeight: '400',
    lineHeight: normalize(22),
  },

  // Interactive text
  button: {
    fontSize: normalize(16),
    fontWeight: '600',
    lineHeight: normalize(24),
  },
  buttonLarge: {
    fontSize: normalize(18),
    fontWeight: '700',
    lineHeight: normalize(26),
  },
  buttonSmall: {
    fontSize: normalize(14),
    fontWeight: '600',
    lineHeight: normalize(20),
  },

  // Input text
  input: {
    fontSize: normalize(18),
    fontWeight: '500',
    lineHeight: normalize(26),
  },
  inputLarge: {
    fontSize: normalize(20),
    fontWeight: '500',
    lineHeight: normalize(28),
  },

  // Labels and captions
  label: {
    fontSize: normalize(14),
    fontWeight: '500',
    lineHeight: normalize(20),
  },
  caption: {
    fontSize: normalize(12),
    fontWeight: '400',
    lineHeight: normalize(18),
  },
  overline: {
    fontSize: normalize(10),
    fontWeight: '500',
    lineHeight: normalize(16),
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
};

/**
 * Color system for dark theme
 */
export const colors = {
  // Primary colors
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',

  // Secondary colors
  secondary: '#10B981',
  secondaryDark: '#059669',
  secondaryLight: '#34D399',

  // Background colors
  background: '#111827',
  surface: '#1F2937',
  card: '#374151',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textDisabled: '#6B7280',

  // Border colors
  border: '#374151',
  borderLight: '#4B5563',
  borderDark: '#1F2937',

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Transparent overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',
};

/**
 * Spacing system
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

/**
 * Border radius system
 */
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 50,
};

/**
 * Shadow system
 */
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default {
  typography,
  colors,
  spacing,
  borderRadius,
  shadows,
  normalize,
};