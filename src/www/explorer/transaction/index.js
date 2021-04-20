
import { useMochimapApi } from 'MochiMapHooks';
import { defaultTag, mcm } from 'MochiMapUtils';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Transaction () {
  const { txid } = useParams();
  const [tx] = useMochimapApi('/transaction/' + txid);

  return (
    <div className='tr_det'>
      <div className='tr_det_inn'>
        <div className='trdet_head'>
          <p>
            {tx.error && <p>{tx.data?.error || 'Error loading '}</p>}
            {tx.loading && (
              <span>
                <FontAwesomeIcon icon={faSpinner} pulse /> Loading&nbsp;
              </span>
            )}
            Transaction details
          </p>
        </div>
        <div className='trdet_main'>
          <ul className='trdet'>
            <li>
              <p>Transaction id</p>
              <p>{tx.data?.txid}</p>
            </li>
            <li>
              <p>Transaction Signature</p>
              <p>{tx.data?.txsig}</p>
            </li>
            <li>
              <p>Source Address</p>
              <p>{tx.data?.srcaddr && (
                <Link to={`/explorer/address/hash/${tx.data?.srcaddr}?page=1`}>
                  {tx.data?.srcaddr}
                </Link>)}
              </p>
            </li>
            <li className='tr_tag'>
              <p>Source Tag</p>
              <p>{tx.data?.srctag === defaultTag ? (tx.data?.srctag) : (
                <Link to={`/explorer/address/tag/${tx.data?.srctag}?p=1`}>
                  {tx.data?.srctag}
                </Link>
              )}
              </p>
            </li>
            <li>
              <p>Destination Address</p>
              <p>{tx.data?.dstaddr && (
                <Link to={`/explorer/address/hash/${tx.data?.dstaddr}?page=1`}>
                  {tx.data?.dstaddr}
                </Link>)}
              </p>
            </li>
            <li className='tr_tag'>
              <p>Destination Tag</p>
              <p>{tx.data?.dsttag === defaultTag ? (tx.data?.dsttag) : (
                <Link to={`/explorer/address/tag/${tx.data?.dsttag}?p=1`}>
                  {tx.data?.dsttag}
                </Link>
              )}
              </p>
            </li>
            <li>
              <p>Change Address</p>
              <p>{tx.data?.chgaddr && (
                <Link to={`/explorer/address/hash/${tx.data?.chgaddr}?page=1`}>
                  {tx.data?.chgaddr}
                </Link>)}
              </p>
            </li>
            <li className='tr_tag'>
              <p>Change Tag</p>
              <p>{tx.data?.chgtag === defaultTag ? (tx.data?.chgtag) : (
                <Link to={`/explorer/address/tag/${tx.data?.chgtag}?p=1`}>
                  {tx.data?.chgtag}
                </Link>
              )}
              </p>
            </li>
            <li>
              <p>Send total</p>
              <p>{tx.data?.sendtotal && mcm(tx.data.sendtotal, true)}</p>
            </li>
            <li>
              <p>Change total</p>
              <p>{tx.data?.changetotal && mcm(tx.data.changetotal, true)}</p>
            </li>
            <li>
              <p>Transaction fee</p>
              <p>{tx.data?.txfee && mcm(tx.data.txfee)}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
