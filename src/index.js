
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { forwardRef, StrictMode, useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { CssBaseline, Link as MuiLink, responsiveFontSizes, useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { CoingeckoApi, GithubApi, MochimapApi } from 'api';

import BackgroundWave from 'app/component/BackgroundWave';
import Header from './app/component/Header';

import Homepage from 'app/homepage';
import Network from 'app/network';
import Explorer from 'app/explorer';
import ExplorerBlock from 'app/explorer-block';
import ExplorerLedger from 'app/explorer-ledger';

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

// custom link handling (forward MUI links to react-router links)
const LinkForwarder = forwardRef((props, ref) => {
  // Map 'href' to external link; (MUI) -> to (<a>)
  // Map 'to' to internal link; (MUI) -> to (react-router)
  return props.href
    ? (<a ref={ref} {...props} />)
    : (<Link ref={ref} {...props} />);
});

function App () {
  const [selected, setSelected] = useState();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const switchTheme = () => {
    setSelected(
      (!selected && prefersDark) || selected === 'dark' ? 'light' : 'dark'
    );
  };
  const mode = 'dark'; // selected || (prefersDark ? 'dark' : 'light');
  const customTheme = useMemo(() => {
    return responsiveFontSizes(
      createTheme({
        components: {
          MuiButton: {
            defaultProps: {
              color: 'primary'
            }
          },
          MuiLink: {
            defaultProps: {
              component: LinkForwarder,
              color: 'primary'
            }
          }
        },
        palette: {
          mode,
          primary: { main: mode === 'dark' ? '#00d9ff' : '#0059ff' },
          secondary: { main: '#0059ff' /* '#ffa600' */ },
          textPrimary: { main: 'white' }
        },
        typography: {
          h1: {
            fontFamily: 'Nanum Brush Script',
            fontWeight: 'bold',
            textAlign: 'center',
            transition: 'font-size 250ms ease'
          },
          h2: {
            fontFamily: 'Roboto',
            fontWeight: 'bold'
          },
          h3: {
            fontFamily: 'Nunito Sans',
            fontWeight: 'bold'
          },
          h6: {
            fontFamily: 'Roboto Mono'
          },
          caption: {
            fontFamily: 'Roboto Mono'
          }
        }
      })
    );
  }, [mode]);
  const alwaysDarkTheme = createTheme({
    ...customTheme, palette: { mode: 'dark' }
  });

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route index />
          <Route path='map'>
            <Route index element={<Network />} />
          </Route>
          <Route path='*' element={<BackgroundWave />} />
        </Routes>
        <Header actualTheme={mode} switchTheme={switchTheme} />
        <Routes>
          <Route index element={<Homepage />} />
          <Route path='network' />
          <Route path='map' />
          <Route path='explorer'>
            <Route index element={<Explorer />} />
            <Route path='address'>
              <Route index element={<Explorer type='address' />} />
              <Route path=':value' element={<ExplorerLedger type='address' />} />
            </Route>
            <Route path='block'>
              <Route index element={<Explorer type='block' />} />
              <Route path=':bnum/:bhash' element={<ExplorerBlock />} />
              <Route path=':bnum' element={<ExplorerBlock />} />
            </Route>
            <Route path='richlist' element={<Explorer type='richlist' />} />
            <Route path='tag'>
              <Route index element={<Navigate to='/explorer/address' />} />
              <Route path=':value' element={<ExplorerLedger type='tag' />} />
            </Route>
            <Route path='transaction' element={<Explorer type='transaction' />} />
            <Route path='*' element={<Navigate to='/explorer' />} />
          </Route>
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

render(
  <Provider store={Store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>,
  document.getElementById('root')
);
