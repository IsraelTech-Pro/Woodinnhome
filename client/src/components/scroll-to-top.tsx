import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Component that automatically scrolls to top when the route changes
 */
export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top when location changes
    window.scrollTo(0, 0);
  }, [location]);

  // This component doesn't render anything
  return null;
}