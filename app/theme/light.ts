import { lightColors } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { fontSizes, fontWeights } from './tokens/typography';
import { radii } from './tokens/radii';
import { zIndex } from './tokens/zIndex';

export const lightTheme = {
  colors: lightColors,
  spacing,
  fontSizes,
  fontWeights,
  radii,
  zIndex,
  mode: 'light' as const,
};

export type AppTheme = typeof lightTheme;


