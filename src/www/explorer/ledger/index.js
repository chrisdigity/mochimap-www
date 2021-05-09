
import { useMochimapApi } from 'MochiMapHooks';
import { defaultTag, mcm } from 'MochiMapUtils';
import { Redirect, useParams } from 'react-router-dom';
import TxList from '../TxList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Ledger () {
  const { type, address } = useParams();
  const [ledger] = useMochimapApi(`/balance/${type}/${address}`);

  return (
    <>
      {type === 'address' && address.length < 64 && ledger.data?.address && (
        <Redirect
          to={`/explorer/ledger/${type}/${ledger.data.address.slice(0, 64)}`}
        />
      )}
      {type === 'tag' && address.length < 24 && ledger.data?.tag &&
      ledger.data?.tag !== defaultTag && (
        <Redirect to={`/explorer/ledger/${type}/${ledger.data.tag}`} />
      )}
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
                <p>
                  {ledger.data?.address ||
                    (type === 'address' ? address : 'unknown')}
                </p>
              </li>
              <li>
                <p>Tag</p>
                <p>
                  {ledger.data?.tag ||
                    (type === 'tag' ? address : 'unknown')}
                </p>
              </li>
              <li>
                <p>Balance</p>
                <p>{mcm(ledger.data?.balance || 0, 9, 0)}</p>
              </li>
            </ul>
            <TxList src={address} srcType={type} />
          </div>
        </div>
      </div>
    </>
  );
}
