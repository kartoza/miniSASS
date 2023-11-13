import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "pages/NotFound";
const Howto = React.lazy(() => import("./pages/Howto"));
const Home = React.lazy(() => import("./pages/MainPage"));
const Map = React.lazy(() => import("./pages/Map"));
const DebugLinks = React.lazy(() => import("./pages/Home"));
const DataInputForm = React.lazy(() => import("./pages/DataInputForm"));

const ProjectRoutes = () => {
  return (
    <React.Suspense fallback={<>Loading...</>}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/howto" element={<Howto />} />
          <Route path="/map" element={<Map />} />
          <Route path="/links" element={<DebugLinks />} />
          <Route path="/data-input-form" element={<DataInputForm />} />
        </Routes>
      </Router>
    </React.Suspense>
  );
};
export default ProjectRoutes;
