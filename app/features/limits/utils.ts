import { Expense, ExpenseCategory } from '../../features/expenses/types';
import { 
  SpendingLimit, 
  LimitStatus, 
  LimitAlert, 
  LimitSuggestion,
  LimitPeriod,
  LimitAnalytics,
  LimitValidation
} from './types';

// Calculate limit status for a given limit and expenses
export const calculateLimitStatus = (
  limit: SpendingLimit,
  expenses: Expense[]
): LimitStatus => {
  const now = new Date();
  const { startDate, endDate } = getPeriodDates(now, limit.period);
  
  // Filter expenses for the current period
  const periodExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startDate && expenseDate <= endDate;
  });

  // Calculate current spending
  const currentAmount = limit.category === 'overall'
    ? periodExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    : periodExpenses
        .filter(expense => expense.category === limit.category)
        .reduce((sum, expense) => sum + expense.amount, 0);

  const remainingAmount = Math.max(0, limit.amount - currentAmount);
  const percentageUsed = limit.amount > 0 ? (currentAmount / limit.amount) * 100 : 0;
  const isExceeded = currentAmount > limit.amount;
  const isNearLimit = percentageUsed >= 80 && !isExceeded;

  return {
    limitId: limit.id,
    category: limit.category,
    limitAmount: limit.amount,
    currentAmount,
    remainingAmount,
    percentageUsed,
    isExceeded,
    isNearLimit,
    period: limit.period,
    periodStart: startDate.toISOString(),
    periodEnd: endDate.toISOString(),
    lastUpdated: new Date().toISOString(),
  };
};

// Get period start and end dates
export const getPeriodDates = (date: Date, period: LimitPeriod): { startDate: Date; endDate: Date } => {
  const startDate = new Date(date);
  const endDate = new Date(date);

  switch (period) {
    case 'daily':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'weekly':
      const dayOfWeek = startDate.getDay();
      startDate.setDate(startDate.getDate() - dayOfWeek);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'monthly':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(endDate.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'yearly':
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(11, 31);
      endDate.setHours(23, 59, 59, 999);
      break;
  }

  return { startDate, endDate };
};

// Generate limit alerts based on status
export const generateLimitAlerts = (
  status: LimitStatus,
  limit: SpendingLimit
): LimitAlert[] => {
  const alerts: LimitAlert[] = [];

  if (status.isExceeded) {
    alerts.push({
      id: `alert_${limit.id}_exceeded_${Date.now()}`,
      limitId: limit.id,
      type: 'limit_exceeded',
      title: 'Limit Exceeded',
      message: `You've exceeded your ${limit.period} limit for ${status.category} by $${(status.currentAmount - status.limitAmount).toFixed(2)}`,
      severity: 'high',
      isRead: false,
      createdAt: new Date().toISOString(),
      actionRequired: true,
      actionText: 'Review Spending',
    });
  } else if (status.isNearLimit) {
    alerts.push({
      id: `alert_${limit.id}_approaching_${Date.now()}`,
      limitId: limit.id,
      type: 'approaching_limit',
      title: 'Approaching Limit',
      message: `You're at ${status.percentageUsed.toFixed(1)}% of your ${limit.period} limit for ${status.category}`,
      severity: 'medium',
      isRead: false,
      createdAt: new Date().toISOString(),
      actionRequired: false,
    });
  }

  return alerts;
};

// Generate limit suggestions based on spending patterns
export const generateLimitSuggestions = (
  expenses: Expense[],
  existingLimits: SpendingLimit[]
): LimitSuggestion[] => {
  const categoryBreakdown = new Map<ExpenseCategory, { amounts: number[]; dates: string[] }>();
  
  // Group expenses by category
  expenses.forEach(expense => {
    if (!categoryBreakdown.has(expense.category)) {
      categoryBreakdown.set(expense.category, { amounts: [], dates: [] });
    }
    const categoryData = categoryBreakdown.get(expense.category)!;
    categoryData.amounts.push(expense.amount);
    categoryData.dates.push(expense.date);
  });

  const suggestions: LimitSuggestion[] = [];

  categoryBreakdown.forEach((data, category) => {
    // Skip if limit already exists
    if (existingLimits.some(limit => limit.category === category)) {
      return;
    }

    const amounts = data.amounts;
    const averageSpending = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const maxSpending = Math.max(...amounts);
    const frequency = amounts.length;

    // Calculate trend
    const sortedDates = data.dates.sort();
    const firstHalf = amounts.slice(0, Math.floor(amounts.length / 2));
    const secondHalf = amounts.slice(Math.floor(amounts.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, amount) => sum + amount, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, amount) => sum + amount, 0) / secondHalf.length;
    
    const trend = secondHalfAvg > firstHalfAvg * 1.1 ? 'increasing' :
                  secondHalfAvg < firstHalfAvg * 0.9 ? 'decreasing' : 'stable';

    // Suggest limit amount (average + 20% buffer)
    const suggestedAmount = Math.round(averageSpending * 1.2);
    
    // Suggest period based on frequency
    let suggestedPeriod: LimitPeriod = 'monthly';
    if (frequency > 20) {
      suggestedPeriod = 'weekly';
    } else if (frequency < 5) {
      suggestedPeriod = 'yearly';
    }

    // Calculate confidence based on data quality
    const confidence = Math.min(1, frequency / 10) * (amounts.length > 1 ? 0.8 : 0.5);

    suggestions.push({
      category,
      suggestedAmount,
      suggestedPeriod,
      confidence,
      reasoning: `Based on ${frequency} transactions with average spending of $${averageSpending.toFixed(2)}`,
      basedOnData: {
        averageSpending,
        maxSpending,
        frequency,
        trend,
      },
    });
  });

  return suggestions.sort((a, b) => b.confidence - a.confidence);
};

// Validate limit data
export const validateLimit = (limit: Partial<SpendingLimit>): LimitValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!limit.amount || limit.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (limit.amount && limit.amount > 100000) {
    warnings.push('Amount seems unusually high');
  }

  if (!limit.period) {
    errors.push('Period is required');
  }

  if (!limit.category) {
    errors.push('Category is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Calculate limit analytics
export const calculateLimitAnalytics = (
  limits: SpendingLimit[],
  limitStatuses: LimitStatus[]
): LimitAnalytics => {
  const activeLimits = limits.filter(limit => limit.isActive);
  const exceededLimits = limitStatuses.filter(status => status.isExceeded);
  const approachingLimits = limitStatuses.filter(status => status.isNearLimit);

  const totalLimitAmount = activeLimits.reduce((sum, limit) => sum + limit.amount, 0);
  const totalCurrentSpending = limitStatuses.reduce((sum, status) => sum + status.currentAmount, 0);
  const averageLimitUtilization = totalLimitAmount > 0 ? (totalCurrentSpending / totalLimitAmount) * 100 : 0;

  // Find most exceeded and underutilized categories
  const categoryUtilization = new Map<string, number>();
  limitStatuses.forEach(status => {
    const category = status.category;
    const utilization = status.percentageUsed;
    
    if (!categoryUtilization.has(category)) {
      categoryUtilization.set(category, 0);
    }
    categoryUtilization.set(category, Math.max(categoryUtilization.get(category)!, utilization));
  });

  let mostExceededCategory: ExpenseCategory | null = null;
  let mostUnderutilizedCategory: ExpenseCategory | null = null;
  let maxUtilization = 0;
  let minUtilization = 100;

  categoryUtilization.forEach((utilization, category) => {
    if (utilization > maxUtilization) {
      maxUtilization = utilization;
      mostExceededCategory = category as ExpenseCategory;
    }
    if (utilization < minUtilization) {
      minUtilization = utilization;
      mostUnderutilizedCategory = category as ExpenseCategory;
    }
  });

  return {
    totalLimits: limits.length,
    activeLimits: activeLimits.length,
    exceededLimits: exceededLimits.length,
    approachingLimits: approachingLimits.length,
    totalLimitAmount,
    totalCurrentSpending,
    averageLimitUtilization,
    mostExceededCategory,
    mostUnderutilizedCategory,
  };
};

// Format limit period for display
export const formatLimitPeriod = (period: LimitPeriod): string => {
  switch (period) {
    case 'daily':
      return 'Daily';
    case 'weekly':
      return 'Weekly';
    case 'monthly':
      return 'Monthly';
    case 'yearly':
      return 'Yearly';
    default:
      return 'Unknown';
  }
};

// Format limit amount for display
export const formatLimitAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
