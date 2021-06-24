
import { useWindowSize, useMochimapApi } from 'MochiMapHooks';
import { useEffect, useState } from 'react';
import { preBytes, mcm } from 'MochiMapUtils';
import { Link } from 'react-router-dom';
import Searchpage from './Searchpage';
import Moment from 'moment';
Moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'secs',
    ss: '%ds',
    m: '~1 min',
    mm: '%dm',
    h: '~1hr',
    hh: '%dhr',
    d: 'a day',
    dd: '%dd',
    w: 'a week',
    ww: '%dw',
    M: 'a month',
    MM: '%dM',
    y: 'a year',
    yy: '%dYr'
  }
});

export default function Explorer () {
  const { width } = useWindowSize();
  const [init, setInit] = useState(true);
  const [block, requestBlock] = useMochimapApi('/block/search');
  const [tx, requestTx] = useMochimapApi('/transaction/search');

  useEffect(() => {
    if (init) {
      requestBlock(1);
      requestTx(1);
      setInit(false);
    }
  }, [init, setInit, requestBlock, requestTx]);

  return (
    <div className='home'>
      <div className='search_sect'>
        <Searchpage />
      </div>
      <div className='brief_list'>
        <div className='brief_list_header'>
          <div className='left_tag'>
            <p>{width > 500 && 'Latest'} Blockchain Activity</p>
          </div>
          <div className='present_height'>
            <img src='./icons/block5.svg' alt='block' />
            {width > 500 && <p> Height:</p>}
            {block.error && <div>&lt;error&gt;</div>}
            {block.loading && <div>&lt;loading&gt;</div>}
            {block.data?.results?.[0] && <p>{block.data.results[0].bnum}</p>}
          </div>
        </div>

        <div className='brief_list_inn'>
          <div className='blocks'>
            <div className='block_header'>
              <div className='header_sect1'>
                <p>Recent Blocks</p>
                <p>Most recent blocks</p>
              </div>
              <div className='view_all'>
                <Link to='/explorer/block/search?page=1'>
                  View all&nbsp;&nbsp;⇢
                </Link>
              </div>
            </div>
            <ul className='blocks_list'>
              <li className='height'>Height</li>
              {width > 385 && <li className='time'>Time</li>}
              {width > 385 && <li className='time'>Txs</li>}
              {width > 500 && <li className='size'>Size</li>}
              <li className='amount'>Amount</li>
            </ul>
            {block.error && <ul className='blocks_list'>Error</ul>}
            {block.loading && <ul className='blocks_list'>Loading...</ul>}
            {block.data?.results?.slice(0, 8).map((b, index) => {
              return (
                <ul className='blocks_list' key={index}>
                  <li className='height'>{b.bnum}</li>
                  {width > 385 &&
                    <li className='time'>
                      {Moment.unix(b.stime).fromNow()}
                    </li>}

                  {width > 385 && (
                    <li className='tcount'>
                      {b.type === 'pseudo'
                        ? '-' : (b.tcount || b.lcount || 0).toLocaleString()}
                    </li>
                  )}
                  {width > 500 && <li className='size'>{preBytes(b.size)}</li>}
                  <li className='amount'>
                    {b.type === 'pseudo' ? '-' : mcm(b.amount)}
                  </li>
                </ul>
              );
            })}
          </div>
          <div className='transactions'>
            <div className='trans_header'>
              <div className='header_sect1'>
                <p>Latest Transactions</p>
                <p>Most recent transaction</p>
              </div>
              <div className='view_all'>
                <Link to='/explorer/transaction/search?page=1'>
                  View all&nbsp;&nbsp;⇢
                </Link>
              </div>
            </div>
            <ul className='trans_list'>
              <li className='height'>Height</li>
              <li className='txid'>Txid</li>
              <li className='time'>Send Total</li>
            </ul>
            {tx.data?.results?.slice(0, 8).map((tx, index) => {
              return (
                <ul className='trans_list' key={index}>
                  <li className='height'>{tx.bnum}</li>
                  <li className='txid'>
                    <p>{tx.txid}</p>
                  </li>
                  <li className='time'>{mcm(tx.sendtotal)}</li>
                </ul>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
