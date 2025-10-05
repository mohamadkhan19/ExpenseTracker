import React, { useMemo, useState } from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { Text } from '../../ui/atoms/Text';
import { Button } from '../../ui/atoms/Button';
import { ChartContainer } from '../../ui/charts/ChartContainer';
import { LineChart } from '../../ui/charts/LineChart';
import { BarChart } from '../../ui/charts/BarChart';
import { useTheme } from '../../theme';
import { useAnalytics } from '../../features/analytics/hooks/useAnalytics';
import { TimePeriod } from '../../features/analytics/types';

const { width: screenWidth } = Dimensions.get('window');

export default function TrendsScreen() {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const [selectedView, setSelectedView] = useState<'overview' | 'categories' | 'patterns'>('overview');
  
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

  // Prepare trend data
  const monthlyTrendData = useMemo(() => {
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

  const categoryTrendData = useMemo(() => {
    if (!analyticsData?.monthlyTrends.length) return null;

    // Get top 3 categories for trend analysis
    const topCategories = analyticsData.categoryBreakdown.slice(0, 3);
    const colors = [theme.colors.primary, theme.colors.error, theme.colors.success];

    return {
      labels: analyticsData.monthlyTrends.map(trend => trend.monthName),
      datasets: topCategories.map((category, index) => ({
        data: analyticsData.monthlyTrends.map(trend => {
          const categoryTrend = trend.categories.find(c => c.category === category.category);
          return categoryTrend ? categoryTrend.amount : 0;
        }),
        color: colors[index % colors.length],
        strokeWidth: 2,
      })),
    };
  }, [analyticsData, theme.colors]);

  const spendingPatternData = useMemo(() => {
    if (!analyticsData?.spendingPatterns.length) return null;

    return {
      labels: analyticsData.spendingPatterns.map(pattern => pattern.dayOfWeek.slice(0, 3)),
      datasets: [{
        data: analyticsData.spendingPatterns.map(pattern => pattern.averageAmount),
        color: theme.colors.primary,
      }],
    };
  }, [analyticsData, theme.colors.primary]);

  const periodOptions: { label: string; value: TimePeriod }[] = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Quarter', value: 'quarter' },
    { label: 'Year', value: 'year' },
    { label: 'All Time', value: 'all' },
  ];

  const viewOptions: { label: string; value: 'overview' | 'categories' | 'patterns' }[] = [
    { label: 'Overview', value: 'overview' },
    { label: 'Categories', value: 'categories' },
    { label: 'Patterns', value: 'patterns' },
  ];

  const getTrendInsight = () => {
    if (!calculations.spendingGrowth) return null;

    if (calculations.spendingGrowth > 10) {
      return {
        type: 'increase',
        message: `Spending increased by ${calculations.spendingGrowth.toFixed(1)}% compared to previous period`,
        color: theme.colors.error,
      };
    } else if (calculations.spendingGrowth < -10) {
      return {
        type: 'decrease',
        message: `Spending decreased by ${Math.abs(calculations.spendingGrowth).toFixed(1)}% compared to previous period`,
        color: theme.colors.success,
      };
    } else {
      return {
        type: 'stable',
        message: `Spending is relatively stable (${calculations.spendingGrowth >= 0 ? '+' : ''}${calculations.spendingGrowth.toFixed(1)}%)`,
        color: theme.colors.subtext,
      };
    }
  };

  const getTopCategoryInsight = () => {
    if (!calculations.mostExpensiveCategory) return null;

    return {
      category: calculations.mostExpensiveCategory.category,
      amount: calculations.mostExpensiveCategory.amount,
      percentage: calculations.mostExpensiveCategory.percentage,
    };
  };

  const getPatternInsight = () => {
    if (!analyticsData?.spendingPatterns.length) return null;

    const patterns = analyticsData.spendingPatterns;
    const highestDay = patterns.reduce((max, pattern) => 
      pattern.averageAmount > max.averageAmount ? pattern : max
    );
    const lowestDay = patterns.reduce((min, pattern) => 
      pattern.averageAmount < min.averageAmount ? pattern : min
    );

    return {
      highestDay: highestDay.dayOfWeek,
      highestAmount: highestDay.averageAmount,
      lowestDay: lowestDay.dayOfWeek,
      lowestAmount: lowestDay.averageAmount,
    };
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Text variant="lg" color="subtext">
            Loading trends...
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
            Error loading trends: {error}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const trendInsight = getTrendInsight();
  const topCategoryInsight = getTopCategoryInsight();
  const patternInsight = getPatternInsight();

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="xxl" weight="bold" color="text">
            Trends & Patterns
          </Text>
          <Text variant="md" color="subtext" style={styles.subtitle}>
            Analyze your spending behavior over time
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

        {/* View Selector */}
        <View style={styles.viewSelector}>
          <Text variant="sm" weight="medium" color="text" style={styles.viewLabel}>
            View:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.viewScroll}>
            {viewOptions.map((option) => (
              <Button
                key={option.value}
                title={option.label}
                variant={selectedView === option.value ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setSelectedView(option.value)}
                style={styles.viewButton}
              />
            ))}
          </ScrollView>
        </View>

        {/* Trend Insights */}
        {trendInsight && (
          <ChartContainer
            title="Trend Insight"
            subtitle="Spending change analysis"
          >
            <View style={styles.insightContainer}>
              <View style={[styles.insightIcon, { backgroundColor: trendInsight.color }]}>
                <Text variant="sm" color="white">
                  {trendInsight.type === 'increase' ? '↗' : trendInsight.type === 'decrease' ? '↘' : '→'}
                </Text>
              </View>
              <Text variant="md" color="text" style={styles.insightText}>
                {trendInsight.message}
              </Text>
            </View>
          </ChartContainer>
        )}

        {/* Overview View */}
        {selectedView === 'overview' && (
          <>
            {/* Monthly Trends */}
            <ChartContainer
              title="Monthly Spending Trends"
              subtitle="Total spending over time"
              emptyMessage="No spending data available for the selected period"
            >
              {monthlyTrendData && (
                <LineChart
                  data={monthlyTrendData}
                  width={screenWidth - 64}
                  height={200}
                  showGrid={true}
                  showLabels={true}
                  strokeWidth={3}
                  showDots={true}
                />
              )}
            </ChartContainer>

            {/* Spending Patterns */}
            <ChartContainer
              title="Weekly Spending Patterns"
              subtitle="Average spending by day of week"
              emptyMessage="No spending pattern data available"
            >
              {spendingPatternData && (
                <BarChart
                  data={spendingPatternData}
                  width={screenWidth - 64}
                  height={200}
                  showGrid={true}
                  showLabels={true}
                  barWidth={40}
                  spacing={8}
                />
              )}
            </ChartContainer>

            {/* Pattern Insights */}
            {patternInsight && (
              <ChartContainer
                title="Pattern Insights"
                subtitle="Key spending patterns"
              >
                <View style={styles.patternInsights}>
                  <View style={styles.patternItem}>
                    <Text variant="sm" color="subtext">Highest spending day</Text>
                    <Text variant="md" weight="semibold" color="text">
                      {patternInsight.highestDay}: ${patternInsight.highestAmount.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.patternItem}>
                    <Text variant="sm" color="subtext">Lowest spending day</Text>
                    <Text variant="md" weight="semibold" color="text">
                      {patternInsight.lowestDay}: ${patternInsight.lowestAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </ChartContainer>
            )}
          </>
        )}

        {/* Categories View */}
        {selectedView === 'categories' && (
          <>
            {/* Category Trends */}
            <ChartContainer
              title="Category Trends"
              subtitle="Top categories over time"
              emptyMessage="No category data available"
            >
              {categoryTrendData && (
                <LineChart
                  data={categoryTrendData}
                  width={screenWidth - 64}
                  height={200}
                  showGrid={true}
                  showLabels={true}
                  strokeWidth={2}
                  showDots={true}
                />
              )}
            </ChartContainer>

            {/* Top Category Insight */}
            {topCategoryInsight && (
              <ChartContainer
                title="Top Spending Category"
                subtitle="Your highest spending category"
              >
                <View style={styles.categoryInsight}>
                  <Text variant="lg" weight="bold" color="text">
                    {topCategoryInsight.category.charAt(0).toUpperCase() + topCategoryInsight.category.slice(1)}
                  </Text>
                  <Text variant="md" color="subtext" style={styles.categoryAmount}>
                    ${topCategoryInsight.amount.toFixed(2)} ({topCategoryInsight.percentage.toFixed(1)}% of total)
                  </Text>
                </View>
              </ChartContainer>
            )}

            {/* Category Breakdown */}
            <ChartContainer
              title="Category Breakdown"
              subtitle="Current period spending by category"
              emptyMessage="No category data available"
            >
              {analyticsData?.categoryBreakdown.map((category, index) => (
                <View key={category.category} style={styles.categoryItem}>
                  <View style={styles.categoryLeft}>
                    <View style={[styles.categoryColor, { backgroundColor: getCategoryColor(category.category, index) }]} />
                    <View style={styles.categoryInfo}>
                      <Text variant="md" weight="medium" color="text">
                        {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
                      </Text>
                      <Text variant="sm" color="subtext">
                        {category.count} transactions
                      </Text>
                    </View>
                  </View>
                  <View style={styles.categoryRight}>
                    <Text variant="md" weight="semibold" color="text">
                      ${category.amount.toFixed(2)}
                    </Text>
                    <Text variant="sm" color="subtext">
                      {category.percentage.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              ))}
            </ChartContainer>
          </>
        )}

        {/* Patterns View */}
        {selectedView === 'patterns' && (
          <>
            {/* Spending Patterns Chart */}
            <ChartContainer
              title="Spending Patterns"
              subtitle="Average spending by day of week"
              emptyMessage="No spending pattern data available"
            >
              {spendingPatternData && (
                <BarChart
                  data={spendingPatternData}
                  width={screenWidth - 64}
                  height={200}
                  showGrid={true}
                  showLabels={true}
                  barWidth={40}
                  spacing={8}
                />
              )}
            </ChartContainer>

            {/* Pattern Analysis */}
            <ChartContainer
              title="Pattern Analysis"
              subtitle="Detailed spending pattern insights"
            >
              <View style={styles.patternAnalysis}>
                {analyticsData?.spendingPatterns.map((pattern, index) => (
                  <View key={pattern.dayOfWeek} style={styles.patternRow}>
                    <View style={styles.patternLeft}>
                      <Text variant="md" weight="medium" color="text">
                        {pattern.dayOfWeek}
                      </Text>
                      <Text variant="sm" color="subtext">
                        {pattern.count} transactions
                      </Text>
                    </View>
                    <View style={styles.patternRight}>
                      <Text variant="md" weight="semibold" color="text">
                        ${pattern.averageAmount.toFixed(2)}
                      </Text>
                      <Text variant="sm" color="subtext">
                        {pattern.percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ChartContainer>
          </>
        )}

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenContainer>
  );

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
  viewSelector: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  viewLabel: {
    marginBottom: 8,
  },
  viewScroll: {
    flexDirection: 'row',
  },
  viewButton: {
    marginRight: 8,
    minWidth: 80,
  },
  insightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightText: {
    flex: 1,
  },
  patternInsights: {
    gap: 16,
  },
  patternItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInsight: {
    alignItems: 'center',
    padding: 20,
  },
  categoryAmount: {
    marginTop: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  patternAnalysis: {
    gap: 12,
  },
  patternRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  patternLeft: {
    flex: 1,
  },
  patternRight: {
    alignItems: 'flex-end',
  },
  bottomPadding: {
    height: 100,
  },
});
