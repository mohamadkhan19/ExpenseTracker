import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, AppTheme } from './light';
import { darkTheme } from './dark';
import { AsyncStorageClient } from '../services/storage/asyncStorageClient';
import { STORAGE_KEYS } from '../services/storage/keys';
import { logger } from '../utils/logger';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: AppTheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorageClient.get<ThemeMode>(STORAGE_KEYS.THEME);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme);
        }
      } catch (error) {
        logger.error('Failed to load theme preference', error as Error);
      }
    };
    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorageClient.set(STORAGE_KEYS.THEME, mode);
    } catch (error) {
      logger.error('Failed to save theme preference', error as Error, { mode });
    }
  };

  // Toggle between light and dark (ignoring system)
  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  // Determine which theme to use
  const theme = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    } else {
      return themeMode === 'dark' ? darkTheme : lightTheme;
    }
  }, [themeMode, systemColorScheme]);

  const contextValue = useMemo(() => ({
    theme,
    themeMode,
    setThemeMode,
    toggleTheme,
  }), [theme, themeMode]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}


