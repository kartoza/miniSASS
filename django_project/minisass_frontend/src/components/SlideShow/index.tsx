import React, { useState, useEffect } from "react";
import { Img } from "../../components/Img";
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import { globalVariables } from "../../utils";
import Banner from "../../components/Banner";

// Define an array of images for the slideshow TODO get the images list from the api
const slideshowImages = [
  `${globalVariables.staticPath}slideshow10.jpg`,
  `${globalVariables.staticPath}slideshow8.jpg`,
  `${globalVariables.staticPath}slideshow7.jpg`,
  `${globalVariables.staticPath}slideshow9.jpg`,
  `${globalVariables.staticPath}img_intrestedcitizensfromduct.png`,
];

const Slideshow: React.FC = () => {
  return (
    <div className="relative">
      <Banner />
      <div className="slide-container">
        <Fade>
          {slideshowImages.map((fadeImage, index) => (
            <div key={index}>
              <Img
                className="h-[464px] sm:left-[] mt-auto mx-auto object-cover relative rounded-br-[65px] top-10 sm:top-[-80px] md:top-[-85px] w-full mt-[-25px]"
                src={fadeImage}
                alt="intrestedcitize"
              />
            </div>
          ))}
        </Fade>
      </div>
    </div>
  );
}


export default Slideshow;
