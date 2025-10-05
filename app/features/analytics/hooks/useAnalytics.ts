import { useMemo, useState, useCallback } from 'react';
import { useGetExpensesQuery } from '../../../store/api/expenses.api';
import { 
  AnalyticsData, 
  AnalyticsFilters, 
  AnalyticsCalculations,
  TimePeriod 
} from '../analytics/types';
import { 
  calculateAnalyticsData, 
  calculateAnalyticsCalculations,
  filterExpensesByAnalyticsFilters,
  generateTimeRange 
} from '../analytics/utils';

export function useAnalytics() {
  const { data: allExpenses = [], isLoading, error } = useGetExpensesQuery();
  const [filters, setFilters] = useState<AnalyticsFilters>(() => ({
    timeRange: generateTimeRange('month'),
    categories: [],
  }));

  // Filter expenses based on current filters
  const filteredExpenses = useMemo(() => {
    return filterExpensesByAnalyticsFilters(allExpenses, filters);
  }, [allExpenses, filters]);

  // Calculate analytics data for filtered expenses
  const analyticsData = useMemo(() => {
    return calculateAnalyticsData(filteredExpenses);
  }, [filteredExpenses]);

  // Calculate analytics data for previous period (for growth calculations)
  const previousAnalyticsData = useMemo(() => {
    if (filters.timeRange.period === 'all') return undefined;
    
    const previousTimeRange = generateTimeRange(filters.timeRange.period);
    const previousStartDate = new Date(previousTimeRange.startDate);
    const previousEndDate = new Date(previousTimeRange.endDate);
    
    // Adjust dates to get previous period
    const periodLength = previousEndDate.getTime() - previousStartDate.getTime();
    const adjustedStartDate = new Date(previousStartDate.getTime() - periodLength);
    const adjustedEndDate = new Date(previousEndDate.getTime() - periodLength);
    
    const adjustedTimeRange = {
      startDate: adjustedStartDate.toISOString().split('T')[0],
      endDate: adjustedEndDate.toISOString().split('T')[0],
      period: filters.timeRange.period,
    };
    
    const previousExpenses = filterExpensesByAnalyticsFilters(allExpenses, {
      ...filters,
      timeRange: adjustedTimeRange,
    });
    
    return calculateAnalyticsData(previousExpenses);
  }, [allExpenses, filters]);

  // Calculate analytics calculations
  const calculations = useMemo(() => {
    return calculateAnalyticsCalculations(analyticsData, previousAnalyticsData);
  }, [analyticsData, previousAnalyticsData]);

  // Filter handlers
  const updateTimeRange = useCallback((period: TimePeriod) => {
    setFilters(prev => ({
      ...prev,
      timeRange: generateTimeRange(period),
    }));
  }, []);

  const updateCategories = useCallback((categories: string[]) => {
    setFilters(prev => ({
      ...prev,
      categories: categories as any[], // Type assertion for ExpenseCategory
    }));
  }, []);

  const updateAmountRange = useCallback((minAmount?: number, maxAmount?: number) => {
    setFilters(prev => ({
      ...prev,
      minAmount,
      maxAmount,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      timeRange: generateTimeRange('month'),
      categories: [],
    });
  }, []);

  // Quick filter presets
  const setQuickFilter = useCallback((preset: 'this_month' | 'last_month' | 'this_year' | 'all_time') => {
    switch (preset) {
      case 'this_month':
        updateTimeRange('month');
        break;
      case 'last_month':
        // Custom logic for last month
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
        const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
        
        setFilters(prev => ({
          ...prev,
          timeRange: {
            startDate: startOfLastMonth.toISOString().split('T')[0],
            endDate: endOfLastMonth.toISOString().split('T')[0],
            period: 'month',
          },
        }));
        break;
      case 'this_year':
        updateTimeRange('year');
        break;
      case 'all_time':
        updateTimeRange('all');
        break;
    }
  }, [updateTimeRange]);

  return {
    // Data
    analyticsData,
    calculations,
    filteredExpenses,
    allExpenses,
    
    // State
    filters,
    isLoading,
    error,
    
    // Actions
    updateTimeRange,
    updateCategories,
    updateAmountRange,
    resetFilters,
    setQuickFilter,
  };
}
