
import {
  useGetBlockByNumberQuery
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
import MochimoTransactions from './component/MochimoTransactions';
import LabelValue from './component/LabelValue';
import { capitalize, preBytes } from 'utils';
import MochimoBalance from './component/MochimoBalance';
import MochimoAddress from './component/MochimoAddress';
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
  blockId: {
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
  let { bnum, bhash, bid } = useParams();
  const [tab, setTab] = useState(0);
  const block = useGetBlockByNumberQuery({ number: bnum });
  const classes = useStyles();

  const handleTab = (e, selectedTab) => setTab(selectedTab);

  if (!block.isFetching && !block.isError) {
    bnum = block.data?.bnum;
    bhash = block.data?.bhash;
    bid = block.data?._id.replace(/^0{0,15}/, '0x');
  }

  return (
    <Container className={classes.column}>
      <Typography noWrap className={classes.blockId}>
        <MochimoBlockId number={bnum} hash={bhash} disableLinks />
      </Typography>
      <Typography noWrap variant='h4' className={classes.haiku}>
        <q>{block.data?.img?.haiku}</q>
        <Typography className={classes.haiku} display='inline'>
          &emsp; - 0x{bnum.toString(16)}
        </Typography>
      </Typography>
      <Card className={classes.card}>
        <Tabs
          value={tab}
          onChange={handleTab}
          textColor='primary'
          indicatorColor='secondary'
          aria-label='block details'
        >
          <Tab label={capitalize(block.data?.type || '') + ' Block'} />
          <Tab label='Mining Data' />
          <Tab label='Transactions' />
        </Tabs>
        {(block.isError && (
          <>
            <Typography variant='h6'>an error occurred (╥﹏╥)</Typography>
            <Typography variant='caption'>
              Error: {block.error?.data?.error}
            </Typography>
          </>
        )) || (block.isFetching && (
          <CircularProgress size='4rem' />
        )) || (tab === 0 && (
          <Container className={classes.content}>
            <LabelValue name='Identification:'>{bid}</LabelValue>
            <LabelValue name='File Size:'>
              <span>
                {preBytes(block.data?.size)}&nbsp;
                <span className={classes.small}>
                  ({preBytes(block.data?.size, 0)})
                </span>
              </span>
            </LabelValue>
            <LabelValue name='Created:'>
              <TimePrep epoch={block.data?.stime} />
            </LabelValue>
            <LabelValue name='Transactions:'>
              <span>
                {block.data?.tcount}&nbsp;
                <span className={classes.small}>
                  (<MochimoBalance value={block.data?.amount} />)
                </span>
              </span>
            </LabelValue>
            <LabelValue name='Block Time:'>
              <span>{block.data?.stime - block.data?.time0} seconds</span>
            </LabelValue>
            <LabelValue name='Difficulty:'>
              {block.data?.difficulty}
            </LabelValue>
          </Container>
        )) || (tab === 1 && (
          <Container className={classes.content}>
            <LabelValue name='Miner:'>
              <MochimoAddress short addr={block.data?.maddr} />
            </LabelValue>
            <LabelValue name='Block Hash:' trunc={0.5}>
              {block.data?.bhash}
            </LabelValue>
            <LabelValue name='Prev. Hash:' trunc={0.5}>
              {block.data?.phash}
            </LabelValue>
            <LabelValue name='Merkle Root:' trunc={0.5}>
              {block.data?.mroot}
            </LabelValue>
            <LabelValue name='Nonce:' sep='/' trunc={0.5}>
              {block.data?.nonce}
            </LabelValue>
          </Container>
        )) || (tab === 2 && (
          <MochimoTransactions bnum={bnum} bhash={bhash} />
        ))}
      </Card>
    </Container>
  );
}
