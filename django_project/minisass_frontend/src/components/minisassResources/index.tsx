import React, { useEffect, useState } from 'react';
import { Text } from "../../components";
import axios from "axios"

const MiniSASSResources = () => {
  const [showMoreFieldSheets, setShowMoreFieldSheets] = useState(false);
  const [showMoreNewsletters, setShowMoreNewsletters] = useState(false);

  // Get the current URL using window.location.href
  const currentURL = window.location.href;

  // Extract the base URL (everything up to the first single forward slash '/')
  const parts = currentURL.split('/');
  const baseUrl = parts[0] + '//' + parts[2]; // Reconstruct the base URL
  const apiBaseUrl = baseUrl + '/en/api/download-resources/';
  const FETCH_DOWNLOAD_RESOURCES = apiBaseUrl;

  const miniSASSFieldSheets = [ ];

  const miniSASSNewsletters = [ ];

    useEffect(() => {
        const fetchResources = () => {
            axios
                .get(
                    `${FETCH_DOWNLOAD_RESOURCES}`
                )
                .then((response) => {
                    if (response.data) {

                        // TODO add items to array
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        fetchResources();
    }, []);
  

  // Check if there are more than 5 items in each array
  const fieldSheetsOverflow = miniSASSFieldSheets.length > 5;
  const newslettersOverflow = miniSASSNewsletters.length > 5;

  return (
      <div className="flex flex-1 flex-col gap-[26px] items-start justify-start max-w-[783px] md:mt-0 mt-0.5 w-full">
        {/* Title */}
        <Text className="text-2xl md:text-[22px] text-white-A700 sm:text-xl w-full" size="txtRalewayBold24WhiteA700">
          miniSASS resources for download
        </Text>
        <div className="flex flex-col gap-3 items-start justify-start w-auto md:w-full">
          {/* Field Sheets */}
          <Text className="text-lg text-white-A700 w-auto" size="txtRalewayBold18WhiteA700">
            miniSASS field sheets
          </Text>
          <Text className="leading-[136.40%] text-base text-white-A700" size="txtRalewayRomanRegular16WhiteA700">
            {miniSASSFieldSheets.length > 0 ? (
              miniSASSFieldSheets.map((sheet, index) => (
                (index < 5 || showMoreFieldSheets) && (
                  <React.Fragment key={index}>
                    <a href="javascript:" className="text-yellow-400 font-raleway text-left font-normal underline">
                      {sheet.name}
                    </a>
                    <a href="javascript:" className="text-white-A700 font-raleway text-left font-normal underline">
                      ({sheet.size})
                    </a>
                    <br />
                  </React.Fragment>
                )
              ))
            ) : (
              <p>No resources available</p>
            )}
            {fieldSheetsOverflow && (
              <button
                className=" cursor-pointer"
                onClick={() => setShowMoreFieldSheets(!showMoreFieldSheets)}
              >
                And more...
              </button>
            )}
          </Text>
        </div>
        <div className="flex flex-col gap-3 items-start justify-start w-auto md:w-full">
          {/* Newsletters */}
          <Text className="text-lg text-white-A700 w-auto" size="txtRalewayBold18WhiteA700">
            miniSASS Newsletters
          </Text>
          <Text className="leading-[136.40%] text-base text-white-A700" size="txtRalewayRomanRegular16WhiteA700">
          {miniSASSNewsletters.length > 0 ? (
            miniSASSNewsletters.map((newsletter, index) => (
              (index < 5 || showMoreNewsletters) && (
                <React.Fragment key={index}>
                  <a href="javascript:" className="text-yellow-400 font-raleway text-left font-normal underline">
                    {newsletter.name}
                  </a>
                  <a href="javascript:" className="text-white-A700 font-raleway text-left font-normal underline">
                    ({newsletter.size})
                  </a>
                  <br />
                </React.Fragment>
              )
            ))
          ) : (
            <p>No resources available</p>
          )}
          {newslettersOverflow && (
            <button
              className="text-yellow-400 cursor-pointer"
              onClick={() => setShowMoreNewsletters(!showMoreNewsletters)}
            >
              And more...
            </button>
          )}
        </Text>
        </div>
      </div>
  );
};

export default MiniSASSResources;
