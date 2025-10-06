import { ExpenseCategory } from '../../features/expenses/types';

// Spending limit types
export interface SpendingLimit {
  id: string;
  category: ExpenseCategory | 'overall';
  amount: number;
  period: LimitPeriod;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: 'user' | 'system';
}

export type LimitPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

// Limit status and usage
export interface LimitStatus {
  limitId: string;
  category: ExpenseCategory | 'overall';
  limitAmount: number;
  currentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  isExceeded: boolean;
  isNearLimit: boolean; // Within 80% of limit
  period: LimitPeriod;
  periodStart: string;
  periodEnd: string;
  lastUpdated: string;
}

// Limit alert types
export interface LimitAlert {
  id: string;
  limitId: string;
  type: 'approaching_limit' | 'limit_exceeded' | 'limit_reset';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: string;
  actionRequired: boolean;
  actionText?: string;
}

// Limit history for tracking changes
export interface LimitHistory {
  id: string;
  limitId: string;
  action: 'created' | 'updated' | 'deleted' | 'activated' | 'deactivated';
  oldValue?: number;
  newValue?: number;
  oldPeriod?: LimitPeriod;
  newPeriod?: LimitPeriod;
  timestamp: string;
  reason?: string;
}

// Limit suggestions based on spending patterns
export interface LimitSuggestion {
  category: ExpenseCategory;
  suggestedAmount: number;
  suggestedPeriod: LimitPeriod;
  confidence: number; // 0-1 confidence score
  reasoning: string;
  basedOnData: {
    averageSpending: number;
    maxSpending: number;
    frequency: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
}

// Limit configuration
export interface LimitConfig {
  defaultPeriod: LimitPeriod;
  alertThresholds: {
    warning: number; // percentage (e.g., 80)
    critical: number; // percentage (e.g., 95)
  };
  autoSuggestions: boolean;
  notifications: {
    approachingLimit: boolean;
    limitExceeded: boolean;
    limitReset: boolean;
  };
}

// Limit state
export interface LimitsState {
  limits: Record<string, SpendingLimit>;
  statuses: Record<string, LimitStatus>;
  alerts: LimitAlert[];
  history: LimitHistory[];
  suggestions: LimitSuggestion[];
  config: LimitConfig;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Limit creation/update requests
export interface CreateLimitRequest {
  category: ExpenseCategory | 'overall';
  amount: number;
  period: LimitPeriod;
}

export interface UpdateLimitRequest {
  id: string;
  amount?: number;
  period?: LimitPeriod;
  isActive?: boolean;
}

// Limit validation
export interface LimitValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Limit analytics
export interface LimitAnalytics {
  totalLimits: number;
  activeLimits: number;
  exceededLimits: number;
  approachingLimits: number;
  totalLimitAmount: number;
  totalCurrentSpending: number;
  averageLimitUtilization: number;
  mostExceededCategory: ExpenseCategory | null;
  mostUnderutilizedCategory: ExpenseCategory | null;
}
