
import { Typography } from '@material-ui/core';

export default function LabelValue ({ label, value }) {
  return (
    <Typography noWrap>
      <Typography component='span' variant='body2' color='textSecondary'>
        {label}
      </Typography>
      <Typography component='span'>&nbsp;{value}</Typography>
    </Typography>
  );
}
