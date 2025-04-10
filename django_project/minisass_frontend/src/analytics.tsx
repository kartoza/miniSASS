import ReactGA from "react-ga4";

export const initGA = () => {
  const localConsent = localStorage.getItem("hasPrivacyConsent");

  if (localConsent === "true" || localConsent === "false") {
    // User already gave consent before, so send it to backend silently
    const agree = localConsent === "true";
    if (agree) {
      ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_CODE);
    }
  }
};

export const trackPageView = (path: string) => {
  ReactGA.event("page_view", {
    page_location: window.location.href,
    page_path: path,
    page_title: document.title,
  });
};
