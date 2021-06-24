
import { useMochimapApi } from 'MochiMapHooks';
import { capitalize, isDefaultTag, mcm, preBytes } from 'MochiMapUtils';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Pagination from '../Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const DateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

function Transactions ({ src, srcType }) {
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
          const showDate = Boolean(dateString !== lastDateString);
          if (showDate) lastDateString = dateString;
          if (srcType === '_id') {
            if (!isDefaultTag(item.srctag)) item.srcaddr = item.srctag;
            if (!isDefaultTag(item.dsttag)) item.dstaddr = item.dsttag;
            if (!isDefaultTag(item.chgtag)) item.chgaddr = item.chgtag;
            return (
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
            );
          }
        })}
      </div>
      <Pagination
        page={txs.page || 1}
        pages={txs.data.pages || 1}
        paginate={requestTxs}
        range={2}
      />
    </div>
  );
}

export default function Block () {
  const { bnum } = useParams();
  const [init, setInit] = useState(true);
  const [block, requestBlock] = useMochimapApi('/block/' + bnum);

  useEffect(() => {
    if (init) {
      requestBlock();
      setInit(false);
    }
  }, [init, setInit]);
  return (
    <div className='b_det'>
      <div className='b_det_inn'>
        <div className='bdet_head'>
          {block.error && (
            <p>{block.data?.error || 'Error loading block ' + bnum}</p>
          )}
          {block.loading && (
            <p>
              <FontAwesomeIcon icon={faSpinner} pulse /> Loading Block Details
            </p>
          )}
          {block.data?.type && (
            <p>
              {capitalize(block.data.type)}
              {block.data.type === 'pseudo' ? 'block' : ' Block'} #
              {block.data.bnum}&nbsp;
              <sup>(0x{block.data.bnum.toString(16)})</sup>
            </p>
          )}
        </div>
        <div className='bdet_main'>
          <ul className='bdet'>
            <li>
              <p>Prev. Hash</p>
              <p>{block?.data?.phash}</p>
            </li>
            <li>
              <p>Hash</p>
              <p>{block?.data?.bhash}</p>
            </li>
            {block.data?.type === 'normal' && (
              <>
                <li>
                  <p>Merkle</p>
                  <p>{block?.data?.mroot}</p>
                </li>
                <li>
                  <p>Nonce</p>
                  <p>{block?.data?.nonce}</p>
                </li>
              </>
            )}
            {block.data?.type === 'normal' && (
              <>
                <li>
                  <p>Miner</p>
                  <p>
                    {block?.data?.maddr && (
                      <Link
                        to={'/explorer/ledger/address/' + block.data.maddr}
                      >
                        {block.data.maddr}
                      </Link>
                    )}
                  </p>
                </li>
                <li>
                  <p>Reward</p>
                  <p>{block.data?.mreward && mcm(block.data.mreward, 9)}</p>
                </li>
                <li>
                  <p>Mining fee</p>
                  <p>{block.data?.mfee && mcm(block.data.mfee)}</p>
                </li>
              </>
            )}
            <li>
              <p>Difficulty</p>
              <p>{block.data?.difficulty}</p>
            </li>
            {block.data?.type === 'normal' && (
              <li>
                <p>Transactions</p>
                <p>{block.data?.tcount}</p>
              </li>
            )}
            {block.data?.type === 'neogenesis' && (
              <li>
                <p>Addresses</p>
                <p>{block.data?.lcount}</p>
              </li>
            )}
            <li>
              <p>Block Size</p>
              {block.data?.size && <p>{preBytes(block.data.size)}</p>}
            </li>
            {block.data?.type === 'normal' && (
              <li>
                <p>Sent Amount</p>
                <p>
                  {block.data?.amount !== undefined &&
                    mcm(block.data.amount, true)}
                </p>
              </li>
            )}
            {block.data?.type === 'neogenesis' && (
              <li>
                <p>Ledger Amount</p>
                <p>~{block.data?.amount && mcm(block.data.amount, 9)}</p>
              </li>
            )}
          </ul>
          {block.data?._id && (
            <Transactions src={block.data?._id} srcType='_id' />
          )}
        </div>
      </div>
    </div>
  );
}
