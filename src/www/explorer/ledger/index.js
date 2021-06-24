
import { useMochimapApi } from 'MochiMapHooks';
import { isDefaultTag, mcm } from 'MochiMapUtils';
import { useEffect, useCallback, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../Pagination';

function Loading ({ message, inline }) {
  const content = (
    <span>
      <FontAwesomeIcon icon={faSpinner} pulse />
      {message ? ` Loading ${message}...` : ''}
    </span>
  );

  return inline ? content : (
    <div className='loading'>{content}</div>
  );
}

function Error ({ message, inline }) {
  const content = (
    <span>
      <FontAwesomeIcon icon={faExclamationTriangle} />
      {message ? ` Error ${message}...` : ''}
    </span>
  );

  return inline ? content : (
    <div className='error'>{content}</div>
  );
}

function QRCode () {
  return '...QR Code not enabled at this time...';
}

function Transaction ({ txe, addr, dim }) {
  console.log(addr);
  // transaction entry -> simple transaction, split logic
  // when ref === src and src === chg; 1 of 2 simple transactions take place...
  /// add from src to dst at sendtotal, if sendtotal or !changetotal
  /// add from src to chg at changetotal, if changetotal
  // when src !== chg; 1 OR 2 simple transactions take place...
  /// add from src to dst at sendtotal, if sendtotal
  /// add from src to chg at changetotal, if changetotal
  const dateUTC = new Date(txe.stime * 1000);
  const tzOffset = (new Date()).getTimezoneOffset() * 60 * 1000;
  const date = new Date(dateUTC - tzOffset);
  const dateString = !isNaN(date) && date.toISOString().replace(/:\d{2}\..*$/, '');
  const srcType = isDefaultTag(txe.srctag) ? 'ω+' : 'τ-';
  const dstType = isDefaultTag(txe.dsttag) ? 'ω+' : 'τ-';
  const chgType = isDefaultTag(txe.chgtag) ? 'ω+' : 'τ-';
  const src = isDefaultTag(txe.srctag) ? txe.srcaddr : txe.srctag;
  const dst = isDefaultTag(txe.dsttag) ? txe.dstaddr : txe.dsttag;
  const chg = isDefaultTag(txe.chgtag) ? txe.chgaddr : txe.chgtag;
  const { txid, sendtotal, changetotal } = txe;
  const transactions = [];
  if (addr === src && src === chg) {
    if (sendtotal || !changetotal) {
      transactions.push({ addr: dstType + dst, amount: -(txe.sendtotal) });
    } else {
      transactions.push({ addr: chgType + chg, amount: -(txe.changetotal) });
    }
  } else {
    if ((sendtotal && addr !== chg) || addr === dst) {
      if (addr === src) {
        transactions.push({ addr: dstType + dst, amount: -(txe.sendtotal) });
      } else {
        transactions.push({ addr: srcType + src, amount: txe.sendtotal });
      }
    }
    if ((changetotal && addr !== dst) || addr === chg) {
      if (addr === src) {
        transactions.push({ addr: chgType + chg, amount: -(txe.changetotal) });
      } else {
        transactions.push({ addr: srcType + src, amount: txe.changetotal });
      }
    }
  }
  return transactions.map((item, index) => {
    return (
      <Link
        key={index}
        to={'/explorer/transaction/' + txid}
        className={'history transaction' + (dim ? ' dull' : '')}
      >
        <div className='text-ellipses'>{item.addr}</div>
        <div>{dateString}</div>
        <div>{txe.bnum}</div>
        <div>{mcm(item.amount)}</div>
      </Link>
    );
  });
}

function TransactionHistory ({ type, address, aeon, header }) {
  const [init, setInit] = useState(true);
  const [history, requestHistory] = useMochimapApi('/transaction/search');
  const dim = history.loading;

  useEffect(() => {
    if (init) {
      let queryLimits;
      if (aeon) {
        const upper = aeon << 8;
        const lower = upper - 256;
        queryLimits = `bnum:lt=${upper}&bnum:gt=${lower}&`;
      }
      if (type === 'address') address = address.slice(0, 64);
      requestHistory(1, `${queryLimits || ''}${type}=${address}`);
    }
  }, [init, setInit]);

  return (
    <>
      {header && history.data.results?.length ? (
        <div className={'history header' + (dim ? ' dim' : '')}>
          <div><span>Address</span></div>
          <div><span>Date-Time</span></div>
          <div><span>Height</span></div>
          <div><span>Amount</span></div>
        </div>
      ) : ''}
      {history.data.results?.map((txe, index) => {
        return <Transaction key={index} txe={txe} addr={address} dim={dim} />;
      })}
      {(history.loading && <Loading message='transaction history' />) ||
        (history.error && <Error message={history.data.error} />)}
      {history.data.results && (
        <Pagination
          title='Transaction History'
          page={history.page}
          pages={history.data?.pages || 1}
          paginate={(p) => { requestHistory(p); }}
          range={3}
        />
      )}
    </>
  ) || null;
}

function Balance ({ type, data, count }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => {
    if (open) count(-1);
    else count(1);
    setOpen(!open);
  }, [open, count]);
  const aeon = data.bnum >> 8;
  let dateString;
  if (typeof data.timestamp === 'undefined') dateString = 'UnknownÆ';
  else if (data.timestamp < 0) dateString = 'InProgressÆ';
  else {
    const dateUTC = new Date(data.timestamp * 1000);
    const tzOffset = (new Date()).getTimezoneOffset() * 60 * 1000;
    const date = new Date(dateUTC - tzOffset);
    dateString = date.toISOString().replace(/T.*$/, 'Æ');
  }
  dateString += aeon;

  return (
    <>
      <div className='history balance' onClick={toggle}>
        <div>{mcm(data.balance)}</div>
        <div>{dateString}</div>
        <div>{data.timestamp > 0 ? data.bnum : '----'}</div>
        <div>{data.delta > 0 && '+'}{mcm(data.delta, true, 1)}</div>
      </div>
      {(open && (
        <TransactionHistory type={type} address={data[type]} aeon={aeon} />
      ))}
    </>
  );
}

function BalanceHistory ({ type, data }) {
  const [init, setInit] = useState(true);
  const [nOpen, setNOpen] = useState(0);
  const [history, requestHistory] = useMochimapApi('/ledger/search');
  const count = useCallback((delta) => setNOpen(nOpen + delta), [nOpen]);
  const addCurrentAeon = useCallback((response) => {
    const results = response.data.results;
    if (results) {
      // prepend current Aeon data if necessary
      if (response.page === 1) {
        const first = results[0];
        const address = data.address?.slice(0, 64) || undefined;
        const addressHash = data.addressHash;
        const tag = data.tag;
        const balance = data.balance;
        const delta = balance - (first?.balance || 0);
        const timestamp = -1;
        const bnum = (first?.bnum || 0) + 256;
        if (delta) {
          results.unshift(
            { address, addressHash, tag, balance, delta, timestamp, bnum }
          );
        }
      }
    }
  }, [history, data]);

  // response handlers
  useEffect(() => addCurrentAeon(history), [history, addCurrentAeon]);
  useEffect(() => { // initial balance history request, once ledger available
    const historyType = type !== 'tag' ? 'addressHash' : 'tag';
    if (init && data[historyType]) {
      requestHistory(1, `${historyType}=${data[historyType]}`);
      setInit(false);
    }
  }, [init, setInit, history, requestHistory]);

  return (
    (history.loading && <Loading message='balance history' />) ||
    (history.error && <Error message={history.data.error} />) ||
    (history.data.results && (
      <>
        <div className='history header'>
          <div>
            <span>NG-Balance</span>
            {nOpen > 0 && <sup>(address)</sup>}
          </div>
          <div>
            <span>Date-Aeon(NG)</span>
            {nOpen > 0 && <sup>(date-time)</sup>}
          </div>
          <div>
            <span>Height</span>
          </div>
          <div>
            <span>NG-Delta</span>
            {nOpen > 0 && <sup>(amount)</sup>}
          </div>
        </div>
        {(history.data.results.map((item, index) => {
          return <Balance key={index} type={type} data={item} count={count} />;
        }))}
        <Pagination
          title='Balance History'
          page={history.page}
          pages={history.data?.pages || 1}
          paginate={(p) => { requestHistory(p); }}
          range={3}
        />
      </>
    ))
  ) || null;
}

export default function Ledger () {
  const { type, address } = useParams();
  const [info, setInfo] = useState('balance');
  const [init, setInit] = useState(true);
  const [ledger, requestLedger] = useMochimapApi(`/ledger/${type}/${address}`);
  const cleanAddress = () => (ledger.data[type] || address).slice(0, 64);

  useEffect(() => {
    if (init) {
      requestLedger();
      setInit(false);
    } else if (ledger.error) ledger.data[type] = address;
  }, [init, setInit, ledger, requestLedger]);

  return (
    <div className='ledger'>
      {type === 'address' && address.length < 64 && ledger.data.address && (
        <Redirect to={`/explorer/ledger/${type}/${cleanAddress()}`} />
      )}
      {type === 'tag' && address.length < 24 && ledger.data.tag &&
      !isDefaultTag(ledger.data.tag) && (
        <Redirect to={`/explorer/ledger/${type}/${ledger.data.tag}`} />
      )}
      <div className='addresses'>
        <span className='dull'>τ<span className='tiny'>ag: </span></span>
        {(!isDefaultTag(ledger.data?.tag) && ledger.data?.tag) || '----'}
        <span className='h-sep' />
        <span className='dull'>ω<span className='tiny'>ots: </span></span>
        {((ledger.error || ledger.loading) && '----') || ledger.data?.address}
      </div>
      <div className='balance'>
        {(ledger.loading && <Loading />) || (
          mcm(ledger.data.balance || 0, true, 1, 0)
        )}
      </div>
      <div className='available v-sep'>
        <span className='dull'>A<span className='tiny'>vailable: </span></span>
        {(ledger.error && <Error message={ledger.data.message} inline />) || (
          ledger.loading && <Loading inline />
        ) || mcm(ledger.data.balance || 0, 9, 0)}
      </div>
      <div className='history-selection'>
        <div
          onClick={() => setInfo('qrcode')}
          className={info === 'qrcode' ? 'selected' : ''}
        >QR code
        </div>
        <div className='h-sep' />
        <div
          onClick={() => setInfo('balance')}
          className={(info === 'balance' ? 'selected' : '')}
        >Ledger History
        </div>
        <div className='h-sep' />
        <div
          onClick={() => setInfo('transaction')}
          className={info === 'transaction' ? 'selected' : ''}
        >Transaction History
        </div>
      </div>
      <div className='history-container v-sep'>
        {(info === 'qrcode' && (
          <QRCode />
        )) || (info === 'balance' && (
          <BalanceHistory type={type} data={ledger.data} />
        )) || (info === 'transaction' && (
          <TransactionHistory type={type} address={cleanAddress()} header />
        ))}
      </div>
    </div>
  );
}
