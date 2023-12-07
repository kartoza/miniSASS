import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "pages/NotFound";
const Howto = React.lazy(() => import("./pages/Howto"));
const Home = React.lazy(() => import("./pages/MainPage"));
const Map = React.lazy(() => import("./pages/Map"));
const DebugLinks = React.lazy(() => import("./pages/Home"));
const PasswordResetPage = React.lazy(() => import("./pages/PasswordReset"));
import LinearProgress from '@mui/material/LinearProgress';

const ProjectRoutes = () => {
  return (
    <React.Suspense fallback={<><LinearProgress color="success" /></>}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/howto" element={<Howto />} />
          <Route path="/map" element={<Map />} />
          <Route path="/links" element={<DebugLinks />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
        </Routes>
      </Router>
    </React.Suspense>
  );
};
export default ProjectRoutes;
