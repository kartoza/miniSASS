import React, { useEffect, useState } from "react";

import { Button, Img, List, Text } from "../../components";
import Modal from 'react-modal';
import { globalVariables } from "../../utils";
import axios from "axios";

interface ManageImageProps {
  title: string;
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: any;
  sensivityScore: string;
  aiScore: string;
  handleButtonClick: (id: any) => void;
}

const ManageImagesModal: React.FC<ManageImageProps> = ({ 
  title, 
  id,
  isOpen, 
  onClose, 
  sensivityScore, 
  aiScore, 
  handleButtonClick,
}) => {


  const [imageUrls, setImages] = useState([])

  const fetch_observation_images = async () => {
    const observationId = parseInt(localStorage.getItem('observationId'))
    const GET_OBSERVATION = globalVariables.baseUrl + `/monitor/observations/observation-details/${observationId}/`

    const get_observation_images = await axios.get(`${GET_OBSERVATION}`);
    
    if (get_observation_images.status === 200) {
      const filteredImages = get_observation_images.data.images.filter((image) => {
        const formattedTitle = title.toLowerCase().replace(/\s+/g, '_');
      
        return image.pest_name.toLowerCase() === formattedTitle;
      });
      
      setImages(filteredImages);
    }

  }

  useEffect(() => {
    if(isOpen)
      fetch_observation_images()
  }, [isOpen]);

  function saveImages(): void {
    onClose();
  }

  function handleAddMoreClick(): void {
    handleButtonClick(id)
  }

  async function handleRemoveImage(id: any): Promise<void> {
    const observationId = parseInt(localStorage.getItem('observationId'))
    const DELETE_PEST_IMAGE = globalVariables.baseUrl + `/monitor/observation-images/${observationId}/delete/${id}`

      const delete_observation_image = await axios.post(`${DELETE_PEST_IMAGE}`);
      
      if (delete_observation_image.status === 200)
        fetch_observation_images()
  }

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

            {imageUrls.map((image, index) => (
              <div key={`image-${index}`} className="relative flex flex-1 flex-col h-28 items-center justify-start sm:ml-[0] w-full">
                <Img
                  className="h-28 md:h-auto object-cover w-28"
                  key={`${image.pest_id}`}
                  src={image.image}
                  alt={`${image.pest_name}`}
                  loading='lazy'
                />
                {/* Add the x icon here (adjust styles as needed) */}
                <div className="absolute top-0 right-0 m-2 cursor-pointer" onClick={() => handleRemoveImage(image.pest_id)}>
                  ✖
                </div>
              </div>
            ))}

              {/* {imageUrls.map((imageUrl, index) => (
                <div key={`image-${index}`} className="flex flex-1 flex-col h-28 items-center justify-start sm:ml-[0] w-full">
                  <Img
                    className="h-28 md:h-auto object-cover w-28"
                    src={`${globalVariables.staticPath}${imageUrl}`}
                    alt={`${imageUrl.name}`}
                  /> */}

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

                {/* </div>
              ))} */}

              {/* Upload image section */}
              <div className="flex flex-1 flex-col h-28 items-center justify-start sm:ml-[0] w-full">
                <div className="bg-white-A700 border border-blue_gray-500 border-dashed flex flex-col h-28 items-center justify-start p-11 md:px-10 sm:px-5 w-28">
                  <Img
                    className="h-6 w-6"
                    src={`${globalVariables.staticPath}img_mdiimageplusoutline.svg`}
                    alt="mdiimageplusout"
                    onClick={handleAddMoreClick}
                  />
                </div>
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
