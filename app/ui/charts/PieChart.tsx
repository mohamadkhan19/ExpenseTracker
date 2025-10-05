import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '../../theme';
import { PieChartData } from '../../features/analytics/types';

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  innerRadius?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export function PieChart({
  data,
  size = Math.min(screenWidth - 32, 250),
  showLabels = true,
  showLegend = true,
  innerRadius = 0,
}: PieChartProps) {
  const { theme } = useTheme();

  if (!data.length) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View style={styles.emptyState}>
          {/* Empty state will be handled by parent */}
        </View>
      </View>
    );
  }

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size - 40) / 2;
  const actualInnerRadius = innerRadius * radius;

  // Calculate total value
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  // Generate colors if not provided
  const colors = [
    theme.colors.primary,
    theme.colors.error,
    theme.colors.success,
    theme.colors.warning,
    theme.colors.info,
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
  ];

  // Create pie slices
  let currentAngle = 0;
  const slices = data.map((item, index) => {
    const percentage = item.value / totalValue;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    // Calculate path for pie slice
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    let pathData = '';
    if (innerRadius > 0) {
      // Donut chart
      const innerX1 = centerX + actualInnerRadius * Math.cos(startAngleRad);
      const innerY1 = centerY + actualInnerRadius * Math.sin(startAngleRad);
      const innerX2 = centerX + actualInnerRadius * Math.cos(endAngleRad);
      const innerY2 = centerY + actualInnerRadius * Math.sin(endAngleRad);

      pathData = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        L ${innerX2} ${innerY2}
        A ${actualInnerRadius} ${actualInnerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1}
        Z
      `;
    } else {
      // Regular pie chart
      pathData = `
        M ${centerX} ${centerY}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;
    }

    currentAngle += angle;

    return {
      pathData,
      color: item.color || colors[index % colors.length],
      percentage,
      name: item.name,
      value: item.value,
      midAngle: startAngle + angle / 2,
    };
  });

  // Calculate label positions
  const labelRadius = radius * 0.7;
  const labels = slices.map(slice => {
    const angleRad = (slice.midAngle * Math.PI) / 180;
    const x = centerX + labelRadius * Math.cos(angleRad);
    const y = centerY + labelRadius * Math.sin(angleRad);
    return { x, y, ...slice };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Pie slices */}
        {slices.map((slice, index) => (
          <Path
            key={index}
            d={slice.pathData}
            fill={slice.color}
            stroke={theme.colors.background}
            strokeWidth={2}
          />
        ))}

        {/* Labels */}
        {showLabels && labels.map((label, index) => (
          <G key={index}>
            <SvgText
              x={label.x}
              y={label.y}
              fontSize={12}
              fill={theme.colors.text}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {label.percentage > 0.05 ? `${label.percentage.toFixed(1)}%` : ''}
            </SvgText>
          </G>
        ))}
      </Svg>

      {/* Legend */}
      {showLegend && (
        <View style={styles.legend}>
          {slices.map((slice, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: slice.color }]} />
              <SvgText style={styles.legendText}>
                {slice.name}: ${slice.value.toFixed(2)}
              </SvgText>
            </View>
          ))}
        </View>
      )}
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
  legend: {
    marginTop: 16,
    alignItems: 'flex-start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});
