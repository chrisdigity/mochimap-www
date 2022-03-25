
import { Container, Grid, Link, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DirectionsIcon from '@mui/icons-material/Directions';

export function Downloads () {
  return (
    <Container>
      <Grid container spacing={4} padding={4} align='center'>
        <Grid item xs={12}>
          <Typography variant='h2'>
            <u style={{ textDecorationColor: '#0059ff' }}>
              Downloads
            </u>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color='textSecondary' variant='caption' fontSize='1em'>
            Quick access our growing library of wallets, miners, tools and
            resources here.
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={12}>
          <Grid item xs={12} sm={4}>
            <Typography variant='h3'>Wallets</Typography>
            <List>
              <ListItem button component={Link} href='https://github.com/mochimodev/mojo-java-wallet/releases'>
                <ListItemIcon>
                  <img src='/assets/icons/java.png' width={32} />
                </ListItemIcon>
                <ListItemText
                  primary='Mojo Java Wallet'
                  secondary='Cross Platform'
                />
              </ListItem>
              <ListItem button component={Link} href='https://github.com/mochimodev/mochimo'>
                <ListItemIcon>
                  <img src='/assets/icons/linux.png' width={32} />
                </ListItemIcon>
                <ListItemText
                  primary='Linux CLI Wallet'
                  secondary='Packaged with Full Node'
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant='h3'>Miners</Typography>
            <List>
              <ListItem button component={Link} href='https://github.com/chrisdigity/blood-miner/releases'>
                <ListItemIcon>
                  <img src='/assets/icons/blood.png' width={32} />
                </ListItemIcon>
                <ListItemText
                  primary='Mochimo Blood Miner'
                  secondary='Windows/Linux Pool Miner'
                />
              </ListItem>
              <ListItem button component={Link} href='https://github.com/mochimodev/mochimo'>
                <ListItemIcon>
                  <img src='/assets/icons/linux.png' width={32} />
                </ListItemIcon>
                <ListItemText
                  primary='Linux Node Miner'
                  secondary='Packaged with Full Node'
                />
              </ListItem>
              <ListItem button component={Link} href='https://github.com/mochimodev/winminer/releases'>
                <ListItemIcon>
                  <img src='/assets/icons/windows.png' width={32} />
                </ListItemIcon>
                <ListItemText
                  primary='Headless Miner'
                  secondary='Windows Solo Miner'
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
