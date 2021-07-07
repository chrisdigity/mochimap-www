
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { MochimapApi } from './app/service/mochimap-api';

export const Store = configureStore({
  reducer: { [MochimapApi.reducerPath]: MochimapApi.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(MochimapApi.middleware)
});

setupListeners(Store.dispatch);
