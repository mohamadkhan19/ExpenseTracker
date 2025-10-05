import { useMemo, useState, useCallback } from 'react';
import { useGetExpensesQuery } from '../../store/api/expenses.api';
import { Expense, ExpenseCategory } from '../../features/expenses/types';
import { sortExpenses, filterExpensesByCategory, SortOption } from '../../features/expenses/utils';

export function useExpensesList() {
  const { data: expenses = [], isLoading, error } = useGetExpensesQuery();
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');

  const sortedAndFilteredExpenses = useMemo(() => {
    const filtered = filterExpensesByCategory(expenses, filterCategory);
    return sortExpenses(filtered, sortBy);
  }, [expenses, sortBy, filterCategory]);

  const totalAmount = useMemo(() => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  }, [expenses]);

  const handleSortChange = useCallback((newSortBy: SortOption) => {
    setSortBy(newSortBy);
  }, []);

  const handleCategoryFilter = useCallback((category: ExpenseCategory | 'all') => {
    setFilterCategory(category);
  }, []);

  const clearFilters = useCallback(() => {
    setFilterCategory('all');
    setSortBy('date-desc');
  }, []);

  return {
    expenses: sortedAndFilteredExpenses,
    allExpenses: expenses,
    isLoading,
    error,
    sortBy,
    filterCategory,
    totalAmount,
    handleSortChange,
    handleCategoryFilter,
    clearFilters,
  };
}
