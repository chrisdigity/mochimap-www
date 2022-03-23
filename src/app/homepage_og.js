
import * as THREE from 'three';
import { Float32BufferAttribute } from 'three';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette, SSAO, GodRays } from '@react-three/postprocessing';
import { BlendFunction, Resizer, KernelSize } from 'postprocessing';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stats, TransformControls } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { applyObjDiff, dupObj } from 'util';
import { useGetNetworkQuery } from 'api';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Spherical } from 'three';

const CURVE_SEGMENTS = 16;
const LPOS_C = (1 + CURVE_SEGMENTS) * 2 * 32 * 3; // segments * to/from * peers * 3D
const PPOS_C = 3;
const distS = new THREE.Spherical();
const dist = new THREE.Vector3();
const force = new THREE.Vector3();
const curvePoint = new THREE.Vector3();
const curve = new THREE.CatmullRomCurve3(
  [curvePoint, curvePoint, curvePoint], false, 'catmullrom', 1.0);

const viewCenter = new THREE.Vector3();

const center = new THREE.Vector3();

const leafCurve = new THREE.CatmullRomCurve3([], false, 'catmullrom', 1.0);
const leafv0 = new THREE.Vector3();
const leafv1 = new THREE.Vector3();
const leafv2 = new THREE.Vector3();
const leafv3 = new THREE.Vector3();
const leafv4 = new THREE.Vector3();

function Nodes ({ data, options }) {
  // declare references for useFrame access
  const lref = useRef();
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

  // ////////////////////////
  // THREE updates (useFrame)
  useFrame(() => {
    // check network size
    let { size } = nodes;
    if (size) {
      // ensure adequate space is allocated for attributes
      if (size >= max) {
        let old;
        // update max to next boundary (+32 increments)
        setMax(size = ((size >> 5) << 5) + 32);
        // expand points geometry vertices
        old = pref.current.geometry.attributes.position?.array;
        pref.current.geometry.setAttribute('position',
          new Float32BufferAttribute(size * PPOS_C, 3));
        if (old) pref.current.geometry.attributes.position.set(old);
        // expand line geometry vertices
        old = lref.current.geometry.attributes.position?.array;
        lref.current.geometry.setAttribute('position',
          new Float32BufferAttribute(size * LPOS_C, 3));
        if (old) lref.current.geometry.attributes.position.set(old);
        // expand (AND FILL) line geometry colors
        old = lref.current.geometry.attributes.position?.array;
        lref.current.geometry.setAttribute('color',
          new Float32BufferAttribute(size * LPOS_C, 3));
      }
      const colors = lref.current.geometry.attributes.color.array;
      const lpositions = lref.current.geometry.attributes.position.array;
      const ppositions = pref.current.geometry.attributes.position.array;
      let lindex = 0;
      let pindex = 0;
      // update points positions
      nodes.forEach((node) => {
        let dist2;
        const { peers, v } = node;
        if (peers && peers.length) {
          force.set(0, 0, 0); // clear previous force
          colors[lindex] = 1;
          lpositions[lindex++] = 0;
          colors[lindex] = 1;
          lpositions[lindex++] = 0;
          colors[lindex] = 1;
          lpositions[lindex++] = 0;
          for (let k, j, i = 0; i < peers.length; i++) {
            if (nodes.has(peers[i])) {
              const to = nodes.get(peers[i]);
              if (i < 32) {
                // add all target vectors to force
                dist.subVectors(v, to.v);
                dist2 = v.distanceTo(to.v);
                if (dist2 > 1) dist.divideScalar(dist2);
                force.add(dist);
              }
              if (i < 32) {
                // set curve points
                curve.points[0] = v;
                curve.points[2] = to.v;
                const points = curve.getPoints(CURVE_SEGMENTS);
                // update point data (forward)
                const half = points.length / 2;
                for (j = 0, k = points.length; j < points.length; j++, k--) {
                  colors[lindex] = 0;
                  lpositions[lindex++] = points[j].x;
                  colors[lindex] = Math.min(1, j < half ? ((j / 2) / k) : (k / 2) / j);
                  lpositions[lindex++] = points[j].y;
                  colors[lindex] = 1;
                  lpositions[lindex++] = points[j].z;
                }
                // update point data (reverse, skip first and last)
                for (j--, k++; j > 0; j--, k++) {
                  colors[lindex] = 0;
                  lpositions[lindex++] = points[j].x;
                  colors[lindex] = Math.min(1, j < half ? ((j / 2) / k) : (k / 2) / j);
                  lpositions[lindex++] = points[j].y;
                  colors[lindex] = 1;
                  lpositions[lindex++] = points[j].z;
                }
              }
            }
          }
          // apply flower shape force
          switch (options.get('type')) {
            case 'flower':
              // apply center force
              dist.set(0, 0, 0);
              force.lerp(dist, 0.95);
              // apply flower force
              dist.set(0, 0.5, 0);
              force.add(dist);
              distS.setFromVector3(force);
              distS.phi -= Math.pow(distS.phi / Math.PI, 2);
              force.add(dist.setFromSpherical(distS.makeSafe()));
              break;
            default:
              // apply center force
              dist.set(0, 0, 0);
              force.lerp(dist, 0.9);
          }
          // apply (clamped distance-dampened) force to vector...
          v.lerp(force, Math.min(0.25, Math.max(0, v.distanceToSquared(force))));
          // apply new position to positions array
          ppositions[pindex++] = v.x;
          ppositions[pindex++] = v.y;
          ppositions[pindex++] = v.z;
        }
      });
      // set draw range of points to size of nodes
      lref.current.geometry.setDrawRange(0, lindex / 3);
      pref.current.geometry.setDrawRange(0, pindex / 3);
      // set needsUpdate flag for colors/positions
      lref.current.geometry.attributes.color.needsUpdate = true;
      lref.current.geometry.attributes.position.needsUpdate = true;
      pref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <points ref={pref}>
        <bufferGeometry />
        <pointsMaterial size={0.05} color='white' />
      </points>
      <line ref={lref}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors transparent opacity={0.125} color='white' />
      </line>
    </group>
  );
}

export default function Homepage () {
  const sun = useRef();
  const controls = useRef();
  const [options] = useState(new Map([{ type: 'traditional' }]));
  const [displayType, setDisplayType] = useState('traditional');
  const handleTypeChange = (_event, newType) => {
    switch (newType) {
      case 'flower': controls.current.target.set(0, 1, 0); break;
      default: controls.current.target.set(0, 0, 0);
    }
    options.set('type', newType);
    setDisplayType(newType);
  };
  // declare initial network state data
  const { data } = useGetNetworkQuery();
  return (
    <>
      <Box sx={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
        <Canvas>
          <Stats />
          <OrbitControls
            ref={controls}
            minDistance={3}
            maxDistance={50}
            enablePan={false}
            target={viewCenter}
          />
          <ambientLight />
          <Nodes data={data} options={options} />
          <mesh ref={sun} scale={0.005 * (data?.length || 0)}>
            <sphereGeometry />
            <meshBasicMaterial transparent color='lime' />
          </mesh>
          <EffectComposer>
            <Bloom
              intensity={10} height={1600}
              luminanceThreshold={0.25} luminanceSmoothing={1}
            />
            {sun.current && (<GodRays sun={sun.current} exposure={2} blur />)}
          </EffectComposer>
        </Canvas>
      </Box>
      <Tabs centered value={displayType} onChange={handleTypeChange}>
        <Tab label='Traditional' value='traditional' />
        <Tab label='Flower' value='flower' />
      </Tabs>
    </>
  );
}