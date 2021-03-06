
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const CoingeckoApi = createApi({
  reducerPath: 'CoingeckoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.coingecko.com/api/v3/' }),
  endpoints: (builder) => ({
    getPrice: builder.query({
      query: () => 'simple/price?ids=mochimo&vs_currencies=usd'
    })
  })
});

export const GithubApi = createApi({
  reducerPath: 'GithubApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.github.com/' }),
  endpoints: (builder) => ({
    getContributors: builder.query({
      query: (params) => `repos/${params.owner}/${params.repo}/contributors`
    })
  })
});

export const MochimapApi = createApi({
  reducerPath: 'MochimapApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://new-api.mochimap.com' }),
  endpoints: (builder) => ({
    getBase: builder.query({ query: (params) => '' }),
    getBlocks: builder.query({
      query: (params) =>
        `block${params?.bnum
          ? `/${params.bnum}${params?.bhash ? `/${params.bhash}` : ''}`
          : ''}${params?.search ? `?${params.search}` : ''}`
    }),
    getChain: builder.query({
      query: (params) =>
        `chain${params?.bnum ? `/${params.bnum}` : ''}` +
        (params?.bparam ? `/${params?.bparam}` : '')
    }),
    getLedgerEntry: builder.query({
      query: (params) => `balance/${params.type}/${params.value}`
    }),
    getLedgerHistory: builder.query({
      query: (params) =>
        `ledger${params?.type
        ? `/${params.type}${params?.value ? `/${params.value}` : ''}`
        : ''}${params?.search ? `?${params.search}` : ''}`
    }),
    getNetwork: builder.query({
      query: () => 'network/active'
    }),
    getRichlist: builder.query({
      query: (params) => `richlist?${params?.search}`
    }),
    getTransactions: builder.query({
      query: (params) =>
        `transaction${params?.type
          ? `/${params.type}${params?.value ? `/${params.value}` : ''}`
          : ''}${params?.search ? `?${params.search}` : ''}`
    })
  })
});

export const {
  useGetPriceQuery
} = CoingeckoApi;
export const {
  useGetContributorsQuery
} = GithubApi;
export const {
  useGetBaseQuery,
  useGetBlocksQuery,
  useGetChainQuery,
  useGetLedgerEntryQuery,
  useGetLedgerHistoryQuery,
  useGetNetworkQuery,
  useGetRichlistQuery,
  useGetTransactionsQuery
} = MochimapApi;
