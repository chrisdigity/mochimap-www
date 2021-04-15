import Home from './www/index';
import Explorer from './www/explorer/index';
import Block from './www/explorer/block';
import SearchBlocks from './www/explorer/block/search';
import Transaction from './www/explorer/transaction';
import SearchTransactions from './www/explorer/transaction/search';

export default [
  { path: '/', route: Home },
  { path: '/haiku', route: undefined, text: 'Haiku' },
  { path: '/explorer', route: Explorer, text: 'Explorer' },
  { path: '/explorer/block/:bnum', route: Block },
  { path: '/explorer/transaction/:txid', route: Transaction },
  { path: '/explorer/search/blocks', route: SearchBlocks },
  { path: '/explorer/search/transactions', route: SearchTransactions },
  { path: '/about', text: 'What is Mochimo?' }
];
