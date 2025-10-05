import { darkColors } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { fontSizes, fontWeights } from './tokens/typography';
import { radii } from './tokens/radii';
import { zIndex } from './tokens/zIndex';

export const darkTheme = {
  colors: darkColors,
  spacing,
  fontSizes,
  fontWeights,
  radii,
  zIndex,
  mode: 'dark' as const,
};


