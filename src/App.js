
import { useMemo, useState } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Paper, ScopedCssBaseline, useMediaQuery } from '@material-ui/core';
// import app-components
import Nopage from './app/component/Nopage';
import Header from './app/component/Header';
import Footer from './app/component/Footer';
// import app-pages
import Homepage from './app/homepage';
import BlockSearch from './app/block-search';
import BlockBnumBhash from './app/block-#bnum-#bhash';
import Explorer from './app/explorer';
import LedgerRichlist from './app/ledger-richlist';
import LedgerSearch from './app/ledger-search';
import LedgerTypeAddress from './app/ledger-#type-#address';
import TransactionMempool from './app/transaction-mempool';
import TransactionSearch from './app/transaction-search';
import TransactionTXID from './app/transaction-#txid';

// describe app-routes
export const RouteList = [
  { path: '/', route: Homepage },
  { path: '/block/search', route: BlockSearch },
  { path: '/block/:bnum/:bhash', route: BlockBnumBhash },
  { path: '/block/:bnum', route: BlockBnumBhash },
  { path: '/explorer', route: Explorer, nav: 'Explorer' },
  { path: '/ledger/richlist', route: LedgerRichlist, nav: 'Richlist' },
  { path: '/ledger/search', route: LedgerSearch },
  { path: '/ledger/:type/:address', route: LedgerTypeAddress },
  { path: '/transaction/mempool', route: TransactionMempool, nav: 'Mempool' },
  { path: '/transaction/search', route: TransactionSearch },
  { path: '/transaction/:txid', route: TransactionTXID },
  { href: 'https://mochimo.org/', nav: 'What is Mochimo?' }
];

export default function App () {
  const [themeType, setThemeType] = useState();
  const theme = useMemo(() => {
    const preferredMode = typeof themeType !== 'undefined' ? themeType
      : useMediaQuery('(prefers-color-scheme: light)') ? 'light' : 'dark';
    return createMuiTheme({
      palette: {
        type: preferredMode,
        primary: {
          main: '#424242'
        },
        secondary: {
          main: '#0059ff'
        }
      }
    });
  }, [themeType]);

  return (
    <ScopedCssBaseline>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename='/'>
          <Paper>
            <Header routelist={RouteList} setThemeType={setThemeType} />
            <Switch>
              {RouteList.filter((route) => route.path).map((route, i) =>
                <Route
                  exact path={route.path}
                  component={route.route}
                  key={i}
                />
              )}
              <Route component={Nopage} />
            </Switch>
            <Footer />
          </Paper>
        </BrowserRouter>
      </ThemeProvider>
    </ScopedCssBaseline>
  );
}
