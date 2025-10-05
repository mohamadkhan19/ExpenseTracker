import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import expensesReducer from './slices/expenses.slice';

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
