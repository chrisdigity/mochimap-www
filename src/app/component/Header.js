
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
import { styled } from '@mui/styles';

import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
// import NightsStayIcon from '@mui/icons-material/NightsStay';
// import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GridViewIcon from '@mui/icons-material/GridView';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import StorefrontIcon from '@mui/icons-material/Storefront';
import GitHubIcon from '@mui/icons-material/GitHub';
import MochimoIcon from 'app/icons/MochimoIcon';
import DiscordIcon from 'app/icons/DiscordIcon';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import HardwareIcon from '@mui/icons-material/Hardware';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import ApiIcon from '@mui/icons-material/Api';

const Unselectable = styled(Typography)(() => ({
  '-webkit-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  'user-select': 'none'
}));

function Headerlogo ({ dense, ...props }) {
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
        <img alt={tip} src={src} style={hsx} />
      </Link>
    </Tooltip>
  );
}

function Headertitle ({ dense }) {
  return (
    <Box sx={{ position: 'relative', height: dense ? 40 : 56 }}>
      <Unselectable
        fontFamily='Nunito Sans'
        fontSize={dense ? '1.5em' : '2.25em'}
      >MOCHIMO
      </Unselectable>
      <Unselectable
        noWrap variant='caption' fontSize={dense ? '0.5em' : '0.75em'}
        sx={{ position: 'absolute', right: '0.25em', bottom: 0 }}
      >Post-Quantum Currency
      </Unselectable>
    </Box>
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
    <Tooltip title={title}>
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
      position='sticky'
      color={dense ? 'primary' : 'transparent'}
      sx={{ boxShadow: dense ? 'default' : 'none' }}
    >
      <Container disableGutters>
        <Toolbar
          variant={dense ? 'dense' : 'regular'}
          sx={{ transition: 'min-height 250ms' }}
        >
          <Headerlogo dense={dense} />
          <Headertitle dense={dense} />
          <Box flexGrow={1}>
            <Headernav dense={dense} to='/explorer'>Explorer</Headernav>
            <Headernav dense={dense} to='/network'>Network</Headernav>
            <Headernav dense={dense} href='https://status.mochimap.com'>
              Status
            </Headernav>
            <Headernav dense={dense} to='/api'>API</Headernav>
          </Box>
          <Box>
            <Headerbutton
              title='Mochimo Merchandise'
              href='https://merch.mochimap.com'
            >
              <StorefrontIcon />
            </Headerbutton>
            <Headerbutton
              title='What is Mochimo?'
              href='https://mochimo.org'
            >
              <MochimoIcon />
            </Headerbutton>
            <Headerbutton
              title='Contribute to MochiMap'
              href='https://github.com/chrisdigity/mochimap-www'
            >
              <GitHubIcon />
            </Headerbutton>
            <Headerbutton
              title='Come Chat on Discord'
              href='https://discord.mochimap.com'
            >
              <DiscordIcon />
            </Headerbutton>
          </Box>
          <IconButton edge='end' onClick={toggle}>
            <MenuIcon />
          </IconButton>
          <Drawer anchor='right' open={Boolean(menuAnchor)} onClose={toggle}>
            <Box sx={{ width: 250, 'overflow-x': 'hidden' }}>
              <List dense>
                <ListItem button onClick={toggle}>
                  <ListItemIcon><ChevronRightIcon /></ListItemIcon>
                  <ListItemText primary='Close Menu' />
                </ListItem>
                <Divider />
                <ListSubheader>Explore Mochimo</ListSubheader>
                <Divider />
                <ListItem to='/explorer/address' button component={Link} onClick={toggle}>
                  <ListItemIcon><WalletIcon fontSize='large' /></ListItemIcon>
                  <ListItemText
                    primary='Address/Tag'
                    secondary='~ and Balance'
                  />
                </ListItem>
                <ListItem to='/explorer/block' button component={Link} onClick={toggle}>
                  <ListItemIcon><GridViewIcon fontSize='large' /></ListItemIcon>
                  <ListItemText
                    primary='Blocks'
                    secondary='~ and Miners'
                  />
                </ListItem>
                <ListItem to='/explorer/transaction' button component={Link} onClick={toggle}>
                  <ListItemIcon><ReceiptIcon fontSize='large' /></ListItemIcon>
                  <ListItemText
                    primary='Transactions'
                    secondary='~ and Receipts'
                  />
                </ListItem>
                <ListItem to='/explorer/richlist' button component={Link} onClick={toggle}>
                  <ListItemIcon><LeaderboardIcon fontSize='large' /></ListItemIcon>
                  <ListItemText
                    primary='Richlist'
                    secondary='~ and Ranks'
                  />
                </ListItem>
                <Tooltip title='Coming Soon!' placement='left' arrow>
                  <ListItem button>
                    <ListItemIcon><ViewCarouselIcon fontSize='large' /></ListItemIcon>
                    <ListItemText
                      primary='Haiku Poems'
                      secondary='~ and AI Art'
                    />
                  </ListItem>
                </Tooltip>
                <Divider />
                <ListSubheader>Discover Mochimo</ListSubheader>
                <Divider />
                <ListItem to='/explorer' button component={Link} onClick={toggle}>
                  <ListItemIcon><SearchIcon fontSize='large' /></ListItemIcon>
                  <ListItemText primary='Block Explorer' secondary='Search Mochimo' />
                </ListItem>
                <Tooltip title='Coming Soon!' placement='left' arrow>
                  <ListItem to='/network' button component={Link} onClick={toggle}>
                    <ListItemIcon><LanguageIcon fontSize='large' /></ListItemIcon>
                    <ListItemText primary='Network Visualization' secondary='Interactive Network' />
                  </ListItem>
                </Tooltip>
                <ListItem to='/exchanges' button component={Link} onClick={toggle}>
                  <ListItemIcon><CurrencyExchangeIcon fontSize='large' /></ListItemIcon>
                  <ListItemText primary='Exchanges' secondary='Trade Mochimo' />
                </ListItem>
                <ListItem to='/mining' button component={Link} onClick={toggle}>
                  <ListItemIcon><HardwareIcon fontSize='large' /></ListItemIcon>
                  <ListItemText primary='Mining & Pools' secondary='Solve Blocks' />
                </ListItem>
                <ListItem to='/wallets' button component={Link} onClick={toggle}>
                  <ListItemIcon><AppShortcutIcon fontSize='large' /></ListItemIcon>
                  <ListItemText primary='Wallet Software' secondary='Java, iOS, Web' />
                </ListItem>
                <ListItem to='/api' button component={Link} onClick={toggle}>
                  <ListItemIcon><ApiIcon fontSize='large' /></ListItemIcon>
                  <ListItemText primary='Public API' secondary='' />
                </ListItem>
                <Divider />
                <ListSubheader>More Mochimo</ListSubheader>
                <Divider />
                <ListItem
                  button onClick={toggle}
                  component='a' href='https://merch.mochimap.com'
                >
                  <ListItemIcon><StorefrontIcon fontSize='large' /></ListItemIcon>
                  <ListItemText primary='Merchandise' secondary='Mochimo Store' />
                </ListItem>
                <ListItem
                  button onClick={toggle}
                  component='a' href='https://mochimo.org'
                >
                  <ListItemIcon><MochimoIcon fontSize='large' /></ListItemIcon>
                  <ListItemText primary='What is Mochimo?' secondary='Official website' />
                </ListItem>
                <ListItem
                  button onClick={toggle}
                  component='a' href='https://github.com/chrisdigity/mochimap-www'
                >
                  <ListItemIcon><GitHubIcon fontSize='large' /></ListItemIcon>
                  <ListItemText primary='Contribute' secondary='on Github' />
                </ListItem>
                <ListItem
                  button onClick={toggle}
                  component='a' href='https://discord.mochimap.com'
                >
                  <ListItemIcon><DiscordIcon fontSize='large' /></ListItemIcon>
                  <ListItemText primary='Discord' secondary='Come say Hi' />
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
