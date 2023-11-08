import React from 'react';

interface YouTubeVideoProps {
  videoId: string; // YouTube video ID
  height?: string; // Height of the iframe
  width?: string; // Width of the iframe
  playButtonColor?: 'red' | 'green' | 'transparent'; // Custom play button color
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ videoId, height, width, playButtonColor }) => {
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
        style={{
          borderRadius: '25px 0px 25px 25px'
        }}
        height={height}
        width={width}
      ></iframe>
    </div>
  );
};

export default YouTubeVideo;
