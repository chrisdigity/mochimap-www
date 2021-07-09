
import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Badge,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useScrollTrigger
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import StorefrontIcon from '@material-ui/icons/Storefront';
import GitHubIcon from '@material-ui/icons/GitHub';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MochimoIcon from './MochimoIcon';
import DiscordIcon from './DiscordIcon';
import ThemeButton from './ThemeButton';
import IconButtonLink from './IconButtonLink';

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
  menuButton: {
    margin: 0,
    padding: 0,
    'text-transform': 'none',
    '&:hover': {
      background: 'none'
    }
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
      marginLeft: theme.spacing(3),
      '& > svg': {
        marginRight: theme.spacing(0.5)
      },
      '& > *': {
        verticalAlign: 'middle'
      }
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
      ? 'scale(1) translate(100%, 75%)' : 'scale(1) translate(100%, 75%)',
    transition: 'all 250ms ease',
    '&:hover': {
      background: theme.palette.secondary[theme.palette.type]
    },
    '& a': {
      'text-decoration': 'none'
    }
  }
}));

export default function Header ({ routelist, switchTheme }) {
  const headerRef = useRef();
  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const handleMoreClose = (event) => setMoreAnchorEl(null);
  const handleMoreClick = (event) => setMoreAnchorEl(event.currentTarget);
  const moreOpen = Boolean(moreAnchorEl);
  const baseLocation = useLocation().pathname.replace(/^\/([a-z]*).*$/i, '$1');
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100
  });
  const classes = useStyles({ dense: trigger });
  const toolbarVariant = trigger ? 'dense' : 'regular';
  const menuItems = [
    {
      href: 'https://github.com/chrisdigity/mochimap-www',
      text: 'Contribute to MochiMap',
      Icon: GitHubIcon
    }, {
      href: 'https://discord.mochimap.com',
      text: 'Come Chat on Discord',
      Icon: DiscordIcon
    }
  ];

  return (
    <>
      <AppBar ref={headerRef} position='fixed'>
        <Toolbar className={classes.root} variant={toolbarVariant}>
          <Badge
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={(
              <Link to={`/${baseLocation}`}>{baseLocation}</Link>
            )}
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
            {routelist.filter(route => route.nav).map((item, i) =>
              <Link to={item.path || '/'} key={i}>
                {item.Icon ? <item.Icon /> : ''}{item.nav}
              </Link>
            )}
          </Typography>
          <div className={classes.grow} />
          <ThemeButton switchTheme={switchTheme} />
          <IconButtonLink
            Icon={StorefrontIcon}
            label='Mochimo Merchandise'
            path='https://merch.mochimap.com'
          />
          <IconButtonLink
            Icon={MochimoIcon}
            label='What is Mochimo?'
            path='https://mochimo.org'
          />
          <IconButton
            aria-label='more'
            aria-controls='more-menu'
            aria-haspopup='true'
            edge='end'
            onClick={handleMoreClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id='more-menu'
            anchorEl={moreAnchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            disableScrollLock
            elevated={0}
            getContentAnchorEl={null}
            keepMounted
            open={moreOpen}
            onClose={handleMoreClose}
          >
            {menuItems.map((item, index) =>
              <MenuItem key={index} component='a' href={item.href} dense>
                <ListItemIcon>
                  <item.Icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
