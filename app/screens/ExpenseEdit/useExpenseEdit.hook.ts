import { useState, useCallback } from 'react';
import { useCreateExpenseMutation, useUpdateExpenseMutation } from '../../store/api/expenses.api';
import { FormData, parseFormData } from '../../lib/validation';
import { logger } from '../../utils/logger';

export function useExpenseEdit(expenseId?: string) {
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  
  const isLoading = isCreating || isUpdating;

  const handleSubmit = useCallback(async (data: FormData, onSuccess?: () => void) => {
    try {
      const expenseData = parseFormData(data);
      
      if (expenseId) {
        logger.debug('Updating expense', { expenseId, data: expenseData });
        await updateExpense({ id: expenseId, ...expenseData }).unwrap();
        logger.info('Expense updated successfully', { expenseId });
      } else {
        logger.debug('Creating new expense', { data: expenseData });
        await createExpense(expenseData).unwrap();
        logger.info('Expense created successfully');
      }
      
      onSuccess?.();
      return { success: true };
    } catch (error) {
      logger.error('Failed to save expense', error as Error, { expenseId, data });
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
