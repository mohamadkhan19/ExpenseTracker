import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { ExpenseForm } from '../../ui/organisms/ExpenseForm';
import { useExpenseEdit } from './useExpenseEdit.hook';
import { FormData } from '../../lib/validation';

interface AddExpenseScreenProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddExpenseScreen({ onSuccess, onCancel }: AddExpenseScreenProps) {
  const { handleSubmit, isLoading } = useExpenseEdit();

  const handleFormSubmit = useCallback(async (data: FormData) => {
    const result = await handleSubmit(data, onSuccess);
    
    if (result.success) {
      Alert.alert('Success', 'Expense added successfully!', [
        { text: 'OK', onPress: onSuccess }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to add expense. Please try again.');
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

  return (
    <ScreenContainer>
      <ExpenseForm
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
        submitButtonTitle="Add Expense"
        isLoading={isLoading}
      />
    </ScreenContainer>
  );
}

export default AddExpenseScreen;


