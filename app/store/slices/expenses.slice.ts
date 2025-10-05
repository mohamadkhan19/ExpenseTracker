import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense, ExpensesState } from '../../features/expenses/types';

const initialState: ExpensesState = {
  expenses: {},
  isLoading: false,
  error: null,
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload.reduce((acc, expense) => {
        acc[expense.id] = expense;
        return acc;
      }, {} as Record<string, Expense>);
    },
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses[action.payload.id] = action.payload;
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses[action.payload.id] = action.payload;
    },
    removeExpense: (state, action: PayloadAction<string>) => {
      delete state.expenses[action.payload];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setExpenses,
  addExpense,
  updateExpense,
  removeExpense,
  setLoading,
  setError,
  clearError,
} = expensesSlice.actions;

export default expensesSlice.reducer;
