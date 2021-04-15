import RouteList from './MochiMapRoutes';
import { Header, Navbar, Footer } from './MochiMapLayout';
import { HashRouter, Route } from 'react-router-dom';

function MochiMap () {
  return (
    <HashRouter basename='/'>
      <div className='container'>
        <Header />
        <Navbar />
        <main className='main'>
          <div id='display' />
          {RouteList.map((item, index) =>
            <Route exact path={item.path} component={item.route} key={index} />
          )}
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default MochiMap;
