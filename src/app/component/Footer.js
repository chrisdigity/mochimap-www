
import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Tooltip,
  Typography
} from '@mui/material';
import MediumIcon from 'app/icons/MediumIcon';
import DiscordIcon from 'app/icons/DiscordIcon';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import RedditIcon from '@mui/icons-material/Reddit';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import { useCallback } from 'react';

const FooterLink = (props) => (
  <Typography display='block' variant='caption' color='textPrimary'>
    <Link color='inherit' underline='hover' {...props} />
  </Typography>
);

const LinkButton = ({ children, title, ...props }) => (
  <Tooltip title={title} placement='top' arrow>
    <Link {...props}><IconButton>{children}</IconButton></Link>
  </Tooltip>
);

export default function Footer () {
  const topScroll = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <Paper
      elevation={10} sx={{
        zIndex: 2,
        position: 'relative',
        padding: '1em 0 1em 0',
        marginTop: 2,
        borderTop: '0.25em solid #0059ff'
      }}
    >
      <Container align='center'>
        <Grid container spacing={1} align='center'>
          <Grid
            item xs={12} display='flex' justifyContent='center'
            flexDirection='row' alignItems='center'
          >
            <Box><img src='/assets/source/adq-logo.svg' style={{ width: 150, maxWidth: '25vw' }} /></Box>
            <Typography display='inline-block' variant='caption'>&emsp;+&emsp;</Typography>
            <Box>
              <img src='/assets/images/logo-full.png' style={{ width: 256, maxWidth: '50vw' }} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <LinkButton href='https://discord.mochimap.com/' title='Discord'>
              <DiscordIcon />
            </LinkButton>
            <LinkButton href='https://t.me/mochimocryptochat' title='Telegram'>
              <TelegramIcon />
            </LinkButton>
            <LinkButton href='https://twitter.com/mochimocrypto' title='Twitter'>
              <TwitterIcon />
            </LinkButton>
            <LinkButton href='https://www.reddit.com/r/mochimo/' title='Reddit'>
              <RedditIcon />
            </LinkButton>
            <LinkButton href='https://medium.com/mochimo-official' title='Medium'>
              <MediumIcon />
            </LinkButton>
            <LinkButton
              href='https://www.youtube.com/channel/UCFW0_JZR32gMvEtJQ3YE0KA'
              title='YouTube'
            ><YouTubeIcon />
            </LinkButton>
            <LinkButton href='mailto:support@mochimo.org' title='Email'>
              <EmailIcon />
            </LinkButton>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={6} padding={2} align='right'>
              <Typography variant='h5' gutterBottom>Links</Typography>
              <FooterLink href='http://mochiwiki.com'>MochiWiki</FooterLink>
              <FooterLink href='/assets/files/mochimo_wp_EN.pdf'>
                Whitepaper
              </FooterLink>
              <FooterLink href='https://coinmarketcap.com/currencies/mochimo/'>
                CoinMarketCap
              </FooterLink>
              <FooterLink href='https://www.coingecko.com/coins/mochimo'>
                CoinGecko
              </FooterLink>
            </Grid>
            <Grid item xs={6} padding={2} align='left'>
              <Typography variant='h5' gutterBottom>About</Typography>
              <FooterLink to='/adq' onClick={topScroll}>Adequate</FooterLink>
              <FooterLink to='/' onClick={topScroll}>Mochimo</FooterLink>
              <FooterLink to='/privacy'>Privacy</FooterLink>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}><Divider /></Grid>
        <Grid item xs={12}>
          <Typography variant='caption' fontSize={{ xs: 'auto', sm: '1em' }}>
            Copyright 2022 &copy; All rights Reserved.<br />
            The Mochimo Foundation.
          </Typography>
        </Grid>
      </Container>
    </Paper>
  );
}
