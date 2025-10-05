import { ExpenseCategory } from '../features/expenses/types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormData {
  amount: string;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export const validateExpenseForm = (data: FormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Amount validation
  if (!data.amount || data.amount.trim() === '') {
    errors.push({ field: 'amount', message: 'Amount is required' });
  } else {
    const amount = parseFloat(data.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.push({ field: 'amount', message: 'Amount must be a positive number' });
    }
    if (amount > 999999) {
      errors.push({ field: 'amount', message: 'Amount cannot exceed $999,999' });
    }
  }

  // Description validation
  if (!data.description || data.description.trim() === '') {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (data.description.trim().length < 3) {
    errors.push({ field: 'description', message: 'Description must be at least 3 characters' });
  } else if (data.description.trim().length > 100) {
    errors.push({ field: 'description', message: 'Description cannot exceed 100 characters' });
  }

  // Date validation
  if (!data.date) {
    errors.push({ field: 'date', message: 'Date is required' });
  } else {
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'date', message: 'Invalid date format' });
    } else {
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      
      if (date > today) {
        errors.push({ field: 'date', message: 'Date cannot be in the future' });
      } else if (date < oneYearAgo) {
        errors.push({ field: 'date', message: 'Date cannot be more than 1 year ago' });
      }
    }
  }

  return errors;
};

export const formatAmount = (value: string): string => {
  // Remove any non-numeric characters except decimal point
  const cleaned = value.replace(/[^0-9.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit to 2 decimal places
  if (parts[1] && parts[1].length > 2) {
    return parts[0] + '.' + parts[1].substring(0, 2);
  }
  
  return cleaned;
};

export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseFormData = (data: FormData) => {
  return {
    amount: parseFloat(data.amount),
    category: data.category,
    description: data.description.trim(),
    date: data.date,
  };
};
