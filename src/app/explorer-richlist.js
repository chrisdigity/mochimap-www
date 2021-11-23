
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useGetRichlistBySearchQuery,
  useGetChainByLatestQuery
} from './service/mochimap-api';
import {
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
import LoadMoreButton from './component/LoadMoreButton';
import MochimoAddress from './component/MochimoAddress';
import MochimoBalance from './component/MochimoBalance';
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
  }
}));

export default function ExplorerLedgerRichlist () {
  const initialParams = new URLSearchParams(useLocation().search);
  if (!initialParams.has('perpage')) initialParams.set('perpage', '100');
  const [search, setSearch] = useState(initialParams);
  const request = useGetRichlistBySearchQuery({ search: search.toString() });
  const chain = useGetChainByLatestQuery();
  const classes = useStyles();

  const loadMore = () => {
    setSearch((state) => {
      const params = new URLSearchParams(state);
      params.set('perpage', Number(params.get('perpage') || 0) + 100);
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
          <i>{chain.isFetching
            ? <CircularProgress size='1em' />
            : (256 - (chain.data?.bnum % 256))} Blocks until next update
            (est. {chain.isFetching
              ? <CircularProgress size='1em' />
              : <TimePrep
                  epoch={(chain.data.stime +
                    ((256 - (chain.data.bnum % 256)) * chain.data.blocktime_avg)
                  )}
                />})
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
            {request.data?.results?.map((item, ii) => (
              <TableRow key={`richlist-rank-${item.rank}`}>
                <TableCell align='center'>{item.rank}</TableCell>
                <TableCell className={classes.addressCell}>
                  <Typography noWrap>
                    <MochimoAddress tag={item.tag} addr={item.address} />
                  </Typography>
                </TableCell>
                <TableCell align='right'>
                  <MochimoBalance value={item.balance} />
                </TableCell>
                <TableCell align='right'>
                  {chain.isLoading
                    ? <CircularProgress size='1rem' />
                    : chain.data?.totalsupply
                      ? (`${(
                        100 * item.balance / (chain.data.totalsupply * 1e+9)
                        ).toFixed(2)}`)
                      : '??'}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <LoadMoreButton isLoading={request.isFetching} handleClick={loadMore} />
      </TableContainer>
    </Container>
  );
}
