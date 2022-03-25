import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function ScrollToTop () {
  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10
  });

  return (
    <Zoom in={trigger}>
      <Fab
        onClick={handleClick}
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
