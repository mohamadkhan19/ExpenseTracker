import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { ScreenContainer } from '../../ui/primitives/ScreenContainer';
import { ExpenseCard } from '../../ui/organisms/ExpenseCard';
import { Text } from '../../ui/atoms/Text';
import { Button } from '../../ui/atoms/Button';
import { CategoryDropdown } from '../../ui/molecules/CategoryDropdown';
import { LoadingSpinner } from '../../ui/feedback/LoadingSpinner';
import { EmptyState } from '../../ui/feedback/EmptyState';
import { ErrorState } from '../../ui/feedback/ErrorState';
import { DeleteConfirmationModal } from '../../ui/feedback/DeleteConfirmationModal';
import { DeveloperScreen } from '../Developer/Developer.screen';
import { ExpenseForm } from '../../ui/organisms/ExpenseForm';
import { useExpensesList } from './useExpensesList.hook';
import { useDeleteExpenseMutation } from '../../store/api/expenses.api';
import { Expense, ExpenseCategory } from '../../features/expenses/types';
import { useTheme } from '../../theme';
import { FormData } from '../../lib/validation';
import { useExpenseEdit } from '../ExpenseEdit/useExpenseEdit.hook';

const ExpenseItem = memo(({ expense, onPress, onLongPress }: { expense: Expense; onPress?: () => void; onLongPress?: () => void }) => (
  <ExpenseCard expense={expense} onPress={onPress} onLongPress={onLongPress} />
));

ExpenseItem.displayName = 'ExpenseItem';

interface ExpensesListScreenProps {
  onAddExpense?: () => void;
  onEditExpense?: (expenseId: string) => void;
}

export function ExpensesListScreen({ onAddExpense, onEditExpense }: ExpensesListScreenProps) {
  const { theme } = useTheme();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [developerScreenVisible, setDeveloperScreenVisible] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [addEditModalVisible, setAddEditModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
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
    refetch,
  } = useExpensesList();

  const { handleSubmit: handleAddExpense, isLoading: isAdding } = useExpenseEdit();
  const { handleSubmit: handleEditExpense, isLoading: isEditing } = useExpenseEdit(editingExpense?.id);

  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  // Debug modal state changes
  useEffect(() => {
    console.log('Modal state changed - visible:', addEditModalVisible, 'editing:', editingExpense?.id);
  }, [addEditModalVisible, editingExpense]);

  const renderExpense = useCallback(({ item }: { item: Expense }) => (
    <ExpenseItem 
      expense={item} 
      onPress={() => handleEditExpensePress(item.id)}
      onLongPress={() => handleDeleteExpense(item)}
    />
  ), [handleEditExpensePress, handleDeleteExpense]);

  const keyExtractor = useCallback((item: Expense) => item.id, []);

  const categories = useMemo(() => 
    (['food', 'transport', 'entertainment', 'shopping', 'utilities', 'health', 'education', 'other'] as ExpenseCategory[]),
    []
  );

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const handleAddExpensePress = useCallback(() => {
    console.log('Add expense button pressed');
    if (onAddExpense) {
      onAddExpense();
    } else {
      setEditingExpense(null);
      setAddEditModalVisible(true);
      console.log('Add modal should be visible now');
    }
  }, [onAddExpense]);

  const handleEditExpensePress = useCallback((expenseId: string) => {
    console.log('Edit expense pressed:', expenseId);
    if (onEditExpense) {
      onEditExpense(expenseId);
    } else {
      const expense = expenses.find(e => e.id === expenseId);
      console.log('Found expense:', expense);
      if (expense) {
        console.log('Setting editing expense and opening modal');
        setEditingExpense(expense);
        setAddEditModalVisible(true);
        console.log('Modal should be visible now, editingExpense:', expense);
      } else {
        console.log('Expense not found!');
      }
    }
  }, [onEditExpense, expenses]);

  const handleSortToggle = useCallback(() => {
    handleSortChange(sortBy === 'date-desc' ? 'date-asc' : 'date-desc');
  }, [sortBy, handleSortChange]);

  const handleFormSubmit = useCallback(async (data: FormData) => {
    console.log('Form submitted:', data);
    const result = editingExpense 
      ? await handleEditExpense(data)
      : await handleAddExpense(data);
    
    console.log('Form submission result:', result);
    if (result.success) {
      setAddEditModalVisible(false);
      setEditingExpense(null);
      // Manually refetch the data to ensure UI updates
      refetch();
    }
  }, [editingExpense, handleAddExpense, handleEditExpense, refetch]);

  const handleFormCancel = useCallback(() => {
    setAddEditModalVisible(false);
    setEditingExpense(null);
  }, []);

  const handleDeleteExpense = useCallback((expense: Expense) => {
    console.log('Delete expense pressed:', expense.id);
    setExpenseToDelete(expense);
    setDeleteModalVisible(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!expenseToDelete) return;

    try {
      console.log('Deleting expense:', expenseToDelete.id);
      await deleteExpense(expenseToDelete.id).unwrap();
      console.log('Expense deleted successfully');
      setDeleteModalVisible(false);
      setExpenseToDelete(null);
      // Manually refetch the data to ensure UI updates
      refetch();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  }, [expenseToDelete, deleteExpense, refetch]);

  const cancelDelete = useCallback(() => {
    setDeleteModalVisible(false);
    setExpenseToDelete(null);
  }, []);

  const handleTitleTap = useCallback(() => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);
    
    if (newTapCount >= 10) {
      setDeveloperScreenVisible(true);
      setTapCount(0);
    }
    
    // Reset tap count after 3 seconds
    setTimeout(() => {
      setTapCount(0);
    }, 3000);
  }, [tapCount]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingSpinner message="Loading expenses..." />
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
          icon="📱"
        />
      </ScreenContainer>
    );
  }

  if (developerScreenVisible) {
    return (
      <DeveloperScreen onClose={() => setDeveloperScreenVisible(false)} />
    );
  }

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleTitleTap} activeOpacity={0.7}>
            <Text variant="xxl" weight="bold" color="text">
              Expenses
            </Text>
          </TouchableOpacity>
          <Text 
            variant="lg" 
            weight="semibold" 
            style={{ color: theme.colors.loss }} // Robinhood-style red for total expenses
          >
            Total: -${totalAmount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Button
            title={sortBy === 'date-desc' ? 'Date ↓' : 'Date ↑'}
            variant="outline"
            size="sm"
            onPress={handleSortToggle}
          />
        </View>
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
              icon="💰"
              variant="inline"
            />
          }
        />
      </View>

      <View style={[styles.fabContainer, { backgroundColor: theme.colors.background }]}>
        <Button
          title="+ Add Expense"
          onPress={handleAddExpensePress}
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        />
        <Button
          title="Test Modal"
          onPress={() => {
            console.log('Test modal button pressed');
            setAddEditModalVisible(true);
            setEditingExpense(null);
          }}
          style={[styles.fab, { backgroundColor: theme.colors.secondary, marginTop: 10 }]}
        />
      </View>

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        expenseDescription={expenseToDelete?.description}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={isDeleting}
      />

      {addEditModalVisible && (
        <Modal
          visible={addEditModalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={handleFormCancel}
        >
          {console.log('Modal rendering - visible:', addEditModalVisible, 'Editing expense:', editingExpense)}
          <ScreenContainer>
            <ExpenseForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              submitButtonTitle={editingExpense ? "Update Expense" : "Add Expense"}
              isLoading={isAdding || isEditing}
              initialData={editingExpense ? {
                description: editingExpense.description,
                amount: editingExpense.amount.toString(),
                category: editingExpense.category,
                date: editingExpense.date,
                notes: editingExpense.notes || '',
              } : undefined}
            />
          </ScreenContainer>
        </Modal>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // Will be set dynamically
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
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


