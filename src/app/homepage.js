
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing';

function Orb (props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const target = props.target || new THREE.Vector3();
  const size = props.size || 1;

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => (mesh.current.position.lerp(target, 0.01)));

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <sphereGeometry args={[0.1 / Math.log(size), 16, 16]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

const PI2 = Math.PI * 2;
const WORD32_MAX = 0xffffffff;
const SumPeers = (peerlist) => {
  return peerlist.reduce((acc, peer) => {
    return acc + peer.split('.').reduce((word32, byte, index) => {
      return word32 + Number(byte);
    }, 0);
  }, 0);
};

export default function Homepage () {
  const [stream, setStream] = useState();
  // nodes is a Map() of node objects, each containing a node's stats
  const [nodes, setNodes] = useState(new Map());
  // chains is a Map() of chains, each containing a Set() of node refs
  const [chains, setChains] = useState(new Map());

  useEffect(() => {
    // expose EventSource API and create new stream
    const { EventSource } = window;
    const source = new EventSource('https://sg.mochimap.com/stream?network');
    const peerVector = new THREE.Vector3();
    const peerSpherical = new THREE.Spherical();
    // set stream event handlers
    source.onopen = () => console.log('MochiMap network stream opened...');
    source.onerror = (error) => console.error(error);
    source.onmessage = (message) => {
      if (message?.data) {
        setNodes((prev) => {
          let node = JSON.parse(message.data);
          let old = prev.get(node._id) || {};
          // set or shift node chains
          if (!old.weight || old.weight !== node.weight) {
            setChains((oldChains) => {
              const nodeChains = new Map(oldChains);
              const oldChain = nodeChains.get(old.weight);
              const nodeChain = nodeChains.get(node.weight) || new Set();
              if (oldChain) oldChain.delete(node._id);
              nodeChain.add(node._id);
              return nodeChains.set(node.weight, nodeChain);
            });
          }
          if (!node.target) {
            node.target = {
              v: new THREE.Vector3(0, 0, 0),
              s: new THREE.Spherical(0, 0, 0)
            };
          }

          // calculate spherical target coords
          let baud, ping, count = 0;
          ping = baud = count = 0;
          for (const [prop, value] of Object.entries(node)) {
            if (String(prop).includes('connection')) {
              ping += value.ping;
              baud += value.baud;
              count++;
            }
          } // average stats across regions
          if (count && ping && baud) {
            ping /= count;
            baud /= count;
            // update spherical
            node.target.s.radius = Math.log10(1 + (Math.log10(baud) / Math.log10(ping)));
            node.target.s.phi = 1;
          }
          node.target.s.theta =
            node._id.split('-').reduce((a, c) => a + Number(c), 0) % PI2;
          // set target coords from spherical
          if (count) node.target.v.setFromSpherical(node.target.s.makeSafe());
          // set new node data
          return new Map(prev).set(node._id, node);
        });
      }
    };
    // update stream state with source
    setStream(source);
    // return unmount/cleanup function
    return () => {
      if (stream) {
        setStream(stream.close());
        console.log('MochiMap network stream closed...');
      } else setStream(undefined);
    };
  }, []);

  return (
    <Canvas style={{ position: 'fixed' }}>
      <OrbitControls />
      <TransformControls />
      <ambientLight />
      <pointLight position={[0, 0, 0]} />
      {[...nodes.values()].map((node, _i) => {
        return (<Orb key={_i} size={nodes.size} target={node.target.v} />);
      })}
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
}
