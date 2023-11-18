import React, { useRef, useState } from "react";

import { Button, Img, List, Text } from "../../components";
import Modal from 'react-modal';

interface ManageImageProps {
  title: string;
  id: string; // TODO this will be used to fetch the data
  isOpen: boolean;
  onClose: () => void;
  onSubmit: any;
  sensivityScore: string;
  aiScore: string;
}

const ManageImagesModal: React.FC<ManageImageProps> = ({ title, id ,isOpen, onClose, sensivityScore, aiScore }) => {

  // TODO will use id to fetch images and dynamically populate imageUrls

  // Get the current URL using window.location.href
  const currentURL = window.location.href;

  // Extract the base URL (everything up to the first single forward slash '/')
  const parts = currentURL.split('/');
  const baseUrl = parts[0] + '//' + parts[2]; // Reconstruct the base URL

  // Define the replacement path
  const replacementPath = 'static/images/';

  // Construct the new URL with the replacement path
  const staticPath = baseUrl + '/' + replacementPath;


  const imageUrls = [
    "img_rectangle97.png",
    "img_rectangle97.png",
    "img_rectangle97.png",
    "img_rectangle97.png",
    "img_rectangle97.png",
    "img_rectangle97.png",
    // Add more image URLs as needed
  ];
 

  function saveImages(): void {
    throw new Error("Function not implemented.");
  }

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          border: 'none',
          borderRadius: '0px 10px 10px 10px',
          width: '100%',
          maxWidth: '568px',
          height: '61vh'
        },
      }}
    >
      <div className="flex flex-col font-raleway items-center justify-start mx-auto  sm:px-5 w-full">
        <div className="bg-white-A700 flex flex-col gap-3 items-start justify-start p-3 md:px-5 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] shadow-bs  sm:w-full">
          <Text
            className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-auto"
            size="txtRalewayBold24"
          >
            {title}
          </Text>
          <div className="flex flex-col items-start justify-start pb-[17px] w-[478px] sm:w-full">
            <div className="flex flex-col gap-2.5 sm:grid items-start justify-start overflow-auto w-full">
            <List
              className="sm:flex-col flex-row gap-2.5 grid sm:grid-cols-1 grid-cols-4 justify-center w-full"
              orientation="horizontal"
            >
              {imageUrls.map((imageUrl, index) => (
                <div key={`image-${index}`} className="flex flex-1 flex-col h-28 items-center justify-start sm:ml-[0] w-full">
                  <Img
                    className="h-28 md:h-auto object-cover w-28"
                    src={`${staticPath}${imageUrl}`}
                    alt={`Image ${index}`}
                  />

                  {/* example of a bad image or image that failed to upload */}
                  {/* {index === 2 && (
                    <div className="border-2 border-red-500 border-solid p-1 relative w-28">
                      <Img
                        className="h-[104px] m-auto object-cover w-[104px]"
                        src={`${staticPath}${imageUrl}`}
                        alt="rectangleNinetySeven"
                      />
                      <Img
                        className="absolute h-6 right-[4%] top-[4%] w-6"
                        src={`${staticPath}img_iconamoonatten.svg`}
                        alt="iconamoonatten"
                      />
                    </div>
                  )} */}
                </div>
              ))}
              {/* Upload image section */}
              <div className="flex flex-1 flex-col h-28 items-center justify-start sm:ml-[0] w-full" onClick={handleBrowseClick}>
                <div className="bg-white-A700 border border-blue_gray-500 border-dashed flex flex-col h-28 items-center justify-start p-11 md:px-10 sm:px-5 w-28">
                  <Img
                    className="h-6 w-6"
                    src={`${staticPath}img_mdiimageplusoutline.svg`}
                    alt="mdiimageplusout"
                  />
                </div>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  multiple
                />
                {/* Hidden input element for file selection */}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  multiple
                  ref={fileInputRef}
                />
              </div>
            </List>


              


            </div>
          </div>
          <div className="flex sm:flex-col flex-row gap-[47px] items-start justify-start w-[478px] sm:w-full">
            <div className="flex flex-row gap-[17px] items-start justify-start w-full">
              <Text
                className="flex-1 text-base text-blue-900 tracking-[0.15px] w-auto"
                size="txtRalewayRomanRegular16"
              >
                Sensitivity Score
              </Text>
              <Text
                className="text-base text-black-900 tracking-[0.15px] w-auto"
                size="txtRalewayRomanRegular16Black900"
              >
                {sensivityScore}
              </Text>
            </div>
            <div className="flex flex-row gap-[17px] items-start justify-start w-full">
              <Text
                className="flex-1 text-base text-blue-900 tracking-[0.15px] w-auto"
                size="txtRalewayRomanRegular16"
              >
                AI Score:
              </Text>
              <Text
                className="text-base text-black-900 tracking-[0.15px] w-auto"
                size="txtRalewayRomanRegular16Black900"
              >
                {aiScore}
              </Text>
            </div>
          </div>
          <div className="bg-gray-100 flex flex-col items-start justify-start px-4 py-1.5 rounded">
            <div className="flex flex-col items-start justify-start py-2 w-full">
              <Text
                className="leading-[150.00%] max-w-[507px] md:max-w-full text-base text-gray-800 tracking-[0.15px]"
                size="txtRalewayRomanRegular16Gray800"
              >
                Please consider that AI score is different from your manual
                score, maybe you have to adjust it
              </Text>
            </div>
          </div>

          <div className="flex flex-row gap-3 items-start justify-start pt-4 w-auto">
            <Button
                className="!text-white-A700 cursor-pointer font-raleway min-w-[105px] text-center text-lg tracking-[0.81px]"
                shape="round"
                color="blue_gray_500"
                size="xs"
                variant="fill"
                onClick={saveImages}
              >
                Save
              </Button>
              <Button
                className="!text-white-A700 cursor-pointer font-raleway min-w-[105px] text-center text-lg tracking-[0.81px]"
                shape="round"
                color="red_500"
                size="xs"
                variant="fill"
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>
          </div>

        </div>
      </div>
    </Modal>
  );
};

export default ManageImagesModal;
