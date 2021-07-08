
import { useMemo, useState } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { CssBaseline, useMediaQuery } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Routes from './routes.js';
// import app-components
import BackgroundWave from './app/component/BackgroundWave';
import ScrollToTop from './app/component/ScrollToTop';
import Nopage from './app/component/Nopage';
import Header from './app/component/Header';
// import Footer from './app/component/Footer';
import WebFont from 'webfontloader';
WebFont.load({
  google: {
    families: ['Nanum Brush Script:400,800', 'Nanum Gothic:400,800']
  }
});

export default function App () {
  const { DARK, LIGHT } = { DARK: 'dark', LIGHT: 'light' };
  const [selectedThemeType, setSelectedThemeType] = useState();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersType = typeof selectedThemeType === 'undefined'
    ? prefersDark ? DARK : LIGHT : selectedThemeType;
  const darkMode = Boolean(prefersType === DARK);
  const switchTheme = () => setSelectedThemeType(darkMode ? LIGHT : DARK);

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
        <Header routelist={Routes} switchTheme={switchTheme} />
        <Switch>
          {Routes.filter((route) => route.path).map((route, i) =>
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
