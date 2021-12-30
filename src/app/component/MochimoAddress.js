
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { isUntagged } from 'utils';

const preTag = (
  <Typography component='span' display='inline' color='textSecondary'>
    τag:&nbsp;
  </Typography>
);
const preAddress = (
  <Typography component='span' display='inline' color='textSecondary'>
    ωots:&nbsp;
  </Typography>
);

export default function MochimoAddress (props) {
  const { pre, tag, addr, short, disableLinks } = props;
  let displayAddress = null;
  let displayTag = null;

  if (tag && !isUntagged(tag)) {
    if (short) displayAddress = null;
    if (disableLinks) displayTag = tag;
    else displayTag = (<Link to={`/explorer/ledger/tag/${tag}`}>{tag}</Link>);
  } else if (addr) {
    displayAddress = `${addr}`;
    if (short) displayAddress = `${displayAddress.slice(0, 24)}...`;
    if (addr && !disableLinks) {
      displayAddress = (
        <Link to={`/explorer/ledger/address/${addr}`}>{displayAddress}</Link>
      );
    }
  }

  return (
    <>
      {pre || ''}
      {displayTag ? preTag : ''}{displayTag || ''}
      {displayTag && displayAddress ? (<span> • </span>) : ''}
      {displayAddress ? preAddress : ''}{displayAddress || ''}
    </>
  );
}
