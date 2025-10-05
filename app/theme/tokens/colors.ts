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
};

export const lightColors: Colors = {
  background: '#FFFFFF',
  surface: '#F7F7F9',
  text: '#111827',
  subtext: '#6B7280',
  primary: '#2563EB',
  primaryContrastText: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E5E7EB',
  error: '#DC2626',
  success: '#16A34A',
  warning: '#D97706',
};

export const darkColors: Colors = {
  background: '#0B1220',
  surface: '#111827',
  text: '#F3F4F6',
  subtext: '#9CA3AF',
  primary: '#60A5FA',
  primaryContrastText: '#0B1220',
  card: '#111827',
  border: '#1F2937',
  error: '#F87171',
  success: '#34D399',
  warning: '#F59E0B',
};


