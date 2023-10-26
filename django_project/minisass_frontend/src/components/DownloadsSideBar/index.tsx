import React, { useState } from 'react';
import { Link } from 'react-scroll';

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(Array(6).fill(false)); // Initialize an array for each link

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: 0,
    transform: 'translateY(-50%)',
    width: '250px',
    backgroundColor: '#fff',
    padding: '20px',
    zIndex: 1000,
    border: '1px solid #ccc',
  };

  const navLinkStyle: React.CSSProperties = {
    textDecoration: 'none',
    display: 'block',
    margin: '10px 0',
    color: '#000',
  };

  const hoverStyle = {
    color: '#007bff', /* Change the color on hover */
  };

  const handleHover = (index: number) => {
    const updatedHovered = [...isHovered];
    updatedHovered[index] = true;
    setIsHovered(updatedHovered);
  };

  const handleLeave = (index: number) => {
    const updatedHovered = [...isHovered];
    updatedHovered[index] = false;
    setIsHovered(updatedHovered);
  };

  return (
    <div style={sidebarStyle} className="sidebar">
      <ul>
        <li>
        <Link
          to="fieldSheetsSection"
          smooth={true}
          duration={500}
          style={{ ...navLinkStyle, ...(isHovered[0] ? hoverStyle : {}) }}
          onMouseEnter={() => handleHover(0)}
          onMouseLeave={() => handleLeave(0)}
        >
            MiniSass Field Sheets
          </Link>
        </li>
        <li>
          <Link
            to="newslettersSection"
            smooth={true}
            duration={500}
            style={{ ...navLinkStyle, ...(isHovered[1] ? hoverStyle : {}) }}
            onMouseEnter={() => handleHover(1)}
            onMouseLeave={() => handleLeave(1)}
          >
            MiniSass Newsletters
          </Link>
        </li>
        <li>
          <Link
            to="educationalResourcesSection"
            smooth={true}
            duration={500}
            style={{ ...navLinkStyle, ...(isHovered[2] ? hoverStyle : {}) }}
            onMouseEnter={() => handleHover(2)}
            onMouseLeave={() => handleLeave(2)}
          >
            Educational Resources
          </Link>
        </li>
        <li>
          <Link
            to="projectreportsSection"
            smooth={true}
            duration={500}
            style={{ ...navLinkStyle, ...(isHovered[3] ? hoverStyle : {}) }}
            onMouseEnter={() => handleHover(3)}
            onMouseLeave={() => handleLeave(3)}
          >
            Project reports which used miniSASS
          </Link>
        </li>
        <li>
          <Link
            to="literaturereferencesSection"
            smooth={true}
            duration={500}
            style={{ ...navLinkStyle, ...(isHovered[4] ? hoverStyle : {}) }}
            onMouseEnter={() => handleHover(4)}
            onMouseLeave={() => handleLeave(4)}
          >
            Literature references relating to miniSASS
          </Link>
        </li>
        <li>
          <Link
            to="mediaInterviewsSection"
            smooth={true}
            duration={500}
            style={{ ...navLinkStyle, ...(isHovered[5] ? hoverStyle : {}) }}
            onMouseEnter={() => handleHover(5)}
            onMouseLeave={() => handleLeave(5)}
          >
            Media interviews relating to miniSASS
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
