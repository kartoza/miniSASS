import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_CODE); // replace with your GA4 ID
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
