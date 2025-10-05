import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '../../theme';
import { BarChartData } from '../../features/analytics/types';

interface BarChartProps {
  data: BarChartData;
  width?: number;
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  barWidth?: number;
  spacing?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export function BarChart({
  data,
  width = screenWidth - 32,
  height = 200,
  showGrid = true,
  showLabels = true,
  barWidth = 30,
  spacing = 10,
}: BarChartProps) {
  const { theme } = useTheme();

  if (!data.datasets.length || !data.labels.length) {
    return (
      <View style={[styles.container, { width, height }]}>
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

  // Calculate bar positions
  const totalBarWidth = barWidth + spacing;
  const availableWidth = chartWidth;
  const barsPerRow = Math.floor(availableWidth / totalBarWidth);
  const actualSpacing = barsPerRow > 1 ? (availableWidth - barsPerRow * barWidth) / (barsPerRow - 1) : 0;

  const bars = data.datasets[0].data.map((value, index) => {
    const barHeight = ((value - minValue) / valueRange) * chartHeight;
    const x = padding + index * (barWidth + actualSpacing);
    const y = padding + chartHeight - barHeight;
    
    return {
      x,
      y,
      width: barWidth,
      height: barHeight,
      value,
    };
  });

  // Grid lines
  const gridLines = showGrid ? Array.from({ length: 5 }, (_, i) => {
    const y = padding + (i / 4) * chartHeight;
    const value = maxValue - (i / 4) * valueRange;
    return { y, value };
  }) : [];

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {showGrid && gridLines.map((line, index) => (
          <G key={index}>
            <Rect
              x={padding}
              y={line.y}
              width={chartWidth}
              height={1}
              fill={theme.colors.border}
              opacity={0.3}
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

        {/* Bars */}
        {bars.map((bar, index) => (
          <G key={index}>
            <Rect
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              fill={data.datasets[0].color || theme.colors.primary}
              rx={2}
              ry={2}
            />
            
            {/* Value labels on top of bars */}
            {showLabels && bar.height > 20 && (
              <SvgText
                x={bar.x + bar.width / 2}
                y={bar.y - 4}
                fontSize={10}
                fill={theme.colors.text}
                textAnchor="middle"
              >
                ${bar.value.toFixed(0)}
              </SvgText>
            )}
          </G>
        ))}

        {/* X-axis labels */}
        {showLabels && data.labels.map((label, index) => {
          const bar = bars[index];
          const x = bar ? bar.x + bar.width / 2 : padding + index * (barWidth + actualSpacing);
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
