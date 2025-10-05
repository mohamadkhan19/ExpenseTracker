import { baseApi } from './baseApi';
import { ExpensesAdapter } from '../../services/adapters/expenses.adapter';
import { Expense, CreateExpenseRequest, UpdateExpenseRequest } from '../../features/expenses/types';

export const expensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<Expense[], void>({
      queryFn: async () => {
        try {
          const expenses = await ExpensesAdapter.getAllExpenses();
          return { data: expenses };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Expense'],
    }),
    
    getExpenseById: builder.query<Expense | null, string>({
      queryFn: async (id) => {
        try {
          const expense = await ExpensesAdapter.getExpenseById(id);
          return { data: expense };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Expense', id }],
    }),
    
    createExpense: builder.mutation<Expense, CreateExpenseRequest>({
      queryFn: async (data) => {
        try {
          const expense = await ExpensesAdapter.createExpense(data);
          return { data: expense };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Expense'],
    }),
    
    updateExpense: builder.mutation<Expense | null, UpdateExpenseRequest>({
      queryFn: async (data) => {
        try {
          const expense = await ExpensesAdapter.updateExpense(data);
          return { data: expense };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Expense', id }],
    }),
    
    deleteExpense: builder.mutation<boolean, string>({
      queryFn: async (id) => {
        try {
          const success = await ExpensesAdapter.deleteExpense(id);
          return { data: success };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Expense', id }],
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
