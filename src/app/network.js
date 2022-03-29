
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Typography } from '@mui/material';

import SpaIcon from '@mui/icons-material/Spa';
import PublicIcon from '@mui/icons-material/Public';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const NetworkFlower = lazy(() => import('./component/NetworkFlower'));
const NetworkGlobe = lazy(() => import('./component/NetworkGlobe'));

export default function Network ({ type }) {
  const [isMounted, setIsMounted] = useState(false);
  const [display, setDisplay] = useState(type || 'globe');
  const box = useRef();

  // scroll listener (parallax, within page content) where within page content
  useEffect(() => {
    setIsMounted(true);
    function scroll () {
      if (box.current) {
        box.current.style.top = (window.pageYOffset * 0.5) + 'px';
      }
    }
    window.addEventListener('scroll', scroll);
    return () => {
      window.removeEventListener('scroll', scroll);
    };
  }, []);

  return (
    <Box
      ref={box} sx={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', overflow: 'hidden'
      }}
    >
      {(!isMounted && (null)) || (
        (display === 'flower' && (
          <Suspense fallback={null}>
            <NetworkFlower enable={!type} />
          </Suspense>
        )) || (display === 'globe' && (
          <Suspense fallback={null}>
            <NetworkGlobe />
          </Suspense>
        ))
      )}
      {!type && (
        <Box sx={{ position: 'fixed', bottom: 0, width: '100vw', textAlign: 'center' }}>
          <Typography display='block' variant='caption' fontSize='1em'>
            The Mochimo Cryptocurrency Network
          </Typography>
          <Typography display='block' variant='caption' fontSize='1.25em'>
            <b>Realtime</b> global decentralization and communication visualization
          </Typography>
          <BottomNavigation
            showLabels value={display} sx={{ background: 'transparent' }}
            onChange={(_event, newDisplay) => setDisplay(newDisplay)}
          >
            <BottomNavigationAction label='Flower' value='flower' icon={<SpaIcon />} />
            <BottomNavigationAction
              label='Change Visualization'
              icon={<SwapHorizIcon />}
              onClick={() => setDisplay(display === 'globe' ? 'flower' : 'globe')}
            />
            <BottomNavigationAction label='Globe' value='globe' icon={<PublicIcon />} />
          </BottomNavigation>
        </Box>
      )}
    </Box>
  );
}
