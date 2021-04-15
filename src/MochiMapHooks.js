
/* global fetch */// assumes compatible browser
import { useState, useEffect } from 'react';

export function useMochimapApi (initialPath) {
  const base = 'https://api.mochimap.com';
  const [data, setData] = useState({});
  const [path, setPath] = useState(initialPath);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setError(false);
    setLoading(true);
    fetch(base + path)
      .then(response => response.json())
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [path]);
  return [{ data, loading, error }, setPath];
}

export function useWindowSize () { // https://usehooks.com/useWindowSize/
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize () {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}
