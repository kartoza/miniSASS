import React from "react";

import { useNavigate } from "react-router-dom";

import { Button, Img, Input, Text } from "../../components";
import Footer from "../../components/Footer";
import NavigationBar from "../../components/NavigationBar";

const MapPage: React.FC = () => {
  const navigate = useNavigate();

  // Get the current URL using window.location.href
  const currentURL = window.location.href;

  // Extract the base URL (everything up to the first single forward slash '/')
  const parts = currentURL.split('/');
  const baseUrl = parts[0] + '//' + parts[2]; // Reconstruct the base URL

  // Define the replacement path
  const replacementPath = 'static/images/';

  // Construct the new URL with the replacement path
  const newURL = baseUrl + '/' + replacementPath;

  return (
    <>
      <div className="bg-white-A700 flex flex-col font-raleway items-center justify-start mx-auto w-full">
        <div className="bg-white-A700 flex flex-col items-center justify-start pb-[17px] pl-[17px] rounded-bl-[65px] w-full">
          <div className="flex flex-col items-center justify-start max-w-[1384px] mx-auto md:px-5 w-full">
            <div className="flex md:flex-col flex-row gap-[30px] items-start justify-between w-full">
              <div className="bg-white-A700 flex flex-col h-[92px] md:h-auto items-start justify-start md:mt-0 mt-[17px] w-[77px]">
                <Img
                  className="md:h-auto h-full object-cover md:relative md:top-2.5 w-full"
                  src={`${newURL}img_minisasslogo1.png`}
                  alt="minisasslogoOne"
                />
              </div>
              
              {/* navigation bar */}
              <div className="flex md:flex-1 flex-col gap-2 items-center justify-start mb-1.5 w-[100%] md:w-full">
                <NavigationBar activePage="home" />
              </div>

            </div>
          </div>
        </div>
        <div className="h-[1219px] md:px-5 relative md:w-[103.9%] w-full">
          <div className="flex flex-col h-full items-center justify-start m-auto w-full">
            <div className="flex flex-col items-center justify-start sm:w-[109%] w-full">
              <div className="bg-blue-900 sm:bottom-[50px] flex flex-row gap-[17px] items-center justify-end p-[13px] sm:relative sm:top-[] w-full">
                <Button
                  className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
                  color="blue_gray_500"
                  size="xs"
                  variant="fill"
                >
                  Add Record
                </Button>
                <Input
                  name="frameThirtyFour"
                  placeholder="Search"
                  className="font-bold md:h-auto p-0 placeholder:text-black-900 sm:h-auto text-base text-left w-full"
                  wrapClassName="mr-[3px] w-1/4"
                ></Input>
              </div>
              <div className="h-[1155px] relative w-full">
                {/* <Img
                  className="h-[1155px] md:h-[] m-auto object-cover sm:overflow-auto w-full"
                  src={`${newURL}img_image8.png`}
                  alt="imageEight"
                /> */}
                {/* <Img
                  className="absolute h-[71px] right-[1%] top-[1%]"
                  src={`${newURL}img_minimize.svg`}
                  alt="minimize"
                /> */}
                <Img
                  className="absolute bottom-[1%] h-9 left-[1%] w-11"
                  src={`${newURL}img_offer.svg`}
                  alt="offer"
                />
              </div>
            </div>
          </div>
          <div className="absolute bg-white-A700 flex flex-col gap-2 items-start justify-center left-[1%] px-[18px] py-5 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] top-[1%] sm:top-[25px] w-auto">
            <div className="flex flex-col items-center justify-center w-auto">
              <Text
                className="text-base text-black-900 w-auto"
                size="txtRalewayRomanBold16"
              >
                Legend
              </Text>
            </div>
            <div className="flex flex-row gap-3 items-center justify-center w-auto">
              <Img className="h-6 w-7" src={`${newURL}img_alarm.svg`} alt="alarm" />
              <Text
                className="text-base text-black-900 w-auto"
                size="txtRalewayRomanRegular16"
              >
                Unmodified (NATURAL condition)
              </Text>
            </div>
            <div className="flex flex-row gap-3 items-center justify-center w-auto">
              <Img
                className="h-6 w-7"
                src={`${newURL}img_alarm_green_400.svg`}
                alt="alarm_One"
              />
              <Text
                className="leading-[136.40%] max-w-[243px] md:max-w-full text-base text-black-900"
                size="txtRalewayRomanRegular16"
              >
                Largely natural/few modifications (GOOD condition)
              </Text>
            </div>
            <div className="flex flex-row gap-3 items-center justify-center w-auto">
              <Img
                className="h-6 w-7"
                src={`${newURL}img_alarm_orange_a200.svg`}
                alt="alarm_Two"
              />
              <Text
                className="text-base text-black-900 w-auto"
                size="txtRalewayRomanRegular16"
              >
                Moderately modified (FAIR condition)
              </Text>
            </div>
            <div className="flex flex-row gap-3 items-center justify-center w-auto">
              <Img
                className="h-6 w-7"
                src={`${newURL}img_twitter.svg`}
                alt="twitter"
              />
              <Text
                className="text-base text-black-900 w-auto"
                size="txtRalewayRomanRegular16"
              >
                Largely modified (POOR condition)
              </Text>
            </div>
            <div className="flex flex-row gap-3 items-center justify-center w-auto">
              <Img
                className="h-6 w-7"
                src={`${newURL}img_alarm_deep_purple_400.svg`}
                alt="alarm_Three"
              />
              <Text
                className="leading-[136.40%] max-w-[268px] md:max-w-full text-base text-black-900"
                size="txtRalewayRomanRegular16"
              >
                Seriously/critically modified(VERY POOR condition)
              </Text>
            </div>
            <div className="flex flex-row gap-3 items-center justify-center w-auto">
              <Img
                className="h-6 w-7"
                src={`${newURL}img_settings.svg`}
                alt="settings"
              />
              <Text
                className="text-base text-black-900 w-auto"
                size="txtRalewayRomanRegular16"
              >
                No groups present
              </Text>
            </div>
            <div className="flex flex-row gap-3 items-center justify-center w-auto">
              <Img
                className="h-6 w-7"
                src={`${newURL}img_arrowdown.svg`}
                alt="arrowdown"
              />
              <Text
                className="text-base text-black-900 w-auto"
                size="txtRalewayRomanRegular16"
              >
                Exclamation mark: unverified
              </Text>
            </div>
          </div>
        </div>
        <Footer className="flex items-center justify-center mt-[107px] md:px-5 w-full" />
      </div>
    </>
  );
};

export default MapPage;
