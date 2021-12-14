
import { useState } from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';
import {
  useGetBlocksBySearchQuery,
  useGetLedgerBalancesBySearchQuery,
  useGetNodeBySearchQuery,
  useGetTransactionsBySearchQuery
} from './service/mochimap-api';
import {
  Avatar,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import WidgetsIcon from '@material-ui/icons/Widgets';
import ReceiptIcon from '@material-ui/icons/Receipt';
import GavelIcon from '@material-ui/icons/Gavel';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import ExplorerSearchForm from './component/ExplorerSearchForm';
import MochimoActivityFeed from './component/MochimoActivityFeed';
import MochimoAddress from './component/MochimoAddress';
import TimePrep from './component/TimePrep';
import MCMSuffix from './component/MCMSuffix';
import ByteSuffix from './component/ByteSuffix';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative'
  },
  explorerTitle: {
    'margin-top': '25vh',
    'font-family': 'Nanum Brush Script',
    'font-weight': 'bold',
    'white-space': 'nowrap',
    'text-align': 'center'
  },
  searchTitle: {
    'margin-top': '1rem',
    'font-family': 'Nanum Brush Script',
    'font-weight': 'bold',
    'white-space': 'nowrap',
    '& > i': {
      'font-family': 'Roboto',
      'font-size': '0.375em'
    }
  }
}));
const useSubStyles = makeStyles((theme) => ({
  root: {
    'white-space': 'nowrap',
    top: '3rem'
  },
  itemIcon: {
    'justify-content': 'center'
  },
  itemText: {
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap'
  },
  listSection: {
    margin: theme.spacing(1),
    background: theme.palette.background.default
  }
}));

export default function Explorer () {
  const classes = useStyles();
  const { search } = useLocation();
  const searchParams = search && new URLSearchParams(search);
  const searchType = search && searchParams.get('search');
  const searchQuery = search && searchParams.get('for');

  if (search) {
    if (!searchType && typeof searchQuery === 'string') {
      if (searchQuery.length > 24) {
        return (
          <Redirect to={`/explorer/ledger/address/${searchQuery}`} />
        );
      }
      return (
        <Redirect to={`/explorer/ledger/tag/${searchQuery}`} />
      );
    }
    return (
      <Redirect to={`/explorer/ledger/${searchType}/${searchQuery}`} />
    );
  }

  return (
    <Container className={classes.root}>
      <Typography className={classes.explorerTitle} variant='h1'>
        Find My Balance
      </Typography>
      <ExplorerSearchForm ledgerOnly />
    </Container>
  );
}
