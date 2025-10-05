import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  icon?: string;
  variant?: 'fullscreen' | 'inline';
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message = 'Please try again later',
  onRetry,
  icon = '⚠️',
  variant = 'fullscreen'
}: ErrorStateProps) {
  const { theme } = useTheme();
  
  const containerStyle = variant === 'fullscreen' ? styles.fullscreen : styles.inline;
  
  return (
    <View style={[containerStyle, { 
      paddingHorizontal: variant === 'fullscreen' ? theme.spacing.xl : theme.spacing.md,
      paddingVertical: variant === 'fullscreen' ? theme.spacing.xxl : theme.spacing.md,
    }]}>
      <View style={[styles.content, { backgroundColor: theme.colors.card }]}>
        <Text variant="xxl" style={{ marginBottom: theme.spacing.sm }}>
          {icon}
        </Text>
        <Text variant="lg" color="error" style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>
          {title}
        </Text>
        <Text variant="sm" color="subtext" style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
          {message}
        </Text>
        {onRetry && (
          <Button title="Try Again" onPress={onRetry} variant="primary" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inline: {
    alignItems: 'center',
    marginVertical: 16,
  },
  content: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,0,0,0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
