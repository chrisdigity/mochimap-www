
import { RouteList } from './MochiMapRoutes';
import { Header, Navbar, Footer } from './MochiMapLayout';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function MochiMap () {
  return (
    <Router basename='/' onUpdate={() => document.body.scrollTo(0, 0)}>
      <div className='container'>
        <Header />
        <Navbar />
        <main className='main'>
          <div id='display' />
          <Switch>
            {RouteList.map((item, index) =>
              <Route
                exact path={item.path}
                component={item.route}
                key={index}
              />
            )}
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default MochiMap;
