
import React, { useState } from 'react';
import {
  useGetBlocksQuery,
  useGetChainQuery,
  useGetLedgerEntryQuery,
  useGetLedgerHistoryQuery,
  useGetRichlistQuery,
  useGetTransactionsQuery
} from 'api';
import {
  Box,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TimePrep from 'app/component/TimePrep';
import Pagination from 'app/component/Pagination';
import { Address, Amount, Properties } from 'app/component/Types';
import { capitalize } from 'util';

export function LoadingScreen (props) {
  return (
    <Box
      textAlign='center'
      sx={{ position: 'absolute', width: '100%', height: '100%' }}
    >
      <Box
        sx={{
          backgroundColor: ({ palette }) => palette.background.default,
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: '70%'
        }}
      />
      <CircularProgress />
    </Box>
  );
}

export function BlockHistory ({ bnum, bhash, maddr, query }) {
  // set default state and handlers
  const [queryType, setQueryType] = useState('bnum');
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const offset = page * limit;
  const handlePageChange = (_event, newpage) => setPage(newpage);
  const handleLimitChange = (event) => {
    const newlimit = Number(event.target?.value);
    setPage(Math.floor(page * limit / newlimit));
    setLimit(newlimit);
  };
  const handleTypeChange = (_event, newType) => {
    setQueryType(newType);
    setPage(0);
  };

  // obtain search address
  let search = new URLSearchParams();
  search.append('offset', offset);
  search.append('limit', limit);
  if (query) {
    switch (queryType) {
      case 'bnum': bnum = query; break;
      case 'bhash': search.append('bhash', query + '*'); break;
      case 'maddr': search.append('maddr', query + '*'); break;
      default: search.append(queryType, query);
    }
  } else if (maddr) search.append('maddr', maddr);
  search = search.toString();

  // perform request and extract length
  const request = useGetBlocksQuery({ bnum, bhash, search });
  const length = request.data?.length;
  const itemProps = [
    { xs: 2, sm: 1.75, md: 1.25 },
    { xs: 6.75, sm: 4, md: 4.5 },
    { sm: 4, md: 4.5, display: { xs: 'none', sm: 'block' } },
    { xs: 3.25, sm: 2.25, md: 1.75, align: 'right' }
  ];

  return (
    <Grid container component={Paper} spacing={0.5} sx={{ padding: '0.5em' }}>
      {query && (
        <Grid item xs={12}>
          <Tabs
            value={queryType} onChange={handleTypeChange}
            centered aria-label='block history search type'
          >
            <Tab label='Block Number' value='bnum' />
            <Tab label='Block Hash' value='bhash' />
            <Tab label='Miner' value='maddr' />
          </Tabs>
        </Grid>
      )}
      <Grid item fontWeight='bold' {...itemProps[0]}>Number</Grid>
      <Grid item fontWeight='bold' {...itemProps[1]}>Block Hash</Grid>
      <Grid item fontWeight='bold' {...itemProps[2]}>Miner</Grid>
      <Grid item fontWeight='bold' {...itemProps[3]}>Time</Grid>
      <Grid item xs={12}><Divider /></Grid>
      <Grid container item spacing={0.5} sx={{ position: 'relative' }}>
        {(request.isError && (
          <Grid item xs={12} align='center'>
            {request.error.data?.error || 'Unknown Error'}...
            &nbsp;{request.error.data?.message || 'No information'}
          </Grid>
        )) || (request.isLoading && (
          <Grid item xs={12} align='center'>Loading...</Grid>
        )) || (!request.data?.length && (
          <Grid item xs={12} align='center'>No Results...</Grid>
        )) || (request.data?.map((row, i) => (
          <React.Fragment key={`block-row-${i}`}>
            <Grid item {...itemProps[0]}>{row.bnum}</Grid>
            <Grid item {...itemProps[1]}>
              <Link href={`/explorer/block/${row.bnum}/${row.bhash}`}>
                <Typography noWrap>{row.bhash}</Typography>
              </Link>
            </Grid>
            <Grid item {...itemProps[2]}>
              {(row.maddr && (<Properties href wots={row.maddr} />)) || (
                <Typography noWrap>
                  {`> [ ${capitalize(row.type)} Block ]`}
                </Typography>
              )}
            </Grid>
            <Grid item {...itemProps[3]}>
              <TimePrep epoch={Date.parse(row.created)} />
            </Grid>
            <Grid item xs={12}><Divider /></Grid>
          </React.Fragment>
        )))}
        {request.isFetching && (<LoadingScreen />)}
        <Grid item xs={12}>
          <Pagination
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            {...{ length, limit, offset }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export function LedgerEntries ({ query }) {
  // perform requests for both tags and WOTS+ addresses
  const requests = [
    useGetLedgerEntryQuery({ type: 'tag', value: query }),
    useGetLedgerEntryQuery({ type: 'address', value: query })
  ];

  return (
    <>
      <Grid container component={Paper} spacing={0.5} sx={{ padding: '0.5em' }}>
        <Grid item xs={6} align='center' fontWeight='bold'>Tag</Grid>
        <Grid item xs={6} align='center' fontWeight='bold'>WOTS+</Grid>
        <Grid item xs={12}><Divider /></Grid>
        <Grid container item spacing={0.5}>
          {requests.map((request, i, { length }) => (
            <React.Fragment key={`ledger-entry-${i}`}>
              <Grid item xs={5.8}>
                <Grid container item>
                  {(request.isError && (
                    <Grid item xs={12} align='center'>
                      {request.error.data?.error || 'Unknown Error'}
                    </Grid>
                  )) || (request.isFetching && (
                    <Grid item xs={12} align='center'>
                      <CircularProgress size='1em' />
                    </Grid>
                  )) || (
                    <>
                      <Grid item xs={12} sm={7} md={9}>
                        <Address
                          href tag={request.data?.tag}
                          wots={request.data?.address}
                        />
                      </Grid>
                      <Grid
                        item sm={5} md={3} align='right'
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                      ><Amount value={request.data?.balance} />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
              {(++i) < length && (
                <Grid item xs={0.2}><Divider orientation='vertical' /></Grid>
              )}
            </React.Fragment>
          ))}
        </Grid>
      </Grid>
    </>
  );
}

export function LedgerHistory ({ type, value, query }) {
  // set default state and handlers
  const [queryType, setQueryType] = useState('tag');
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const offset = page * limit;
  const handlePageChange = (_event, newpage) => setPage(newpage);
  const handleLimitChange = (event) => {
    const newlimit = Number(event.target?.value);
    setPage(Math.floor(page * limit / newlimit));
    setLimit(newlimit);
  };
  const handleTypeChange = (_event, newType) => {
    setQueryType(newType);
    setPage(0);
  };

  // obtain search address
  let search = new URLSearchParams();
  search.append('offset', offset);
  search.append('limit', limit);
  if (query) {
    type = type || queryType;
    value = value || query;
  }
  search = search.toString();

  // perform request and extract length
  const request = useGetLedgerHistoryQuery({ type, value, search });
  const length = request.data?.length;
  const itemProps = [
    { xs: 5, sm: 3.5, md: 5 },
    { md: 1.25, align: 'right', display: { xs: 'none', sm: 'none', md: 'block' } },
    { xs: 3.5, sm: 2.5, md: 1.75, align: 'right' },
    { sm: 3, md: 2, align: 'right', display: { xs: 'none', sm: 'block' } },
    { xs: 3.5, sm: 3, md: 2, align: 'right' }
  ];

  return (
    <Grid container component={Paper} spacing={0.5} sx={{ padding: '0.5em' }}>
      {query && (
        <Grid item xs={12}>
          <Tabs
            value={queryType} onChange={handleTypeChange}
            centered aria-label='ledger history search type'
          >
            <Tab label='Tag' value='tag' />
            <Tab label='Address' value='address' />
          </Tabs>
        </Grid>
      )}
      <Grid item fontWeight='bold' {...itemProps[0]}>Address</Grid>
      <Grid item fontWeight='bold' {...itemProps[1]}>Block</Grid>
      <Grid item fontWeight='bold' {...itemProps[2]}>Time</Grid>
      <Grid item fontWeight='bold' {...itemProps[3]}>Delta</Grid>
      <Grid item fontWeight='bold' {...itemProps[4]}>Balance</Grid>
      <Grid item xs={12}><Divider /></Grid>
      <Grid container item spacing={0.5} sx={{ position: 'relative' }}>
        {(request.isError && (
          <Grid item xs={12} align='center'>
            {request.error.data?.error || 'Unknown Error'}...
            &nbsp;{request.error.data?.message || 'No information'}
          </Grid>
        )) || (request.isLoading && (
          <Grid item xs={12} align='center'>Loading...</Grid>
        )) || (!request.data?.length && (
          <Grid item xs={12} align='center'>No Results...</Grid>
        )) || (request.data?.map((row, i) => (
          <React.Fragment key={`ledger-row-${i}`}>
            <Grid item {...itemProps[0]}>
              <Address href wots={row.address} tag={row.tag} />
            </Grid>
            <Grid item {...itemProps[1]}>{row.bnum}</Grid>
            <Grid item {...itemProps[2]}>
              <TimePrep epoch={Date.parse(row.created)} />
            </Grid>
            <Grid item {...itemProps[3]}>
              <Amount forceSign value={row.delta} />
            </Grid>
            <Grid item {...itemProps[4]}>
              <Amount value={row.balance} />
            </Grid>
            <Grid item xs={12}><Divider /></Grid>
          </React.Fragment>
        )))}
        {request.isFetching && (<LoadingScreen />)}
        <Grid item xs={12}>
          <Pagination
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            {...{ length, limit, offset }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export function RichlistEntries ({ query }) {
  // set default state and handlers
  const [queryType, setQueryType] = useState('rank');
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const offset = page * limit;
  const handlePageChange = (_event, newpage) => setPage(newpage);
  const handleLimitChange = (event) => {
    const newlimit = Number(event.target?.value);
    setPage(Math.floor(page * limit / newlimit));
    setLimit(newlimit);
  };
  const handleTypeChange = (_event, newType) => {
    setQueryType(newType);
    setPage(0);
  };

  // obtain search address
  let search = new URLSearchParams();
  search.append('offset', offset);
  search.append('limit', limit);
  if (query) {
    switch (queryType) {
      case 'rank': search.append('rank', query); break;
      case 'tag': search.append('tag', query + '*'); break;
      case 'address': search.append('address', query + '*'); break;
      default: search.append(queryType, query);
    }
  }
  search = search.toString();

  // perform request and extract length
  const chainRequest = useGetChainQuery();
  const request = useGetRichlistQuery({ search });
  const length = request.data?.length;
  const itemProps = [
    { xs: 2, sm: 1.5, md: 1, align: 'center' },
    { xs: 4, sm: 6.5, md: 8 },
    { xs: 3.5, sm: 2.5, md: 2, align: 'right' },
    { xs: 2.5, sm: 1.5, md: 1, align: 'right' }
  ];
  const localeOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

  return (
    <Grid container component={Paper} spacing={0.5} sx={{ padding: '0.5em' }}>
      {query && (
        <Grid item xs={12} align='center'>
          <Tabs
            value={queryType} onChange={handleTypeChange}
            centered aria-label='richlist search type'
          >
            <Tab label='Rank' value='rank' />
            <Tab label='Tag' value='tag' />
            <Tab label='Address' value='address' />
          </Tabs>
        </Grid>
      )}
      <Grid item fontWeight='bold' {...itemProps[0]}>Rank</Grid>
      <Grid item fontWeight='bold' {...itemProps[1]}>Address</Grid>
      <Grid item fontWeight='bold' {...itemProps[2]}>Balance</Grid>
      <Grid item fontWeight='bold' {...itemProps[3]}>Stake</Grid>
      <Grid container item spacing={0.5} sx={{ position: 'relative' }}>
        {(request.isError && (
          <Grid item xs={12} align='center'>
            {request.error.data?.error || 'Unknown Error'}...
            &nbsp;{request.error.data?.message || 'No information'}
          </Grid>
        )) || (request.isLoading && (
          <Grid item xs={12} align='center'>Loading...</Grid>
        )) || (!request.data?.length && (
          <Grid item xs={12} align='center'>No Results...</Grid>
        )) || (request.data?.map((row, i) => (
          <React.Fragment key={`richlist-row-${i}`}>
            <Grid item {...itemProps[0]}>{row.rank}</Grid>
            <Grid item {...itemProps[1]}>
              <Address href tag={row.tag} wots={row.address} />
            </Grid>
            <Grid item {...itemProps[2]}>
              <Amount value={row.balance} />
            </Grid>
            <Grid item {...itemProps[3]}>
              {(chainRequest.isLoading && (
                <CircularProgress size='1em' />
              )) || (
                `${(100 * row.balance / (
                  chainRequest.data?.totalsupply * 1e+9
                )).toLocaleString(undefined, localeOptions)}%`
              )}
            </Grid>
            <Grid item xs={12}><Divider /></Grid>
          </React.Fragment>
        )))}
        {request.isFetching && (<LoadingScreen />)}
        <Grid item xs={12}>
          <Pagination
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            rowsPerPageOptions={[20, 50, 100]}
            {...{ length, limit, offset }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

const splitTransaction = (tx, reference) => {
  const stxs = [];
  // deconstruct transaction elements
  const { srcaddr, srctag, dstaddr, dsttag, chgaddr, chgtag } = tx;
  // reduce variables footprint
  const sT = tx.sendtotal;
  const cT = tx.changetotal;
  const src = ['00', '42'].includes(srctag.slice(0, 2)) ? srctag : srcaddr;
  // const dst = ['00', '42'].includes(dsttag.slice(0, 2)) ? dsttag : dstaddr;
  const chg = ['00', '42'].includes(chgtag.slice(0, 2)) ? chgtag : chgaddr;
  // derive reference type
  if ((srctag + srcaddr).includes(reference)) reference = 'src';
  if ((dsttag + dstaddr).includes(reference)) reference = 'dst';
  if ((chgtag + chgaddr).includes(reference)) reference = 'chg';
  if (!['src', 'dst', 'chg'].includes(reference)) reference = 'txid';
  // build simple transactions' base object
  const add = { time: tx.confirmed || tx.created, block: tx.bnum };
  // determine simple transactions by conditional transaction element comparison
  if (reference === 'txid') {
    // 1 of 2 simple transactions take place
    if (sT || !cT) { // dst @ -(sT), else chg @ -(cT)
      stxs.push({ ...add, tag: dsttag, address: dstaddr, amount: sT });
    } else stxs.push({ ...add, tag: chgtag, address: chgaddr, amount: cT });
  } else if ((reference === 'src' && src === chg)) {
    // 1 of 2 simple transactions take place
    if (sT || !cT) { // dst @ -(sT), else chg @ -(cT)
      stxs.push({ ...add, tag: dsttag, address: dstaddr, amount: -(sT) });
    } else stxs.push({ ...add, tag: chgtag, address: chgaddr, amount: -(cT) });
  } else { // 1 OR 2 simple transactions take place
    if ((sT && reference !== 'chg') || reference === 'dst') {
      if (reference === 'src') { // dst @ -(sT), else src @ sT
        stxs.push({ ...add, tag: dsttag, address: dstaddr, amount: -(sT) });
      } else stxs.push({ ...add, tag: srctag, address: srcaddr, amount: sT });
    } // and/or
    if (reference && ((cT && reference !== 'dst') || reference === 'chg')) {
      if (reference === 'src') { // chg @ -(cT), else src @ cT
        stxs.push({ ...add, tag: chgtag, address: chgaddr, amount: -(cT) });
      } else stxs.push({ ...add, tag: srctag, address: srcaddr, amount: cT });
    }
  }
  // return simple transactions
  console.log(stxs);
  return stxs;
};

function DestinationRow ({ amount, change, fee, header, tag, wots }) {
  return (header && (
    <Grid container item>
      <Grid item xs={7} sm={8.25} md={9.5}>
        <Typography fontWeight='bold' sx={{ textDecoration: 'underline' }}>
          Destinations
        </Typography>
      </Grid>
      <Grid item xs={1.5} sm={1.25} md={1} align='right'>
        <Typography fontWeight='bold' sx={{ textDecoration: 'underline' }}>
          Fee
        </Typography>
      </Grid>
      <Grid item xs={3.5} sm={2.5} md={1.5} align='right'>
        <Typography fontWeight='bold' sx={{ textDecoration: 'underline' }}>
          Amount
        </Typography>
      </Grid>
    </Grid>
  )) || (
    <Grid container item spacing={0}>
      <Grid item xs={7} sm={8.25} md={9.5}>
        {change
          ? (<Address href change {...{ tag, wots }} />)
          : (<Address href {...{ tag, wots }} />)}
      </Grid>
      <Grid item xs={1.5} sm={1.25} md={1} align='right'>
        <Amount value={fee} noUnits />
      </Grid>
      <Grid item xs={3.5} sm={2.5} md={1.5} align='right'>
        <Amount value={amount} />
      </Grid>
    </Grid>
  );
}

function TransactionRow ({ header, open, reference, tx }) {
  const [active, setActive] = useState(open);
  const handleActive = () => setActive(!active);
  const itemProps = [
    { xs: 1, sm: 0.75, md: 0.5 },
    { xs: 4, sm: 4.5, md: 7.5 },
    { sm: 1.75, md: 1, align: 'right', display: { xs: 'none', sm: 'block' } },
    { xs: 3.5, sm: 2.5, md: 1.5, align: 'right' },
    { xs: 3.5, sm: 2.5, md: 1.5, align: 'right' }
  ];

  return (header && (
    <>
      <Grid item fontWeight='bold' {...itemProps[0]} />
      <Grid item fontWeight='bold' {...itemProps[1]}>Reference</Grid>
      <Grid item fontWeight='bold' {...itemProps[2]}>Block</Grid>
      <Grid item fontWeight='bold' {...itemProps[3]}>Time</Grid>
      <Grid item fontWeight='bold' {...itemProps[4]}>Amount</Grid>
    </>
  )) || (
    <>
      {splitTransaction(tx, reference).map((stx, i, { length }) => (
        <React.Fragment key={`${stx.txid}-stx-${i}`}>
          <Grid item {...itemProps[0]}>
            {(++i === length && (
              <IconButton size='small' onClick={handleActive}>
                {active
                  ? <KeyboardArrowUpIcon fontSize='small' />
                  : <KeyboardArrowDownIcon fontSize='small' />}
              </IconButton>
            ))}
          </Grid>
          <Grid item {...itemProps[1]}>
            {(reference && (
              <Address href tag={stx.tag} wots={stx.address} />
            )) || (
              <Properties href txid={tx.txid} />
            )}
          </Grid>
          <Grid item {...itemProps[2]}>
            {stx.block || 'unconfirmed'}
          </Grid>
          <Grid item {...itemProps[3]}>
            <TimePrep epoch={Date.parse(stx.time)} />
          </Grid>
          <Grid item {...itemProps[4]}>
            <Amount value={stx.amount} />
          </Grid>
        </React.Fragment>
      ))}
      <Collapse in={active} timeout='auto' unmountOnExit sx={{ width: '100%' }}>
        <Grid container item spacing={0}>
          <Grid item xs>
            <Properties signature={tx.txsig} />
          </Grid>
        </Grid>
        {reference && (
          <Grid container item spacing={0}>
            <Grid item xs>
              <Properties txid={tx.txid} />
            </Grid>
          </Grid>
        )}
        <Grid container item spacing={0}>
          <Grid item xs>
            <Address href source tag={tx.srctag} wots={tx.srcaddr} />
          </Grid>
        </Grid>
        <DestinationRow header />
        {(tx.dstarray && (
          tx.dstarray.map((dst, i) => (
            <DestinationRow
              key={`${tx.txid}-dst-${i}`}
              amount={dst.amount} fee={tx.txfee} tag={dst.tag}
            />
          ))
        )) || (
          <DestinationRow
            amount={tx.sendtotal} fee={tx.txfee}
            tag={tx.dsttag} wots={tx.dstaddr}
          />
        )}
        <DestinationRow
          amount={tx.changetotal} fee={tx.txfee}
          change tag={tx.chgtag} wots={tx.chgaddr}
        />
      </Collapse>
    </>
  );
}

export function TransactionHistory ({ bnum, bhash, query, type, value }) {
  // set default state and handlers
  const [queryType, setQueryType] = useState('txid');
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const offset = page * limit;
  const handlePageChange = (_event, newpage) => setPage(newpage);
  const handleLimitChange = (event) => {
    const newlimit = Number(event.target?.value);
    setPage(Math.floor(page * limit / newlimit));
    setLimit(newlimit);
  };
  const handleTypeChange = (_event, newType) => {
    setQueryType(newType);
    setPage(0);
  };

  // obtain search address
  let search = new URLSearchParams();
  search.append('offset', offset);
  search.append('limit', limit);
  if (bnum) search.append('bnum', bnum);
  if (bhash) search.append('bhash', bhash);
  if (query) {
    type = type || queryType;
    value = value || query;
  }
  search = search.toString();

  // perform request and extract length
  const request = useGetTransactionsQuery({ type, value, search });
  const length = request.data?.length;

  return (
    <Grid container component={Paper} spacing={0.5} sx={{ padding: '0.5em' }}>
      {query && (
        <Grid item xs={12} align='center'>
          <Tabs
            value={queryType} onChange={handleTypeChange}
            centered aria-label='transaction history search type'
          >
            <Tab label='TXID' value='txid' />
            <Tab label='Tag' value='tag' />
            <Tab label='Address' value='address' />
          </Tabs>
        </Grid>
      )}
      <TransactionRow header />
      <Grid item xs={12}><Divider /></Grid>
      <Grid container item spacing={0.5} sx={{ position: 'relative' }}>
        {(request.isError && (
          <Grid item xs={12} align='center'>
            {request.error.data?.error || 'Unknown Error'}...
            &nbsp;{request.error.data?.message || 'No information'}
          </Grid>
        )) || (request.isLoading && (
          <Grid item xs={12} align='center'>Loading...</Grid>
        )) || (!request.data?.length && (
          <Grid item xs={12} align='center'>No Results...</Grid>
        )) || (request.data?.map((row, i) => (
          <React.Fragment key={`transaction-row${i}`}>
            <TransactionRow tx={row} reference={value} />
            <Grid item xs={12}><Divider /></Grid>
          </React.Fragment>
        )))}
        {request.isFetching && (<LoadingScreen />)}
        <Grid item xs={12}>
          <Pagination
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            {...{ length, limit, offset }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
