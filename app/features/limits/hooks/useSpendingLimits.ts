import { useMemo, useState, useCallback } from 'react';
import { useGetExpensesQuery } from '../../store/api/expenses.api';
import { 
  SpendingLimit, 
  LimitStatus, 
  LimitAlert, 
  LimitSuggestion,
  CreateLimitRequest,
  UpdateLimitRequest,
  LimitAnalytics,
  LimitValidation
} from '../limits/types';
import { 
  calculateLimitStatus,
  generateLimitAlerts,
  generateLimitSuggestions,
  validateLimit,
  calculateLimitAnalytics
} from '../limits/utils';

export function useSpendingLimits() {
  const { data: expenses = [], isLoading: expensesLoading } = useGetExpensesQuery();
  const [limits, setLimits] = useState<Record<string, SpendingLimit>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate limit statuses
  const limitStatuses = useMemo(() => {
    const statuses: Record<string, LimitStatus> = {};
    
    Object.values(limits).forEach(limit => {
      if (limit.isActive) {
        statuses[limit.id] = calculateLimitStatus(limit, expenses);
      }
    });
    
    return statuses;
  }, [limits, expenses]);

  // Generate alerts
  const alerts = useMemo(() => {
    const allAlerts: LimitAlert[] = [];
    
    Object.values(limits).forEach(limit => {
      const status = limitStatuses[limit.id];
      if (status) {
        const limitAlerts = generateLimitAlerts(status, limit);
        allAlerts.push(...limitAlerts);
      }
    });
    
    return allAlerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [limits, limitStatuses]);

  // Generate suggestions
  const suggestions = useMemo(() => {
    return generateLimitSuggestions(expenses, Object.values(limits));
  }, [expenses, limits]);

  // Calculate analytics
  const analytics = useMemo(() => {
    return calculateLimitAnalytics(Object.values(limits), Object.values(limitStatuses));
  }, [limits, limitStatuses]);

  // Create a new limit
  const createLimit = useCallback(async (request: CreateLimitRequest): Promise<SpendingLimit> => {
    setIsLoading(true);
    setError(null);

    try {
      const newLimit: SpendingLimit = {
        id: `limit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        category: request.category,
        amount: request.amount,
        period: request.period,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'user',
      };

      // Validate the limit
      const validation = validateLimit(newLimit);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      setLimits(prev => ({
        ...prev,
        [newLimit.id]: newLimit,
      }));

      return newLimit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create limit';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an existing limit
  const updateLimit = useCallback(async (request: UpdateLimitRequest): Promise<SpendingLimit> => {
    setIsLoading(true);
    setError(null);

    try {
      const existingLimit = limits[request.id];
      if (!existingLimit) {
        throw new Error('Limit not found');
      }

      const updatedLimit: SpendingLimit = {
        ...existingLimit,
        ...request,
        updatedAt: new Date().toISOString(),
      };

      // Validate the updated limit
      const validation = validateLimit(updatedLimit);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      setLimits(prev => ({
        ...prev,
        [request.id]: updatedLimit,
      }));

      return updatedLimit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update limit';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [limits]);

  // Delete a limit
  const deleteLimit = useCallback(async (limitId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!limits[limitId]) {
        throw new Error('Limit not found');
      }

      setLimits(prev => {
        const newLimits = { ...prev };
        delete newLimits[limitId];
        return newLimits;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete limit';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [limits]);

  // Toggle limit active status
  const toggleLimitActive = useCallback(async (limitId: string): Promise<void> => {
    const limit = limits[limitId];
    if (!limit) return;

    await updateLimit({
      id: limitId,
      isActive: !limit.isActive,
    });
  }, [limits, updateLimit]);

  // Get limit by category
  const getLimitByCategory = useCallback((category: string): SpendingLimit | null => {
    return Object.values(limits).find(limit => 
      limit.category === category && limit.isActive
    ) || null;
  }, [limits]);

  // Get status by category
  const getStatusByCategory = useCallback((category: string): LimitStatus | null => {
    const limit = getLimitByCategory(category);
    return limit ? limitStatuses[limit.id] || null : null;
  }, [getLimitByCategory, limitStatuses]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get unread alerts count
  const unreadAlertsCount = useMemo(() => {
    return alerts.filter(alert => !alert.isRead).length;
  }, [alerts]);

  // Get critical alerts (exceeded limits)
  const criticalAlerts = useMemo(() => {
    return alerts.filter(alert => alert.type === 'limit_exceeded');
  }, [alerts]);

  return {
    // Data
    limits: Object.values(limits),
    limitStatuses: Object.values(limitStatuses),
    alerts,
    suggestions,
    analytics,
    
    // State
    isLoading: isLoading || expensesLoading,
    error,
    
    // Actions
    createLimit,
    updateLimit,
    deleteLimit,
    toggleLimitActive,
    clearError,
    
    // Helpers
    getLimitByCategory,
    getStatusByCategory,
    unreadAlertsCount,
    criticalAlerts,
  };
}
