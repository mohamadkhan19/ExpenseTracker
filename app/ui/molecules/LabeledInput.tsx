import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';
import { Input } from '../atoms/Input';

interface LabeledInputProps {
  label: string;
  error?: string;
  [key: string]: any;
}

export function LabeledInput({ label, error, ...inputProps }: LabeledInputProps) {
  const { theme } = useTheme();
  
  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text variant="sm" weight="medium" color="text" style={{ marginBottom: theme.spacing.xs }}>
        {label}
      </Text>
      <Input error={error} {...inputProps} />
    </View>
  );
}
