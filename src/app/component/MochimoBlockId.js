
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { isUntagged } from 'utils';

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

export default function MochimoBlockId (props) {
  const { pre, number, hash, disableLinks } = props;
  let displayNumber = number;
  let displayHash = hash;

  if (!disableLinks) {
    displayNumber = (
      <Link to={`/explorer/block/${number}`}>{displayNumber}</Link>
    );
    displayHash = (
      <Link to={`/explorer/block/${number}/${hash}`}>{hash}</Link>
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
