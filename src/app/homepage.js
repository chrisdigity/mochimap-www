
import { BufferGeometry, Spherical, Vector3 } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { applyObjDiff, dupObj } from 'util';
import { useGetNetworkQuery } from 'api';
import { AmbientLight } from 'three';

const CENTER = new Vector3();
const PI180 = Math.PI / 180;
const sphericalPosition = (lat, lng) =>
  new Spherical(1, (90 - lat) * PI180, (lng + 180) * PI180);

function Connection ({ map, source, target, ...props }) {
  const lineref = useRef();
  const geometry = new BufferGeometry();
  // adjust line vector every frame
  useFrame(() => {
    const srcnode = map.get(source);
    const dstnode = map.get(target);
    if (srcnode?.v && dstnode?.v) {
      lineref.current.geometry.setFromPoints([srcnode.v, dstnode.v]);
    }
  });

  return (
    <line ref={lineref} geometry={geometry} {...props}>
      <meshBasicMaterial />
    </line>
  );
}

function Orb ({ map, ip, updateNode, ...props }) {
  const dir = new Vector3();
  const force = new Vector3();
  const center = new Vector3();
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    const { peers, v } = map.get(ip);
    if (peers && peers.length) {
      force.setScalar(0);
      for (let i = 0; i < peers.length; i++) {
        const peer = peers[i];
        if (!map.has(peer) || i > 31) continue;
        const target = map.get(peer);
        // add all target vectors to force
        dir.subVectors(v, target.v).divideScalar(
          Math.max(1, v.distanceToSquared(target.v))
        );
        force.add(dir);
      }
      // apply center force (only if not in center)
      if (!CENTER.equals(force)) {
        center.subVectors(CENTER, force);
        force.addScaledVector(center, 0.6);
      }
    }
    mesh.current.position.lerp(force, 0.001);
    v.copy(mesh.current.position);
  });

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
        <meshStandardMaterial color={hovered ? 'hotpink' : '#0059ff'} />
      </mesh>
    </group>
  );
}

export default function Homepage () {
  const network = useGetNetworkQuery();
  const [stream, setStream] = useState();
  // nodes is a Map() of node objects, each containing a node's stats
  const [nodes, setNodes] = useState(new Map());
  const [lines, setLines] = useState(new Map());
  // chains is a Map() of chains, each containing a Set() of node refs
  // const [chains, setChains] = useState(new Map());
  const updateNode = (update) => {
    setNodes((state) => {
      const { ip } = update;
      // obtain duplicate node from state and apply update
      const node = state.has(ip) ? Object.assign({}, state.get(ip)) : {};
      applyObjDiff(node, dupObj(update));
      // ensure node has spherical position
      if ((!('lat' in node) || !('lng' in node)) && 'loc' in node) {
        const [lat, lng] = node.loc.split(',');
        node.lat = Number(lat);
        node.lng = Number(lng);
        node.earth = sphericalPosition(node.lat, node.lng).makeSafe();
      } else node.earth = new Spherical(0, 0, 0);
      // ensure node has vector position
      if (!('v' in node)) node.v = new Vector3().setFromSpherical(node.earth);
      // apply changes to state
      const map = new Map(state).set(ip, node);
      /*
      // recalculate node positions and update associate lines
      const dir = new Vector3();
      const force = new Vector3();
      const gravity = new Vector3();
      map.forEach((obj) => {
        if (obj.peers && obj.peers.length) {
          force.setScalar(0);
          for (let i = 0; i < obj.peers.length; i++) {
            const peer = obj.peers[i];
            if (!map.has(peer)) continue;
            const target = map.get(peer);
            // add all target vectors to force
            dir.subVectors(obj.v, target.v).normalize();
            force.add(dir);
          }
          // apply gravity (only if not in center)
          if (!CENTER.equals(force)) {
            gravity.subVectors(CENTER, force);
            force.addScaledVector(gravity, 0.9);
          }
          // apply force to obj
          obj.v.lerp(force, 1);
        }
      }); */
      return map;
    });
  };

  useEffect(() => {
    if (network.data?.length) {
      for (let i = 0; i < network.data.length; i++) {
        updateNode(network.data[i]);
      }
    }
  }, [network.data]);

  useEffect(() => {
    // expose EventSource API and create new stream
    const { EventSource } = window;
    const source = new EventSource('https://new-api.mochimap.com/stream?network');
    // set stream event handlers
    source.onopen = () => console.log('MochiMap network stream opened...');
    source.onerror = (error) => console.error(error);
    source.onmessage = (message) => {
      if (typeof message !== 'object' || !message.data) return;

      const update = JSON.parse(message.data);
      if (!update || !update.ip) return;

      updateNode(update);
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
      <pointLight position={[0, 10, 0]} decay={2} distance={20} intensity={10} />
      {[...nodes.values()].map((node, _i) => {
        return (<Orb key={_i} map={nodes} ip={node.ip} updateNode={updateNode} />);
      })}
    </Canvas>
  );
}
