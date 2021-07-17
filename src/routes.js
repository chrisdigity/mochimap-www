
import ExploreIcon from '@material-ui/icons/Explore';
import ShowChartIcon from '@material-ui/icons/ShowChart';
// import app-pages
import Homepage from './app/homepage';
// import BlockSearch from './app/block-search';
// import BlockBnumBhash from './app/block-#bnum-#bhash';
import Explorer from './app/explorer';
import Graphs from 'app/graphs';
// import LedgerRichlist from './app/ledger-richlist';
// import LedgerSearch from './app/ledger-search';
// import LedgerTypeAddress from './app/ledger-#type-#address';
// import TransactionMempool from './app/transaction-mempool';
// import TransactionSearch from './app/transaction-search';
// import TransactionTXID from './app/transaction-#txid';

// describe app-routes
export default [
  { path: '/', route: Homepage },
  // { path: '/block/search', route: BlockSearch },
  // { path: '/block/:bnum/:bhash', route: BlockBnumBhash },
  // { path: '/block/:bnum', route: BlockBnumBhash },
  {
    text: 'Explorer',
    route: Explorer,
    path: '/explorer',
    Icon: ExploreIcon
  },
  // { path: '/ledger/richlist', route: LedgerRichlist, text: 'Richlist' },
  // { path: '/ledger/search', route: LedgerSearch },
  // { path: '/ledger/:type/:address', route: LedgerTypeAddress },
  // { path: '/transaction/mempool', route: TransactionMempool, text: 'Mempool' },
  // { path: '/transaction/search', route: TransactionSearch },
  // { path: '/transaction/:txid', route: TransactionTXID }
  {
    text: 'Graphs',
    route: Graphs,
    path: '/graphs',
    Icon: ShowChartIcon
  }

];
