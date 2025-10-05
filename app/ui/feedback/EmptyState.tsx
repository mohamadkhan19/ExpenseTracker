import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionTitle?: string;
  onAction?: () => void;
  icon?: string;
  variant?: 'fullscreen' | 'inline';
}

export function EmptyState({ 
  title, 
  subtitle, 
  actionTitle, 
  onAction,
  icon = '📝',
  variant = 'fullscreen'
}: EmptyStateProps) {
  const theme = useTheme();
  
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
        <Text variant="lg" color="subtext" style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="sm" color="subtext" style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
            {subtitle}
          </Text>
        )}
        {actionTitle && onAction && (
          <Button title={actionTitle} onPress={onAction} variant="primary" />
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
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});
