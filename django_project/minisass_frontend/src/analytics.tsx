import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_CODE); // replace with your GA4 ID
};

export const trackPageView = (path: string) => {
  console.log('send page tracking: ' + path)
  ReactGA.event("page_view", {
    page_location: window.location.href,
    page_path: path,
    page_title: document.title,
  });
};
