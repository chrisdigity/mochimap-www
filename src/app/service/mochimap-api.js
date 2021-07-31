
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const MochimapApi = createApi({
  reducerPath: 'MochimapApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://sg.mochimap.com' }),
  endpoints: (builder) => ({
    getBlockByLatest: builder.query({
      query: () => 'block'
    }),
    getBlockByNumber: builder.query({
      query: (params) => `block/${params?.number}`
    }),
    getBlockByNumberHash: builder.query({
      query: (params) => `block/${params?.number}/${params?.hash}`
    }),
    getBlocksBySearch: builder.query({
      query: (params) => `block/search?${params?.search}`
    }),
    getChainByLatest: builder.query({
      query: () => 'chain'
    }),
    getChainByNumber: builder.query({
      query: (params) => `chain/${params?.number}`
    }),
    getChainByNumberHash: builder.query({
      query: (params) => `chain/${params?.number}/${params?.hash}`
    }),
    getLedgerEntryByTypeAddress: builder.query({
      query: (params) => `ledger/${params?.type}/${params?.address}`
    }),
    getLedgerBalancesBySearch: builder.query({
      query: (params) => `ledger/search?${params?.search}`
    }),
    getNodeBySearch: builder.query({
      query: (params) => `network/search?${params?.search}`
    }),
    getTransactionByTxid: builder.query({
      query: (params) => `transaction/${params?.txid}`
    }),
    getTransactionsBySearch: builder.query({
      query: (params) => `transaction/search?${params?.search}`
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
  useGetLedgerEntryByTypeAddressQuery,
  useGetLedgerBalancesBySearchQuery,
  useGetNodeBySearchQuery,
  useGetTransactionByTxidQuery,
  useGetTransactionsBySearchQuery
} = MochimapApi;
