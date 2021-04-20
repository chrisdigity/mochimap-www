
import { useMochimapApi, useQuery, useWindowSize } from 'MochiMapHooks';
import { mcm } from 'MochiMapUtils';
import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Pagination from '../Pagination';

const modifyQuery = (query) => {
  return query.replace(/txid=/, 'txid:begins=');
};

export default function Transactions () {
  const basePath = '/transaction/search?';
  const history = useHistory();
  const query = useQuery({ page: 1 });
  const initialRequest = basePath + modifyQuery(query.toString());
  const [txs, getTxs, setTxs] = useMochimapApi(initialRequest);
  const { width } = useWindowSize();
  const paginate = (newpage) => {
    // update current state in history
    history.replace({ search: '?' + query.toString() }, {
      json: JSON.stringify(txs.data),
      scroll: document.body.scrollTop
    });
    // delete current results
    if (txs.data?.results?.length) txs.data.results.length = 0;
    // update 'page' search parameter
    query.set('page', newpage);
    // push a new history path
    history.push({ search: '?' + query.toString() });
    // request new search results
    getTxs(basePath + modifyQuery(query.toString()));
    // smooth scroll back to the top for new results
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  };
  useEffect(() => {
    // detect back button
    window.onpopstate = (e) => {
      try {
        const state = e?.state?.state;
        // apply data from popped state or refresh page
        if (state?.json) setTxs(JSON.parse(state.json));
        else window.location.reload();
        // instant scroll to previous state scrollTop
        if (state?.scroll) document.body.scrollTo({ top: state.scroll });
      } catch (error) { console.error(error); }
    };
  });

  return (
    <div className='et'>
      <div className='et_inn'>
        <div className='et_header'>
          <div className='et_h1'>
            {width > 500 ? (
              <p>
                Explorer <span>⇢ </span> Transaction history
              </p>
            ) : (
              <p>Transaction history</p>
            )}
          </div>
          <div>ϟ</div>
        </div>
        <ul className='et_list'>
          <li>
            <p>Transaction id</p>
          </li>
          <li>
            <p>Source address</p>
          </li>
          <li>
            <p>Destination address</p>
          </li>
          <li>
            <p>Send total</p>
          </li>
          {width > 500 && (
            <li>
              <p>Change total</p>
            </li>
          )}
          {width > 760 && (
            <li>
              <p>Tx fee</p>
            </li>
          )}
        </ul>
        {txs.error && (
          <ul className='et_list et_list_main'>
            <li style={{ width: '100%', justifyContent: 'center' }}>
              {txs?.data?.error || 'Unknown error loading results...'}
            </li>
          </ul>
        )}
        {txs.loading && (
          <ul className='et_list et_list_main'>
            <li style={{ width: '100%', justifyContent: 'center' }}>
              Loading results...
            </li>
          </ul>
        )}
        {txs.data?.results?.map((item, index) => {
          return (
            <ul className='et_list et_list_main' key={index}>
              <li className='tr_id'>
                <p>
                  <Link to={`/explorer/transaction/${item.txid}`}>
                    {item.txid}
                  </Link>
                </p>
              </li>
              <li>
                <p>{item.srcaddr}</p>
              </li>
              <li>
                <p>{item.dstaddr}</p>
              </li>
              <li>
                <p>{mcm(item.sendtotal)}</p>
              </li>
              {width > 500 && (
                <li>
                  <p>{mcm(item.changetotal)}</p>
                </li>
              )}
              {width > 760 && (
                <li>
                  <p>{mcm(item.txfee)}</p>
                </li>
              )}
            </ul>
          );
        })}
        <Pagination
          page={query.get('page') || 1}
          pages={txs.data?.pages || 1}
          paginate={paginate}
        />
      </div>
    </div>
  );
}
