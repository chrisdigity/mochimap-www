
import { Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    margin: theme.spacing(1)
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
    color: theme.palette.secondary.main
  }
}));

export default function LoadMoreButton ({ isLoading, handleClick }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button
        variant='contained' color='secondary'
        disabled={isLoading} onClick={handleClick}
      >
        {isLoading ? 'Loading...' : 'Load More'}
      </Button>
      {isLoading && <CircularProgress size={24} className={classes.progress} />}
    </div>
  );
}
