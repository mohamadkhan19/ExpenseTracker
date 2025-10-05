import React, { useState } from 'react';
import ExpensesListScreen from '../screens/ExpensesList/ExpensesList.screen';
import AddExpenseScreen from '../screens/ExpenseEdit/ExpenseEdit.screen';
import EditExpenseScreen from '../screens/ExpenseDetail/ExpenseDetail.screen';
import { RootStackParamList } from './types';

type Screen = 'ExpensesList' | 'AddExpense' | 'EditExpense';

interface AppNavigatorState {
  currentScreen: Screen;
  params?: any;
}

export default function AppNavigator() {
  const [navigationState, setNavigationState] = useState<AppNavigatorState>({
    currentScreen: 'ExpensesList',
  });

  const navigateToAddExpense = () => {
    setNavigationState({
      currentScreen: 'AddExpense',
    });
  };

  const navigateToEditExpense = (expenseId: string) => {
    setNavigationState({
      currentScreen: 'EditExpense',
      params: { expenseId },
    });
  };

  const navigateBack = () => {
    setNavigationState({
      currentScreen: 'ExpensesList',
    });
  };

  const handleAddExpenseSuccess = () => {
    navigateBack();
  };

  const handleEditExpenseSuccess = () => {
    navigateBack();
  };

  switch (navigationState.currentScreen) {
    case 'AddExpense':
      return (
        <AddExpenseScreen
          onSuccess={handleAddExpenseSuccess}
          onCancel={navigateBack}
        />
      );
    
    case 'EditExpense':
      return (
        <EditExpenseScreen
          expenseId={navigationState.params?.expenseId}
          onSuccess={handleEditExpenseSuccess}
          onCancel={navigateBack}
        />
      );
    
    case 'ExpensesList':
    default:
      return (
        <ExpensesListScreen
          onAddExpense={navigateToAddExpense}
          onEditExpense={navigateToEditExpense}
        />
      );
  }
}


