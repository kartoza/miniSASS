import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { globalVariables } from '../../utils';

const Banner: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [dismissalType, setDismissalType] = useState<number | null>(null);

  const announcements_url = globalVariables.baseUrl + '/announcements/';
  
  // Fetch announcements from the API
  useEffect(() => {
    fetch(announcements_url)
      .then((response) => response.json())
      .then((data) => {
        setAnnouncements(data);
        if (data.length > 0) {
          setDismissalType(data[0].dismissal_type);
        }
      })
      .catch((error) => console.error('Error fetching announcements:', error));
  }, []);

  // Handle visibility based on dismissal type
  useEffect(() => {
    if (dismissalType !== 1 && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [visible, dismissalType]);

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
    textAlign: 'center'
  };

  const buttonStyle: React.CSSProperties = {
    color: 'white',
    background: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <>
      {visible && announcements.length > 0 && (
        <div style={bannerStyle}>
          <div style={textStyle}>
            {announcements.map((announcement, index) => (
              <div key={index}>
                <strong>{announcement.title}</strong><br />
                {announcement.content}
              </div>
            ))}
          </div>
          {(dismissalType !== 1) && (
            <button onClick={() => setVisible(false)} style={buttonStyle}>
              <AiOutlineClose size={24} />
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Banner;
