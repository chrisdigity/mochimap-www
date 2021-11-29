
import {
  useGetChainByLatestQuery,
  useGetTransactionByTxidQuery
} from './service/mochimap-api';
import {
  Card,
  CircularProgress,
  Container,
  Tab,
  Tabs,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import MochimoBlockId from './component/MochimoBlockId';
import { MochimoTransaction } from './component/MochimoTransactions';
import LabelValue from './component/LabelValue';
import { capitalize, preBytes } from 'utils';
import MochimoBalance from './component/MochimoBalance';
import MochimoAddress from './component/MochimoAddress';
import MochimoTransactionId from './component/MochimoTransactionId';
import TimePrep from './component/TimePrep';

const useStyles = makeStyles((theme) => ({
  column: {
    display: 'flex',
    'flex-direction': 'column',
    position: 'relative',
    alignItems: 'center',
    padding: theme.spacing(2)
  },
  rowWrap: {
    display: 'flex',
    'flex-flow': 'row wrap'
  },
  card: {
    display: 'flex',
    'flex-direction': 'column',
    alignItems: 'center',
    'max-width': '90vw',
    padding: theme.spacing(2)
  },
  title: {
    'border-bottom': '0.125em solid',
    'border-bottom-color': theme.palette.secondary.main,
    'text-align': 'center'
  },
  haiku: {
    'font-family': 'Nanum Brush Script',
    'font-weight': 'bold',
    margin: theme.spacing(1),
    'white-space': 'pre'
  },
  txid: {
    margin: theme.spacing(1),
    'max-width': '90vw'
  },
  content: {
    display: 'flex',
    'flex-direction': 'column',
    position: 'relative',
    alignItems: 'left',
    padding: theme.spacing(1)
  },
  small: {
    'font-size': '0.675em'
  },
  outerSpacing: {
    margin: theme.spacing(1)
  },
  innerSpacing: {
    padding: theme.spacing(2)
  },
  maxWidth: {
    'max-width': '90vw'
  }
}));

export default function Block () {
  const { txid } = useParams();
  const classes = useStyles();
  const tx = useGetTransactionByTxidQuery({ txid });
  const time = tx.data?.time0 || tx.data?.stime || 0;

  return (
    <Container className={classes.column}>
      <Typography noWrap className={classes.txid}>
        <MochimoTransactionId txid={txid} disableLinks />
      </Typography>
      <Card className={classes.card}>
        {(tx.isError && (
          <>
            <Typography variant='h6'>
              an error occurred (╥﹏╥)
            </Typography>
            <Typography variant='caption'>
              Error: {tx.error?.data?.error}
            </Typography>
          </>
        )) || (tx.isFetching && (
          <CircularProgress size='4rem' />
        )) || (
          <MochimoTransaction tx={tx} />
        )}
      </Card>
    </Container>
  );
}
