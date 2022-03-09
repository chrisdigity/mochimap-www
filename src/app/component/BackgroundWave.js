
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/styles';
import { Box } from '@mui/material';

// initialize wave effect variables
const NEAR = 1;
const FAR = 2200;
const AMOUNTX = 60;
const AMOUNTZ = 20;
const SEPARATION = 60;
// initialize scene, camera, renderer and particle array
const SCENE = new THREE.Scene();
const CAMERA = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, NEAR, FAR);
const RENDERER = new THREE.WebGLRenderer({ antialias: true });

export default function BackgroundWave () {
  const theme = useTheme();
  const mount = useRef();

  const [init, setInit] = useState(false);

  useEffect(() => {
    if (!init) {
      setInit(true);
      // initialize wave effect variables
      let count = 0;
      let windowHalfX, windowHalfY, windowAspect, mouseX, mouseY;
      // initialize particle array
      const POINTS = new Array(AMOUNTX * AMOUNTZ);
      // initialize reusable geometry and mesh for points
      const POINTGEOMETRY = new THREE.SphereGeometry(10, 32, 32);
      const POINTMATERIAL = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x929292,
        shininess: 0
      });
      // initialize handlers
      const handleResize = () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        windowAspect = window.innerWidth / window.innerHeight;
        CAMERA.aspect = windowAspect;
        CAMERA.updateProjectionMatrix();
        RENDERER.setSize(window.innerWidth, window.innerHeight);
      };
      const handlePointerMove = (event) => {
        if (event.isPrimary === false) return;
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
      };
      const handleAnimation = () => {
        window.requestAnimationFrame(handleAnimation);
        // adjust camera based on latest mouse position
        CAMERA.position.x = mouseX * 0.05;
        CAMERA.position.y = mouseY * 0.1 + 200;
        CAMERA.position.z = 1200;
        CAMERA.lookAt(SCENE.position);
        CAMERA.position.y += 600;
        // adjust positions and scales of particles per trig
        for (let ix = 0, i = 0; ix < AMOUNTX; ix++) {
          for (let iz = 0; iz < AMOUNTZ; iz++, i++) {
            POINTS[i].position.y =
              (Math.sin(0.5 * (ix + count)) +
               Math.sin(0.5 * (iz + count))) * 50;
            POINTS[i].scale.setScalar(
              (Math.sin((ix + count) * 0.3) +
               Math.sin((iz + count) * 0.5) + 1) / 4
            );
          }
        }
        // render the scene from the view of camera
        RENDERER.render(SCENE, CAMERA);
        // increment the wave modifier
        count += 0.025;
      };
      // add background and fog color to scene (as appropriate for theme)
      const bgColor = theme?.palette?.background?.default || 'white';
      SCENE.background = new THREE.Color(bgColor);
      SCENE.fog = new THREE.Fog(SCENE.background.getHex(), NEAR, FAR);
      // add lighting to the scene
      const ambientLight = new THREE.AmbientLight(0x000000);
      const pointLight = new THREE.PointLight(0x929292, 1);
      pointLight.position.set(0, 1000, 0);
      SCENE.add(ambientLight);
      SCENE.add(pointLight);
      // add and distribute points across the x-z plane, as spheres
      const cx = (AMOUNTX * SEPARATION) / 2;
      const cz = (AMOUNTZ * SEPARATION) / 2;
      for (let ix = 0, i = 0; ix < AMOUNTX; ix++) {
        for (let iz = 0; iz < AMOUNTZ; iz++, i++) {
          POINTS[i] = new THREE.Mesh(POINTGEOMETRY, POINTMATERIAL);
          POINTS[i].position.set(ix * SEPARATION - cx, 0, iz * SEPARATION - cz);
          POINTS[i].scale.setScalar(1);
          SCENE.add(POINTS[i]);
        }
      }
      // set device pixel ratio and mount renderer to DOM
      RENDERER.setPixelRatio(window.devicePixelRatio);
      mount.current.appendChild(RENDERER.domElement);
      // add event listeners
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('resize', handleResize);
      // execute initial event handler derivative values
      handleResize(); // initially, must execute before handlePointerMove()...
      handlePointerMove({ clientX: windowHalfX, clientY: windowHalfY });
      // start animation
      window.requestAnimationFrame(handleAnimation);
    } else {
      // apply theme changes that may have ocurred
      const bgColor = theme?.palette?.background?.default || '#303030';
      SCENE.background = new THREE.Color(bgColor);
      SCENE.fog = new THREE.Fog(SCENE.background.getHex(), NEAR, FAR);
    }
  }, [init, setInit, theme]);

  return (
    <Box
      ref={mount}
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        '& > canvas': {
          'z-index': -1,
          position: 'relative'
        }
      }}
    />
  );
}
