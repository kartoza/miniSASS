import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Img, List, Text } from "../../components";
import UploadModal from "../../components/UploadFormModal";
import ManageImagesModal from "../../components/ManageImagesModal";
import { globalVariables } from "../../utils";
import Modal from 'react-modal';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';



interface ScoreFormProps {
  onCancel: () => void;
  additionalData: {};
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PESTS = [
  '-', // This is to skip idx 0
  'flatworms',
  'leeches',
  'crabs_shrimps',
  'stoneflies',
  'minnow_mayflies',
  'other_mayflies',
  'damselflies',
  'dragonflies',
  'bugs_beetles',
  'caddisflies',
  'true_flies',
  'snails'
]


const ScoreForm: React.FC<ScoreFormProps> = ({ onCancel, additionalData, setSidebarOpen }) => {
  const [scoreGroups, setScoreGroups] = useState([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonStates, setButtonStates] = useState([]);
  const [checkedGroups, setCheckedGroups] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [numberOfGroups ,setNumberOfGroups] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [openImagePestId, setOpenImagePestId] = useState(0);
  const [pestImages, setPestImages] = useState({});
  const [isSavingData, setIsSavingData] = useState(false);

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  useEffect(() => {
    const fetchScoreGroups = async () => {
      try {
        setIsSavingData(true)
        const response = await axios.get(`${globalVariables.baseUrl}/group-scores/`);
        if(response.status == 200){
          setScoreGroups(response.data);
          setButtonStates(response.data.map(score => ({ id: score.id, showManageImages: false })))
          setIsSavingData(false)
        } else; // TODO trigger a retry in about 3 seconds
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

  const handleButtonClick = (id) => {
    // TODO:
    //  It should be used when image is already uploaded
    // const updatedButtonStates = buttonStates.map(buttonState => {
    //   if (buttonState.id === id) {
    //     return { ...buttonState, showManageImages: !buttonState.showManageImages };
    //   }
    //   return buttonState;
    // });
    // setButtonStates(updatedButtonStates);
    setOpenImagePestId(id);
  };

  const [checkboxStates, setCheckboxStates] = useState(
    scoreGroups.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {})
  );

  // Function to log the state of checkboxes
  const handleSave = async () => {
    setIsSavingData(true)
    try {
      // Create an object with the data to be saved
      const observationsData = {
        score:averageScore,
        datainput: additionalData,
      };
      PESTS.map((pest,idx) => {
        observationsData[pest] = checkboxStates['' + idx]
      })

      var form_data = new FormData();
      additionalData?.images?.map((file, idx) => {
        form_data.append('image_' + idx, file);
      })
      for (var key in pestImages) {
        const pest = PESTS[key]
        pestImages[key].map((file, idx) => {
          form_data.append('pest_' + idx + ':' + pest, file);
        })
      }
      form_data.append('data', JSON.stringify(observationsData));

      const response = await axios.post(
        `${globalVariables.baseUrl}/monitor/observations-create/`,
        form_data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if(response.status == 200){
        setIsSavingData(false)
        console.error(response.data);
        if (response.data.status.includes('error')) {
          setErrorMessage(response.data.message);
          setIsErrorModalOpen(true);
        }else {
          setIsSuccessModalOpen(true);
        }
      }
    } catch (error) {
      setIsSavingData(false)
      setErrorMessage(error.message);
      setIsErrorModalOpen(true);
    }
  };

  // Function to handle checkbox changes
  const handleCheckboxChange = (id) => {
    setCheckboxStates((prevState) => {
      const updatedCheckboxStates = {
        ...prevState,
        [id]: !prevState[id],
      };

      const temp_checkedGroups = scoreGroups.filter((group) => updatedCheckboxStates[group.id]);
      const temp_totalScore = temp_checkedGroups.reduce((acc, curr) => acc + parseFloat(curr.sensitivity_score), 0);
      const temp_numberOfGroups = temp_checkedGroups.length;
      const temp_averageScore = temp_numberOfGroups !== 0 ? temp_totalScore / temp_numberOfGroups : 0;

      setCheckedGroups(temp_checkedGroups)
      setAverageScore(temp_averageScore)
      setNumberOfGroups(temp_numberOfGroups)
      setTotalScore(temp_totalScore)

      return updatedCheckboxStates;
    });
  };

  const [isManageImagesModalOpen, setIsManageImagesModalOpen] = useState(false);

  const closeUploadModal = () => {
    setOpenImagePestId(0)
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

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
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
        {isSavingData ? (
          <div className=" flex flex-col gap-3  items-start justify-start p-3 md:px-5 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] shadow-bs w-[568px] sm:w-full">
            <div className="flex flex-row gap-80 w-auto sm:w-full" style={{marginLeft: '0px'}}>
              <div style={{ width: '535px'}}>
                <LinearProgress color="success" />
              </div>
            </div>
          </div>
          
        ) :
        (

        <div className=" flex flex-col gap-3  items-start justify-start p-3 md:px-5 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] shadow-bs w-[568px] sm:w-full">
          <div
            className="flex flex-row gap-80 w-auto sm:w-full"
          >
            <Text className="text-2xl md:text-[22px] text-blue-900 sm:text-xl w-auto" size="txtRalewayBold24">
              Score
            </Text>
            <Img
              className="h-6 w-6 common-pointer"
              src={`${globalVariables.staticPath}img_icbaselineclose.svg`}
              alt="close"
              style={{
                marginLeft: '118px'
              }}
              onClick={handleCloseSidebar}
            />
          </div>
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
                    {props.sensitivity_score}
                  </Text>
                </div>

                {/* Column 3 - Select or Manage Images Button */}
                <div className="flex sm:flex-1 flex-col font-raleway gap-2 items-start justify-start w-[210px]" style={{ marginBottom: '2%' }}>
                  {buttonStates.map((buttonState, btnIndex) => {
                    if (buttonState.id === props.id) {
                      return (
                        <React.Fragment key={`Button-${btnIndex}`}>
                          {!buttonState.showManageImages && (
                            <>
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
                                {pestImages[props.id]?.length ? <div style={{fontSize: "0.8rem"}}>({pestImages[props.id]?.length} images selected)</div> : null}
                              </Button>
                              <UploadModal
                                key={`image-${props.id}`}
                                isOpen={openImagePestId === props.id} onClose={closeUploadModal}
                                onSubmit={
                                  files => {
                                    pestImages[props.id] = files
                                    setPestImages({...pestImages})
                                    setOpenImagePestId(0)
                                  }
                                }/>
                              </>
                          )}
                          {buttonState.showManageImages && (
                            <Button
                              type="button"
                              className="!text-white-A700 cursor-pointer font-raleway min-w-[198px] text-center text-lg tracking-[0.81px]"
                              shape="round"
                              color="blue_gray_500"
                              size="xs"
                              variant="fill"
                              onClick={() => openManageImagesModal(props.id, props.name, props.sensitivity_score)}
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
                {isNaN(totalScore) ? 0 : totalScore.toFixed(2)}<br />
                {numberOfGroups}<br />
                {isNaN(averageScore) ? 0 : averageScore.toFixed(2)}
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
      )}
        {/* Success Modal */}
        <Modal
          isOpen={isSuccessModalOpen}
          onRequestClose={closeSuccessModal}
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
          {isSuccessModalOpen && (
            <div>
              <h3
                  style={{
                    fontFamily: 'Raleway',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    alignItems: 'flex-start',
                    fontSize: '24px',
                    lineHeight: '136.4%',
                    color: '#539987',
                  }}
                >
                  Observation Saved.
                </h3>
                <br />
              <Typography>
                The record was saved successfully.
              </Typography>

              <Button
                  className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
                  color="blue_gray_500"
                  size="xs"
                  variant="fill"
                  style={{ marginLeft: "55%" }}
                  onClick={closeSuccessModal}
                >
                  Ok
                </Button>
            </div>
          )}
        </Modal>

        {/* Error Modal */}
        <Modal
          isOpen={isErrorModalOpen}
          onRequestClose={closeErrorModal}
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
          {isErrorModalOpen && (
            <div>
              <h3
                  style={{
                    fontFamily: 'Raleway',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    alignItems: 'flex-start',
                    fontSize: '24px',
                    lineHeight: '136.4%',
                    color: '#d00501',
                  }}
                >
                  Error.
              </h3>
                
              <br />
            <Text size="txtRalewayBold18" className="text-red-500">
              {errorMessage}
            </Text>
            <Button
                  className="!text-white-A700 cursor-pointer font-raleway min-w-[105px] text-center text-lg tracking-[0.81px]"
                  shape="round"
                  color="red_500"
                  size="xs"
                  variant="fill"
                  style={{ marginLeft: "70%" }}
                  onClick={closeErrorModal}
                >
                  Close
                </Button>
              </div>
          )}
        </Modal>
        
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
