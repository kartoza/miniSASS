import React, { useState, useEffect } from "react";
import { Img } from "../../components/Img";

// Get the current URL using window.location.href
const currentURL = window.location.href;

// Extract the base URL (everything up to the first single forward slash '/')
const parts = currentURL.split('/');
const baseUrl = parts[0] + '//' + parts[2]; // Reconstruct the base URL

// Define the replacement path
const replacementPath = 'static/images/';

// Construct the new URL with the replacement path
const newURL = baseUrl + '/' + replacementPath;

// Define an array of images for the slideshow TODO get the images from the api
const slideshowImages = [
  `${newURL}slideshow10.jpg`,
  `${newURL}slideshow8.jpg`,
  `${newURL}slideshow7.jpg`,
  `${newURL}slideshow9.jpg`,
  `${newURL}img_intrestedcitizensfromduct.png`,
];

const Slideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to change the image index
  const changeImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === slideshowImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Use setInterval to change the image every 4 seconds
  useEffect(() => {
    const interval = setInterval(changeImage, 4000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Img
        className="h-[464px] sm:left-[] mt-auto mx-auto object-cover relative rounded-br-[65px] top-10 sm:top-[-80px] md:top-[-85px] w-full"
        src={slideshowImages[currentImageIndex]}
        alt="intrestedcitize"
      />
    </div>
  );
};

export default Slideshow;
