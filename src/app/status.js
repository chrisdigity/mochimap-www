
import { Container } from '@mui/material';

const iFrameResize = window.iFrameResize;

export default function Status () {
  return (
    <Container sx={{ position: 'relative', padding: 2 }}>
      <iframe
        title='embedded services status and uptime monitor'
        className='htframe' width='100%' style={{ border: 'none' }}
        src='https://wl.hetrixtools.com/r/267effaab38c3e5b51cde2012b41898b/'
        sandbox='allow-scripts allow-same-origin allow-popups'
        onLoad={() => iFrameResize([{ log: false }], '.htframe')}
      />
    </Container>
  );
}
