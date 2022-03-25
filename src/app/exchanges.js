
import { Container, Grid, Link, Typography } from '@mui/material';
import DirectionsIcon from '@mui/icons-material/Directions';

export default function Privacy () {
  return (
    <Container>
      <Grid container spacing={4} padding={4} align='center'>
        <Grid item xs={12}>
          <Typography variant='h2'>
            <u style={{ textDecorationColor: '#0059ff' }}>
              Exchanges
            </u>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color='textSecondary' variant='caption' fontSize='1em'>
            Below are the exchanges that have announced and integrated to trade
            MCM. Note available pairs. The Mochimo Foundation nor any of its
            members do not endorse any exchange. Trade at your own risk.
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={12}>
          <Grid item xs={12} sm={4}>
            <Link href='https://www.vindax.com/'>
              <img src='/assets/images/vindax.svg' width='100%' />
            </Link>
            <Typography color='textSecondary'>
              <DirectionsIcon fontSize='inherit' />&nbsp;
              <Link href='https://vindax.com/exchange-advanced.html?symbol=MCM_BTC'>
                BTC
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Link href='https://www.citex.co.kr/#/home'>
              <img src='/assets/images/citex.png' width='100%' />
            </Link>
            <Typography color='textSecondary'>
              <DirectionsIcon fontSize='inherit' />&nbsp;
              <Link href='https://trade.citex.co.kr/trade/MCM_BTC'>BTC</Link>
              <span> • </span>
              <Link href='https://trade.citex.co.kr/trade/MCM_ETH'>ETH</Link>
              <span> • </span>
              <Link href='https://trade.citex.co.kr/trade/MCM_USDT'>USDT</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Link href='https://www.finexbox.com/market/pair/MCM-BTC.htm'>
              <img src='/assets/images/finexbox.png' width='100%' />
            </Link>
            <Typography color='textSecondary'>
              <DirectionsIcon fontSize='inherit' />&nbsp;
              <Link href='https://vindax.com/exchange-advanced.html?symbol=MCM_BTC'>
                BTC
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
