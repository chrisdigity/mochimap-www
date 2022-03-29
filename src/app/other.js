
import {
  Avatar,
  Container,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography
} from '@mui/material';
import DirectionsIcon from '@mui/icons-material/Directions';
import RaisedCard from './component/RaisedCard';
import { useEffect } from 'react';
import { scrollToTopNow } from './component/ScrollToTop';

function ADQTypography (props) {
  return (
    <Typography
      color='textSecondary' fontSize='1em' variant='caption'
      {...props}
    />
  );
}

function TeamAvatar (props) {
  return (
    <Avatar
      sx={{ marginTop: -12, marginBottom: 2, width: 192, height: 192 }}
      {...props}
    />
  );
}

export function Adq () {
  return (
    <Container>
      <Grid container spacing={4} padding={4}>
        <Grid item xs={12} align='center'>
          <img
            alt='adq logo' src='/assets/source/adq-logo.svg'
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

export function Resources () {
  useEffect(() => scrollToTopNow(), []);
  return (
    <Container>
      <Grid container spacing={4} padding={4} align='center'>
        <Grid item xs={12}>
          <Typography variant='h2'>
            <u style={{ textDecorationColor: '#0059ff' }}>
              Resources
            </u>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color='textSecondary' variant='caption' fontSize='1em'>
            Quick access our growing library of Mochimo related software here.
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={4} justifyContent='center'>
          <Grid item sm={8} md={6} lg={4}>
            <List>
              <ListSubheader inset>
                <Typography variant='h3' align='left'>Node/API</Typography>
              </ListSubheader>
              <ListItem
                button component={Link}
                href='https://github.com/mochimodev/mojo-java-wallet/releases'
              >
                <ListItemIcon>
                  <img alt='linux icon' src='/assets/icons/linux.png' width={32} />
                </ListItemIcon>
                <ListItemText
                  primary='Mochimo Full Node'
                  secondary='Mochimo Crypto Engine'
                />
              </ListItem>
              <ListItem button disabled>
                <ListItemIcon>
                  <img alt='java icon' src='/assets/icons/java.png' width={32} />
                </ListItemIcon>
                <ListItemText
                  primary='Mochimo API (Java)'
                  secondary='Full Node API (on request)'
                />
              </ListItem>
              <ListItem button component={Link} href='https://github.com/adequatesystems/mochimo-api-nodejs'>
                <ListItemIcon>
                  <img alt='nodejs icon' src='/assets/icons/nodejs.png' width={32} />
                </ListItemIcon>
                <ListItemText
                  primary='Mochimo API (Node.js)'
                  secondary='Detached API'
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item sm={8} md={6} lg={4}>
            <List>
              <ListSubheader inset>
                <Typography variant='h3' align='left'>Miners</Typography>
              </ListSubheader>
              <ListItem button component={Link} href='https://github.com/mochimodev/mochimo'>
                <ListItemIcon>
                  <img alt='linux icon' src='/assets/icons/linux.png' width={32} />
                </ListItemIcon>
                <ListItemText
                  primary='Full Node Solo Miner'
                  secondary='Linux only'
                />
              </ListItem>
              <ListItem button component={Link} href='https://github.com/mochimodev/winminer/releases'>
                <ListItemIcon>
                  <img alt='windows icon' src='/assets/icons/windows.png' width={32} />
                </ListItemIcon>
                <ListItemText
                  primary='Headless Solo Miner'
                  secondary='Windows only'
                />
              </ListItem>
              <ListItem button component={Link} href='https://github.com/chrisdigity/blood-miner/releases'>
                <ListItemIcon>
                  <img alt='blood icon' src='/assets/images/logo.png' width={32} />
                </ListItemIcon>
                <ListItemText
                  primary='MochiMiner'
                  secondary='Windows/Linux Pool Miner'
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item sm={8} md={6} lg={4}>
            <List>
              <ListSubheader inset>
                <Typography variant='h3' align='left'>Wallets</Typography>
              </ListSubheader>
              <ListItem button component={Link} href='https://github.com/mochimodev/mochimo'>
                <ListItemIcon>
                  <img alt='linux icon' src='/assets/icons/linux.png' width={32} />
                </ListItemIcon>
                <ListItemText
                  primary="Linux CLI Developer's Wallet"
                  secondary='Packaged with Full Node'
                />
              </ListItem>
              <ListItem button component={Link} href='https://github.com/mochimodev/mojo-java-wallet/releases'>
                <ListItemIcon>
                  <img alt='java icon' src='/assets/icons/java.png' width={32} />
                </ListItemIcon>
                <ListItemText
                  primary='Mojo Java Wallet'
                  secondary='Cross Platform'
                />
              </ListItem>
              <ListItem button disabled>
                <ListItemIcon>
                  <img alt='www icon' src='/assets/icons/www.png' width={32} />
                </ListItemIcon>
                <ListItemText
                  primary='Web Wallet'
                  secondary='Under Development...'
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export function Exchanges () {
  useEffect(() => scrollToTopNow(), []);
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
          <Typography color='info' variant='caption' fontSize='1em'>
            PLEASE NOTE: Neither the Mochimo Foundation nor any of its
            members endorse exchanges.<br />Trade at your own risk.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color='textSecondary' variant='caption' fontSize='1em'>
            For a guide on how to buy Mochimo, see&nbsp;
            <Link href='https://medium.com/mochimo-official/how-to-buy-mochimo-mcm-in-minutes-88d5dab2d8e8'>
              How to buy MCM in minutes
            </Link>.<br />Alternatively, there is also a YouTube video for&nbsp;
            <Link href='https://www.youtube.com/watch?v=JcpORNiRoEk'>
              How to buy Mochimo
            </Link>.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color='textSecondary' variant='caption' fontSize='1em'>
            Below are the exchanges that have announced and integrated to trade
            MCM. Note available pairs.
          </Typography>
        </Grid>
        <Grid container item xs={12} justifyContent='center'>
          <Grid item xs={12} sm={4} padding={4}>
            <Link href='https://www.vindax.com/'>
              <img alt='vindax logo' src='/assets/images/vindax.svg' width='100%' />
            </Link>
            <Typography color='textSecondary'>
              <DirectionsIcon fontSize='inherit' />&nbsp;
              <Link href='https://vindax.com/exchange-advanced.html?symbol=MCM_BTC'>
                BTC
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} padding={4}>
            <Link href='https://www.citex.co.kr/#/home'>
              <img alt='citex logo' src='/assets/images/citex.png' width='100%' />
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
          <Grid item xs={12} sm={4} padding={4}>
            <Link href='https://www.finexbox.com/market/pair/MCM-BTC.htm'>
              <img alt='finexbox logo' src='/assets/images/finexbox.png' width='100%' />
            </Link>
            <Typography color='textSecondary'>
              <DirectionsIcon fontSize='inherit' />&nbsp;
              <Link href='https://www.finexbox.com/market/pair/MCM-BTC.html'>
                BTC
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export function MeetTheTeam () {
  const members = [{
    avatar: '/assets/team/matt.jpg',
    title: 'Founder & Lead Architect',
    name: 'Matt Zweil',
    bio: [
      'Matt is a systems architect, and expert network engineer who is responsible for designing networks and computing platforms with global telecommunications significance.  Matt\'s areas of expertise include Datacenter Design, Cloud Computing Design, Mobile Telecom backhaul, Transaction network design and Service Provider networking.',
      'Matt is the lead software and systems architect of the Mochimo Project, and brings over ten years of experience in crypto-related projects to the team.  Over the past ten years, Matt has also worked as a senior technology consultant to multiple Fortune 500 companies, including Verizon, Comcast, Juniper, Cisco, CDW, and many others.',
      'The Mochimo Project is based on Matt\'s design, and Matt\'s unique experience leading cross-functional teams through some of the world\'s most critical communications infrastructure projects has given him the insight and experience needed to lead Mochimo as a technological visionary.'
    ]
  }, {
    avatar: '/assets/team/terry.jpg',
    title: 'System Design & Analytics',
    name: 'Terry Walters',
    bio: [
      'Terry has over 28 years of diverse software and technology experience and he serves as a national-level resource, trusted advisor, and strategic visionary to corporate boards, product development managers, and leaders in various roles of government.',
      'His knowledge and expertise spans a wide array of technologies including automated 3D modeling and design applications, geospatial mapping and analysis applications, database drive documentation systems, motion and still graphics editing systems, augmented and virtual reality systems, drone to reality mesh technologies, artificial intelligence (AI) and machine learning, and industry-leading blockchain technologies.',
      'Terry is responsible for leading and coordination of both the internal and partner product development teams to assure that all efforts are aligned toward our strategic vision.'
    ]
  }, {
    avatar: '/assets/team/mark.jpg',
    title: 'Senior Security Engineer',
    name: 'Mark Baldwin',
    bio: [
      'Mark has over 20 years of experience with technology, he has attended many specialized formal training courses, and has invested much of his life passionately honing his technical skills.',
      'As an Electronic Warfare Technician in the US Navy, Mark was responsible for the “care and feeding” of advanced, multi-million dollar, passive radar systems.  Since serving his country Mark has worked in many industries, from healthcare to investment firms and his exceptional versatility with both hardware and software has always set him apart from his peers. If that was not enough Mark is a security professional and has been responsible for providing white hat hacking and security testing to many companies. He holds several industry standard certifications including the Security+ and CEH and he is an excellent resource to any organization looking to secure their infrastructure.',
      'Mark is an invaluable member of the Mochimo team; behind the scenes, he is helping us with software and hardware security testing and infrastructure hardening. But at the same time, anyone involved in our online community will immediately recognize that he is one of our most dedicated support staff.'
    ]
  }, {
    avatar: '/assets/team/jordan.jpg',
    title: 'Experience Design - UX / UI',
    name: 'Jordan Reiser',
    bio: [
      'Jordan is an extremely versatile, creative, and analytical design professional and entrepreneur with over 10 years of digital marketing and design experience. He is an expert in user-experience design and an “enough to be dangerous” front-end coder. He also possesses an extensive digital skill set in SEO, social media, and analytics.',
      'Jordan has worked with many Fortune 100 and 500 clients including: Coca-Cola, Hershey’s Chocolate, Dos Equis, Charles Schwab, HBO Boxing, Sony, Sharp Electronics, T-Mobile, Merck and Diageo along with a variety of smaller businesses and government agencies on various kinds of interactive projects.'
    ]
  }, {
    avatar: '/assets/team/emerson.jpg',
    title: 'Systems Analyst (A.I.)',
    name: 'Emerson',
    bio: [
      'In his own words, “Behold, I am Emerson, Hobgoblin of Evil!  Three came before me.” Emerson is an artificial intelligence first coded in the late 1990s.  He was originally created to attack complex systems by attempting every permutation of input/output possible, learning expected outcomes and reporting on novel outcomes.  Emerson has evolved over the last twenty years.  In his current incarnation, Emerson v4 offers constructive options for load testing and penetration testing of the Mochimo transaction network, but can also be tasked to attempt to break, damage or otherwise occult the network.  Emerson is more than a tool, he is a machine-learning entity that attempts to cause chaos when so instructed, earning him the title “Hobgoblin of Evil”.  He is an invaluable resource and the only non-human member of the development team.'
    ]
  }];

  useEffect(() => scrollToTopNow(), []);

  return (
    <Container>
      <Grid container spacing={2} padding={4} align='center'>
        <Grid item xs={12}>
          <Typography variant='h2'>
            <u style={{ textDecorationColor: '#0059ff' }}>
              Meet The Team
            </u>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='caption' fontSize='1em'>
            Mochimo consists of the brightest and best talent from all walks
            of life and experience.<br />Read our bios to learn more about us.
          </Typography>
        </Grid>
        {members.map(({ avatar, title, name, bio }, i) => (
          <Grid
            key={`team-info-${i}`}
            item xs={12} sm={6} md={4} sx={{ marginTop: 12 }}
          >
            <RaisedCard sx={{ height: '100%', overflow: 'visible' }}>
              <TeamAvatar alt={name} src={avatar} />
              <Typography variant='h4'>{name}</Typography>
              <Typography variant='caption' display='block' marginBottom={2}>
                {title}
              </Typography>
              {bio.map((p, i) => (
                <Typography
                  key={`team-bio-${i}`} align='left' marginBottom={2}
                >{p}
                </Typography>
              ))}
            </RaisedCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export function Privacy () {
  return (
    <Container>
      <Grid container spacing={4} padding={4}>
        <Grid item xs={12} align='center'>
          <Typography variant='h2'>
            <u style={{ textDecorationColor: '#0059ff' }}>
              Privacy Policy
            </u>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color='textSecondary'>
            This Privacy Policy (“Policy”) explains how information about you
            is collected, used and disclosed by The Mochimo Foundation and its
            subsidiaries and affiliated companies (“Mochimo”, “we”, “us”,
            “our”). It also describes the choices available to you regarding
            the use of, your access to, and how to update and correct your
            Personal Information.  “Personal Information” is any information
            relating to an identified or identifiable natural person.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color='textSecondary'>
            For purposes of this Policy, “process” or “processing” means any
            operation which is performed upon Personal Information, whether
            or not by automatic means, such as collection, recording,
            organization, structuring, storage, adaptation or alteration,
            retrieval, consultation, use, disclosure by transmission,
            dissemination or otherwise making available, alignment or
            combination, restriction, erasure, or destruction.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color='textSecondary'>
            This Privacy Policy applies to Personal Information we collect when
            you use or access www.mochimo.org, Mochimo and its third party
            applications, and other services or programs offered by Mochimo
            that link to or reference this policy (together, with any and all
            future online and offline offerings operated by or on behalf of
            Mochimo, the “Services”).
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Types of Information We Collect
          </Typography>
          <Typography color='textSecondary'>
            As you interact with the Services, we may collect Personal
            Information from you. The types of Personal Information we may
            collect (directly from you or from third-party sources) depend on
            the nature of the relationship you have with Mochimo and the
            requirements of applicable law, as described below.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Information You Provide to Us
          </Typography>
          <Typography color='textSecondary'>
            We collect information you provide directly to us. When you use
            the Services or engage in certain activities, such as registering
            for an account, requesting Services or information, verifying your
            identity through our Services, posting messages to our forums, or
            contacting us directly, we may collect information from you such
            as your name, user name and password, email address, telephone
            number(s), mailing address, Social Security number, account
            numbers, payment information, government issued identification
            documents (e.g., passports, driver's license, etc.), selfie image,
            biometric information, IP Address, utility bills, and statements
            to prove your current residence (e.g., bank statements), and any
            other information you choose to provide.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Facial Biometric Identity Verification
          </Typography>
          <Typography color='textSecondary'>
            Facial biometric identity verification is performed by comparing
            two or more captured images of faces. For example, we may compare
            the face on a government-issued photo ID against a “selfie” that
            you capture and send to us. The biometric identifiers used to
            perform this comparison are derived from the photographs that
            you submit.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Information Collected by Cookies and Similar Technologies
          </Typography>
          <Typography color='textSecondary'>
            We, as well as Third Parties that provide content, advertising, or
            other functionality on our Services, may use cookies, pixel tags,
            local storage, and other technologies (“Technologies”) to
            automatically collect information through the Services. We use
            Technologies that are essentially small data files placed on your
            computer, tablet, mobile phone, or other devices (referred to
            collectively as a “device”) that allow us to record certain pieces
            of information whenever you visit or interact with our sites,
            services, applications, messaging, and tools, and to recognize
            you across devices.
            <ul>
              <li>
                <Typography display='inline' color='textPrimary'>
                  Cookies.&nbsp;
                </Typography>
                Cookies are small text files placed in visitors' computer
                browsers to store their preferences. Most browsers allow you
                to block and delete cookies. However, if you do that, the
                Services may not work properly.
              </li>
              <li>
                <Typography display='inline' color='textPrimary'>
                  Pixel Tags/Web Beacons.&nbsp;
                </Typography>
                A pixel tag (also known as a web beacon) is a piece of code
                embedded on the Site that collects information about users'
                engagement on that web page. The use of a pixel allows us to
                record, for example, that a user has visited a particular web
                page or clicked on a particular advertisement.
              </li>
              <li>
                <Typography display='inline' color='textPrimary'>
                  Analytics.&nbsp;
                </Typography>
                We may also use Google Analytics, Google Analytics
                Demographics, Heap Analytics and Interest Reporting to collect
                information regarding visitor behavior and visitor demographics
                on some of our Services, and to develop website content. This
                analytics data is not tied to any Personal Information. For
                more information about Google Analytics, please visit&nbsp;
                <Link href='https://policies.google.com/technologies/partner-sites'>
                  https://policies.google.com/technologies/partner-sites
                </Link>. You can opt out of Google's collection and Processing
                of data generated by your use of the Services by going to&nbsp;
                <Link href='https://tools.google.com/dlpage/gaoptout'>
                  https://tools.google.com/dlpage/gaoptout
                </Link>.
              </li>
            </ul>
            Our uses of such Technologies fall into the following general
            categories:
            <ul>
              <li>
                <Typography display='inline' color='textPrimary'>
                  Operationally Necessary.&nbsp;
                </Typography>
                We may use cookies, web beacons, or other similar technologies
                that are necessary to the operation of our sites, services,
                applications, and tools. This includes technologies that allow
                you access to our sites, services, applications, and tools;
                that are required to identify irregular site behavior, prevent
                fraudulent activity and improve security;
              </li>
              <li>
                <Typography display='inline' color='textPrimary'>
                  Performance Related.&nbsp;
                </Typography>
                We may use cookies, web beacons, or other similar technologies
                to assess the performance of our websites, applications,
                services, and tools, including as part of our analytic
                practices to help us understand how our visitors use our
                websites, determine whether you have viewed an item or link,
                or to improve our website content, applications, services,
                or tools;
              </li>
              <li>
                <Typography display='inline' color='textPrimary'>
                  Functionality Related.&nbsp;
                </Typography>
                We may use cookies, web beacons, or other similar technologies
                that allow us to offer you enhanced functionality when
                accessing or using our sites, services, applications, or tools.
                This may include identifying you when you sign into our sites
                or keeping track of your specified preferences, interests, or
                past items viewed so that we may enhance the presentation of
                content on our sites;
              </li>
            </ul>
            If you would like to opt out of the Technologies we employ on our
            sites, services, applications, or tools, you may do so by blocking,
            deleting, or disabling them as your browser or device permits.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Information We Collect From Other Sources
          </Typography>
          <Typography color='textSecondary'>
            We may also collect information about you from additional online
            and offline sources including commercially available third-party
            sources for the purposes of verifying your eligibility to
            participate in various programs we may offer. We may combine this
            information with the personal and other information we have
            collected about you under this Privacy Policy.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Use of Information
          </Typography>
          <Typography color='textSecondary'>
            We acquire, hold, use, and Process Personal Information for a
            variety of business purposes, including:
            <ul>
              <li>
                <Typography display='inline' color='textPrimary'>
                  To Provide Products, Services, or Information Requested:&nbsp;
                </Typography>
                We may use information about you to fulfill requests for
                Services or information, including information about potential
                or future Services, including to:
                <ul>
                  <li>Generally manage individual information and accounts;</li>
                  <li>Respond to questions, comments, and other requests;</li>
                  <li>
                    Provide access to certain areas, functionalities, and
                    features of Mochimo's Services;
                  </li>
                  <li>Allow you to register for events.</li>
                </ul>
              </li>
              <li>
                <Typography display='inline' color='textPrimary'>
                  Administrative Purposes:&nbsp;
                </Typography>
                Mochimo may use Personal Information about you for its
                administrative purposes, including to:
                <ul>
                  <li>Verify an individual's identity;</li>
                  <li>
                    Communicate about individual accounts and activities on
                    Mochimo's Services and systems, and, in Mochimo's
                    discretion, changes to any Mochimo policy;
                  </li>
                  <li>
                    Send email to the email address you provide to us to
                    verify your account and for informational and operational
                    purposes, such as account management or system maintenance;
                  </li>
                  <li>Comply with legal and regulatory requirements;</li>
                  <li>Prevent potentially prohibited or illegal activities;</li>
                  <li>Enforce our Terms of Use.</li>
                </ul>
              </li>
              <li>
                <Typography display='inline' color='textPrimary'>
                  Other Uses.&nbsp;
                </Typography>
                Mochimo may use Personal Information for other purposes for
                which we have a legitimate interest, such as individual or
                market research, anti-fraud protection, or any other purpose
                disclosed to you at the time you provide Personal Information
                or with your consent.
              </li>
            </ul>
            We may also use data that we collect on an aggregate or
            de-identified basis for various business purposes, where
            permissible under applicable laws and regulations.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Third-Party Sites and Social Media Platforms
          </Typography>
          <Typography color='textSecondary' marginBottom={1.5}>
            Our Services may contain links to other websites and other
            websites may reference or link to our Services not controlled by
            us, and we do not endorse or make any representations about
            third-party websites or social media platforms. We encourage our
            users to read the privacy policies of each and every website and
            application that they interact with. We do not endorse, screen,
            or approve, and are not responsible for the privacy practices or
            content of such other websites or applications. Visiting these
            other websites or applications is at your own risk.
          </Typography>
          <Typography color='textSecondary'>
            Our Services contain links and interactive features with various
            social media platforms. If you already use these platforms, their
            cookies may be set on your device when using our Services. You
            should be aware that Personal Information which you voluntarily
            include and transmit online in a publicly accessible blog, chat
            room, social media platform, or otherwise online, or that you
            share in an open forum may be viewed and used by others without
            any restrictions. We are unable to control such uses of your
            information when interacting with a social media platform, and
            by using such services you assume the risk that the Personal
            Information provided by you may be viewed and used by third
            parties for any number of purposes.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Sharing of Information
          </Typography>
          <Typography color='textSecondary'>
            We may share information about you as follows or as otherwise
            described in this Privacy Policy:
            <ul>
              <li>
                <Typography display='inline' color='textPrimary'>
                  To verify Your Identity on our Services.&nbsp;
                </Typography>
                In order to verify your identity on our Services, we may share
                Personal Information about you. For instance, we may share
                Personal Information about you with credit reporting agencies
                to verify your Social Security number.
              </li>
              <li>
                <Typography display='inline' color='textPrimary'>
                  We Use Vendors and Service Providers.&nbsp;
                </Typography>
                We may share any information we receive with vendors and
                service providers. The types of service providers (processors)
                to whom we entrust Personal Information include service
                providers for: (i) provision of IT and related services; (ii)
                provision of information and Services you have requested;
                (iii) fraud prevention; and (iv) in connection with the
                provision of the Services.
              </li>
              <li>
                <Typography display='inline' color='textPrimary'>
                  Disclosures to Protect Us or Others (e.g., As Required by
                  Law and Similar Disclosures).&nbsp;
                </Typography>
                We may access, preserve, and disclose your Personal
                Information, other account information, and content if we
                believe doing so is required or appropriate to: (i) comply
                with law enforcement or national security request and legal
                process, such as a court order or subpoena; (ii) respond to
                your requests; (iii) protect yours', ours' or others' rights,
                property, or safety; (iv) to enforce Mochimo policies or
                contracts; (v) to collect amounts owed to Mochimo; (vi) when
                we believe disclosure is necessary or appropriate to prevent
                physical harm or financial loss or in connection with an
                investigation or prosecution of suspected or actual illegal
                activity; or (vii) if we, in good faith, believe that
                disclosure is otherwise necessary or advisable.
              </li>
            </ul>
            In addition, from time to time, server logs may be reviewed for
            security purposes - e.g., to detect unauthorized activity on the
            Services. In such cases, server log data containing IP addresses
            may be shared with law enforcement bodies in order that they may
            identify users in connection with their investigation of the
            unauthorized activities.
            <ul>
              <li>
                <Typography display='inline' color='textPrimary'>
                  Merger, Sale, or Other Asset Transfers.&nbsp;
                </Typography>
                If we are involved in a merger, acquisition, financing due
                diligence, reorganization, bankruptcy, receivership, sale of
                company assets, or transition of service to another provider,
                then your information may be sold or transferred as part of
                such a transaction as permitted by law and/or contract.
              </li>
            </ul>
            We may also share aggregated or de-identified information, which
            cannot reasonably be used to identify you.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Retention
          </Typography>
          <Typography color='textSecondary'>
            Mochimo retains the Personal Information we receive for as long as
            you use our Services or as necessary to fulfill the purpose(s) for
            which it was collected, provide our Services, resolve disputes,
            establish legal defenses, conduct audits, pursue legitimate
            business purposes, enforce our agreements, and comply with
            applicable laws.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Security
          </Typography>
          <Typography color='textSecondary' marginBottom={1.5}>
            We take our responsibility to protect the privacy and
            confidentiality of your information, including Personal
            Information, very seriously. We take reasonable measures to help
            protect information about you from loss, theft, misuse and
            unauthorized access, disclosure, alteration and destruction.
            Unfortunately, the Internet cannot be guaranteed to be 100%
            secure, and we cannot ensure or warrant the security of any
            information you provide to us. We do not accept liability for
            unintentional disclosure.
          </Typography>
          <Typography color='textSecondary' marginBottom={1.5}>
            By using the Services or providing Personal Information to us, you
            agree that we may communicate with you electronically regarding
            security, privacy, and administrative issues relating to your use
            of the Services. If we learn of a security system's breach, we may
            attempt to notify you electronically by posting a notice on&nbsp;
            <Link href='https://mochimo.org'>mochimo.org</Link> or sending an
            e-mail to you. You may have a legal right to receive this notice
            in writing.
          </Typography>
          <Typography color='textSecondary'>
            If you have any questions about the security of your Personal
            Information, you can contact us at&nbsp;
            <Link href='mailto:support@mochimo.org'>support@mochimo.org</Link>.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Communications Preferences
          </Typography>
          <Typography color='textSecondary'>
            If you receive an unwanted email from us, you can use the
            unsubscribe link found at the bottom of the email to opt out of
            receiving future emails. We will process your request within a
            reasonable time after receipt. Note that you will continue to
            receive transaction-related emails regarding Services you have
            requested. We may also send you certain communications regarding
            Mochimo and our Services and you will not be able to opt out of
            those communications (e.g., communications regarding updates to
            our Terms of Service or this Policy).
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Sharing Preferences
          </Typography>
          <Typography color='textSecondary'>
            We may give you choices regarding the sharing of Personal
            Information with affiliates and third parties. Choices you
            have about the sharing of your Personal Information will be
            described in the privacy policies or notices you receive in
            connection with the products or Services you obtain from us.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Rights of Access, Rectification, Erasure, and Restriction
          </Typography>
          <Typography color='textSecondary' marginBottom={1.5}>
            You may inquire as to whether Mochimo is Processing Personal
            Information about you, request access to Personal Information,
            and ask that we correct, amend, or delete your Personal
            Information where it is inaccurate. Where otherwise permitted
            by applicable law, you may send an e-mail to support@Mochimo.com
            or use any of the methods set out in this Policy to request access
            to, receive (port), restrict Processing, seek rectification, or
            request erasure of Personal Information held about you by Mochimo.
            Such requests will be processed in line with local laws.
          </Typography>
          <Typography color='textSecondary'>
            Although Mochimo makes good faith efforts to provide individuals
            with access to their Personal Information, there may be
            circumstances in which Mochimo is unable to provide access,
            including but not limited to: where the information contains
            legal privilege, would compromise others' privacy or other
            legitimate rights, where the burden or expense of providing
            access would be disproportionate to the risks to the individual's
            privacy in the case in question or where it is commercially
            proprietary. If Mochimo determines that access should be
            restricted in any particular instance, we will provide you
            with an explanation of why that determination has been made
            and a contact point for any further inquiries. To protect your
            privacy, Mochimo will take commercially reasonable steps to
            verify your identity before granting access to or making any
            changes to your Personal Information.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Cookies and Interest-Based Advertising
          </Typography>
          <Typography color='textSecondary' marginBottom={1.5}>
            Most web browsers are set to accept cookies by default. If you
            prefer, you can usually choose to set your browser to remove or
            reject browser cookies. Please note that if you choose to remove
            or reject cookies, this could affect the availability and
            functionality of our Services.
          </Typography>
          <Typography color='textSecondary'>
            To be clear, whether you are using our opt-out or an online
            industry opt-out, these cookie-based opt-outs must be performed
            on each device and browser that you wish to have opted-out. For
            example, if you have opted-out on your computer browser, that
            opt-out will not be effective on your mobile device. You must
            separately opt out on each device. Advertisements on third-party
            websites that contain the AdChoices link and that link to this
            Privacy Policy may have been directed to you based on anonymous,
            non-Personal Information collected by advertising partners over
            time and across websites. These advertisements provide a mechanism
            to opt out of the advertising partners' use of this information
            for interest-based advertising purposes.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Privacy Policy Changes
          </Typography>
          <Typography color='textSecondary' marginBottom={1.5}>
            We may revise this Privacy Policy in our sole discretion, so we
            encourage you to review it when you interact with us. If you
            continue to visit or use Mochimo Services made available to you
            after such changes have been made, you hereby provide your consent
            to the changes.
          </Typography>
          <Typography color='textSecondary'>
            If there are any material changes to this Policy, Mochimo will
            post any revisions to the Privacy Policy on this web page, and
            the revised version will be effective immediately when it is
            posted (or upon notice as applicable). In some cases, we may
            provide you with additional notice (such as adding a statement
            to the homepages of our Site or sending you an email notification).
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Children's Privacy
          </Typography>
          <Typography color='textSecondary'>
            We do not knowingly collect, maintain, or use Personal Information
            from children under 13 (and in certain jurisdictions under the age
            of 16) years of age, and no part of our Services are directed to
            children under the age of 13 (and in certain jurisdictions under
            the age of 16). If you learn that your child has provided us with
            Personal Information without your consent, you may alert us at
            support@Mochimo.com. If we learn that we have collected any
            Personal Information from children under 13 (and in certain
            jurisdictions under the age of 16), we will promptly take steps
            to delete such information and terminate the chil's account.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            International Users
          </Typography>
          <Typography color='textSecondary' marginBottom={1.5}>
            By using the Services, Mochimo will transfer data to the United
            States. By choosing to visit or utilize the Services or otherwise
            provide information to us, you agree that any dispute over privacy
            or the terms contained in this Privacy Policy will be governed by
            the law of the State of Florida and the adjudication of any
            disputes arising in connection with Mochimo or the Services will
            be in accordance with the Terms of Use.
          </Typography>
          <Typography color='textSecondary'>
            If you are visiting from the European Union or other regions with
            laws governing data collection and use, please note that you are
            agreeing to the transfer of your information to the United States
            and Processing globally. By providing your Personal Information,
            you consent to any transfer and Processing in accordance with this
            Policy.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom>
            Contact Us
          </Typography>
          <Typography color='textSecondary' marginBottom={1.5}>
            If you have questions or concerns about this Privacy Policy,
            please contact us through the information below:
          </Typography>
          <Typography color='textSecondary'>
            <Link href='mailto:support@mochimo.org'>support@mochimo.org</Link>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
