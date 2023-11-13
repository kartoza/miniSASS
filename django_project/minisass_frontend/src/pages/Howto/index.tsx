import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Button, Img, List, Text } from "../../components";
import Footer from "../../components/Footer";
import NavigationBar from "../../components/NavigationBar";
import YouTubeVideo from "../../components/YoutubeEmbedded";
import { Link } from 'react-scroll';
import MiniSASSResources from "../../components/minisassResources";
import RegistrationFormModal from "../../components/RegistrationFormModal";



const HowtoPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  // Get the current URL using window.location.href
  const currentURL = window.location.href;

  // Extract the base URL (everything up to the first single forward slash '/')
  const parts = currentURL.split('/');
  const baseUrl = parts[0] + '//' + parts[2]; // Reconstruct the base URL

  // Define the replacement path
  const replacementPath = 'static/images/';

  // Construct the new URL with the replacement path
  const newURL = baseUrl + '/' + replacementPath;

  const items = [
    "Net/Sieve",
    "Life Jacket",
    "Ice Cream Tub / White Tray",
    "Gumboots / Waders",
    "Cap/Hat/Sunscreen",
    "Soap/Handwash",
  ];

  const openRegisterModal = () => {
    setRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setRegisterModalOpen(false);
  };

  return (
    <>
      <div className="bg-white-A700 flex flex-col font-raleway items-center justify-start mx-auto pb-[5px] w-full">
        <div className="h-[282px] md:px-5 relative w-full">
          <div className="bg-white-A700 flex flex-col items-center justify-start mb-[-53px] mx-auto pb-[17px] pl-[17px] rounded-bl-[65px] w-full z-[1]">
            <div className="flex flex-col items-center justify-start w-[98%] md:w-full">
              <div className="flex md:flex-col flex-row gap-[30px] items-start justify-between w-full">
                <div className="bg-white-A700 flex flex-col h-[92px] md:h-auto items-start justify-start md:mt-0 mt-[17px] w-[77px]">
                  <Img
                    className="md:h-auto h-full object-cover md:relative sm:right-[30px] md:top-2.5 w-full"
                    src={`${newURL}img_minisasslogo1.png`}
                    alt="minisasslogoOne"
                  />
                </div>

                {/* navigation bar */}
                <div className="flex md:flex-1 flex-col gap-2 items-center justify-start mb-1.5 w-[100%] md:w-full">
                  <NavigationBar activePage="howto" />
                </div>

              </div>
            </div>
          </div>
          <div className="bg-gray-200 flex flex-col items-start justify-end mt-auto mx-auto p-12 md:px-10 sm:px-5 relative rounded-br-[65px] md:top-[-105px] sm:top-[-80px] top-[50px] md:w-[102%] sm:w-[144%] w-full">
            <div className="flex flex-col items-center justify-start md:ml-[0] ml-[79px] mt-[61px]">
              <Text
                className="sm:text-[32px] md:text-[38px] text-[42px] text-blue-900"
                size="txtRalewayRomanBold42"
              >
                How to
              </Text>
            </div>
          </div>
        </div>

        {/* links section */}
        <div className="flex md:flex-col flex-row gap-5 md:grid md:grid-cols-4 h-32 sm:h-[] md:h-auto items-start justify-center max-w-[1450px] mt-[3px] mx-auto sm:overflow-auto md:px-5 relative top-23 sm:top-40 md:top-[145px]  w-full">
          {/* the links for collect ,upload, are you ready, still empty TODO */}
          <List
              className="md:flex sm:flex-col flex-row gap-5 grid sm:grid-cols-1 md:grid-cols-2 grid-cols-4 h-32 justify-center max-w-[1450px] mt-1 mx-auto sm:overflow-auto md:overflow-x-auto md:px-5 relative md:top-[170px] sm:top-[190px] top-[80px] w-full"
              orientation="horizontal"
            >
                <Link
                  className="common-pointer h-full relative w-full"
                  to="CollectSampleSection"  // Provide the ID of the target section
                  smooth={true}
                  duration={800}  // Set the duration of the scrolling animation
                >
                <div className="flex h-24 md:h-28 justify-end mt-auto mx-auto w-full">
                  <div className="bg-blue_gray-500 sm:bottom-[] h-28 mt-auto mx-auto sm:relative rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:top-[] w-full"></div>
                  <div className="absolute bottom-[45%] flex flex-col inset-x-[0] items-center justify-start mx-auto w-[51%]">
                    
                    <Text
                      className="mt-1 text-center text-sm text-white-A700 tracking-[0.98px] uppercase w-auto"
                      size="txtRalewayExtraBold14WhiteA700"
                    >
                      Collect sample
                    </Text>
                  </div>
                </div>
                <Img
                  className="absolute h-[72px] right-[0] top-[0] w-[72px]"
                  src={`${newURL}img_yellow_crab.svg`}
                  alt="crab_placeholder"
                />

              </Link>
              <Link
                  className="common-pointer h-full relative w-full"
                  to="UploadResultSection"  // Provide the ID of the target section
                  smooth={true}
                  duration={800}  // Set the duration of the scrolling animation
                >
                <div className="flex h-24 md:h-28 justify-end mt-auto mx-auto w-full">
                  <div className="bg-blue_gray-500 sm:bottom-[] h-28 mt-auto mx-auto relative rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:top-[] w-full"></div>
                    <div className="absolute bottom-[45%] flex flex-col inset-x-[0] items-center justify-start mx-auto w-[51%]">
                    
                    <Text
                      className="mt-1 text-center text-sm text-white-A700 tracking-[0.98px] uppercase w-auto"
                      size="txtRalewayExtraBold14WhiteA700"
                    >
                      Upload result
                    </Text>
                  </div>
                </div>
                <Img
                  className="absolute bottom-[0] h-[72px] left-[0] w-[72px] rotate-[85deg]"
                  src={`${newURL}img_blue_crab.svg`}
                  alt="crab_placeholder"
                />
              </Link>
              <div
                className="common-pointer h-full relative w-full"
                onClick={() => navigate("/map")}
              >
                <div className="flex h-24 md:h-28 justify-end mt-auto mx-auto w-full">
                  <div className="bg-blue_gray-500 h-28 mt-auto mx-auto rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-full"></div>
                  <div className="absolute bottom-[45%] flex flex-col inset-x-[0] items-center justify-start mx-auto w-[47%]">
                    <Text
                      className="mt-1 text-center text-sm text-white-A700 tracking-[0.98px] uppercase w-auto"
                      size="txtRalewayExtraBold14WhiteA700"
                    >
                      Explore map
                    </Text>
                  </div>
                </div>
                <Img
                  className="absolute h-[72px] left-[0] top-[0] w-[72px] rotate-[90deg]"
                  src={`${newURL}img_yellow_crab.svg`}
                  alt="crab_placeholder"
                />
              </div>
              <Link
                className="common-pointer h-full relative w-full"
                to="AreYouReadySection"  // Provide the ID of the target section
                smooth={true}
                duration={800}  // Set the duration of the scrolling animation
              >
                <div className="md:h-28 h-[110px] m-auto w-full">
                  <div className="bg-blue_gray-500 h-28 m-auto rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-full"></div>
                  <div className="absolute bottom-[10%] flex flex-col h-max inset-[0] items-center justify-center m-auto w-[68%]">
                    
                    <Text
                      className="mt-1 text-center text-sm text-white-A700 tracking-[0.98px] uppercase w-auto"
                      size="txtRalewayExtraBold14WhiteA700"
                    >
                      Are you ready?
                    </Text>
                  </div>
                </div>
                <Img
                  className="absolute h-[72px] right-[0] top-[0] w-[72px]"
                  src={`${newURL}img_notov1crab_blue_gray_100_72x46.svg`}
                  alt="crab_placeholder"
                />
              </Link>
            </List>
        </div>
        {/* end of section */}
        
        {/* youtube player section */}
        <div className="flex flex-col gap-[46px] items-end justify-start max-w-[1450px] mt-[94px] mx-auto md:px-5 md:relative md:top-20 sm:top-[90px] sm:w-[144%] w-full">
          <Text
            className="border-b border-blue_gray-100 border-solid max-w-[1450px] md:max-w-full sm:pr-5 pr-[35px] sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-full"
            size="txtRalewayRomanBold40"
          >
            miniSASS website Video
          </Text>
          <div className="flex md:flex-col flex-row md:gap-10 items-center justify-between max-w-[1450px] md:relative md:top-[50px] w-full">
            <div className="h-[336px] relative w-1/2 md:w-full" >

              {/* <Img
                className="h-[336px] m-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tl-[25px] w-full"
                src={`${newURL}img_rectangle11.png`}
                alt="rectangleEleven"
              /> */}
              {/* <Img
                className="absolute h-[70px] inset-[0] justify-center m-auto w-[70px]"
                src={`${newURL}img_carbonplayfilled.svg`}
                alt="carbonplayfille"
              /> */}

              <div 
                className="h-[336px] m-auto object-cover rounded-bl-[55px] rounded-br-[25px] rounded-tl-[25px] w-full"
                
              >
                <YouTubeVideo videoId="QdQBGD08rv4" height="336px" width="90%" playButtonColor="green" />
              </div>

                

              

            </div>
            <Text
              className="leading-[136.40%] max-w-[474px] md:max-w-full text-base text-gray-800"
              size="txtRalewayRomanRegular16Gray800"
              style={{marginRight: '10%'}}
            >
              <span className="text-gray-800 font-raleway text-left font-normal">
                Subscribe to our Youtube Channel{" "}
              </span>
              <span className="text-gray-800 font-raleway text-left font-normal">
                <>
                  <br />
                </>
              </span>
              <a
                href="https://www.youtube.com/channel/UCub24hwrLi52WR9C24uTbaQ" // Add the YouTube channel link here
                className="text-blue-900 font-raleway text-left font-normal underline"
                target="_blank" rel="noopener noreferrer"
              >
                miniSASS
              </a>
              <span className="text-gray-800 font-raleway text-left font-normal">
                {" "}
              </span>
              <span className="text-gray-800 font-raleway text-left font-normal">
                for more.
              </span>
            </Text>

          </div>
        </div>
        {/* end of section */}

        <div className="flex flex-col gap-[58px] items-start justify-start max-w-[1450px] mt-[136px] mx-auto md:px-5 sm:w-[144%] w-full">
          <Text
            className="border-b border-blue_gray-100 border-solid max-w-[1450px] md:max-w-full sm:pr-5 pr-[35px] pt-1 sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-full"
            size="txtRalewayRomanBold40"
          >
            miniSASS on the go
          </Text>
          <List
            className="sm:flex-col flex-row gap-5 grid sm:grid-cols-1 md:grid-cols-2 grid-cols-3 sm:h-[50vh] justify-start md:overflow-auto sm:overflow-scroll w-auto md:w-full"
            orientation="horizontal"
          >
            <div className="flex flex-col gap-7 items-start justify-start w-[380px] sm:w-full">
              <div className="flex flex-col items-start justify-start w-auto">
                <Text
                  className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-auto"
                  size="txtRalewayBold24"
                >
                  What will you need?
                </Text>
                <Text
                  className="text-blue_gray-500 text-lg w-auto"
                  size="txtRalewayBold18"
                >
                  miniSASS checklist
                </Text>
              </div>
              <div className="flex flex-col gap-3.5 items-start justify-start w-[203px]">
                {items.map((item, index) => (
                  <Text
                    key={index}
                    className="text-base text-gray-800 w-auto"
                    size="txtRalewayRomanRegular16Gray800"
                  >
                    {item}
                  </Text>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-[46px] items-start justify-start w-[380px] sm:w-full">
              <Text
                className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-auto"
                size="txtRalewayBold24"
              >
                Do miniSASS
              </Text>
              <div className="flex flex-col gap-3.5 items-start justify-start w-[203px]">
                  {items.map((item, index) => (
                    <Text
                      key={index}
                      className="text-base text-gray-800 w-auto"
                      size="txtRalewayRomanRegular16Gray800"
                    >
                      {item}
                    </Text>
                  ))}
              </div>
            </div>
            <div className="flex flex-col gap-[46px] items-start justify-start w-[376px] sm:w-full">
              <Text
                className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-auto"
                size="txtRalewayBold24"
              >
                Upload data on the website
              </Text>
              <div className="flex flex-col gap-3.5 items-start justify-start w-[203px]">
                  {items.map((item, index) => (
                    <Text
                      key={index}
                      className="text-base text-gray-800 w-auto"
                      size="txtRalewayRomanRegular16Gray800"
                    >
                      {item}
                    </Text>
                  ))}
              </div>
            </div>
          </List>
        </div>
        <div className="flex flex-col gap-[58px] items-start justify-start max-w-[1450px] mt-28 mx-auto md:px-5  sm:w-[144%] w-full">
          <Text
            className="border-b border-blue_gray-100 border-solid max-w-[1450px] md:max-w-full sm:pr-5 pr-[35px] sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-full"
            size="txtRalewayRomanBold40"
          >
            How to do miniSASS
          </Text>
          <div className="flex md:flex-col flex-row gap-5 items-start justify-start w-auto md:w-full">
            <div className="flex flex-col gap-9 items-start justify-start w-auto sm:w-full">
              <Img
                className="h-[332px] sm:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] w-[580px] md:w-full"
                src={`${newURL}img_rectangle15.png`}
                alt="rectangleFifteen"
              />
              <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                <Text
                  className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-auto"
                  size="txtRalewayBold24"
                >
                  Collect a miniSASS sample
                </Text>
                <ul style={{ listStyleType: 'disc', marginLeft: '20px' }}>
                  <li>
                    
                    <a href="javascript:" className="text-blue-900 font-raleway text-left font-normal">
                    <span className="text-gray-800 font-raleway text-left font-normal">
                      Gather all the field sheets and{" "}
                    </span>
                    <span className="underline">
                      equipment
                    </span>
                      <span>!</span>
                    </a>
                  </li>
                  <li>
                    <span className="text-gray-800 font-raleway text-left font-normal">
                      Go to a river and collect bugs.
                    </span>
                  </li>
                  <li>
                    
                    <a href="javascript:" className="text-blue-900 font-raleway text-left font-normal">
                    <span className="text-gray-800 font-raleway text-left font-normal">
                      Count and identify all the bugs you have collected. Use the{" "}
                    </span>
                    <span className="underline">Dichotomous Key</span>
                    <span>
                      {" "}and{" "}
                    </span>
                      <span className="underline">
                        Identification guide.
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:" className="text-blue-900 font-raleway text-left font-normal ">
                      <span>Score them using the (</span>
                      <span className="underline">Version 2.0 November 2011</span>
                      <span>) and find your river health!!</span>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:" className="text-blue-900 font-raleway text-left font-normal underline">
                      Read more on preparing for miniSASS...
                    </a>
                  </li>
                </ul>

              </div>
            </div>
            <div className="flex flex-col gap-9 items-start justify-start w-auto sm:w-full">
              <Img
                className="h-[332px] sm:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] w-[580px] md:w-full"
                src={`${newURL}img_rectangle16.png`}
                alt="rectangleSixteen"
              />
              <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
               <RegistrationFormModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} onSubmit={null} error_response={null}/>
                <Text
                  className="leading-[136.40%] max-w-[480px] md:max-w-full text-2xl md:text-[22px] text-blue-900 sm:text-xl"
                  size="txtRalewayBold24"
                >
                  Upload your miniSASS result to the database map
                </Text>
                <ul style={{ listStyleType: 'disc', marginLeft: '20px' }}>
                  <li>
                    <a href="javascript:" className="text-blue-900 font-raleway text-left font-normal">
                      <span className="underline" onClick={openRegisterModal}>Register</span>
                      <span className="text-gray-800 font-raleway text-left font-normal">
                        {" "}on the website.
                      </span>
                    </a>
                    
                  </li>
                  <li>
                    <a href="javascript:" className="text-blue-900 font-raleway text-left font-normal">
                      <span>Play and explore the </span>
                      <span className="underline" onClick={() => navigate("/map")}>map</span>
                      <span className="text-gray-800 font-raleway text-left font-normal">
                      {" "}page
                    </span>
                    </a>
                    
                  </li>
                  <li>
                    <span className="text-gray-800 font-raleway text-left font-normal">
                      Enter your data on the miniSASS Data Input window!
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-800 font-raleway text-left font-normal">
                      {" "}Check that is corresponds and correlates to your field result!
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-800 font-raleway text-left font-normal">
                      The result will pop up as a crab with a colour reflecting the ecological region that your river falls in.
                    </span>
                  </li>
                </ul>

              </div>
            </div>
          </div>
        </div>
        <div  id='CollectSampleSection' className="flex flex-col gap-[58px] sm:h-[70vh] items-start justify-start max-w-[1450px] mt-28 mx-auto sm:overflow-auto md:px-5 sm:w-[144%] w-full">
          <Text
            className="border-b border-blue_gray-100 border-solid max-w-[1450px] md:max-w-full sm:pr-5 pr-[35px] pt-1 sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-full"
            size="txtRalewayRomanBold40"
          >
            How to collect a miniSASS Sample
          </Text>
          <List
            className="sm:flex-col flex-row gap-5 grid md:grid-cols-1 grid-cols-2 justify-start w-auto md:w-full"
            orientation="horizontal"
          >
            <div className="flex flex-col gap-9 items-start justify-start w-[580px] sm:w-full">
              <Img
                className="h-[332px] sm:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-[480px] md:w-full"
                src={`${newURL}img_rectangle15_332x480.png`}
                alt="rectangleFifteen"
              />
              <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                <Text
                  className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-auto"
                  size="txtRalewayBold24"
                >
                  Tools you need
                </Text>
                <Text className="leading-[136.40%] text-base text-gray-800" size="txtRalewayRomanRegular16Gray800">
                  Check on this List:
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1rem' }}>
                    <li>
                      <a href="javascript:" className="text-blue-900 font-raleway text-left font-normal ">
                       <span className="underline">Score sheet</span>
                        <span className="text-gray-800 font-raleway text-left font-normal">
                        , or a piece of paper
                      </span>
                      </a>
                      
                    </li>
                    <li>
                      Pen / Pencil
                    </li>
                    <li>
                      
                      <a href="javascript:" className="text-blue-900 font-raleway text-left font-normal">
                        <span>
                          Sieve / net (
                        </span>
                       <span className="underline"> You can make your own Net</span>
                       <span>)</span>
                      </a>
                      
                    </li>
                    <li>
                      White Tray / Ice cream container
                    </li>
                  </ul>
                </Text>

                <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                  <Text
                    className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                    size="txtRalewayBold24"
                  >
                    How to be Safe
                  </Text>
                  <Text
                    className="leading-[136.40%] text-base text-gray-800"
                    size="txtRalewayRomanRegular16Gray800"
                  >
                    <>
                      Rivers may contain various toxins or harmful pollutants.
                      Dangerous animals may also be lurking around. So it is
                      important to cover up your feet.
                      <br />
                      Wear Gumboots/Waders/Wellingtons (protecting your feet
                      from the sharp rocks or insects/animals )<br />
                      You must have soap to wash your hands and arms after the
                      sampling.
                      <br />A life jacket is to be worn for deep waters and
                      strong currents and by non-swimmers.
                    </>
                  </Text>
                </div>
                <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                  <Text
                    className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                    size="txtRalewayBold24"
                  >
                    Method
                  </Text>
                  <Text
                    className="leading-[136.40%] text-base text-gray-800"
                    size="txtRalewayRomanRegular16Gray800"
                  >
                    <>
                      You must get a sample that ranges from all the biotopes in
                      five minutes. For the Rocky biotope you can turn over the
                      rocks and kick them whilst your net is at a downstream
                      position so that all biota that will be released will go
                      directly into the net. When there are some insects on the
                      rock, you can use the river water to put wash them into
                      the net or gently hand pick it and put it into the net.
                      <br />
                      The GSM biotope is the most fun as you sludge your feet
                      into the mud and dislodge all the sand and mud into the
                      water (use your feet) and run the net in the dirty and
                      muddy water; careful not to get too much mud and sand in
                      the net.
                      <br />
                      The Vegetative biotope requires that you only sample 2m
                      worth of the biotope, but you can split the 2m all around
                      different types of vegetation that might be present. Also
                      take special care to sample below the water for an
                      accurate result.Now you must deposit all the sampled biota
                      into the white tray. Halfway fill the tray with water and
                      rinse the net. Carefully use forceps to get the biota that
                      might be clinging to the net and on the leaves or plant
                      debris and place it in the net.
                      <br />
                      Now look into the white tray filled with a range of
                      organisms that we shall use as data. It is time to pull
                      out the Identification guide as well as the Dichotomous
                      key of macroinvertebrates.
                      <br />
                      Look carefully at the insects in the tray and try to match
                      them with those in the Dichotomous guide.
                      <br />
                      When you find a match, mark that insect in the sensitivity
                      table. Do this once for every group that you find. Do this
                      until you are satisfied that you have captured all the
                      different types of insects. Then you can release them back
                      into the river.
                    </>
                  </Text>
                </div>
                <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                  <Text
                    className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                    size="txtRalewayBold24"
                  >
                    Clarity Test
                  </Text>
                  <Text
                    className="leading-[136.40%] max-w-[480px] md:max-w-full text-base text-gray-800"
                    size="txtRalewayRomanRegular16Gray800"
                  >
                    As a helpful indicator the turbidity of the river may be
                    tested. This result, although not part of the miniSASS, does
                    provide an idea of the river turbidity at that particular
                    site. A low score indicates that the water is not clean, it
                    carries many suspended solids. A low turbidity indicates the
                    lack of dirt or solids in the river/stream.
                  </Text>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-9 items-start justify-start w-auto sm:w-full">
              <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                <Text
                  className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                  size="txtRalewayBold24"
                >
                  Terms To Know
                </Text>
                <Text
                  className="leading-[136.40%] text-base text-gray-800"
                  size="txtRalewayRomanRegular16Gray800"
                >
                  <>
                    Before you get wet and dirty there are important terms you
                    should know.
                    <br />
                    Rocky/ Sandy rivers - Rivers are termed “rocky” when they
                    have rocks and are usually found at the source of the
                    river.Rivers without any rocks are termed “sandy” and are
                    found at the mouth of the river.
                    <br />
                    Biotope - A biological habitat type. We look at three types
                    in the miniSASS. Vegetative type has river plants (usually
                    on the sides). Rocky type has small - large rocks. The GSM
                    biotope is the gravel/mud/sand regions of the river.
                  </>
                </Text>
              </div>
              <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                <Text
                  className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                  size="txtRalewayBold24"
                >
                  Best Sites for miniSASS
                </Text>
                <Text
                  className="leading-[136.40%] max-w-[480px] md:max-w-full text-base text-gray-800"
                  size="txtRalewayRomanRegular16Gray800"
                >
                  miniSASS can only be done in rivers and streams. It
                  unfortunately cannot be done on stagnant water like ponds,
                  dams and wetlands. It is very important to check whether the
                  sample area has flowing water, if no then a miniSASS cannot be
                  done there. The best sites for miniSASS are those sections
                  with sand, vegetation and stones available for sampling.
                </Text>
              </div>
              <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                <Text
                  className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                  size="txtRalewayBold24"
                >
                  Determine Your Location using GPS
                </Text>
                <Text
                  className="leading-[136.40%] text-base text-gray-800"
                  size="txtRalewayRomanRegular16Gray800"
                >
                  <>
                    Make sure you fill the Site Information table in correctly,
                    including the GPS Co-ordinates. GPS is a Global Positioning
                    System: A global tool used to determine your accurate
                    position on earth. It is a system of co-ordinates that
                    enables navigation to a particular point. It is very
                    important to have your GPS co-ordinates at the site of the
                    miniSASS, that way we can tell where and which river was
                    sampled. You will require a GPS machine; some cell-phones
                    also provide accurate co-ordinates. Ensure you have noted
                    all the data and figures after the comma, it is important to
                    precisely get the location of the sampling.
                    <br />
                    The Map accepts the co-ordinates in the format of decimal
                    degrees (-29.26778) and the degrees, minutes and seconds
                    (290 16&#39; 40&quot;).
                  </>
                </Text>
              </div>
              <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                <Text
                  className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                  size="txtRalewayBold24"
                >
                  How to do the scoring
                </Text>
                <Text
                  className="leading-[136.40%] text-base text-gray-800"
                  size="txtRalewayRomanRegular16Gray800"
                >
                  <>
                    Each group of microinvertabrates has been allocated a
                    sensitivity score due to their resistance or susceptibility
                    to pollution. A high sensitivity score indicates the high
                    degree of sensitivity and likely not to be present in
                    unnatural river conditions. A low sensitivity score
                    indicates a greater resistance to pollution.
                    <br />
                    Ensure that you calculate using the Version 2.0 November
                    2011 pamphlet. Once all these scores have been added up then
                    we take this total and divide it by the number of groups
                    found in order to yield the average score for the river site
                  </>
                </Text>
              </div>
              <Img
                className="h-[332px] sm:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-[480px] md:w-full"
                src={`${newURL}img_rectangle15_1.png`}
                alt="rectangleFifteen"
              />
              <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                <Text
                  className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                  size="txtRalewayBold24"
                >
                  Calculating Your River Health
                </Text>
                <Text
                  className="leading-[136.40%] text-base text-gray-800"
                  size="txtRalewayRomanRegular16Gray800"
                >
                  <>
                    The miniSASS score calculated above is then cross compared
                    to the Ecological Category table where, depending on the
                    river category your site fits in, we can tell which
                    condition the river is in.
                    <br />
                    N.B. Even if the result falls under &quot;Unmodified/
                    natural&quot; Condition this water must still undergo
                    chemical and microbial analysis before it is fit for human
                    consumption. This score measures how environmentally healthy
                    the stream/river is.
                  </>
                </Text>
              </div>
            </div>
          </List>
        </div>
        <div id='UploadResultSection' className="flex flex-col gap-[58px] sm:h-[70vh] items-start justify-start max-w-[1450px] mt-28 mx-auto sm:overflow-auto md:px-5 sm:w-[144%] w-full">
          <Text
            className="border-b border-blue_gray-100 border-solid max-w-[1450px] md:max-w-full sm:pr-5 pr-[35px] pt-1 sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-full"
            size="txtRalewayRomanBold40"
          >
            How to upload your miniSASS result to the database map
          </Text>
          <div className="flex flex-col items-start justify-start max-w-[1450px] w-full">
            <div className="flex flex-col items-start justify-start max-w-[1132px] w-full">
              <div className="flex flex-col gap-[26px] items-start justify-start w-auto md:w-full">
                <a
                  href="javascript:"
                  className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-auto"
                >
                  <Text size="txtRalewayBold24">Register</Text>
                </a>
                <Text
                  className="leading-[136.40%] text-base text-gray-800"
                  size="txtRalewayRomanRegular16Gray800"
                >
                  <span className="text-gray-800 font-raleway text-left font-normal">
                    <>
                      Once you have collected your miniSASS sample, record all
                      the information needed on the miniSASS sheet. <br />
                      To upload your miniSASS results you will first need to
                    </>
                  </span>
                  <a
                    href="javascript:"
                    className="text-blue-900 font-raleway text-left font-normal underline"
                  >
                    {" "}
                  </a>
                  <a
                    href="javascript:"
                    className="text-blue-900 font-raleway text-left font-normal underline"
                  >
                    register
                  </a>
                  <a
                    href="javascript:"
                    className="text-blue-900 font-raleway text-left font-normal underline"
                  >
                    .
                  </a>
                </Text>
                <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                  <Text
                    className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                    size="txtRalewayBold24"
                  >
                    Play
                  </Text>
                  <Text
                    className="leading-[136.40%] max-w-[480px] md:max-w-full text-base text-gray-800"
                    size="txtRalewayRomanRegular16Gray800"
                  >
                    On the map page you will see the buttons on the left and the
                    helping text below. Before you add any of your data just
                    play around with all the tools and familiarise yourself with
                    the layers and the zooming functions.
                  </Text>
                </div>
                <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                  <Text
                    className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                    size="txtRalewayBold24"
                  >
                    Find Your Site/School
                  </Text>
                  <Text
                    className="leading-[136.40%] max-w-[480px] md:max-w-full text-base text-gray-800"
                    size="txtRalewayRomanRegular16Gray800"
                  >
                    Google terrain shows you the image of the physical geography
                    of the area whilst Google Satellite shows you the actual
                    image from the satellite. The Google Road layer shows the
                    map functions like roads and cities and the Rivers and
                    Catchments layer only shows the rivers, streams and
                    catchments.
                  </Text>
                </div>
                <div className="flex md:flex-col flex-row md:gap-10 gap-[119px] items-start justify-between w-auto md:w-full">
                  <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                    <Text
                      className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                      size="txtRalewayBold24"
                    >
                      Upload
                    </Text>
                    <Text
                      className="leading-[136.40%] max-w-[480px] md:max-w-full text-base text-gray-800"
                      size="txtRalewayRomanRegular16Gray800"
                    >
                      To upload your data, you can either do it by clicking on
                      the site by panning the map or by adding the co-ordinates
                      manually. If you wish to add the latest observations to an
                      already existing site than you can do so by prior
                      selection of that site. Take careful note to fill in all
                      the sections; the river type, date and the GPS
                      co-ordinates on the miniSASS DATA Input table. Add your
                      data as per your collection, clicking only the relevant
                      macroinvertabrates.
                    </Text>
                  </div>
                  <Img
                    className="h-[242px] sm:h-auto object-cover w-[533px] md:w-full"
                    src={`${newURL}img_rectangle19.png`}
                    alt="rectangleNineteen"
                  />
                </div>
                <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                  <Text
                    className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                    size="txtRalewayBold24"
                  >
                    Are you at the right spot?
                  </Text>
                  <Text
                    className="leading-[136.40%] text-base text-gray-800"
                    size="txtRalewayRomanRegular16Gray800"
                  >
                    <>
                      When you enter your GPS co-ordinates remember:
                      <br />
                      Longitude: East is positive (+) West is negative
                      (-)Latitude: North is positive (+) South is negative (-)In
                      South Africa latitude is always (-), longitude is always
                      (+)
                    </>
                  </Text>
                </div>
                <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                  <Text
                    className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                    size="txtRalewayBold24"
                  >
                    Save
                  </Text>
                  <Text
                    className="leading-[136.40%] max-w-[480px] md:max-w-full text-base text-gray-800"
                    size="txtRalewayRomanRegular16Gray800"
                  >
                    <span className="text-gray-800 font-raleway text-left font-normal">
                      <>
                        Double Check that this correlates with your on-site
                        data. Save your site and it will pop up on the map. If
                        you made a mistake you can send a request for change on
                        the &quot;
                      </>
                    </span>
                    <a
                      href="javascript:"
                      className="text-blue-900 font-raleway text-left font-normal underline"
                    >
                      Contact Us
                    </a>
                    <span className="text-gray-800 font-raleway text-left font-normal">
                      <>&quot; Page.</>
                    </span>
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-900 flex md:flex-col flex-row md:gap-10 gap-[97px] items-center justify-start mt-28 p-[103px] md:px-10 sm:px-5 sm:w-[144%] w-full">
          <Img
            className="md:flex-1 h-[280px] sm:h-auto md:ml-[0] ml-[27px] object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tl-[25px] w-1/4 md:w-full"
            src={`${newURL}img_rectangle6.png`}
            alt="rectangleSix"
          />
          <div className="flex flex-1 flex-col gap-[26px] items-start justify-start max-w-[783px] md:mt-0 mt-0.5  w-full">
            <Text
              className="leading-[136.40%] max-w-[783px] md:max-w-full text-2xl md:text-[22px] text-white-A700 sm:text-xl"
              size="txtRalewayBold24WhiteA700"
            >
              <>
                Tips for exploring the miniSASS <br />
                database map
              </>
            </Text>
            <Text
              className="leading-[136.40%] text-base text-white-A700"
              size="txtRalewayRomanRegular16WhiteA700"
            >
              <span className="text-yellow-400 font-raleway text-left text-lg font-bold">
                Zooming
              </span>
              <span className="text-white-A700 font-raleway text-left font-normal">
                <>
                  {" "}
                  Press &quot;Shift&quot; then click and drag an area on the map
                  and it will immediately zoom into that area. Alternatively,
                  use the scroll wheel to also zoom in and out of the map. You
                  can pan the map using the mouse.
                  <br />
                </>
              </span>
              <span className="text-yellow-400 font-raleway text-left text-lg font-bold">
                Legends
              </span>
              <span className="text-white-A700 font-raleway text-left font-normal">
                <>
                  {" "}
                  are able to tell you what all the different symbols mean, so
                  you can tell how well the river is doing.
                  <br />
                  Switch on the{" "}
                </>
              </span>
              <span className="text-yellow-400 font-raleway text-left text-lg font-bold">
                Overlays
              </span>
              <span className="text-white-A700 font-raleway text-left font-normal">
                <>
                  {" "}
                  to see previous miniSASS results and local schools.
                  <br />
                </>
              </span>
              <span className="text-yellow-400 font-raleway text-left text-lg font-bold">
                GPS Co-ordinates
              </span>
              <span className="text-white-A700 font-raleway text-left font-normal">
                <>
                  {" "}
                  the map accepts both Decimal Degrees and
                  Degrees/Minutes/Seconds formats. You can choose N/S and E/W
                  depending on where the river came from.
                  <br />
                </>
              </span>
              <span className="text-yellow-400 font-raleway text-left text-lg font-bold">
                Information
              </span>
              <span className="text-white-A700 font-raleway text-left font-normal">
                <>
                  {" "}
                  on other sites. To get more information on the sites, use the
                  &quot;i&quot; information button and click on the crab to
                  reveal all the observations.
                </>
              </span>
            </Text>
          </div>
        </div>
        <div id='AreYouReadySection' className="flex flex-col gap-[58px] sm:h-[70vh] items-start justify-start max-w-[1450px] mt-28 mx-auto sm:overflow-auto md:px-5 sm:w-[144%] w-full">
          <div className="border-b border-blue_gray-100 border-solid flex flex-col items-center justify-between max-w-[1450px] w-full">
            <Text
              className="sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-auto"
              size="txtRalewayRomanBold40"
            >
              Are You Ready For Sampling Your Nearest River?
            </Text>
          </div>
          <Text
            className="text-blue_gray-500 text-lg w-auto"
            size="txtRalewayBold18"
          >
            Before you go out to explore, first make sure you have all of the
            below:
          </Text>
          <div className="flex flex-col items-start justify-start max-w-[1450px] w-full">
            <div className="flex flex-col items-start justify-start max-w-[1132px] w-full">
              <div className="flex flex-col gap-[26px] items-start justify-start w-auto md:w-full">
                <Text
                  className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-auto"
                  size="txtRalewayBold24"
                >
                  Be Safe!!!
                </Text>
                <Text
                  className="leading-[136.40%] text-base text-gray-800"
                  size="txtRalewayRomanRegular16Gray800"
                >
                  <>
                    There are many animals in the river like snakes and
                    crocodiles and in some deep waters there are hippos!
                    <br />
                    Make sure you are wearing protective shoes before you go in
                    the river. There are many sharp rocks under the water.
                    <br />
                    miniSASS does not measure whether the water is fit to drink.
                    A good miniSASS score means that the river has
                    environmentally healthy water. Do not drink the water.
                  </>
                </Text>
                <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                  <Text
                    className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                    size="txtRalewayBold24"
                  >
                    Check on this List:
                  </Text>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1rem' }}>
                    <li>
                      <Text className="leading-[136.40%] text-base text-gray-800" size="txtRalewayRomanRegular16Gray800">
                        Life jacket (Especially if you cannot swim or when sampling from rivers with a strong current)
                      </Text>
                    </li>
                    <li>
                      <Text className="leading-[136.40%] text-base text-gray-800" size="txtRalewayRomanRegular16Gray800">
                        Soap / Hand wash
                      </Text>
                    </li>
                    <li>
                      <Text className="leading-[136.40%] text-base text-gray-800" size="txtRalewayRomanRegular16Gray800">
                        Cap/Hat/Sunscreen
                      </Text>
                    </li>
                    <li>
                      <Text className="leading-[136.40%] text-base text-gray-800" size="txtRalewayRomanRegular16Gray800">
                        Gumboots/Waders/Wellingtons
                      </Text>
                    </li>
                    <li>
                      <Text className="leading-[136.40%] text-base text-gray-800" size="txtRalewayRomanRegular16Gray800">
                        Net / Sieve (See Below for how to make your own)
                      </Text>
                    </li>
                    <li>
                      <Text className="leading-[136.40%] text-base text-gray-800" size="txtRalewayRomanRegular16Gray800">
                        Pencil/Pen
                      </Text>
                    </li>
                    <li>
                      <Text className="leading-[136.40%] text-base text-gray-800" size="txtRalewayRomanRegular16Gray800">
                        Timer (Remember you can only sample for 5 min)
                      </Text>
                    </li>
                    <li>
                      <Text className="leading-[136.40%] text-base text-gray-800" size="txtRalewayRomanRegular16Gray800">
                        Magnifying glass
                      </Text>
                    </li>
                    <li>
                      <Text className="leading-[136.40%] text-base text-gray-800" size="txtRalewayRomanRegular16Gray800">
                        Ice cream Container / white tray
                      </Text>
                    </li>
                  </ul>
                </div>
                <div className="flex md:flex-col flex-row md:gap-10 gap-[119px] items-start justify-between w-auto md:w-full">
                  <div className="flex flex-col gap-[26px] items-start justify-start w-auto sm:w-full">
                    <Text
                      className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-full"
                      size="txtRalewayBold24"
                    >
                      How to Make Your Own Net
                    </Text>
                    <Text
                      className="leading-[136.40%] text-base text-gray-800"
                      size="txtRalewayRomanRegular16Gray800"
                    >
                      <>
                        take any piece of wire, for example an old clothes
                        hanger, and bend it into the shape of a net. Then tie
                        the netting (which can be any porous material) to the
                        wire with a piece of string. And you have a net like the
                        one below.
                        <br />
                        You can use yoghurt containers and ice cream tray. Poke
                        some holes in the bottom and you are good to go!
                      </>
                    </Text>
                  </div>
                  <Img
                    className="h-[338px] sm:h-auto object-cover w-[533px] md:w-full"
                    src={`${newURL}img_rectangle19_338x533.png`}
                    alt="rectangleNineteen_One"
                  />
                </div>
                <div className="flex flex-col items-start justify-start w-auto sm:w-full">
                  <Text
                    className="leading-[136.40%] text-base text-gray-800"
                    size="txtRalewayRomanRegular16Gray800"
                  >
                    <span className="text-gray-800 font-raleway text-left font-normal">
                      You can get the{" "}
                    </span>
                    <a
                      href="javascript:"
                      className="text-blue-900 font-raleway text-left font-normal underline"
                    >
                      full miniSASS kit from GroundTruth
                    </a>
                    <span className="text-gray-800 font-raleway text-left font-normal">
                      <>
                        . <br />
                        GroundTruth supplies miniSASS field equipment as
                        individual items or as a kit.The following items can be
                        supplied: <br />- miniSASS net <br />- A cost effective
                        but robust version of the SASS5 net developed and tested
                        by GroundTruth. <br />- miniSASS tray <br />-
                        loupe/magnifying glass <br />- tweezers and pipette{" "}
                        <br />- assortment of sample bottles
                      </>
                    </span>
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* resources for download section */}
        <div className="bg-blue-900 flex md:flex-col flex-row md:gap-10 gap-[97px] items-start justify-start mt-28 p-[103px] md:px-10 sm:px-5 sm:w-[144%] w-full">
          <Img
            className="md:flex-1 h-[280px] sm:h-auto md:ml-[0] ml-[27px] md:mt-0 mt-0.5 object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tl-[25px] w-1/4 md:w-full"
            src={`${newURL}img_rectangle6_280x303.png`}
            alt="rectangleSix_One"
          />
          <MiniSASSResources />
        </div>

        <Footer className="flex items-center justify-center mt-28 md:px-5 sm:w-[144%] w-full" />
      </div>
    </>
  );
};

export default HowtoPage;
