import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Img, List, Text } from "../../components";
import UploadModal from "../../components/UploadFormModal";
import ManageImagesModal from "../../components/ManageImagesModal";
import { globalVariables } from "../../utils";


interface ScoreFormProps {
  onCancel: () => void;
  additionalData: {};
}

const ScoreForm: React.FC<ScoreFormProps> = ({ onCancel, additionalData }) => {
  const [scoreGroups, setScoreGroups] = useState([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonStates, setButtonStates] = useState([]);

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  useEffect(() => {
    const fetchScoreGroups = async () => {
      try {
        const response = await axios.get(`${globalVariables.baseUrl}/group-scores/`);
        setScoreGroups(response.data);
        setButtonStates(response.data.map(score => ({ id: score.id, showManageImages: false })))
      } catch (error) {
        console.error('Error fetching score groups:', error);
      }
    };

    fetchScoreGroups();
  }, []);

  const [manageImagesModalData, setManageImagesModalData] = useState({
    groups: '',
    sensetivityScore: '',
    id: '',
  });

  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (id) => {
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
    scoreGroups.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {})
  );

  const totalScore = scoreGroups.reduce((acc, curr) => acc + parseFloat(curr.sensetivity_score), 0);
  const numberOfGroups = scoreGroups.length;
  const averageScore = totalScore / numberOfGroups;

  // Function to log the state of checkboxes
  const handleSave = async () => {
    

    try {

      console.log(checkboxStates); // Log the state of checkboxes
      console.log('data from first form ', additionalData);
      console.log(`Total Score: ${totalScore}`);
      console.log(`Number of Groups: ${numberOfGroups}`);
      console.log(`Average Score: ${averageScore}`);

      // Create an object with the data to be saved
      const observationsData = {
        flatworms :checkboxStates['1'],
        leeches:checkboxStates['2'],
        crabs_shrimps :checkboxStates['3'],
        stoneflies :checkboxStates['4'],
        minnow_mayflies :checkboxStates['5'],
        other_mayflies :checkboxStates['6'],
        damselflies:checkboxStates['7'],
        dragonflies:checkboxStates['8'],
        bugs_beetles :checkboxStates['9'],
        caddisflies:checkboxStates['10'],
        true_flies:checkboxStates['11'],
        snails:checkboxStates['12'],
        score:totalScore,
        datainput: additionalData,
      };
  

      const response = await axios.post(`${globalVariables.baseUrl}/monitor/observations-create/`, observationsData);

      if(response.status == 200){
        setIsSuccessModalOpen(true);
      }
  
      
    } catch (error) {
      setErrorMessage(error);
      setIsErrorModalOpen(true);
    }
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
    console.log('assigning ', groups, ' ', sensetivityScore, ' ', ' ', id)
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
          height: '73vh',
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
            <Text className="text-blue-900 text-lg" size="txtRalewayBold18" style={{ marginRight: "10%" }}>
              Sensitivity Score
            </Text>
          </div>

          {/* Tabular-like structure */}
          <div className="sm:gap-5 items-start justify-start overflow-x-auto w-full">
            {scoreGroups.map((props, index) => (
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
                        style={{ borderRadius: '4px' }}
                      ></input>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-start w-auto">
                    <Text
                      className="text-base text-gray-800 tracking-[0.15px] w-auto"
                      size="txtRalewayRomanRegular16"
                    >
                      {props?.name}
                    </Text>
                  </div>
                </div>

                {/* Column 2 - Sensitivity Score */}
                <div className="flex sm:flex-1 flex-col font-roboto gap-4 items-start justify-start w-[100px]">
                  <Text className="text-blue-900 text-lg" size="txtRalewayBold18">
                    {props.sensetivity_score}
                  </Text>
                </div>

                {/* Column 3 - Select or Manage Images Button */}
                <div className="flex sm:flex-1 flex-col font-raleway gap-2 items-start justify-start w-[210px]" style={{ marginBottom: '2%' }}>
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
                              onClick={() => openManageImagesModal(props.id, props.name, props.sensetivity_score)}
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
        {/* Success Modal */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50" style={{ backdropFilter: 'blur(5px)' }}></div>
            <div className="absolute bg-white p-8 rounded-md shadow-md">
              <Text size="txtRalewayBold18" className="text-green-500">
                Your data was successfully captured.
              </Text>
              <Button
                className="mt-4 text-white-A700 cursor-pointer font-raleway min-w-[105px] text-center text-lg tracking-[0.81px]"
                shape="round"
                color="blue_gray_500"
                size="xs"
                variant="fill"
                onClick={closeSuccessModal}
              >
                OK
              </Button>
            </div>
          </div>
        )}
        
        {/* Error Modal */}
        {isErrorModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50" style={{ backdropFilter: 'blur(5px)' }}></div>
            <div className="absolute bg-white p-8 rounded-md shadow-md">
              <Text size="txtRalewayBold18" className="text-red-500">
                {errorMessage}
              </Text>
              <Button
                className="mt-4 text-white-A700 cursor-pointer font-raleway min-w-[105px] text-center text-lg tracking-[0.81px]"
                shape="round"
                color="red_500"
                size="xs"
                variant="fill"
                onClick={closeErrorModal}
              >
                OK
              </Button>
            </div>
          </div>
        )}

        <UploadModal isOpen={isUploadModalOpen} onClose={closeUploadModal} onSubmit={null} />
        <ManageImagesModal
          title={manageImagesModalData.groups}
          isOpen={isManageImagesModalOpen}
          onClose={closeManageImagesModal}
          onSubmit={null}
          id={manageImagesModalData.id}
          sensivityScore={manageImagesModalData.sensetivityScore}
          aiScore={'1.0'} // TODO this will be dynamic
        />
      </div>
    </>
  );
};

export default ScoreForm;
