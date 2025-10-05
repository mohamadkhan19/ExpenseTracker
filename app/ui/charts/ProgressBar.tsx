import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../theme';

interface ProgressBarProps {
  value: number; // Current value
  maxValue: number; // Maximum value (limit)
  width?: number;
  height?: number;
  showLabel?: boolean;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  warningThreshold?: number; // Percentage at which to show warning color
  criticalThreshold?: number; // Percentage at which to show critical color
  label?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export function ProgressBar({
  value,
  maxValue,
  width = screenWidth - 32,
  height = 20,
  showLabel = true,
  showPercentage = true,
  color,
  backgroundColor,
  warningThreshold = 80,
  criticalThreshold = 95,
  label,
}: ProgressBarProps) {
  const { theme } = useTheme();

  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const progressWidth = (percentage / 100) * width;

  // Determine color based on percentage
  const getProgressColor = () => {
    if (color) return color;
    
    if (percentage >= criticalThreshold) {
      return theme.colors.error;
    } else if (percentage >= warningThreshold) {
      return theme.colors.warning;
    } else {
      return theme.colors.primary;
    }
  };

  const progressColor = getProgressColor();
  const bgColor = backgroundColor || theme.colors.surface;

  return (
    <View style={[styles.container, { width }]}>
      {/* Label */}
      {showLabel && label && (
        <View style={styles.labelContainer}>
          <SvgText style={[styles.label, { color: theme.colors.text }]}>
            {label}
          </SvgText>
          {showPercentage && (
            <SvgText style={[styles.percentage, { color: theme.colors.subtext }]}>
              {percentage.toFixed(1)}%
            </SvgText>
          )}
        </View>
      )}

      {/* Progress bar container */}
      <View style={[styles.progressContainer, { height }]}>
        <Svg width={width} height={height}>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill={bgColor}
            rx={height / 2}
            ry={height / 2}
          />
          
          {/* Progress fill */}
          <Rect
            x={0}
            y={0}
            width={progressWidth}
            height={height}
            fill={progressColor}
            rx={height / 2}
            ry={height / 2}
          />
        </Svg>
      </View>

      {/* Value labels */}
      <View style={styles.valueContainer}>
        <SvgText style={[styles.valueText, { color: theme.colors.text }]}>
          ${value.toFixed(2)}
        </SvgText>
        <SvgText style={[styles.valueText, { color: theme.colors.subtext }]}>
          / ${maxValue.toFixed(2)}
        </SvgText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 12,
  },
  progressContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  valueText: {
    fontSize: 12,
  },
});
