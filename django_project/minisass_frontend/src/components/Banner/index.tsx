import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const Banner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if(visible)
      const timer = setTimeout(() => {
        setVisible(false);
      }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const bannerStyle: React.CSSProperties = {
    backgroundColor: '#003f81',
    color: 'white',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    zIndex: 50,
    height: '10%',
    boxSizing: 'border-box'
  };

  const textStyle: React.CSSProperties = {
    flex: 1,
    textAlign: 'center',
    marginTop: '2%'
  };

  const buttonStyle: React.CSSProperties = {
    color: 'white',
    background: 'transparent',
    border: 'none',
    marginTop: '2%',
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <>
      {visible && (
        <div style={bannerStyle}>
          <span style={textStyle}>
            The miniSASS site will undergo routine maintenance on Friday, 30th August 2024. We apologize for any inconvenience caused by the brief downtime.
          </span>
          <button
            onClick={() => setVisible(false)}
            style={buttonStyle}
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
      )}
    </>
  );
};

export default Banner;
