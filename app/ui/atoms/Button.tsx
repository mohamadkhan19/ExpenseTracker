import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  title, 
  variant = 'primary', 
  size = 'md',
  style,
  ...props 
}: ButtonProps) {
  const theme = useTheme();
  
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingHorizontal: theme.spacing[size === 'sm' ? 'md' : size === 'lg' ? 'xl' : 'lg'],
      paddingVertical: theme.spacing[size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'],
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surface,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return 'primaryContrastText' as const;
      case 'secondary':
        return 'text' as const;
      case 'outline':
        return 'text' as const;
      default:
        return 'text' as const;
    }
  };

  return (
    <TouchableOpacity 
      style={[getButtonStyle(), style]} 
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={`Tap to ${title.toLowerCase()}`}
      {...props} 
    >
      <Text 
        variant={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
        weight="medium"
        color={getTextColor()}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
