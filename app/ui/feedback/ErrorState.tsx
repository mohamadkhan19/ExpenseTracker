import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message = 'Please try again later',
  onRetry 
}: ErrorStateProps) {
  const theme = useTheme();
  
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xxl,
    }}>
      <Text variant="lg" color="error" style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>
        {title}
      </Text>
      <Text variant="sm" color="subtext" style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
        {message}
      </Text>
      {onRetry && (
        <Button title="Retry" onPress={onRetry} />
      )}
    </View>
  );
}
