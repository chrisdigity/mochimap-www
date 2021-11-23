
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  useGetLedgerBalancesBySearchQuery,
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
import MochimoAddress from './component/MochimoAddress';
import MochimoTransactions from './component/MochimoTransactions';
import TableRowCells from './component/TableRowCells';
import TabPanel from './component/TabPanel';
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
  table: {
    display: 'block',
    margin: '0 auto',
    background: theme.palette.action.hover,
    'max-width': '95vw',
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
  detailsTable: {
    margin: '0 auto',
    background: theme.palette.action.hover
  },
  txidCell: {
    'max-width': '80vw'
  },
  addressCell: {
    [theme.breakpoints.down('lg')]: {
      'max-width': '55vw'
    },
    [theme.breakpoints.down('md')]: {
      'max-width': '45vw'
    },
    [theme.breakpoints.down('sm')]: {
      'max-width': '20vw'
    },
    [theme.breakpoints.down('xs')]: {
      'max-width': '22vw'
    }
  },
  detailsAddressCell: {
    [theme.breakpoints.down('md')]: {
      'max-width': '70vw'
    },
    [theme.breakpoints.down('sm')]: {
      'max-width': '55vw'
    },
    [theme.breakpoints.down('xs')]: {
      'max-width': '40vw'
    }
  },
  xsDownHide: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  smOnlyHide: {
    [theme.breakpoints.only('sm')]: {
      display: 'none'
    }
  }
}));

const Blank = '----';
const DEFAULT_TAG = '420000000e00000001000000';
const isUntagged = (tag) => ['00', '42'].includes(tag.slice(0, 2));
const splitTransaction = (tx, address) => {
  const stxs = [];
  // deconstruct transaction elements
  const { srcaddr, srctag, dstaddr, dsttag, chgaddr, chgtag } = tx;
  // deconstruct transaction
  const sT = tx.sendtotal;
  const cT = tx.changetotal;
  const src = isUntagged(srctag) ? srcaddr : srctag;
  // const dst = isUntagged(dsttag) ? dstaddr : dsttag;
  const chg = isUntagged(chgtag) ? chgaddr : chgtag;
  // derive reference address position
  if ((srctag + srcaddr).includes(address)) address = 'src';
  if ((dsttag + dstaddr).includes(address)) address = 'dst';
  if ((chgtag + chgaddr).includes(address)) address = 'chg';
  // build simple transactions' base object
  const add = { _id: tx._id, time: tx.stime, block: tx.bnum };
  // determine simple transactions by conditional transaction element comparison
  if (address === 'src' && src === chg) { // 1 of 2 simple transactions take place
    if (sT || !cT) { // dst @ -(sT), else chg @ -(cT)
      stxs.push({ ...add, tag: dsttag, address: dstaddr, amount: -(sT) });
    } else stxs.push({ ...add, tag: chgtag, address: chgaddr, amount: -(cT) });
  } else { // 1 OR 2 simple transactions take place
    if ((sT && address !== 'chg') || address === 'dst') {
      if (address === src) { // dst @ -(sT), else src @ sT
        stxs.push({ ...add, tag: dsttag, address: dstaddr, amount: -(sT) });
      } else stxs.push({ ...add, tag: srctag, address: srcaddr, amount: sT });
    } // and/or
    if ((cT && address !== 'dst') || address === 'chg') {
      if (address === src) { // chg @ -(cT), else src @ cT
        stxs.push({ ...add, tag: chgtag, address: chgaddr, amount: -(cT) });
      } else stxs.push({ ...add, tag: srctag, address: srcaddr, amount: cT });
    }
  }
  // return simple transactions
  return stxs;
};

function TransactionRow ({ id, tx, address }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const classes = useStyles();

  const _cid = `${id}-details`;
  const _label = _cid.replace('-', ' ');

  const stxs = splitTransaction(tx, address);
  const txDetailsPreHeadCells = {
    variant: 'head',
    colSpan: 4,
    className: classes.txidCell,
    children: (
      <Typography align='left' variant='body2' noWrap>
        TxID: <Link to={`/explorer/transaction/${tx.txid}`}>{tx.txid}</Link>
        <br />
        <MochimoAddress pre='Source: ' tag={tx.srctag} addr={tx.srcaddr} />
      </Typography>
    )
  };
  const txDetailsHeadCells = [{}, {
    variant: 'head',
    className: classes.detailsAddressCell,
    children: 'Destinations'
  }, {
    variant: 'head', children: 'Fee', align: 'right'
  }, {
    variant: 'head', children: 'Amount', align: 'right'
  }];
  const txDetailsCells = [
    ...(tx.dstarray ? tx.dstarray.map((dst) => [{},
      { // mdtx destination entries
        className: classes.detailsAddressCell,
        children: (
          <Typography variant='body2' noWrap>
            <MochimoAddress tag={dst.tag} />
          </Typography>
        )
      }, {
        children: (<MCMSuffix value={dst.fee} disableUnits />), align: 'right'
      }, {
        children: (<MCMSuffix value={dst.amount} />), align: 'right'
      }
    ]) : [[{},
      { // non-mdtx transaction destination entry
        className: classes.detailsAddressCell,
        children: (
          <Typography variant='body2' noWrap>
            <MochimoAddress tag={tx.dsttag} addr={tx.dstaddr} />
          </Typography>
        )
      }, {
        children: (<MCMSuffix value={tx.txfee} disableUnits />), align: 'right'
      }, {
        children: (<MCMSuffix value={tx.sendtotal} />), align: 'right'
      }
    ]]), [{},
      { // change entry
        className: classes.detailsAddressCell,
        children: (
          <Typography variant='body2' noWrap>
            <MochimoAddress pre='Change: ' tag={tx.chgtag} addr={tx.chgaddr} />
          </Typography>
        )
      }, {
        children: null, align: 'right'
      }, {
        children: (<MCMSuffix value={tx.changetotal} />), align: 'right'
      }
    ]
  ];

  return (
    <>
      {stxs.map((stx, index) => {
        let children = null;
        if (index < stxs.length) { // not last
          children = (
            <IconButton size='small' onClick={handleOpen}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          );
        }
        const stxCells = [
          { children }, {
            className: classes.addressCell,
            children: (
              <Typography noWrap>
                <MochimoAddress tag={stx.tag} addr={stx.address} />
              </Typography>
            )
          }, {
            children: (
              <Typography noWrap>
                <TimePrep epoch={stx.time} />
              </Typography>
            )
          }, {
            className: classes.xsDownHide,
            children: (
              <Typography noWrap>
                {stx.block}
              </Typography>
            )
          }, {
            className: classes.xsDownHide,
            children: (
              <Typography noWrap>
                {stx.amount < 0 ? 'OUT' : 'IN'}
              </Typography>
            ),
            align: 'right'
          }, {
            children: (
              <Typography noWrap>
                <MCMSuffix value={stx.amount} />
              </Typography>
            ),
            align: 'right'
          }
        ];
        return (<TableRowCells key={`${id}-stx-${index}`} cells={stxCells} />);
      })}
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Table
              size='small'
              className={classes.detailsTable}
              aria-label={_label}
            >
              <TableHead>
                <TableRowCells id={`${_cid}`} cells={txDetailsPreHeadCells} />
                <TableRowCells id={`${_cid}-head`} cells={txDetailsHeadCells} />
              </TableHead>
              <TableBody>
                {txDetailsCells.map((cells, index) => {
                  const sid = `${_cid}-body-${index}`;
                  return (<TableRowCells key={sid} id={sid} cells={cells} />);
                })}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function NeogenesisRow ({ id, data }) {
  const classes = useStyles();

  const sid = `${id}-balance`;
  const cells = [
    {
      children: (
        <Typography noWrap><MCMSuffix value={data.balance} /></Typography>
      )
    }, {
      children: (
        <Typography noWrap>
          <TimePrep epoch={data.timestamp} />
        </Typography>
      )
    }, {
      className: classes.xsDownHide,
      children: (
        <Typography noWrap>{data.bnum}</Typography>
      )
    }, {
      className: classes.xsDownHide,
      children: (
        <Typography noWrap>{`Æ${data.bnum >> 8}`}</Typography>
      )
    }, {
      children: (
        <Typography noWrap><MCMSuffix value={data.delta} /></Typography>
      ),
      align: 'right'
    }
  ];

  return (<TableRowCells key={sid} id={sid} cells={cells} />);
}

function TransactionHistory ({ ledger, type, address }) {
  const searchAddress = ledger.data?.[type].slice(0, 64) || address;
  const searchObject = { [type]: searchAddress };
  const search = new URLSearchParams(searchObject).toString() + '&perpage=32';
  const history = useGetTransactionsBySearchQuery({ search });
  const classes = useStyles();

  const _cid = 'transation-history-table';
  const _label = _cid.replace('-', ' ');

  const sidHead = `${_cid}-head`;
  const tableHeadCells = [
    { variant: 'head' },
    { variant: 'head', children: 'Reference' },
    { variant: 'head', children: 'Time' },
    { variant: 'head', className: classes.xsDownHide, children: 'Block' },
    { variant: 'head', className: classes.xsDownHide },
    { variant: 'head', children: 'Amount', align: 'right' }
  ];

  if (history.isFetching) return (<CircularProgress size='4rem' />);
  if (history.isError) {
    return (
      <>
        <Typography variant='h6'>Cannot Display Transaction History</Typography>
        <Typography variant='caption'>
          Reason: {history.error?.data?.error}
        </Typography>
      </>
    );
  }
  return (
    <TableContainer component={Container} className={classes.innerSpacing}>
      <Table size='small' className={classes.table} aria-label={_label}>
        <TableHead>
          <TableRowCells key={sidHead} id={sidHead} cells={tableHeadCells} />
        </TableHead>
        <TableBody>
          {history.data?.results.map((tx, ii) => {
            const sid = `${_cid}-${ii}`;
            return (
              <TransactionRow key={sid} id={sid} address={address} tx={tx} />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function NeogenesisHistory ({ ledger, type, address }) {
  const searchObject = { [type]: ledger.data?.[type].slice(0, 64) || address };
  const search = new URLSearchParams(searchObject).toString() + '&perpage=32';
  const history = useGetLedgerBalancesBySearchQuery({ search });
  const classes = useStyles();

  const _cid = 'balance-history-table';
  const _label = _cid.replace('-', ' ');

  const sidHead = `${_cid}-head`;
  const tableHeadCells = [
    { variant: 'head', children: 'NG-Balance' },
    { variant: 'head', children: 'Time' },
    { variant: 'head', className: classes.xsDownHide, children: 'Block' },
    { variant: 'head', className: classes.xsDownHide, children: 'Aeon' },
    { variant: 'head', children: 'NG-Delta', align: 'right' }
  ];

  if (history.isFetching) return (<CircularProgress size='4rem' />);
  if (history.isError) {
    return (
      <>
        <Typography variant='h6'>Cannot Display Transaction History</Typography>
        <Typography variant='caption'>
          Reason: {history.error?.data?.error}
        </Typography>
      </>
    );
  }
  return (
    <TableContainer component={Container} className={classes.innerSpacing}>
      <Table size='small' className={classes.table} aria-label={_label}>
        <TableHead>
          <TableRowCells key={sidHead} id={sidHead} cells={tableHeadCells} />
        </TableHead>
        <TableBody>
          {history.data.results?.map((data, ii) => {
            const sid = `${_cid}-${ii}`;
            return (
              <NeogenesisRow key={sid} id={sid} data={data} />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function ExplorerLedgerTypeAddress () {
  const { type, address } = useParams();
  const ledger = useGetLedgerEntryByTypeAddressQuery({ type, address });
  const [wots, setWots] = useState(type === 'address' && address);
  const [tag, setTag] = useState(type === 'tag' && address);
  const [tab, setTab] = useState(1);
  const classes = useStyles();

  const { columnFlex, innerSpacing, outerSpacing, tagwots } = classes;
  const handleTab = (e, selectedTab) => { setTab(selectedTab); };

  useEffect(() => {
    if (ledger.data) {
      setWots(ledger.data.address);
      setTag(ledger.data.tag);
    }
  }, [type, address, ledger.data]);

  let qrTabError = null;
  let txTabError = null;
  if (ledger.isFetching) {
    qrTabError = txTabError = 'waiting for validated ledger data...';
  } else if (ledger.isError) {
    qrTabError = txTabError = 'an error occurred (╥﹏╥)';
  } else if (ledger.data?.tag === DEFAULT_TAG) {
    qrTabError = 'MochiMap only supports a QR code for tagged addresses...';
  }

  return (
    <Container className={clsx(columnFlex, innerSpacing)}>
      <Typography noWrap className={clsx(tagwots, outerSpacing)}>
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
        {ledger.isFetching
          ? (<CircularProgress size='6rem' color='secondary' />)
          : (
            <Typography variant='h1'>
              {ledger.isError
                ? (<ErrorIcon />)
                : (<MCMSuffix value={ledger.data.balance} disableUnits />)}
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
          {ledger.isFetching || ledger.isError
            ? (Blank)
            : (
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
          <Tab label='Transactions' />
          <Tab label='Neogenesis' />
        </Tabs>
        <TabPanel active={tab === 0} error={qrTabError} name='QR Code'>
          <QRCode includeMargin value={ledger.data?.tag || ''} />
        </TabPanel>
        <TabPanel active={tab === 1} error={txTabError} name='Transactions'>
          <MochimoTransactions addr={ledger.data?.[type]} addrType={type} />
        </TabPanel>
        <TabPanel active={tab === 2} error={txTabError} name='Neogenesis'>
          <NeogenesisHistory ledger={ledger} type={type} address={address} />
        </TabPanel>
      </Paper>
    </Container>
  );
}
