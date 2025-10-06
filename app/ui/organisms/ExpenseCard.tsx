import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';
import { Expense } from '../../features/expenses/types';
import { HapticFeedback } from '../../utils/haptic';

interface ExpenseCardProps {
  expense: Expense;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function ExpenseCard({ expense, onPress, onLongPress }: ExpenseCardProps) {
  const { theme } = useTheme();
  
  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md, // More subtle rounding like Robinhood
    padding: theme.spacing.md, // Tighter padding
    marginBottom: theme.spacing.sm, // Tighter spacing
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 1, // Subtle shadow
    shadowColor: theme.colors.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleLongPress = () => {
    console.log('Long press detected on expense:', expense.id);
    HapticFeedback.warning();
    onLongPress?.();
  };

  const handlePress = () => {
    console.log('Press detected on expense:', expense.id);
    console.log('onPress function exists:', !!onPress);
    if (onPress) {
      console.log('Calling onPress function');
      onPress();
    } else {
      console.log('No onPress function provided');
    }
  };

  return (
    <TouchableOpacity 
      style={cardStyle} 
      onPress={handlePress} 
      onLongPress={handleLongPress}
      accessibilityRole="button"
      accessibilityLabel={`Expense: ${expense.description}, ${formatAmount(expense.amount)}, ${formatCategory(expense.category)}, ${formatDate(expense.date)}`}
      accessibilityHint={onPress ? "Tap to edit expense" : onLongPress ? "Long press to delete expense" : undefined}
    >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text 
                variant="lg" 
                weight="semibold" 
                style={{ color: theme.colors.loss }} // Robinhood-style red for expenses
              >
                -{formatAmount(expense.amount)}
              </Text>
              <Text variant="sm" color="subtext" style={{ marginTop: theme.spacing.xs }}>
                {expense.description}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="sm" weight="medium" color="neutral">
                {formatCategory(expense.category)}
              </Text>
              <Text variant="xs" color="subtext" style={{ marginTop: theme.spacing.xs }}>
                {formatDate(expense.date)}
              </Text>
            </View>
          </View>
    </TouchableOpacity>
  );
}
