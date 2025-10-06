import { ExpenseCategory } from '../../features/expenses/types';

// Analytics data types
export interface AnalyticsData {
  totalExpenses: number;
  monthlyExpenses: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrends: MonthlyTrend[];
  spendingPatterns: SpendingPattern[];
  averageDailySpending: number;
  topCategories: CategoryBreakdown[];
  recentActivity: RecentActivity[];
}

export interface CategoryBreakdown {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  count: number;
  averageAmount: number;
}

export interface MonthlyTrend {
  month: string; // YYYY-MM format
  year: number;
  monthName: string;
  totalAmount: number;
  expenseCount: number;
  averageAmount: number;
  categories: CategoryBreakdown[];
}

export interface SpendingPattern {
  dayOfWeek: string;
  averageAmount: number;
  count: number;
  percentage: number;
}

export interface RecentActivity {
  id: string;
  type: 'expense_added' | 'expense_updated' | 'expense_deleted' | 'limit_set' | 'limit_exceeded';
  description: string;
  amount?: number;
  category?: ExpenseCategory;
  timestamp: string;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface LineChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: string;
    strokeWidth?: number;
  }[];
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface BarChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: string;
  }[];
}

// Time period types
export type TimePeriod = 'week' | 'month' | 'quarter' | 'year' | 'all';

export interface TimeRange {
  startDate: string;
  endDate: string;
  period: TimePeriod;
}

// Analytics filters
export interface AnalyticsFilters {
  timeRange: TimeRange;
  categories: ExpenseCategory[];
  minAmount?: number;
  maxAmount?: number;
}

// Analytics state
export interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  filters: AnalyticsFilters;
  lastUpdated: string | null;
}

// Analytics calculations
export interface AnalyticsCalculations {
  totalSpent: number;
  averagePerDay: number;
  averagePerExpense: number;
  mostExpensiveCategory: CategoryBreakdown | null;
  leastExpensiveCategory: CategoryBreakdown | null;
  spendingGrowth: number; // percentage change from previous period
  categoryGrowth: Record<ExpenseCategory, number>;
}

// Chart configuration
export interface ChartConfig {
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  color: (opacity?: number) => string;
  strokeWidth: number;
  barPercentage: number;
  useShadowColorFromDataset: boolean;
  decimalPlaces: number;
}

// Analytics insights
export interface AnalyticsInsight {
  type: 'spending_increase' | 'spending_decrease' | 'category_trend' | 'unusual_activity' | 'limit_warning';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
  actionText?: string;
  actionUrl?: string;
}
