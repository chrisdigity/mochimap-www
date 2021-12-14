
import ExploreIcon from '@material-ui/icons/Explore';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ViewListIcon from '@material-ui/icons/ViewList';
import WalletIcon from '@material-ui/icons/AccountBalanceWallet';
// import app-pages
import Homepage from './app/homepage';
import Explorer from './app/explorer';
import ExplorerBlock from './app/explorer-block-#bnum-#bhash';
import ExplorerRichlist from './app/explorer-richlist';
import ExplorerLedger from './app/explorer-ledger';
import ExplorerLedgerTypeAddress from './app/explorer-ledger-#type-#address';
// import TransactionMempool from './app/transaction-mempool';
import ExplorerTransaction from './app/explorer-transaction-#txid';

// describe app-routes-nav-subnav
export default [
  { // route only
    route: Homepage,
    path: '/'
  },
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
      }, {
        path: '/explorer?search=transaction',
        Icon: ViewListIcon,
        primary: 'Mochimo Transactions',
        secondary: 'Latest Transactions results'
      }, {
        path: '/explorer?search=blockchain',
        Icon: ViewListIcon,
        primary: 'Mochimo Blocks',
        secondary: 'Latest Blockchain results'
      }
    ]
  }, {
    route: ExplorerBlock,
    path: '/explorer/block/:bnum/:bhash'
  }, {
    route: ExplorerBlock,
    path: '/explorer/block/:bnum'
  }, { // route only
    route: ExplorerLedgerTypeAddress,
    path: '/explorer/ledger/:type/:address'
  },
  { // route path, nav item, subnav items
    route: ExplorerLedger,
    path: '/explorer/ledger',
    Icon: WalletIcon,
    nav: 'Find My Balance',
    subnav: [
      {
        path: '/explorer/ledger',
        Icon: WalletIcon,
        primary: 'Mochimo Balance Search',
        secondary: 'Search WOTS+ or Tag Balance'
      }
    ]
  }, { // route only
    route: ExplorerRichlist,
    path: '/explorer/richlist'
  }, { // route only
    route: ExplorerTransaction,
    path: '/explorer/transaction/:txid'
  } //,
  // { path: '/transaction/mempool', route: TransactionMempool, text: 'Mempool' }
];
