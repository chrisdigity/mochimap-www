import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export function scrollToTopNow () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function ScrollToTop () {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10
  });

  return (
    <Zoom in={trigger}>
      <Fab
        onClick={scrollToTopNow}
        color='secondary' size='medium' aria-label='scroll back to top' sx={{
          zIndex: 99,
          position: 'fixed',
          margin: 2,
          bottom: 0,
          right: 0
        }}
      ><KeyboardArrowUpIcon fontSize='medium' />
      </Fab>
    </Zoom>
  );
}
