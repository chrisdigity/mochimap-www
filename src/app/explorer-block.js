
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Card, CircularProgress, Container, Divider, Grid, Tab, Tabs, Typography } from '@mui/material';

import { useGetBlocksQuery } from 'api';
import { Address, Amount, Bytes, Properties } from 'app/component/Types';
import { TransactionHistory } from 'app/component/Results';
import { asUint64String } from 'util';
import TimePrep from './component/TimePrep';

const getid = (bnum, bhash) => `b${asUint64String(bnum)}x${bhash.slice(0, 8)}`;

export default function ExplorerBlock ({ type }) {
  const [tab, setTab] = useState('block');
  const { bnum, bhash } = useParams();

  const handleTab = (e, selectedTab) => { setTab(selectedTab); };
  const blocks = useGetBlocksQuery({ bnum, bhash });
  const [block] = blocks.data || [{}];

  if (bnum && !bhash) {
    return (<Navigate replace to={`/explorer/block?search=${bnum}`} />);
  }

  return (
    <Container sx={{ position: 'relative', padding: ({ spacing }) => spacing(2) }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} align='left'>
          <Card sx={{ padding: ({ spacing }) => spacing(2) }}>
            <Tabs
              centered
              value={tab}
              onChange={handleTab}
              textColor='primary'
              indicatorColor='secondary'
              aria-label='ledger details tabs'
            >
              <Tab label='Block Data' value='block' />
              <Tab label='Mining Data' value='mining' />
            </Tabs>
            {blocks.isFetching
              ? (<CircularProgress size='6rem' color='secondary' />)
              : (tab === 'block' && (
                <>
                  <Properties copy identifier={getid(bnum, bhash)} />
                  <Properties
                    filesize={(
                      <>
                        <Bytes bytes={block.size} />&nbsp;
                        <Typography display='inline' variant='caption'>
                          (<Bytes noPrefix bytes={block.size} />)
                        </Typography>
                      </>
                    )}
                  />
                  <Properties
                    transactions={(
                      <>
                        {block.count}&nbsp;
                        <Typography display='inline' variant='caption'>
                          (<Amount value={block.amount} />)
                        </Typography>
                      </>
                    )}
                  />
                  <Properties
                    bnum={(
                      <>
                        {bnum}&nbsp;
                        <Typography display='inline' variant='caption'>
                          (0x{Number(bnum).toString(16)})
                        </Typography>
                      </>
                    )}
                  />
                  <Properties blocktime={(<span>{block.time} seconds</span>)} />
                  <Properties
                    created={<TimePrep epoch={Date.parse(block.created)} />}
                  />
                  <Properties difficulty={block.difficulty} />
                </>
                )) || (tab === 'mining' && (
                  <>
                    <Address href wots={block.maddr} />
                    <Properties bhash={block.bhash} />
                    <Properties phash={block.phash} />
                    <Properties mroot={block.mroot} />
                    <Properties nonce={block.nonce} />
                  </>
                ))}
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} align='center'>
          {(block?.nonce && (
            <>
              <Typography>
                Haiku art coming soon!
              </Typography>
            </>
          )) || (
            <Typography align='center'>
              Waiting for Block data
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Divider>Block Transactions</Divider>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TransactionHistory {...{ bnum, bhash }} />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
