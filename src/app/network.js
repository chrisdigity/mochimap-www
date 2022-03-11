
import { useEffect, useRef, useState } from 'react';
import { dupObj } from 'util';
import { useGetNetworkQuery } from 'api';

import * as THREE from 'three';
import Globe from 'react-globe.gl';
import { Box } from '@mui/material';

// custom globe material
const globeMaterial = new THREE.MeshPhongMaterial();
globeMaterial.bumpScale = 10;
new THREE.TextureLoader().load(
  '//unpkg.com/three-globe/example/img/earth-water.png',
  texture => {
    globeMaterial.specularMap = texture;
    globeMaterial.specular = new THREE.Color('blue');
    globeMaterial.shininess = 15;
  }
);

export default function Homepage () {
  const globeEl = useRef();
  const network = useGetNetworkQuery();
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [data, setData] = useState([]);
  const [max, setMax] = useState(0);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      globeEl.current.camera().aspect = window.innerWidth / window.innerHeight;
      globeEl.current.camera().updateProjectionMatrix();
      globeEl.current.renderer().setSize(window.innerWidth, window.innerHeight);
    });
  }, []);

  const determineColor = ({ sumWeight }) => {
    return `#ff${('0' + ((255 * max / sumWeight) | 0).toString(16)).slice(1, 3)}00`;
  };

  const dataUpdate = (update) => {
    update = dupObj(update);
    setData((points) => {
      // ensure node has spherical position
      if ('loc' in update) {
        points = [...points];
        const [nlat, nlng] = update.loc.split(',').map((n) => +n);
        let pos = points.find(({ lat, lng }) => lat === nlat && lng === nlng);
        if (!pos) points.push(pos = { lat: nlat, lng: nlng, pop: 0 });
        if (++pos.pop > max) setMax(pos.pop);
      }
      return points;
    });
  };

  useEffect(() => {
    if (network.data?.length) {
      for (let i = 0; i < network.data.length; i++) {
        dataUpdate(network.data[i]);
      }
    }
  }, [network.data]);
  /*
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
      dataUpdate(update);
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
  }, []); */

  return (
    <Box sx={{ position: 'absolute' }}>
      <Globe
        ref={globeEl}
        width={width}
        height={height}
        globeMaterial={globeMaterial}
        globeImageUrl='/img/earth-outline.jpg'
        hexBinPointsData={data}
        hexBinPointWeight='pop'
        hexAltitude={d => 2 * d.sumWeight / data.length}
        hexBinResolution={4}
        hexSideColor={determineColor}
        hexTopColor={determineColor}
      />
    </Box>
  );
}
