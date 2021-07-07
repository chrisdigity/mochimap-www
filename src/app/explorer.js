
import { useGetChainByLatestQuery } from './service/mochimap-api';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    margin: '0 auto',
    width: '80vw',
    height: '300vh',
    border: '0.25em solid #0059ff',
    'white-space': 'pre'
  }
}));

export default function Explorer () {
  const { data, isError, isLoading } = useGetChainByLatestQuery();
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Typography>
        {isLoading ? 'Loading...' : isError ? 'ERROR!!!'
          : JSON.stringify(data, null, 2)}
      </Typography>
    </Container>
  );
}
