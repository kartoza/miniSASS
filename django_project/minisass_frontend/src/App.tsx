import React, { useEffect } from "react";
import Routes from "./Routes";

function App() {

    // STEP 4: Session Duration
  useEffect(() => {
    const startTime = Date.now();

    const handleBeforeUnload = () => {
      const duration = (Date.now() - startTime) / 1000;
      ReactGA.event("session_duration", {
        session_length_seconds: duration,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return <Routes />;
}

export default App;
