import React, { useState, useEffect } from "react";


import { useNavigate } from "react-router-dom";

import { Button, Img, List, Text } from "../../components";
import Footer from "../../components/Footer";
import Observations from "../../components/Observations";
import Blogs from "../../components/Blogs";
import NavigationBar from "../../components/NavigationBar";
import Slideshow from "../../components/SlideShow";
import axios from "axios"

import "react-circular-progressbar/dist/styles.css";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [blogsCurrentIndex, setBlogsCurrentIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [observations, setObservations] = useState([]);
  const ObservationsPropList = [];


  const FETCH_RECENT_OBSERVATIONS = `${window.location.href}api/observations/`;


    useEffect(() => {
        const fetchHomePageData = () => {
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
                            usernamejimtaylOne: `Username: ${item.username}`,
                            userimage: "",
                            username: item.site,
                            score1: JSON.stringify(item.score),
                            organisation: `Organisation: ${item.organisation}`,
                            dateadded: `Date added: ${formattedDate}`
                          };
                          ObservationsPropList.push(structuredItem);
                        });
                        setObservations(ObservationsPropList)
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        };

        fetchHomePageData();
    }, []);


  // Function to handle advancing to the next set of observations
  const handleNextObservations = () => {
    // Calculate the next index to display (looping back to 0 if necessary)
    const nextIndex = (currentIndex + 4) % observations.length;
    setCurrentIndex(nextIndex);
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
      <div className="bg-white-A700 flex flex-col font-raleway items-center justify-start mx-auto pb-[5px] w-full">
        <div className="flex flex-col items-center justify-start w-full">
          <div className="h-[537px] md:px-5 relative w-full">

            {/* header section */}
            <div className="bg-white-A700 flex flex-col items-center justify-start mb-[-53px] mx-auto pb-[17px] pl-[17px] rounded-bl-[65px] w-full z-[1]">
              <div className="flex flex-col items-center justify-start w-[98%] md:w-full">
                <div className="flex md:flex-col flex-row gap-[30px] items-start justify-between w-full">

                  {/* minisass logo */}
                  <div className="bg-white-A700 flex flex-col h-[92px] md:h-auto items-start justify-start md:mt-0 mt-[17px] w-[77px]">
                    <Img
                      className="sm:bottom-[] md:h-auto h-full object-cover md:relative sm:right-[30px] sm:top-2.5 md:top-5 w-full"
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
            {/* end of section */}

            {/* slideshow placeholder */}
            <Slideshow />
            

          </div>

          {/* more links section */}
          <List
            className="md:flex sm:flex-col flex-row gap-5 grid sm:grid-cols-1 md:grid-cols-2 grid-cols-4 h-32 justify-center max-w-[1179px] mt-1 mx-auto sm:overflow-auto md:overflow-x-auto md:px-5 relative md:top-[170px] sm:top-[190px] top-[50px] w-full"
            orientation="horizontal"
          >
            <div
              className="common-pointer h-full relative w-full"
              onClick={() => navigate("/map")}
            >
              <div className="flex h-24 md:h-28 justify-end mt-auto mx-auto w-full">
                <div className="bg-blue_gray-500 sm:bottom-[] h-28 mt-auto mx-auto sm:relative rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:top-[] w-full"></div>
                <div className="absolute bottom-[13%] flex flex-col inset-x-[0] items-center justify-start mx-auto w-[51%]">
                  <Img
                    className="h-8 w-8"
                    src={`${newURL}img_bxmapalt.svg`}
                    alt="bxmapalt"
                  />
                  <Text
                    className="mt-1 text-center text-sm text-white-A700 tracking-[0.98px] uppercase w-auto"
                    size="txtRalewayExtraBold14WhiteA700"
                  >
                    Explore the map
                  </Text>
                </div>
              </div>
              <Img
                className="absolute h-[72px] right-[0] top-[0] w-[71px]"
                src={`${newURL}img_notov1crab.svg`}
                alt="notov1crab"
              />
            </div>
            <div
              className="common-pointer h-full relative w-full"
              onClick={() => navigate("/howto")}
            >
              <div className="h-28 ml-auto my-auto w-[95%]">
                <div className="bg-blue_gray-500 h-28 ml-auto my-auto rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-full"></div>
                <div className="absolute flex flex-col h-max inset-y-[0] items-center justify-start my-auto right-[15%] w-[64%]">
                  <Img
                    className="h-8 w-8"
                    src={`${newURL}img_bxbookreader.svg`}
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
                className="absolute bottom-[0] h-[70px] left-[0] w-[72px]"
                src={`${newURL}img_notov1crab_blue_gray_100.svg`}
                alt="notov1crab"
              />
            </div>
            <div
              className="common-pointer h-full relative w-full"
              onClick={() => navigate("/")}
            >
              <div className="flex h-24 md:h-28 justify-end mt-auto mx-auto w-full">
                <div className="bg-blue_gray-500 h-28 mt-auto mx-auto rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-full"></div>
                <div className="absolute bottom-[13%] flex flex-col inset-x-[0] items-center justify-start mx-auto w-[47%]">
                  <Img
                    className="h-8 w-8"
                    src={`${newURL}img_bxbong.svg`}
                    alt="bxbong"
                  />
                  <Text
                    className="mt-1 text-center text-sm text-white-A700 tracking-[0.98px] uppercase w-auto"
                    size="txtRalewayExtraBold14WhiteA700"
                  >
                    Submit results
                  </Text>
                </div>
              </div>
              <Img
                className="absolute h-[72px] left-[0] top-[0] w-[72px]"
                src={`${newURL}img_notov1crab_blue_gray_100_72x72.svg`}
                alt="notov1crab"
              />
            </div>
            <div
              className="common-pointer h-full relative w-full"
              onClick={() => navigate("/howto")}
            >
              <div className="md:h-28 h-[110px] m-auto w-full">
                <div className="bg-blue_gray-500 h-28 m-auto rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-full"></div>
                <div className="absolute flex flex-col h-max inset-[0] items-center justify-center m-auto w-[68%]">
                  <Img
                    className="h-8 w-8"
                    src={`${newURL}img_bxclouddownload.svg`}
                    alt="bxclouddownload"
                  />
                  <Text
                    className="mt-1 text-center text-sm text-white-A700 tracking-[0.98px] uppercase w-auto"
                    size="txtRalewayExtraBold14WhiteA700"
                  >
                    Download resources
                  </Text>
                </div>
              </div>
              <Img
                className="absolute h-[72px] right-[0] top-[0] w-[46px]"
                src={`${newURL}img_notov1crab_blue_gray_100_72x46.svg`}
                alt="notov1crab"
              />
            </div>
          </List>

          {/* introduction section */}
          <div className="bg-gray-200 flex sm:flex-col flex-row gap-[49px] items-start justify-start max-w-[1179px] mt-5 mx-auto p-[43px] md:px-5 relative rounded-bl-[25px] rounded-br-[25px] rounded-tl-[25px] md:top-[145px] sm:top-[200px] top-[30px] sm:w-[90%] md:w-[98%] w-full">
            <Text
              className="sm:flex-1 ml-2 sm:ml-[0] sm:mt-0 mt-[3px] sm:text-[32px] md:text-[38px] text-[42px] text-blue-900 w-[28%] sm:w-full"
              size="txtRalewayRomanBold42"
            >
              Welcome to miniSASS
            </Text>
            <Text
              className="sm:flex-1 mb-[18px] text-blue-900 text-xl tracking-[0.40px] w-[67%] sm:w-full"
              size="txtRalewayRomanSemiBold20"
            >
              miniSASS is a simple tool which can be used by anyone to monitor
              the health of a river. You collect a sample of macroinvertebrates
              (small animals) from the water, and depending on which groups are
              found, you have a measure of the general river health and water
              quality in that river.
            </Text>
          </div>
          <div className="flex md:flex-col flex-row gap-5 md:grid md:grid-cols-2 items-center justify-start max-w-[1179px] mt-[86px] mx-auto md:px-5 md:relative md:top-20 sm:top-[130px] w-full">
            <Img
              className="sm:flex-1 h-[380px] md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-[380px] sm:w-full"
              src={`${newURL}img_rectangle1.png`}
              alt="rectangleOne"
            />
            <Text
              className="md:h-[45vh] sm:h-[50vh] leading-[136.40%] md:overflow-auto sm:overflow-scroll text-base text-gray-800"
              size="txtRalewayRomanSemiBold16"
            >
              <span className="text-gray-800 font-raleway text-left font-normal">
                <>
                  Anyone can learn how to collect a miniSASS sample on a river.
                  Once you have collected a sample you look for the different
                  bug groups and score whether they were found. The score then
                  tells you the health class of the river, ranging across five
                  categories from natural to very poor.
                  <br />
                  Have a look at the{" "}
                </>
              </span>
              <span className="text-gray-800 font-raleway text-left font-normal">
                How To
              </span>
              <span className="text-gray-800 font-raleway text-left font-normal">
                <>
                  {" "}
                  page to see how easy it is. Through miniSASS you can learn
                  about rivers, monitor the water quality of rivers within your
                  community, and explore reasons why the water quality may not
                  be as clean as everyone would like.
                  <br />
                  The most important feature of the new website is the miniSASS{" "}
                </>
              </span>
              <a
                href="javascript:"
                className="text-blue-900 font-raleway text-left font-normal underline"
              >
                Map
              </a>
              <span className="text-gray-800 font-raleway text-left font-normal">
                <>
                  , which allows you to explore your catchment, find your river,
                  look at any existing miniSASS results and then upload your own
                  miniSASS results! The map also lets you explore your catchment
                  to see the land uses and activites that might be improving or
                  worsening water quality.
                  <br />
                  Get your community, school or family and friends involved in
                  monitoring a selection of your streams and rivers. In this way
                  a map of river health across Southern Africa will develop.
                  Communities can use the information and knowledge to
                  illustrate the plight of their rivers, connect with other
                  miniSASS samplers and investigate pollution sources
                </>
              </span>
            </Text>
          </div>
          {/* end of section */}

          {/* obeservations and map section */}
          <div className="flex flex-col md:gap-10 gap-28 items-center justify-start mt-28 w-full">

             {/* observations */}
            <div className="flex flex-col gap-[58px] items-start justify-start max-w-[1180px] mx-auto md:px-5 sm:relative sm:top-[45px] w-full">
              <div className="flex sm:flex-col flex-row md:gap-10 items-center justify-between max-w-[1179px] mt-[66px] mx-auto md:px-5 md:relative md:top-[15px] sm:top-[60px] w-full">
                <Text
                  className="flex-1 sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-auto"
                  size="txtRalewayRomanBold40"
                >
                  Recent Observations
                </Text>
                <Button
                  className="flex h-10 sm:hidden items-center justify-center rounded-[5px] w-10"
                  color="blue_gray_500"
                  size="sm"
                  variant="fill"
                  onClick={handleNextObservations}
                  >
                    <Img src={`${newURL}img_arrowright.svg`} alt="arrowright" />
                  </Button>
                </div>
                <List
                  className="sm:flex-col flex-row gap-5 grid sm:grid-cols-1 md:grid-cols-2 grid-cols-4 sm:h-[60vh] md:h-[] md:justify-center justify-start sm:m-[] max-w-[1180px] sm:ml-[] mt-[51px] mx-auto sm:overflow-scroll md:px-5 sm:relative sm:top-5 w-full"
                  orientation="horizontal"
                >
                  {observations.slice(currentIndex, currentIndex + 4).map((props, index) => (
                    <React.Fragment key={`DesktopThreeColumnscore${index}`}>
                      <Observations
                        className="border border-blue_gray-100 border-solid flex flex-col gap-2 h-[237px] md:h-auto items-start justify-between sm:px-5 px-6 py-5 rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-[280px]"
                        {...props}
                      />
                    </React.Fragment>
                  ))}
                </List>
            </div>

            {/* map */}
            <div className="bg-blue-900 flex flex-col items-start justify-start max-w-full mt-28 pl-[53px] pr-[134px] md:px-10 sm:px-5 py-[103px] w-full">
              <div className="flex md:flex-col flex-row md:gap-10 gap-[89px] items-center justify-start max-w-[1700px] mx-auto w-full">
                <Img
                  className="md:flex-1 h-[280px] sm:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tl-[25px] w-[303px] md:w-full"
                  src={`${newURL}img_rectangle6.png`}
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
                        src={`${newURL}img_arrowright_white_a700.svg`}
                        alt="arrow_right"
                      />
                    }
                    shape="round"
                    color="blue_gray_500"
                    size="sm"
                    variant="fill"
                  >
                    <div className="text-left text-lg tracking-[0.81px]">
                      See the map
                    </div>
                  </Button>
                </div>
              </div>
            </div>


          </div>
          {/* end of section */}

          {/* articles and blogs section */}
          <div className="flex flex-col gap-[58px] items-center justify-start max-w-[1179px] mt-28 mx-auto md:px-5 w-full">
            <div className="flex flex-row md:gap-10 items-center justify-between max-w-[1179px] w-full">
              <Text
                className="flex-1 sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-auto"
                size="txtRalewayRomanBold40"
              >
                Latest Articles
              </Text>
              <Button
                className="flex h-10 items-center justify-center rounded-[5px] w-10"
                color="blue_gray_500"
                size="sm"
                variant="fill"
                onClick={handleNextBlogs}
              >
                <Img src={`${newURL}img_arrowright.svg`} alt="arrowright_One" />
              </Button>
            </div>

            {/* blogs */}
            <div className="flex flex-col gap-8 sm:h-[50vh] items-start justify-start sm:overflow-auto w-auto md:w-full">
              <div className="flex md:flex-col flex-row gap-[23px] items-start justify-start w-auto md:w-full">
                <Img
                  className="h-[406px] sm:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] w-[780px] md:w-full"
                  src={`${newURL}img_rectangle18.png`}
                  alt="rectangleEighteen"
                />
                <Blogs className="flex flex-col gap-4 items-start justify-start w-auto" />
              </div>
              <List
                className="sm:flex-col flex-row gap-8 grid sm:grid-cols-1 md:grid-cols-2 grid-cols-3 justify-start w-auto md:w-full"
                orientation="horizontal"
              >
                {BlogsPropList.slice(blogsCurrentIndex, blogsCurrentIndex + 3).map((props, index) => (
                  <React.Fragment key={`DesktopThreeBloggriditem${index}`}>
                    <Blogs
                      className="flex flex-col gap-4 items-start justify-start w-auto"
                      {...props}
                    />
                  </React.Fragment>
                ))}
              </List>
            </div>
          </div>
          {/* end of section */}

          <Footer className="flex items-center justify-center mt-28 md:px-5 w-full" />
        </div>
      </div>
    </>
  );
};

export default Home;
