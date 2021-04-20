
/* eslint-env browser */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useMochimapApi (initialPath) {
  const api = 'https://api.mochimap.com';
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(initialPath);
  useEffect(() => {
    if (!path) return;
    setError(false);
    setLoading(true);
    fetch(api + path)
      .then(response => response.json())
      .then(json => { if (json?.error) setError(true); setData(json); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [path]);
  return [{ data, loading, error }, setPath, setData];
}

export function useQuery (defaults = {}) {
  const params = new URLSearchParams(useLocation().search);
  for (const [key, value] of Object.entries(defaults)) {
    if (!params.has(key)) params.set(key, value);
  }
  return params;
}

// reference: https://usehooks.com/useWindowSize/
export function useWindowSize () {
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
