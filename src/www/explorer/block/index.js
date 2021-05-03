
import { useMochimapApi } from 'MochiMapHooks';
import { capitalize, mcm, preBytes } from 'MochiMapUtils';
import { useParams } from 'react-router-dom';
import TxList from '../TxList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Block () {
  const { bnum } = useParams();
  const [block] = useMochimapApi('/block/' + bnum);

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
                  <p>{block?.data?.maddr}</p>
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
          <TxList src={block.data?._id} srcType='_id' />
        </div>
      </div>
    </div>
  );
}
