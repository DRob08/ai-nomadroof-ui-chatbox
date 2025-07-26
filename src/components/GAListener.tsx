import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageview } from '../utils/ga';

const GAListener = () => {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);  // Send pageview on route changes
  }, [location]);

  return null;
};

export default GAListener;
