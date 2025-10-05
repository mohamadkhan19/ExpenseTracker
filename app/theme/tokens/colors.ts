export type ColorSchemeName = 'light' | 'dark';

export type Colors = {
  background: string;
  surface: string;
  text: string;
  subtext: string;
  primary: string;
  primaryContrastText: string;
  card: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  // Robinhood-specific colors
  gain: string;
  loss: string;
  neutral: string;
};

export const lightColors: Colors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#1A1A1A',
  subtext: '#6B7280',
  primary: '#00C805', // Robinhood green
  primaryContrastText: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E5E7EB',
  error: '#EF4444', // Red for losses
  success: '#00C805', // Green for gains
  warning: '#F59E0B',
  gain: '#00C805', // Robinhood green
  loss: '#EF4444', // Red
  neutral: '#6B7280', // Gray
};

export const darkColors: Colors = {
  background: '#000000',
  surface: '#0A0A0A',
  text: '#FFFFFF',
  subtext: '#9CA3AF',
  primary: '#00C805', // Robinhood green
  primaryContrastText: '#000000',
  card: '#1A1A1A',
  border: '#374151',
  error: '#EF4444', // Red for losses
  success: '#00C805', // Green for gains
  warning: '#F59E0B',
  gain: '#00C805', // Robinhood green
  loss: '#EF4444', // Red
  neutral: '#9CA3AF', // Gray
};


