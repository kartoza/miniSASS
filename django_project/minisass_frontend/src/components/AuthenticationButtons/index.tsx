import * as React from 'react';
import { Button, Img, Text } from "../../components";






function AuthenticationButtons(props) {

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
      <div className="sm:bottom-20 md:bottom-[119px] flex sm:flex-col flex-row md:gap-10 sm:h-[] items-start justify-between sm:left-[50px] md:left-[63px] md:relative sm:right-[] md:right-[] sm:top-[] md:w-[90%] w-full">
                      <Img
                        className="h-[29px] sm:h-[50px] md:h-auto sm:mt-0 mt-[21px] object-cover"
                        src={`${newURL}img_minisasstext1.png`}
                        alt="minisasstextOne"
                      />
                      <div className="flex flex-row gap-px items-start justify-end mb-[15px] rounded-bl-[15px] w-[280px]">
                        <Button
                          className="sm:bottom-[125px] cursor-pointer font-semibold leading-[normal] sm:left-[100px] sm:relative rounded-bl-[15px] rounded-br-[15px] text-base text-center w-full"
                          shape="square"
                          color="blue_900"
                          size="xs"
                          variant="fill"
                        >
                          login
                        </Button>
                        <Button
                          className="sm:bottom-[125px] cursor-pointer font-semibold leading-[normal] sm:left-[105px] sm:relative rounded-bl-[15px] rounded-br-[15px] text-base text-center w-full"
                          shape="square"
                          color="blue_900"
                          size="xs"
                          variant="fill"
                        >
                          register
                        </Button>
                      </div>
                    </div>
  );
}

export default AuthenticationButtons;
