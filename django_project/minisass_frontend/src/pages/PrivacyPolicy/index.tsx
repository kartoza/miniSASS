import React from "react";

import {Img, Text} from "../../components";
import Footer from "../../components/Footer";
import NavigationBar from "../../components/NavigationBar";
import {globalVariables} from "../../utils";

import "../../pages/PrivacyPolicy/styles.css"


const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <div className="bg-white-A700 flex flex-col font-raleway items-center justify-start mx-auto pb-[5px] w-full">
        <div className="h-[282px] md:px-5 relative w-full">
          <div
            className="bg-white-A700 flex flex-col items-center justify-start mb-[-53px] mx-auto pb-[17px] pl-[17px] rounded-bl-[65px] w-full z-[1]">
            <div className="flex flex-col items-center justify-start w-[98%] md:w-full">
              <div className="flex md:flex-col flex-row gap-[30px] items-start justify-between w-full">
                <div
                  className="bg-white-A700 flex flex-col h-[92px] md:h-auto items-start justify-start md:mt-0 mt-[17px] w-[77px]">
                  <Img
                    className="md:h-auto h-full object-cover md:relative sm:right-[30px] md:top-2.5 w-full"
                    src={`${globalVariables.staticPath}img_minisasslogo1.png`}
                    alt="minisasslogoOne"
                  />
                </div>

                {/* navigation bar */}
                <div className="flex md:flex-1 flex-col gap-2 items-center justify-start mb-1.5 w-[100%] md:w-full">
                  <NavigationBar activePage="privacy-policy"/>
                </div>

              </div>
            </div>
          </div>
          <div
            id={"privacy-policy-title"}
            className="bg-gray-200 h-[20px] flex flex-col items-start justify-end mt-auto mx-auto p-12 md:px-10 sm:px-5
            relative rounded-br-[65px] md:top-[-105px] sm:top-[-80px] top-[50px] md:w-[102%]w-full
            ">
            <div className="flex flex-col items-center justify-start md:ml-[0] mt-[61px]">
              <Text
                className="sm:text-[32px] md:text-[38px] text-[42px] text-blue-900 ml-[185px] sm:ml-[0px]"
                size="txtRalewayRomanBold42"
                style={{marginBottom: '-30px'}}
              >
                Privacy Policy
              </Text>
            </div>
          </div>
        </div>

        <Footer className="flex items-center justify-center mt-28 md:px-5 w-full sm:mt-[200px]"/>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
