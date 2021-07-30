
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  useGetLedgerEntryByTypeAddressQuery,
  useGetTransactionsBySearchQuery
} from './service/mochimap-api';
import {
  Card,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ErrorIcon from '@material-ui/icons/Error';
import MCMSuffix from './component/MCMSuffix';
import TimePrep from './component/TimePrep';
import QRCode from 'qrcode.react';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  columnFlex: {
    display: 'flex',
    'flex-direction': 'column',
    position: 'relative',
    alignItems: 'center'
  },
  outerSpacing: {
    margin: theme.spacing(1)
  },
  innerSpacing: {
    padding: theme.spacing(2)
  },
  ellipsis: {
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap'
  },
  table: {
    background: theme.palette.action.hover,
    '& td, & th': {
      'padding-top': theme.spacing(0.25),
      'padding-bottom': theme.spacing(0.25),
      'padding-left': theme.spacing(1),
      'padding-right': theme.spacing(1)
    }
  },
  tagwots: {
    'max-width': '80vw'
  },
  transactionRow: {
    '& > *': {
      borderBottom: 'unset'
    }
  },
  addressCell: {
    'max-width': '40vw'
  },
  subTableHeader: {
    'max-width': '80vw'
  },
  xsDownNone: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  smNone: {
    [theme.breakpoints.only('sm')]: {
      display: 'none'
    }
  }
}));

const Blank = '----';
const DEFAULT_TAG = '420000000e00000001000000';
const isUntagged = (addr) => ['00', '42'].includes(addr.slice(0, 2));

function TransactionSimpleRow ({ data, open, handleOpen }) {
  const { ref, refType, amount, time, block } = data;
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell padding='none'>
        {typeof open !== 'undefined' && (
          <IconButton size='small' aria-label='open tx' onClick={handleOpen}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        )}
      </TableCell>
      <TableCell className={clsx(classes.xsDownNone, classes.addressCell)}>
        <Typography noWrap>
          <Link to={`/explorer/ledger/${refType}/${ref}`}>
            {refType === 'tag' ? 'τ-' : 'ω+'}{ref}
          </Link>
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap>
          <TimePrep epoch={time} />
        </Typography>
      </TableCell>
      <TableCell className={classes.smNone}>
        <Typography noWrap>
          {block}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap>
          {amount < 0 ? 'OUT' : 'IN'}
        </Typography>
      </TableCell>
      <TableCell align='right'>
        <Typography noWrap>
          <MCMSuffix value={amount} />
        </Typography>
      </TableCell>
    </TableRow>
  );
}

function TransactionPartRow ({ pre, addressType, address, amount, fee }) {
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell className={classes.addressCell}>
        <Typography variant='body2' noWrap>
          {pre || ''}
          <Link to={`/explorer/ledger/${addressType}/${address}`}>
            {addressType === 'tag' ? 'τ-' : 'ω+'}{address}
          </Link>
        </Typography>
      </TableCell>
      <TableCell align='right'>
        {fee ? <MCMSuffix value={fee} disableUnits /> : null}
      </TableCell>
      <TableCell align='right'><MCMSuffix value={amount} /></TableCell>
    </TableRow>
  );
}

function TransactionRow ({ tx, address }) {
  const [simpleTransactions, setSimpleTransactions] = useState([]);
  const [lastIndex, setLastIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const classes = useStyles();

  useEffect(() => {
    const { srcaddr, srctag, dstaddr, dsttag, chgaddr, chgtag, _id } = tx;
    const change = tx.changetotal;
    const send = tx.sendtotal;
    const src = isUntagged(srctag) ? srcaddr : srctag;
    const dst = isUntagged(dsttag) ? dstaddr : dsttag;
    const chg = isUntagged(chgtag) ? chgaddr : chgtag;
    const srcType = isUntagged(srctag) ? 'address' : 'tag';
    const dstType = isUntagged(dsttag) ? 'address' : 'tag';
    const chgType = isUntagged(chgtag) ? 'address' : 'tag';
    const add = { _id, time: tx.stime, block: tx.bnum };
    // when address === src and src === chg; 1 of 2 simple transactions take place...
    /// add from src to dst at sendtotal, if sendtotal or !changetotal
    /// add from src to chg at changetotal, if changetotal
    // when src !== chg; 1 OR 2 simple transactions take place...
    /// add from src to dst at sendtotal, if sendtotal
    /// add from src to chg at changetotal, if changetotal
    const stxs = [];
    if (address === src && src === chg) {
      if (send || !change) {
        stxs.push({ refType: dstType, ref: dst, amount: -(send), ...add });
      } else {
        stxs.push({ refType: chgType, ref: chg, amount: -(change), ...add });
      }
    } else {
      if ((send && address !== chg) || address === dst) {
        if (address === src) {
          stxs.push({ refType: dstType, ref: dst, amount: -(send), ...add });
        } else {
          stxs.push({ refType: srcType, ref: src, amount: send, ...add });
        }
      }
      if ((change && address !== dst) || address === chg) {
        if (address === src) {
          stxs.push({ refType: chgType, ref: chg, amount: -(change), ...add });
        } else {
          stxs.push({ refType: srcType, ref: src, amount: change, ...add });
        }
      }
    }
    // store simple transactions and "last index"
    if (stxs.length) {
      setLastIndex(stxs.length - 1);
      setSimpleTransactions(stxs);
    }
  }, [tx, address]);

  return (
    <>
      {simpleTransactions.map((data, index) => (
        <TransactionSimpleRow
          key={`stx-${index}-${data._id}`}
          handleOpen={index === lastIndex ? handleOpen : () => {}}
          open={index === lastIndex ? open : undefined}
          data={data}
        />
      ))}
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Table
              size='small'
              className={classes.table}
              aria-label='transaction destinations'
            >
              <TableHead>
                <TableRow>
                  <TableCell colSpan={3} className={classes.subTableHeader}>
                    <Typography align='left' variant='body2' noWrap>
                      TxID:&nbsp;
                      <Link to={`/explorer/transaction/${tx.txid}`}>
                        {tx.txid}
                      </Link>
                      <br />
                      <MCMSuffix value={tx.changetotal} />
                      <span> • Change: </span>
                      <Link to={`/explorer/ledger/tag/${tx.chgtag}`}>
                        τ-{tx.chgtag}
                      </Link>
                      <br />
                      <span>Source: </span>
                      <Link to={`/explorer/ledger/tag/${tx.srctag}`}>
                        τ-{tx.srctag}
                      </Link>
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.addressCell}>
                    Destinations
                  </TableCell>
                  <TableCell align='right'>Fee</TableCell>
                  <TableCell align='right'>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tx.dstarray ? tx.dstarray.map((dst, index) => (
                  <TransactionPartRow
                    key={`txpart-${index}-${tx._id}`}
                    type='tag'
                    address={dst.tag}
                    amount={dst.amount}
                    fee={tx.txfee}
                  />
                )) : (
                  <TransactionPartRow
                    addressType={isUntagged(tx.dsttag) ? 'address' : 'tag'}
                    address={isUntagged(tx.dsttag) ? tx.dstaddr : tx.dsttag}
                    amount={tx.sendtotal}
                    fee={tx.txfee}
                  />
                )}
                <TransactionPartRow
                  pre='Change: '
                  addressType={isUntagged(tx.chgtag) ? 'address' : 'tag'}
                  address={isUntagged(tx.chgtag) ? tx.chgaddr : tx.chgtag}
                  amount={tx.changetotal}
                />
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function TransactionHistory ({ ledger, type, address }) {
  const searchObject = { [type]: ledger.data?.[type].slice(0, 64) || address };
  const search = new URLSearchParams(searchObject).toString() + '&perpage=32';
  const history = useGetTransactionsBySearchQuery({ search });
  const classes = useStyles();

  return (
    <TableContainer component={Container} className={classes.innerSpacing}>
      <Table
        size='small'
        className={classes.table}
        aria-label='transaction history table'
      >
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell className={classes.xsDownNone}>Reference</TableCell>
            <TableCell>Time</TableCell>
            <TableCell className={classes.smNone}>Block</TableCell>
            <TableCell />
            <TableCell align='right'>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.isLoading ? (
            <TableRow>
              <TableCell align='center' colSpan={6}>
                <CircularProgress size='4rem' />
              </TableCell>
            </TableRow>
          ) : history.data?.results.map((tx) => (
            <TransactionRow
              key={`txrow-${tx._id}`}
              address={searchObject.tag || searchObject.address}
              tx={tx}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function BalanceHistory () {
  return null;
}

function TabPanel (props) {
  const { name, active, ledger, showError, check, reason, children } = props;

  return active ? (
    <>
      {check || ledger.isFetching || (showError && ledger.isError) ? (
        <>
          <Typography variant='h6'>Cannot Display {name}</Typography>
          <Typography variant='caption'>
            Reason: {check ? reason : ledger.isFetching ? (
              'waiting for validated ledger data...'
            ) : 'an error occurred (╥﹏╥)'}
          </Typography>
        </>
      ) : children}
    </>
  ) : null;
}

export default function ExplorerLedgerTypeAddress () {
  const { type, address } = useParams();
  const ledger = useGetLedgerEntryByTypeAddressQuery({ type, address});
  const [wots, setWots] = useState(type === 'address' && address);
  const [tag, setTag] = useState(type === 'tag' && address);
  const [tab, setTab] = useState(1);
  const classes = useStyles();

  const { columnFlex, innerSpacing, outerSpacing, ellipsis, tagwots } = classes;
  const handleTab = (e, selectedTab) => { setTab(selectedTab); };

  useEffect(() => {
    if (ledger.data) {
      setWots(ledger.data.address);
      setTag(ledger.data.tag);
    }
  }, [type, address, ledger.data]);

  return (
    <Container className={clsx(columnFlex, innerSpacing)}>
      <Typography className={clsx(ellipsis, tagwots, outerSpacing)}>
        <Typography component='span' display='inline' color='textSecondary'>
          τag:&nbsp;
        </Typography>
        <Typography component='span' display='inline' color='textPrimary'>
          {tag || Blank}
        </Typography>
        <span> • </span>
        <Typography component='span' display='inline' color='textSecondary'>
          ωots:&nbsp;
        </Typography>
        <Typography component='span' display='inline' color='textPrimary'>
          {wots || Blank}
        </Typography>
      </Typography>
      <Card className={clsx(columnFlex, innerSpacing, outerSpacing)}>
        <Typography variant='h6'>Balance</Typography>
        {ledger.isFetching ? (
          <CircularProgress size='6rem' color='secondary' />
        ) : (
          <Typography variant='h1'>
            {ledger.isError ? <ErrorIcon /> : (
              <MCMSuffix value={ledger.data.balance} disableUnits />
            )}
          </Typography>
        )}
        <Divider />
        <Typography>
          <Typography
            component='span' variant='subtitle2' display='inline'
            color='textSecondary'
          >
            Available:&nbsp;
          </Typography>
          {ledger.isFetching || ledger.isError ? Blank : (
            <Typography
              component='span' variant='subtitle1' display='inline'
              color='textPrimary'
            >
              <MCMSuffix
                decimals={9}
                disableSuffix
                value={ledger.data.balance}
              />
            </Typography>
          )}
        </Typography>
      </Card>
      <Paper className={clsx(classes.columnFlex, classes.outerSpacing)}>
        <Tabs
          value={tab}
          onChange={handleTab}
          textColor='primary'
          indicatorColor='secondary'
          aria-label='ledger details tabs'
        >
          <Tab label='QR Code' />
          <Tab label='Transaction History' />
          <Tab label='Balance History' />
        </Tabs>
        <TabPanel
          showError
          active={tab === 0}
          name='QR Code'
          ledger={ledger}
          check={ledger.data?.tag === DEFAULT_TAG}
          reason={(
            <span>MochiMap only supports a QR code for tagged addresses</span>
          )}
        >
          <QRCode includeMargin value={ledger.data?.tag || ''} />
        </TabPanel>
        <TabPanel name='Transaction History' active={tab === 1} ledger={ledger}>
          <TransactionHistory ledger={ledger} type={type} address={address} />
        </TabPanel>
        <TabPanel name='Balance History' active={tab === 2} ledger={ledger}>
          <BalanceHistory ledger={ledger} type={type} address={address} />
        </TabPanel>
      </Paper>
    </Container>
  );
}
