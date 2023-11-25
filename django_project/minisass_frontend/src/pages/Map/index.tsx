import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button, Img, Input, Text } from "../../components";
import Footer from "../../components/Footer";
import NavigationBar from "../../components/NavigationBar";
import Sidebar from "../../components/Sidebar";
import { Map } from "../../components/Map"

import Search from './Search';
import basemapsData from './config/basemaps.config.json';
import overlayLayersData from './config/overlay.config.json';

import "./style.css"

const MapPage: React.FC = () => {
  const mapRef = useRef(null);

  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isObservationDetails, setIsObservationDetails] = useState(false);

  const handleSidebarToggle = () => {
    setIsObservationDetails(false)
    setSidebarOpen((prev) => !prev);
  };

  const currentURL = window.location.href;
  const parts = currentURL.split('/');
  const baseUrl = parts[0] + '//' + parts[2];
  const staticPath = baseUrl + '/static/images/';

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const details = params.get("details");

  useEffect(() => {

    if(details){
      window.scrollTo(0, 0); 
      setIsObservationDetails(true)
      setSidebarOpen((prev) => !prev);
    }
    

  }, [details]);

  const [showLegend, setShowLegend] = useState(true);

  const toggleLegend = () => {
    setShowLegend(prev => !prev);
  };

  return (
    <>
      <div className="bg-white-A700 flex flex-col font-raleway items-center justify-start mx-auto w-full h-screen">

        <div className="h-[120px] md:px-5 relative w-full">

            {/* header section */}
            <div className="bg-white-A700 flex flex-col items-center justify-start mb-[-53px] mx-auto pb-[17px] pl-[17px] rounded-bl-[65px] w-full z-[1]">
              <div className="flex flex-col items-center justify-start w-[98%] md:w-full">
                <div className="flex md:flex-col flex-row gap-[30px] items-start justify-between w-full">

                  {/* minisass logo */}
                  <div className="bg-white-A700 flex flex-col h-[92px] md:h-auto items-start justify-start md:mt-0 mt-[17px] w-[77px]">
                    <Img
                      className="sm:bottom-[] md:h-auto h-full object-cover md:relative sm:right-[30px] sm:top-2.5 md:top-5 w-full"
                      src={`${staticPath}img_minisasslogo1.png`}
                      alt="minisasslogoOne"
                    />
                  </div>


                  {/* navigation bar */}
                  <div className="flex md:flex-1 flex-col gap-2 items-center justify-start mb-1.5 w-[100%] md:w-full">
                    <NavigationBar activePage="map" />
                  </div>
                </div>
              </div>
            </div>
            {/* end of section */}




          </div>

        <div className="grow md:px-5 relative md:w-[103.9%] w-full relative">
          <div className="flex flex-col h-full items-center justify-start m-auto w-full">
            <div className="bg-blue-900 sm:bottom-[50px] flex flex-row gap-[17px] justify-end p-[13px] sm:relative sm:top-[] w-full">
              <Button
                className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
                color="blue_gray_500"
                size="xs"
                variant="fill"
                onClick={handleSidebarToggle}
              >
                Add Record
              </Button>
              <Search searchEntityChanged={geojson => mapRef?.current?.updateHighlighGeojson(geojson)}/>
            </div>
            <div className="grow relative w-full">
              <Map
                basemaps={
                  basemapsData.map(data => {
                    return {
                      name: data.name,
                      config: data
                    }
                  })
                }
                overlayLayers={
                  overlayLayersData.map(data => {
                    return {
                      name: data.name,
                      activeByDefault: data.activeByDefault,
                      config: data,
                    }
                  })
                }
                ref={mapRef}
              />
              {/* Sidebar */}
              <Sidebar isOpen={isSidebarOpen} isObservationDetails={isObservationDetails} setSidebarOpen={setSidebarOpen} />
            </div>
          </div>
          
          {/* Toggle button to show legend */}
          <div
            className="absolute top-0 left-0 m-4 p-2 bg-white top-[20%] rounded-md cursor-pointer"
            onClick={toggleLegend}
            style={{
              transition: 'transform 0.6s ease-in-out', // Adding smooth rotation transition
              backgroundColor: 'white',
              marginLeft: '-1px'
            }}
          >
            <svg
              width="12"
              height="16"
              viewBox="0 0 12 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transform ${showLegend ? 'rotate-180' : ''}`} // Apply rotation conditionally
            >
              <path
                d="M11 2L5 8L11 14"
                stroke="#000"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            L
          </div>

        <div
          className={`absolute bg-white-A700 flex flex-col gap-2 items-start justify-center left-[1%] px-[18px] py-5 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] top-[25%] sm:top-[25px] w-auto transition-opacity duration-300 ${
            showLegend ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ marginLeft: '-2px' }}
        >
        
          <Text className="text-base text-black-900" size="txtRalewayRomanBold16">
            Legend
          </Text>

          {showLegend && (
            <><div className="flex flex-row gap-3 items-center justify-center w-auto">
                <Img className="h-6 w-7" src={`${staticPath}img_alarm.svg`} alt="alarm" />
                <Text
                  className="text-base text-black-900 w-auto"
                  size="txtRalewayRomanRegular16"
                >
                  Unmodified (NATURAL condition)
                </Text>
              </div><div className="flex flex-row gap-3 items-center justify-center w-auto">
                  <Img
                    className="h-6 w-7"
                    src={`${staticPath}img_alarm_green_400.svg`}
                    alt="alarm_One" />
                  <Text
                    className="leading-[136.40%] max-w-[243px] md:max-w-full text-base text-black-900"
                    size="txtRalewayRomanRegular16"
                  >
                    Largely natural/few modifications (GOOD condition)
                  </Text>
                </div><div className="flex flex-row gap-3 items-center justify-center w-auto">
                  <Img
                    className="h-6 w-7"
                    src={`${staticPath}img_alarm_orange_a200.svg`}
                    alt="alarm_Two" />
                  <Text
                    className="text-base text-black-900 w-auto"
                    size="txtRalewayRomanRegular16"
                  >
                    Moderately modified (FAIR condition)
                  </Text>
                </div><div className="flex flex-row gap-3 items-center justify-center w-auto">
                  <Img
                    className="h-6 w-7"
                    src={`${staticPath}img_twitter.svg`}
                    alt="twitter" />
                  <Text
                    className="text-base text-black-900 w-auto"
                    size="txtRalewayRomanRegular16"
                  >
                    Largely modified (POOR condition)
                  </Text>
                </div><div className="flex flex-row gap-3 items-center justify-center w-auto">
                  <Img
                    className="h-6 w-7"
                    src={`${staticPath}img_alarm_deep_purple_400.svg`}
                    alt="alarm_Three" />
                  <Text
                    className="leading-[136.40%] max-w-[268px] md:max-w-full text-base text-black-900"
                    size="txtRalewayRomanRegular16"
                  >
                    Seriously/critically modified(VERY POOR condition)
                  </Text>
                </div><div className="flex flex-row gap-3 items-center justify-center w-auto">
                  <Img
                    className="h-6 w-7"
                    src={`${staticPath}img_settings.svg`}
                    alt="settings" />
                  <Text
                    className="text-base text-black-900 w-auto"
                    size="txtRalewayRomanRegular16"
                  >
                    No groups present
                  </Text>
                </div><div className="flex flex-row gap-3 items-center justify-center w-auto">
                  <Img
                    className="h-6 w-7"
                    src={`${staticPath}img_arrowdown.svg`}
                    alt="arrowdown" />
                  <Text
                    className="text-base text-black-900 w-auto"
                    size="txtRalewayRomanRegular16"
                  >
                    Exclamation mark: unverified
                  </Text>
                </div></>
                    )}
          </div>
          </div>
      </div>
      <Footer className="flex items-center justify-center mt-[107px] md:px-5 w-full" />
    </>
  );
};

export default MapPage;
