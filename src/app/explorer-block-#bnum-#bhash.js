
import {
  useGetBlockByNumberQuery,
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
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MochimoBlockId from './component/MochimoBlockId';
import MochimoTransactions from './component/MochimoTransactions';
import TabPanel from './component/TabPanel';
import LabelValue from './component/LabelValue';
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
  maxWidth: {
    'max-width': '90vw'
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

const DateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

export default function Block () {
  const { bnum, bhash } = useParams();
  const [tab, setTab] = useState(1);
  const block = useGetBlockByNumberQuery({ number: bnum });
  const classes = useStyles();
  const { columnFlex, innerSpacing, outerSpacing, maxWidth, tagwots } = classes;

  const handleTab = (e, selectedTab) => setTab(selectedTab);

  let qrTabError = null;
  let txTabError = null;
  if (block.isFetching) {
    qrTabError = txTabError = 'waiting for validated block data...';
  } else if (block.isError) {
    qrTabError = txTabError = 'an error occurred (╥﹏╥)';
  }

  return (
    <Container className={clsx(columnFlex, innerSpacing)}>
      <Typography noWrap className={clsx(tagwots, outerSpacing)}>
        <MochimoBlockId number={bnum} hash={bhash} disableLinks />
      </Typography>
      <Card className={clsx(innerSpacing, outerSpacing, maxWidth)}>
        <Typography variant='h6' align='center'>
          Block Statistics<br /> switch to tabbed data?
        </Typography>
        {block.isFetching
          ? <CircularProgress size='4rem' />
          : (
            <>
              <LabelValue label='Block Type:' value={block.data?.type} />
              <LabelValue label='Block Number:' value={block.data?.bnum} />
              <LabelValue label='Block Hash:' value={block.data?.bhash} />
              <LabelValue label='Prev. Hash:' value={block.data?.phash} />
              <LabelValue label='Merkle Root:' value={block.data?.mroot} />
              <LabelValue label='Nonce:' value={block.data?.nonce} />
            </>
            )}
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
          <QRCode includeMargin value={block.data?.bhash || ''} />
        </TabPanel>
        <TabPanel active={tab === 1} error={txTabError} name='Transactions'>
          <MochimoTransactions bnum={bnum} bhash={bhash} />
        </TabPanel>
        <TabPanel active={tab === 2} error={txTabError} name='Haiku'>
          acb
        </TabPanel>
      </Paper>
    </Container>
  ); /*
        <div className='bdet_main'>
          <ul className='bdet'>
            <li>
              <p>Prev. Hash</p>
              <p>{block?.data?.phash}</p>
            </li>
            <li>
              <p>Hash</p>
              <p>{block?.data?.bhash}</p>
            </li>
            {block.data?.type === 'normal' && (
              <>
                <li>
                  <p>Merkle</p>
                  <p>{block?.data?.mroot}</p>
                </li>
                <li>
                  <p>Nonce</p>
                  <p>{block?.data?.nonce}</p>
                </li>
              </>
            )}
            {block.data?.type === 'normal' && (
              <>
                <li>
                  <p>Miner</p>
                  <p>
                    {block?.data?.maddr && (
                      <Link
                        to={'/explorer/ledger/address/' + block.data.maddr}
                      >
                        {block.data.maddr}
                      </Link>
                    )}
                  </p>
                </li>
                <li>
                  <p>Reward</p>
                  <p>{block.data?.mreward && mcm(block.data.mreward, 9)}</p>
                </li>
                <li>
                  <p>Mining fee</p>
                  <p>{block.data?.mfee && mcm(block.data.mfee)}</p>
                </li>
              </>
            )}
            <li>
              <p>Difficulty</p>
              <p>{block.data?.difficulty}</p>
            </li>
            {block.data?.type === 'normal' && (
              <li>
                <p>Transactions</p>
                <p>{block.data?.tcount}</p>
              </li>
            )}
            {block.data?.type === 'neogenesis' && (
              <li>
                <p>Addresses</p>
                <p>{block.data?.lcount}</p>
              </li>
            )}
            <li>
              <p>Block Size</p>
              {block.data?.size && <p>{preBytes(block.data.size)}</p>}
            </li>
            {block.data?.type === 'normal' && (
              <li>
                <p>Sent Amount</p>
                <p>
                  {block.data?.amount !== undefined &&
                    mcm(block.data.amount, true)}
                </p>
              </li>
            )}
            {block.data?.type === 'neogenesis' && (
              <li>
                <p>Ledger Amount</p>
                <p>~{block.data?.amount && mcm(block.data.amount, 9)}</p>
              </li>
            )}
          </ul>
          {block.data?._id && (
            <Transactions src={block.data?._id} srcType='_id' />
          )}
        </div>
      </div>
    </div>
  ); */
}
