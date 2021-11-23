
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Badge,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
  Link as MuiLink
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import StorefrontIcon from '@material-ui/icons/Storefront';
import GitHubIcon from '@material-ui/icons/GitHub';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MochimoIcon from './MochimoIcon';
import DiscordIcon from './DiscordIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    color: 'white',
    background: '',
    transition: 'min-height 250ms',
    '& *': {
      color: 'inherit'
    }
  },
  grow: {
    'flex-grow': 1
  },
  logo: {
    width: props => props.dense ? theme.spacing(6) : theme.spacing(8),
    height: props => props.dense ? theme.spacing(6) : theme.spacing(8),
    transition: 'height 250ms ease, width 250ms ease'
  },
  title: {
    position: 'relative',
    top: -theme.spacing(0.5),
    left: props => props.dense ? -theme.spacing(1.25) : -theme.spacing(1.75),
    transition: 'left 250ms ease, font-size 250ms ease',
    'line-height': 0,
    'font-family': 'Nanum Brush Script',
    'font-size': props => props.dense ? '2.5rem' : '3.33rem',
    'font-weight': 'bold',
    'text-shadow': props => props.dense
      ? '0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black'
      : '0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black',
    '-webkit-user-select': 'none',
    '-moz-user-select': 'none',
    '-ms-user-select': 'none',
    'user-select': 'none'
  },
  navItems: {
    'font-family': 'Nanum Gothic',
    'font-weight': 'bold',
    '& > a': {
      marginLeft: theme.spacing(1),
      '& > svg': {
        marginRight: theme.spacing(0.5)
      },
      '& > *': {
        verticalAlign: 'middle'
      }
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  badge: {
    'letter-spacing': 1,
    'font-weight': 'bold',
    'font-family': 'Roboto Mono',
    'text-transform': 'uppercase',
    'box-shadow': props => props.dense
      ? `1px 2px 3px ${theme.palette.text.disabled}`
      : `1px 3px 5px ${theme.palette.text.disabled}`,
    'font-size': props => props.dense ? '0.75rem' : '1rem',
    'min-width': props => props.dense ? '18px' : '24px',
    height: props => props.dense ? '18px' : '24px',
    padding: props => props.dense ? '0 6px 2px 6px' : '0 8px 2px 8px',
    border: `2px solid ${theme.palette.background.default}`,
    transform: props => props.dense
      ? 'scale(1) translate(100%, 75%)'
      : 'scale(1) translate(100%, 75%)',
    transition: 'all 250ms ease',
    '&:hover': {
      background: theme.palette.secondary[theme.palette.type]
    },
    '& a': {
      'text-decoration': 'none'
    }
  },
  moreButton: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  moreItems: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  drawerSubheader: {
    display: 'flex',
    'flex-direction': 'column',
    background: theme.palette.background.default,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  }
}));

export default function Header ({ routelist, switchTheme }) {
  const [menuAnchor, setMenuAnchor] = useState('');
  const [moreAnchor, setMoreAnchor] = useState(null);
  const toggleMenu = (e) => setMenuAnchor(menuAnchor ? '' : 'left');
  const toggleMore = (e) => setMoreAnchor(moreAnchor ? null : e.currentTarget);
  const baseLocation = useLocation().pathname.replace(/^\/([a-z]*).*$/i, '$1');
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100
  });
  const classes = useStyles({ dense: trigger });
  const toolbarVariant = trigger ? 'dense' : 'regular';
  const moreItems = [
    {
      text: 'Switch Theme',
      Icon: useTheme()?.palette?.type === 'dark'
        ? BrightnessHighIcon
        : NightsStayIcon,
      itemProps: {
        onClick: switchTheme
      }
    },
    {
      text: 'Mochimo Merchandise',
      Icon: StorefrontIcon,
      itemProps: {
        href: 'https://merch.mochimap.com',
        component: MuiLink
      }
    },
    {
      text: 'What is Mochimo?',
      Icon: MochimoIcon,
      itemProps: {
        href: 'https://mochimo.org',
        component: MuiLink
      }
    },
    {
      text: 'Contribute to MochiMap',
      Icon: GitHubIcon,
      itemProps: {
        href: 'https://github.com/chrisdigity/mochimap-www',
        component: MuiLink
      }
    }, {
      text: 'Come Chat on Discord',
      Icon: DiscordIcon,
      itemProps: {
        href: 'https://discord.mochimap.com',
        component: MuiLink
      }
    }
  ];

  return (
    <AppBar position='sticky'>
      <Toolbar className={classes.root} variant={toolbarVariant}>
        <IconButton edge='start' onClick={toggleMenu}>
          <MenuIcon />
        </IconButton>
        <Badge
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={<Link to={`/${baseLocation}`}>{baseLocation}</Link>}
          classes={{ badge: classes.badge }}
          color='secondary'
          overlap='circle'
        >
          <Link to='/'>
            <Avatar
              alt='MochiMap Logo'
              src='/img/logo-kanji-brushed.png'
              className={classes.logo}
            />
          </Link>
        </Badge>
        <Typography className={classes.title}>ochiMap</Typography>
        <Typography className={classes.navItems} component='div'>
          {routelist.filter(route => route.nav).map((item, ii) => (
            <Link to={item.path || '/'} key={`navmenu-item-${ii}`}>
              {item.Icon && <item.Icon />}{item.nav}
            </Link>
          ))}
        </Typography>
        <div className={classes.grow} />
        <div className={classes.moreItems}>
          {moreItems.map((item, ii) => (
            <Tooltip key={`more-items-${ii}`} title={item.text}>
              <IconButton {...item.itemProps}>
                <item.Icon />
              </IconButton>
            </Tooltip>
          ))}
        </div>
        <IconButton
          onClick={toggleMore}
          className={classes.moreButton}
          aria-label='more menu items'
          aria-controls='moremenu-items'
          aria-haspopup='true'
          edge='end'
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id='moremenu-items'
          anchorEl={moreAnchor}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          disableScrollLock
          elevated={0}
          getContentAnchorEl={null}
          keepMounted
          open={Boolean(moreAnchor)}
          onClose={toggleMore}
        >
          {moreItems.map((item, ii) =>
            <MenuItem key={`moremenu-items-${ii}`} {...item.itemProps} dense>
              <ListItemIcon>
                <item.Icon />
              </ListItemIcon>
              <ListItemText secondary={item.text} />
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
      <Drawer anchor='left' open={Boolean(menuAnchor)} onClose={toggleMenu}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={toggleMenu}><ChevronLeftIcon /></IconButton>
        </div>
        <Divider />
        <List dense>
          {routelist.filter(route => route.nav).map((item, ii) => (
            <React.Fragment key={`menu-header-${ii}`}>
              <ListSubheader className={classes.drawerSubheader}>
                {item.nav}
                <Divider />
              </ListSubheader>
              {item.subnav
                ? item.subnav.map((subitem, jj) => (
                  <ListItem
                    key={`menu-item-${ii}-${jj}`}
                    button component={Link} to={subitem.path}
                    onClick={toggleMenu}
                  >
                    <ListItemIcon>
                      {subitem.Icon && <subitem.Icon fontSize='large' />}
                    </ListItemIcon>
                    <ListItemText
                      primary={subitem.primary} secondary={subitem.secondary}
                    />
                  </ListItem>))
                : (
                  <ListItem
                    key={`menu-item-${ii}`}
                    button component={Link} to={item.path}
                    onClick={toggleMenu}
                  >
                    <ListItemIcon>
                      {item.Icon && <item.Icon fontSize='large' />}
                    </ListItemIcon>
                    <ListItemText>{item.primary}</ListItemText>
                  </ListItem>)}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
