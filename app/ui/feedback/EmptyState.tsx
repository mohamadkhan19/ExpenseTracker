import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionTitle?: string;
  onAction?: () => void;
}

export function EmptyState({ title, subtitle, actionTitle, onAction }: EmptyStateProps) {
  const theme = useTheme();
  
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xxl,
    }}>
      <Text variant="lg" color="subtext" style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="sm" color="subtext" style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
          {subtitle}
        </Text>
      )}
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} />
      )}
    </View>
  );
}
