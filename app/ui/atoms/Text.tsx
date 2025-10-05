import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../../theme';

interface TextProps extends RNTextProps {
  variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: 'text' | 'subtext' | 'primary' | 'error' | 'success';
}

export function Text({ 
  variant = 'md', 
  weight = 'regular', 
  color = 'text',
  style,
  ...props 
}: TextProps) {
  const theme = useTheme();
  
  return (
    <RNText
      style={[
        {
          fontSize: theme.fontSizes[variant],
          fontWeight: theme.fontWeights[weight],
          color: theme.colors[color],
        },
        style,
      ]}
      accessibilityRole="text"
      {...props}
    />
  );
}
