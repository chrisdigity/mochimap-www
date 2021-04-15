import { HashRouter, Route } from 'react-router-dom';
import { Header, Navbar, Footer } from './Layout';
import { Home, Explorer, Block, SearchBlocks, Tx, SearchTxs } from './Routes';

function MochiMap () {
  return (
    <HashRouter basename='/'>
      <div className='container'>
        <Header headerTitle='Mochimap - Blockchain Explorer' />
        <Navbar />
        <main className='main'>
          <div id='display' />
          <Route exact path='/' component={Home} />
          <Route exact path='/explorer' component={Explorer} />
          <Route exact path='/explorer/block/:id' component={Block} />
          <Route exact path='/explorer/transaction/:id' component={Tx} />
          <Route path='/explorer/search/blocks' component={SearchBlocks} />
          <Route path='/explorer/search/transactions' component={SearchTxs} />
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default MochiMap;
