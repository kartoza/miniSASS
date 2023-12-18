import React from "react";

import {Img} from "../../components";
import Footer from "../../components/Footer";
import NavigationBar from "../../components/NavigationBar";
import {globalVariables} from "../../utils";
import './index.css'


export default function BaseContainer (props: {children: any}) {
  return (
    <>
      <div className="bg-white-A700 flex flex-col font-raleway items-center justify-start mx-auto pb-[5px] w-full">
        <div className="flex flex-col items-center justify-start sm:static w-full">
          <div className="h-[537px] md:px-5 relative w-full">
            {/* header section */}
            <div className="bg-white-A700 flex flex-col items-center justify-start mb-[-53px] mx-auto pb-[17px] pl-[17px] rounded-bl-[65px] sm:static w-full z-[1]">
              <div className="flex flex-col items-center justify-start w-[98%] md:w-full">
                <div className="flex md:flex-col flex-row gap-[30px] items-start justify-between sm:static w-full">

                  {/* minisass logo */}
                  <div className="bg-white-A700 flex flex-col h-[92px] md:h-auto items-start justify-start md:mt-0 mt-[17px] w-[77px]">
                    <Img
                      className="sm:bottom-[] md:h-1/5 sm:h-auto h-full object-cover md:relative sm:right-[30px] md:top-5 w-full"
                      src={`${globalVariables.staticPath}img_minisasslogo1.png`}
                      alt="minisasslogoOne"
                    />
                  </div>


                  {/* navigation bar */}
                  <div className="flex md:flex-1 flex-col gap-2 items-center justify-start mb-1.5 relative w-[93%] md:w-full">
                    <NavigationBar activePage="home" />
                  </div>

                </div>
              </div>
            </div>
            <div className="content-container">
              {props.children}
            </div>
            {/* end of section */}
          </div>
          <div className="mt-[600px]"></div>

          <Footer className="flex items-center justify-center mt-28 md:px-5 w-full" />
        </div>
      </div>
    </>
  );
};
