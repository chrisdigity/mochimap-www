
import { useState } from 'react';
import { useGetBaseQuery, useGetChainQuery, useGetContributorsQuery } from 'api';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, AvatarGroup, Box, Button, CircularProgress, Container, Divider, Grid, Link, ListItem, ListItemIcon, ListItemText, Paper, Tooltip, Typography } from '@mui/material';
import { Masonry } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Address, Amount } from './component/Types';
import SuffixedValue from './component/SuffixedValue';
import RaisedCard from './component/RaisedCard';
import DiscordIcon from './icons/DiscordIcon';

import Network from './network';

function HomepageDivider ({ dense, ...props }) {
  return (
    <Divider sx={{ padding: dense ? 4 : 8 }}>
      <Typography fontSize='1.25em' variant='caption' {...props} />
    </Divider>
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
  const remainingInstamine = 'de77cd98749f9ed61662a09cdf59db622ae8150ea2b9ec35d15c4bd5f204822a';
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
      <Network type='globe' />
      <Container
        sx={{
          gap: '1em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          minHeight: { xs: '80vh', sm: '70vh' },
          textAlign: 'center',
          textShadow: '0 0 0.125em black, 0 0 0.25em black, 0 0 0.5em black'
        }}
      >
        <Box sx={{ flexGrow: 1, opacity: { xs: 0, sm: 1 }, width: '100%' }}>
          {((base.isFetching || chain.isFetching) && (
            <Box align='center' sx={{ width: '100%' }}>
              <Typography color='textSecondary'>
                <CircularProgress size='1em' /> Loading Network Data...
              </Typography>
            </Box>
          )) || (
            <Grid container spacing={1} opacity={0} marginTop={0.5}>
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
        </Box>
        <Typography lineHeight={1.5} variant='caption' fontSize='1em'>
          The
          <Typography variant='h4' fontFamily='Nunito Sans' fontWeight='bold'>
            Mochimo
            <Box component='span' display={{ xs: 'none', sm: 'inline' }}>&nbsp;</Box>
            <Box component='span' display={{ xs: 'inline', sm: 'none' }}><br /></Box>
            Cryptocurrency Network
          </Typography>
          A complete reimplementation of Blockchain.
          Currency for the Post-Quantum era.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: ({ spacing }) => spacing(1)
          }}
        >
          <Tooltip title='Trade MCM!' arrow>
            <Link to='/exchanges'>
              <Button variant='contained'>Exchanges</Button>
            </Link>
          </Tooltip>
          <Tooltip title='Get your Mojo on!' arrow>
            <Link to='/resources'>
              <Button variant='contained'>Miners / Wallets</Button>
            </Link>
          </Tooltip>
          <Tooltip title='Much detail, many interesting!' arrow>
            <Link href='/assets/files/mochimo_wp_EN.pdf'>
              <Button variant='contained'>Whitepaper</Button>
            </Link>
          </Tooltip>
        </Box>
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
            width: '400%',
            height: '100%',
            left: '-150%',
            top: ({ spacing }) => spacing(16),
            boxShadow: ({ palette }) => '0 0 2em ' + palette.background.default
          }}
        />
        <HomepageDivider dense>Mochimo's Focus</HomepageDivider>
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
                  <Typography variant='caption'>
                    Future-Proofed and Privacy Enabled
                  </Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                  <Typography>
                    Quantum Computing is poised to break ECDSA encryption&nbsp;
                    <u><b>without warning</b></u>, leaving BTC, ETH and all
                    ERC-20 tokens unsafe for transactions and as a store of
                    value. Mochimo uses WOTS+ Quantum Resistant Security
                    approved by the EU funded PQCrypto research organization
                    and a one time addressing feature to secure privacy when
                    you want it.
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
                    an MPL 2.0 derivative Open Source license. There is no
                    centralized source of truth or trusted node. Mochimo is a
                    truly decentralized project promoting fair usage and mining
                    with a FPGA-tough, GPU targeted algorithm.
                  </Typography>
                </Grid>
              </Grid>
            </RaisedCard>
          </Grid>
        </Grid>
        <HomepageDivider>Mochimo Innovations</HomepageDivider>
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
            While the extensive history of updates and improvements to the
            Mochimo Cryptocurrency Engine is always accesible from Mochimo's&nbsp;
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
            In addition, here are some of the novel innovations that set
            Mochimo apart...
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
                src='/assets/icons/gpu-mcm.png'
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
        <HomepageDivider>Exchanges</HomepageDivider>
        <Grid
          container spacing={2} justifyContent='center' sx={{
            backgroundImage: 'url(/assets/backgrounds/nasa-Q1p7bh3SHj8-unsplash.jpg)',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            boxShadow: 'inset 0 0 4em 4em #1e1e1e'
          }}
        >
          <Grid item xs={12} sm={8} align='center'>
            <RaisedCard>
              <Grid container spacing={4} padding={2}>
                <Grid
                  item xs={12} sm={5} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant='caption'>THE TICKER</Typography>
                  <Typography variant='h2' gutterBottom>MCM</Typography>
                  <Box>
                    <Link to='/exchanges'>
                      <Button variant='contained'>Trade Mochimo</Button>
                    </Link>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={7} align='left'>
                  Mochimo can currently be bought or sold on a number of
                  notable exchanges. All exchanges that have listed Mochimo
                  have done so on their own accord. Hit the "TRADE MOCHIMO"
                  button to see the latest exchanges where MCM is located.
                  <br /><br />For a guide, see&nbsp;
                  <Link href='https://medium.com/mochimo-official/how-to-buy-mochimo-mcm-in-minutes-88d5dab2d8e8'>
                    How to buy MCM in minutes
                  </Link>
                </Grid>
              </Grid>
            </RaisedCard>
          </Grid>
        </Grid>
        <HomepageDivider>The Team</HomepageDivider>
        <Grid
          container spacing={2} justifyContent='center' sx={{
            backgroundImage: 'url(/assets/backgrounds/conny-schneider-xuTJZ7uD7PI-unsplash.jpg)',
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
                you can see some of the core contributors.&emsp;
                <Tooltip title="They're friendly" placement='top' arrow>
                  <Link to='/meet-the-team'>Meet The Team &#187;</Link>
                </Tooltip>
              </Typography>
            </RaisedCard>
          </Grid>
          <Grid item xs={12} sm={10} md={6} align='right'>
            <RaisedCard sx={{ height: '100%' }}>
              <Typography variant='h4' gutterBottom>
                Interested in Contributing?
              </Typography>
              <Typography>
                Core Contributors are selected based on recommendation, or via
                recognition of invaluable contributions to the project. If you
                wish to contribute to Mochimo, Pull Requests are always open.
                If you wish to discuss something specific, please reach out to
                the active community on&nbsp;
                <Link href='https://discord.mochimap.com/'>
                  Discord
                </Link>, or&nbsp;
                <Link href='mailto:support@mochimo.org'>
                  contact support
                </Link> with your inquiries.
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
          marginTop: 12,
          marginBottom: 4,
          borderRadius: 0,
          boxShadow: '0 0 1em 1em white'
        }}
      >
        <Typography variant='h2' gutterBottom>
          Need more answers about Mochimo?
        </Typography>
        <Typography display='block' variant='caption' gutterBottom>
          Come join the community
        </Typography>
        <Button variant='contained' href='https://discord.mochimap.com/'>
          <DiscordIcon />&emsp;Mochimo Official Discord
        </Button>
      </Paper>
    </Box>
  );
}
