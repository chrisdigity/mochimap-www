
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const preTxid = (
  <Typography component='span' display='inline' color='textSecondary'>
    τxid:&nbsp;
  </Typography>
);

export default function MochimoAddress ({ pre, txid, disableLinks }) {
  let displayTxid = `${txid}`;

  if (!disableLinks) {
    displayTxid = (<Link to={`/explorer/transaction/${txid}`}>{txid}</Link>);
  }

  return (
    <>
      {pre || ''}{preTxid || ''}{displayTxid || ''}
    </>
  );
}
