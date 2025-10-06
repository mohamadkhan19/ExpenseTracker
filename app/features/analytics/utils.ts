import { Expense, ExpenseCategory } from '../../features/expenses/types';
import { 
  AnalyticsData, 
  CategoryBreakdown, 
  MonthlyTrend, 
  SpendingPattern, 
  RecentActivity,
  TimeRange,
  AnalyticsFilters,
  AnalyticsCalculations,
  TimePeriod
} from './types';

// Calculate category breakdown from expenses
export const calculateCategoryBreakdown = (expenses: Expense[]): CategoryBreakdown[] => {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryMap = new Map<ExpenseCategory, { amount: number; count: number }>();
  
  expenses.forEach(expense => {
    const existing = categoryMap.get(expense.category) || { amount: 0, count: 0 };
    categoryMap.set(expense.category, {
      amount: existing.amount + expense.amount,
      count: existing.count + 1,
    });
  });

  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    amount: data.amount,
    percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
    count: data.count,
    averageAmount: data.count > 0 ? data.amount / data.count : 0,
  })).sort((a, b) => b.amount - a.amount);
};

// Calculate monthly trends
export const calculateMonthlyTrends = (expenses: Expense[]): MonthlyTrend[] => {
  const monthlyMap = new Map<string, Expense[]>();
  
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, []);
    }
    monthlyMap.get(monthKey)!.push(expense);
  });

  return Array.from(monthlyMap.entries()).map(([monthKey, monthExpenses]) => {
    const totalAmount = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const date = new Date(monthKey + '-01');
    
    return {
      month: monthKey,
      year: date.getFullYear(),
      monthName: date.toLocaleDateString('en-US', { month: 'short' }),
      totalAmount,
      expenseCount: monthExpenses.length,
      averageAmount: monthExpenses.length > 0 ? totalAmount / monthExpenses.length : 0,
      categories: calculateCategoryBreakdown(monthExpenses),
    };
  }).sort((a, b) => a.month.localeCompare(b.month));
};

// Calculate spending patterns by day of week
export const calculateSpendingPatterns = (expenses: Expense[]): SpendingPattern[] => {
  const dayMap = new Map<string, { amount: number; count: number }>();
  
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const existing = dayMap.get(dayOfWeek) || { amount: 0, count: 0 };
    dayMap.set(dayOfWeek, {
      amount: existing.amount + expense.amount,
      count: existing.count + 1,
    });
  });

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return Array.from(dayMap.entries()).map(([dayOfWeek, data]) => ({
    dayOfWeek,
    averageAmount: data.count > 0 ? data.amount / data.count : 0,
    count: data.count,
    percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
  })).sort((a, b) => b.averageAmount - a.averageAmount);
};

// Generate recent activity from expenses
export const generateRecentActivity = (expenses: Expense[]): RecentActivity[] => {
  return expenses
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
    .map(expense => ({
      id: `activity_${expense.id}`,
      type: 'expense_added' as const,
      description: `Added expense: ${expense.description}`,
      amount: expense.amount,
      category: expense.category,
      timestamp: expense.createdAt,
    }));
};

// Calculate comprehensive analytics data
export const calculateAnalyticsData = (expenses: Expense[]): AnalyticsData => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate current month expenses
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const monthlyExpenses = expenses
    .filter(expense => expense.date.startsWith(currentMonth))
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categoryBreakdown = calculateCategoryBreakdown(expenses);
  const monthlyTrends = calculateMonthlyTrends(expenses);
  const spendingPatterns = calculateSpendingPatterns(expenses);
  const recentActivity = generateRecentActivity(expenses);

  // Calculate average daily spending
  const daysWithExpenses = new Set(expenses.map(expense => expense.date)).size;
  const averageDailySpending = daysWithExpenses > 0 ? totalExpenses / daysWithExpenses : 0;

  // Get top 3 categories
  const topCategories = categoryBreakdown.slice(0, 3);

  return {
    totalExpenses,
    monthlyExpenses,
    categoryBreakdown,
    monthlyTrends,
    spendingPatterns,
    averageDailySpending,
    topCategories,
    recentActivity,
  };
};

// Calculate analytics calculations
export const calculateAnalyticsCalculations = (
  currentData: AnalyticsData,
  previousData?: AnalyticsData
): AnalyticsCalculations => {
  const totalSpent = currentData.totalExpenses;
  const averagePerDay = currentData.averageDailySpending;
  const averagePerExpense = currentData.totalExpenses / currentData.categoryBreakdown.reduce((sum, cat) => sum + cat.count, 0);
  
  const mostExpensiveCategory = currentData.categoryBreakdown[0] || null;
  const leastExpensiveCategory = currentData.categoryBreakdown[currentData.categoryBreakdown.length - 1] || null;

  // Calculate spending growth
  const spendingGrowth = previousData 
    ? ((currentData.totalExpenses - previousData.totalExpenses) / previousData.totalExpenses) * 100
    : 0;

  // Calculate category growth
  const categoryGrowth: Record<ExpenseCategory, number> = {} as Record<ExpenseCategory, number>;
  currentData.categoryBreakdown.forEach(category => {
    if (previousData) {
      const previousCategory = previousData.categoryBreakdown.find(c => c.category === category.category);
      categoryGrowth[category.category] = previousCategory
        ? ((category.amount - previousCategory.amount) / previousCategory.amount) * 100
        : 0;
    } else {
      categoryGrowth[category.category] = 0;
    }
  });

  return {
    totalSpent,
    averagePerDay,
    averagePerExpense,
    mostExpensiveCategory,
    leastExpensiveCategory,
    spendingGrowth,
    categoryGrowth,
  };
};

// Filter expenses by time range
export const filterExpensesByTimeRange = (expenses: Expense[], timeRange: TimeRange): Expense[] => {
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const startDate = new Date(timeRange.startDate);
    const endDate = new Date(timeRange.endDate);
    
    return expenseDate >= startDate && expenseDate <= endDate;
  });
};

// Filter expenses by analytics filters
export const filterExpensesByAnalyticsFilters = (expenses: Expense[], filters: AnalyticsFilters): Expense[] => {
  let filteredExpenses = filterExpensesByTimeRange(expenses, filters.timeRange);

  if (filters.categories.length > 0) {
    filteredExpenses = filteredExpenses.filter(expense => 
      filters.categories.includes(expense.category)
    );
  }

  if (filters.minAmount !== undefined) {
    filteredExpenses = filteredExpenses.filter(expense => 
      expense.amount >= filters.minAmount!
    );
  }

  if (filters.maxAmount !== undefined) {
    filteredExpenses = filteredExpenses.filter(expense => 
      expense.amount <= filters.maxAmount!
    );
  }

  return filteredExpenses;
};

// Generate time range for period
export const generateTimeRange = (period: TimePeriod): TimeRange => {
  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'all':
      startDate.setFullYear(2020); // Arbitrary start date
      break;
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: now.toISOString().split('T')[0],
    period,
  };
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format percentage for display
export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};
