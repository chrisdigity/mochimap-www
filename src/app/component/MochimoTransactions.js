
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useGetTransactionsBySearchQuery } from '../service/mochimap-api';
import {
  Button,
  Card,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import MochimoTransactionId from './MochimoTransactionId';
import MochimoAddress from './MochimoAddress';
import TableRowCells from './TableRowCells';
import MCMSuffix from './MCMSuffix';
import TimePrep from './TimePrep';

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
    padding: theme.spacing(2),
    paddingTop: 0,
    'text-align': 'center'
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
  preHeadCell: {
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
  txidCell: {
    [theme.breakpoints.down('md')]: {
      'max-width': '100vw'
    },
    [theme.breakpoints.down('sm')]: {
      'max-width': '48vw'
    },
    [theme.breakpoints.down('xs')]: {
      'max-width': '43vw'
    }
  },
  xsUpHide: {
    [theme.breakpoints.up('xs')]: {
      display: 'none'
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
  if ((address === 'src' && src === chg)) {
    // 1 of 2 simple transactions take place
    if (sT || !cT) { // dst @ -(sT), else chg @ -(cT)
      stxs.push({ ...add, tag: dsttag, address: dstaddr, amount: -(sT) });
    } else stxs.push({ ...add, tag: chgtag, address: chgaddr, amount: -(cT) });
  } else { // 1 OR 2 simple transactions take place
    if ((sT && address !== 'chg') || address === 'dst') {
      if (address === src) { // dst @ -(sT), else src @ sT
        stxs.push({ ...add, tag: dsttag, address: dstaddr, amount: -(sT) });
      } else stxs.push({ ...add, tag: srctag, address: srcaddr, amount: sT });
    } // and/or
    if (address && ((cT && address !== 'dst') || address === 'chg')) {
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
    className: classes.preHeadCell,
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
        if (index === stxs.length - 1) { // not last
          children = (
            <IconButton size='small' onClick={handleOpen}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          );
        }
        const stxCells = [
          { children }, {
            className: address ? classes.addressCell : classes.txidCell,
            children: (
              <Typography noWrap>
                {!address
                  ? (<MochimoTransactionId txid={tx.txid} />)
                  : (<MochimoAddress tag={stx.tag} addr={stx.address} />)}
              </Typography>
            )
          }, {
            className: !address && classes.xsUpHide,
            children: (
              <Typography noWrap>
                <TimePrep epoch={stx.time} />
              </Typography>
            )
          }, {
            className: address ? classes.xsDownHide : classes.xsUpHide,
            children: (
              <Typography noWrap>
                {stx.block}
              </Typography>
            )
          }, {
            className: address ? classes.xsDownHide : classes.xsUpHide,
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

export default function MochimoTransactions ({ addr, addrType, bnum, bhash }) {
  const [page, setPage] = useState(1);
  const [perpage, setPerpage] = useState(25);
  // build default search parameters
  const defaultSearch = { page, perpage };
  if (bhash) Object.assign(defaultSearch, { bhash });
  if (bnum) Object.assign(defaultSearch, { bnum });
  else Object.assign(defaultSearch, { [addrType]: addr });
  // end default search parameters
  const search = new URLSearchParams(defaultSearch);
  const transactions = useGetTransactionsBySearchQuery({ search: search.toString() });
  const classes = useStyles();

  const handleChangePage = (event, newpage) => setPage(newpage + 1);
  const handleChangeRowsPerPage = (event) => {
    setPerpage(parseInt(event.target.value, 10));
  };

  const _cid = 'transation-history-table';
  const _label = _cid.replace('-', ' ');
  const sidHead = `${_cid}-head`;
  const tableHeadCells = [
    { variant: 'head' },
    { variant: 'head', children: 'Reference' },
    {
      variant: 'head',
      className: addr ? classes.xsDownHide : classes.xsUpHide,
      children: 'Time'
    }, {
      variant: 'head',
      className: addr ? classes.xsDownHide : classes.xsUpHide,
      children: 'Block'
    }, {
      variant: 'head',
      className: addr ? classes.xsDownHide : classes.xsUpHide
    },
    { variant: 'head', children: 'Amount', align: 'right' }
  ];

  return (
    <TableContainer component={Container} className={classes.innerSpacing}>
      <Table padding='none' size='small' className={classes.table} aria-label={_label}>
        <TableHead>
          <TableRowCells key={sidHead} id={sidHead} cells={tableHeadCells} />
        </TableHead>
        <TableBody>
          {(transactions.isFetching && (
            <TableRow>
              <TableCell colSpan={6} align='center'>
                <CircularProgress color='secondary' />
              </TableCell>
            </TableRow>
          )) || (transactions.isError && (
            <>
              <Typography variant='h6'>
                Cannot Display Transaction History
              </Typography>
              <Typography variant='caption'>
                Reason: {transactions.error?.data?.error}
              </Typography>
            </>
          )) || (
            transactions.data?.results.map((tx, ii) => {
              const sid = `${_cid}-${ii}`;
              return (
                <TransactionRow key={sid} id={sid} address={addr} tx={tx} />
              );
            })
          )}
        </TableBody>
      </Table>
      <TablePagination
        component='div'
        page={page - 1}
        rowsPerPage={perpage}
        rowsPerPageOptions={[25, 50, 100]}
        count={transactions.data?.found || 0}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
