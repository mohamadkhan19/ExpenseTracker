import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  overlay?: boolean;
}

export function LoadingSpinner({ 
  size = 'large', 
  color, 
  message,
  overlay = false 
}: LoadingSpinnerProps) {
  const { theme } = useTheme();
  
  const containerStyle = overlay ? styles.overlay : styles.container;
  
  return (
    <View style={[containerStyle, { backgroundColor: overlay ? 'rgba(0,0,0,0.3)' : 'transparent' }]}>
      <View style={[styles.content, { backgroundColor: theme.colors.card }]}>
        <ActivityIndicator 
          size={size} 
          color={color || theme.colors.primary} 
        />
        {message && (
          <Text 
            variant="sm" 
            color="text" 
            style={{ marginTop: theme.spacing.md, textAlign: 'center' }}
          >
            {message}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
