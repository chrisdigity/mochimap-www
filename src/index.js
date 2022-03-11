
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { forwardRef, StrictMode, useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { CssBaseline, responsiveFontSizes, useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { CoingeckoApi, MochimapApi } from 'api';

import BackgroundWave from 'app/component/BackgroundWave';
import Header from './app/component/Header';

import Homepage from 'app/homepage';
import Network from 'app/network';
import Explorer from 'app/explorer';
import ExplorerBlock from 'app/explorer-block';
import ExplorerLedger from 'app/explorer-ledger';

export const Store = configureStore({
  reducer: combineReducers({
    [MochimapApi.reducerPath]: MochimapApi.reducer,
    [CoingeckoApi.reducerPath]: CoingeckoApi.reducer
  }),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(CoingeckoApi.middleware).concat(MochimapApi.middleware)
});

setupListeners(Store.dispatch);

// custom link handling (forward MUI links to react-router links)
const LinkForwarder = forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <Link ref={ref} to={href} {...other} />;
});

function App () {
  const [selected, setSelected] = useState();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const switchTheme = () => {
    setSelected(
      (!selected && prefersDark) || selected === 'dark' ? 'light' : 'dark'
    );
  };
  const mode = selected || (prefersDark ? 'dark' : 'light');
  const customTheme = useMemo(() => {
    return responsiveFontSizes(
      createTheme({
        components: {
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
          secondary: { main: '#ffa600' }
        },
        typography: {
          h1: {
            fontFamily: 'Nanum Brush Script',
            fontWeight: 'bold',
            textAlign: 'center',
            transition: 'font-size 250ms ease',
            whiteSpace: 'nowrap'
          },
          h2: {
            fontFamily: 'Nanum Brush Script',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          },
          h3: {
            fontFamily: 'Nanum Brush Script',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
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
          <Route path='network'>
            <Route index element={<Network />} />
          </Route>
          <Route path='*' element={<BackgroundWave />} />
        </Routes>
        <ThemeProvider theme={alwaysDarkTheme}>
          <Header actualTheme={mode} switchTheme={switchTheme} />
        </ThemeProvider>
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
