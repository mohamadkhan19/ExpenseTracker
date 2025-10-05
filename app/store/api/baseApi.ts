import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/', // Local API - we'll use adapters instead
  }),
  tagTypes: ['Expense'],
  endpoints: () => ({}),
});
