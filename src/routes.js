
import ExploreIcon from '@material-ui/icons/Explore';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
// import app-pages
import Homepage from './app/homepage';
// import BlockBnumBhash from './app/block-#bnum-#bhash';
import Explorer from './app/explorer';
import ExplorerRichlist from './app/explorer-richlist';
import ExplorerLedgerTypeAddress from './app/explorer-ledger-#type-#address';
// import TransactionMempool from './app/transaction-mempool';
// import TransactionTXID from './app/transaction-#txid';

// describe app-routes-nav-subnav
export default [
  { // route only
    route: Homepage,
    path: '/'
  },
  // { path: '/block/:bnum/:bhash', route: BlockBnumBhash },
  // { path: '/block/:bnum', route: BlockBnumBhash },
  { // route path, nav item, subnav items
    route: Explorer,
    path: '/explorer',
    Icon: ExploreIcon,
    nav: 'Explorer',
    subnav: [
      {
        path: '/explorer',
        Icon: ExploreIcon,
        primary: 'Mochimo Explorer Search',
        secondary: 'Search blocks, transactions, etc.'
      }, {
        path: '/explorer/richlist',
        Icon: AccountBalanceIcon,
        primary: 'Mochimo Richlist',
        secondary: 'Latest Ledger Rankings'
      }
    ]
  }, { // route only
    route: ExplorerRichlist,
    path: '/explorer/richlist'
  }, { // route only
    route: ExplorerLedgerTypeAddress,
    path: '/explorer/ledger/:type/:address'
  } //,
  // { path: '/transaction/mempool', route: TransactionMempool, text: 'Mempool' },
  // { path: '/transaction/:txid', route: TransactionTXID }
];
