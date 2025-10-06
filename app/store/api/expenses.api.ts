import { baseApi } from './baseApi';
import { ExpensesAdapter } from '../../services/adapters/expenses.adapter';
import { Expense, CreateExpenseRequest, UpdateExpenseRequest } from '../../features/expenses/types';
import { logger } from '../../utils/logger';

export const expensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<Expense[], void>({
      queryFn: async () => {
        try {
          logger.debug('Fetching all expenses');
          const expenses = await ExpensesAdapter.getAllExpenses();
          logger.info('Expenses fetched successfully', { count: expenses.length });
          return { data: expenses };
        } catch (error) {
          logger.error('Failed to fetch expenses', error as Error);
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Expense'],
    }),
    
    getExpenseById: builder.query<Expense | null, string>({
      queryFn: async (id) => {
        try {
          logger.debug('Fetching expense by ID', { expenseId: id });
          const expense = await ExpensesAdapter.getExpenseById(id);
          logger.info('Expense fetched successfully', { expenseId: id, found: !!expense });
          return { data: expense };
        } catch (error) {
          logger.error('Failed to fetch expense by ID', error as Error, { expenseId: id });
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Expense', id }],
    }),
    
    createExpense: builder.mutation<Expense, CreateExpenseRequest>({
      queryFn: async (data) => {
        try {
          logger.info('Creating new expense', { description: data.description, amount: data.amount, category: data.category });
          const expense = await ExpensesAdapter.createExpense(data);
          logger.info('Expense created successfully', { expenseId: expense.id });
          return { data: expense };
        } catch (error) {
          logger.error('Failed to create expense', error as Error, { data });
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Expense'],
    }),
    
    updateExpense: builder.mutation<Expense | null, UpdateExpenseRequest>({
      queryFn: async (data) => {
        try {
          logger.info('Updating expense', { expenseId: data.id, description: data.description, amount: data.amount });
          const expense = await ExpensesAdapter.updateExpense(data);
          logger.info('Expense updated successfully', { expenseId: data.id });
          return { data: expense };
        } catch (error) {
          logger.error('Failed to update expense', error as Error, { expenseId: data.id });
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Expense'],
    }),
    
    deleteExpense: builder.mutation<boolean, string>({
      queryFn: async (id) => {
        try {
          logger.info('Deleting expense', { expenseId: id });
          const success = await ExpensesAdapter.deleteExpense(id);
          logger.info('Expense deleted successfully', { expenseId: id, success });
          return { data: success };
        } catch (error) {
          logger.error('Failed to delete expense', error as Error, { expenseId: id });
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Expense'],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseByIdQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expensesApi;
