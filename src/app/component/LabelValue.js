
import { CircularProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  line: {
    display: 'flex',
    'flex-flow': 'row nowrap',
    'justify-content': 'left'
  },
  left: {
    'min-width': '6.5rem',
    'align-self': 'flex-end'
  },
  right: {
    'font-family': 'monospace'
  },
  le: {
    overflow: 'hidden',
    'white-space': 'pre',
    'text-overflow': 'ellipsis',
    'font-family': 'monospace',
    direction: 'rtl'
  },
  re: {
    overflow: 'hidden',
    'white-space': 'pre',
    'text-overflow': 'ellipsis',
    'font-family': 'monospace'
  }
}));

export default function LabelValue ({ children, name, trunc, sep }) {
  const { line, left, right, le, re } = useStyles();

  return (
    <Typography className={line}>
      <Typography className={left} color='textSecondary'>
        {name}
      </Typography>
      {((typeof children !== 'string' || isNaN(trunc)) && (
        <Typography className={right} noWrap>{children}</Typography>
      )) || (
        <>
          <Typography className={sep ? re : trunc <= 0 ? le : re}>
            {children.slice(0, Math.round(children.length * trunc))}
          </Typography>
          {(sep && (<Typography>&nbsp;{sep}&nbsp;</Typography>)) || null}
          <Typography className={sep || trunc >= 1 ? re : le}>
            {children.slice(Math.round(children.length * trunc))}
          </Typography>
        </>
      )}
    </Typography>
  );
}
