
import {
  AppBar,
  IconButton,
  Link,
  Toolbar,
  Typography,
  useScrollTrigger
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ThemeTypeButton from './ThemeTypeButton';
import GitHubButton from './GitHubButton';

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
    [theme.breakpoints.up('sm')]: {

    },
    '&:hover': {
      background: 'none'
    },
    '& .logo': {
      display: 'inline-block',
      width: theme.spacing(6),
      height: theme.spacing(6),
      verticalAlign: 'middle'
    },
    '& .title': {
      position: 'relative',
      top: -theme.spacing(0.5),
      left: -theme.spacing(1.5),
      'font-family': 'Nanum Brush Script',
      'font-size': '1.75em',
      'font-weight': 'bold',
      'text-shadow':
        '0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black'
    }
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
  }
}));

export default function Header ({ routelist, setThemeType }) {
  const classes = useStyles();
  const toolbarVariant = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100
  }) ? 'dense' : 'regular';

  return (
    <>
      <AppBar position='fixed'>
        <Toolbar className={classes.root} variant={toolbarVariant}>
          <IconButton className={classes.menuButton} aria-label='MochiMap Menu'>
            <img
              className='logo'
              alt='MochiMap Logo'
              src='/img/logo-kanji-brushed.png'
            />
            <span className='title'>ochiMap</span>
          </IconButton>
          <Typography className={classes.navItems} component='div'>
            {routelist.filter(route => route.nav).map((item, i) =>
              <Link href={item.path || '/'} key={i}>
                {item.Icon ? <item.Icon /> : ''}{item.nav}
              </Link>
            )}
          </Typography>
          <div className={classes.grow} />
          <ThemeTypeButton setThemeType={setThemeType} />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
