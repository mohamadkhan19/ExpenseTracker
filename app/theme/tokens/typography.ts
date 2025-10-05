export type FontSizes = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
};

export type FontWeights = {
  light: '300';
  regular: '400';
  medium: '500';
  semibold: '600';
  bold: '700';
  heavy: '800';
};

export const fontSizes: FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontWeights: FontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
};

export const typography = {
  // Robinhood-style text styles
  display: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    lineHeight: 40,
  },
  headline: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.semibold,
    lineHeight: 32,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.medium,
    lineHeight: 24,
  },
  body: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: 20,
  },
  caption: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: 16,
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: 14,
  },
};


