
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AppBar,
  Avatar,
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
import NightsStayIcon from '@mui/icons-material/NightsStay';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
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

const UnselectableTypography = styled(Typography)(() => ({
  '-webkit-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  'user-select': 'none',
  cursor: 'default'
}));

function Headerlogo ({ dense }) {
  let autosrc;
  switch (new Date().getMonth()) {
    case 11: autosrc = '/img/logo-christmas.png'; break;
    default: autosrc = '/img/logo-kanji-brushed.png';
  }
  return (
    <Link to='/'>
      <Avatar
        alt='Site Logo'
        src={autosrc}
        sx={{
          width: ({ spacing }) => dense ? spacing(6) : spacing(8),
          height: ({ spacing }) => dense ? spacing(6) : spacing(8),
          transition: 'height 250ms ease, width 250ms ease'
        }}
      />
    </Link>
  );
}

function Headertitle ({ dense }) {
  const title = window.location.origin.match(/(\w+)\W\w+$/i)?.[1];
  return (
    <UnselectableTypography
      sx={{
        position: 'relative',
        top: ({ spacing }) => dense ? spacing(-0.5) : spacing(-0.5),
        left: ({ spacing }) => dense ? spacing(-1.25) : spacing(-2),
        transition: 'top 250ms ease, left 250ms ease, font-size 250ms ease',
        color: 'white',
        lineHeight: 0,
        fontFamily: 'Nanum Brush Script',
        fontSize: ({ spacing }) => dense ? '2.5rem' : '3.33rem',
        fontWeight: 'bold',
        textShadow: dense
          ? '0 0 2px black, 0 0 2px black'
          : '0 0 4px black, 0 0 4px black'
      }}
    >
      {title.slice(1) || 'mochimap'}
    </UnselectableTypography>
  );
}

function Headersubtitle ({ dense }) {
  const subtitle = useLocation().pathname.match(/\w+/gi)?.[0];
  if (!subtitle) return null;
  return (
    <Link
      href={`/${subtitle}`}
      underline='hover'
      sx={{
        position: 'absolute',
        bottom: 0,
        left: ({ spacing }) => dense ? spacing(6.5) : spacing(8),
        transition: 'left 250ms ease, font-size 250ms ease',
        fontSize: ({ spacing }) => dense ? '0.90rem' : '1rem',
        fontFamily: 'Roboto Mono',
        color: 'white',
        fontWeight: 'bold',
        textShadow: dense
          ? '0 0 2px black, 0 0 2px black'
          : '0 0 4px black, 0 0 4px black'
      }}
    >../{subtitle}
    </Link>
  );
}

function Headernav (props) {
  const dense = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10
  });

  return (
    <Link
      component={props.href ? 'a' : Link}
      underline='none' {...props}
      sx={{
        color: 'white',
        marginLeft: ({ spacing }) => spacing(1),
        marginRight: ({ spacing }) => spacing(2),
        display: { xs: 'none', sm: 'none', md: 'inline' },
        fontFamily: 'Roboto',
        fontSize: dense ? '1em' : '1.25em',
        fontWeight: 'bold',
        '&:hover': { textShadow: '0 0 0.5em white', cursor: 'pointer' },
        '& > svg': { marginRight: ({ spacing }) => spacing(0.5) },
        '& > *': { verticalAlign: 'middle' }
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
    threshold: 10
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
          <Headersubtitle dense={dense} />
          <Box sx={{ flexGrow: '1', marginLeft: ({ spacing }) => spacing(2) }}>
            <Headernav to='/explorer'>Explorer</Headernav>
            <Headernav to='/map'>Map</Headernav>
            <Headernav href='https://status.mochimap.com'>Status</Headernav>
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
            <Box sx={{ width: 225, 'overflow-x': 'hidden' }}>
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
                  <ListItemText primary='The Explorer' secondary='Search Mochimo' />
                </ListItem>
                <Tooltip title='Coming Soon!' placement='left' arrow>
                  <ListItem to='/network' button component={Link} onClick={toggle}>
                    <ListItemIcon><LanguageIcon fontSize='large' /></ListItemIcon>
                    <ListItemText primary='The Network' secondary='Visualization' />
                  </ListItem>
                </Tooltip>
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
