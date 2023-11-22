import React, { useEffect, useRef, useState } from "react";
import Modal from 'react-modal';
import { Button, Img, List, Text } from "../../components";
import { FaTrash } from 'react-icons/fa';
import { CircularProgressbar } from "react-circular-progressbar";
import axios from "axios";
import TabbedContent from "../../components/TabbedContent";

interface ObservationDetailsProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  observation_id: string;
  classname: string
}

const ObservationDetails: React.FC<ObservationDetailsProps> = ({ setSidebarOpen , classname, observation_id }) => {

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  
  // Decalre api endpoints
  const currentURL = window.location.href;
  const parts = currentURL.split('/');
  const baseUrl = parts[0] + '//' + parts[2];
  const staticPath = baseUrl + '/static/images/';
  const GET_OBSERVATION = baseUrl + '/observations/api/observation'

  // fetch observation TODO

  const [observationDetails, setObservationDetails] = useState({});
  const [titleColor, setTitleColor] = useState<string>('');
  const [progressBarColor, setProgressBarColor] = useState<string>('');
  const [renderCrab, setRenderCrab] = useState<string>('');

  const fetchObservation = async (observation: any) => {
    try {
      const response = await axios.get(`${GET_OBSERVATION}`, observation);
      
  
      if (response.status === 200) {
        setObservationDetails(response.data);

        if(parseFloat(response.data.average_score) < 6){
            setTitleColor("text-red-600")
            setProgressBarColor("red")
            setRenderCrab(`${staticPath}img_image2_24x30.png`)
          }else {
            setTitleColor("text-green-800")
            setProgressBarColor("green")
            setRenderCrab(`${staticPath}img_image2.png`)
          }

      } else { }
    } catch (error) {
      setTitleColor("text-red-600")
      setProgressBarColor("red")
      setRenderCrab(`${staticPath}img_image2_24x30.png`)
      setObservationDetails({
        "average_score": "3.50",
        "rivername": "Groot Marico",
        "sitename": "A3GMAR-RIVER",
        "sitedescription": "At River Still Guest Farm on Vergenoegd 289JP, owner Jaques duPlessisis 0823418898",
        "rivercategory": "sandy",
        "longitude": "26.41319",
        "latitude": "-26.413",
        "observationdetails": {
          "date": " Apr 15, 10",
          "collectorsname": "MolemaneMatela",
          "oganisationtype":" Government Department"
        }

      })
     }
  };

  useEffect(() => {

    fetchObservation(observation_id)

  }, [observation_id]);

  // this will be dynamic based on the observation data available
  const tabsData = [
    { id: 'tab1', label: 'Tab 1', content: (
      <div className="flex flex-row gap-2.5 items-start justify-start overflow-auto w-[566px] sm:w-full" style={{marginTop: '10%'}}>
        <Img
          className="h-[152px] md:h-auto object-cover w-[164px]"
          src={`${staticPath}img_rectangle91.png`}
          alt="img_placeholder"
        />
        <Img
          className="h-[152px] md:h-auto object-cover w-[164px]"
          src={`${staticPath}img_rectangle92.png`}
          alt="img_placeholder"
        />
      </div>
    )
  },
    { 
      id: 'tab2', 
      label: 'Tab 2', 
      content: <div className="flex flex-row gap-2.5 items-start justify-start overflow-auto w-[566px] sm:w-full" style={{marginTop: '10%'}}>
        Empty Tab
      </div> 
    },
  ];

  return (
    <div className={classname}
    style={{
        height: '95vh',
        overflowY: 'auto',
        overflowX: 'auto',
      }}
    >
          
    <div className="flex sm:flex-col flex-row gap-2.5 items-start justify-between w-full">
      <div className="flex sm:flex-1 sm:flex-col flex-row gap-3 items-center justify-start w-auto sm:w-full">
        <Text
          className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-auto"
          size="txtRalewayBold24"
        >
          miniSASS observation details
        </Text>
        <Img
          className="h-6 w-6"
          src={`${staticPath}img_mdidownloadcircleoutline.svg`}
          alt="mdidownloadcirc"
        />
      </div>
      <Img
        className="h-6 w-6"
        src={`${staticPath}img_icbaselineclose.svg`}
        alt="icbaselineclose"
        onClick={handleCloseSidebar}
      />
    </div>

    {/* this should define the tabs */}
    <TabbedContent tabsData={tabsData} />;

    <div className="flex flex-col gap-6 h-[543px] md:h-auto items-start justify-start w-full">
      <div className="flex flex-row gap-1 items-center justify-start pt-2 w-full">
        <Text
          className={`${titleColor} text-lg w-[127px]`}
          size="txtRalewayBold18"
        >
          Average score:
        </Text>
        <div className="flex flex-row gap-2.5 items-center justify-start w-auto">
          <div className="h-[68px] relative w-[68px]">
            <div className="h-[68px] m-auto w-[68px]">

            <div
              className={`!w-[68px] border-solid h-[68px] m-auto overflow-visible bg-${progressBarColor}`}
            >
              <CircularProgressbar
                className={`!w-[68px] border-solid h-[68px] m-auto overflow-visible ${progressBarColor}`}
                value={parseFloat(observationDetails.average_score || "0") * 10}
                strokeWidth={3}
                styles={{
                  trail: { strokeWidth: 3, stroke: "gray" },
                  path: {
                    strokeLinecap: "square",
                    height: "100%",
                    transformOrigin: "center",
                    transform: "rotate(0deg)",
                    stroke: progressBarColor,
                  },
                }}
              ></CircularProgressbar>
            </div>

              <Img
                className="absolute h-6 inset-x-[0] mx-auto object-cover top-[19%] w-[45%]"
                src={renderCrab}
                alt="rendercrab"
              />
            </div>
            <Text
              className={`${titleColor} absolute bottom-[18%] inset-x-[0] mx-auto text-base w-max`}
              size="txtRalewayRomanSemiBold16"
            >
              {observationDetails.average_score}
            </Text>
          </div>
          <Text
            className={`${titleColor} text-base w-auto`}
            size="txtRalewayRomanSemiBold16"
          >
            {progressBarColor === 'green' ? (`Good`): (`Poor`)}
          </Text>
        </div>
      </div>
      <div className="flex flex-col gap-3 items-start justify-start w-auto sm:w-full">
        <Text
          className="text-blue-900 text-lg w-auto"
          size="txtRalewayBold18Blue900"
        >
          Site Details
        </Text>
        <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            River name:
          </Text>
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            {observationDetails.rivername}
          </Text>
        </div>
        <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            Site name:
          </Text>
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            {observationDetails.sitename}
          </Text>
        </div>
         <div className="flex sm:flex-col flex-row gap-3 h-[75px] md:h-auto items-start justify-between w-[541px] sm:w-full" style={{ marginTop: '3%'}}>
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto self-end"
            size="txtRalewayRomanRegular18"
          >
            Site description:
          </Text>
          <Text
            className="leading-[24.00px] max-w-[250px] md:max-w-full text-gray-800_01 text-lg tracking-[0.15px] self-end text-right"
            size="txtRalewayRomanRegular18"
          >
            {observationDetails.sitedescription}
          </Text>
        </div>
        <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            Latitude:
          </Text>
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
             {observationDetails.latitude}
          </Text>
        </div>
        <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            Longitude:
          </Text>
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            {observationDetails.longitude}
          </Text>
        </div>
        <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            River category:
          </Text>
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            {observationDetails.rivercategory}
          </Text>
        </div>
      </div>
      <div className="flex flex-col gap-3 items-start justify-start w-auto sm:w-full">
        <Text
          className="text-blue-900 text-lg w-auto"
          size="txtRalewayBold18Blue900"
        >
          Observation details
        </Text>
        <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            Date:
          </Text>
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            {`APR 2020`}
          </Text>
        </div>
        <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            Collectors name:
          </Text>
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            {`Marko`}
          </Text>
        </div>
        <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            Organisation type:
          </Text>
          <Text
            className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
            size="txtRalewayRomanRegular18"
          >
            {`NGO`}
          </Text>
        </div>
      </div>
    </div>

  </div>
  );
};

export default ObservationDetails;
