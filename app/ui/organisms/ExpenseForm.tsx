import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { CategoryDropdown } from '../molecules/CategoryDropdown';
import { DatePicker } from '../molecules/DatePicker';
import { ExpenseCategory } from '../../features/expenses/types';
import { FormData, ValidationError, validateExpenseForm, formatAmount, formatDateForInput } from '../../lib/validation';

interface ExpenseFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  submitButtonTitle?: string;
  isLoading?: boolean;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitButtonTitle = 'Save Expense',
  isLoading = false,
}: ExpenseFormProps) {
  const theme = useTheme();
  
  const [formData, setFormData] = useState<FormData>({
    amount: initialData?.amount || '',
    category: initialData?.category || 'food',
    description: initialData?.description || '',
    date: initialData?.date || formatDateForInput(new Date()),
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleAmountChange = useCallback((value: string) => {
    const formatted = formatAmount(value);
    setFormData(prev => ({ ...prev, amount: formatted }));
    // Clear amount error when user starts typing
    setErrors(prev => prev.filter(error => error.field !== 'amount'));
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
    // Clear description error when user starts typing
    setErrors(prev => prev.filter(error => error.field !== 'description'));
  }, []);

  const handleDateChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, date: value }));
    // Clear date error when user starts typing
    setErrors(prev => prev.filter(error => error.field !== 'date'));
  }, []);

  const handleCategoryChange = useCallback((category: ExpenseCategory | 'all') => {
    setFormData(prev => ({ ...prev, category: category as ExpenseCategory }));
  }, []);

  const handleSubmit = useCallback(() => {
    const validationErrors = validateExpenseForm(formData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    onSubmit(formData);
  }, [formData, onSubmit]);

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Text variant="xl" weight="bold" color="text" style={styles.title}>
          {initialData ? 'Edit Expense' : 'Add New Expense'}
        </Text>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color="text" style={styles.label}>
            Amount ($)
          </Text>
          <Input
            value={formData.amount}
            onChangeText={handleAmountChange}
            placeholder="0.00"
            keyboardType="numeric"
            error={getFieldError('amount')}
            helperText="Enter amount in dollars"
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color="text" style={styles.label}>
            Category
          </Text>
          <CategoryDropdown
            selectedCategory={formData.category}
            onCategorySelect={handleCategoryChange}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color="text" style={styles.label}>
            Description
          </Text>
          <Input
            value={formData.description}
            onChangeText={handleDescriptionChange}
            placeholder="Enter expense description"
            multiline
            numberOfLines={3}
            error={getFieldError('description')}
            helperText="3-100 characters"
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color="text" style={styles.label}>
            Date
          </Text>
          <DatePicker
            value={formData.date}
            onChange={handleDateChange}
            placeholder="Select date"
            error={getFieldError('date')}
          />
        </View>

        <View style={styles.buttons}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onCancel}
            style={styles.button}
          />
          <Button
            title={submitButtonTitle}
            onPress={handleSubmit}
            style={styles.button}
            disabled={isLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  title: {
    marginBottom: 32,
    textAlign: 'center',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 12,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
  },
  button: {
    flex: 1,
  },
});
