import React from 'react';

interface YouTubeVideoProps {
  videoId: string; // YouTube video ID
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ videoId }) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className='video-responsive'>
      <iframe
        src={embedUrl}
        title="miniSASS"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeVideo;
