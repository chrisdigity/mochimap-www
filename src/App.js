
import { forwardRef, lazy, Suspense, useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { Box, CssBaseline, responsiveFontSizes, useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import ScrollToTop from 'app/component/ScrollToTop';
import Header from './app/component/Header';

import {
  Adq, Resources, Exchanges, MeetTheTeam, Privacy
} from 'app/other';
import Network from 'app/network';
import Status from 'app/status';
import Homepage from 'app/homepage';
import Explorer from 'app/explorer';
import ExplorerBlock from 'app/explorer-block';
import ExplorerLedger from 'app/explorer-ledger';
import Footer from 'app/component/Footer';

const BackgroundWave = lazy(() => import('app/component/BackgroundWave'));

// custom link handling (forward MUI links to react-router links)
const LinkForwarder = forwardRef(({ children, ...props }, ref) => {
  // Map 'href' to external link; (MUI) -> to (<a>)
  // Map 'to' to internal link; (MUI) -> to (react-router)
  return props.href
    ? (<a ref={ref} {...props}>{children}</a>)
    : (<Link ref={ref} {...props}>{children}</Link>);
});

export default function App () {
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
          MuiContainer: {
            defaultProps: {
              sx: { position: 'relative' }
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
            fontFamily: 'Iceland',
            textAlign: 'center',
            transition: 'font-size 250ms ease'
          },
          h2: {
            fontFamily: 'Nunito Sans',
            fontWeight: 'bold'
          },
          h3: {
            fontFamily: 'Nunito Sans',
            fontWeight: 'bold'
          },
          h4: {
            fontFamily: 'Nunito Sans',
            fontWeight: 'bold'
          },
          h5: {
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
        {/* Header (always shown) */}
        <Header actualTheme={mode} switchTheme={switchTheme} />
        {/* Page layout container (minimum 100% "visual height") */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
          }}
        >{/* Page body (auto fills remaining layout height) */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              paddingBottom: 10,
              paddingTop: 10,
              flexGrow: 1
            }}
          >
            <Routes>{/* Background effects Routes */}
              <Route index element={null} />
              <Route path='network' element={null} />
              <Route
                path='*' element={(
                  <Suspense fallback={null}>
                    <BackgroundWave />
                  </Suspense>
                )}
              />
            </Routes>
            <Routes>{/* Page content Routes */}
              <Route index element={<Homepage />} />
              <Route path='what-is-adq' element={<Adq />} />
              <Route path='meet-the-team' element={<MeetTheTeam />} />
              <Route path='resources' element={<Resources />} />
              <Route path='exchanges' element={<Exchanges />} />
              <Route path='privacy' element={<Privacy />} />
              <Route path='status' element={<Status />} />
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
          </Box>
          <Routes>
            {/* Page footer (not shown on interactive network page) */}
            <Route path='network' element={null} />
            <Route path='*' element={<Footer />} />
          </Routes>
        </Box>
      </BrowserRouter>
      {/* ScrollToTop component sits above all other components */}
      <ScrollToTop />
    </ThemeProvider>
  );
}
