
import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Tooltip,
  Typography
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

import { scrollToTopNow } from './ScrollToTop';
import { social } from 'links';

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
  return (
    <footer
      style={{
        zIndex: 2,
        background: '#303030',
        position: 'relative',
        bottom: 0,
        borderTop: '0.25em solid #0059ff'
      }}
    >
      <Container align='center'>
        <Grid container spacing={1} align='center'>
          <Grid container item sm={12} md={6}>
            <Grid
              item xs={12} display='flex' justifyContent='center'
              flexDirection='row' alignItems='center'
            >
              <Box><img alt='adg logo' src='/assets/source/adq-logo.svg' style={{ width: 150, maxWidth: '25vw' }} /></Box>
              <Typography display='inline-block' variant='caption'>&emsp;+&emsp;</Typography>
              <Box>
                <img alt='mochimo logo and slogan' src='/assets/images/logo-full.png' style={{ width: 256, maxWidth: '50vw' }} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              {social.map(({ href, Icon, primary }, i) => (
                <LinkButton
                  key={`footer-social-${i}`} href={href} title={primary}
                ><Icon />
                </LinkButton>
              ))}
              <LinkButton href='mailto:support@mochimo.org' title='Email'>
                <EmailIcon />
              </LinkButton>
            </Grid>
          </Grid>
          <Grid container item sm={12} md={6}>
            <Grid item xs={6} padding={2} align='right'>
              <Typography variant='h5' gutterBottom>About</Typography>
              <FooterLink to='/adq' onClick={scrollToTopNow}>Adequate</FooterLink>
              <FooterLink to='/' onClick={scrollToTopNow}>Mochimo</FooterLink>
              <FooterLink to='/privacy'>Privacy</FooterLink>
            </Grid>
            <Grid item xs={6} padding={2} align='left'>
              <Typography variant='h5' gutterBottom>Links</Typography>
              <FooterLink href='http://mochiwiki.com'>MochiWiki</FooterLink>
              <FooterLink href='/assets/files/mochimo_wp_EN.pdf'>
                Whitepaper
              </FooterLink>
              <FooterLink href='https://illamanudi.com'>illamanudi</FooterLink>
              <FooterLink href='https://www.coingecko.com/coins/mochimo'>
                CoinGecko
              </FooterLink>
              <FooterLink href='https://coinmarketcap.com/currencies/mochimo/'>
                CoinMarketCap
              </FooterLink>
            </Grid>
          </Grid>
        </Grid>
        <Typography display='block' variant='caption' align='center'>
          Some icons by&nbsp;
          <Link href='https://www.flaticon.com/authors/icongeek26'>icongeek26</Link>,&nbsp;
          <Link href='https://www.flaticon.com/authors/phatplus'>phatplus</Link>,&nbsp;
          <Link href='https://www.flaticon.com/authors/freepik'>Freepik</Link> -&nbsp;
          <Link href='https://www.flaticon.com/'>Flaticon</Link>
        </Typography>
        <Grid item xs={12}><Divider /></Grid>
        <Grid item xs={12}>
          <Typography variant='caption' fontSize={{ xs: 'auto', sm: '1em' }}>
            Website Copyright 2022 &copy; All rights Reserved.
            <Box component='span' display={{ xs: 'none', sm: 'inline' }}>&nbsp;</Box>
            <Box component='span' display={{ xs: 'inline', sm: 'none' }}><br /></Box>
            The Mochimo Foundation.
          </Typography>
        </Grid>
      </Container>
    </footer>
  );
}
