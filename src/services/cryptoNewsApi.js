import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cryptoNewsHeaders = {
  'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
  'X-RapidAPI-Host': process.env.REACT_APP_NEWS_RAPIDAPI_HOST,
};

const baseUrl = process.env.REACT_APP_NEWS_API_URL;

export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: () => ({
        url: '/v1/cryptodaily',
        headers: cryptoNewsHeaders,
      }),
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;
