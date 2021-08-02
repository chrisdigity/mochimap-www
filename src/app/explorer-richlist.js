
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useGetRichlistBySearchQuery,
  useGetChainByLatestQuery
} from './service/mochimap-api';
import {
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MochimoAddress from './component/MochimoAddress';
import MCMSuffix from './component/MCMSuffix';
import TimePrep from './component/TimePrep';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    'flex-flow': 'column nowrap'
  },
  paper: {
    padding: theme.spacing(2)
  },
  title: {
    position: 'relative',
    'font-family': 'Lobster'
  },
  table: {
    width: 'auto',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    display: 'inline-block',
    background: theme.palette.action.hover,
    '& td, & th': {
      'padding-top': theme.spacing(0.25),
      'padding-bottom': theme.spacing(0.25),
      'padding-left': theme.spacing(1),
      'padding-right': theme.spacing(1)
    }
  },
  addressCell: {
    [theme.breakpoints.down('md')]: {
      'max-width': '65vw'
    },
    [theme.breakpoints.down('sm')]: {
      'max-width': '45vw'
    },
    [theme.breakpoints.down('xs')]: {
      'max-width': '25vw'
    }
  },
  buttonWrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  buttonProgress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}));

export default function ExplorerLedgerRichlist () {
  const initialSearch = useLocation().search;
  const [search, setSearch] = useState(new URLSearchParams(initialSearch));
  const richlist = useGetRichlistBySearchQuery({ search: search.toString() });
  const chain = useGetChainByLatestQuery();
  const classes = useStyles();

  const loadMore = () => {
    setSearch((state) => {
      const params = new URLSearchParams(state);
      params.set('perpage', Number(params.get('perpage') || 0) + 32);
      return params.toString();
    });
  };

  return (
    <Container className={classes.root}>
      <Typography variant='h1' className={classes.title} align='center'>
        The Mochimo Richlist
      </Typography>
      <TableContainer component={Paper} className={classes.root}>
        <Typography align='center'>
          The Mochimo Richlist is generated once per Aeon.<br />
          <i>
            {chain.isFetching ? (
              <CircularProgress size='1em' />
            ) : (256 - (chain.data?.bnum % 256))} Blocks until next update
            (est. {chain.isFetching ? (<CircularProgress size='1em' />) : (
              <TimePrep
                epoch={(chain.data.stime +
                  ((256 - (chain.data?.bnum % 256)) * chain.data.blocktime_avg)
                )}
              />
            )})
          </i>
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Rank</TableCell>
              <TableCell>Address</TableCell>
              <TableCell align='right'>Balance</TableCell>
              <TableCell align='right'>Stake</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {richlist.data?.results?.map((item, ii) => (
              <TableRow key={`richlist-rank-${item.rank}`}>
                <TableCell align='center'>{item.rank}</TableCell>
                <TableCell className={classes.addressCell}>
                  <Typography noWrap>
                    <MochimoAddress tag={item.tag} addr={item.address} />
                  </Typography>
                </TableCell>
                <TableCell align='right'>
                  <MCMSuffix value={item.balance} />
                </TableCell>
                <TableCell align='right'>
                  {chain.isLoading ? (
                    <CircularProgress size='1rem' />
                  ) : !chain.data?.supply ? '??%' : (
                    `${(item.balance / chain.data.supply * 100).toFixed(2)}%`
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className={classes.buttonWrapper}>
          <Button
            variant='contained'
            color='secondary'
            disabled={richlist.isFetching}
            onClick={loadMore}
          >
            {richlist.isFetching ? 'Loading...' : 'Load More'}
          </Button>
          {richlist.isFetching &&
            <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </TableContainer>
    </Container>
  );
}
