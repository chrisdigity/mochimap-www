
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const MochimapApi = createApi({
  reducerPath: 'MochimapApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://sg.mochimap.com' }),
  endpoints: (builder) => ({
    getBlockByLatest: builder.query({
      query: () => 'block'
    }),
    getBlockByNumber: builder.query({
      query: (number) => `block/${number}`
    }),
    getBlockByNumberHash: builder.query({
      query: (number, hash) => `block/${number}/${hash}`
    }),
    getBlocksBySearch: builder.query({
      query: (searchParams) => `block/search?${searchParams}`
    }),
    getChainByLatest: builder.query({
      query: () => 'chain'
    }),
    getChainByNumber: builder.query({
      query: (number) => `chain/${number}`
    }),
    getChainByNumberHash: builder.query({
      query: (number, hash) => `chain/${number}/${hash}`
    }),
    getLedgerByTypeAddress: builder.query({
      query: (type, address) => `ledger/${type}/${address}`
    }),
    getLedgerBalanceBySearch: builder.query({
      query: (searchParams) => `ledger/search?${searchParams}`
    }),
    getNodeBySearch: builder.query({
      query: (searchParams) => `network/search?${searchParams}`
    }),
    getTransactionByTxid: builder.query({
      query: (txid) => `transaction/${txid}`
    }),
    getTransactionsBySearch: builder.query({
      query: (searchParams) => `transaction/search?${searchParams}`
    })
  })
});

export const {
  useGetBlockByLatestQuery,
  useGetBlockByNumberQuery,
  useGetBlockByNumberHashQuery,
  useGetBlocksBySearchQuery,
  useGetChainByLatestQuery,
  useGetChainByNumberQuery,
  useGetLedgerByTypeAddressQuery,
  useGetLedgerBalanceBySearchQuery,
  useGetNodeBySearchQuery,
  useGetTransactionByTxidQuery,
  useGetTransactionsBySearchQuery
} = MochimapApi;
