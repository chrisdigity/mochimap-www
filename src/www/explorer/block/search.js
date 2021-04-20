
import { useMochimapApi, useQuery, useWindowSize } from 'MochiMapHooks';
import { mcm, preBytes } from 'MochiMapUtils';
import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Moment from 'moment';
import Pagination from '../Pagination';

export default function Blocks () {
  const basePath = '/block/search?';
  const history = useHistory();
  const query = useQuery({ page: 1 });
  const initialRequest = basePath + query.toString();
  const [blocks, getBlocks, setBlocks] = useMochimapApi(initialRequest);
  const { width } = useWindowSize();
  const paginate = (newpage) => {
    // update current state in history
    history.replace({ search: '?' + query.toString() }, {
      json: JSON.stringify(blocks.data),
      scroll: document.body.scrollTop
    });
    // delete current results
    if (blocks.data?.results?.length) blocks.data.results.length = 0;
    // update 'page' search parameter
    query.set('page', newpage);
    // push a new history path
    history.push({ search: '?' + query.toString() });
    // request new search results
    getBlocks(basePath + query.toString());
    // smooth scroll back to the top for new results
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  };
  useEffect(() => {
    // detect back button
    window.onpopstate = (e) => {
      try {
        const state = e?.state?.state;
        // apply data from popped state or refresh page
        if (state?.json) setBlocks(JSON.parse(state.json));
        else window.location.reload();
        // instant scroll to previous state scrollTop
        if (state?.scroll) document.body.scrollTo({ top: state.scroll });
      } catch (error) { console.error(error); }
    };
  });

  return (
    <div className='eb'>
      <div className='eb_inn'>
        <div className='eb_header'>
          <div className='eb_h1'>
            {width > 500 ? (
              <p>
                Explorer <span>⇢ </span> Block history
              </p>
            ) : (
              <p>Block history</p>
            )}
          </div>
          <div>❒</div>
        </div>
        <ul className='eb_list'>
          <li><div className='miner_img'><div className='m_img' /></div></li>
          <li>
            <p>Block id</p>
          </li>
          {width > 500 && (
            <li className='height'>
              <p>Height</p>
            </li>
          )}
          {width > 570 && (
            <li className='difficulty'>
              <p>Diff</p>
            </li>
          )}
          <li>
            <p>Txs</p>
          </li>
          {width > 730 && (
            <li className='time'>
              <p>Time</p>
            </li>
          )}
          {width > 1125 && (
            <li className='size'>
              <p>Block size</p>
            </li>
          )}
          {width > 570 && (
            <li className='amount'>
              <p>Amount</p>
            </li>
          )}
        </ul>
        {blocks.error && (
          <ul className='eb_list eb_list_main'>
            <li />
            <li style={{ width: '100%', justifyContent: 'center' }}>
              {blocks?.data?.error || 'Unknown error loading results...'}
            </li>
          </ul>
        )}
        {blocks.loading && (
          <ul className='eb_list eb_list_main'>
            <li />
            <li style={{ width: '100%', justifyContent: 'center' }}>
              Loading results...
            </li>
          </ul>
        )}
        {blocks.data?.results?.map((item, index) => {
          return (
            <ul className='eb_list eb_list_main' key={index}>
              <li className=''>
                <div className='miner_img'>
                  <div
                    className='m_img'
                    style={{ backgroundImage: `url(${item.img?.thumb})` }}
                  />
                </div>
              </li>
              <li className='block_id'>
                <Link to={`/explorer/block/${item.bnum}`}>
                  <p>{item._id.replace(/^0+/, '0x')}</p>
                </Link>
              </li>
              {width > 500 && (
                <li className='height'>
                  <p>{item.bnum}</p>
                </li>
              )}
              {width > 570 && (
                <li className='difficulty'>
                  <p>{item.difficulty}</p>
                </li>
              )}
              <li>
                <p>{item?.tcount || '-'}</p>
              </li>
              {width > 730 && (
                <li className='time'>
                  <p>{Moment.unix(item.stime).fromNow()}</p>
                </li>
              )}
              {width > 1125 && (
                <li className='size'>
                  <p>{preBytes(item.size)}</p>
                </li>
              )}
              {width > 570 && (
                <li className='amount'>
                  <p title={item.type !== 'pseudo'
                    ? mcm(item.amount, 0, 1) : undefined}
                  >
                    {item.type === 'pseudo' ? '-' : mcm(item.amount)}
                  </p>
                </li>
              )}
            </ul>
          );
        })}
        <Pagination
          page={query.get('page') || 1}
          pages={blocks.data?.pages || 1}
          paginate={paginate}
        />
      </div>
    </div>
  );
}
