import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_CODE); // replace with your GA4 ID
};

export const trackPageView = (path: string) => {
  console.log('send page tracking')
  ReactGA.send({ hitType: "pageview", page: path });
};

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    console.log('send page tracking')
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);
}