
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const preNumber = (
  <Typography component='span' display='inline' color='textSecondary'>
    βnum:&nbsp;
  </Typography>
);
const preHash = (
  <Typography component='span' display='inline' color='textSecondary'>
    βhash:&nbsp;
  </Typography>
);

export default function MochimoBlockI
({ pre, number, hash, disableHex, disableLinks }) {
  let displayNumber = number;
  let displayHash = hash;

  if (!disableLinks) {
    displayNumber = (
      <Link to={`/explorer/block/${number}`}>
        {number}&nbsp;
        <Typography variant='caption'>
          (0x{Number(number).toString(16)})
        </Typography>
      </Link>
    );
    displayHash = (
      <Link to={`/explorer/block/${number}/${hash}`}>{hash}</Link>
    );
  } else {
    displayNumber = (
      <>
        {number}&nbsp;
        <Typography component='span' variant='caption'>
          (0x{Number(number).toString(16)})
        </Typography>
      </>
    );
  }

  return (
    <>
      {pre || ''}
      {displayNumber ? preNumber : ''}{displayNumber || ''}
      {displayNumber && displayHash ? (<span> • </span>) : ''}
      {displayHash ? preHash : ''}{displayHash || ''}
    </>
  );
}
