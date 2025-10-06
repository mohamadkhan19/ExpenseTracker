import { configureStore } from '@reduxjs/toolkit';
import { expensesApi } from '../../app/store/api/expenses.api';
import { ExpensesAdapter } from '../../app/services/adapters/expenses.adapter';

// Mock the expenses adapter
jest.mock('../../app/services/adapters/expenses.adapter', () => ({
  ExpensesAdapter: {
    getAllExpenses: jest.fn(),
    createExpense: jest.fn(),
    updateExpense: jest.fn(),
    deleteExpense: jest.fn(),
  },
}));

const mockExpensesAdapter = ExpensesAdapter as jest.Mocked<typeof ExpensesAdapter>;

describe('Expenses API Integration Tests', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        [expensesApi.reducerPath]: expensesApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(expensesApi.middleware),
    });
  });

  describe('getExpenses', () => {
    it('should fetch expenses successfully', async () => {
      const mockExpenses = [
        {
          id: '1',
          description: 'Coffee',
          amount: 4.50,
          category: 'Food',
          date: '2023-01-01',
        },
        {
          id: '2',
          description: 'Gas',
          amount: 45.00,
          category: 'Transportation',
          date: '2023-01-02',
        },
      ];

      mockExpensesAdapter.getAllExpenses.mockResolvedValue(mockExpenses);

      const result = await store.dispatch(expensesApi.endpoints.getExpenses.initiate());

      expect(result.data).toEqual(mockExpenses);
      expect(mockExpensesAdapter.getAllExpenses).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch errors gracefully', async () => {
      const error = new Error('Failed to fetch expenses');
      mockExpensesAdapter.getAllExpenses.mockRejectedValue(error);

      const result = await store.dispatch(expensesApi.endpoints.getExpenses.initiate());

      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });
  });

  describe('createExpense', () => {
    it('should create expense successfully', async () => {
      const newExpense = {
        description: 'Lunch',
        amount: 12.50,
        category: 'Food',
        date: '2023-01-03',
      };

      const createdExpense = {
        id: '3',
        ...newExpense,
      };

      mockExpensesAdapter.createExpense.mockResolvedValue(createdExpense);

      const result = await store.dispatch(
        expensesApi.endpoints.createExpense.initiate(newExpense)
      );

      expect(result.data).toEqual(createdExpense);
      expect(mockExpensesAdapter.createExpense).toHaveBeenCalledWith(newExpense);
    });

    it('should handle creation errors gracefully', async () => {
      const newExpense = {
        description: 'Invalid',
        amount: -10, // Invalid amount
        category: 'Food',
        date: '2023-01-03',
      };

      const error = new Error('Invalid expense data');
      mockExpensesAdapter.createExpense.mockRejectedValue(error);

      const result = await store.dispatch(
        expensesApi.endpoints.createExpense.initiate(newExpense)
      );

      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });
  });

  describe('updateExpense', () => {
    it('should update expense successfully', async () => {
      const updateData = {
        id: '1',
        description: 'Updated Coffee',
        amount: 5.00,
        category: 'Food',
        date: '2023-01-01',
      };

      mockExpensesAdapter.updateExpense.mockResolvedValue(updateData);

      const result = await store.dispatch(
        expensesApi.endpoints.updateExpense.initiate(updateData)
      );

      expect(result.data).toEqual(updateData);
      expect(mockExpensesAdapter.updateExpense).toHaveBeenCalledWith(updateData);
    });

    it('should handle update errors gracefully', async () => {
      const updateData = {
        id: 'non-existent',
        description: 'Updated',
        amount: 5.00,
        category: 'Food',
        date: '2023-01-01',
      };

      const error = new Error('Expense not found');
      mockExpensesAdapter.updateExpense.mockRejectedValue(error);

      const result = await store.dispatch(
        expensesApi.endpoints.updateExpense.initiate(updateData)
      );

      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });
  });

  describe('deleteExpense', () => {
    it('should delete expense successfully', async () => {
      const expenseId = '1';
      mockExpensesAdapter.deleteExpense.mockResolvedValue(true);

      const result = await store.dispatch(
        expensesApi.endpoints.deleteExpense.initiate(expenseId)
      );

      expect(result.data).toBe(true);
      expect(mockExpensesAdapter.deleteExpense).toHaveBeenCalledWith(expenseId);
    });

    it('should handle deletion errors gracefully', async () => {
      const expenseId = 'non-existent';
      const error = new Error('Expense not found');
      mockExpensesAdapter.deleteExpense.mockRejectedValue(error);

      const result = await store.dispatch(
        expensesApi.endpoints.deleteExpense.initiate(expenseId)
      );

      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });
  });

  describe('Cache Invalidation', () => {
    it('should invalidate expenses cache after create', async () => {
      const newExpense = {
        description: 'Test',
        amount: 10.00,
        category: 'Food',
        date: '2023-01-01',
      };

      const createdExpense = { id: '1', ...newExpense };
      mockExpensesAdapter.createExpense.mockResolvedValue(createdExpense);

      // First, fetch expenses to populate cache
      mockExpensesAdapter.getAllExpenses.mockResolvedValue([]);
      await store.dispatch(expensesApi.endpoints.getExpenses.initiate());

      // Then create a new expense
      await store.dispatch(expensesApi.endpoints.createExpense.initiate(newExpense));

      // The cache should be invalidated, so next fetch should call the adapter again
      expect(mockExpensesAdapter.getAllExpenses).toHaveBeenCalledTimes(1);
      expect(mockExpensesAdapter.createExpense).toHaveBeenCalledTimes(1);
    });

    it('should invalidate expenses cache after update', async () => {
      const updateData = {
        id: '1',
        description: 'Updated',
        amount: 15.00,
        category: 'Food',
        date: '2023-01-01',
      };

      mockExpensesAdapter.updateExpense.mockResolvedValue(updateData);

      // First, fetch expenses to populate cache
      mockExpensesAdapter.getAllExpenses.mockResolvedValue([]);
      await store.dispatch(expensesApi.endpoints.getExpenses.initiate());

      // Then update an expense
      await store.dispatch(expensesApi.endpoints.updateExpense.initiate(updateData));

      // The cache should be invalidated
      expect(mockExpensesAdapter.getAllExpenses).toHaveBeenCalledTimes(1);
      expect(mockExpensesAdapter.updateExpense).toHaveBeenCalledTimes(1);
    });

    it('should invalidate expenses cache after delete', async () => {
      const expenseId = '1';
      mockExpensesAdapter.deleteExpense.mockResolvedValue(true);

      // First, fetch expenses to populate cache
      mockExpensesAdapter.getAllExpenses.mockResolvedValue([]);
      await store.dispatch(expensesApi.endpoints.getExpenses.initiate());

      // Then delete an expense
      await store.dispatch(expensesApi.endpoints.deleteExpense.initiate(expenseId));

      // The cache should be invalidated
      expect(mockExpensesAdapter.getAllExpenses).toHaveBeenCalledTimes(1);
      expect(mockExpensesAdapter.deleteExpense).toHaveBeenCalledTimes(1);
    });
  });
});
