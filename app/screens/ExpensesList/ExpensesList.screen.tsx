import React, { memo } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { ExpenseCard } from '../../ui/organisms/ExpenseCard';
import { Text } from '../../ui/atoms/Text';
import { Button } from '../../ui/atoms/Button';
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

  if (error) {
    return (
      <ScreenContainer style={styles.center}>
        <Text variant="lg" color="error" style={styles.errorText}>
          Error loading expenses
        </Text>
        <Button title="Retry" onPress={() => window.location.reload()} />
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
          <View style={styles.empty}>
            <Text variant="lg" color="subtext">
              No expenses found
            </Text>
            <Text variant="sm" color="subtext" style={styles.emptySubtext}>
              Add your first expense to get started
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptySubtext: {
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ExpensesListScreen;


