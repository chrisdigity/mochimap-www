
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
      'font-weight': 'bold'
    }
  },
  navItem: {
    marginLeft: theme.spacing(1)
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
          <Typography>
            {routelist.filter(route => route.text).map((item, i) =>
              <Link
                className={classes.navItem}
                href={item.path || '/'}
                variant='h6'
                key={i}
              >{item.text}
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
