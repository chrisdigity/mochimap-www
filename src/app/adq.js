
import { Container, Grid, Link, Typography } from '@mui/material';
import { useEffect } from 'react';

function ADQTypography (props) {
  return (
    <Typography
      color='textSecondary' fontSize='1em' variant='caption'
      {...props}
    />
  );
}

export default function Privacy () {
  return (
    <Container>
      <Grid container spacing={4} padding={4}>
        <Grid item xs={12} align='center'>
          <img
            src='/assets/source/adq-logo.svg'
            style={{ width: 512, maxWidth: '100%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <ADQTypography>
            ADQ is a software and systems architecture firm focused on bringing
            disruptive and practical blockchain solutions to market. As leaders
            in the blockchain development space, ADQ holds patents for many
            novel and innovative approaches to blockchain implementation.
          </ADQTypography>
        </Grid>
        <Grid item xs={12}>
          <ADQTypography>
            We work with multiple industries, from transportation, logistics,
            legal, medical, supply-chain, banking, and more, to help our
            clients leverage the power and value that blockchain offers.
          </ADQTypography>
        </Grid>
        <Grid item xs={12}>
          <ADQTypography>
            With over 30 years of technical experience, ADQ has a history of
            conceiving and delivering the impossible with pure, elegant
            innovative blockchain solutions.
          </ADQTypography>
        </Grid>
        <Grid item xs={12}>
          <ADQTypography>
            ADQ was the driving force behind the Mochimo cryptocurrency which
            made history as the first blockchain-based, quantum-resistant,
            cryptocurrency. Mochimo is an open-source, fully decentralized
            global phenomenon in the crypto space. It includes many needed
            and desirable innovations in blockchain technology such as, massive
            speed improvements, ASIC-resistant proof of work (POW), a patented
            solution to runaway blockchain growth, and first-of-its-kind
            solution to larger addresses in post-quantum cryptography.
          </ADQTypography>
        </Grid>
        <Grid item xs={12}>
          <ADQTypography>
            Simply put, our blockchain tech is second to none.
          </ADQTypography>
        </Grid>
        <Grid item xs={12}>
          <ADQTypography>
            If you have a problem or challenge you need to solve and you want
            to explore whether blockchain might offer a solution for your
            business, we would love to discuss it with you.
          </ADQTypography>
        </Grid>
        <Grid item xs={12}>
          <ADQTypography>
            For more information reach out to us:&nbsp;
            <Link href='mailto:support@mochimo.org'>support@mochimo.org</Link>
          </ADQTypography>
        </Grid>
      </Grid>
    </Container>
  );
}
