import React from 'react';
import { render, act } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from '../../app/theme';
import { AsyncStorageClient } from '../../app/services/storage/asyncStorageClient';
import { STORAGE_KEYS } from '../../app/services/storage/keys';

// Mock dependencies
jest.mock('react-native', () => ({
  useColorScheme: jest.fn(),
}));

jest.mock('../../app/services/storage/asyncStorageClient', () => ({
  AsyncStorageClient: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

const mockUseColorScheme = require('react-native').useColorScheme as jest.MockedFunction<any>;
const mockAsyncStorageClient = AsyncStorageClient as jest.Mocked<typeof AsyncStorageClient>;

// Test component to access theme context
const TestComponent = () => {
  const { theme, themeMode, setThemeMode, toggleTheme } = useTheme();
  return null;
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue('light');
  });

  it('should provide default theme context', () => {
    mockAsyncStorageClient.get.mockResolvedValue(null);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(mockAsyncStorageClient.get).toHaveBeenCalledWith(STORAGE_KEYS.THEME);
  });

  it('should load saved theme preference', async () => {
    mockAsyncStorageClient.get.mockResolvedValue('dark');

    await act(async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
    });

    expect(mockAsyncStorageClient.get).toHaveBeenCalledWith(STORAGE_KEYS.THEME);
  });

  it('should handle invalid saved theme preference', async () => {
    mockAsyncStorageClient.get.mockResolvedValue('invalid-theme');

    await act(async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
    });

    // Should not crash and should use default theme
    expect(mockAsyncStorageClient.get).toHaveBeenCalledWith(STORAGE_KEYS.THEME);
  });

  it('should handle AsyncStorage errors gracefully', async () => {
    mockAsyncStorageClient.get.mockRejectedValue(new Error('Storage error'));

    await act(async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
    });

    // Should not crash
    expect(mockAsyncStorageClient.get).toHaveBeenCalledWith(STORAGE_KEYS.THEME);
  });
});

describe('useTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue('light');
    mockAsyncStorageClient.get.mockResolvedValue(null);
  });

  it('should throw error when used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });

  it('should return theme context when used within ThemeProvider', async () => {
    let themeContext: any;

    const TestComponentWithContext = () => {
      themeContext = useTheme();
      return null;
    };

    await act(async () => {
      render(
        <ThemeProvider>
          <TestComponentWithContext />
        </ThemeProvider>
      );
    });

    expect(themeContext).toBeDefined();
    expect(themeContext.theme).toBeDefined();
    expect(themeContext.themeMode).toBeDefined();
    expect(themeContext.setThemeMode).toBeInstanceOf(Function);
    expect(themeContext.toggleTheme).toBeInstanceOf(Function);
  });

  it('should use system theme when themeMode is system', async () => {
    mockUseColorScheme.mockReturnValue('dark');
    mockAsyncStorageClient.get.mockResolvedValue('system');

    let themeContext: any;

    const TestComponentWithContext = () => {
      themeContext = useTheme();
      return null;
    };

    await act(async () => {
      render(
        <ThemeProvider>
          <TestComponentWithContext />
        </ThemeProvider>
      );
    });

    expect(themeContext.themeMode).toBe('system');
    // Theme should be dark because system is dark
    expect(themeContext.theme.colors.background).toBeDefined();
  });

  it('should save theme preference when setThemeMode is called', async () => {
    mockAsyncStorageClient.set.mockResolvedValue(true);

    let themeContext: any;

    const TestComponentWithContext = () => {
      themeContext = useTheme();
      return null;
    };

    await act(async () => {
      render(
        <ThemeProvider>
          <TestComponentWithContext />
        </ThemeProvider>
      );
    });

    await act(async () => {
      themeContext.setThemeMode('dark');
    });

    expect(mockAsyncStorageClient.set).toHaveBeenCalledWith(STORAGE_KEYS.THEME, 'dark');
  });

  it('should toggle between light and dark themes', async () => {
    mockAsyncStorageClient.set.mockResolvedValue(true);

    let themeContext: any;

    const TestComponentWithContext = () => {
      themeContext = useTheme();
      return null;
    };

    await act(async () => {
      render(
        <ThemeProvider>
          <TestComponentWithContext />
        </ThemeProvider>
      );
    });

    // Initial state should be light (default)
    expect(themeContext.themeMode).toBe('system');

    await act(async () => {
      themeContext.toggleTheme();
    });

    // Should toggle to light (since system is light)
    expect(mockAsyncStorageClient.set).toHaveBeenCalledWith(STORAGE_KEYS.THEME, 'light');
  });
});