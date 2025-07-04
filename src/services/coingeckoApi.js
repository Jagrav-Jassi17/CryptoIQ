import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const coingeckoApi = createApi({
  reducerPath: 'coingeckoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.coingecko.com/api/v3' }),
  endpoints: (builder) => ({
    getExchanges: builder.query({
      query: () => `/exchanges`,
    }),
    getBtcUsdPrice: builder.query({
      query: () => `/simple/price?ids=bitcoin&vs_currencies=usd`,
    }),
    getStatusUpdates: builder.query({
      query: () => `/status_updates`,
    }),
    getGlobalStats: builder.query({
      query: () => `/global`,
    }),
  }),
});

export const {
  useGetExchangesQuery,
  useGetBtcUsdPriceQuery,
  useGetStatusUpdatesQuery,
  useGetGlobalStatsQuery, 
} = coingeckoApi;
