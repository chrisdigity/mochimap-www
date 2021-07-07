
import { useMemo, useState } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { CssBaseline, useMediaQuery } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import WebFont from 'webfontloader';
// import app-components
import BackgroundWave from './app/component/BackgroundWave';
import ScrollToTop from './app/component/ScrollToTop';
import Nopage from './app/component/Nopage';
import Header from './app/component/Header';
// import Footer from './app/component/Footer';
// import app-pages
import Homepage from './app/homepage';
// import BlockSearch from './app/block-search';
// import BlockBnumBhash from './app/block-#bnum-#bhash';
import Explorer from './app/explorer';
// import LedgerRichlist from './app/ledger-richlist';
// import LedgerSearch from './app/ledger-search';
// import LedgerTypeAddress from './app/ledger-#type-#address';
// import TransactionMempool from './app/transaction-mempool';
// import TransactionSearch from './app/transaction-search';
// import TransactionTXID from './app/transaction-#txid';

// describe app-routes
const RouteList = [
  { path: '/', route: Homepage },
  // { path: '/block/search', route: BlockSearch },
  // { path: '/block/:bnum/:bhash', route: BlockBnumBhash },
  // { path: '/block/:bnum', route: BlockBnumBhash },
  { path: '/explorer', route: Explorer, text: 'Explorer' } //,
  // { path: '/ledger/richlist', route: LedgerRichlist, text: 'Richlist' },
  // { path: '/ledger/search', route: LedgerSearch },
  // { path: '/ledger/:type/:address', route: LedgerTypeAddress },
  // { path: '/transaction/mempool', route: TransactionMempool, text: 'Mempool' },
  // { path: '/transaction/search', route: TransactionSearch },
  // { path: '/transaction/:txid', route: TransactionTXID },
  // { path: 'https://mochimo.org/', text: 'What is Mochimo?' }
];

WebFont.load({
  google: {
    families: ['Nanum Brush Script:400,800']
  }
});

export default function App () {
  const { DARK, LIGHT } = { DARK: 'dark', LIGHT: 'light' };
  const [selectedThemeType, setSelectedThemeType] = useState();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersType = typeof selectedThemeType === 'undefined'
    ? prefersDark ? DARK : LIGHT : selectedThemeType;
  const darkMode = Boolean(prefersType === DARK);

  const MuiTheme = useMemo(() => {
    return createMuiTheme({
      palette: {
        type: prefersType,
        primary: {
          main: darkMode ? '#303030' : '#202020'
        },
        secondary: {
          main: '#0059ff'
        },
        background: {
          default: darkMode ? '#000000' : '#ffffff'
        }
      }
    });
  }, [prefersType, darkMode]);

  return (
    <ThemeProvider theme={MuiTheme}>
      <CssBaseline />
      <BrowserRouter basename='/'>
        <BackgroundWave />
        <Header routelist={RouteList} setThemeType={setSelectedThemeType} />
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
        <ScrollToTop />
      </BrowserRouter>
    </ThemeProvider>
  );
}
