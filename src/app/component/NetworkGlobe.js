
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { applyObjDiff, dupObj } from 'util';
import { useGetNetworkQuery } from 'api';

import { Box, LinearProgress } from '@mui/material';
import Globe from 'react-globe.gl';

const ARC_REL_LEN = 0.4; // relative to whole arc
const FLIGHT_TIME = 1000;
export default function NetworkGlobe () {
  const mql = window.matchMedia('(max-width: 600px)');
  const globe = useRef();
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(1);
  const [countries, setCountries] = useState({ features: [] });
  const [arcsData, setArcsData] = useState([]);
  const [nodes] = useState(new Map());
  const { data } = useGetNetworkQuery();

  const resolution = useCallback(() => mql.matches ? 2 : 3, [mql.matches]);
  const hexBinColor = useCallback(({ sumWeight }) => {
    // location is considered "congested" when location weight reaches 15%
    const congested = points.length * 0.2;
    const weight = (512 * (sumWeight / congested)) | 0;
    const r = ('0' + Math.min(255, weight).toString(16)).slice(-2);
    const g = ('0' + Math.min(255, (512 - weight)).toString(16)).slice(-2);
    return `#${r + g}00`;
  }, [points]);

  const updatePoints = useCallback((update) => {
    if (!update) return;
    let rebuildPoints = false;
    // condition input data
    update = Array.isArray(update) ? update : [update];
    for (const node of update) {
      // check for location update
      const prev = nodes.get(node.ip) || {};
      rebuildPoints = Boolean('loc' in node && node.loc !== prev.loc);
      // apply node update
      if (nodes.has(node.ip)) applyObjDiff(nodes.get(node.ip), dupObj(node));
      else nodes.set(node.ip, { ...dupObj(node) });
    }
    // check and rebuild points
    if (rebuildPoints) {
      setPoints(() => {
        const next = [];
        nodes.forEach((node) => {
          if ('loc' in node) {
            const [nlat, nlng] = node.loc.split(',').map((n) => +n);
            let pos = next.find(({ lat, lng }) => lat === nlat && lng === nlng);
            if (!pos) next.push(pos = { lat: nlat, lng: nlng, pop: 1 });
            else pos.pop++;
          }
        });
        return next;
      });
    }
  }, [nodes]);

  useEffect(() => {
    if (points.length) {
      /* eslint-disable-next-line no-undef */// fetch is defined globally
      fetch('/assets/data/countries-hex-data.json')
        .then((res) => res.json())
        .then(setCountries)
        .finally(() => setLoading(0));
    }
  }, [points]);

  // ////////////////////
  // Update Network State
  useEffect(() => updatePoints(data), [data, updatePoints]);
  useEffect(() => {
    // expose EventSource API and create new stream
    const { EventSource } = window;
    const source = new EventSource('https://new-api.mochimap.com/stream?network');
    // set stream event handlers
    // source.onopen = () => console.log('Network stream opened...');
    source.onerror = (error) => console.error(error);
    source.onmessage = (message) => {
      // ignore non-object messages
      if (typeof message !== 'object') return;
      if (typeof message.data !== 'string') return;
      try { // convert data, check ip, delete eventType and update
        const update = JSON.parse(message.data);
        const { ip, peers } = update;
        if (typeof ip !== 'string') return;
        delete update.eventType;
        updatePoints(update);
        // build communications data on available peer updates
        const fromloc = nodes.get(ip)?.loc;
        if (peers && fromloc) {
          const now = Date.now();
          const expires = now + (FLIGHT_TIME * 2);
          const [endLat, endLng] = fromloc.split(',').map((n) => +n);
          const arcs = peers.reduce((acc, peer) => {
            if (peer && nodes.has(peer) && 'loc' in nodes.get(peer)) {
              // determine start loc
              const { loc } = nodes.get(peer);
              const [startLat, startLng] = loc.split(',').map((n) => +n);
              acc.push({ startLat, startLng, endLat, endLng, expires });
            }
            return acc;
          }, []);
          if (arcs.length) {
            // add arcs to state
            setArcsData(curArcsData => [...curArcsData, ...arcs]);
          }
        }
      } catch (error) {
        // catch process breaking error
        console.error(error);
      }
    };
    const interval = setInterval(() => {
      const now = Date.now();
      setArcsData((arcs) => arcs.filter((a) => a.expires > now));
    }, 100);
    // return unmount/cleanup function
    return () => {
      source.close();
      clearInterval(interval);
    };
  }, [nodes, updatePoints]);

  // autorotate, resize listener
  useEffect(() => {
    if (globe.current) {
      function resize () {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
        const { current } = globe;
        if (current) {
          current.camera().aspect = window.innerWidth / window.innerHeight;
          current.camera().updateProjectionMatrix();
          current.controls().autoRotate = true;
          if (mql.matches) current.controls().autoRotateSpeed = 1;
          else current.controls().autoRotateSpeed = 0.25;
          current.renderer().setSize(window.innerWidth, window.innerHeight);
        }
      }
      resize();
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    }
  }, [mql.matches]);

  return (
    <>
      <Globe
        ref={globe}
        width={width}
        height={height}
        backgroundImageUrl='/assets/globe/night-sky.png'
        hexBinPointsData={points}
        hexBinPointWeight='pop'
        hexBinResolution={3}
        hexAltitude={useCallback((d) => d.sumWeight / points.length, [points])}
        hexSideColor={hexBinColor}
        hexTopColor={hexBinColor}
        hexPolygonsData={useMemo(() => countries.features, [countries])}
        hexPolygonAltitude={0.005}
        hexPolygonColor={useCallback(() => 'rgba(0,89,255,1)', [])}
        hexPolygonCurvatureResolution={useCallback(() => 5, [])}
        hexPolygonResolution={resolution}
        arcsData={arcsData}
        arcColor={useCallback(() => 'white', [])}
        arcDashLength={useCallback(() => ARC_REL_LEN, [])}
        arcDashGap={useCallback(() => 2, [])}
        arcDashInitialGap={useCallback(() => 1, [])}
        arcDashAnimateTime={useCallback(() => FLIGHT_TIME, [])}
        arcsTransitionDuration={useMemo(() => 0, [])}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          opacity: loading,
          transform: 'translate(-50%,-50%)'
        }}
      >Loading Globe Data<br /><LinearProgress />
      </Box>
    </>
  );
}
