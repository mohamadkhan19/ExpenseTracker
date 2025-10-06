export type RootStackParamList = {
  ExpensesList: undefined;
  ExpenseDetail: { id: string } | undefined;
  ExpenseEdit: { id?: string } | undefined;
};

export type ExpensesStackParamList = {
  ExpensesList: undefined;
  AddExpense: undefined;
  EditExpense: { id: string };
};

export type RootTabParamList = {
  Expenses: undefined;
  Charts: undefined;
  Limits: undefined;
};


