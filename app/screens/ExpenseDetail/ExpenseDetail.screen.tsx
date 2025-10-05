import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { ExpenseForm } from '../../ui/organisms/ExpenseForm';
import { useGetExpenseByIdQuery } from '../../store/api/expenses.api';
import { useExpenseEdit } from '../ExpenseEdit/useExpenseEdit.hook';
import { FormData, formatDateForInput } from '../../lib/validation';

interface EditExpenseScreenProps {
  expenseId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditExpenseScreen({ expenseId, onSuccess, onCancel }: EditExpenseScreenProps) {
  const { data: expense, isLoading: isLoadingExpense } = useGetExpenseByIdQuery(expenseId);
  const { handleSubmit, isLoading } = useExpenseEdit(expenseId);

  const handleFormSubmit = useCallback(async (data: FormData) => {
    const result = await handleSubmit(data, onSuccess);
    
    if (result.success) {
      Alert.alert('Success', 'Expense updated successfully!', [
        { text: 'OK', onPress: onSuccess }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to update expense. Please try again.');
    }
  }, [handleSubmit, onSuccess]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      Alert.alert(
        'Cancel',
        'Are you sure you want to cancel? Your changes will be lost.',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Cancel', style: 'destructive', onPress: () => {} }
        ]
      );
    }
  }, [onCancel]);

  if (isLoadingExpense) {
    return (
      <ScreenContainer>
        {/* Loading state handled by parent */}
      </ScreenContainer>
    );
  }

  if (!expense) {
    return (
      <ScreenContainer>
        {/* Error state handled by parent */}
      </ScreenContainer>
    );
  }

  const initialData: Partial<FormData> = {
    amount: expense.amount.toString(),
    category: expense.category,
    description: expense.description,
    date: formatDateForInput(new Date(expense.date)),
  };

  return (
    <ScreenContainer>
      <ExpenseForm
        initialData={initialData}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
        submitButtonTitle="Update Expense"
        isLoading={isLoading}
      />
    </ScreenContainer>
  );
}

export default EditExpenseScreen;


