import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Img, List, Text } from "../../components";
import UploadModal from "../../components/UploadFormModal";
import ManageImagesModal from "../../components/ManageImagesModal";
import { globalVariables } from "../../utils";
import Modal from 'react-modal';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import {useAuth} from "../../AuthContext";
import ConfirmationDialogRaw from "../../components/ConfirmationDialog";
import CircularProgress from '@mui/material/CircularProgress';


interface ScoreFormProps {
  onCancel: () => void;
  additionalData: {};
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProceedToSavingData: React.Dispatch<React.SetStateAction<boolean>>;
  proceedToSavingData: boolean;
  setIsDisableNavigations: React.Dispatch<React.SetStateAction<boolean>>;
}


const ScoreForm: React.FC<ScoreFormProps> = ({ onCancel, additionalData, setSidebarOpen, setProceedToSavingData, proceedToSavingData, setIsDisableNavigations }) => {
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
  const [selectedPests, setSelectedPests] = useState('');
  const {dispatch, state} = useAuth();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [allowSaving, setAllowSaving] = useState(false);
  

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    handleCloseSidebar()
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  useEffect(() => {
    const fetchScoreGroups = async () => {
        try {
            setIsSavingData(true);
            const response = await axios.get(`${globalVariables.baseUrl}/group-scores/`);
            if (response.status === 200) {
                setScoreGroups(response.data);
                setButtonStates(response.data.map(score => ({ id: score.id, showManageImages: false })));
                setIsSavingData(false);
            } else {
                setTimeout(fetchScoreGroups, 5000);
            }
        } catch (error) {
            console.error('Error fetching score groups:', error);
            setTimeout(fetchScoreGroups, 5000);
        }
    };

    fetchScoreGroups();
}, []);


  const [manageImagesModalData, setManageImagesModalData] = useState({
    groups: '',
    sensetivityScore: '',
    id: '',
    images: []
  });

  const handleButtonClick = (id) => {
    setIsAddMore(true);
    setOpenImagePestId(id);
    setRefetchImages(true); //trigger refetching of images
  };

  const [checkboxStates, setCheckboxStates] = useState(
    scoreGroups.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {})
  );

  // const [proceedToSavingData, setProceedToSavingData] = useState(false)
  const [observationId, setObservationId] = useState(0);
  const [siteId, setSiteId] = useState(0);

  // Function to log the state of checkboxes
  const handleSave = async (saveToExistingSite  = false) => {
    setIsSavingData(true)
    try {
      
      const storedState = localStorage.getItem('authState');
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        const user_email = parsedState.userData.email;
        const user_level = await axios.get(
          `${globalVariables.baseUrl}/authentication/api/user-profile/is-expert/${user_email}/`
        );

        if(user_level.data.is_expert){
          additionalData.flag = 'clean'
        }else additionalData.flag = 'dirty'
      }

      // check for empty measurement values
      const  datainput  = additionalData;

      // fields to check for empty values
      const fieldsToCheck = ['waterclaritycm', 'watertemperatureOne', 'ph', 'dissolvedoxygenOne', 'electricalconduOne', 'watertemperatureOne'];

      fieldsToCheck.forEach(field => {
        if (datainput[field] === '') {
          datainput[field] = null;
        }
      });
      
      // Create an object with the data to be saved
      const observationsData = {
        score:averageScore,
        datainput: additionalData,
      };

      scoreGroups.map((sg) => {
        observationsData[sg.db_field] = checkboxStates['' + sg.id]
      })

      var form_data = new FormData();
      additionalData?.images?.map((file, idx) => {
        form_data.append('image_' + idx, file);
      })
      if (localStorage.getItem('siteId') !== "0") {
        form_data.append('create_site_or_observation', JSON.stringify(false));
        setCreateNewSiteOrObservation(false);
      } else if (additionalData.selectedSite) {
        if(additionalData.selectedSite.value)
          localStorage.setItem('siteId', additionalData.selectedSite.value)
        else
          localStorage.setItem('siteId', additionalData.selectedSite)
        form_data.append('create_site_or_observation', JSON.stringify(false));
        setCreateNewSiteOrObservation(false);
      } else {
        form_data.append('create_site_or_observation', JSON.stringify(true));
        setCreateNewSiteOrObservation(true);
      }
      form_data.append('data', JSON.stringify(observationsData));
      const obs_id = localStorage.getItem('observationId') || observationId;
      const site_id = localStorage.getItem('siteId') || siteId;
      form_data.append('observationId', JSON.stringify(obs_id));
      form_data.append('siteId', JSON.stringify(site_id));
      if(saveToExistingSite === true){
        form_data.append('saveToSite', JSON.stringify(true));
      }else form_data.append('saveToSite', JSON.stringify(false));

      axios.defaults.headers.common['Authorization'] = `Bearer ${state.user.access_token}`;
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
        setIsCloseDialogOpen(false)
        localStorage.setItem('observationId', JSON.stringify(0))
        localStorage.setItem('siteId', JSON.stringify(0))
        if (response.data.status.includes('error')) {
          if("Site name already exists" === response.data.message){
            setIsCloseSiteDialogOpen(true);
          }else {
            if(response.data.message === "")
              setErrorMessage("something unexpectedly went wrong, please try again. If the issue should persist ,contact the system administrator via the contact us form describing the problem you're facing.");
            else setErrorMessage(response.data.message)
            setIsErrorModalOpen(true);
          }
        }else {
          setProceedToSavingData(false);
          setIsSuccessModalOpen(true);
          setIsDisableNavigations(false);
        }
      }
    } catch (exception) {
      setIsSavingData(false)
      setErrorMessage(exception.message);
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
      // Find the newly added group
      const newlyAddedGroup = scoreGroups.find((group) => group.id === id);
      const temp_totalScore = temp_checkedGroups.reduce((acc, curr) => acc + parseFloat(curr.sensitivity_score), 0);
      const temp_numberOfGroups = temp_checkedGroups.length;
      const temp_averageScore = temp_numberOfGroups !== 0 ? temp_totalScore / temp_numberOfGroups : 0;

      setCheckedGroups(temp_checkedGroups)
      if(temp_checkedGroups.length > 0){
        setSelectedPests(newlyAddedGroup.name)
        setAllowSaving(true)
      }else setAllowSaving(false)
      
      // disabled upload buttons
      const newCheckedState = [...isCheckboxChecked];
      newCheckedState[id] = !newCheckedState[id];
      setIsCheckboxChecked(newCheckedState);

      if(temp_checkedGroups.length > 0)
        if (additionalData.selectedSite && additionalData.date) 
          setProceedToSavingData(true)
        else if (additionalData.latitude && additionalData.longitude && additionalData.riverName && additionalData.siteName && additionalData.siteDescription && additionalData.date)
          setProceedToSavingData(true)
        else setProceedToSavingData(false)
      else setProceedToSavingData(false)
      setAverageScore(temp_averageScore)
      setNumberOfGroups(temp_numberOfGroups)
      setTotalScore(temp_totalScore)

      return updatedCheckboxStates;
    });
  };

  const [isManageImagesModalOpen, setIsManageImagesModalOpen] = useState(false);
  const [isAddMore, setIsAddMore] = useState(false);
  // disabled upload buttons
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(Array(13).fill(false));

  const closeUploadModal = () => {
    setOpenImagePestId(0)
  };

  const openManageImagesModal = (id, groups, sensetivityScore, pest_images) => {
    setIsManageImagesModalOpen(true);
    setRefetchImages(true)
    // console.log('assigning ', groups, ' ', sensetivityScore, ' ', ' ', id, ' and and images ',pest_images)
    
    setManageImagesModalData({
      'groups': groups,
      'sensetivityScore': sensetivityScore,
      'id': id,
      'images': pest_images
    });
  };


  const closeManageImagesModal = () => {
    setIsManageImagesModalOpen(false);
    setRefetchImages(false)
  };

  const [createSiteOrObservation, setCreateNewSiteOrObservation] = useState(true);
  const [refetchImages, setRefetchImages] = useState(false);

  const uploadImages = async (pestImages) => {
    setIsUploadingImage(true)

    for (const key in pestImages) {
      if (Object.prototype.hasOwnProperty.call(pestImages, key)) {
        const currentArray = pestImages[key];
    
        if (currentArray.length > 0) {
          var data = new FormData();

          for (const key in pestImages) {
            if (Object.prototype.hasOwnProperty.call(pestImages, key)) {
                pestImages[key].map((file, idx) => {
                  data.append('pest_' + idx + ':' + key, file);
                });
            }
          }

          const storedObservationId = localStorage.getItem('observationId') || 0;
          const storedSiteId = localStorage.getItem('siteId') || 0;
          
          data.append('observationId', JSON.stringify(observationId));

          if (typeof additionalData.selectedSite !== 'undefined' && additionalData.selectedSite !== null && additionalData.selectedSite !== "") {
            if(additionalData.selectedSite.value)
              data.append('siteId', JSON.stringify(additionalData.selectedSite.value));
            else data.append('siteId', JSON.stringify(additionalData.selectedSite));
          } else
            {
              data.append('siteId', JSON.stringify(siteId));
              data.append('siteName',additionalData?.siteName)
              data.append('riverName',additionalData?.riverName)
              data.append('siteDescription',additionalData?.siteDescription)
              data.append('rivercategory',additionalData?.rivercategory)
              data.append('latitude',additionalData?.latitude)
              data.append('longitude',additionalData?.longitude)
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${state.user.access_token}`;

          try{
            setRefetchImages(false)

            const response = await axios.post(
              `${globalVariables.baseUrl}/monitor/upload-pest-images/`,
              data,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
            );
        
            if(response.status == 200){
              setIsUploadingImage(false)
              setObservationId(response.data.observation_id)
              setSiteId(response.data.site_id)
              setPestImages({})
              setCreateNewSiteOrObservation(false)
              localStorage.setItem('observationId', JSON.stringify(response.data.observation_id));
              localStorage.setItem('siteId', JSON.stringify(response.data.site_id));
              setRefetchImages(true)
            }
          }catch( exception ){
            console.log(exception.message);
          }
        } 
      }
    }
  }

  useEffect(() => {
      const handleUnload = () => {
          const storedObservationId = localStorage.getItem('observationId') || 0;
          deleteObservation(parseInt(storedObservationId));
      };
  
      window.addEventListener('unload', handleUnload);
  
      return () => {
          window.removeEventListener('unload', handleUnload);
      };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (proceedToSavingData) {
        const message = "You have unsaved data, are you sure you want to leave?";
        event.returnValue = message;
        return message;
        
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
}, [proceedToSavingData]);

  const deleteObservation = async (observationId) => {
    try {
      await axios.delete(`monitor/observations/${observationId}/`);
    } catch (error) {
      setError(error);
    }
  };
  
  const [isCloseDialogOpen, setIsCloseDialogOpen] = React.useState(false);
  const [isCloseSiteDialogOpen, setIsCloseSiteDialogOpen] = React.useState(false);

  const handleCloseSidebar = () => {
    if(proceedToSavingData)
      setIsCloseDialogOpen(true)
    else if(
      additionalData.riverName !== '' && 
      additionalData.siteName !== '' && 
      additionalData.siteDescription !== '' && 
      additionalData.date !== ''
    )
      setIsCloseDialogOpen(true)
    else
      setSidebarOpen(false)
  };

  const handleCloseConfirm = () => {
    const storedObservationId = localStorage.getItem('observationId') || 0;
    deleteObservation(parseInt(storedObservationId));
    setIsCloseDialogOpen(false);
    setSidebarOpen(false);
    setIsDisableNavigations(false)
  };

  const handleDialogCancel = () => {
    setIsCloseDialogOpen(false)
  };

  const handleSiteDialogCancel = () => {
    setIsCloseSiteDialogOpen(false)
  };

  const handleSiteCloseConfirm = () => {
    handleSave(true)
    setIsCloseSiteDialogOpen(false)
  };

  
  
  return (
    <>

      <ConfirmationDialogRaw
        id="logout-dialog"
        keepMounted
        value="logout"
        open={isCloseDialogOpen}
        onClose={handleDialogCancel}
        onConfirm={handleCloseConfirm}
        title="Confirm Close"
        message="You have unsaved data ,are you sure want to close?"
      />

      <ConfirmationDialogRaw
        id="site-dialog"
        keepMounted
        value="SiteError"
        open={isCloseSiteDialogOpen}
        onClose={handleSiteDialogCancel}
        onConfirm={handleSiteCloseConfirm}
        title="Cannot Save Observation"
        message="You chose create new site but the Site name you provided already exists, should the observation be saved to this site instead?"
      />
      
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
                                // disabled upload buttons
                                disabled={!isCheckboxChecked[props.id] ? true : false}
                                style={{ marginTop: '10px', opacity: isCheckboxChecked[props.id]  ? 1 : 0.5 }}
                                onClick={() => handleButtonClick(props.id)}
                              >
                                Upload images
                                {pestImages[props.id]?.length ? <div style={{fontSize: "0.8rem"}}>({pestImages[props.id]?.length} images uploaded)</div> : null}
                              </Button>
                              <UploadModal
                                key={`image-${props.id}`}
                                isOpen={openImagePestId === props.id && isAddMore} 
                                onClose={closeUploadModal}
                                onSubmit={
                                  files => {
                                    pestImages[props.id] = files
                                    setPestImages({...pestImages})
                                    setOpenImagePestId(0)
                                    setIsAddMore(false)
                                    const updatedButtonStates = buttonStates.map(buttonState => {
                                      if (buttonState.id === props.id) {
                                        return { ...buttonState, showManageImages: !buttonState.showManageImages };
                                      }
                                      return buttonState;
                                    });
                                    setButtonStates(updatedButtonStates);
                                    uploadImages(pestImages)
                                  }
                                }/>
                              </>
                          )}
                          {buttonState.showManageImages && (
                          <>
                              {isUploadingImage ? (
                                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft:'11px' }}>
                                    <CircularProgress style={{ color: '#288b31' }} />
                                </div>
                              ) : (
                                  <>
                                      <Button
                                          type="button"
                                          className="!text-white-A700 cursor-pointer font-raleway min-w-[198px] text-center text-lg tracking-[0.81px]"
                                          shape="round"
                                          color="red_500"
                                          size="xs"
                                          variant="fill"
                                          // disabled upload buttons
                                          disabled={!isCheckboxChecked[props.id] ? true : false}
                                          style={{ marginTop: '10px', opacity: isCheckboxChecked[props.id] ? 1 : 0.5 }}
                                          onClick={() => openManageImagesModal(props.id, props.name, props.sensitivity_score, pestImages[props.id])}
                                      >
                                          Manage Images
                                          {pestImages[props.id]?.length ? <div style={{ fontSize: "0.8rem" }}>({pestImages[props.id]?.length} images uploaded)</div> : null}
                                      </Button>
                                      <UploadModal
                                          key={`image-${props.id}`}
                                          isOpen={openImagePestId === props.id && isAddMore}
                                          onClose={closeUploadModal}
                                          onSubmit={files => {
                                              pestImages[props.id] = files;
                                              setPestImages({ ...pestImages });
                                              setOpenImagePestId(0);
                                              setIsAddMore(false);
                                              setManageImagesModalData({
                                                  'groups': props.name,
                                                  'sensetivityScore': props.sensitivity_score,
                                                  'id': props.id,
                                                  'images': pestImages[props.id],
                                                  'saved_group_prediction': {}
                                              });
                                              uploadImages(pestImages);
                                          }}
                                      />
                                  </>
                              )}
                          </>
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
              style={{
                opacity: (proceedToSavingData && allowSaving) ? 1 : 0.5,
              }}
              disabled={(!proceedToSavingData && !allowSaving)}
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
              Back
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
              {errorMessage.message ? (
                 <div>
                  <Text size="txtRalewayBold18" className="text-red-500">
                    Something unexpectedly went wrong. Please try again.
                  </Text>
                 <Text size="txtRalewayBold18" className="text-red-500">
                   If the problem persists, kindly contact the system administrator via the contact form.
                 </Text>
                 <Text size="txtRalewayBold18" className="text-red-500">
                   We apologize for the inconvenience.
                 </Text>
                </div>
              ) : null
            }
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
          handleButtonClick={handleButtonClick}
          refetchImages={refetchImages}
        />
      </div>
    </>
  );
};

export default ScoreForm;
