import React from 'react';
import { TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, style, ...props }: InputProps) {
  const theme = useTheme();
  
  const inputStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: error ? theme.colors.error : theme.colors.border,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
  };

  return (
    <View>
      {label && (
        <Text variant="sm" weight="medium" color="text" style={{ marginBottom: theme.spacing.xs }}>
          {label}
        </Text>
      )}
      <TextInput 
        style={[inputStyle, style]} 
        placeholderTextColor={theme.colors.subtext} 
        accessibilityLabel={label || 'Text input'}
        accessibilityHint={error ? `Error: ${error}` : helperText || 'Enter text'}
        accessibilityRole="text"
        {...props} 
      />
      {error && (
        <Text variant="xs" color="error" style={{ marginTop: theme.spacing.xs }}>
          {error}
        </Text>
      )}
      {helperText && !error && (
        <Text variant="xs" color="subtext" style={{ marginTop: theme.spacing.xs }}>
          {helperText}
        </Text>
      )}
    </View>
  );
}
