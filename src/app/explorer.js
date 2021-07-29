
import { Link, useLocation } from 'react-router-dom';
import {
  useGetBlocksBySearchQuery,
  useGetLedgerBalanceBySearchQuery,
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

function SubList ({ type, query, req, children }) {
  // generic ListSubheader for code reduction
  const classes = useSubStyles();
  return (
    <Paper elevation={3} className={classes.listSection}>
      <ListSubheader className={classes.root}>
        Searching <u><strong>{type}</strong></u> for {(
          <u><strong>{query}</strong></u>
        )} - {req.error ? req.error.data.error : req.isLoading
          ? <CircularProgress size='1em' /> : `${req.data.found} results`}
        <Divider />
      </ListSubheader>
      {children}
    </Paper>
  );
}

function SubListItem ({ children, to }) {
  // generic ListItem for code reduction
  return (
    <ListItem
      button
      divider
      disableGutters
      alignItems='center'
      component={Link}
      to={to}
    >
      {children}
    </ListItem>
  );
}

function NodeSearch ({ query }) {
  const search = `host.ip:contains=${query}`;
  const request = useGetNodeBySearchQuery({ search });
  const classes = useSubStyles();

  return (
    <SubList type='Nodes' query={query} req={request}>
      {request.data && request.data.results.map((item, index) => (
        <SubListItem key={index} to={`/explorer/network/${item.host.ip}`}>
          <ListItemIcon className={classes.itemIcon}>
            <AccountTreeIcon />
          </ListItemIcon>
          <ListItemText
            className={classes.itemText}
            primary={(
              <Grid container wrap='nowrap' spacing={2}>
                <Grid item>{item.host.ip}</Grid>
                <Grid item>
                  Last updated&nbsp;
                  <TimePrep
                    epoch={(
                      item.connection.de.timestamp +
                      item.connection.sg.timestamp +
                      item.connection.us.timestamp
                    ) / 3000}
                  />
                </Grid>
              </Grid>
            )}
            secondary={(<span>{item.peers?.length || 0} recent peers</span>)}
          />
        </SubListItem>
      ))}
    </SubList>
  );
}

function BlockchainSearch ({ query }) {
  const searchType = isNaN(query) ? 'bhash:contains' : 'bnum';
  const search = `${searchType}=${query}`;
  const request = useGetBlocksBySearchQuery({ search });
  const classes = useSubStyles();

  return (
    <SubList type='Blockchain' query={query} req={request}>
      {request.data && request.data.results.map((item, index) => (
        <SubListItem
          key={index} to={`/explorer/block/${item.bnum}/${item.bhash}`}
        >
          <ListItemIcon className={classes.itemIcon}>
            {item.img ? <Avatar alt={item.img.desc} src={item.img.thumb} />
              : <WidgetsIcon />}
          </ListItemIcon>
          <ListItemText
            className={classes.itemText}
            primary={(
              <Grid container wrap='nowrap' spacing={2}>
                <Grid item>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Grid>
                <Grid item>#{item.bnum}</Grid>
                <Grid item>Diff. {item.difficulty}</Grid>
                <Grid item>
                  <TimePrep epoch={item.stime} />
                </Grid>
                {item.type === 'normal' ? (
                  <>
                    <Grid item>
                      {item.tcount?.toLocaleString()} transactions
                    </Grid>
                    <Grid item><MCMSuffix value={item.amount} /></Grid>
                  </>
                ) : item.type === 'Neogenesis' && (
                  <Grid item>{item.lcount?.toLocaleString()} Address</Grid>
                )}
                <Grid item><ByteSuffix bytes={item.size} /></Grid>
              </Grid>
            )}
            secondary={(
              <span>
                Hash: {item.bhash}<br />
                {item.img && item.img.haiku.replace(/[ ]\n/g, ' | ')}
              </span>
            )}
          />
        </SubListItem>
      ))}
    </SubList>
  );
}

function TransactionSearch ({ query }) {
  const search = `txid:contains=${query}`;
  const request = useGetTransactionsBySearchQuery({ search });
  const classes = useSubStyles();

  return (
    <SubList type='Transaction' query={query} req={request}>
      {request.data && request.data.results.map((item, index) => (
        <SubListItem
          key={index} to={`/explorer/transaction/${item.txid}/${item.bnum}`}
        >
          <ListItemIcon className={classes.itemIcon}>
            {item.txid ? <ReceiptIcon /> : <GavelIcon />}
          </ListItemIcon>
          <ListItemText
            className={classes.itemText}
            primary={(
              <Grid container spacing={2}>
                <Grid item xs={5} sm={7} md={6} className={classes.itemText}>
                  {item.txid ? `TxID: ${item.txid}`
                    : `Block Hash: ${item.bhash}`}
                </Grid>
                <Grid item xs={3} sm={2} md={1}>#{item.bnum}</Grid>
                <Grid item xs={4} sm={3}>
                  <TimePrep epoch={item.stime} />
                </Grid>
              </Grid>
            )}
            secondary={(
              <span>
                <MCMSuffix value={item.sendtotal} /> from {(
                  item.srctag === '420000000e00000001000000'
                    ? `ω+${item.srcaddr.slice(0, 24)}...` : `τ-${item.srctag}`
                )} to {(
                  item.dsttag === '420000000e00000001000000'
                    ? `ω+${item.dstaddr.slice(0, 24)}...` : `τ-${item.dsttag}`
                )}
              </span>
            )}
          />
        </SubListItem>
      ))}
    </SubList>
  );
}

function LedgerBalanceSearch ({ type, query }) {
  const search = `${type}:contains=${query}`;
  const request = useGetLedgerBalanceBySearchQuery({ search });
  const classes = useSubStyles();
  const subheadingType =
    `Ledger Balance ${type === 'address' ? 'Addresses' : 'Tags'}`;

  return (
    <SubList type={subheadingType} query={query} req={request}>
      {request.data && request.data.results.map((item, index) => (
        <SubListItem
          key={index} to={`/explorer/ledger/${type}/${item[type]}`}
        >
          <ListItemIcon className={classes.itemIcon}>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText
            className={classes.itemText}
            primary={(
              <span>
                {item.tag !== '420000000e00000001000000' && (
                  <span>τ-{item.tag}&emsp;</span>
                )}{`ω+${item.address}`}
              </span>
            )}
            secondary={(
              <span>
                <MCMSuffix value={item.balance} /> on Aeon {item.bnum >> 8}
              </span>
            )}
          />
        </SubListItem>
      ))}
    </SubList>
  );
}

export default function Explorer () {
  const classes = useStyles();
  const { search } = useLocation();
  const searchParams = search && new URLSearchParams(search);
  const searchType = search && searchParams.get('search');
  const searchQuery = search && searchParams.get('for');

  return (
    <Container className={classes.root}>
      {search ? (
        <>
          <Typography className={classes.searchTitle} variant='h2'>
            Search Results
          </Typography>
          <List dense>
            {(!searchType || searchType === 'node') && (
              <NodeSearch query={searchQuery} />
            )}{(!searchType || searchType === 'blockchain') && (
              <BlockchainSearch query={searchQuery} />
            )}{(!searchType || searchType === 'transaction') && (
              <TransactionSearch query={searchQuery} />
            )}{(!searchType || searchType === 'address') && (
              <LedgerBalanceSearch type='address' query={searchQuery} />
            )}{(!searchType || searchType === 'tag') && (
              <LedgerBalanceSearch type='tag' query={searchQuery} />
            )}
          </List>
        </>
      ) : (
        <>
          <Typography className={classes.explorerTitle} variant='h1'>
            Mochimo Explorer
          </Typography>
          <ExplorerSearchForm />
          <MochimoActivityFeed />
        </>
      )}
    </Container>
  );
}
