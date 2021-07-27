
import ExploreIcon from '@material-ui/icons/Explore';
// import app-pages
import Homepage from './app/homepage';
// import BlockSearch from './app/block-search';
// import BlockBnumBhash from './app/block-#bnum-#bhash';
import Explorer from './app/explorer';
// import LedgerRichlist from './app/ledger-richlist';
// import LedgerSearch from './app/ledger-search';
import ExplorerLedgerTypeAddress from './app/explorer-ledger-#type-#address';
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
    route: Explorer,
    path: '/explorer',
    Icon: ExploreIcon,
    header: 'Explorer',
    desc: 'Mochimo Block Explorer'
  },
  // { path: '/ledger/richlist', route: LedgerRichlist, text: 'Richlist' },
  // { path: '/ledger/search', route: LedgerSearch },
  {
    route: ExplorerLedgerTypeAddress,
    path: '/explorer/ledger/:type/:address'
  } //,
  // { path: '/transaction/mempool', route: TransactionMempool, text: 'Mempool' },
  // { path: '/transaction/search', route: TransactionSearch },
  // { path: '/transaction/:txid', route: TransactionTXID }
];
