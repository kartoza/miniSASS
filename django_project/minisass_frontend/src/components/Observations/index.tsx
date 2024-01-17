import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { Img, Text } from "../../components";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { globalVariables } from "../../utils";

type DesktopTwoColumnscoreProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  | "username"
  | "usernamejimtaylOne"
  | "organisation"
  | "dateadded"
  | "score"
  | "river_category"
  | "userimage"
  | "score1"
> &
  Partial<{
    username: string;
    usernamejimtaylOne: string;
    organisation: string;
    dateadded: string;
    score: string;
    river_category: string;
    userimage: string;
    score1: string;
  }>;


const Observations: React.FC<DesktopTwoColumnscoreProps> = (props) => {
  const [titleColor, setTitleColor] = useState<string>('');
  const [progressBarColor, setProgressBarColor] = useState<string>('');
  const [renderCrab, setRenderCrab] = useState<string>('');
  

  useEffect(() => {
    const score = Number(props.score)
    if (props.riverCategory === 'sandy') {
      if (score > 6.8) {
        setTitleColor("text-blue-600");
        setProgressBarColor("blue");
        setRenderCrab(`${globalVariables.staticPath}crab_blue.svg`);
      } else if (score > 5.8 && score <= 6.8) {
        setTitleColor("text-green-600");
        setProgressBarColor("green");
        setRenderCrab(`${globalVariables.staticPath}crab_green.svg`);
      } else if (score > 5.3 && score <= 5.8) {
        setTitleColor("text-orange-600");
        setProgressBarColor("orange");
        setRenderCrab(`${globalVariables.staticPath}crab_orange.svg`);
      } else if (score > 4.8 && score <= 5.3) {
        setTitleColor("text-red-600");
        setProgressBarColor("red");
        setRenderCrab(`${globalVariables.staticPath}crab_red.svg`);
      } else {
        setTitleColor("text-purple-600");
        setProgressBarColor("purple");
        setRenderCrab(`${globalVariables.staticPath}crab_purple.svg`);
      }
    } else {
      if (props.score > 7.2) {
        setTitleColor("text-blue-600");
        setProgressBarColor("blue");
        setRenderCrab(`${globalVariables.staticPath}crab_blue.svg`);
      } else if (score > 6.1 && score <= 7.2) {
        setTitleColor("text-green-600");
        setProgressBarColor("green");
        setRenderCrab(`${globalVariables.staticPath}crab_green.svg`);
      } else if (score > 5.6 && score <= 6.1) {
        setTitleColor("text-orange-600");
        setProgressBarColor("orange");
        setRenderCrab(`${globalVariables.staticPath}crab_orange.svg`);
      } else if (score > 5.3 && score <= 5.6) {
        setTitleColor("text-red-600");
        setProgressBarColor("red");
        setRenderCrab(`${globalVariables.staticPath}crab_red.svg`);
      } else {
        setTitleColor("text-purple-600");
        setProgressBarColor("purple");
        setRenderCrab(`${globalVariables.staticPath}crab_purple.svg`);
      }
    }

  }, [props.score]);

  const navigate = useNavigate();

  const navigateToMap = () => {
    // Navigate to the map page with details set to the observation's primary key
    navigate(`/map?details=${props?.observation}`);
  };

  return (
    <div className={props.className}>
      <div className="flex flex-col gap-2 items-start justify-start w-full">
        <Text
          className={`${titleColor} text-lg w-full`}
          size="txtRalewayBold18Green800"
        >
          {props?.username}
        </Text>
        <div className="flex flex-col items-start justify-start w-full">
          <Text
            className="text-base text-gray-800 w-full"
            size="txtRalewayRomanRegular16"
          >
            {props?.usernamejimtaylOne}
          </Text>
          <Text
            className="text-base text-gray-800 w-full"
            size="txtRalewayRomanRegular16"
          >
            {props?.organisation}
          </Text>
          <Text
            className="text-base text-gray-800 w-full"
            size="txtRalewayRomanRegular16"
          >
            {props?.dateadded}
          </Text>
          <Text
            className="text-blue-900 font-raleway text-left font-normal underline common-pointer"
            size="txtRalewayRomanRegular16"
            onClick={navigateToMap}
          >
            {`view details`}
          </Text>
        </div>
      </div>
      <div className="flex flex-row gap-1 items-center justify-start pt-2 w-full">
      <Text
          className={`${titleColor} flex-1 text-base w-auto`}
          size="txtRalewayRomanSemiBold16Green800"
        >
          Score:
        </Text>
        <div className="h-[68px] relative w-[68px]">
          <div className="h-[68px] m-auto w-[68px]">
            <div
              className={`!w-[68px] border-solid h-[68px] m-auto overflow-visible bg-${progressBarColor}`}
            >
              <CircularProgressbar
                className={`!w-[68px] border-solid h-[68px] m-auto overflow-visible ${progressBarColor}`}
                value={parseFloat(props.score1 || "0") * 10}
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
              alt="imageTwo"
              src={renderCrab}
            />
          </div>
          <Text
            className="absolute bottom-[18%] inset-x-[0] mx-auto text-base w-max"
            size="txtRalewayRomanSemiBold16Green800"
          >
            {props?.score1}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Observations;
