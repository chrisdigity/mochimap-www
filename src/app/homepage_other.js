
import * as THREE from 'three';
import { Float32BufferAttribute } from 'three';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette, SSAO, GodRays } from '@react-three/postprocessing';
import { BlendFunction, Resizer, KernelSize } from 'postprocessing';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Stats, TransformControls, useHelper } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { applyObjDiff, dupObj } from 'util';
import { useGetNetworkQuery } from 'api';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Spherical } from 'three';
import { ConstructionOutlined } from '@mui/icons-material';
import { BufferGeometry } from 'three';

const CURVE_SEGMENTS = 16;
const LPOS_C = (1 + CURVE_SEGMENTS) * 2 * 32 * 3; // segments * to/from * peers * 3D
const PPOS_C = 3;
const distS = new THREE.Spherical();
const dist = new THREE.Vector3();
const force = new THREE.Vector3();
const curvePoint = new THREE.Vector3();
const curve = new THREE.CatmullRomCurve3(
  [curvePoint, curvePoint, curvePoint], false, 'catmullrom', 1.0);

const center = new THREE.Vector3();
const viewCenter = new THREE.Vector3(0, 1, 0);

const sphericalPoint = new THREE.Spherical();
const leafPoint1 = new THREE.Vector3();
const leafPoint2 = new THREE.Vector3();
const leafPoint3 = new THREE.Vector3();
const leafCurve = new THREE.CatmullRomCurve3(
  [center, leafPoint1, null, leafPoint2, center], false, 'catmullrom', 1.0);

const cb = new THREE.Vector3();
const ab = new THREE.Vector3();




const PETAL_HEIGHT = 1;
const PETAL_SEGMENTS = 8;
const STEM_SEGMENTS = 64;
const vertex = new THREE.Vector3();
const petalMaterial = new THREE.MeshLambertMaterial({ color: 0x0059ff, side: THREE.DoubleSide, wireframe: true });

function Petal ({ follow }) {
  const lref = useRef();
  const mref = useRef();
  // build skeleton
  const skeleton = new THREE.Skeleton(
    Array(STEM_SEGMENTS).fill(null).map(() => new THREE.Bone()));

  useEffect(() => {
    const halfHeight = PETAL_HEIGHT / 2;
    const segmentHeight = PETAL_HEIGHT / STEM_SEGMENTS;
    // build structure skin indexes and weights
    const skinIndices = [];
    const skinWeights = [];
    const position = mref.current.geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);
      // compute skinIndex and skinWeight based on some configuration data
      const y = (vertex.y + halfHeight);
      const skinIndex = Math.floor(y / segmentHeight);
      const skinWeight = (y % segmentHeight) / segmentHeight;
      skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
      skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
    }
    mref.current.geometry.setAttribute('skinIndex',
      new THREE.Uint16BufferAttribute(skinIndices, 4));
    mref.current.geometry.setAttribute('skinWeight',
      new THREE.Float32BufferAttribute(skinWeights, 4));
    // add root bone to mesh
    mref.current.add(...skeleton.bones);
    // bind skeleton to mesh
    mref.current.bind(skeleton);
    // set 0
    mref.current.position.set(0, 0.5, 0);
  }, []);

  useFrame(() => {
    // ////////////////
    // set curve points
    sphericalPoint.setFromVector3(follow);
    sphericalPoint.radius *= 0.75;
    sphericalPoint.phi += 0.25;
    sphericalPoint.makeSafe();
    leafPoint1.setFromSpherical(sphericalPoint);
    curve.points[0] = center;
    curve.points[1] = leafPoint1;
    curve.points[2] = follow;
    const points = curve.getPoints(STEM_SEGMENTS);
    lref.current.geometry = new THREE.BufferGeometry().setFromPoints(points);
    // generate curve as stem
    if (mref.current.skeleton) {
      const { bones } = mref.current.skeleton;
      if (bones.length) {
        for (let i = 0; i < bones.length; i++) {
          bones[i].rotation.y = sphericalPoint.theta;
          bones[i].position.copy(points[i].divideScalar(2));
          bones[i].useQuaternion = false;
        }
      }
    }
  });

  return (
    <>
      <line ref={lref} material={new THREE.LineBasicMaterial({ color: 0xffffff })} />
      <skinnedMesh ref={mref} material={petalMaterial}>
        <cylinderGeometry
          args={[1, 1, PETAL_HEIGHT, PETAL_SEGMENTS, STEM_SEGMENTS, false, 0, Math.PI * 2]}
        />
      </skinnedMesh>
    </>
  );
}

function Nodes ({ data, options }) {
  // declare references for useFrame access
  const lref = useRef();
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
  const petalPoint = new THREE.Vector3();

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
      }
      const ppositions = pref.current.geometry.attributes.position.array;
      let pindex = 0;
      // update points positions
      nodes.forEach((node) => {
        let dist2;
        const { peers, v } = node;
        if (pindex === 0) {
          petalPoint.x = v.x;
          petalPoint.y = v.y;
          petalPoint.z = v.z;
        }
        if (peers && peers.length) {
          force.set(0, 0, 0); // clear previous force
          for (let i = 0; i < peers.length; i++) {
            if (nodes.has(peers[i])) {
              const to = nodes.get(peers[i]);
              if (i < 32) {
                // add all target vectors to force
                dist.subVectors(v, to.v);
                dist2 = v.distanceTo(to.v);
                if (dist2 > 1) dist.divideScalar(dist2);
                force.add(dist);
              }
            }
          }
          // apply flower shape force
          dist.set(0, 0, 0);
          force.lerp(dist, 0.95);
          // apply flower force
          dist.set(0, 0.5, 0);
          force.add(dist);
          distS.setFromVector3(force);
          distS.phi -= Math.pow(distS.phi / Math.PI, 2);
          force.add(dist.setFromSpherical(distS.makeSafe()));
          // apply (clamped distance-dampened) force to vector...
          v.lerp(force, Math.min(0.25, Math.max(0, v.distanceToSquared(force))));
          // apply new position to positions array
          ppositions[pindex++] = v.x;
          ppositions[pindex++] = v.y;
          ppositions[pindex++] = v.z;
          // ////////////////
          // set curve points
          sphericalPoint.setFromVector3(v);
          sphericalPoint.radius *= 0.7;
          sphericalPoint.theta -= 0.2;
          sphericalPoint.phi += 0.1;
          sphericalPoint.makeSafe();
          leafPoint1.setFromSpherical(sphericalPoint);
          sphericalPoint.setFromVector3(v);
          sphericalPoint.radius *= 0.7;
          sphericalPoint.theta += 0.2;
          sphericalPoint.phi += 0.1;
          sphericalPoint.makeSafe();
          leafPoint2.setFromSpherical(sphericalPoint);
          leafCurve.points[2] = v;
          const points = leafCurve.getPoints(CURVE_SEGMENTS);

        }
      });
      // set draw range of points to size of nodes
      pref.current.geometry.setDrawRange(0, 1);
      // set needsUpdate flag for colors/positions
      pref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={pref}>
        <bufferGeometry />
        <pointsMaterial size={0.05} color='white' />
      </points>
      <Petal follow={petalPoint} />
    </>
  );
}

export default function Homepage () {
  const sun = useRef();
  const controls = useRef();
  // declare initial network state data
  const { data } = useGetNetworkQuery();
  return (
    <>
      <Box sx={{ position: 'absolute', top:0, right: 0, bottom: 0, left: 0 }}>
        <Canvas shadows shadowMap>
          <Stats />
          <OrbitControls
            ref={controls}
            minDistance={3}
            maxDistance={50}
            enablePan={false}
            target={viewCenter}
          />
          <ambientLight />
          <pointLight castShadow position={[0, -0.25, 0]} />
          <pointLight castShadow position={[0, 0, 0]} />
          <Nodes data={data} />
          <mesh ref={sun} scale={0.5}>
            <sphereGeometry />
            <meshBasicMaterial transparent color='white' />
          </mesh>
          <Stars
            radius={500} // Radius of the inner sphere (default=100)
            depth={100} // Depth of area where stars should fit (default=50)
            count={500} // Amount of stars (default=5000)
            factor={4} // Size factor (default=4)
            saturation={0} // Saturation 0-1 (default=0)
            fade // Faded dots (default=false)
          />
          <EffectComposer>
            {sun.current && (
              <GodRays
                sun={sun.current}
                blendFunction={BlendFunction.Screen} // The blend function of this effect.
                samples={60} // The number of samples per pixel.
                density={0.96} // The density of the light rays.
                decay={0.9} // An illumination decay factor.
                weight={0.4} // A light ray weight factor.
                exposure={0.6} // A constant attenuation coefficient.
                clampMax={1} // An upper bound for the saturation of the overall effect.
                width={Resizer.AUTO_SIZE} // Render width.
                height={Resizer.AUTO_SIZE} // Render height.
                kernelSize={KernelSize.SMALL} // The blur kernel size. Has no effect if blur is disabled.
                blur={true} // Whether the god rays should be blurred to reduce artifacts.
              />
            )}
          </EffectComposer>
        </Canvas>
      </Box>
    </>
  );
}
