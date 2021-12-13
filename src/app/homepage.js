
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Orb (props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const target = props.target || new THREE.Vector3();

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => (mesh.current.position.lerp(target, 0.01)));

  return (
    <group>
      <mesh
        {...props}
        ref={mesh}
        scale={active ? 5 : 1}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'white'} />
      </mesh>
    </group>
  );
}

export default function Homepage () {
  const [stream, setStream] = useState();
  // nodes is a Map() of node objects, each containing a node's stats
  const [nodes, setNodes] = useState(new Map());
  // chains is a Map() of chains, each containing a Set() of node refs
  // const [chains, setChains] = useState(new Map());

  useEffect(() => {
    // expose EventSource API and create new stream
    const { EventSource } = window;
    const source = new EventSource('https://sg.mochimap.com/stream?network');
    // set stream event handlers
    source.onopen = () => console.log('MochiMap network stream opened...');
    source.onerror = (error) => console.error(error);
    source.onmessage = (message) => {
      if (typeof message !== 'object' || !message.data) return;

      const update = JSON.parse(message.data);
      if (!update || !update._id) return;

      setNodes((prev) => {
        let ping, baud, count;
        const old = prev.get(update._id) || {};
        const tmp = Object.assign({}, old);
        const node = Object.assign(update, tmp);
        console.log(node);
        // set or shift node chains
        /* UNUSED
        if (!old.weight || old.weight !== node.weight) {
          setChains((oldChains) => {
            const nodeChains = new Map(oldChains);
            const oldChain = nodeChains.get(old.weight);
            const nodeChain = nodeChains.get(node.weight) || new Set();
            if (oldChain) oldChain.delete(node._id);
            nodeChain.add(node._id);
            return nodeChains.set(node.weight, nodeChain);
          });
        } */
        // resume or create target position
        if (!node?.s || !node?.v) {
          node.s = new THREE.Spherical();
          node.v = new THREE.Vector3();
        }
        if (!node?.lat && !node?.lng && node?.host?.loc) {
          const [lat, lng] = node.host.loc.split(',');
          Object.assign(node, { lat, lng });
        }
        // calculate spherical target coords
        ping = baud = count = 0;
        for (const [prop, value] of Object.entries(node)) {
          if (String(prop).includes('connection')) {
            ping += value.ping;
            baud += value.baud;
            count++;
          }
        } // average stats across regions
        ping /= count || 1;
        baud /= count || 1;
        ping = ping || 9999; // worst possible latency
        baud = baud || 1; // worst possible baudrate
        // update spherical target coordinates
        node.s.phi = (90 - Number(node.lat)) * (Math.PI / 180);
        node.s.theta = (Number(node.lng) + 180) * (Math.PI / 180);
        node.s.radius = 1 + (Math.log2(ping) / Math.log10(baud));
        // set vector target coords from spherical
        node.v.setFromSpherical(node.s.makeSafe());
        // set new node data
        return new Map(prev).set(node._id, node);
      });
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
      <ambientLight />
      <pointLight position={[0, 0, 0]} />
      {[...nodes.values()].map((node, _i) => {
        return (<Orb key={_i} target={node.v} />);
      })}
    </Canvas>
  );
}
