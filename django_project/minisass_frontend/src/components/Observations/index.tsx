import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { Img, Text } from "../../components";
import "react-circular-progressbar/dist/styles.css";

type DesktopTwoColumnscoreProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  | "username"
  | "usernamejimtaylOne"
  | "organisation"
  | "dateadded"
  | "score"
  | "userimage"
  | "score1"
> &
  Partial<{
    username: string;
    usernamejimtaylOne: string;
    organisation: string;
    dateadded: string;
    score: string;
    userimage: string;
    score1: string;
  }>;

  // Get the current URL using window.location.href
  const currentURL = window.location.href;

  // Extract the base URL (everything up to the first single forward slash '/')
  const parts = currentURL.split('/');
  const baseUrl = parts[0] + '//' + parts[2]; // Reconstruct the base URL

  // Define the replacement path
  const replacementPath = 'static/images/';

  // Construct the new URL with the replacement path
  const newURL = baseUrl + '/' + replacementPath;

const Observations: React.FC<DesktopTwoColumnscoreProps> = (props) => {
  const [isRedProgressBar, setIsRedProgressBar] = useState<boolean>(false);
  const [titleColor, setTitleColor] = useState<string>('');
  const [progressBarColor, setProgressBarColor] = useState<string>('');
  const [renderCrab, setRenderCrab] = useState<string>('');
  

  useEffect(() => {
    if(parseFloat(props.score || "0") < 6){
      setIsRedProgressBar(true)
      setTitleColor("text-red-600")
      setProgressBarColor("red")
      setRenderCrab(`${newURL}img_image2_24x30.png`)
    }else {
      console.log('score more')
      setIsRedProgressBar(false)
      setTitleColor("text-green-800")
      setProgressBarColor("green")
      setRenderCrab(`${newURL}img_image2.png`)
    }
      

  }, [props.score]);

  // const isRedProgressBar = parseFloat(props.score1 || "0") < 6;
  // const progressBarColor = isRedProgressBar ? "red" : "green";
  // const titleColor = isRedProgressBar ? "text-red-600" : "text-green-800";
  // const renderCrab = isRedProgressBar
  //   ? `${newURL}img_image2_24x30.png`
  //   : `${newURL}img_image2.png`;

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
