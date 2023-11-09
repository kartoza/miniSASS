import React from "react";

import { Button, Img, Text } from "../../components";

type DesktopTwoBloggriditemProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  | "newslettertext"
  | "tue07jan2020"
  | "newsletterdescription"
  | "learnmorebutton"
  | "link"
> &
  Partial<{
    newslettertext: JSX.Element | string;
    tue07jan2020: string;
    newsletterdescription: string;
    learnmorebutton: string;
    link: string;
  }>;

const Blogs: React.FC<DesktopTwoBloggriditemProps> = (
  props,
) => {
  // Event handler for when the button is clicked
  const handleButtonClick = () => {
    if (props.link) {
      // Open the link in a new tab or window
      window.open(props.link, "_blank");
    }
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
      <div className={props.className}>
        <div className="flex flex-col gap-1 items-start justify-start w-full">
          <Text
            className="leading-[136.40%] max-w-[368px] md:max-w-full text-2xl md:text-[22px] text-blue-900 sm:text-xl"
            size="txtRalewayBold24"
          >
            {props?.newslettertext}
          </Text>
          <Text
            className="text-base text-blue_gray-500 w-full"
            size="txtRalewayRomanSemiBold16Bluegray500"
          >
            {props?.tue07jan2020}
          </Text>
        </div>
        <Text
          className="leading-[136.40%] max-w-[368px] md:max-w-full text-base text-gray-800"
          size="txtRalewayRomanRegular16Gray800"
        >
          {props?.newsletterdescription}
        </Text>
        <Button
          className="cursor-pointer flex items-center justify-center min-w-[190px] rounded-[15px]"
          rightIcon={
            <Img
              className="h-[18px] ml-2.5"
              src={`${newURL}img_arrowright_white_a700.svg`}
              alt="arrow_right"
            />
          }
          color="blue_gray_500"
          size="sm"
          variant="fill"
          onClick={handleButtonClick} // Attach the event handler
        >
          <div className="font-raleway text-left text-lg tracking-[0.81px]">
            {props?.learnmorebutton}Learn More
          </div>
        </Button>
      </div>
    </>
  );
};

Blogs.defaultProps = {
  newslettertext: (
    <>
      MINISASS NEWSLETTER <br />
      JANUARY 2020
    </>
  ),
  tue07jan2020: "Tue, 07 Jan 2020 12:33 by miniSASS Team",
  newsletterdescription:"",
  link: 'https://minisassblog.wordpress.com/2020/01/07/minisass-newsletter-january-2020/'
};

export default Blogs;
