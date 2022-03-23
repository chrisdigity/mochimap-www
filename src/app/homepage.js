
import { useState } from 'react';
import { useGetBaseQuery, useGetChainQuery, useGetContributorsQuery } from 'api';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, AvatarGroup, Box, Button, Card, CardContent, CircularProgress, Container, Divider, Grid, Link, ListItem, ListItemIcon, ListItemText, Paper, Tooltip, Typography } from '@mui/material';
import { Masonry } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Address, Amount } from './component/Types';
import SuffixedValue from './component/SuffixedValue';
import DiscordIcon from './icons/DiscordIcon';

import Network from 'app/network';

function HomepageDivider (props) {
  return (
    <Divider sx={{ padding: ({ spacing }) => spacing(4) }}>
      <Typography fontSize='1.25em' variant='caption' {...props} />
    </Divider>
  );
}

function RaisedCard ({ children, sx, ...props }) {
  return (
    <Card raised sx={{ background: 'rgba(46, 46, 46, 0.75)', ...sx }} {...props}>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function HomepageAccordion ({ active, handleChange, panel, ...props }) {
  return (
    <Accordion
      elevation={5}
      expanded={active === panel}
      onChange={handleChange(panel)}
      {...props}
    />
  );
}

function HomepageAccordianSummary ({ alt, expandIcon, src, ...props }) {
  return (
    <AccordionSummary
      expandIcon={expandIcon !== null ? <ExpandMoreIcon /> : null} sx={{
        display: 'flex', flexDirection: 'row', alignItems: 'middle'
      }}
    >
      <ListItem>
        <ListItemIcon><img alt={alt} src={src} /></ListItemIcon>
        <ListItemText {...props} />
      </ListItem>
    </AccordionSummary>
  );
}

export default function Homepage () {
  const remainingInstamine = 'de77cd98749f9ed61662a09cdf59db622ae8150ea2b9ec35d15c4bd5f204822a4bdba472538596e6c8a7525513942219c4caa40ecaf9827ff6076c1244ba4fbbdc7ba764ca60a60ffc6b8c90f4cee3a34e64c333ae9f50d42a858a30205814eff51bbe6ecd87c6d006824bf16f5c99843b7bdbf34d324ddd5fac88883a6a15e28ee96c07a830a01ce60b9c8a13c24fd1b563eb8c6595328f1989ebd7382e19d4a3c72af796875c1096c31decba77b60fa5f31ede935dba9fe9f9826b5e491554929fdb8edb1a2d79406c89821d1dbca505e0a905c08704edbedb01e8200e44cd79d00feea8233ad5b6428203133e8d00119d1bb7b2eb1d31b93f3a87686251e711c818f19ac1f1b580fa5e640deb4fe65b7cea3935f7971dc969af1e5e511c845b7c7053d325cc5ada5d63b95f16cc823cbfd87668719dec26e8202b486c080c701b8180430e51115e2e916928c34ea396317768bbbd3476788980e1d161b95ff291fd814dd9088455e2cb8237eff9d373e8f39f1e2d0bbe4a778f96e8746b9511001d906594e7b1617d6fb4257b234cbcf35c494e0f9b3743b4c224eb1e0d3b1f613255d8792e03e77426cfa3dc4c329faebefacc881360dd596d972055fca4f241bc573fb445a7cb1884dfae54a8a555c998c66d599685f6f534561075d4f24673d36a7c2d23b2d8da68c0e66bb74a2d1407fa133e6e40e1506de0d106e0bf7ef05416c743c973f5e83a18f4caf02564fd8c179ae585886a642a1ddb77d7e025cd8da53b86efeb6bf35c7d7e234916741aac526e7078e62fd9ab4dba296862a8df3f86bbc01cc2bb6ff13f000d93f9bd054b31b23dba891c40bb469ba10e0c871988be2088c60ffa12d166e4fc418c2249f8e2281ec11e2925e7e03489eea9f2e0b6765906d72826e340ece293edeca137d717b8bd50e05d955698cff360231dc9d5996e7372eddaf1e71e6c4cf8149ec83ab8f59d0e62e225a8c8ef65d514d157915dc0d12fdac599d01914162180f54de61b1a1935652be41d1116e35b9318a50f8fc59e68e4b284fdca52cde9b2e59318d340917cd4ec5981bb24c2fad83edb76140c47401613e9a43ef1e4f7f59c7810b4f7c7bbc6f38c9b7e4868e037ce03fba3e90e1f3e7ed830bd9e4b4173e6162c060a283e29a112e4d3e76962c742b1a690aa7bf29514228ba0417891db622b0ed344dcb620e830f760108217bf37b0fcececfda7b4b2353b1e6649c49936e7ced15d1f6daa68687aa98b40c287848bb5f1048c385de6a8a5fa9180ab269cdb48f239f1d4f271b8de083769a2f5cb6cf5fa93fa6373f3093fd3322d8d4254ca73f5b26194d2cf07c2a23f8ef86c8015a54c01723c801d0652f6dcec5d765249b7f082786c9ff4ae2ef6f3d6c739ea7017f6be41029521d8472612884164d80d65a7bf50d611a0d4345c8dcb7dfc5af11b0aaa63f6c981ce6ad2d192bb24b666844698e26216a285c60ff968f8c8093b98d249b828ba0feebbc0f398af2a11f47c6655a63e62620f0d1e5fc1e6ca8e83af915c01ec1bedd5d1417785d12ba2a1316b9774944885a0eda51efd9cb0ad7e040a7f8b7a12a1f8508f923128767a329ee49a58945d22cbfdeacf0d9d5fb2775cc2513d016540f40bd49c285119eba5f83068ad6968e4668f1d02299dead042437a0483ce3ba44b54213dbc4bd06558e9fcfeba92ef73438c54dad4b4bd93f27469ff1f87d0262bf36d9a0178efd4ee6d6b4e1466f909b78a09e29d1c2afbea07dda575afc9c01966e8002470212219521404363679f72ba9df2449105f8559812a8bdb2d522a6a6ea8b9537fa1ed5aad2a5ec307934d15b2bef0fcc3b4e497625130e304d02f670dda24d2b35e7894babc5812f74f4d65bd97b9bcbd56cb10b1b8c8768584cba1ad2eeace5ee7399f090afdd5ac4de21604c16898f3e83263bac21de2da04f97311a89ab227510492c7ed9b1c31f9b91773dce4a94e9b2eddca3f60a7157fb422cb4204b479c8b8d289b570f82f400172faceaa17751f05c8c7ff7ad3b228952f349d414d92d29601ad5bf5d974198b4486ec88e67a91e4ccf3abe49ae1279ca47d141fa5a8e82afbc5844d8e1f5966126acd8789ffe98ad2afeabd486fd991d47d141a18709b9cab5a01bbb05312bdb69592a8e1e9ef0bd55bff75277acfefd023553208db4ea1eb3dc7af24237e5b6daca35d7e4f1cddfb44f6cc8b7297e3285328c6eae4b251ed7de0c0d5a04242eed392a5ca6cab8e402b1b304e0919f6e7076ee079d14661717c3088a4f21379f0db5ccb502b8cde3b6f380b9fa2a03a025f0dbee197334d47ff1757b75f271e507bd420e2f68af847ad0c33c88cad1e07f5dbe10cc198e37b8e8d0546ee282e5ff3f8bd5be1b8cfa69f1d955e0a86c9c4cfb4c2829ba779f7f9613790832df6f8671103aaac37aa96e08aa8b3b6a4a594274bf4378096cc475b802cad0958862e67f42bc60184ffb1b157d729ec54e1168c97671bf7f3c2e25b3fbb5e737bdd17c0d3217e8b6061ddcf9204e0283e1aaca97a14375873996caddd385fe250fa0a24cdc0b7d970424d27f1e63840f6397059e365c420908138c4a8e5e8d8c729dbe7ec081f5ada3f451443fa437ba5f2fd267601d3a18f3c13860326a35aa6e148f9dd340277d9484dbb42fa781ec75f48914447801483be4a02e8c4700afd2e39447f9d056d2c75d8c9f752b090c457f6f3006527629543bcb4254a3dbd63ad239759c005c7a98ae4dfce7517c3a01feff206856879ea0fb51377579bafae57daf4ffa59ff29d74e088f2bc0234930c356c4f04d092bd8467264bdda43cba3e49761aaeecc9da7ddb99f1aa9fe59d0b8c1be2528e2c71ba95bb9334761c2dd399364f794cdb0b19edcd3f6fdedc1e23420ba0f10e63548be6a785d020dc7ec940ad28374dfd7ff19e33811d082304295c192e5755566ffdcf976178085425f4e82bb99058db6a97a8b6fc4a317cacc5efd31793fde122b3518ae48539eb281dc053348d2f2ebdeb475a1a9ae99a24dfecd1047f446d0d12ab2754b532e018ea9e25f72d5669112d2b1d5cc9b2137eeefa6ba8b67580e9000cc2f1420000000e00000001000000';
  const base = useGetBaseQuery();
  const chain = useGetChainQuery();
  const contributors = useGetContributorsQuery(
    { owner: 'mochimodev', repo: 'mochimo' });

  const [active, setActive] = useState(false);
  const handleChange = (panel) => (_event, isActive) => {
    setActive(isActive ? panel : false);
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Network type='flower' />
      <Container
        sx={{
          gap: '1em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          minHeight: { xs: '95vh', sm: '75vh' },
          padding: '1em',
          textAlign: 'center',
          textShadow: '0 0 0.125em black, 0 0 0.25em black, 0 0 0.5em black'
        }}
      >
        {((base.isFetching || chain.isFetching) && (
          <Box align='center' sx={{ width: '100%' }}>
            <Typography color='textSecondary'>
              <CircularProgress size='1em' /> Loading Network Data...
            </Typography>
          </Box>
        )) || (
          <Grid container spacing={1}>
            <Grid item xs={6} align='left'>
              <Typography fontWeight='bold' lineHeight={1}>
                <SuffixedValue exact value={chain.data?.circsupply} /><br />
                <Typography variant='caption'>Circulating Supply</Typography>
              </Typography>
            </Grid>
            <Grid item xs={6} align='right'>
              <Typography fontWeight='bold' lineHeight={1}>
                <SuffixedValue exact value={chain.data?.hashrate_avg} /><br />
                <Typography variant='caption'>Haiku / second</Typography>
              </Typography>
            </Grid>
            <Grid item xs={6} align='left'>
              <Typography fontWeight='bold' lineHeight={1}>
                <SuffixedValue value={base.data?.stats?.addresses} /><br />
                <Typography variant='caption'>Active Addresses</Typography>
              </Typography>
            </Grid>
            <Grid item xs={6} align='right'>
              <Typography fontWeight='bold' lineHeight={1}>
                <SuffixedValue value={base.data?.stats?.deltas} /><br />
                <Typography variant='caption'>Balance Deltas</Typography>
              </Typography>
            </Grid>
            <Grid item xs={6} align='left'>
              <Typography fontWeight='bold' lineHeight={1}>
                <SuffixedValue value={base.data?.stats?.transactions} /><br />
                <Typography variant='caption'>Transactions</Typography>
              </Typography>
            </Grid>
            <Grid item xs={6} align='right'>
              <Typography fontWeight='bold' lineHeight={1}>
                <SuffixedValue value={base.data?.stats?.blocks} /><br />
                <Typography variant='caption'>Blocks</Typography>
              </Typography>
            </Grid>
          </Grid>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Typography lineHeight={1.5} variant='caption' fontSize='1em'>
          The
          <Typography variant='h4' fontFamily='Nunito Sans' fontWeight='bold'>
            Mochimo
            <Box component='span' display={{ xs: 'none', sm: 'inline' }}>&nbsp;</Box>
            <Box component='span' display={{ xs: 'inline', sm: 'none' }}><br /></Box>
            Cryptocurrency Network
          </Typography>
          A complete reimplementation of Blockchain as Currency for the Post-Quantum era
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: ({ spacing }) => spacing(1)
          }}
        >
          <Tooltip title='Trade MCM!' placement='bottom' arrow>
            <Button variant='contained'>Exchanges</Button>
          </Tooltip>
          <Tooltip title='Mint thy Poetry!' placement='bottom' arrow>
            <Button variant='contained'>Mining</Button>
          </Tooltip>
          <Tooltip title='Get your Mojo on!' placement='bottom' arrow>
            <Button variant='contained'>Wallets</Button>
          </Tooltip>
          <Tooltip title='Much detail, many interesting!' placement='bottom' arrow>
            <Button variant='contained'>Whitepaper</Button>
          </Tooltip>
        </Box>
        <Divider sx={{ width: '75%' }}>Mochimo's Focus</Divider>
      </Container>
      <Container
        sx={{
          zIndex: 1,
          position: 'relative'
        }}
      >
        <Paper
          sx={{
            zIndex: -1,
            position: 'absolute',
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            width: '300%',
            height: '100%',
            left: '-100%',
            top: ({ spacing }) => spacing(8),
            boxShadow: ({ palette }) => '0 0 2em ' + palette.background.default
          }}
        />
        <Grid container spacing={2} justifyContent='center'>
          <Grid item xs={12} sm={6} md={4}>
            <RaisedCard sx={{ height: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} align='center'>
                  <Avatar
                    variant='square' src='/assets/icons/quantum-computing.png'
                    sx={{ justifyContent: 'center', width: 64, height: 64 }}
                  />
                  <Typography variant='h6'>Quantum Resistant</Typography>
                  <Typography variant='caption'>Future-Proofed and Privacy Enabled</Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                  <Typography>
                    At any moment in the frighteningly near future, Quantum
                    Computing is poised to break ECDSA encryption leaving BTC, ETH
                    and all ERC-20 tokens unsafe for transactions and as a store of
                    value. Mochimo uses WOTS+ Quantum Resistant Security approved
                    by the EU funded PQCrypto research organization and a one time
                    addressing feature to secure privacy when you want it.
                  </Typography>
                </Grid>
              </Grid>
            </RaisedCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RaisedCard sx={{ height: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} align='center'>
                  <Avatar
                    variant='square' src='/assets/icons/fast-charge.png'
                    sx={{ justifyContent: 'center', width: 64, height: 64 }}
                  />
                  <Typography variant='h6'>Lightweight & Fast</Typography>
                  <Typography variant='caption'>Scalability Solved</Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                  <Typography>
                    Network scalability issues, solved for good. The Mochimo
                    blockchain remains small while substantially increasing
                    TX speed using ChainCrunch™, a proprietary algorithm.
                    Using a compressed portion of the historical blockchain
                    available on every node in the decentralized network,
                    anyone can set up a full working node in minutes.
                  </Typography>
                </Grid>
              </Grid>
            </RaisedCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RaisedCard sx={{ height: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} align='center'>
                  <Avatar
                    variant='square' src='/assets/icons/decentralized.png'
                    sx={{ justifyContent: 'center', width: 64, height: 64 }}
                  />
                  <Typography variant='h6'>Decentralized & Fair</Typography>
                  <Typography variant='caption'>Stays Decentralized</Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                  <Typography>
                    The code-base is community-developed, and licensed under
                    an MPL 2.0 Derivative open source license. There is no
                    centralized source of truth, or trusted node. This is a truly
                    decentralized project using a GPU-minable, ASIC-resistant algorithm.
                  </Typography>
                </Grid>
              </Grid>
            </RaisedCard>
          </Grid>
        </Grid>
        <HomepageDivider>Blockchain Innovations</HomepageDivider>
        <Grid
          container spacing={2} justifyContent='center' sx={{
            backgroundImage: 'url(/assets/backgrounds/john-adams-1xIN4FMR78A-unsplash.jpg)',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            boxShadow: 'inset 0 0 4em 4em #1e1e1e'
          }}
        >
          <Grid
            item xs={12} sm={10} md={8} align='center' sx={{
              backgroundColor: 'rgba(30, 30, 30, 0.75)',
              borderBottomLeftRadius: '50%',
              borderBottomRightRadius: '50%',
              boxShadow: '0 4em 2em 2em rgba(30, 30, 30, 0.75)'
            }}
          >
            As Mochimo grows, so too does it's innovations.<br />While the
            extensive history of updates and improvements to the Mochimo
            Cryptocurrency Engine is always accesible from Mochimo's&nbsp;
            <Tooltip title='Extensive History' placement='top' arrow>
              <Link href='https://github.com/mochimodev/mochimo'>
                Github Repository
              </Link>
            </Tooltip>, we like to keep a separate list of much easier to read
            "milestones".&nbsp;
            <Tooltip title='Delicious History' placement='right' arrow>
              <Link to='/milestones'>Check them out &#187;</Link>
            </Tooltip>
            <br /><br />
            In addition, here's a few innovations that really stand out....
          </Grid>
          <Grid item xs={12} sm={10} md={8}>
            <HomepageAccordion {...{ active, handleChange, panel: '3way' }}>
              <HomepageAccordianSummary
                alt='handshake icon'
                src='/assets/icons/handshake.png'
              >Three-Way Handshake
              </HomepageAccordianSummary>
              <AccordionDetails>
                The Three-Way handshake is a network communication protocol
                requiring the collection of "acknowledgements" providing fast,
                simple and disposable security for secure requests to the
                decentralized network of nodes that make up the Mochimo Network.
              </AccordionDetails>
            </HomepageAccordion>
            <HomepageAccordion {...{ active, handleChange, panel: 'crunch' }}>
              <HomepageAccordianSummary
                alt='compress icon'
                src='/assets/icons/compress.png'
              >ChainCrunch™ Compression
              </HomepageAccordianSummary>
              <AccordionDetails>
                With the size of many blockchains growing uncontrollably, and
                some already exceeding 1TB in size, scalability still remains a
                priority issue. Mochimo uses a proprietary compression algorithm
                called ChainCrunch™, which solves this issue without compromising
                on blockchain integrity.
                <br /><br />
                At almost 4 years of age and more than 350k blocks in length, the
                core component used to verify the integrity of the Blockchain is
                a mere 50MB in size. A full node need only download an additional
                and tiny, compressed portion of the historical blockchain and
                begin contributing to the network immediately.
              </AccordionDetails>
            </HomepageAccordion>
            <HomepageAccordion {...{ active, handleChange, panel: 'haiku' }}>
              <HomepageAccordianSummary
                alt='poetry icon'
                src='/assets/icons/poetry.png'
              >Haiku of the Blockchain
              </HomepageAccordianSummary>
              <AccordionDetails>
                In the beginning, there was a single Haiku...
                <ListItemText inset>
                  <Typography lineHeight={1} fontFamily='Redressed' fontSize='1.5em'>
                    above day<br />a journey<br />walking
                  </Typography>
                </ListItemText>
                ... and now there are hundreds of thousands of Haiku baked into
                each and every single block. Not only are they great to look at,
                it is a requirement of blockchain validity that the nonce used
                to solve a block originates from a syntactically correct Haiku.
                <br /><br />
                With nearly 5 Trillion possible combinations of possible Haiku,
                Mochimo is a gold mine of poetry. Here's the latest...
                <ListItemText inset>
                  <Typography lineHeight={1} fontFamily='Redressed' fontSize='1.5em'>
                    {(chain.isFetching && (<CircularProgress />)) || (
                      chain.data?.haiku?.split(' \n').map((line, i) => (
                        <span key={`latest-haiku-line-${i}`}>{line}<br /></span>
                      ))
                    )}
                  </Typography>
                </ListItemText>
              </AccordionDetails>
            </HomepageAccordion>
            <HomepageAccordion {...{ active, handleChange, panel: 'tag' }}>
              <HomepageAccordianSummary
                alt='tag icon'
                src='/assets/icons/tag.png'
              >Quantum Resistant Tags
              </HomepageAccordianSummary>
              <AccordionDetails>
                Address size is one of the major hurdles with Quantum Resistant
                addresses. At 2208 bytes (or 4416 hexadecimal characters), it's
                more than a handful to remember. Fortunately, Mochimo deploys
                a custom tagging feature allowing the enormous addresses to
                (optionally) be "tagged" with a short and easily memorable tag
                of a mere 12 bytes (24 hexadecimal characters) in length.
              </AccordionDetails>
            </HomepageAccordion>
            <HomepageAccordion {...{ active, handleChange, panel: 'pseudo' }}>
              <HomepageAccordianSummary
                alt='pseudoblock icon'
                src='/assets/icons/pseudoblock.png'
              >Pseudo-block Failsafe
              </HomepageAccordianSummary>
              <AccordionDetails>
                What happens when a large portion power suddenly disappears from
                the network? With the remaining power left to solve tremendously
                high difficulties in order to clear transactions, how long should
                you wait? Days? WEEKS? MoNtHs? Not around these parts...
                <br /><br />
                The Mochimo network detects long block times and agrees to lower
                the difficulty with a special kind of block. The "pseudo-block".
                With the power of friendship (and of course, a little "pseudo"
                blockchain magic), the Mochimo network restores normal clearing
                times to transactions within hours of a 90% mining power loss.
              </AccordionDetails>
            </HomepageAccordion>
            <HomepageAccordion {...{ active, handleChange, panel: 'peach' }}>
              <HomepageAccordianSummary
                alt='MCM gpu icon'
                src='/assets/icons/gpu_mcm.png'
              >FPGA-Tough POW
              </HomepageAccordianSummary>
              <AccordionDetails>
                Dubbed "The Peach Algorithm", Mochimo uses a unique "FPGA-Tough"
                Proof of Work mining algorithm, that is specifically designed to
                shift the value of mining in favor of miners with Gaming GPUs.
                <br /><br />
                The Peach algorithm a standard arrangement of hashing algorithms,
                memory transformations, and deterministic FLOPs as the first layer
                of "FPGA Tough"-ness. This layer is further supported by a minimum
                VRAM requirement that gives a considerable "mining advantage" to
                hardware (notably GPUs) with the ability to cache a large sparse
                matrix of pre-computed data unique to each block.
                <br /><br />
                Ultimately, the few FPGAs with access to this "mining advantage"
                are likely to be eclipsed by Gaming GPUs in terms of value.
              </AccordionDetails>
            </HomepageAccordion>
          </Grid>
        </Grid>
        <HomepageDivider>The Team</HomepageDivider>
        <Grid
          container spacing={2} justifyContent='center' sx={{
            backgroundImage: 'url(/assets/backgrounds/annie-spratt-QckxruozjRg-unsplash.jpg)',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            boxShadow: 'inset 0 0 4em 4em #1e1e1e'
          }}
        >
          <Grid item xs={12} sm={10} md={8} align='center'>
            <Typography variant='h4' gutterBottom>
              Github Contributors
            </Typography>
            {(contributors.isFetching & (<CircularProgress />)) || (
              <AvatarGroup max={contributors.data?.length} sx={{ justifyContent: 'center' }}>
                {(contributors.data?.map((contrib, i) => (
                  <Tooltip
                    key={`contributor-${i}`} title={contrib.login}
                    placement='bottom' arrow
                  >
                    <Avatar
                      component='a'
                      alt={contrib.login}
                      src={contrib.avatar_url}
                      href={contrib.html_url}
                    />
                  </Tooltip>
                )))}
              </AvatarGroup>
            )}
          </Grid>
          <Grid item xs={12} sm={10} md={6} align='left'>
            <RaisedCard sx={{ height: '100%' }}>
              <Typography variant='h4' gutterBottom>
                Core Contributors
              </Typography>
              <Typography>
                Mochimo's core contributors is comprised of industry leaders in
                the fields of computer networking, artificial intelligence,
                telecommunications, cryptography and software engineering.
                Though the majority of it's members wish to remain anonymous,
                you can see some of our key contributors.&emsp;
                <Tooltip title="They're friendly" placement='top' arrow>
                  <Link to='/'>Meet Them &#187;</Link>
                </Tooltip>
              </Typography>
            </RaisedCard>
          </Grid>
          <Grid item xs={12} sm={10} md={6} align='right'>
            <RaisedCard sx={{ height: '100%' }}>
              <Typography variant='h4' gutterBottom>
                Are you an expert in your field?
              </Typography>
              <Typography>
                Individuals with extensive prior experience with cryptocurrency
                development will be considered for inclusion on the Dev Team,
                please&nbsp;
                <Link href='mailto:support@mochimo.org'>
                  contact support
                </Link> with your inquiries.
                <br /><br />
                We are not otherwise hiring at this time.
              </Typography>
            </RaisedCard>
          </Grid>
        </Grid>
        <HomepageDivider>Frequently Asked Questions</HomepageDivider>
        <Masonry
          columns={{ sm: 1, md: 2, lg: 3 }} spacing={2} sx={{
            backgroundImage: 'url(/assets/backgrounds/markus-spiske-iar-afB0QQw-unsplash.jpg)',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            boxShadow: 'inset 0 0 4em 4em #1e1e1e'
          }}
        >
          <RaisedCard>
            <Typography fontWeight='bold' variant='h6' gutterBottom>
              What's the supply statistics?
            </Typography>
            Mochimo's supply is fairly simply split into 2 categories.
            <ol>
              <li>
                <strong>
                  Instamine Supply (<Amount value='4757066000000000' />)
                </strong><br />
                The Instamine (not to be confused with a "premine") existed
                as a single ledger entry of Mochimo's Genesis Block. This
                instamine was split into it's predetermined allocations
                during the early days of the Blockchain.<br /><br />
                <Address href short wots={remainingInstamine} /> currently
                holds the largest remainder of the instamine, which is
                controlled by the Mochimo Foundation, and is LOCKED by
                contractual agreement until 25th June 2023.
              </li>
              <br />
              <li>
                <strong>
                  Mineable Supply (
                  {(chain.isFetching && (
                    <span> <CircularProgress size='1em' /> </span>
                  )) || (
                    /* realtime "max supply" minus "instamine" */
                    <Amount value={((chain.data?.maxsupply || 76493180.0616804) * 1e+9) - 4757066000000000} />
                  )})
                </strong><br />
                The Mineable supply can be described simply as Mochimo
                that is rewarded to a "miner" for solving a block on the
                Blockchain. The distribution of these rewards over the
                life of the Mochimo Blockchain is explained and illustrated
                in a fantastic&nbsp;
                <Link href='https://medium.com/mochimo-official/of-time-and-tide-the-mochimo-cryptocurrency-emission-curve-9bbe30b9b02e'>
                  Medium Article
                </Link>.<br />
                In summary...
                <ul>
                  <li>Reward (@ 0x01): <Amount value={5000000000} /></li>
                  <ul><li> +<Amount value={56000} /> / block</li></ul>
                  <li>Reward (@ 0x4321): <Amount value={5917392000} /></li>
                  <ul><li> +<Amount value={150000} /> / block</li></ul>
                  <li>Reward (@ 0x5B402): <Amount value={59523942000} /></li>
                  <ul><li> -<Amount value={28488} /> / block</li></ul>
                  <li>Reward (@ 0x200000): <Amount value={0} /></li>
                  <ul><li>mining distribution finalized</li></ul>
                  <ul><li>txfees sustain network</li></ul>
                </ul>
              </li>
            </ol>
          </RaisedCard>
          <RaisedCard>
            <Typography fontWeight='bold' variant='h6' gutterBottom>
              How is the Instamine used?
            </Typography>
            The majority of the Instamine was allocated to the original
            Mochimo Development Team. The team spent years creating a
            cryptocurrency platform that solves almost every major issue
            with Bitcoin to date. Therefore, this allocation serves as a
            fee (in MCM) for that work. The fee is equal to approximately
            4.46% of the fully diluted Mochimo supply.
            <br /><br />
            For the extended breakdown of Instamine distribution...
            <br /><br />
            <strong>
              Mochimo Foundation (<Amount value={1557066000000000} />):
            </strong> these funds are used at the discretion of the
            foundation for marketing costs, bounties, and ongoing support
            of the network. Disposition of these coins is listed on the&nbsp;
            <Link href='https://www.mochiwiki.com/w/index.php/Premine_Disposition'>
              Mochimo Wiki
            </Link>.
            <br /><br />
            <strong>
              Matt Zweil (<Amount value={1919999999991500} />):
            </strong> Mochimo's founder, architect, and only remaining
            Development Team member whose coins remain controlled by The
            Mochimo Foundation. These coins are LOCKED until 25th June 2023,
            exactly 5 years from the launch date of Mochimo.
            <br /><br />
            <strong>
              Development Team (<Amount value={1280000000008000} />):
            </strong> effective 25th June 2019, the original 2-year lock
            on the Developer Team coins has expired. The coins and their
            intended sale dates are no longer tracked or listed on the
            Mochimo Wiki, as they are now privately controlled and
            considered apart of the circulating supply.
          </RaisedCard>
          <RaisedCard>
            <Typography fontWeight='bold' variant='h6' gutterBottom>
              When was the first block solved?
            </Typography>
            As per Blockchain data pulled directly from the network nodes,
            the first block was solved on Monday, June 25, 2018 3:43:45 PM,
            or 2018-06-18T15:43:45+00:00 (ISO timestamp).
          </RaisedCard>
          <RaisedCard>
            <Typography fontWeight='bold' variant='h6' gutterBottom>
              Did Mochimo have an ICO or other pre-Mainet investment phase?
            </Typography>
            No. The decision to forego any sort of pre–launch investment
            in the coin was made to avoid the legal and regulatory issues
            that would have arisen. Furthermore,&nbsp;
            <Link href='https://discord.com/channels/460867662977695765/512709057497530369/606879821548617737'>
              Mochimo is money...
            </Link>
          </RaisedCard>
          <RaisedCard>
            <Typography fontWeight='bold' variant='h6' gutterBottom>
              Do I need the blockchain history to transact directly with
              the network?
            </Typography>
            No. Somewhat importantly, performing a transaction on the
            Mochimo Network DOES NOT require access to the blockchain.
            This allows Wallets, Exchanges, Third-Party Applications and
            Payment Providers to swiftly operate on the network without
            pre-requisite access to the blockchain.
          </RaisedCard>
          <RaisedCard>
            <Typography fontWeight='bold' variant='h6' gutterBottom>
              How did you implement quantum resistance, anyhow?
            </Typography>
            We checked out the algorithms that were peer reviewed and
            acknowledged by the EU backed Quantum Research group PQCRYPTO
            and chose the WOTS+ algorithm. We then wrote and vetted our
            quantum code with the algorithm's originator: Andreas Hülsing.
            The penalty of adopting quantum signatures is their size, but
            we've already solved that problem with our ChainCrunch™ tech.
          </RaisedCard>
          <RaisedCard>
            <Typography fontWeight='bold' variant='h6' gutterBottom>
              How long does it take to set up a Mochimo mining node?
            </Typography>
            Several minutes on high performance hardware, but it is known
            to take around 20 minutes on tiny 1vCPU server nodes.
          </RaisedCard>
          <RaisedCard>
            <Typography fontWeight='bold' variant='h6' gutterBottom>
              Where do I store my MCM?
            </Typography>
            Mochimo can currently be stored in the cross-platform "Mojo"
            wallet, with Mobile / Web Wallets, and hardware wallet
            integrations in the works...
          </RaisedCard>
          <RaisedCard>
            <Typography fontWeight='bold' variant='h6' gutterBottom>
              What exchanges are you on?
            </Typography>
            The list of exchanges that Mochimo is currently on can be found
            on the MCM Exchanges page. Regularly check back in Discord and
            the exchange page for updates.
          </RaisedCard>
        </Masonry>
      </Container>
      <Paper
        align='center' sx={{
          zIndex: 1,
          position: 'relative',
          padding: 8,
          marginTop: 8,
          marginBottom: 8,
          borderRadius: 0,
          boxShadow: '0 0 2em 2em white'
        }}
      >
        <Typography variant='h2'>Need more answers about Mochimo?</Typography>
        <br />
        <Typography variant='caption'>Come join the community.</Typography>
        <br />
        <br />
        <Button variant='contained'><DiscordIcon />&emsp;Mochimo Official Discord</Button>
      </Paper>
      <Paper elevation={10} sx={{ zIndex: 2, position: 'relative', marginTop: ({ spacing }) => spacing(2) }}>
        <Container>
          Icons created by&nbsp;
          <Link href='https://www.flaticon.com/authors/icongeek26'>icongeek26</Link>,&nbsp;
          <Link href='https://www.flaticon.com/authors/phatplus'>phatplus</Link>, and&nbsp;
          <Link href='https://www.flaticon.com/authors/freepik'>Freepik</Link> -&nbsp;
          <Link href='https://www.flaticon.com/'>Flaticon</Link>
        </Container>
      </Paper>
    </Box>
  );
}
