import { Expense, ExpenseCategory } from './types';

export type SortOption = 'date-asc' | 'date-desc' | 'amount-asc' | 'amount-desc' | 'category';

export const sortExpenses = (expenses: Expense[], sortBy: SortOption): Expense[] => {
  const sorted = [...expenses];
  
  switch (sortBy) {
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'amount-asc':
      return sorted.sort((a, b) => a.amount - b.amount);
    case 'amount-desc':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    default:
      return sorted;
  }
};

export const filterExpensesByCategory = (expenses: Expense[], category: ExpenseCategory | 'all'): Expense[] => {
  if (category === 'all') {
    return expenses;
  }
  return expenses.filter(expense => expense.category === category);
};

export const getTotalAmount = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const getCategoryTotals = (expenses: Expense[]): Record<ExpenseCategory, number> => {
  const totals: Record<ExpenseCategory, number> = {
    food: 0,
    transport: 0,
    entertainment: 0,
    shopping: 0,
    utilities: 0,
    health: 0,
    education: 0,
    other: 0,
  };

  expenses.forEach(expense => {
    totals[expense.category] += expense.amount;
  });

  return totals;
};
