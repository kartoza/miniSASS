import React, { useEffect, useState } from "react";
import { Img, Text } from "..";
import { CircularProgressbar } from "react-circular-progressbar";
import axios from "axios";
import TabbedContent from "../TabbedContent";
import { globalVariables } from "../../utils";
import LinearProgress from '@mui/material/LinearProgress';
import DownloadObservationForm from '../DownloadObservationModal/index';
import LineChart from '../Charts/LineChart';
import dayjs from 'dayjs';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

interface ObservationDetailsProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  observation_id: string;
  classname: string;
  handleMapClick: (longitude: number, latitude: number) => void;
  siteWithObservations: { site: {}, observations: []};
  resetMap: () => void;
}

interface Observation {
  observation: number;
  site: string;
  username: string;
  organisation: string;
  time_stamp: string;
  obs_date: string;
  score: string;
}

const OBSERVATION_LIST_URL = globalVariables.baseUrl + '/monitor/observations/recent-observations'

const ObservationDetails: React.FC<ObservationDetailsProps> = ({ 
  setSidebarOpen, 
  classname, 
  observation_id,
  handleMapClick, 
  siteWithObservations,
  resetMap  
}) => {

  const [openFromHomePage, setOpenFromHomePage] = useState(true);

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    // resetMap();
    setOpenFromHomePage(false);
  };

  const GET_OBSERVATION = globalVariables.baseUrl + `/monitor/observations/observation-details/${observation_id}/`

  const [loading, setLoading] = useState(true);
  const [observationDetails, setObservationDetails] = useState({});
  const [titleColor, setTitleColor] = useState<string>('');
  const [classification, setClassification] = useState<string>('');
  const [progressBarColor, setProgressBarColor] = useState<string>('');
  const [renderCrab, setRenderCrab] = useState<string>('');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [isChartHidden, setIsChartHidden] = useState<boolean>(true);
  const [observationList, setObservationList] = useState<Observation[]>([]);

  let minDate = dayjs().format('YYYY-MM-DD');
  let maxDate = dayjs().format('YYYY-MM-DD');
  console.log('obs list ',observationList);
  
  if (observationList.length == 1) {
    minDate = dayjs(observationList[0].obs_date).format('YYYY-MM-DD');
    maxDate = dayjs(observationList[0].obs_date).format('YYYY-MM-DD');
  } else if (observationList.length > 1) {
    
    // Loop through the observation list to find the minimum and maximum dates
    minDate = dayjs(observationList[0].obs_date).format('YYYY-MM-DD');
    maxDate = dayjs(observationList[0].obs_date).format('YYYY-MM-DD');

    for (let i = 1; i < observationList.length; i++) {
        const currentDate = dayjs(observationList[i].obs_date).format('YYYY-MM-DD');
        if (dayjs(currentDate).isBefore(minDate)) {
            minDate = currentDate;  // Update minDate if currentDate is earlier
        }
        if (dayjs(currentDate).isAfter(maxDate)) {
            maxDate = currentDate;  // Update maxDate if currentDate is later
        }
    }
    console.log('Min Date:', minDate);
    console.log('Max Date:', maxDate);
  }

  const fetchObservations = async () => {
    const url = `${OBSERVATION_LIST_URL}/?site_id=${observationDetails.site.gid}&recent=False`
    axios.get(url).then((response) => {
      if (response.data) {
          setObservationList(response.data as Observation[])
      }
    }).catch((error) => {
        console.log(error)
    })
  }

  useEffect(() => {
    if ((Array.isArray(observationDetails) && observationDetails.length > 0) ||
      (typeof observationDetails === 'object' && Object.keys(observationDetails).length > 0)) {
      fetchObservations();
    }
  }, [observationDetails]);

  const closeDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  const [observations, setObservations] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [imageTabIndex, setImageTabIndex] = useState<number>(0);
  const [siteDetails, setSiteDetails] = useState({});
  const [tabsData, setTabsData] = useState([]);
  const [imageTabsData, setImageTabsData] = useState({});
  const [isSiteDetailsOpen, setIsSiteDetailsOpen] = useState(true);
  const [isObservationDetailsOpen, setIsObservationDetailsOpen] = useState(true);
  const [isMeasurementsOpen, setIsMeasurementsOpen] = useState(true);

  const updateScoreDisplay = (riverCategory, score) => {
    if (riverCategory === 'sandy') {
      if (score > 6.8) {
        setTitleColor("text-blue-600");
        setProgressBarColor("blue");
        setRenderCrab(`${globalVariables.staticPath}crab_blue.svg`);
        setClassification('NATURAL');
      } else if (score > 5.8 && score <= 6.8) {
        setTitleColor("text-green-600");
        setProgressBarColor("green");
        setRenderCrab(`${globalVariables.staticPath}crab_green.svg`);
        setClassification('GOOD');
      } else if (score > 5.3 && score <= 5.8) {
        setTitleColor("text-orange-600");
        setProgressBarColor("orange");
        setRenderCrab(`${globalVariables.staticPath}crab_orange.svg`);
        setClassification('FAIR');
      } else if (score > 4.8 && score <= 5.3) {
        setTitleColor("text-red-600");
        setProgressBarColor("red");
        setRenderCrab(`${globalVariables.staticPath}crab_red.svg`);
        setClassification('POOR');
      } else if (score <= 4.8 && score !== '') {
        setTitleColor("text-purple-600");
        setProgressBarColor("purple");
        setRenderCrab(`${globalVariables.staticPath}crab_purple.svg`);
        setClassification('VERY POOR');
      } else {
        setTitleColor("text-purple-600");
        setProgressBarColor("purple");
        setRenderCrab(`${globalVariables.staticPath}crab_purple.svg`);
        setClassification('N/A');
      }
    } else {
      if (score > 7.2) {
        setTitleColor("text-blue-600");
        setProgressBarColor("blue");
        setRenderCrab(`${globalVariables.staticPath}crab_blue.svg`);
        setClassification('NATURAL');
      } else if (score > 6.1 && score <= 7.2) {
        setTitleColor("text-green-600");
        setProgressBarColor("green");
        setRenderCrab(`${globalVariables.staticPath}crab_green.svg`);
        setClassification('GOOD');
      } else if (score > 5.6 && score <= 6.1) {
        setTitleColor("text-orange-600");
        setProgressBarColor("orange");
        setRenderCrab(`${globalVariables.staticPath}crab_orange.svg`);
        setClassification('FAIR');
      } else if (score > 5.3 && score <= 5.6) {
        setTitleColor("text-red-600");
        setProgressBarColor("red");
        setRenderCrab(`${globalVariables.staticPath}crab_red.svg`);
        setClassification('POOR');
      } else if (score <= 5.3 && score !== '') {
        setTitleColor("text-purple-600");
        setProgressBarColor("purple");
        setRenderCrab(`${globalVariables.staticPath}crab_purple.svg`);
        setClassification('VERY POOR');
      } else {
        setTitleColor("text-purple-600");
        setProgressBarColor("purple");
        setRenderCrab(`${globalVariables.staticPath}crab_purple.svg`);
        setClassification('N/A');
      }
    }
  };

  useEffect(() => {
    if (siteWithObservations.observations && siteWithObservations.observations.length > 0) {
      setTabbedImages(observations);
    }
  }, [observations]);

  useEffect(() => {
    if (observationDetails.site && siteWithObservations.observations.length == 0) {
      setTabbedImages([observationDetails]);
    }
  }, [observationDetails]);

  useEffect(() => {
    setImageTabIndex(0);
  }, [activeTabIndex]);

  useEffect(() => {
    if (parseInt(observation_id) > 0 && openFromHomePage && Object.keys(observationDetails).length > 0) {
      updateTabs([observationDetails]);
    } else {
      if (siteWithObservations.observations && siteWithObservations.observations.length > 0) {
        updateTabs(observations)
      }
    }
  }, [imageTabsData, imageTabIndex]);

  const setTabbedImages = (observations) => {
    let imagesPerDate = {}
    observations.map((observation) => {
      const images = [].concat(observation.site.images, observation.images);
      let imagesPerPest = {};
      images.forEach((image) => {
        const key = image.pest_name ? image.pest_name : 'Site'
        if (Object.keys(imagesPerPest).includes(key)) {
          imagesPerPest[key].push(image)
        } else {
          imagesPerPest[key] = [image]
        }
      });

      let allImages = Object.keys(imagesPerPest).map((key, index) => ({
        id: `tab-image-${observation.obs_date}-${index + 1}`,
        label: key,
        content: (
          <div className="flex flex-row gap-2.5 items-start justify-start overflow-auto w-[566px] sm:w-full alabasta" style={{ marginTop: '10%' }}>
            {
              // Render images if there are any
              imagesPerPest[key].map((image, index) => (
                <img
                  key={`image_${index}`}
                  className="h-[152px] md:h-auto object-cover w-[164px]"
                  src={image.image}
                  alt={`img_${index}`}
                  loading='lazy'
                />
              ))
            }
          </div>
        )
      }));

      if (images.length === 0) {
        allImages = [{
          id: `tab-image-${observation.obs_date}-1`,
          label: 'Empty Image',
          content: (
            <div className="flex flex-row gap-2.5 items-start justify-start overflow-auto w-[566px] sm:w-full alabasta" style={{ marginTop: '10%' }}>
              {
                // Render placeholder if no images are available
                <img
                  className="h-[152px] md:h-auto object-cover w-[164px] alabasta"
                  src={`${globalVariables.staticPath}images_placeholder.png`}
                  alt="No Images Available"
                  loading='lazy'
                />
              }
            </div>
          )
        }]
      }

      imagesPerDate[observation.obs_date] = allImages
    })

    setImageTabsData(imagesPerDate);
  }

  const updateTabs = (observations) => {
    setTabsData(
      observations.map((observation, index) => ({
        id: `tab${index + 1}`,
        label: observation.obs_date,
        content: (
          <div className="flex flex-row gap-2.5 items-start justify-start overflow-auto w-[566px] sm:w-full" style={{ marginTop: '10%' }}>
            <TabbedContent
              tabsData={imageTabsData[observation.obs_date] ? imageTabsData[observation.obs_date] : []}
              activeTabIndex={imageTabIndex}
              onTabChange={(index) => {
                setImageTabIndex(index);
              }}
            />
          </div>
        )        
      }))
    );
  }

  const fetchObservation = async () => {
    try {
      const response = await axios.get(`${GET_OBSERVATION}`);
      
      if (response.status === 200) {
        setLoading(false);
        setObservationDetails(response.data);
        setSiteDetails({})
        setObservations([])
        
        setTimeout(() => {
          handleMapClick(response.data.latitude,response.data.longitude);
        }, 1200);

        updateScoreDisplay(response.data.site.river_cat, response.data.score);

      } else { }
    } catch (error) {
      console.log(error.message)
     }
  };

  useEffect(() => {
    if (parseInt(observation_id) > 0 && openFromHomePage) {
      fetchObservation();
    } else {
      if (siteWithObservations.observations && siteWithObservations.observations.length > 0) {
        setLoading(false);
        updateScoreDisplay(siteWithObservations.site.rivercategory, siteWithObservations.observations[0].score); // on intial load
        setObservationDetails(siteWithObservations.observations[0]); // on intial load
        setObservationList(siteWithObservations.observations)

        setObservations(siteWithObservations.observations)
        setSiteDetails(siteWithObservations.site)
      } 
    }
  }, [observation_id, siteWithObservations]);

  const toggleSiteDetails = () => {
    setIsSiteDetailsOpen(!isSiteDetailsOpen);
  };

  const toggleObservationDetails = () => {
    setIsObservationDetailsOpen(!isObservationDetailsOpen);
  };

  const toggleMeasurements = () => {
    setIsMeasurementsOpen(!isMeasurementsOpen);
  };


  return (
    <div className={classname}
    style={{
        height: '75vh',
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
          src={`${globalVariables.staticPath}img_mdidownloadcircleoutline.svg`}
          alt="mdidownloadcirc"
          onClick={() => {setIsDownloadModalOpen(true)}}
        />
         <DownloadObservationForm
           isOpen={isDownloadModalOpen}
           onClose={closeDownloadModal}
           siteId={observationDetails.site?.gid}
           dateRange={[minDate, maxDate]}
         />
          <Img
          className="h-6 w-6"
          src={`${globalVariables.staticPath}mdi_chart.svg`}
          alt="mdichartimg"
          onClick={() => {setIsChartHidden(!isChartHidden)}}
        />
      </div>
      <Img
        className="h-6 w-6"
        src={`${globalVariables.staticPath}img_icbaselineclose.svg`}
        alt="icbaselineclose"
        onClick={handleCloseSidebar}
      />
    </div>
    <div style={{width: '100%'}}>
      <LineChart
         data={observationList.map((obs) => obs.score)}
         labels={observationList.map((obs) => obs.obs_date)}
         xLabel={'Date'}
         yLabel={'Average Score'}
         hidden={isChartHidden}
       />
    </div>

    {loading ? (
        <div style={{
          marginLeft:'10px',
          width: '100%',
          maxWidth: '350px',
        }}><LinearProgress color="success" /></div>
      ) : (
    <>
      <TabbedContent
        tabsData={tabsData}
        activeTabIndex={activeTabIndex}
        onTabChange={(index) => {
          // update variables to reflect changes
          updateScoreDisplay(observations[index].site.river_cat, observations[index].score);
          setObservationDetails(observations[index])
          setActiveTabIndex(index);
        }}
      />
      <div className="flex flex-col gap-6 h-[543px] md:h-auto items-start justify-start w-full">
            <div className="flex flex-row gap-1 items-center justify-start pt-2 w-full">
              <Text
                className={`${titleColor} text-lg w-[140px]`}
                size="txtRalewayBold18"
              >
                Average score:
              </Text>
              <div className="flex flex-row gap-2.5 items-center justify-start w-auto" style={{ marginLeft: '50%' }}>
                <div className="h-[68px] relative w-[68px]">
                  <div className="h-[68px] m-auto w-[68px]">

                    <div
                      className={`!w-[68px] border-solid h-[68px] m-auto overflow-visible bg-${progressBarColor}`}
                    >
                      <CircularProgressbar
                        className={`!w-[68px] border-solid h-[68px] m-auto overflow-visible ${progressBarColor}`}
                        value={parseFloat(observationDetails.score !== undefined && observationDetails.score !== null
                          ? observationDetails.score
                          : (siteWithObservations.observations.length > 0
                            ? siteWithObservations.observations[0].score
                            : '0')) * 10}
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
                      alt="rendercrab" />
                  </div>
                  <Text
                    className={`${titleColor} absolute bottom-[18%] inset-x-[0] mx-auto text-base w-max`}
                    size="txtRalewayRomanSemiBold16"
                  >
                    {observationDetails.score !== undefined && observationDetails.score !== null
                    ? observationDetails.score
                    : (siteWithObservations.observations.length > 0
                      ? siteWithObservations.observations[0].score
                      : '0')}
                  </Text>
                </div>
                <Text
                  className={`${titleColor} text-base w-auto`}
                  size="txtRalewayRomanSemiBold16"
                >
                  {classification}
                </Text>
              </div>
            </div>
            {/* collapsible dropdowns */}
            <div className="flex flex-col gap-3 items-start justify-start w-auto sm:w-full">
              <div className="flex items-center gap-3">
                  <Text
                    className="text-blue-900 text-lg w-auto"
                    size="txtRalewayBold18Blue900"
                  >
                    Site Details
                  </Text>
                  <button onClick={toggleSiteDetails} className="focus:outline-none">
                    {isSiteDetailsOpen ? <FaAngleDown /> : <FaAngleUp />}
                  </button>
              </div>
              {isSiteDetailsOpen && (
                <><div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
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
                      {observationDetails.rivername ? observationDetails.rivername : siteDetails.river_name}
                    </Text>
                  </div><div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
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
                        {observationDetails.sitename ? observationDetails.sitename : siteDetails.site_name}
                      </Text>
                    </div>
                   <div className="flex sm:flex-col flex-row gap-3 h-[75px] md:h-auto items-start justify-between w-[541px] sm:w-full" style={{ marginTop: '3%' }}>
                    <Text
                      className="text-gray-800_01 text-lg tracking-[0.15px] w-auto self-end"
                      size="txtRalewayRomanRegular18"
                    >
                      Site description:
                    </Text>
                    <div className="overflow-y-auto max-h-[75px] md:max-h-[unset] max-w-[250px] md:max-w-full">
                      <Text
                        className="leading-[24.00px] text-gray-800_01 text-lg tracking-[0.15px] self-end text-right"
                        size="txtRalewayRomanRegular18"
                      >
                        {observationDetails.sitedescription ? observationDetails.sitedescription : siteDetails.description}
                      </Text>
                    </div>
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
                        {observationDetails.latitude !== undefined && observationDetails.latitude !== null
                          ? observationDetails.latitude
                          : (siteWithObservations.observations.length > 0
                            ? siteWithObservations.observations[0].latitude
                            : '0')}
                      </Text>
                    </div><div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
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
                        {observationDetails.longitude !== undefined && observationDetails.longitude !== null
                          ? observationDetails.longitude
                          : (siteWithObservations.observations.length > 0
                            ? siteWithObservations.observations[0].longitude
                            : '0')}
                      </Text>
                    </div><div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
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
                        {observationDetails.rivercategory ? observationDetails.rivercategory : siteDetails.river_cat}
                      </Text>
                    </div></>
              )}
            </div>

            <div className="flex flex-col gap-3 items-start justify-start w-auto sm:w-full">
              <div className="flex items-center gap-3">
                <Text
                  className="text-blue-900 text-lg w-auto"
                  size="txtRalewayBold18Blue900"
                >
                  Observation details
                </Text>
                <button onClick={toggleObservationDetails} className="focus:outline-none">
                    {isObservationDetailsOpen ? <FaAngleDown /> : <FaAngleUp />}
                </button>
              </div>

              {isObservationDetailsOpen && (
                <><div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
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
                      {observationDetails.obs_date !== undefined && observationDetails.obs_date !== null
                        ? observationDetails.obs_date
                        : (siteWithObservations.observations.length > 0
                          ? siteWithObservations.observations[0].obs_date
                          : 'dd/mm/yyyy')}
                    </Text>
                  </div><div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
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
                        {observationDetails.collectorsname !== undefined && observationDetails.collectorsname !== null
                          ? observationDetails.collectorsname
                          : (siteWithObservations.observations.length > 0
                            ? siteWithObservations.observations[0].collectorsname
                            : '')}
                      </Text>
                    </div><div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
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
                        {observationDetails.organisationtype !== undefined && observationDetails.organisationtype !== null
                          ? observationDetails.organisationtype.description
                          : (siteWithObservations.observations.length > 0
                            ? siteWithObservations.observations[0].organisationtype.description
                            : 'N/A')}
                      </Text>
                    </div></>
              )}

            <div className="flex flex-col gap-3 items-start justify-start w-auto sm:w-full">
              <div className="flex items-center gap-3">
                <Text
                  className="text-blue-900 text-lg w-auto"
                  size="txtRalewayBold18Blue900"
                >
                  Measurements
                </Text>
                <button onClick={toggleMeasurements} className="focus:outline-none">
                    {isMeasurementsOpen ? <FaAngleDown /> : <FaAngleUp />}
                </button>
              </div>


              {isMeasurementsOpen && (
                <><div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
                      <Text
                        className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
                        size="txtRalewayRomanRegular18"
                      >
                        Water Clarity:
                      </Text>
                      <Text
                        className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
                        size="txtRalewayRomanRegular18"
                      >
                        {observationDetails.water_clarity !== undefined &&
                          (
                            (parseFloat(observationDetails.water_clarity) !== 999 && parseFloat(observationDetails.water_clarity) !== -9999)
                              ? observationDetails.water_clarity
                              : (
                                siteWithObservations.observations.length > 0
                                  ? (
                                    (
                                      parseFloat(siteWithObservations.observations[0].water_clarity) !== 999 &&
                                      parseFloat(siteWithObservations.observations[0].water_clarity) !== -9999
                                    )
                                      ? siteWithObservations.observations[0].water_clarity
                                      : 'N/A'
                                  )
                                  : 'N/A'
                              )
                          )}

                      </Text>
                    </div>
                    <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
                        <Text
                          className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
                          size="txtRalewayRomanRegular18"
                        >
                          Water Temperature:
                        </Text>
                        <Text
                          className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
                          size="txtRalewayRomanRegular18"
                        >
                          {observationDetails.water_temp !== undefined &&
                            (
                              (parseFloat(observationDetails.water_temp) !== 999 && parseFloat(observationDetails.water_temp) !== -9999)
                                ? observationDetails.water_temp
                                : (
                                  siteWithObservations.observations.length > 0
                                    ? (
                                      (
                                        parseFloat(siteWithObservations.observations[0].water_temp) !== 999 &&
                                        parseFloat(siteWithObservations.observations[0].water_temp) !== -9999
                                      )
                                        ? siteWithObservations.observations[0].water_temp
                                        : 'N/A'
                                    )
                                    : 'N/A'
                                )
                            )
                          }

                        </Text>
                      </div>

                      <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
                        <Text
                          className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
                          size="txtRalewayRomanRegular18"
                        >
                          pH:
                        </Text>
                        <Text
                          className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
                          size="txtRalewayRomanRegular18"
                        >
                        {observationDetails.ph !== undefined &&
                          (
                            (parseFloat(observationDetails.ph) !== 999 && parseFloat(observationDetails.ph) !== -9999)
                              ? observationDetails.ph
                              : (
                                siteWithObservations.observations.length > 0
                                  ? (
                                    (
                                      parseFloat(siteWithObservations.observations[0].ph) !== 999 &&
                                      parseFloat(siteWithObservations.observations[0].ph) !== -9999
                                    )
                                      ? siteWithObservations.observations[0].ph
                                      : 'N/A'
                                  )
                                  : 'N/A'
                              )
                          )
                        }
                        </Text>
                      </div>

                      <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
                        <Text
                          className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
                          size="txtRalewayRomanRegular18"
                        >
                          Dissolved Oxygen:
                        </Text>
                        <Text
                          className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
                          size="txtRalewayRomanRegular18"
                        >
                          {observationDetails.diss_oxygen !== undefined &&
                            (
                              (parseFloat(observationDetails.diss_oxygen) !== 999 && parseFloat(observationDetails.diss_oxygen) !== -9999)
                                ? observationDetails.diss_oxygen + ' ' + observationDetails.diss_oxygen_unit
                                : (
                                  siteWithObservations.observations.length > 0
                                    ? (
                                      (
                                        parseFloat(siteWithObservations.observations[0].diss_oxygen) !== 999 &&
                                        parseFloat(siteWithObservations.observations[0].diss_oxygen) !== -9999
                                      )
                                        ? siteWithObservations.observations[0].diss_oxygen + ' ' + siteWithObservations.observations[0].diss_oxygen_unit
                                        : 'N/A'
                                    )
                                    : 'N/A'
                                )
                            )}

                        </Text>
                      </div>

                      <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
                        <Text
                          className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
                          size="txtRalewayRomanRegular18"
                        >
                          Electrical Conductivity:
                        </Text>
                        <Text
                          className="text-gray-800_01 text-lg tracking-[0.15px] w-auto"
                          size="txtRalewayRomanRegular18"
                        >
                          {observationDetails.elec_cond !== undefined &&
                            (
                              (parseFloat(observationDetails.elec_cond) !== 999 && parseFloat(observationDetails.elec_cond) !== -9999)
                                ? observationDetails.elec_cond + ' ' + observationDetails.elec_cond_unit
                                : (
                                  siteWithObservations.observations.length > 0
                                    ? (
                                      (
                                        parseFloat(siteWithObservations.observations[0].elec_cond) !== 999 &&
                                        parseFloat(siteWithObservations.observations[0].elec_cond) !== -9999
                                      )
                                        ? siteWithObservations.observations[0].elec_cond + ' ' + siteWithObservations.observations[0].elec_cond_unit
                                        : 'N/A'
                                    )
                                    : 'N/A'
                                )
                            )}

                        </Text>
                      </div>
                      
                    </>
              )}
            </div>
            </div>
          </div></>
          )}
  </div>
  );
};

export default ObservationDetails;
