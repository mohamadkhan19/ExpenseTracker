export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'utilities'
  | 'health'
  | 'education'
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateExpenseRequest {
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {
  id: string;
}

export interface ExpensesState {
  expenses: Record<string, Expense>;
  isLoading: boolean;
  error: string | null;
}
