import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';
import { Expense } from '../../features/expenses/types';

interface ExpenseCardProps {
  expense: Expense;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function ExpenseCard({ expense, onPress, onLongPress }: ExpenseCardProps) {
  const theme = useTheme();
  
  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: theme.colors.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent 
      style={cardStyle} 
      onPress={onPress} 
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityLabel={`Expense: ${expense.description}, ${formatAmount(expense.amount)}, ${formatCategory(expense.category)}, ${formatDate(expense.date)}`}
      accessibilityHint={onPress ? "Tap to edit expense" : onLongPress ? "Long press to delete expense" : undefined}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text variant="lg" weight="semibold" color="text">
            {formatAmount(expense.amount)}
          </Text>
          <Text variant="sm" color="subtext" style={{ marginTop: theme.spacing.xs }}>
            {expense.description}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text variant="sm" weight="medium" color="primary">
            {formatCategory(expense.category)}
          </Text>
          <Text variant="xs" color="subtext" style={{ marginTop: theme.spacing.xs }}>
            {formatDate(expense.date)}
          </Text>
        </View>
      </View>
    </CardComponent>
  );
}
