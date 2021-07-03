
import { useMochimapApi } from 'MochiMapHooks';
import { isDefaultTag, mcm } from 'MochiMapUtils';
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

/*
// push simple transaction history to historyJSON~
// when src === chg; 1 of 2 simple transactions take place...
/// add from src to dst at sendtotal, if sendtotal or !changetotal
/// add from src to chg at changetotal, if changetotal
// when src !== chg; 1 OR 2 simple transactions take place...
/// add from src to dst at sendtotal, if sendtotal
/// add from src to chg at changetotal, if changetotal
const { txid, srctag, dsttag, chgtag, sendtotal, changetotal } = txe;
const src = srctag === Mochimo.DEFAULT_TAG ? txe.srcaddr : srctag;
const dst = dsttag === Mochimo.DEFAULT_TAG ? txe.dstaddr : dsttag;
const chg = chgtag === Mochimo.DEFAULT_TAG ? txe.chgaddr : chgtag;
*/

export default function TxList ({ src, srcType }) {
  const [init, setInit] = useState(true);
  const [txs, requestTxs] = useMochimapApi('/transaction/search');
  let lastDateString;

  useEffect(() => {
    if (init) {
      requestTxs(1, `${srcType}:begins=${src}`);
      setInit(false);
    }
  }, [src, srcType, requestTxs]);

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
            if (!isDefaultTag(item.srctag)) item.srcaddr = item.srctag;
            if (!isDefaultTag(item.dsttag)) item.dstaddr = item.dsttag;
            if (!isDefaultTag(item.chgtag)) item.chgaddr = item.chgtag;
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
        page={txs.data.page || 1}
        pages={txs.data.pages || 1}
        paginate={requestTxs}
        range={2}
      />
    </div>
  );
}
