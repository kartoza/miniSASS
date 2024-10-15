import React from "react";

import {Img, Text} from "../../components";
import Footer from "../../components/Footer";
import NavigationBar from "../../components/NavigationBar";
import YouTubeVideo from "../../components/YoutubeEmbedded";
import {globalVariables} from "../../utils";

import "../../pages/Howto/styles.css"


const HowtoPage: React.FC = () => {
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
                  <NavigationBar activePage="howto"/>
                </div>

              </div>
            </div>
          </div>
          <div
            id={"howto-title"}
            className="bg-gray-200 h-[20px] flex flex-col items-start justify-end mt-auto mx-auto p-12 md:px-10 sm:px-5
            relative rounded-br-[65px] md:top-[-105px] sm:top-[-80px] top-[50px] md:w-[102%]w-full
            ">
            <div className="flex flex-col items-center justify-start md:ml-[0] mt-[61px]">
              <Text
                className="sm:text-[32px] md:text-[38px] text-[42px] text-blue-900 ml-[185px] sm:ml-[0px]"
                size="txtRalewayRomanBold42"
                style={{marginBottom: '-30px'}}
              >
                How to do a miniSASS survey
              </Text>
            </div>
          </div>
        </div>

        {/* How to do a miniSASS survey section*/}
        <div
          className="flex flex-col gap-[46px] items-end justify-start max-w-[1450px] mt-[-30px] mx-auto md:px-5
          md:relative md:top-20 sm:mt-[200px]w-full sm:mt-[200px]">
          <Text
            className="max-w-[1450px] md:max-w-full sm:pr-5 pr-[35px] sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-full sm:mt-[50px]"
            size="txtRalewayRomanBold40"
          >
            The miniSASS equipment
          </Text>
          <div className="flex md:flex-col flex-row md:gap-10 items-center justify-between max-w-[1450px]
          md:relative md:top-[50px] w-full mt-[-40px]">
            <Text
              className="md:h-auto leading-[136.40%] tracking-[0.40px] md:overflow-auto sm:overflow-scroll
                text-base text-gray-800"
              size="txtRalewayRomanRegular16Gray800"
            >
              <span>What will you need?</span>
              <ul style={{listStyleType: 'disc', marginLeft: '20px'} }>
                <li>Download the miniSASS app!  The miniSASS app will help you do your miniSASS survey. It includes
                  a map to help navigate to sites, background information, and reference information and videos.
                  It also helps with identifying your aquatic macroinvertebrates, generating your miniSASS score,
                  and uploading your data!
                </li>
                <li>If you do not want to use the app, make sure to have a miniSASS field sheet (for score calculations
                  and dichotomous key for identifications) with a pencil to fill it out. Find this and other useful
                  resources under the ‘For Educators’ section below. Remember to upload your data to the website if
                  you do a survey using a physical sheet instead of the app.
                </li>
                <li>A miniSASS net (or a suitable home-made net). To make a homemade net, take any piece of wire, for
                  example an old clothes hanger, and bend it into the shape of a net. Then tie ‘netting’ (any net-like
                  material that will catch the creatures but let fine sand and water through) to the wire with a piece
                  of string.
                </li>
                <li>A white tray for sorting the macroinvertebrates sampled (can be a simple white ice-cream tub).</li>
                <li>Gumboots or waders.</li>
                <li>A cap or hat and sunscreen (safety first).</li>
                <li>Drinking water (always stay hydrated!).</li>
                <li>Soap or hand wash are recommended for after handling samples (do not touch your face when sampling
                  in potentially polluted waters). Protective gloves may also help.
                </li>
                <li>A magnifying glass is recommended, some of the critters are very small and difficult to identify
                  without some help.
                </li>
                <li>A charged cellphone in case of emergencies.</li>
                <li>Look into taking a clarity tube as well so you can measure the clarity of the stream too! This is
                  not part of the miniSASS, but clarity shows how many suspended solids are in the stream / river,
                  which is also very useful data. Low clarity indicates lots of dirt or solids in the river / stream,
                  often telling us something about upstream processes.
                </li>
                <li>While doing a miniSASS, you may also want to measure water temperature, pH, dissolved oxygen, or
                  electrical conductivity. The miniSASS app and website allow you to record those data, the more the
                  merrier! Please note what instruments you use to measure them with in your notes.
                </li>
                <li>You can get your miniSASS equipment from {" "}
                  <span className="underline text-blue-900 cursor-pointer" onClick={() => {
                    window.open(
                      'https://www.groundtruth.co.za/our-products',
                      "_blank",
                      "noreferrer"
                    );
                  }}>https://www.groundtruth.co.za/our-products
                  </span>
                  , or create
                  your own home made kit!
                </li>
              </ul>
            </Text>
          </div>
          <div className="flex md:flex-col flex-row max-w-[1450px] gap-14
            md:relative md:top-[50px] w-full mt-[-40px]">
            <div
              className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
            >
              <YouTubeVideo videoId="XJLcJMutXP8" width="100%" height="400px" playButtonColor="green"/>
            </div>
            <div
              className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
            >
              <YouTubeVideo videoId="_-L-Xs4QJRg" width="100%" height="400px" playButtonColor="green"/>
            </div>
          </div>
        </div>
        {/* end of section */}

        {/* How to stay safe when doing miniSASS */}
        <div
          className="flex flex-col gap-[46px] items-end justify-start max-w-[1450px] mt-[50px] mx-auto md:px-5 md:relative md:top-20 sm:top-[90px]w-full">
          <Text
            className="max-w-[1450px] md:max-w-full sm:pr-5 pr-[35px] sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-full sm:mt-[50px]"
            size="txtRalewayRomanBold40"
          >
            How to stay safe when doing miniSASS
          </Text>
          <div className="flex md:flex-col flex-row max-w-[1450px] gap-14
            md:relative md:top-[50px] w-full mt-[-40px]">
            <div
              className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
            >
              <YouTubeVideo videoId="yGbi7P8RYoU" width="100%" height="400px" playButtonColor="green"/>
            </div>
            <div
              className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
            >
              <Text
                className="md:h-auto leading-[136.40%] tracking-[0.40px] md:overflow-auto sm:overflow-scroll text-base text-gray-800 text-justify"
                size="txtRalewayRomanRegular16Gray800"
              >
                Safety first! MiniSASS is better with a friend or group. Be sure to let people
                  know where you will be. Rivers may contain various toxins, harmful pollutants,
                  or dangerous animals. It is important to wear appropriate clothing and be watchful
                  for any dangers. Gumboots / Waders / Wellingtons will protect your feet from the sharp
                  rocks harmful things in the water. Life jackets are recommended.
              </Text>
            </div>
          </div>
        </div>
        {/* end of section */}


        {/* How to stay safe when doing miniSASS */}
        <div
          className="flex flex-col gap-[46px] items-end justify-start max-w-[1450px] mt-[50px] mx-auto md:px-5 md:relative md:top-20 sm:top-[90px]w-full">
          <Text
            className="max-w-[1450px] md:max-w-full sm:pr-5 pr-[35px] sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-full sm:mt-[50px]"
            size="txtRalewayRomanBold40"
          >
            Choosing a site to sample for miniSASS
          </Text>

          <div className="flex md:flex-col flex-row max-w-[1450px] gap-14
            md:relative md:top-[50px] w-full mt-[-40px]">
            <div
              className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
            >
              <YouTubeVideo videoId="WX_DkYyfnmk" width="100%" height="400px" playButtonColor="green"/>
            </div>
            <div
              className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
            >
              <Text
                className="md:h-auto leading-[136.40%] tracking-[0.40px] md:overflow-auto sm:overflow-scroll text-base text-gray-800 text-justify"
                size="txtRalewayRomanRegular16Gray800"
              >
                Find a suitable site at your stream / river. MiniSASS cannot be done on stagnant water like ponds, dams
                and wetlands. It is very important to check whether the sample area has flowing water, if not then a
                miniSASS cannot be done there.
                <br/><br/>
                Remember, the best site is a safe site! If your site is safe, then pick a spot that has as many of the
                habitats (rocks, vegetation, and gravel, sand, and mud (GSM)) as possible to sample for the most variety
                of macroinvertebrates. Classifying your stream / river: A “Rocky” section of a stream / river has loose
                rocks instream and is often found closer to the source of the river. Sections of streams / rivers
                without any loose rocks instream are termed “Sandy” and are often found towards the mouth of the stream
                / river.
                <br/><br/>
                Note down the location where you are doing your miniSASS survey – save it on a phone or GPS. Your exact
                location is very important information!
              </Text>
            </div>
          </div>
        </div>
        {/* end of section */}

        {/* How to take a miniSASS sample */}
        <div
          className="flex flex-col gap-[46px] items-end justify-start max-w-[1450px] mt-[50px] mx-auto md:px-5 md:relative md:top-20 sm:top-[90px]w-full">
          <Text
            className="max-w-[1450px] md:max-w-full sm:pr-5 pr-[35px] sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-full sm:mt-[50px]"
            size="txtRalewayRomanBold40"
          >
            How to take a miniSASS sample
          </Text>

          <div className="flex md:flex-col flex-row max-w-[1450px] gap-14
          md:relative md:top-[50px] w-full mt-[-40px]">
            <div
              className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
            >
              <YouTubeVideo videoId="XY_p8usHx4Q" width="100%" height="400px" playButtonColor="green"/>
            </div>
            <div
              className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
            >
              <YouTubeVideo videoId="8RATZXY2jyo" width="100%" height="400px" playButtonColor="green"/>
            </div>
          </div>

          <div className="flex md:flex-col flex-row md:gap-10 items-center justify-between max-w-[1450px]
          md:relative md:top-[50px] w-full mt-[-40px]">
            <Text
              className="md:h-auto leading-[136.40%] tracking-[0.40px] md:overflow-auto sm:overflow-scroll text-base text-gray-800 text-justify"
              size="txtRalewayRomanRegular16Gray800"
            >
              Sample as many habitats in the stream as possible for a total of 5 minutes. Get energetic with sampling!
              Make sure to kick up the rocks, gravel, sand, and mud, to dislodge the macroinvertebrates and get them
              in your net. You can pick up and search under rocks as well, washing the creatures you find into you net
              as well. Scoop in and around the vegetation to make sure you get the critters hiding there as well.
              Keep an eye out for clams, mussels, crabs, snails, and anything else you might not easily catch in the
              net.
              <br/><br/>
              Run some water through your net in the stream or using a bucket to filter out most of the mud and grit you
              may have gotten in the net. The cleaner your sample, the easier it is to find and identify all the
              macroinvertebrates.
              <br/><br/>
              Add some river water to your tray, and empty your net into it (check for creatures clinging to the net or
              stuck inside). Identify all the different macroinvertebrates you found using the dichotomous key. Be sure
              to study your specimens carefully! Mark each different miniSASS group you find on your score sheet until
              you have found and identified everything you caught. Once you are done identifying, put all the contents
              of the tray back into the stream / river.
            </Text>
          </div>
        </div>
        {/* end of section */}

        {/* How to calculate your miniSASS score */}
        <div
          className="flex flex-col gap-[46px] items-end justify-start max-w-[1450px] mt-[50px] mx-auto md:px-5 md:relative md:top-20 sm:top-[90px]w-full">
          <Text
            className="max-w-[1450px] md:max-w-full sm:pr-5 pr-[35px] sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-full sm:mt-[50px]"
            size="txtRalewayRomanBold40"
          >
            How to calculate your miniSASS score
          </Text>

          <div className="flex md:flex-col flex-row max-w-[1450px] gap-14
          md:relative md:top-[50px] w-full mt-[-40px]">
            <div
              className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
            >
              <YouTubeVideo videoId="hKdPiSSVL0s" width="100%" height="400px" playButtonColor="green"/>
            </div>
            <div
              className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
            >
              <YouTubeVideo videoId="O_deXdCQIfM" width="100%" height="400px" playButtonColor="green"/>
            </div>
          </div>

          <div className="flex md:flex-col flex-row md:gap-10 items-center justify-between max-w-[1450px]
          md:relative md:top-[50px] w-full mt-[-40px]">
            <Text
              className="md:h-auto leading-[136.40%] tracking-[0.40px] md:overflow-auto sm:overflow-scroll text-base text-gray-800 text-justify"
              size="txtRalewayRomanRegular16Gray800"
            >
              Calculate your score and get your ecological category of river health. Each group of macroinvertebrates
              has been allocated a sensitivity score due to their sensitivity to pollution and disturbance. A high
              sensitivity score indicates that the group does not tolerate disturbance and pollution, so they are not
              likely not to be present in polluted and disturbed river conditions. A low sensitivity score indicates a
              greater resistance to pollution – these groups are generally found even is highly modified streams /
              rivers.
              <br/><br/>
              Add up your total score and divide it by the number of groups found to get the average score for the river
              site. This is your miniSASS score, which tells you the Ecological Condition of the stream / river. NOTE:
              Even if the Ecological Category is "Unmodified / Natural", it does not mean the water is drinkable. The
              water must still undergo chemical and microbial analysis to check if it is fit for human consumption. The
              miniSASS score only indicates how environmentally healthy the stream / river is, not if the water is
              drinkable.
            </Text>
          </div>
        </div>
        {/* end of section */}

        {/* Uploading your miniSASS score */}
        <div
          className="flex flex-col gap-[46px] items-end justify-start max-w-[1450px] mt-[50px] mx-auto md:px-5 md:relative md:top-20 sm:top-[90px]w-full">
          <Text
            className="max-w-[1450px] md:max-w-full sm:pr-5 pr-[35px] sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-full sm:mt-[50px]"
            size="txtRalewayRomanBold40"
          >
            Walkthrough and Uploading your miniSASS score
          </Text>

          <div className="flex md:flex-col flex-row max-w-[1450px] gap-14
            md:relative md:top-[50px] w-full mt-[-40px]">
              <div
                className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
              >
                <YouTubeVideo videoId="C1CbzcWwHiM" width="100%" height="400px" playButtonColor="green"/>
              </div>
              <div
                className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
              >
                <YouTubeVideo videoId="eUAr6n5gSqE" width="100%" height="400px" playButtonColor="green"/>
              </div>
            </div>

          <div className="flex md:flex-col flex-row max-w-[1450px] gap-14 md:relative md:top-[50px] w-full mt-[-40px] mt-[3%]">
            <div
              className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
            >
              <YouTubeVideo videoId="uUJTrkZKL6U" width="100%" height="400px" playButtonColor="green"/>
            </div>
            <div className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]">
              <Text
                className="md:h-auto leading-[136.40%] tracking-[0.40px] md:overflow-auto sm:overflow-scroll text-base text-gray-800 text-justify"
                size="txtRalewayRomanRegular16Gray800"
              >
                Upload your data!
                Register on the miniSASS website if you have not already and upload your data by clicking on the ‘Submit
                Results’ button and fill in all the fields. Great job!
              </Text>
            </div>
          </div>
          
        </div>
        {/* end of section */}

        {/* Using miniSASS for monitoring */}
        <div
          className="flex flex-col gap-[46px] items-end justify-start max-w-[1450px] mt-[50px] mx-auto md:px-5 md:relative md:top-20 sm:top-[90px]w-full">
          <Text
            className="max-w-[1450px] md:max-w-full sm:pr-5 pr-[35px] sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-full sm:mt-[50px]"
            size="txtRalewayRomanBold40"
          >
            Using miniSASS for monitoring
          </Text>


          <div className="flex md:flex-col flex-row max-w-[1450px] gap-14
          md:relative md:top-[50px] w-full mt-[-40px]">
            <div
              className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
            >
              <YouTubeVideo videoId="uU7hOj4zjG0" width="100%" height="400px" playButtonColor="green"/>
            </div>
            <div
              className="sm:flex-1 md:h-auto object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] sm:w-full w-[50%]"
            >
              <YouTubeVideo videoId="illWM9BhL-0" width="100%" height="400px" playButtonColor="green"/>
            </div>
          </div>

          <div className="flex md:flex-col flex-row md:gap-10 items-center justify-between max-w-[1450px]
          md:relative md:top-[50px] w-full mt-[-40px]">
            <Text
              className="md:h-auto leading-[136.40%] tracking-[0.40px] md:overflow-auto sm:overflow-scroll text-base text-gray-800 text-justify"
              size="txtRalewayRomanRegular16Gray800"
            >
              View your submission among everyone else’s on the map (check your site is in the right place!). The colour
              of the crab showing your assessment will correspond to the health of the stream at your site. Visit the
              same site every 5-6 weeks to get a time series for the health of your stream and contribute towards a
              powerful global dataset of water quality and stream / river health. You don’t have to wait to sample again
              though, head to another site in a different place on the same stream, or head to another stream to keep
              doing miniSASS surveys! Every time, you will be contributing vital data that will be used for better
              monitoring and managing the earth’s precious freshwater resources.
            </Text>
          </div>
        </div>
        {/* end of section */}

        {/* resources for download section */}
        <div
          id={'howto-resources'}
          className="bg-blue-900 flex md:flex-col flex-row md:gap-10 gap-[97px] items-start justify-start mt-28 p-[103px] md:px-10 sm:px-5w-full sm:mt-[200px]">
          <div className="flex container flex-col w-[30%] sm:w-full">
            <Img
              className="md:flex-1 h-[280px] sm:h-auto md:ml-[0] ml-[27px] md:mt-0 mt-0.5 object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tl-[25px] md:w-full sm:w-full"
              src={`${globalVariables.staticPath}download-1.jpg`}
              alt="rectangleSix_One"
            />
            <Img
              className="md:flex-1 h-[280px] sm:h-auto sm:mt-[25px] md:ml-[0] ml-[27px] md:mt-0 mt-0.5 mt-[50px] object-cover rounded-bl-[25px] rounded-br-[25px] rounded-tl-[25px] md:w-full"
              src={`${globalVariables.staticPath}download-2.jpg`}
              alt="rectangleSix_One"
            />
          </div>
          <div className="flex container flex-col w-[70%]">
            <div>
              <Text
                className="sm:text-4xl md:text-[38px] text-[30px] text-white-A700 w-auto"
                size="txtRalewayRomanBold40"
              >
                For Educators!
              </Text>
            </div>
            <div>
              <Text
                className="sm:text-2xl md:text-[38px] text-[20px] text-white-A700 w-auto"
                size="txtRalewayRomanBold30"
              >
                Below are educational resources developed as part of the Share-Net partnership project between Wildlife
                and Environment Society of South Africa (WESSA) and the Water Research Commission (WRC). Share-Net are
                committed to developing and disseminating materials in support of environmentally focused teaching and
                learning. Share-Net materials are copyright-free for educational purposes.
              </Text>
            </div>
            <div>
              <Text
                className="sm:text-2xl md:text-[38px] text-[20px] text-white-A700 w-auto mt-[30px]"
                size="txtRalewayRomanBold30"
              >
                <span><b>miniSASS field sheets</b></span>
                <br/>
                <span className="underline text-white-A700 cursor-pointer" onClick={() => {
                  window.open(
                    `${globalVariables.docsPath}minisass_dichotomous_key_pg_4_5.pdf`,
                    "_blank",
                    "noreferrer"
                  );
                }}>miniSASS Dichotomous Key (804.6 KB)
                </span>
                <br/>
                <span className="underline text-white-A700 cursor-pointer" onClick={() => {
                  window.open(
                    `${globalVariables.docsPath}minisass_info_pamphlet_pg_1_8_1.pdf`,
                    "_blank",
                    "noreferrer"
                  );
                }}>miniSASS Method information (443.2 KB)
                </span>
                <br/>
                <span className="underline text-white-A700 cursor-pointer" onClick={() => {
                  window.open(
                    `${globalVariables.docsPath}minisass_info_pamphlet_pg_2_3_1.pdf`,
                    "_blank",
                    "noreferrer"
                  );
                }}>miniSASS Background information (317.1 KB)
                </span>
                <br/>
                <span className="underline text-white-A700 cursor-pointer" onClick={() => {
                  window.open(
                    `${globalVariables.docsPath}minisass_microinvertebrate_groups_pg_6_7.pdf`,
                    "_blank",
                    "noreferrer"
                  );
                }}>miniSASS macroinvertebrate Groups (599.5 KB)
                </span>
              </Text>
            </div>
            <div>
              <Text
                className="sm:text-2xl md:text-[38px] text-[20px] text-white-A700 w-auto mt-[30px]"
                size="txtRalewayRomanBold30"
              >
                Below are packages aimed at learners in different grades, containing activities oriented towards
                learning in various fields. The packages for Grades 7, 9, and 11, include activities involving miniSASS
                for education in the natural sciences / environmental health and sustainability / freshwater ecology. We
                encourage you to adapt and use the materials in new, exciting ways but request that you acknowledge
                Share-Net as an original source. Sensible use of these curriculum activities is entirely the
                responsibility of the educator. </Text>
            </div>
            <div>
              <Text
                className="sm:text-2xl md:text-[38px] text-[20px] text-white-A700 w-auto mt-[30px]"
                size="txtRalewayRomanBold30"
              >
                <span><b>Educational Resources</b></span>
                <br/>
                <span className="underline text-white-A700 cursor-pointer" onClick={() => {
                  window.open(
                    `${globalVariables.docsPath}minisass_grade_5.pdf`,
                    "_blank",
                    "noreferrer"
                  );
                }}>mini SASS Grade 5 (Open PDF) (1.9 MB)
                </span>
                <br/>
                <span className="underline text-white-A700 cursor-pointer" onClick={() => {
                  window.open(
                    `${globalVariables.docsPath}minisass_grade_7.pdf`,
                    "_blank",
                    "noreferrer"
                  );
                }}>miniSASS Grade 7 (Open PDF) (610.9 KB)
                </span>
                <br/>
                <span className="underline text-white-A700 cursor-pointer" onClick={() => {
                  window.open(
                    `${globalVariables.docsPath}minisass_grade_9.pdf`,
                    "_blank",
                    "noreferrer"
                  );
                }}>mini SASS Grade 9 (Open PDF) (357.7 KB)
                </span>
                <br/>
                <span className="underline text-white-A700 cursor-pointer" onClick={() => {
                  window.open(
                    `${globalVariables.docsPath}minisass_grade_11.pdf`,
                    "_blank",
                    "noreferrer"
                  );
                }}>mini SASS Grade 11 (Open PDF) (1.7 MB)
                </span>
              </Text>
            </div>
          </div>
        </div>
        {/* end of section */}

        {/* Further reading section*/}
        <div
          className="flex flex-col gap-[46px] items-end justify-start max-w-[1450px] mt-[94px] mx-auto md:px-5 md:relative md:top-20 sm:top-[90px]w-full">
          <Text
            className="max-w-[1450px] md:max-w-full sm:pr-5 pr-[35px] sm:text-4xl md:text-[38px] text-[40px] text-blue-900 w-full sm:mt-[50px]"
            size="txtRalewayRomanBold40"
          >
            Further Reading
          </Text>
          <div className="flex md:flex-col flex-row md:gap-10 items-center justify-between max-w-[1450px]
          md:relative md:top-[50px] w-full mt-[-40px]">
            <Text
                className="md:h-auto leading-[136.40%] tracking-[0.40px] md:overflow-auto sm:overflow-scroll text-base text-gray-800 text-justify"
                size="txtRalewayRomanRegular16Gray800"
            >
              Graham, P. M. (2012). Reassessment of the miniSASS biomonitoring tools as a resource for environmental
              education in the river health programme and cross-linking to with the National Curriculum Statement.
              Water Research Commission (WRC) Report No. KV 240/12. Pretoria, South Africa, p. 123. Available at
              <a href="https://www.wrc.org.za/wp-content/uploads/mdocs/KV%20240%20web.pdf ">
                <u> https://www.wrc.org.za/wp-content/uploads/mdocs/KV%20240%20web.pdf</u>
              </a>
              <br/><br/>
              Graham, P. M., Burton, S., & Gibixego, A. (2015). miniSASS Data Management: Development of an online
              map-based data portal. Water Research Commission (WRC) Report No. TT 639/15. Pretoria, South Africa,
              p. 25. Available at
              <a href="https://www.wrc.org.za/wp-content/uploads/mdocs/TT%20639-15.pdf">
                <u> https://www.wrc.org.za/wp-content/uploads/mdocs/TT%20639-15.pdf</u>
              </a>
              <br/><br/>
              Graham, P. M., Dickens, C. W. S., & Taylor, J. (2004). miniSASS—A novel technique for community
              participation in river health monitoring and management. African Journal of Aquatic Science, 29(1), 25–35.
              <a href=" https://doi.org/10.2989/16085910409503789 ">
                <u> https://doi.org/10.2989/16085910409503789</u>
              </a>
              <br/><br/>
              Graham, P. M., & Taylor, J. (2018). Development of citizen science water resource monitoring tools and
              communities of practice for South Africa, Africa and the world (P. M. Graham & J. Taylor, Eds.).
              Water Research Commission (WRC) Report No. TT 763/18. Pretoria, South Africa, p. 142. Available at
              <a href="https://www.wrc.org.za/wp-content/uploads/mdocs/TT%20763%20web.pdf">
                <u> https://www.wrc.org.za/wp-content/uploads/mdocs/TT%20763%20web.pdf</u>
              </a>
              <br/><br/>
              Koen, R. C. J., & Koen, F. J. (2023). Aquatic macroinvertebrate image dataset. Harvard Dataverse.
              <a href="https://doi.org/10.7910/DVN/1QQPJ5">
                <u> https://doi.org/10.7910/DVN/1QQPJ5</u>
              </a>
              <br/><br/>
              Koen, R. C. J., Koen, F. J., Pattinson, N. B., Dickens, C. W. S., & Graham, P. M. (2023). Digitally
              improving the identification of aquatic macroinvertebrates for indices used in biomonitoring.
              International Water Management Institute (IWMI). CGIAR Initiative on Digital Innovation. Colombo,
              Sri Lanka, p. 10. Available at
              <a href="https://hdl.handle.net/10568/138246">
                <u> https://hdl.handle.net/10568/138246</u>
              </a>
              <br/><br/>
              Pattinson, N. B., Koen, R. C. J., & Koen, F. J. (2022). Artificial intelligence-based biomonitoring of
              water quality. International Water Management Institute (IWMI). CGIAR Initiative on Digital Innovation.
              Colombo, Sri Lanka, p. 32. Available at
              <a href="https://hdl.handle.net/10568/128025">
                <u> https://hdl.handle.net/10568/128025</u>
              </a>
              <br/><br/>
              Pattinson, N. B., Russell, C., Taylor, J., Dickens, C. W. S., Koen, R. C. J., Koen, F. J., & Graham,
              P. M. (2023). Digital innovation with miniSASS, a citizen science biomonitoring tool.
              International Water Management Institute (IWMI). CGIAR Initiative on Digital Innovation.
              Colombo, Sri Lanka, p. 11. Available at
              <a href="https://hdl.handle.net/10568/134498">
                <u> https://hdl.handle.net/10568/134498</u>
              </a>
              <br/><br/>
              Pattinson, N. B., Taylor, J., Dickens, C. W. S., & Graham, P. M. (2023). Digital innovation in citizen
              science water quality monitoring in developing countries. International Water Management Institute (IWMI).
              CGIAR Initiative on Digital Innovation. Colombo, Sri Lanka, p. 52.
              <a href="https://doi.org/10.5337/2024.201">
                <u> https://doi.org/10.5337/2024.201</u>
              </a>
              <br/><br/>
              Russell, C., Sithole, N. S. Z., Tshabalala, G., Kotze, D., & Taylor, J. (2024). Citizen science online
              training and learning system. Water Research Commission (WRC) Report No. TT 933/23. Pretoria,
              South Africa, p. 136. Available at
              <a href="https://www.wrc.org.za/wp-content/uploads/mdocs/TT%20933%20final%20web.pdf ">
                <u> https://www.wrc.org.za/wp-content/uploads/mdocs/TT%20933%20final%20web.pdf </u>
              </a>
              <br/><br/>
              Taylor, J., Graham, P. M., Louw, A. J., Lepheana, A. T., Madikizela, B., Dickens, C. W. S., Chapman,
              D. V, & Warner, S. (2022). Social change innovations, citizen science, miniSASS and the SDGs.
              Water Policy, 24(5), 708–717.
              <a href="https://doi.org/10.2166/wp.2021.264">
                <u> https://doi.org/10.2166/wp.2021.264</u>
              </a>
              <br/><br/>
              Tengö, M., Austin, B. J., Danielsen, F., & Fernández-Llamazares, Á. (2021). Creating synergies between
              citizen science and Indigenous and local knowledge. BioScience, 71(5), 503–518.
              <a href="https://doi.org/10.1093/biosci/biab023">
                <u> https://doi.org/10.1093/biosci/biab023</u>
              </a>
              <br/><br/>
              UNEP. (2021). Progress on ambient water quality. Tracking SDG 6 series: Global indicator 6.3.2 updates
              and acceleration needs. See page 16: “FOCUS BOX 2. MINISASS – CITIZEN BIOMONITORING FOR INDICATOR 6.3.2”.
              Available at
              <a href="https://www.unwater.org/sites/default/files/app/uploads/2021/09/SDG6_Indicator_Report_632_Progress-on-Ambient-Water-Quality_2021_EN.pdf">
                <u> https://www.unwater.org/sites/default/files/app/uploads/2021/09/SDG6_Indicator_Report_632_Progress-on-Ambient-Water-Quality_2021_EN.pdf</u>
              </a>
              <br/><br/>
            </Text>
          </div>
        </div>
        {/* end of section */}

        <Footer className="flex items-center justify-center mt-28 md:px-5 w-full sm:mt-[200px]"/>
      </div>
    </>
  );
};

export default HowtoPage;
