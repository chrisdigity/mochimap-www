
import { useMochimapApi } from 'MochiMapHooks';
import { capitalize, mcm, preBytes } from 'MochiMapUtils';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Pagination from '../Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Block () {
  const txPerPage = 8;
  const { bnum } = useParams();
  const [block] = useMochimapApi('/block/' + bnum);
  const [txStart, setTxStart] = useState(0);
  const [txEnd, setTxEnd] = useState(0);
  const [page, setPage] = useState(1);
  const paginate = (npage) => {
    const end = npage * txPerPage;
    setTxStart(end - txPerPage);
    setTxEnd(end);
    setPage(npage);
  };
  useEffect(() => paginate(1), [block.data]);

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
            {block.data?.type === 'normal' && (
              <>
                <li>
                  <p>Miner</p>
                  <p>{block?.data?.maddr}</p>
                </li>
                <li>
                  <p>Reward</p>
                  <p>{block.data?.mreward && mcm(block.data.mreward, true)}</p>
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
                <p>~{block.data?.amount && mcm(block.data.amount)}</p>
              </li>
            )}
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
          </ul>
          <ul className='bdet_trans'>
            <div className='bdet_trans_head'>
              <p>Block transactions</p>
            </div>
            <ul className='bdet_list_items'>
              {block.loading ? (
                <span>
                  <FontAwesomeIcon icon={faSpinner} pulse /> Loading...
                </span>
              ) : !block.data?.txids?.length && (
                'ϟ No Transactions...'
              )}
              {block.data?.txids?.length &&
                block.data.txids.slice(txStart, txEnd).map((item, index) => (
                  <Link to={'/explorer/transaction/' + item} key={index}>
                    <li>
                      ϟ&nbsp;
                      <p>{item}</p>
                    </li>
                  </Link>
                ))}
            </ul>
            <Pagination
              page={page}
              pages={block.data?.txids?.length
                ? Math.ceil(block.data.txids.length / txPerPage) : 1}
              paginate={paginate}
              range={2}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}
