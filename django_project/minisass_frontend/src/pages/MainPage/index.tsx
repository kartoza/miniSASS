import React, { useState, useEffect } from "react";
import { HashLink } from 'react-router-hash-link';

import { useLocation, useNavigate } from "react-router-dom";

import { Button, Img, List, Text } from "../../components";
import Footer from "../../components/Footer";
import Observations from "../../components/Observations";
import Blogs from "../../components/Blogs";
import NavigationBar from "../../components/NavigationBar";
import Slideshow from "../../components/SlideShow";
import axios from "axios"
import UploadModal from "../../components/UploadFormModal";
import { globalVariables } from "../../utils";
import Modal from 'react-modal';
import Typography from '@mui/material/Typography';
import './index.css'

import "react-circular-progressbar/dist/styles.css";
import YouTubeVideo from "../../components/YoutubeEmbedded";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [blogsCurrentIndex, setBlogsCurrentIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [observations, setObservations] = useState([]);
  const ObservationsPropList = [];
  const [activationComplete, setActivationComplete] = useState(false);
  const [activationMessage, setActivationMessage] = useState('');
  const [observationPerPage, setObservationPerPage] = useState(5);


  const urlParams = new URLSearchParams(window.location.search);

  const FETCH_RECENT_OBSERVATIONS = globalVariables.baseUrl + '/monitor/observations/recent-observations/';

    useEffect(() => {
        const fetchHomePageData = (retryCount = 0) => {
            axios
                .get(
                    `${FETCH_RECENT_OBSERVATIONS}`
                )
                .then((response) => {
                    if (response.data) {

                        // Iterate through the response data and structure it as required by observations component
                        response.data.forEach((item) => {
                          // Convert the timestamp to a JavaScript Date object
                          const timestampDate = new Date(item.time_stamp);
                        
                          // Define an array of month names
                          const monthNames = [
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                          ];
                        
                          // Format the date
                          const formattedDate = `${timestampDate.getDate()} ${monthNames[timestampDate.getMonth()]} ${timestampDate.getFullYear()}`;
                        
                          const structuredItem = {
                            observation: item.observation,
                            usernamejimtaylOne: `Username: ${item.username}`,
                            userimage: "",
                            username: item.site,
                            score1: item.score,
                            score: item.score,
                            organisation: `Organisation: ${item.organisation}`,
                            dateadded: `Date added: ${formattedDate}`
                          };
                          ObservationsPropList.push(structuredItem);
                        });
                        setObservations(ObservationsPropList)
                    } else {
                        if (retryCount < 3) {
                          setTimeout(() => {
                            fetchHomePageData(retryCount+1);
                          }, 3000);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        };

        const uidParam = urlParams.get('uid');
        const tokenParam = urlParams.get('token');

        const activation_complete  = urlParams.get('activation_complete');

        if (activation_complete) {
          setActivationComplete(true);
          setActivationMessage('Your registration is complete. Please proceed to log in')
        }
    
        if (uidParam && tokenParam) {
          const pageName = `/password-reset?uid=${uidParam}&token=${tokenParam}`;
          navigate(pageName);
        } 

        fetchHomePageData();
    }, []);

  //choose the screen size
  const handleResize = () => {
    if (window.innerWidth > 1050 && window.innerWidth < 1200) {
      setObservationPerPage(3);
    } else if (window.innerWidth > 1200 && window.innerWidth < 1536) {
      setObservationPerPage(4);
    } else {
      setObservationPerPage(5)
    }
  };

  // create an event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
  });

  // handle advancing to the next set of observations
  const handleNextObservations = () => {
    const nextIndex = (currentIndex + 5) % observations.length;
    setCurrentIndex(nextIndex);
  };

  const handlePrevObservations = () => {
    // Calculate the previous index to display
    let prevIndex = currentIndex - 5;
    if (prevIndex < 0) {
      prevIndex = observations.length - (observations.length % 5);
    }
    setCurrentIndex(prevIndex);
  };


    const BlogsPropList = [
      {
        tue07jan2020: "Thu, 23 May 2019 12:25 by miniSASS Team",
        newslettertext: (
          <>
            MINISASS NEWSLETTER <br />
            OCTOBER 2018
          </>
        ),
        newsletterdescription: "",
        link: "https://minisassblog.wordpress.com/2019/05/23/527/"
      },
      {
        tue07jan2020: "Tue, 11 Oct 2016 11:53 by miniSASS Team",
        newslettertext: "MINISASS NEWSLETTER September 2016",
        link: "https://minisassblog.wordpress.com/2016/10/11/minisass-newsletter-september-2016/"
      },
      {
        tue07jan2020: "Thu, 30 Jun 2016 11:47 by miniSASS Team",
        newslettertext: (
          <>
            Mandela Day <br />
            18 July 2016
          </>
        ),
        link: "https://minisassblog.wordpress.com/2016/06/30/mandela-day-18-july-2016/"
      },
      {
        tue07jan2020: "Tue, 14 Jun 2016 09:25 by miniSASS Team",
        newslettertext: (
          <>
            miniSASS Newsletter: National Water Week Edition
          </>
        ),
        link: "https://minisassblog.wordpress.com/2016/06/14/minisass-newsletter-national-water-week-edition/"
      },
      {
        tue07jan2020: "Tue, 15 March 2016 08:20 by miniSASS Team",
        newslettertext: (
          <>
            miniSASS Newsletter March 2016 <br />
            MARCH 2016
          </>
        ),
        link: "https://minisassblog.wordpress.com/2016/03/15/minisass-newsletter-march-2016/"
      },
      {
        tue07jan2020: "Tue, 08 March 2016 13:39 by miniSASS Team",
        newslettertext: (
          <>
            National Water Week miniSASS competition 2016 
          </>
        ),
        link: "https://minisassblog.wordpress.com/2016/03/08/national-water-week-minisass-competition-2016/"
      },
      {
        tue07jan2020: "Fri, 31 July 2015 07:26 by miniSASS Team",
        newslettertext: (
          <>
            miniSASS Newsletter July 2015
          </>
        ),
        link: "https://minisassblog.wordpress.com/2015/07/31/minisass-newsletter-july-2015-2/"
      },
      {
        tue07jan2020: "Thu, 08 Jan 2015 13:26 by miniSASS Team",
        newslettertext: (
          <>
            YOUNG WATER AMBASSADORS USE MINISASS TO IDENTIFY SEWAGE POLLUTION IN  IN THE SWARTSPRUIT (RIETFONTEIN)!!
          </>
        ),
        link: "https://minisassblog.wordpress.com/2015/01/08/young-water-ambassadors-use-minisass-to-identify-sewage-pollution-in-the-swartspruit-rietfontein/"
      },
    ];


    const handleNextBlogs = () => {
      const nextIndex = (blogsCurrentIndex + 3) % BlogsPropList.length;
      setBlogsCurrentIndex(nextIndex);
    };

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const openUploadModal = () => {
      setIsUploadModalOpen(true);
    };

    const closeUploadModal = () => {
      setIsUploadModalOpen(false);
    };

    const closeActivationModal = () => {
      setActivationComplete(false)
      window.location.href = "/"
    }


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
            {/* end of section */}

            {/* slideshow placeholder */}
            <Slideshow />
            

          </div>

        {/* more links section */}
          <List
            className="md:flex sm:flex-col flex-row gap-5 grid sm:grid-cols-1
            md:grid-cols-2 grid-cols-4 h-32 justify-center max-w-[1450px]
            mt-1 mx-auto sm:overflow-auto md:overflow-x-auto md:px-5
            relative md:top-[170px] sm:top-[190px] top-[50px] w-full
            sm:h-auto sm:h-auto sm:mt-[200px] md:mt-[200px]"
            orientation="horizontal"
          >
            <div
              className="common-pointer h-full relative w-full"
              onClick={() => navigate("/map")}
            >
              <div className="flex h-24 md:h-28 justify-end mt-auto mx-auto w-full">
                <div className="bg-blue_gray-500 sm:bottom-[] h-28 mt-auto mx-auto relative rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:top-[] w-full"></div>
                <div className="absolute bottom-[13%] flex flex-col inset-x-[0] items-center justify-start mx-auto w-[51%]">
                  <Img
                    className="bottom-5 h-8 relative w-8"
                    src={`${globalVariables.staticPath}img_bxmapalt.svg`}
                    alt="bxmapalt"
                  />
                  <Text
                    className="bottom-5 mt-1 relative text-center text-sm text-white-A700 tracking-[0.98px] uppercase w-auto"
                    size="txtRalewayExtraBold14WhiteA700"
                  >
                    Explore the map
                  </Text>
                </div>
              </div>
              <Img
                className="absolute h-[72px] right-[0] top-[0] w-[72px]"
                src={`${globalVariables.staticPath}img_notov1crab.svg`}
                alt="crab_placeholder"
              />
            </div>
            <div
              className="common-pointer h-full relative w-full"
              onClick={() => navigate("/howto")}
            >
              <div className="flex h-24 md:h-28 justify-end mt-auto mx-auto w-full">
                <div className="bg-blue_gray-500 sm:bottom-[] h-28 mt-auto mx-auto relative rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:top-[] w-full"></div>
                  <div className="absolute bottom-[30%] flex flex-col inset-x-[0] items-center justify-start mx-auto w-[51%]">
                  <Img
                    className="h-8 relative w-8"
                    src={`${globalVariables.staticPath}img_bxbookreader.svg`}
                    alt="bxbookreader"
                  />
                  <Text
                    className="mt-1 text-center text-sm text-white-A700 tracking-[0.98px] uppercase w-auto"
                    size="txtRalewayExtraBold14WhiteA700"
                  >
                    How to do miniSASS
                  </Text>
                </div>
              </div>
              <Img
                className="absolute bottom-[0] h-[72px] left-[0] w-[72px]"
                src={`${globalVariables.staticPath}img_notov1crab_blue_gray_100.svg`}
                alt="crab_placeholder"
              />
            </div>
            <div
              className="common-pointer h-full relative w-full"
              onClick={() => navigate("/map?open_add_record=1")}
            >
              <div className="flex h-24 md:h-28 justify-end mt-auto mx-auto w-full">
                <div className="bg-blue_gray-500 h-28 mt-auto mx-auto relative rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-full"></div>
                <div className="absolute bottom-[13%] flex flex-col inset-x-[0] items-center justify-start mx-auto w-[47%]">
                  <Img
                    className="bottom-5 h-8 relative w-8"
                    src={`${globalVariables.staticPath}img_bxbong.svg`}
                    alt="bxbong"
                  />
                  <Text
                    className="bottom-5 mt-1 relative text-center text-sm text-white-A700 tracking-[0.98px] uppercase w-auto"
                    size="txtRalewayExtraBold14WhiteA700"
                  >
                    Submit results
                  </Text>
                </div>
              </div>
              <Img
                className="absolute h-[72px] left-[0] top-[0] w-[72px]"
                src={`${globalVariables.staticPath}img_notov1crab_blue_gray_100_72x72.svg`}
                alt="crab_placeholder"
              />
            </div>
            <div
              className="common-pointer h-full relative w-full"
            >
              <div className="md:h-28 h-[110px] m-auto w-full">
                <div className="bg-blue_gray-500 h-28 m-auto rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-full"></div>
                <div className="absolute bottom-[10%] flex flex-col inset-x-[0] items-center justify-start mx-auto w-[47%]">
                  <Img
                    className="h-8 w-8"
                    src={`${globalVariables.staticPath}img_bxclouddownload.svg`}
                    alt="bxclouddownload"
                  />
                    <HashLink to="/howto#minisass-video">
                      <Text
                        className="mt-1 text-center text-sm text-white-A700 tracking-[0.98px] uppercase w-auto"
                        size="txtRalewayExtraBold14WhiteA700"
                      >
                        Resources
                      </Text>
                    </HashLink>;
                </div>
              </div>
              <Img
                className="absolute h-[72px] right-[0] top-[0] w-[72px]"
                src={`${globalVariables.staticPath}img_notov1crab_blue_gray_100_72x46.svg`}
                alt="crab_placeholder"
              />
            </div>
          </List>

          <UploadModal isOpen={isUploadModalOpen} onClose={closeUploadModal} onSubmit={null} />

          <div className="flex flex-col mt-[86px]">
            <div>
              <Text
                className="flex-1 sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-auto"
                size="txtRalewayRomanBold40"
              >
                What is miniSASS?
              </Text>
            </div>
            <div className="flex flex-row sm:flex-col md:flex-col gap-5 md:grid items-center justify-start max-w-[1450px] mx-auto md:px-5 relative md:top-20 sm:top-[130px] w-full">
              <div
                className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-[50%] sm:w-full"
              >
                <YouTubeVideo videoId="hRgO80-427w" width="500px" height="300px" playButtonColor="green" />
              </div>
              <div className="w-[75%] sm:w-full md:w-full">
                <Text
                className="md:h-auto leading-[136.40%] text-xl tracking-[0.40px] md:overflow-auto sm:overflow-scroll text-base text-gray-800"
                size="txtRalewayRomanSemiBold20"
              >
                The mini stream assessment scoring system (miniSASS) simple and accessible citizen science tool for
                  monitoring the water quality and health of stream and river systems. You collect a sample
                  of aquatic macroinvertebrates (small, but large enough to see animals with no internal skeletons)
                  from a site in a stream or river. The community of these aquatic macroinvertebrates present then
                  tells you about the water quality and health of the stream or river based on the concept that
                  different groups of aquatic macroinvertebrates have different tolerances and sensitivities to
                  disturbance and pollution.
              </Text>
              </div>
            </div>
          </div>
          {/* end of section */}

          {/* obeservations and map section */}
          <div className="flex flex-col md:gap-10 gap-28 items-center justify-start w-full sm:mt-[150px] md:mt-[150px] mt-[50px] recent-observations">
             {/* observations */}
             <div className="flex flex-col gap-[58px] items-start justify-start max-w-[1450px] mx-auto md:px-5 relative sm:top-[45px] w-full">
              <div className="sm:bottom-[] flex sm:flex-col flex-row md:gap-10 items-center justify-between max-w-[1450px] sm:relative sm:top-[50px] w-full">
                <Text
                  className="flex-1 sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-auto"
                  size="txtRalewayRomanBold40"
                >
                  Recent Observations
                </Text>
                {currentIndex > 0 && ( // Hide left arrow if at the beginning
                  <Button
                    className="flex h-10 sm:hidden items-center justify-center rounded-[5px] w-10"
                    color="blue_gray_500"
                    size="sm"
                    variant="fill"
                    onClick={handlePrevObservations}
                    style={{
                      marginRight: '1%'
                    }}
                  >
                    <Img src={`${globalVariables.staticPath}img_arrowleft.svg`} alt="arrowleft" />
                  </Button>
                )}
                {currentIndex + 5 < observations.length && ( // Hide right arrow if at the end
                  <Button
                    className="flex h-10 sm:hidden items-center justify-center rounded-[5px] w-10"
                    color="blue_gray_500"
                    size="sm"
                    variant="fill"
                    onClick={handleNextObservations}
                  >
                    <Img src={`${globalVariables.staticPath}img_arrowright.svg`} alt="arrowright" />
                  </Button>
                )}
              </div>
              <List
                className="flex-col sm:flex-row gap-3 grid sm:grid-cols-1 md:grid-cols-2 grid-cols-5 sm:h-[50vh]
                items-baseline justify-around overflow-auto relative w-auto md:w-full
                recent-observations-list"
                orientation="horizontal"
              >
                {observations.slice(currentIndex, currentIndex + observationPerPage).map((props, index) => (
                  <React.Fragment key={`DesktopThreeColumnscore${index}`}>
                    <Observations
                      className="border border-blue_gray-100 border-solid flex flex-col gap-2 h-[265px] md:h-auto
                      items-start justify-between sm:px-5 px-6 py-5 rounded-bl-[25px] rounded-br-[25px]
                      rounded-tr-[25px] w-[280px] sm:w-full md:w-full"
                      {...props}
                    />
                  </React.Fragment>
                ))}
              </List>
            </div>

            {/* map */}
            <div className="bg-blue-900 flex flex-col items-start justify-start max-w-full mt-28 pl-[53px] pr-[134px] md:px-10 sm:px-5 py-[103px] w-full">
              <div className="flex md:flex-col flex-row md:gap-10 gap-[89px] items-center justify-start max-w-[1350px] mx-auto w-full">
                <Img
                  className="md:flex-1 h-[280px] sm:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tl-[25px] w-[303px] md:w-full"
                  src={`${globalVariables.staticPath}img_rectangle6.png`}
                  alt="rectangleSix"
                />
                <div className="flex md:flex-1 flex-col items-start justify-start w-[67%] md:w-full">
                  <Text
                    className="sm:text-4xl md:text-[38px] text-[40px] text-white-A700 w-auto"
                    size="txtRalewayRomanBold40WhiteA700"
                  >
                    miniSASS Map
                  </Text>
                  <Text
                    className="leading-[136.40%] mt-8 text-white-A700 text-xl w-full"
                    size="txtRalewayRomanRegular20"
                  >
                    <span className="text-white-A700 font-raleway text-left font-normal">
                      The most important feature of the new website is the
                      miniSASS{" "}
                    </span>
                    <a
                      href="javascript:"
                      className="text-white-A700 font-raleway text-left font-normal underline"
                    >
                      Map
                    </a>
                    <span className="text-white-A700 font-raleway text-left font-normal">
                      , which allows you to explore your catchment, find your
                      river, look at any existing miniSASS results and then upload
                      your own miniSASS results! The map also lets you explore
                      your catchment to see the land uses and activites that might
                      be improving or worsening water quality.
                    </span>
                  </Text>
                  <Button
                    className="cursor-pointer flex items-center justify-center min-w-[200px] mt-9"
                    rightIcon={
                      <Img
                        className="h-[18px] mt-px mb-[3px] ml-2.5"
                        src={`${globalVariables.staticPath}img_arrowright_white_a700.svg`}
                        alt="arrow_right"
                      />
                    }
                    shape="round"
                    color="blue_gray_500"
                    size="sm"
                    variant="fill"
                  >
                    <div className="text-left text-lg tracking-[0.81px]" onClick={() => navigate("/map")}>
                      See the map
                    </div>
                  </Button>
                </div>
              </div>
            </div>


          </div>
          {/* end of section */}



          {/* As per ticket #432, newsletter section for now.  */}

          {/*/!* articles and blogs section *!/*/}
          {/*<div className="flex flex-col gap-[58px] items-center justify-start max-w-[1450px] mt-28 mx-auto md:px-5 w-full">*/}
          {/*  <div className="flex flex-row md:gap-10 items-center justify-between max-w-[1450px] w-full">*/}
          {/*    <Text*/}
          {/*      className="flex-1 sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-auto"*/}
          {/*      size="txtRalewayRomanBold40"*/}
          {/*    >*/}
          {/*      Latest Articles*/}
          {/*    </Text>*/}
          {/*    <Button*/}
          {/*      className="flex h-10 items-center justify-center rounded-[5px] w-10"*/}
          {/*      color="blue_gray_500"*/}
          {/*      size="sm"*/}
          {/*      variant="fill"*/}
          {/*      onClick={handleNextBlogs}*/}
          {/*    >*/}
          {/*      <Img src={`${globalVariables.staticPath}img_arrowright.svg`} alt="arrowright_One" />*/}
          {/*    </Button>*/}
          {/*  </div>*/}

          {/*  /!* blogs *!/*/}
          {/*  <div className="flex flex-col gap-8 sm:h-[50vh] items-start justify-start sm:overflow-auto w-auto md:w-full" style={{marginLeft:'-18%'}}>*/}
          {/*    <div className="flex md:flex-col flex-row gap-[23px] items-start justify-start w-auto md:w-full">*/}
          {/*      <Img*/}
          {/*        className="h-[406px] sm:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-[780px] md:w-full"*/}
          {/*        src={`${globalVariables.staticPath}img_rectangle18.png`}*/}
          {/*        alt="rectangleEighteen"*/}
          {/*      />*/}
          {/*      <Blogs className="flex flex-col gap-4 items-start justify-start w-auto" />*/}
          {/*    </div>*/}
          {/*    <List*/}
          {/*      className="sm:flex-col flex-row gap-8 grid sm:grid-cols-1 md:grid-cols-2 grid-cols-3 justify-start w-auto md:w-full"*/}
          {/*      orientation="horizontal"*/}
          {/*    >*/}
          {/*      {BlogsPropList.slice(blogsCurrentIndex, blogsCurrentIndex + 3).map((props, index) => (*/}
          {/*        <React.Fragment key={`DesktopThreeBloggriditem${index}`}>*/}
          {/*          <Blogs*/}
          {/*            className="flex flex-col gap-4 items-start justify-start w-auto"*/}
          {/*            {...props}*/}
          {/*          />*/}
          {/*        </React.Fragment>*/}
          {/*      ))}*/}
          {/*    </List>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*/!* end of section *!/*/}

          <Footer className="flex items-center justify-center mt-28 md:px-5 w-full" />
        </div>
      </div>
      <Modal
        isOpen={activationComplete}
        onRequestClose={closeActivationModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '500px',
            background: 'white',
            border: 'none',
            borderRadius: '0px 25px 25px 25px',
          },
        }}
      >
      {activationComplete && (
        <div>
        <h3
            style={{
              fontFamily: 'Raleway',
              fontStyle: 'normal',
              fontWeight: 700,
              alignItems: 'flex-start',
              fontSize: '24px',
              lineHeight: '136.4%',
              color: '#539987',
            }}
          >
            Registration successful
          </h3>
          <br />
        <Typography>
          You have been successfully registered. Please proceed with logging in.
        </Typography>

        <Button
            className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
            color="blue_gray_500"
            size="xs"
            variant="fill"
            style={{ marginLeft: "65%" }}
            onClick={closeActivationModal}
          >
            Ok
          </Button>
      </div>
      )}
      </Modal>
    </>
  );
};

export default Home;
