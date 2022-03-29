
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
// import NightsStayIcon from '@mui/icons-material/NightsStay';
// import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import ApiIcon from '@mui/icons-material/Api';

import { service } from 'links';

function Unselectable (props) {
  return (
    <Typography
      sx={{
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none'
      }} {...props}
    />
  );
}

function Headertitle ({ dense, ...props }) {
  const hsx = { height: dense ? 48 : 64, transition: 'height 250ms ease' };
  let tip, src;
  switch (new Date().getMonth()) {
    case 1:
      src = '/assets/images/logo-kanji-brushed.png';
      tip = 'Mochimo Brushed Kanji Logo by Chrisdigity';
      break;
    default:
      src = '/assets/images/logo.png';
      tip = '';
  }

  return (
    <Tooltip title={tip} arrow>
      <Link underline='none' to='/' sx={hsx}>
        <Box display='flex' alignItems='center'>
          <img alt={tip} src={src} style={hsx} />
          <Box sx={{ position: 'relative', height: dense ? 40 : 56 }}>
            <Unselectable
              fontFamily='Nunito Sans'
              fontSize={dense ? '1.5em' : '2.25em'}
              color='textPrimary'
            >MOCHIMO
            </Unselectable>
            <Unselectable
              color='textPrimary'
              noWrap variant='caption' fontSize={dense ? '0.5em' : '0.75em'}
              sx={{ position: 'absolute', right: '0.25em', bottom: 0 }}
            >Post-Quantum Currency
            </Unselectable>
          </Box>
        </Box>
      </Link>
    </Tooltip>
  );
}

function Headernav ({ dense, ...props }) {
  const bold = useLocation().pathname.includes(props.children.toLowerCase());
  return (
    <Link
      underline='none' {...props}
      component={props.href ? 'a' : Link}
      sx={{
        display: { xs: 'none', sm: 'none', md: 'inline' },
        marginLeft: 2,
        color: 'white',
        fontFamily: 'Roboto Mono',
        fontWeight: bold ? 'bold' : '',
        fontSize: dense ? '1em' : '1.125em',
        '&:hover': { textShadow: '0 0 0.25em white', cursor: 'pointer' }
      }}
    />
  );
}

function Headerbutton ({ title, ...props }) {
  return (
    <Tooltip title={title} arrow>
      <IconButton
        component={props.href ? 'a' : null} {...props}
        sx={props.href ? { display: { xs: 'none', sm: 'inline-flex' } } : {}}
      />
    </Tooltip>
  );
}

export default function Header ({ actualTheme, switchTheme }) {
  const [menuAnchor, setMenuAnchor] = useState('');
  const toggle = (e) => setMenuAnchor(menuAnchor ? '' : 'left');
  const dense = useScrollTrigger({
    disableHysteresis: true,
    threshold: 25
  });

  return (
    <AppBar
      position='fixed'
      color={dense ? 'primary' : 'transparent'}
      sx={{ boxShadow: dense ? 'default' : 'none' }}
    >
      <Container disableGutters>
        <Toolbar
          variant={dense ? 'dense' : 'regular'}
          sx={{ transition: 'min-height 250ms' }}
        >
          <Headertitle dense={dense} />
          <Box flexGrow={1} marginLeft={2}>
            <Headernav dense={dense} to='/explorer'>Explorer</Headernav>
            <Headernav dense={dense} to='/network'>Network</Headernav>
            <Headernav dense={dense} href='/status'>
              Status
            </Headernav>
          </Box>
          <Box>
            {service.map(({ href, Icon, primary }, i) => (
              <Headerbutton
                key={`headerlink-${i}`} href={href} title={primary}
              ><Icon />
              </Headerbutton>
            ))}
          </Box>
          <IconButton edge='end' onClick={toggle}><MenuIcon /></IconButton>
          <Drawer anchor='right' open={Boolean(menuAnchor)} onClose={toggle}>
            <Box sx={{ width: 250, overflowX: 'hidden' }}>
              <List dense>
                <ListItem button onClick={toggle}>
                  <ListItemIcon><ChevronRightIcon /></ListItemIcon>
                  <ListItemText primary='Close Menu' />
                </ListItem>
                <Divider />
                <ListSubheader>Discover Mochimo</ListSubheader>
                <Divider />
                <ListItem to='/explorer' button component={Link} onClick={toggle}>
                  <ListItemIcon><SearchIcon fontSize='large' /></ListItemIcon>
                  <ListItemText primary='Block Explorer' secondary='Search Mochimo' />
                </ListItem>
                <ListItem to='/network' button component={Link} onClick={toggle}>
                  <ListItemIcon><LanguageIcon fontSize='large' /></ListItemIcon>
                  <ListItemText primary='Network Visualization' secondary='Interactive Network' />
                </ListItem>
                <ListItem to='/exchanges' button component={Link} onClick={toggle}>
                  <ListItemIcon><CurrencyExchangeIcon fontSize='large' /></ListItemIcon>
                  <ListItemText primary='Exchanges' secondary='Trade Mochimo' />
                </ListItem>
                <ListItem to='/resources' button component={Link} onClick={toggle}>
                  <ListItemIcon><AppShortcutIcon fontSize='large' /></ListItemIcon>
                  <ListItemText primary='Miners / Wallets' secondary='Mochimo Software' />
                </ListItem>
                <ListItem to='/api' button component={Link} onClick={toggle}>
                  <ListItemIcon><ApiIcon fontSize='large' /></ListItemIcon>
                  <ListItemText primary='Public API' secondary='Blockchain Data' />
                </ListItem>
                <Divider />
                <ListSubheader>Services</ListSubheader>
                <Divider />
                {service.map(({ href, Icon, primary, secondary }, i) => (
                  <ListItem
                    key={`menu-social-${i}`} onClick={toggle}
                    button component='a' href={href}
                  >
                    <ListItemIcon><Icon fontSize='large' /></ListItemIcon>
                    <ListItemText {...{ primary, secondary }} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
