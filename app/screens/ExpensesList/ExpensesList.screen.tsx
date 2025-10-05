import React, { memo } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { ExpenseCard } from '../../ui/organisms/ExpenseCard';
import { Text } from '../../ui/atoms/Text';
import { Button } from '../../ui/atoms/Button';
import { LoadingSpinner } from '../../ui/feedback/LoadingSpinner';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { ErrorState } from '../../ui/feedback/ErrorState';
import { useExpensesList } from './useExpensesList.hook';
import { Expense } from '../../features/expenses/types';
import { useTheme } from '../../theme';

const ExpenseItem = memo(({ expense }: { expense: Expense }) => (
  <ExpenseCard expense={expense} />
));

ExpenseItem.displayName = 'ExpenseItem';

export function ExpensesListScreen() {
  const theme = useTheme();
  const {
    expenses,
    isLoading,
    error,
    sortBy,
    filterCategory,
    totalAmount,
    handleSortChange,
    handleCategoryFilter,
    clearFilters,
  } = useExpensesList();

  const renderExpense = ({ item }: { item: Expense }) => (
    <ExpenseItem expense={item} />
  );

  const keyExtractor = (item: Expense) => item.id;

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingSpinner />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <ErrorState 
          title="Error loading expenses"
          message="Unable to load your expenses. Please try again."
          onRetry={() => window.location.reload()}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="xxl" weight="bold" color="text">
          Expenses
        </Text>
        <Text variant="lg" weight="semibold" color="primary">
          Total: ${totalAmount.toFixed(2)}
        </Text>
      </View>

      <View style={styles.controls}>
        <Button
          title={sortBy === 'date-desc' ? 'Date ↓' : 'Date ↑'}
          variant="outline"
          size="sm"
          onPress={() => handleSortChange(sortBy === 'date-desc' ? 'date-asc' : 'date-desc')}
        />
        <Button
          title={filterCategory === 'all' ? 'All Categories' : filterCategory}
          variant="outline"
          size="sm"
          onPress={() => handleCategoryFilter('all')}
        />
        <Button
          title="Clear"
          variant="secondary"
          size="sm"
          onPress={clearFilters}
        />
      </View>

      <FlatList
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState 
            title="No expenses found"
            subtitle="Add your first expense to get started"
            actionTitle="Add Expense"
            onAction={() => console.log('Add expense pressed')}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default ExpensesListScreen;


