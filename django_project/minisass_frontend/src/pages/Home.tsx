import React from "react";
import { Link } from "react-router-dom";
const DebugLinks = () => {
  return (
    <div className="dhiwise-navigation">
      <h1>Links Page for debugging</h1>
      <ul>
        <li>
          <Link to="/map">Map</Link>
        </li>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/howto">Howto</Link>
        </li>
      </ul>
    </div>
  );
};
export default DebugLinks;
