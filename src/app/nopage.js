
import { Container, Link } from '@mui/material';

export default function Nopage () {
  return (
    <Container>
      <h2>There's nothing here...</h2>
      <p>
        <Link to='/'>Go back home</Link>
      </p>
    </Container>
  );
}
