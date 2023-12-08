import React, { useState, useEffect } from "react";

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

import "react-circular-progressbar/dist/styles.css";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [blogsCurrentIndex, setBlogsCurrentIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [observations, setObservations] = useState([]);
  const ObservationsPropList = [];
  const [activationComplete, setActivationComplete] = useState(false);
  const [activationMessage, setActivationMessage] = useState('');


  const urlParams = new URLSearchParams(window.location.search);

  const FETCH_RECENT_OBSERVATIONS = globalVariables.baseUrl + '/monitor/observations/recent-observations/';

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
          </div>

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
            maxWidth: '400px',
            background: 'white',
            border: 'none',
            borderRadius: '0px 25px 25px 25px',
          },
        }}
      >
      {activationComplete && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '32px',
            gap: '18px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginLeft: '80px',
            }}
          >
            <p>{activationMessage}</p>
            <div
              style={{
                marginLeft: '80px',
              }}
            >
              <Img
                className="h-6 w-6 common-pointer"
                src={`${globalVariables.staticPath}img_icbaselineclose.svg`}
                alt="close"
                onClick={closeActivationModal}
              />
            </div>
          </div>
        </div>
      )}
      </Modal>
    </>
  );
};

export default Home;
