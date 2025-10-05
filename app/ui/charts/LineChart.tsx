import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline, Circle, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '../../theme';
import { LineChartData } from '../../features/analytics/types';

interface LineChartProps {
  data: LineChartData;
  width?: number;
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  strokeWidth?: number;
  showDots?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export function LineChart({
  data,
  width = screenWidth - 32,
  height = 200,
  showGrid = true,
  showLabels = true,
  strokeWidth = 2,
  showDots = true,
  accessibilityLabel = 'Line chart showing spending trends over time',
  accessibilityHint = 'Swipe to explore different time periods',
}: LineChartProps) {
  const { theme } = useTheme();

  if (!data.datasets.length || !data.labels.length) {
    return (
      <View 
        style={[styles.container, { width, height }]}
        accessibilityRole="image"
        accessibilityLabel="No data available for line chart"
        accessibilityHint="Add expenses to see spending trends"
      >
        <View style={styles.emptyState}>
          {/* Empty state will be handled by parent */}
        </View>
      </View>
    );
  }

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate data points
  const maxValue = Math.max(...data.datasets[0].data);
  const minValue = Math.min(...data.datasets[0].data);
  const valueRange = maxValue - minValue || 1;

  const points = data.datasets[0].data.map((value, index) => {
    const x = padding + (index / (data.labels.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
    return { x, y, value };
  });

  // Create polyline path
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  // Grid lines
  const gridLines = showGrid ? Array.from({ length: 5 }, (_, i) => {
    const y = padding + (i / 4) * chartHeight;
    const value = maxValue - (i / 4) * valueRange;
    return { y, value };
  }) : [];

  // Generate accessibility description
  const accessibilityDescription = `Line chart showing ${data.labels.length} data points. ` +
    `Highest value: $${maxValue.toFixed(2)}, lowest value: $${minValue.toFixed(2)}. ` +
    `Latest value: $${points[points.length - 1]?.value.toFixed(2) || '0.00'}`;

  return (
    <View 
      style={[styles.container, { width, height }]}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityDescription={accessibilityDescription}
    >
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {showGrid && gridLines.map((line, index) => (
          <G key={index}>
            <Polyline
              points={`${padding},${line.y} ${width - padding},${line.y}`}
              stroke={theme.colors.border}
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            {showLabels && (
              <SvgText
                x={padding - 8}
                y={line.y + 4}
                fontSize={12}
                fill={theme.colors.subtext}
                textAnchor="end"
              >
                ${line.value.toFixed(0)}
              </SvgText>
            )}
          </G>
        ))}

        {/* Chart line */}
        <Polyline
          points={pathData}
          fill="none"
          stroke={data.datasets[0].color || theme.colors.primary}
          strokeWidth={strokeWidth}
        />

        {/* Data points */}
        {showDots && points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={data.datasets[0].color || theme.colors.primary}
            stroke={theme.colors.background}
            strokeWidth={2}
          />
        ))}

        {/* X-axis labels */}
        {showLabels && data.labels.map((label, index) => {
          const x = padding + (index / (data.labels.length - 1)) * chartWidth;
          return (
            <SvgText
              key={index}
              x={x}
              y={height - padding + 16}
              fontSize={12}
              fill={theme.colors.subtext}
              textAnchor="middle"
            >
              {label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});