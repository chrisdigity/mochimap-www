
import * as THREE from 'three';
import { EffectComposer, Bloom, GodRays } from '@react-three/postprocessing';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { applyObjDiff, dupObj } from 'util';
import { useGetBaseQuery, useGetChainQuery, useGetContributorsQuery, useGetNetworkQuery } from 'api';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, AvatarGroup, Box, Button, Card, CardContent, CardHeader, CircularProgress, Container, Divider, Grid, LinearProgress, Link, ListItem, ListItemIcon, ListItemText, Paper, Tooltip, Typography } from '@mui/material';
import SuffixedValue from './component/SuffixedValue';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Masonry } from '@mui/lab';
import { Amount } from './component/Types';
import DiscordIcon from './icons/DiscordIcon';

const CURVE_SEGMENTS = 200;
const distS = new THREE.Spherical();
const dist = new THREE.Vector3();
const force = new THREE.Vector3();
const center = new THREE.Vector3();
const axis = new THREE.Vector3(0, 1, 0);
const tempObject = new THREE.Object3D();
const tempQuaternion = new THREE.Quaternion();
const tempSpherical = new THREE.Spherical();

function Nodes ({ data, options }) {
  // declare references for useFrame access
  const mref = useRef();
  const pref = useRef();
  // declare tracked nodes
  const [max, setMax] = useState(0);
  const [nodes] = useState(new Map());
  const updateNodes = (node) => {
    // apply or assign node to nodes Map()
    if (nodes.has(node.ip)) applyObjDiff(nodes.get(node.ip), dupObj(node));
    else nodes.set(node.ip, { v: new THREE.Vector3().random(), ...dupObj(node) });
  };

  // ///////////////////////////
  // Network Updates (useEffect)
  useEffect(() => { // update (whole) netwok state
    if (!data?.length) return;
    console.log('MochiMap data received...');
    data.forEach(updateNodes);
  }, [data]);
  useEffect(() => { // update (individual) node state
    // expose EventSource API and create new stream
    const { EventSource } = window;
    const source = new EventSource('https://new-api.mochimap.com/stream?network');
    // set stream event handlers
    source.onopen = () => console.log('MochiMap Stream opened...');
    source.onerror = (error) => console.error(error);
    source.onmessage = (message) => {
      // ignore non-object messages
      if (typeof message !== 'object') return;
      if (typeof message.data !== 'string') return;
      try { // convert data, check ip, delete eventType and update
        const update = JSON.parse(message.data);
        const { ip } = update;
        if (typeof ip !== 'string') return;
        delete update.eventType;
        updateNodes(update);
      } catch (error) {
        // catch process breaking error
        console.error(error);
      }
    };
    // return unmount/cleanup function
    return () => {
      source.close();
      console.log('MochiMap Stream closed...');
    };
  }, []);

  // ////////////////////////////////
  // THREE initialization (useMemo)
  const attributes = useMemo(() => {
    const ab = new THREE.Vector3();
    const cb = new THREE.Vector3();
    // initialize curve
    const array = Array(5).fill(null).map(() => new THREE.Vector3());
    const curve2 = new THREE.CatmullRomCurve3(
      array,
      false, 'catmullrom', 1.0);
    // positon curve2 points
    curve2.points[0].set(0, 0, 0);
    curve2.points[1].setFromSphericalCoords(0.75, Math.PI / 16, -(Math.PI / 5));
    curve2.points[2].set(0, 1, 0);
    curve2.points[3].setFromSphericalCoords(0.75, Math.PI / 16, Math.PI / 5);
    const points = curve2.getPoints(CURVE_SEGMENTS);
    // initialize float32 array for positions
    const normals = new Float32Array(points.length * 3 * 3);
    const positions = new Float32Array(points.length * 3 * 3);
    let index = 0;
    for (let i = 0, j = points.length - 1; i < j;) {
      if (i < j) {
        // calc flat face normal
        cb.subVectors(points[j], points[i + 1]);
        ab.subVectors(points[i], points[i + 1]);
        cb.cross(ab);
        cb.normalize();
        // set attribute values
        normals[index] = cb.x;
        positions[index++] = points[i].x;
        normals[index] = cb.y;
        positions[index++] = points[i].y;
        normals[index] = cb.z;
        positions[index++] = points[i].z;
        normals[index] = cb.x;
        positions[index++] = points[i + 1].x;
        normals[index] = cb.y;
        positions[index++] = points[i + 1].y;
        normals[index] = cb.z;
        positions[index++] = points[i + 1].z;
        normals[index] = cb.x;
        positions[index++] = points[j].x;
        normals[index] = cb.y;
        positions[index++] = points[j].y;
        normals[index] = cb.z;
        positions[index++] = points[j].z;
        i++; // progress i pointer
      }
      if (j > i) {
        // calc flat face normal
        cb.subVectors(points[i], points[j - 1]);
        ab.subVectors(points[j], points[j - 1]);
        cb.cross(ab);
        cb.normalize();
        // set attribute values
        normals[index] = cb.x;
        positions[index++] = points[j].x;
        normals[index] = cb.y;
        positions[index++] = points[j].y;
        normals[index] = cb.z;
        positions[index++] = points[j].z;
        normals[index] = cb.x;
        positions[index++] = points[j - 1].x;
        normals[index] = cb.y;
        positions[index++] = points[j - 1].y;
        normals[index] = cb.z;
        positions[index++] = points[j - 1].z;
        normals[index] = cb.x;
        positions[index++] = points[i].x;
        normals[index] = cb.y;
        positions[index++] = points[i].y;
        normals[index] = cb.z;
        positions[index++] = points[i].z;
        j--; // progress j pointer
      }
    }
    return { normals, positions };
  }, []);

  // ////////////////////////
  // THREE updates (useFrame)
  useFrame(() => {
    // check network size
    let { size } = nodes;
    if (size) {
      // ensure adequate space is allocated for attributes
      if (size >= max) {
        // update max to next boundary (+32 increments)
        setMax(size = ((size >> 5) << 5) + 32);
        // expand points geometry vertices
        pref.current.geometry.setAttribute('position',
          new THREE.Float32BufferAttribute(size * 3, 3));
      }
      const ppositions = pref.current.geometry.attributes.position.array;
      let index = 0;
      // update points positions
      const gravitationalForce = 0.997;
      nodes.forEach((node) => {
        let dist2;
        const { peers, v } = node;
        if (peers && peers.length) {
          force.set(0, 0, 0); // clear previous force
          for (let i = 0; i < peers.length; i++) {
            if (nodes.has(peers[i])) {
              const to = nodes.get(peers[i]);
              if (i < 32) {
                // add all target vectors to force
                dist.subVectors(v, to.v);
                dist2 = v.distanceTo(to.v);
                if (dist2 > 0.01) dist.divideScalar(dist2 / i);
                force.add(dist);
              }
            }
          }
          // apply flower force
          dist.set(0, 50, 0);
          force.add(dist);
          distS.setFromVector3(force);
          distS.phi -= Math.pow(distS.phi / Math.PI, 2);
          distS.radius -= dist.y;
          force.add(dist.setFromSpherical(distS.makeSafe()));
          // apply flower shape force
          dist.set(0, 0, 0);
          force.lerp(dist, gravitationalForce);
          // apply (clamped distance-dampened) force to vector...
          v.lerp(force, Math.min(0.25, Math.max(0, v.distanceToSquared(force))));
          // apply new position to positions array
          ppositions[index++] = v.x;
          ppositions[index++] = v.y;
          ppositions[index++] = v.z;
          // set leaf transform
          tempSpherical.setFromVector3(v);
          tempQuaternion.setFromUnitVectors(axis, v.clone().normalize());
          tempObject.scale.setScalar(center.distanceTo(v));
          tempObject.scale.x /= Math.max(0.75, v.y);
          tempObject.quaternion.copy(tempQuaternion);
          tempObject.rotateOnAxis(axis, tempSpherical.theta);
          tempObject.updateMatrix();
          mref.current.setMatrixAt((index / 3) - 1, tempObject.matrix);
        }
      });
      // set draw range of points to size of nodes
      pref.current.geometry.setDrawRange(0, index / 3);
      // set needsUpdate flag for colors/positions
      pref.current.geometry.attributes.position.needsUpdate = true;

      mref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={pref}>
        <bufferGeometry />
        <pointsMaterial size={0.05} color='white' />
      </points>
      <instancedMesh ref={mref} args={[null, null, max]}>
        <bufferGeometry>
          <bufferAttribute
            attachObject={['attributes', 'position']}
            args={[attributes.positions, 3]}
          />
          <bufferAttribute
            attachObject={['attributes', 'normal']}
            args={[attributes.normals, 3]}
          />
        </bufferGeometry>
        <meshPhysicalMaterial color='#0059ff' side={THREE.DoubleSide} />
      </instancedMesh>
    </>
  );
}
// <meshLambertMaterial color='#0059ff' side={THREE.DoubleSide} />
function Lighting () {
  const light = useRef();
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    light.current.position.copy(camera.position);
  });

  return (
    <>
      <pointLight ref={light} decay={2} distance={10} />
      <pointLight position={[0, 0.25, 0]} decay={2} distance={3} intensity={10} />
    </>
  );
}

function Controls ({ ...props }) {
  const controls = useRef();

  useEffect(() => {
    if (controls.current) {
      controls.current.setPolarAngle(Math.PI / 3);
      const { position } = controls.current.object;
      tempSpherical.setFromVector3(position);
      tempSpherical.radius = 4;
      position.setFromSpherical(tempSpherical);
    }
  }, [controls]);

  return (
    <OrbitControls
      ref={controls}
      target={center}
      enablePan={false}
      enableZoom={false}
      enableRotate={false}
      autoRotateSpeed={-0.25}
      autoRotate
      {...props}
    />
  );
}

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

function HomepageFocus () {
  return (
    <Grid container spacing={2} justifyContent='center'>
      <Grid item xs={12} sm={6} md={4}>
        <RaisedCard sx={{ height: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} align='center'>
              <Avatar
                variant='square' src='/img/quantum-computing.png' sx={{
                  justifyContent: 'center', width: 64, height: 64
                }}
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
                variant='square' src='/img/fast-charge.png' sx={{
                  justifyContent: 'center', width: 64, height: 64
                }}
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
                variant='square' src='/img/decentralized.png' sx={{
                  justifyContent: 'center', width: 64, height: 64
                }}
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

function HomepageAccordianSummary ({ expandIcon, src, ...props }) {
  return (
    <AccordionSummary
      expandIcon={expandIcon !== null ? <ExpandMoreIcon /> : null} sx={{
        display: 'flex', flexDirection: 'row', alignItems: 'middle'
      }}
    >
      <ListItem>
        <ListItemIcon><img src={src} /></ListItemIcon>
        <ListItemText {...props} />
      </ListItem>
    </AccordionSummary>
  );
}

function LatestHaiku () {
  const haiku = useGetChainQuery();

  return (
    <ListItemText inset>
      <Typography lineHeight={1} fontFamily='Redressed' fontSize='1.5em'>
        {(haiku.isFetching && (<CircularProgress />)) || (
          haiku.data?.haiku?.split(' \n').map((line, i) => (
            <span key={`latest-haiku-line-${i}`}>{line}<br /></span>
          ))
        )}
      </Typography>
    </ListItemText>
  );
}

function Innovations () {
  const [active, setActive] = useState(false);
  const handleChange = (panel) => (_event, isActive) => {
    setActive(isActive ? panel : false);
  };

  return (
    <Grid
      container spacing={2} justifyContent='center' sx={{
        backgroundImage: 'url(/img/john-adams-1xIN4FMR78A-unsplash.jpg)',
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
          <HomepageAccordianSummary src='/img/handshake.png'>
            Three-Way Handshake
          </HomepageAccordianSummary>
          <AccordionDetails>
            The Three-Way handshake is a network communication protocol
            requiring the collection of "acknowledgements" providing fast,
            simple and disposable security for secure requests to the
            decentralized network of nodes that make up the Mochimo Network.
          </AccordionDetails>
        </HomepageAccordion>
        <HomepageAccordion {...{ active, handleChange, panel: 'crunch' }}>
          <HomepageAccordianSummary src='/img/compress.png'>
            ChainCrunch™ Compression
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
          <HomepageAccordianSummary src='/img/poetry.png'>
            Haiku of the Blockchain
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
            {(active === 'haiku' && (<LatestHaiku />))}
          </AccordionDetails>
        </HomepageAccordion>
        <HomepageAccordion {...{ active, handleChange, panel: 'tag' }}>
          <HomepageAccordianSummary src='/img/tag.png'>
            Quantum Resistant Tags
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
          <HomepageAccordianSummary src='/img/pseudoblock.png'>
            Pseudo-block Failsafe
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
          <HomepageAccordianSummary src='/img/gpu_mcm.png'>
            FPGA-Tough POW
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
  );
}

export default function Homepage () {
  const core = useRef();
  const network = useRef();
  // declare initial network state data
  const { data } = useGetNetworkQuery();
  const base = useGetBaseQuery();
  const chain = useGetChainQuery();
  const contributors = useGetContributorsQuery(
    { owner: 'mochimodev', repo: 'mochimo' });

  useEffect(() => {
    const handleScroll = () => {
      network.current.style.top = (window.pageYOffset * 0.5) + 'px';
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Box ref={network} sx={{ position: 'absolute', top: 0, width: '100%', height: '100%', overflowX: 'hidden' }}>
        <Canvas>
          <Controls maxDistance={4 + (data?.length || 0)} />
          <Lighting />
          <mesh ref={core} scale={0.0025 * (data?.length || 0)}>
            <sphereGeometry />
            <meshBasicMaterial transparent color='lime' />
          </mesh>
          <Nodes data={data} />
          <Stars count={500} fade />
          <EffectComposer>
            <Bloom
              intensity={10} // The bloom intensity.
              height={1600} // render height
              luminanceThreshold={0.25} // luminance threshold. Raise this value to mask out darker elements in the scene.
              luminanceSmoothing={0.9} // smoothness of the luminance threshold. Range is [0, 1]
            />
            {core.current && (
              <GodRays sun={core.current} exposure={2} blur />
            )}
          </EffectComposer>
        </Canvas>
      </Box>
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
        <Grid container spacing={0}>
          {(base.isFetching && (
            <>
              <Grid item xs={2} sm={4} />
              <Grid item xs={8} sm={4} align='center'>
                <Typography color='textSecondary'>
                  Loading Network Data...
                </Typography>
                <LinearProgress />
              </Grid>
              <Grid item xs={2} sm={4} />
            </>
          )) || (
            <>
              <Grid item xs={6} align='left'>
                <Typography fontWeight='bold'>
                  <SuffixedValue value={base.data?.stats?.addresses} />
                </Typography>
                <Typography variant='caption'>Active Addresses</Typography>
              </Grid>
              <Grid item xs={6} align='right'>
                <Typography fontWeight='bold'>
                  <SuffixedValue value={base.data?.stats?.deltas} />
                </Typography>
                <Typography variant='caption'>Balance Deltas</Typography>
              </Grid>
              <Grid item xs={6} align='left'>
                <Typography fontWeight='bold'>
                  <SuffixedValue value={base.data?.stats?.transactions} />
                </Typography>
                <Typography variant='caption'>Transactions</Typography>
              </Grid>
              <Grid item xs={6} align='right'>
                <Typography fontWeight='bold'>
                  <SuffixedValue value={base.data?.stats?.blocks} />
                </Typography>
                <Typography variant='caption'>Blocks</Typography>
              </Grid>
            </>
          )}
        </Grid>
        <Box sx={{ flexGrow: 1 }} />
        <Typography lineHeight={1.5} variant='caption' fontSize='1em'>
          The
          <Typography variant='h4' fontFamily='Nunito Sans' fontWeight='bold'>
            Mochimo
            <Typography variant='inherit' display={{ xs: 'none', sm: 'inline' }}>&nbsp;</Typography>
            <Typography display={{ xs: 'inline', sm: 'none' }}><br /></Typography>
            Cryptocurrency Network
          </Typography>
          A complete reimplementation of Blockchain as Currency of the Post-Quantum era
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
        <HomepageFocus />
        <HomepageDivider>Blockchain Innovations</HomepageDivider>
        <Innovations />
        <HomepageDivider>The Team</HomepageDivider>
        <Grid
          container spacing={2} justifyContent='center' sx={{
            backgroundImage: 'url(/img/annie-spratt-QckxruozjRg-unsplash.jpg)',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            boxShadow: 'inset 0 0 4em 4em #1e1e1e'
          }}
        >
          <Grid item xs={12} sm={10} md={8} align='center'>
            <Typography variant='h4' paddingBottom={1}>
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
              <Typography variant='h4' paddingBottom={1}>
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
              <Typography variant='h4' paddingBottom={1}>
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
            backgroundImage: 'url(/img/markus-spiske-iar-afB0QQw-unsplash.jpg)',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            boxShadow: 'inset 0 0 4em 4em #1e1e1e'
          }}
        >
          <RaisedCard>
            <Typography fontWeight='bold' variant='h6' paddingBottom={1}>
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
                during the early days of the Blockchain. The largest
                remainder of which currently resides in&nbsp;
                <Link to='explorer/address/de77cd98749f9ed61662a09cdf59db622ae8150ea2b9ec35d15c4bd5f204822a'>
                  this address
                </Link>, is controlled by The Mochimo Foundation and LOCKED
                by contractual agreement until 25th June 2023.
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
                <Link href='123'>
                  article
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
            <Typography fontWeight='bold' variant='h6' paddingBottom={1}>
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
            <Typography fontWeight='bold' variant='h6' paddingBottom={1}>
              When was the first block solved?
            </Typography>
            As per Blockchain data pulled directly from the network nodes,
            the first block was solved on Monday, June 25, 2018 3:43:45 PM,
            or 2018-06-18T15:43:45+00:00 (ISO timestamp).
          </RaisedCard>
          <RaisedCard>
            <Typography fontWeight='bold' variant='h6' paddingBottom={1}>
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
            <Typography fontWeight='bold' variant='h6' paddingBottom={1}>
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
            <Typography fontWeight='bold' variant='h6' paddingBottom={1}>
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
            <Typography fontWeight='bold' variant='h6' paddingBottom={1}>
              How long does it take to set up a Mochimo mining node?
            </Typography>
            Several minutes on high performance hardware, but it is known
            to take around 20 minutes on tiny 1vCPU server nodes.
          </RaisedCard>
          <RaisedCard>
            <Typography fontWeight='bold' variant='h6' paddingBottom={1}>
              Where do I store my MCM?
            </Typography>
            Mochimo can currently be stored in the cross-platform "Mojo"
            wallet, with Mobile / Web Wallets, and hardware wallet
            integrations in the works...
          </RaisedCard>
          <RaisedCard>
            <Typography fontWeight='bold' variant='h6' paddingBottom={1}>
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
