import React, { useState } from "react";


import { Button, Img, List, Text } from "../../components";
import NavigationBar from "../../components/NavigationBar";
import Observations from "../../components/Observations";
import Footer from "../../components/Footer";
import ContactForm from "../../components/ContactUs";
import Slideshow from "../../components/SlideShow";

import "react-circular-progressbar/dist/styles.css";

const ContactUs: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

   // TODO these values will come from the api
   const ObservationsPropList = [
    {
      usernamejimtaylOne: "Username: S_Abrahams",
      userimage: "images/img_image2_24x30.png",
      username: "Liesbeek-Upper Liesbeek",
      score1: "5.57",
      organisation: "Organisation: Centre For Conservation Education",
    },
  ];

  // Function to handle advancing to the next set of observations
  const handleNextObservations = () => {
    // Calculate the next index to display (looping back to 0 if necessary)
    const nextIndex = (currentIndex + 4) % ObservationsPropList.length;
    setCurrentIndex(nextIndex);
  };

  
  

  return (
    <>
       <div className="bg-white-A700 flex flex-col font-raleway items-center justify-start mx-auto w-full">
        <div className="flex flex-col items-center justify-start w-full">
          <div className="h-[537px] md:px-5 relative w-full" style={{marginBottom: '-5%'}}>
          <header className="bg-white-A700 flex flex-col items-center justify-center mb-[-53px] mx-auto rounded-bl-[65px] w-full z-[1]">
              <div className="flex md:flex-col flex-row gap-[30px] items-center justify-between mb-[17px] ml-14 md:ml-[0] w-[97%]">
                <div className="bg-white-A700 flex flex-col h-[92px] md:h-auto items-start justify-start md:mt-0 mt-[17px] w-[77px]">
                  <Img
                    className="md:h-auto h-full object-cover md:relative sm:right-[170px] md:right-[400px] md:top-[120px] sm:top-[15px] w-full"
                    src="images/img_minisasslogo1.png"
                    alt="minisasslogoOne"
                  />
                </div>

                <NavigationBar activePage="contact" />
                
              </div>
            </header>
            {/* slideshow */}
            <Slideshow />
          </div>

          <div className="bg-blue-900 flex flex-col items-start justify-start max-w-full mt-28 pl-[53px] pr-[134px] md:px-10 sm:px-5 py-[103px] w-full">
            <div className="flex md:flex-col flex-row md:gap-10 gap-[89px] items-center justify-start max-w-[1700px] mx-auto w-full">
              <div className="flex md:flex-1 flex-col items-start justify-start w-[67%] md:w-full">
                <ContactForm />
              </div>
            </div>
          </div>
          

          {/* observations */}
          <div className="flex sm:flex-col flex-row md:gap-10 items-center justify-between max-w-[1179px] mt-[66px] mx-auto md:px-5 md:relative md:top-[15px] sm:top-[60px] w-full">
            <Text
              className="flex-1 sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-auto"
              size="txtRalewayRomanBold40"
            >
              Recent Observations
            </Text>
            <Button
              className="flex h-10 sm:hidden items-center justify-center rounded-[5px] w-10"
              color="blue_gray_500"
              size="sm"
              variant="fill"
              onClick={handleNextObservations}
              >
                <Img src="images/img_arrowright.svg" alt="arrowright" />
              </Button>
            </div>
            <List
              className="sm:flex-col flex-row gap-5 grid sm:grid-cols-1 md:grid-cols-2 grid-cols-4 sm:h-[60vh] md:h-[] md:justify-center justify-start sm:m-[] max-w-[1180px] sm:ml-[] mt-[51px] mx-auto sm:overflow-scroll md:px-5 sm:relative sm:top-5 w-full"
              orientation="horizontal"
            >
              {ObservationsPropList.slice(currentIndex, currentIndex + 4).map((props, index) => (
                <React.Fragment key={`DesktopThreeColumnscore${index}`}>
                  <Observations
                    className="border border-blue_gray-100 border-solid flex flex-col gap-2 h-[237px] md:h-auto items-start justify-between sm:px-5 px-6 py-5 rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-[280px]"
                    {...props}
                  />
                </React.Fragment>
              ))}
            </List>

          
          

            <Footer className="flex items-center justify-center mt-[122px] md:px-5 w-full" />

         
          
        </div>
      </div>
    </>
  );
};

export default ContactUs;
