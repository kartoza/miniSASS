import React from 'react';

interface YouTubeVideoProps {
  videoId: string; // YouTube video ID
  height?: string; // Height of the iframe
  width?: string; // Width of the iframe
  playButtonColor?: 'red' | 'green' | 'transparent'; // Custom play button color
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ videoId, height = '400px', width = '600px', playButtonColor }) => {
  const colorParam = playButtonColor ? `&color=${playButtonColor}` : '';
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0${colorParam}`;

  return (
    <div className='video-responsive'>
      <iframe
        src={embedUrl}
        title="miniSASS"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        height={height}
        width={width}
      ></iframe>
    </div>
  );
};

export default YouTubeVideo;
