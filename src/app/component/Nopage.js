
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: '0 auto',
    width: '80vw',
    height: '300vh',
    border: '0.25em solid #0059ff',
    'text-align': 'center'
  }
}));

export default function Nopage () {
  const classes = useStyles();

  return (
    <Container className={classes.paper}>
      Error - 404
    </Container>
  );
}
