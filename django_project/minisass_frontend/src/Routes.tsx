import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NotFound from "pages/NotFound";
const Howto = React.lazy(() => import("./pages/Howto"));
const Home = React.lazy(() => import("./pages/MainPage"));
const Map = React.lazy(() => import("./pages/Map"));
const DebugLinks = React.lazy(() => import("./pages/Home"));
const PasswordResetPage = React.lazy(() => import("./pages/PasswordReset"));
const RecentActivity = React.lazy(() => import("./pages/RecentActivity"));
const MobileApp = React.lazy(() => import("./pages/MobileApp"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
import LinearProgress from "@mui/material/LinearProgress";

import { initGA, trackPageView } from "./analytics";

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
};


const ProjectRoutes = () => {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <React.Suspense fallback={<><LinearProgress color="success" /></>}>
      <Router>
        <RouteTracker />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/howto" element={<Howto />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/map" element={<Map />} />
          <Route path="/links" element={<DebugLinks />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/recent-activity" element={<RecentActivity />} />
          <Route path="/mobile-app" element={<MobileApp />} />
        </Routes>
      </Router>
    </React.Suspense>
  );
};

export default ProjectRoutes;
