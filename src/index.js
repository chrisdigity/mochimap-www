
import { StrictMode } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { CoingeckoApi, GithubApi, MochimapApi } from 'api';
import App from 'App';

export const Store = configureStore({
  reducer: combineReducers({
    [CoingeckoApi.reducerPath]: CoingeckoApi.reducer,
    [GithubApi.reducerPath]: GithubApi.reducer,
    [MochimapApi.reducerPath]: MochimapApi.reducer
  }),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(CoingeckoApi.middleware)
    .concat(GithubApi.middleware)
    .concat(MochimapApi.middleware)
});

setupListeners(Store.dispatch);

render(
  <Provider store={Store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>,
  document.getElementById('root')
);
