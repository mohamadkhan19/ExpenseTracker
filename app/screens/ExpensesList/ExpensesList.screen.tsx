import React, { memo, useMemo, useCallback, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { ExpenseCard } from '../../ui/organisms/ExpenseCard';
import { Text } from '../../ui/atoms/Text';
import { Button } from '../../ui/atoms/Button';
import { CategoryDropdown } from '../../ui/molecules/CategoryDropdown';
import { LoadingSpinner } from '../../ui/feedback/LoadingSpinner';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { ErrorState } from '../../ui/feedback/ErrorState';
import { DeleteConfirmationModal } from '../../ui/feedback/DeleteConfirmationModal';
import { useExpensesList } from './useExpensesList.hook';
import { useDeleteExpenseMutation } from '../../store/api/expenses.api';
import { Expense, ExpenseCategory } from '../../features/expenses/types';
import { useTheme } from '../../theme';

const ExpenseItem = memo(({ expense, onPress, onLongPress }: { expense: Expense; onPress?: () => void; onLongPress?: () => void }) => (
  <ExpenseCard expense={expense} onPress={onPress} onLongPress={onLongPress} />
));

ExpenseItem.displayName = 'ExpenseItem';

interface ExpensesListScreenProps {
  onAddExpense?: () => void;
  onEditExpense?: (expenseId: string) => void;
}

export function ExpensesListScreen({ onAddExpense, onEditExpense }: ExpensesListScreenProps) {
  const theme = useTheme();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  
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

  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  const renderExpense = useCallback(({ item }: { item: Expense }) => (
    <ExpenseItem 
      expense={item} 
      onPress={() => handleEditExpense(item.id)}
      onLongPress={() => handleDeleteExpense(item)}
    />
  ), [handleEditExpense, handleDeleteExpense]);

  const keyExtractor = useCallback((item: Expense) => item.id, []);

  const categories = useMemo(() => 
    (['food', 'transport', 'entertainment', 'shopping', 'utilities', 'health', 'education', 'other'] as ExpenseCategory[]),
    []
  );

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const handleAddExpense = useCallback(() => {
    if (onAddExpense) {
      onAddExpense();
    } else {
      console.log('Add expense pressed');
    }
  }, [onAddExpense]);

  const handleEditExpense = useCallback((expenseId: string) => {
    if (onEditExpense) {
      onEditExpense(expenseId);
    } else {
      console.log('Edit expense pressed:', expenseId);
    }
  }, [onEditExpense]);

  const handleSortToggle = useCallback(() => {
    handleSortChange(sortBy === 'date-desc' ? 'date-asc' : 'date-desc');
  }, [sortBy, handleSortChange]);

  const handleDeleteExpense = useCallback((expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteModalVisible(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!expenseToDelete) return;

    try {
      await deleteExpense(expenseToDelete.id).unwrap();
      setDeleteModalVisible(false);
      setExpenseToDelete(null);
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  }, [expenseToDelete, deleteExpense]);

  const cancelDelete = useCallback(() => {
    setDeleteModalVisible(false);
    setExpenseToDelete(null);
  }, []);

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
          onRetry={handleRetry}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
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
          onPress={handleSortToggle}
        />
        <Button
          title="Clear"
          variant="secondary"
          size="sm"
          onPress={clearFilters}
        />
      </View>

      <View style={styles.filterSection}>
        <Text variant="sm" weight="medium" color="text" style={styles.filterLabel}>
          Filter by Category:
        </Text>
        <CategoryDropdown
          selectedCategory={filterCategory}
          onCategorySelect={handleCategoryFilter}
        />
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={expenses}
          renderItem={renderExpense}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          accessibilityRole="list"
          accessibilityLabel="Expenses list"
          ListEmptyComponent={
            <EmptyState 
              title="No expenses found"
              subtitle="Add your first expense to get started"
            />
          }
        />
      </View>

      <View style={[styles.fabContainer, { backgroundColor: theme.colors.background }]}>
        <Button
          title="+ Add Expense"
          onPress={handleAddExpense}
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        />
      </View>

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        expenseDescription={expenseToDelete?.description}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={isDeleting}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // Will be set dynamically
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent', // Will be set dynamically
  },
  filterLabel: {
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for FAB
  },
  fabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: 'transparent', // Will be set dynamically
  },
  fab: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default ExpensesListScreen;


