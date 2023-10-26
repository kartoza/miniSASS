import React from "react";

import { Img, Text } from "../../components";

type FooterProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Partial<{}>;

const Footer: React.FC<FooterProps> = (props) => {
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
      <footer className={props.className}>
        <div className="flex flex-col md:gap-10 gap-28 items-center justify-center mt-2.5 w-full">
          <div className="flex flex-row md:gap-10 gap-[67px] items-center justify-center sm:overflow-auto w-auto md:w-full">
            <Img
              className="h-[100px] md:h-auto object-cover w-64"
              src={`${newURL}img_image4.png`}
              alt="imageFour"
            />
            <Img
              className="h-[100px] md:h-auto object-cover w-[54px]"
              src={`${newURL}img_image5.png`}
              alt="imageFive"
            />
            <Img
              className="h-[100px] md:h-auto object-cover w-[218px]"
              src={`${newURL}img_image6.png`}
              alt="imageSix"
            />
            <Img
              className="h-[100px] md:h-auto object-cover w-[117px]"
              src={`${newURL}img_image7.png`}
              alt="imageSeven"
            />
          </div>
          <div className="bg-blue-900 flex flex-col items-center justify-end p-6 sm:px-5 rounded-tl-[65px] md:w-[105%] sm:w-[110%] w-full">
            <div className="flex flex-col items-center justify-start mt-8 w-[85%] md:w-full">
              <div className="flex flex-col gap-10 items-center justify-start w-auto md:w-full">
                <div className="bg-blue-900 flex flex-col items-start justify-start w-auto">
                  <Img
                    className="h-[39px] md:h-auto object-cover w-[246px] sm:w-full"
                    src={`${newURL}img_minisasstext2.png`}
                    alt="minisasstextTwo"
                  />
                </div>
                <ul className="flex sm:flex-col flex-row gap-[19px] items-start justify-start w-auto md:w-full common-column-list">
                  <li>
                    <Text
                      className="text-sm text-white-A700 tracking-[0.98px] uppercase"
                      size="txtRalewayExtraBold14WhiteA700"
                    >
                      How to
                    </Text>
                  </li>
                  <li>
                    <Text
                      className="text-sm text-white-A700 tracking-[0.98px] uppercase"
                      size="txtRalewayExtraBold14WhiteA700"
                    >
                      Map
                    </Text>
                  </li>
                  <li>
                    <Text
                      className="text-sm text-white-A700 tracking-[0.98px] uppercase"
                      size="txtRalewayExtraBold14WhiteA700"
                    >
                      Downloads
                    </Text>
                  </li>
                  <li>
                    <Text
                      className="text-sm text-white-A700 tracking-[0.98px] uppercase"
                      size="txtRalewayExtraBold14WhiteA700"
                    >
                      Partners
                    </Text>
                  </li>
                  <li>
                    <Text
                      className="text-sm text-white-A700 tracking-[0.98px] uppercase"
                      size="txtRalewayExtraBold14WhiteA700"
                    >
                      Contact us
                    </Text>
                  </li>
                </ul>
                <div className="flex md:flex-col flex-row md:gap-10 items-center justify-between max-w-[1180px] w-full">
                  <Text
                    className="text-base text-white-A700 w-auto"
                    size="txtRalewayRomanRegular16WhiteA700"
                  >
                    <span className="text-white-A700 font-raleway text-left font-normal">
                      © 2023 Water Research Commission. This is an open source
                      project. Get the source code at{" "}
                    </span>
                    <a
                      href="javascript:"
                      className="text-white-A700 font-raleway text-left font-normal underline"
                    >
                      Github
                    </a>
                  </Text>
                  <div className="flex flex-row gap-2.5 items-start justify-start w-auto">
                    <Img
                      className="h-6 w-6"
                      src={`${newURL}img_icbaselinefacebook_white_a700.svg`}
                      alt="icbaselinefaceb_One"
                    />
                    <Img
                      className="h-6 w-6"
                      src={`${newURL}img_riyoutubefill_white_a700.svg`}
                      alt="riyoutubefill_One"
                    />
                    <Img
                      className="h-6 w-6"
                      src={`${newURL}img_formkitwordpress_white_a700.svg`}
                      alt="formkitwordpres_One"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

Footer.defaultProps = {};

export default Footer;
