
import { useMochimapApi } from 'MochiMapHooks';
import { mcm } from 'MochiMapUtils';
import { useParams } from 'react-router-dom';
import TxList from '../TxList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Address () {
  const { type, address } = useParams();
  const [ledger] = useMochimapApi(`/balance/${type}/${address}`);

  return (
    <>
      <div className='b_det'>
        <div className='b_det_inn'>
          <div className='bdet_head'>
            <p>
              {ledger.loading && (
                <span><FontAwesomeIcon icon={faSpinner} pulse /> Loading </span>
              )}
              {type === 'tag' && <span>Tagged </span>}
              Ledger Address{ledger.error && (
                <span> Error: {ledger.data?.error || 'Unknown Error'}</span>
              )}
            </p>
          </div>
          <div className='bdet_main'>
            <ul className='bdet'>
              <li>
                <p>Address</p>
                <p>{ledger.data?.address}</p>
              </li>
              <li>
                <p>Tag</p>
                <p>{ledger.data?.tag}</p>
              </li>
              <li>
                <p>Balance</p>
                <p>{mcm(ledger.data?.balance, 9, 0)}</p>
              </li>
            </ul>
            <TxList src={address} srcType={type} />
          </div>
        </div>
      </div>
    </>
  );
}
