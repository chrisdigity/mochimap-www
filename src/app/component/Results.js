
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

export function BlockHistory ({ bnum, bhash, maddr, query }) {
  // set default state and handlers
  const [queryType, setQueryType] = useState('bnum');
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const offset = page * limit;
  const handlePageChange = (_event, newpage) => setPage(newpage);
  const handleLimitChange = (event) => setLimit(Number(event.target?.value));
  const handleTypeChange = (_event, newType) => setQueryType(newType);

  // obtain search address
  let search = new URLSearchParams();
  search.append('offset', offset);
  search.append('limit', limit);
  if (query) {
    switch (queryType) {
      case 'bnum': search.append('bnum', query); break;
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
    { xs: 6.75, sm: 4 },
    { sm: 4, display: { xs: 'none', sm: 'block' } },
    { xs: 2, sm: 1.75 },
    { xs: 3.25, sm: 2.25, align: 'right' }
  ];

  return (
    <Grid container component={Paper} spacing={0.5} sx={{ padding: '0.5em' }}>
      {query && (
        <Grid container item>
          <Grid item xs align='center'>
            <Tabs
              value={queryType} onChange={handleTypeChange}
              centered aria-label='block history search type'
            >
              <Tab label='Block Number' value='bnum' />
              <Tab label='Block Hash' value='bhash' />
              <Tab label='Miner' value='maddr' />
            </Tabs>
          </Grid>
        </Grid>
      )}
      {(request.isError && (
        <Grid container item>
          <Grid item xs={12} align='center'>
            {request.error.data?.error || 'Unknown Error'}...
            &nbsp;{request.error.data?.message || 'No information'}
          </Grid>
        </Grid>
      )) || (!request.isFetching && !request.data?.length && (
        <Grid container item>
          <Grid item xs={12} align='center'>No Results...</Grid>
        </Grid>
      )) || (
        <>
          <Grid item xs>
            <Pagination
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              {...{ length, limit, offset }}
            />
          </Grid>
          <Grid container item>
            <Grid item {...itemProps[2]}>Number</Grid>
            <Grid item {...itemProps[0]}>Block Hash</Grid>
            <Grid item {...itemProps[1]}>Miner</Grid>
            <Grid item {...itemProps[3]}>Time</Grid>
          </Grid>
          {(request.isFetching && (
            <>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12} align='center'><CircularProgress /></Grid>
            </>
          )) || (
            request.data?.map((row, i) => (
              <React.Fragment key={`balances-row-${i}`}>
                <Grid item xs><Divider /></Grid>
                <Grid container item spacing={1}>
                  <Grid item {...itemProps[2]}>{row.bnum}</Grid>
                  <Grid item {...itemProps[0]}>
                    <Link href={`/explorer/block/${row.bnum}/${row.bhash}`}>
                      <Typography noWrap>{row.bhash}</Typography>
                    </Link>
                  </Grid>
                  <Grid item {...itemProps[1]}>
                    {(row.maddr && (
                      <Properties href wots={row.maddr} />
                    )) || (
                      <Typography noWrap>
                        {`> [ ${capitalize(row.type)} Block ]`}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item {...itemProps[3]}>
                    <TimePrep epoch={Date.parse(row.created)} />
                  </Grid>
                </Grid>
              </React.Fragment>))
          )}
        </>
      )}
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
        <Grid container item>
          <Grid item xs={6} align='center'>Tag</Grid>
          <Grid item xs={6} align='center'>WOTS+</Grid>
        </Grid>
        <Grid container item>
          <Grid item xs><Divider /></Grid>
        </Grid>
        <Grid container item spacing={1}>
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
  const handleLimitChange = (event) => setLimit(Number(event.target?.value));
  const handleTypeChange = (_event, newType) => setQueryType(newType);

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

  return (
    <Grid container component={Paper} spacing={0.5} sx={{ padding: '0.5em' }}>
      {query && (
        <Grid container item>
          <Grid item xs align='center'>
            <Tabs
              value={queryType} onChange={handleTypeChange}
              centered aria-label='ledger history search type'
            >
              <Tab label='Tag' value='tag' />
              <Tab label='Address' value='address' />
            </Tabs>
          </Grid>
        </Grid>
      )}
      {(request.isError && (
        <Grid container item>
          <Grid item xs={12} align='center'>
            {request.error.data?.error || 'Unknown Error'}...
            &nbsp;{request.error.data?.message || 'No information'}
          </Grid>
        </Grid>
      )) || (!request.isFetching && !request.data?.length && (
        <Grid container item>
          <Grid item xs={12} align='center'>No Results...</Grid>
        </Grid>
      )) || (
        <>
          <Grid item xs>
            <Pagination
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              {...{ length, limit, offset }}
            />
          </Grid>
          <Grid container item>
            <Grid item xs={5} sm={3.5} md={5}>Address</Grid>
            <Grid
              item md={1.25} align='right'
              display={{ xs: 'none', sm: 'none', md: 'block' }}
            >Block
            </Grid>
            <Grid item xs={3.5} sm={2.5} md={1.75} align='right'>Time</Grid>
            <Grid
              item sm={3} md={2} align='right'
              display={{ xs: 'none', sm: 'block' }}
            >Delta
            </Grid>
            <Grid item xs={3.5} sm={3} md={2} align='right'>Balance</Grid>
          </Grid>
          {(request.isFetching && (
            <>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12} align='center'><CircularProgress /></Grid>
            </>
          )) || (
            request.data?.map((row, i) => (
              <React.Fragment key={`balances-row-${i}`}>
                <Grid item xs><Divider /></Grid>
                <Grid container item spacing={0}>
                  <Grid item xs={5} sm={3.5} md={5}>
                    <Address href wots={row.address} tag={row.tag} />
                  </Grid>
                  <Grid
                    item md={1.25} align='right'
                    display={{ xs: 'none', sm: 'none', md: 'block' }}
                  >{row.bnum}
                  </Grid>
                  <Grid item xs={3.5} sm={2.5} md={1.75} align='right'>
                    <TimePrep epoch={Date.parse(row.created)} />
                  </Grid>
                  <Grid
                    item sm={3} md={2} align='right' display={{
                      xs: 'none', sm: 'block'
                    }}
                  ><Amount forceSign value={row.delta} />
                  </Grid>
                  <Grid item xs={3.5} sm={3} md={2} align='right'>
                    <Amount value={row.balance} />
                  </Grid>
                </Grid>
              </React.Fragment>))
          )}
        </>
      )}
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
  const handleLimitChange = (event) => setLimit(Number(event.target?.value));
  const handleTypeChange = (_event, newType) => setQueryType(newType);

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
        <Grid container item>
          <Grid item xs align='center'>
            <Tabs
              value={queryType} onChange={handleTypeChange}
              centered aria-label='richlist search type'
            >
              <Tab label='Rank' value='rank' />
              <Tab label='Tag' value='tag' />
              <Tab label='Address' value='address' />
            </Tabs>
          </Grid>
        </Grid>
      )}
      {(request.isError && (
        <Grid container item>
          <Grid item xs={12} align='center'>
            {request.error.data?.error || 'Unknown Error'}...
            &nbsp;{request.error.data?.message || 'No information'}
          </Grid>
        </Grid>
      )) || (!request.isFetching && !request.data?.length && (
        <Grid container item>
          <Grid item xs={12} align='center'>No Results...</Grid>
        </Grid>
      )) || (
        <>
          <Grid item xs>
            <Pagination
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              rowsPerPageOptions={[20, 50, 100]}
              {...{ length, limit, offset }}
            />
          </Grid>
          <Grid container item>
            <Grid item {...itemProps[0]}>Rank</Grid>
            <Grid item {...itemProps[1]}>Address</Grid>
            <Grid item {...itemProps[2]}>Balance</Grid>
            <Grid item {...itemProps[3]}>Stake</Grid>
          </Grid>
          {(request.isFetching && (
            <>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12} align='center'><CircularProgress /></Grid>
            </>
          )) || (
            request.data?.map((row, i) => (
              <React.Fragment key={`balances-row-${i}`}>
                <Grid item xs><Divider /></Grid>
                <Grid container item spacing={1}>
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
                </Grid>
              </React.Fragment>))
          )}
        </>
      )}
    </Grid>
  );
}

const splitTransaction = (tx, address) => {
  const stxs = [];
  // deconstruct transaction elements
  const { srcaddr, srctag, dstaddr, dsttag, chgaddr, chgtag } = tx;
  // reduce variables footprint
  const sT = tx.sendtotal;
  const cT = tx.changetotal;
  const src = ['00', '42'].includes(srctag.slice(0, 2)) ? srctag : srcaddr;
  // const dst = ['00', '42'].includes(dsttag.slice(0, 2)) ? dsttag : dstaddr;
  const chg = ['00', '42'].includes(chgtag.slice(0, 2)) ? chgtag : chgaddr;
  // derive reference address position
  if ((srctag + srcaddr).includes(address)) address = 'src';
  if ((dsttag + dstaddr).includes(address)) address = 'dst';
  if ((chgtag + chgaddr).includes(address)) address = 'chg';
  // build simple transactions' base object
  const add = { time: tx.confirmed || tx.created, block: tx.bnum };
  // determine simple transactions by conditional transaction element comparison
  if ((address === 'src' && src === chg)) {
    // 1 of 2 simple transactions take place
    if (sT || !cT) { // dst @ -(sT), else chg @ -(cT)
      stxs.push({ ...add, tag: dsttag, address: dstaddr, amount: -(sT) });
    } else stxs.push({ ...add, tag: chgtag, address: chgaddr, amount: -(cT) });
  } else { // 1 OR 2 simple transactions take place
    if ((sT && address !== 'chg') || address === 'dst') {
      if (address === 'src') { // dst @ -(sT), else src @ sT
        stxs.push({ ...add, tag: dsttag, address: dstaddr, amount: -(sT) });
      } else stxs.push({ ...add, tag: srctag, address: srcaddr, amount: sT });
    } // and/or
    if (address && ((cT && address !== 'dst') || address === 'chg')) {
      if (address === 'src') { // chg @ -(cT), else src @ cT
        stxs.push({ ...add, tag: chgtag, address: chgaddr, amount: -(cT) });
      } else stxs.push({ ...add, tag: srctag, address: srcaddr, amount: cT });
    }
  }
  // return simple transactions
  return stxs;
};

function DestinationRow ({ amount, change, fee, header, tag, wots }) {
  return (header && (
    <Grid container item>
      <Grid item xs={7} sm={8.25} md={9.5}>Destinations</Grid>
      <Grid item xs={1.5} sm={1.25} md={1} align='right'>Fee</Grid>
      <Grid item xs={3.5} sm={2.5} md={1.5} align='right'>Amount</Grid>
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
    <Grid container item>
      <Grid item {...itemProps.shift()} />
      <Grid item {...itemProps.shift()}>Reference</Grid>
      <Grid item {...itemProps.shift()}>Block</Grid>
      <Grid item {...itemProps.shift()}>Time</Grid>
      <Grid item {...itemProps.shift()}>Amount</Grid>
    </Grid>
  )) || (
    <>
      <Grid item xs><Divider /></Grid>
      {splitTransaction(tx, reference).map((stx, i, { length }) => (
        <Grid container item spacing={0} key={`${stx.txid}-stx-${i}`}>
          <Grid item {...itemProps.shift()}>
            {(++i === length && (
              <IconButton size='small' onClick={handleActive}>
                {active
                  ? <KeyboardArrowUpIcon fontSize='small' />
                  : <KeyboardArrowDownIcon fontSize='small' />}
              </IconButton>
            ))}
          </Grid>
          <Grid item {...itemProps.shift()}>
            {(reference && (
              <Address href tag={stx.tag} wots={stx.address} />
            )) || (
              <Properties href txid={tx.txid} />
            )}
          </Grid>
          <Grid item {...itemProps.shift()}>
            {stx.block || 'unconfirmed'}
          </Grid>
          <Grid item {...itemProps.shift()}>
            <TimePrep epoch={Date.parse(stx.time)} />
          </Grid>
          <Grid item {...itemProps.shift()}>
            <Amount value={stx.amount} />
          </Grid>
        </Grid>
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
  const handleLimitChange = (event) => setLimit(Number(event.target.value));
  const handleTypeChange = (_event, newType) => setQueryType(newType);

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
        <Grid container item>
          <Grid item xs align='center'>
            <Tabs
              value={queryType} onChange={handleTypeChange}
              centered aria-label='transaction history search type'
            >
              <Tab label='TXID' value='txid' />
              <Tab label='Tag' value='tag' />
              <Tab label='Address' value='address' />
            </Tabs>
          </Grid>
        </Grid>
      )}
      {(request.isError && (
        <Grid container item>
          <Grid item xs={12} align='center'>
            {request.error.data?.error || 'Unknown Error'}...
            &nbsp;{request.error.data?.message || 'No information'}
          </Grid>
        </Grid>
      )) || (!request.isFetching && !request.data?.length && (
        <Grid container item>
          <Grid item xs={12} align='center'>No Results...</Grid>
        </Grid>
      )) || (
        <>
          <Grid item xs>
            <Pagination
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              {...{ length, limit, offset }}
            />
          </Grid>
          <TransactionRow header />
          {(request.isFetching && (
            <>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12} align='center'><CircularProgress /></Grid>
            </>
          )) || (
            request.data?.map((tx, i) => (
              <TransactionRow key={`transaction-row${i}`} tx={tx} />))
          )}
        </>
      )}
    </Grid>
  );
}
