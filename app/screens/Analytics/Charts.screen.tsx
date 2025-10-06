import React, { useMemo, useState } from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { Text } from '../../ui/atoms/Text';
import { Button } from '../../ui/atoms/Button';
import { ChartContainer } from '../../ui/charts/ChartContainer';
import { LineChart } from '../../ui/charts/LineChart';
import { PieChart } from '../../ui/charts/PieChart';
import { BarChart } from '../../ui/charts/BarChart';
import { useTheme } from '../../theme';
import { useAnalytics } from '../../features/analytics/hooks/useAnalytics';
import { TimePeriod } from '../../features/analytics/types';

const { width: screenWidth } = Dimensions.get('window');

export default function ChartsScreen() {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  
  const {
    analyticsData,
    calculations,
    isLoading,
    error,
    updateTimeRange,
  } = useAnalytics();

  // Update time range when period changes
  React.useEffect(() => {
    updateTimeRange(selectedPeriod);
  }, [selectedPeriod, updateTimeRange]);

  // Prepare chart data
  const lineChartData = useMemo(() => {
    if (!analyticsData?.monthlyTrends.length) return null;

    return {
      labels: analyticsData.monthlyTrends.map(trend => trend.monthName),
      datasets: [{
        data: analyticsData.monthlyTrends.map(trend => trend.totalAmount),
        color: theme.colors.primary,
        strokeWidth: 3,
      }],
    };
  }, [analyticsData, theme.colors.primary]);

  const pieChartData = useMemo(() => {
    if (!analyticsData?.categoryBreakdown.length) return [];

    return analyticsData.categoryBreakdown.map((category, index) => ({
      name: category.category,
      value: category.amount,
      color: getCategoryColor(category.category, index),
      percentage: category.percentage,
    }));
  }, [analyticsData]);

  // Get category color
  function getCategoryColor(category: string, index: number): string {
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
    return colors[index % colors.length];
  }

  const periodOptions: { label: string; value: TimePeriod }[] = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Quarter', value: 'quarter' },
    { label: 'Year', value: 'year' },
    { label: 'All Time', value: 'all' },
  ];

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Text variant="lg" color="subtext">
            Loading charts...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Text variant="lg" color="error">
            Error loading charts: {error}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="xxl" weight="bold" color="text">
            Charts & Analytics
          </Text>
          <Text variant="md" color="subtext" style={styles.subtitle}>
            Visual insights into your spending patterns
          </Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <Text variant="sm" weight="medium" color="text" style={styles.periodLabel}>
            Time Period:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodScroll}>
            {periodOptions.map((option) => (
              <Button
                key={option.value}
                title={option.label}
                variant={selectedPeriod === option.value ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setSelectedPeriod(option.value)}
                style={styles.periodButton}
              />
            ))}
          </ScrollView>
        </View>

        {/* Quick Stats */}
        <ChartContainer
          title="Quick Stats"
          subtitle={`${selectedPeriod} overview`}
          showHeader={true}
        >
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="lg" weight="bold" color="text">
                ${calculations.totalSpent.toFixed(2)}
              </Text>
              <Text variant="sm" color="subtext">Total Spent</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="lg" weight="bold" color="text">
                ${calculations.averagePerDay.toFixed(2)}
              </Text>
              <Text variant="sm" color="subtext">Daily Average</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="lg" weight="bold" color="text">
                {analyticsData?.categoryBreakdown.length || 0}
              </Text>
              <Text variant="sm" color="subtext">Categories</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="lg" weight="bold" color={calculations.spendingGrowth >= 0 ? 'error' : 'success'}>
                {calculations.spendingGrowth >= 0 ? '+' : ''}{calculations.spendingGrowth.toFixed(1)}%
              </Text>
              <Text variant="sm" color="subtext">Growth</Text>
            </View>
          </View>
        </ChartContainer>

        {/* Monthly Trends Line Chart */}
        <ChartContainer
          title="Spending Trends"
          subtitle="Monthly spending over time"
          emptyMessage="No spending data available for the selected period"
        >
          {lineChartData && (
            <LineChart
              data={lineChartData}
              width={screenWidth - 64}
              height={200}
              showGrid={true}
              showLabels={true}
              strokeWidth={3}
              showDots={true}
            />
          )}
        </ChartContainer>

        {/* Category Breakdown Pie Chart */}
        <ChartContainer
          title="Category Breakdown"
          subtitle="Spending by category"
          emptyMessage="No category data available"
        >
          {pieChartData.length > 0 && (
            <PieChart
              data={pieChartData}
              size={Math.min(screenWidth - 64, 250)}
              showLabels={true}
              showLegend={true}
              innerRadius={0.3}
            />
          )}
        </ChartContainer>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  subtitle: {
    marginTop: 4,
  },
  periodSelector: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  periodLabel: {
    marginBottom: 8,
  },
  periodScroll: {
    flexDirection: 'row',
  },
  periodButton: {
    marginRight: 8,
    minWidth: 60,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    marginBottom: 8,
  },
  bottomPadding: {
    height: 100,
  },
});
