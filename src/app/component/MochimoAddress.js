
import { Link } from 'react-router-dom';

const isUntagged = (addr) => ['00', '42'].includes(addr.slice(0, 2));

export default function MochimoAddress ({ pre, tag, addr, disableLinks }) {
  return (
    <>
      {pre || ''}
      {!tag || isUntagged(tag) ? null : disableLinks ? `τ-${tag}` : (
        <Link to={`/explorer/ledger/tag/${tag}`}>τ-{tag}</Link>
      )}
      {tag && !isUntagged(tag) && addr ? <span> • </span> : null}
      {!addr ? null : disableLinks ? `ω+${addr}` : (
        <Link to={`/explorer/ledger/address/${addr}`}>ω+{addr}</Link>
      )}
    </>
  );
}
