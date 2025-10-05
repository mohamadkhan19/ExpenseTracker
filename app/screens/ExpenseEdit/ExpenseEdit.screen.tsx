import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { ExpenseForm } from '../../ui/organisms/ExpenseForm';
import { useCreateExpenseMutation } from '../../store/api/expenses.api';
import { FormData, parseFormData } from '../../lib/validation';

interface AddExpenseScreenProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddExpenseScreen({ onSuccess, onCancel }: AddExpenseScreenProps) {
  const [createExpense, { isLoading }] = useCreateExpenseMutation();

  const handleSubmit = useCallback(async (data: FormData) => {
    try {
      const expenseData = parseFormData(data);
      await createExpense(expenseData).unwrap();
      
      Alert.alert('Success', 'Expense added successfully!', [
        { text: 'OK', onPress: onSuccess }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    }
  }, [createExpense, onSuccess]);

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

  return (
    <ScreenContainer>
      <ExpenseForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitButtonTitle="Add Expense"
        isLoading={isLoading}
      />
    </ScreenContainer>
  );
}

export default AddExpenseScreen;


