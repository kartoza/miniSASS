// src/components/Banner.tsx
import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const Banner: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000); // Banner will disappear after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    visible && (
      <div className="fixed top-0 left-0 w-full p-4 z-50">
        <div className="bg-blue-500 text-white rounded-lg p-4 flex justify-between items-center">
          <span>
            The miniSASS site will undergo routine maintenance on Friday, 30th August 2024. We apologize for any inconvenience caused by the brief downtime.
          </span>
          <button onClick={handleClose} className="text-white">
            <AiOutlineClose size={24} />
          </button>
        </div>
      </div>
    )
  );
};

export default Banner;
