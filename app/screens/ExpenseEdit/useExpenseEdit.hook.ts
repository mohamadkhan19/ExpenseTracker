import { useState, useCallback } from 'react';
import { useCreateExpenseMutation, useUpdateExpenseMutation } from '../../store/api/expenses.api';
import { FormData, parseFormData } from '../../lib/validation';

export function useExpenseEdit(expenseId?: string) {
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  
  const isLoading = isCreating || isUpdating;

  const handleSubmit = useCallback(async (data: FormData, onSuccess?: () => void) => {
    try {
      const expenseData = parseFormData(data);
      
      if (expenseId) {
        await updateExpense({ id: expenseId, ...expenseData }).unwrap();
      } else {
        await createExpense(expenseData).unwrap();
      }
      
      onSuccess?.();
      return { success: true };
    } catch (error) {
      console.error('Failed to save expense:', error);
      return { success: false, error: 'Failed to save expense. Please try again.' };
    }
  }, [expenseId, createExpense, updateExpense]);

  return {
    handleSubmit,
    isLoading,
    isCreating,
    isUpdating,
  };
}
