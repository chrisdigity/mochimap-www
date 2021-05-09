
import { useMochimapApi } from 'MochiMapHooks';
import { defaultTag, mcm } from 'MochiMapUtils';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from './Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const DateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};
const TimeOptions = {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit'
};

export default function TxList ({ src, srcType }) {
  const [page, setPage] = useState(1);
  const [txs, reqTxs] = useMochimapApi();
  let lastDateString;

  useEffect(() => {
    return srcType === '_id'
      ? reqTxs(`/transaction/search?${srcType}:begins=${src}&page=${page}`)
      : reqTxs(`/history/${src}?page=${page}`);
  }, [page, src, srcType, reqTxs]);

  return (
    <div className='bdet_trans'>
      <div className='bdet_list_items'>
        {srcType === '_id' && <p>Block Transactions</p>}
        {(txs.loading && (
          <div>
            <FontAwesomeIcon icon={faSpinner} pulse />
            <span> Loading transactions...</span>
          </div>
        )) || (!txs.data?.results?.length && (
          <div>ϟ No transactions...</div>
        ))}
        {txs.data?.results?.map((item, index) => {
          const date = item.timestamp ? new Date(item.timestamp * 1000) : null;
          const dateString = date?.toLocaleDateString(undefined, DateOptions) ||
            'Unknown Date';
          const timeString = date?.toLocaleTimeString(undefined, TimeOptions) ||
            '--:--';
          const showDate = Boolean(dateString !== lastDateString);
          if (showDate) lastDateString = dateString;
          if (srcType === '_id') {
            if (item.srctag !== defaultTag) item.srcaddr = item.srctag;
            if (item.dsttag !== defaultTag) item.dstaddr = item.dsttag;
            if (item.chgtag !== defaultTag) item.chgaddr = item.chgtag;
            return (
              <>
                <Link to={'/explorer/transaction/' + item.txid} key={index}>
                  <ul className='bdet_list_txe'>
                    <li className='txid'>ϟ {item.txid}</li>
                    <li className='src'>
                      {item.srcaddr === item.srctag ? 'τ-' : 'ω+'}{item.srcaddr}
                    </li>
                    <li className='arrow'>➟</li>
                    <li className='chg'>
                      {item.chgaddr === item.chgtag ? 'τ-' : 'ω+'}{item.chgaddr}
                    </li>
                    <li className='amount'>{mcm(item.changetotal)}</li>
                    <li className='dst'>&nbsp;⤷&nbsp;
                      {item.dstaddr === item.dsttag ? 'τ-' : 'ω+'}{item.dstaddr}
                    </li>
                    <li className='amount'>{mcm(item.sendtotal)}</li>
                  </ul>
                </Link>
              </>
            );
          } else {
            return (
              <>
                {showDate && <p key={index + '~'}>{dateString}</p>}
                {(item._id.endsWith('mreward') && (
                  <Link to={'/explorer/block/' + item.bnum} key={index}>
                    <ul className='bdet_list_txe'>
                      <li className='time'>{timeString}</li>
                      <li className='src'>
                        {item._id
                          .replace(/^0*/g, '0x')
                          .replace(/-mreward$/i, '')
                          .replace(/-/i, '.')}
                      </li>
                      <li className='arrow in'>⚒Mined</li>
                      <li className='amount'>{mcm(item.amount)}</li>
                    </ul>
                  </Link>
                )) || (
                  <Link to={'/explorer/transaction/' + item.txid} key={index}>
                    <ul className='bdet_list_txe'>
                      <li className='time'>{timeString}</li>
                      {(src === item.to && (
                        <>
                          <li className='src'>
                            {item.from.length === 24 ? 'τ-' : 'ω+'}{item.from}
                          </li>
                          <li className='in'>⭹Recv</li>
                          <li className='amount'>{mcm(item.amount)}</li>
                        </>
                      )) || (
                        <>
                          <li className='src'>
                            {item.to.length === 24 ? 'τ-' : 'ω+'}{item.to}
                          </li>
                          <li className='out'>⭧Sent</li>
                          <li className='amount'>{mcm(item.amount)}</li>
                        </>
                      )}
                    </ul>
                  </Link>
                )}
              </>
            );
          }
        })}
      </div>
      <Pagination
        page={page || 1}
        pages={txs.data?.pages || 1}
        paginate={(p) => { setPage(p); delete txs.data.results; }}
        range={2}
      />
    </div>
  );
}
