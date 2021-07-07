
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
    getTransactonByTxid: builder.query({
      query: (txid) => `transaction/${txid}`
    })
  })
});

export const {
  useGetBlockByLatestQuery,
  useGetBlockByNumberQuery,
  useGetBlockByNumberHashQuery,
  useGetChainByLatestQuery,
  useGetChainByNumberQuery,
  useGetLedgerByTypeAddressQuery,
  useGetTransactonByTxidQuery
} = MochimapApi;
