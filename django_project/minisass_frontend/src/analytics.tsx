import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_CODE);
};

export const trackPageView = (path: string) => {
  ReactGA.event("page_view", {
    page_location: window.location.href,
    page_path: path,
    page_title: document.title,
  });
};
