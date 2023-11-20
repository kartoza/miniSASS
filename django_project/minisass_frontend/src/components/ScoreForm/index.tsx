import React, { useState, FC } from "react";

import { Button, Img, List, Text } from "../../components";
import UploadModal from "../../components/UploadFormModal";
import ManageImagesModal from "../../components/ManageImagesModal";

interface AdditionalData {
  dataFormInput: string;
}

interface ScoreFormProps {
  onCancel: () => void;
  additionalData: AdditionalData;
}

const ScoreForm: FC<ScoreFormProps> = ({ onCancel, additionalData }) => {

  // TODO populate with values from api
  const ScoreList = [
    { groups: "Worms", sensetivityScore: "2.43", id: "1" },
    { groups: "Leeches", sensetivityScore: "2.43", id: "2" },
    { groups: "Crabs or Shrimps", sensetivityScore: "2.43", id: "3" },
    { groups: "Stoneflies", sensetivityScore: "3.43", id: "4" },
    { groups: "Minnow mayflies", sensetivityScore: "2", id: "5" },
    { groups: "Other Mayflies", sensetivityScore: "2.313", id: "6" },
    { groups: "Damselflies", sensetivityScore: "2.43", id: "7" },
    { groups: "Dragonflies", sensetivityScore: "2.43", id: "8" },
    { groups: "Bugs or beetles", sensetivityScore: "2.3", id: "9" },
    { groups: "Caddisflies", sensetivityScore: "7.43", id: "10" },
    { groups: "True flies", sensetivityScore: "12.43", id: "11" },
    { groups: "Snails", sensetivityScore: "1.343", id: "12" },
  ];

  const [manageImagesModalData, setManageImagesModalData] = useState({
    groups: '',
    sensetivityScore: '',
    id: '',
  });
  

  const [selectedButton, setSelectedButton] = useState(null);

  const [buttonStates, setButtonStates] = useState(ScoreList.map(score => ({ id: score.id, showManageImages: false })));

  const handleButtonClick  = (id) => {
    const updatedButtonStates = buttonStates.map(buttonState => {
      if (buttonState.id === id) {
        return { ...buttonState, showManageImages: !buttonState.showManageImages };
      }
      return buttonState;
    });
    setButtonStates(updatedButtonStates);
    openUploadModal();
  };

  const [checkboxStates, setCheckboxStates] = useState(
    ScoreList.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {})
  );

  const totalScore = ScoreList.reduce((acc, curr) => acc + parseFloat(curr.sensetivityScore), 0);
  const numberOfGroups = ScoreList.length;
  const averageScore = totalScore / numberOfGroups;

  // Function to log the state of checkboxes
  const handleSave = () => {
    console.log(checkboxStates); // Log the state of checkboxes
    console.log('values ',additionalData);
    console.log(`Total Score: ${totalScore}`);
    console.log(`Number of Groups: ${numberOfGroups}`);
    console.log(`Average Score: ${averageScore}`);
  };

  // Function to handle checkbox changes
  const handleCheckboxChange = (id) => {
    setCheckboxStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isManageImagesModalOpen, setIsManageImagesModalOpen] = useState(false);

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const openManageImagesModal = (id, groups, sensetivityScore) => {
    setIsManageImagesModalOpen(true);
    console.log('assigning ',groups, ' ',sensetivityScore, ' ', ' ',id)
    setManageImagesModalData({
      'groups': groups,
      'sensetivityScore': sensetivityScore,
      'id': id,
    });
  };

  const closeManageImagesModal = () => {
    setIsManageImagesModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col font-raleway items-center justify-start mx-auto p-0.5 w-full" 
        style={{
          height: '75vh',
          overflowY: 'auto',
          overflowX: 'auto'
        }}
      >
        <div className=" flex flex-col gap-3  items-start justify-start p-3 md:px-5 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] shadow-bs w-[568px] sm:w-full">
          <Text className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-auto" size="txtRalewayBold24">
            Score
          </Text>
          <div className="flex flex-row items-center justify-between w-[71%] md:w-full">
            <Text className="text-blue-900 text-lg" size="txtRalewayBold18">
              Groups
            </Text>
            <Text className="text-blue-900 text-lg" size="txtRalewayBold18" style={{marginRight: "10%"}}>
              Sensitivity Score
            </Text>
          </div>

          {/* Tabular-like structure */}
          <div className="sm:gap-5 items-start justify-start overflow-x-auto w-full">
            {ScoreList.map((props, index) => (
              <div key={`Row${index}`} className="flex flex-row items-center justify-between w-full">
                {/* Column 1 - Groups with Information Modal */}
                <div className="flex items-center justify-start w-[200px]">
                  <div className="flex flex-col items-center justify-start w-[42px]">
                    <div className="flex flex-col items-start justify-start p-[9px] w-[42px]">
                      <input 
                        type="checkbox" 
                        id={`checkbox-${props.id}`}
                        checked={checkboxStates[props.id]}
                        onChange={() => handleCheckboxChange(props.id)}
                        style={{ borderRadius: '4px'}}
                      ></input>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-start w-auto">
                    <Text
                      className="text-base text-gray-800 tracking-[0.15px] w-auto"
                      size="txtRalewayRomanRegular16"
                    >
                      {props?.groups}
                    </Text>
                  </div>
                </div>

                {/* Column 2 - Sensitivity Score */}
                <div className="flex sm:flex-1 flex-col font-roboto gap-4 items-start justify-start w-[100px]">
                  <Text className="text-blue-900 text-lg" size="txtRalewayBold18">
                    {props.sensetivityScore}
                  </Text>
                </div>

                {/* Column 3 - Select or Manage Images Button */}
                <div className="flex sm:flex-1 flex-col font-raleway gap-2 items-start justify-start w-[210px]" style={{marginBottom:'2%'}}>
                  {buttonStates.map((buttonState, btnIndex) => {
                    if (buttonState.id === props.id) {
                      return (
                        <React.Fragment key={`Button-${btnIndex}`}>
                          {!buttonState.showManageImages && (
                            <Button
                              id={`button-${props.id}`}
                              type="button"
                              className="!text-white-A700 cursor-pointer font-raleway min-w-[198px] text-center text-lg tracking-[0.81px]"
                              shape="round"
                              color="blue_gray_500"
                              size="xs"
                              variant="fill"
                              onClick={() => handleButtonClick(props.id)}
                            >
                              Upload images
                            </Button>
                          )}
                          {buttonState.showManageImages && (
                            <Button
                              type="button"
                              className="!text-white-A700 cursor-pointer font-raleway min-w-[198px] text-center text-lg tracking-[0.81px]"
                              shape="round"
                              color="blue_gray_500"
                              size="xs"
                              variant="fill"
                              onClick={()=> openManageImagesModal(props.id, props.groups, props.sensetivityScore)}
                            >
                              Manage Images
                            </Button>
                          )}
                        </React.Fragment>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>




          {/* Display calculated values */}
          <div className="flex flex-row gap-[17px] items-start justify-start w-auto">
            <Text
              className="leading-[136.40%] text-blue-900 text-lg"
              size="txtRalewayBold18"
            >
              <>
                Total score:
                <br />
                Number of groups:
                <br />
                Average score:
              </>
            </Text>
            <Text
              className="leading-[136.40%] text-black-900 text-lg"
              size="txtRalewayRomanRegular18"
            >
              <>
                {totalScore.toFixed(2)}<br />
                {numberOfGroups}<br />
                {averageScore.toFixed(2)}
              </>
            </Text>
          </div>

          {/* Save and Cancel Buttons */}
          <div className="flex flex-row gap-3 items-start justify-start w-auto">
            <Button
              className="!text-white-A700 cursor-pointer font-raleway min-w-[105px] text-center text-lg tracking-[0.81px]"
              shape="round"
              color="blue_gray_500"
              size="xs"
              variant="fill"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              className="!text-white-A700 cursor-pointer font-raleway min-w-[105px] text-center text-lg tracking-[0.81px]"
              shape="round"
              color="red_500"
              size="xs"
              variant="fill"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>

        </div>
        <UploadModal isOpen={isUploadModalOpen} onClose={closeUploadModal} onSubmit={null} />
        <ManageImagesModal 
          title={manageImagesModalData.groups} 
          isOpen={isManageImagesModalOpen} 
          onClose={closeManageImagesModal} 
          onSubmit={null} 
          id={manageImagesModalData.id}
          sensivityScore={manageImagesModalData.sensetivityScore}
          aiScore={'1.0'} // Adjust this as needed
        />
      </div>
    </>
  );
};

export default ScoreForm;
