import React from "react";
import "./styles/color.css";
import "./styles/font.css";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/index.css";
import "./styles/tailwind.css";
import { AuthProvider } from './AuthContext';
import { PrivacyConsentProvider } from './PrivacyConsentContext';

ReactDOM.render(
  <AuthProvider>
    <PrivacyConsentProvider>
      <App />
    </PrivacyConsentProvider>
  </AuthProvider>,
  document.getElementById("root"),
);
