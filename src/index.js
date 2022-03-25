
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { forwardRef, StrictMode, useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { CssBaseline, responsiveFontSizes, useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { CoingeckoApi, GithubApi, MochimapApi } from 'api';

import BackgroundWave from 'app/component/BackgroundWave';
import ScrollToTop from 'app/component/ScrollToTop';
import Header from './app/component/Header';

import { Downloads } from 'app/other';
import Adq from 'app/adq';
import Privacy from 'app/privacy';
import Network from 'app/network';
import Homepage from 'app/homepage';
import Exchanges from 'app/exchanges';
import Explorer from 'app/explorer';
import ExplorerBlock from 'app/explorer-block';
import ExplorerLedger from 'app/explorer-ledger';
import Footer from 'app/component/Footer';

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
const LinkForwarder = forwardRef(({ children, ...props }, ref) => {
  // Map 'href' to external link; (MUI) -> to (<a>)
  // Map 'to' to internal link; (MUI) -> to (react-router)
  return props.href
    ? (<a ref={ref} {...props}>{children}</a>)
    : (<Link ref={ref} {...props}>{children}</Link>);
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
          primary: { main: /* mode === 'dark' ? '#00d9ff' : */ '#0059ff' },
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
  /*
  const alwaysDarkTheme = createTheme({
    ...customTheme, palette: { mode: 'dark' }
  }); */

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>{/* Background effects Routes */}
          <Route path='explorer' element={<BackgroundWave />}>
            <Route path='*' element={<BackgroundWave />} />
          </Route>
        </Routes>
        {/* Header always shown */}
        <Header actualTheme={mode} switchTheme={switchTheme} />
        <Routes>{/* Page content Routes */}
          <Route index element={<Homepage />} />
          <Route path='adq' element={<Adq />} />
          <Route path='downloads' element={<Downloads />} />
          <Route path='exchanges' element={<Exchanges />} />
          <Route path='privacy' element={<Privacy />} />
          <Route path='network' element={<Network />} />
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
              <Route index element={<Navigate replace to='/explorer/address' />} />
              <Route path=':value' element={<ExplorerLedger type='tag' />} />
            </Route>
            <Route path='transaction' element={<Explorer type='transaction' />} />
            <Route path='*' element={<Navigate replace to='/explorer' />} />
          </Route>
        </Routes>
        <Routes>{/* Footer Routes */}
          <Route index element={<Footer />} />
          <Route path='adq' element={<Footer />} />
          <Route path='exchanges' element={<Footer />} />
          <Route path='privacy' element={<Footer />} />
        </Routes>
      </BrowserRouter>
      <ScrollToTop />
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
