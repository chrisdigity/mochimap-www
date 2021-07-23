
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExplorerSearchForm from './component/ExplorerSearchForm';
import MochimoActivityFeed from './component/MochimoActivityFeed';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative'
  },
  pageTitle: {
    'margin-top': '25vh',
    'font-family': 'Nanum Brush Script',
    'font-weight': 'bold',
    'white-space': 'nowrap',
    'text-align': 'center'
  },
  grow: {
    'flex-grow': 1
  }
}));

export default function Explorer () {
  const { search } = useLocation();
  const searchParams = search && new URLSearchParams(search);

  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Typography className={classes.pageTitle} variant='h1'>
        Mochimo Explorer
      </Typography>
      <ExplorerSearchForm />
      <MochimoActivityFeed />
    </Container>
  );
}
