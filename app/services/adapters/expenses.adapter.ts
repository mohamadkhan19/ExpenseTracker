import { AsyncStorageClient } from '../storage/asyncStorageClient';
import { STORAGE_KEYS } from '../storage/keys';
import { Expense, CreateExpenseRequest, UpdateExpenseRequest } from '../../features/expenses/types';

export class ExpensesAdapter {
  static async getAllExpenses(): Promise<Expense[]> {
    const expenses = await AsyncStorageClient.get<Expense[]>(STORAGE_KEYS.EXPENSES);
    return expenses || [];
  }

  static async getExpenseById(id: string): Promise<Expense | null> {
    const expenses = await this.getAllExpenses();
    return expenses.find(expense => expense.id === id) || null;
  }

  static async createExpense(data: CreateExpenseRequest): Promise<Expense> {
    const expenses = await this.getAllExpenses();
    const newExpense: Expense = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    expenses.push(newExpense);
    await AsyncStorageClient.set(STORAGE_KEYS.EXPENSES, expenses);
    return newExpense;
  }

  static async updateExpense(data: UpdateExpenseRequest): Promise<Expense | null> {
    const expenses = await this.getAllExpenses();
    const index = expenses.findIndex(expense => expense.id === data.id);
    
    if (index === -1) {
      return null;
    }

    const updatedExpense: Expense = {
      ...expenses[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    expenses[index] = updatedExpense;
    await AsyncStorageClient.set(STORAGE_KEYS.EXPENSES, expenses);
    return updatedExpense;
  }

  static async deleteExpense(id: string): Promise<boolean> {
    const expenses = await this.getAllExpenses();
    const filteredExpenses = expenses.filter(expense => expense.id !== id);
    
    if (filteredExpenses.length === expenses.length) {
      return false; // Expense not found
    }

    await AsyncStorageClient.set(STORAGE_KEYS.EXPENSES, filteredExpenses);
    return true;
  }
}
