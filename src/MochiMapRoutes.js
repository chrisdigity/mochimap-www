import Home from './www/index';
import Explorer from './www/explorer/index';
import Block from './www/explorer/block/index';
import BlockSearch from './www/explorer/block/search';
import Transaction from './www/explorer/transaction';
import TransactionSearch from './www/explorer/transaction/search';

export const RouteList = [
  { path: '/haiku', route: undefined, text: 'Haiku' },
  { path: '/explorer/transaction/search', route: TransactionSearch },
  { path: '/explorer/transaction/:txid', route: Transaction },
  { path: '/explorer/block/search', route: BlockSearch },
  { path: '/explorer/block/:bnum', route: Block },
  { path: '/explorer', route: Explorer, text: 'Explorer' },
  { path: '/about', text: 'What is Mochimo?' },
  { path: '/', route: Home }
];
