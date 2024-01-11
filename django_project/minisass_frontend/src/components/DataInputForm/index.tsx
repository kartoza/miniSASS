import React, { useEffect, useState } from "react";

import { Button, Img, Text } from "../../components";
import ClearIcon from '@mui/icons-material/Clear';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import Tooltip from '@mui/material/Tooltip';
import UploadModal from "../../components/UploadFormModal";
import { Instance } from '@popperjs/core';
import { Formik, Form, Field } from 'formik';
import ScoreForm from "../../components/ScoreForm";
import axios from "axios";
import { globalVariables, formatDate } from "../../utils";
import CoordinatesInputForm from "../CoordinatesInputForm";
import Select from 'react-select';
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import {deepClone} from "@mui/x-data-grid/utils/utils";
import LinearProgress from '@mui/material/LinearProgress';

type DataInputFormProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  | "datainputform"
  | "sitedetails"
  | "uploadSiteImages"
  | "rivername"
  | "sitename"
  | "sitedescriptionOne"
  | "defaultslot"
  | "rivercategory"
  | "sitelocation"
  | "selectKnownSite"
  | "selectOnMap"
  | "typeInCoordinates"
  | "observationdetaOne"
  | "date"
  | "collectorsname"
  | "notes"
  | "defaultslotOne"
  | "measurements"
  | "waterclaritycm"
  | "watertemperaturOne"
  | "ph"
  | "dissolvedoxygenOne"
  | "electricalconduOne"
  | "next"
  | "setSidebarOpen"
  | "toggleMapSelection"
  | "handleMapClick"
  | "selectingOnMap"
  | "selectedCoordinates"
  | "resetMap"
  | "siteDetails"
  | "resetSiteDetails"
  | "useSelectOnSite"
> &
  Partial<{
    datainputform: string;
    sitedetails: string;
    uploadSiteImages: string;
    rivername: string;
    sitename: string;
    sitedescriptionOne: string;
    defaultslot: JSX.Element | string;
    rivercategory: string;
    sitelocation: string;
    selectKnownSite: string;
    selectOnMap: string;
    typeInCoordinates: string;
    observationdetaOne: string;
    date: string;
    collectorsname: string;
    notes: string;
    defaultslotOne: JSX.Element | string;
    measurements: string;
    waterclaritycm: string;
    watertemperaturOne: string;
    ph: string;
    dissolvedoxygenOne: string;
    electricalconduOne: string;
    next: string;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleMapSelection: () => void;
    handleMapClick: (longitude: number, latitude: number) => void;
    selectedCoordinates:{longitude: number, latitude: number};
    selectingOnMap: boolean;
    resetMap: () => void;
    siteDetails: {};
    resetSiteDetails: (details: {}) => void;
    useSelectOnSite: (isSelectOnSite: boolean) => void;
    setCursor: (cursor: string) => void
  }>;

const inputOptionsList = [
  { label: "Rocky", value: "rocky" },
  { label: "Sandy", value: "sandy" },
];

const inputOxygenUnitsList = [
  { label: "mg/l", value: "mg/l" },
  { label: "%DO", value: "%DO" },
  { label: "PPM", value: "PPM" },
  { label: "Unknown", value: "uknown" },
];

const inputElectricConductivityUnitsList = [
  { label: "S/m", value: "S/m" },
  { label: "µS/cm", value: "µS/cm" },
  { label: "m S/m", value: "m S/m" },
  { label: "Unknown", value: "uknown" },
];

const SiteSelectionModes = {
    SELECT_KNOWN_SITE: 'Select known site',
    SELECT_ON_MAP: 'Select on map',
    TYPE_IN_COORDINATES: 'Type in coordinates',
    NONE: 'None'
} as const;

type SiteSelectionMode = keyof typeof SiteSelectionModes;

const FETCH_SITES = globalVariables.baseUrl + '/monitor/sites/';

const DataInputForm: React.FC<DataInputFormProps> = (props) => {

  const handleCloseSidebar = () => {
    props.setSidebarOpen(false);
    props.resetMap();
    props.setCursor('')
  };


  // State to store form values
  const [formValues, setFormValues] = useState({
    riverName: '',
    siteName: '',
    siteDescription: '',
    rivercategory: 'rocky',
    sitelocation: '',
    selectKnownSite: '',
    selectOnMap: '',
    typeInCoordinates: '',
    observationdetaOne: '',
    date: '',
    collectorsname: '',
    notes: '',
    measurements: '',
    waterclaritycm: '',
    watertemperaturOne: '',
    ph: '',
    dissolvedoxygenOne: '',
    electricalconduOne: '',
    dissolvedoxygenOneUnit: 'mg/l',
    electricalconduOneUnit: 'S/m',
    latitude: 0,
    longitude: 0,
    selectedSite: '',
    flag: 'dirty'
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectSiteMode, setSelectSiteMode] = useState<SiteSelectionMode | undefined>();
  const [isFetchingSites, setIsFetchingSites] = useState(false);
  const [sites, setSitesList] = useState([]);
  const [enableSiteFields, setEnableSiteFields] = useState(true);
  const [isCreateSite, setIsCreateSite] = useState('createsite');
  const [type, setType] = useState<string>('');
  const [siteUserValues, setSiteUserValues] = useState({
    rivercategory: 'rocky',
    riverName: '',
    siteName: '',
    siteDescription: ''
  });

  // Tooltips positioning
  const positionRef = React.useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const popperRef = React.useRef<Instance>(null);
  const areaRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    positionRef.current = { x: event.clientX, y: event.clientY };

    if (popperRef.current != null) {
      popperRef.current.update();
    }
  };

  const sitePopperRef = React.useRef<Instance>(null);
  const sitePositionRef = React.useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const siteAreaRef = React.useRef<HTMLDivElement>(null);

  const siteHandleMouseMove = (event: React.MouseEvent) => {
    sitePositionRef.current = { x: event.clientX, y: event.clientY };

    if (sitePopperRef.current != null) {
      sitePopperRef.current.update();
    }
  };
  
  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleSelectOnMapClick = () => {
    if (selectSiteMode === 'SELECT_ON_MAP') return;
    props.toggleMapSelection()
    setSelectSiteMode("SELECT_ON_MAP");
  };

  const handleSelectOnTypeCoordinateClick = () => {
    if (selectSiteMode === 'SELECT_ON_MAP') {
      props.toggleMapSelection()
    }
    setSelectSiteMode("TYPE_IN_COORDINATES");
  };

  const handleShowScoreForm = () => {
    setShowScoreForm(true)
  }

  const handleHideScoreForm = () => {
    setShowScoreForm(false)
  }

  const [showScoreForm, setShowScoreForm] = useState(false);

  function handleSelectKnownSite(): void {
    if (selectSiteMode === 'SELECT_KNOWN_SITE') {
      props.resetSiteDetails({})
      setSelectSiteMode('NONE')
      props.useSelectOnSite(false)
    }else {
      props.setCursor('crosshair')
      props.useSelectOnSite(true)
      setSelectSiteMode('SELECT_KNOWN_SITE')
    } 
  }

  const getSites = async () => {
    try {
      if (Object.keys(props.siteDetails).length === 0) {
        setIsFetchingSites(true)
        const response = await axios.get(`${FETCH_SITES}`);
        if (response.status === 200) {
          const sitesList = [
            {
              label: 'None',
              value: 'none',
              rivercategory: '',
              siteName: '',
              siteDescription: '',
              riverName: '',
            },
            ...response.data.map((site) => ({
              label: site.site_name,
              value: site.gid.toString(),
              rivercategory: site.river_cat,
              siteName: site.site_name,
              siteDescription: site.description,
              riverName: site.river_name,
            })),
          ];
          setSitesList(sitesList);
        }
      } else {
        const sitesList = [
          {
            label: props.siteDetails.sitename,
            value: props.siteDetails.gid,
            rivercategory: props.siteDetails.rivercategory,
            siteName: props.siteDetails.sitename,
            siteDescription: props.siteDetails.sitedescription,
            riverName: props.siteDetails.rivername,
          },
        ];
        setSitesList(sitesList);

        setFormValues({
          ...formValues,
          selectedSite: props.siteDetails.gid
        });
      }
      setIsFetchingSites(false);
    } catch (error) {
      console.log(error.message);
    }
  };
  
  useEffect(() => {
    if (selectSiteMode === 'SELECT_KNOWN_SITE') {
      getSites();
    }

    // validations check if object is not empty
    function isObjectEmpty(obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    }
    
    if (!isObjectEmpty(props.siteDetails)) {
      setProceedToSavingData(true)
    }

  }, [selectSiteMode, props.siteDetails]);

  useEffect(() => {
    if (showScoreForm) {
      props.setCursor('')
    } else if(selectSiteMode === 'SELECT_KNOWN_SITE') {
      props.setCursor('crosshair')
    }
  }, [showScoreForm]);

  // Helper function to format date
  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  const customStyles = {
    control: (styles, { isFocused }) => ({
      ...styles,
      borderRadius: '4px',
      width: '300px',
      borderColor: isFocused ? '#539987' : 'rgba(0, 0, 0, 0.23)',
      marginLeft: '210px'
      
    }),
    option: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: isFocused ? '#539987' : 'transparent',
      color: isFocused ? 'white' : 'black',
    }),
    menu: (styles) => ({
      ...styles,
      width: '16.5vw',
      marginLeft: '210px'
    }),
  };

  // form validations
  const [proceedToSavingData, setProceedToSavingData] = useState(false);
  const updateHighlightedFields = () => {
    if (
      formValues.riverName &&
      formValues.siteName &&
      formValues.siteDescription &&
      formValues.date
    ) {
      setProceedToSavingData(true);
    } else if(enableSiteFields){
      setProceedToSavingData(false);
    }
  };

  // form validations
  useEffect(() => {
    if(!proceedToSavingData && enableSiteFields)
      handleSelectOnTypeCoordinateClick()
  }, [proceedToSavingData]);

  return (
    <>
      {!showScoreForm ? (
      <div className={props.className} style={{
        height: '75vh',
        overflowY: 'auto',
        overflowX: 'auto',
      }}>
        <div
            className="flex flex-row gap-80 items-start justify-start w-auto sm:w-full"
          >
          <Text
            className="text-2xl md:text-[22px] text-blue-900 sm:text-xl"
            size="txtRalewayBold24"
          >
            {props?.datainputform}
          </Text>
          <Img
            className="h-6 w-6 common-pointer"
            src={`${globalVariables.staticPath}img_icbaselineclose.svg`}
            alt="close"
            style={{
              marginLeft: '35px'
            }}
            onClick={handleCloseSidebar}
          />
        </div>
        <div className="flex flex-col gap-3 items-start justify-start w-auto sm:w-full">
          {/* Tooltip */}
          <Tooltip
                 title={
                      <React.Fragment>
                        <p style={{ color: 'inherit' }}>
                          <strong>A. Upload Images:</strong> Upload site images to an existing site or on a new one.
                          Just click the "Upload Images" button and proceed.
                        </p>
                        <p style={{ color: 'inherit', marginBottom: '1rem' }}>
                          <strong>B. Select Site on Map:</strong> When enabled, click an area on the map with an existing site,
                          and the site information will reflect in the form. When disabled, all saved sites appear in the
                          select dropdown, and you can choose by clicking the choice, and its info will be reflected in the form.
                        </p>
                      </React.Fragment>
                    }
                    placement="top"
                    arrow
                    PopperProps={{
                      popperRef,
                      anchorEl: {
                        getBoundingClientRect: () => {
                          return new DOMRect(
                            sitePositionRef.current.x,
                            siteAreaRef.current!.getBoundingClientRect().y,
                            0,
                            0,
                          );
                        },
                      },
                    }}
                  >
                    <div className="flex flex-row gap-1 items-start justify-start w-auto"
                      ref={siteAreaRef}
                      onMouseMove={siteHandleMouseMove}
                    >
                      <Text
                        className="text-blue-900 text-lg w-auto"
                        size="txtRalewayBold18"
                      >
                        {props?.sitedetails}
                      </Text>
                      {/* Information icon */}
                      <Img
                        className="h-3.5 w-3.5 cursor-pointer"
                        src={`${globalVariables.staticPath}information.png`}
                        alt="Information Icon"
                      />
                    </div>
                  </Tooltip>

          <Formik
            initialValues={formValues}
            onSubmit={(values) => {
              setFormValues(values)
              handleShowScoreForm()
            }}
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form>
                {/* site controls */}
                <RadioGroup
                  value={isCreateSite}
                  onClick={(evt) => {
                    const newValue = evt.target.value;
                    setType((prevType) => (prevType === newValue ? null : newValue));
                    if(newValue === 'createsite'){
                      props.resetSiteDetails({})
                      setSitesList([])
                      setEnableSiteFields(true)
                      setIsCreateSite('createsite')
                    }
                    else {
                      setIsCreateSite('useexistingsite')
                      setEnableSiteFields(false)
                      getSites()
                      setSelectSiteMode('NONE')
                      if(selectSiteMode === 'SELECT_ON_MAP')
                        props.toggleMapSelection()
                    }
                    props.resetMap()
                    setFieldValue('selectedSite', 'none');
                    setFieldValue('riverName', '');
                    setFieldValue('siteName', '');
                    setFieldValue('riverCategory', '');
                    setFieldValue('siteDescription', '');
                    // form validations
                    setProceedToSavingData(false)
                    formValues.riverName = ''
                    formValues.siteName = ''
                    formValues.siteDescription = ''
                  }}
                  row
                >
                  <FormControlLabel value="createsite" control={<Radio />} label="Create New Site" />
                  <FormControlLabel value="useexistingsite" control={<Radio />} label="Use Existing Site" />
                </RadioGroup>

                {enableSiteFields ? (
                  <div className="flex sm:flex-col flex-row gap-3 items-start justify-start w-auto sm:w-full">
                    <Button
                      type="button"
                      className="!text-white-A700 cursor-pointer font-raleway min-w-[198px] text-center text-lg tracking-[0.81px]"
                      shape="round"
                      color="blue_gray_500"
                      size="xs"
                      variant="fill"
                      onClick={openUploadModal}
                    >
                      {props?.uploadSiteImages}
                    </Button>
                    <span> {values.images?.length ? values.images?.length + ' images selected' : ''}</span>
                  </div>
                ) : (
                    <><Button
                        type="button"
                        className="!text-white-A700 cursor-pointer font-raleway min-w-[198px] text-center text-lg tracking-[0.81px]"
                        shape="round"
                        color="blue_gray_500"
                        size="xs"
                        variant="fill"
                        onClick={openUploadModal}
                      >
                        {props?.uploadSiteImages}
                      </Button><span> {values.images?.length ? values.images?.length + ' images selected' : ''}</span><Button
                        type="button"
                        className="!text-white-A700 cursor-pointer font-raleway min-w-[198px] text-center text-lg tracking-[0.81px]"
                        shape="round"
                        color={selectSiteMode === 'SELECT_KNOWN_SITE' ? 'blue_900' : 'blue_gray_500'}
                        size="xs"
                        variant="fill"
                        onClick={(() => {
                          handleSelectKnownSite()
                          setFieldValue('riverName', '');
                          setFieldValue('siteName', '');
                          setFieldValue('riverCategory', '');
                          setFieldValue('siteDescription', '');
                          setProceedToSavingData(false)
                        })}
                        style={{marginBottom: '2%', marginLeft: '1.5%'}}
                      >
                          {selectSiteMode === 'SELECT_KNOWN_SITE' ? 'Disable' : 'Select site on map'}

                        </Button></>
                )}

                {!enableSiteFields &&
                    <>
                        <br />
                        <div className="flex flex-row h-[46px] md:h-auto items-start justify-start w-auto">
                          <Text
                            className="text-gray-800 text-lg tracking-[0.15px] w-auto"
                            size="txtRalewayRomanRegular18"
                          >
                            {`Sites:`}
                          </Text>
                          
                          {isFetchingSites? (
                            <div style={{ marginLeft: '210px', height: '30px', width: '300px'}}>
                              <LinearProgress color="success" /> </div> ): (
                            <div className="flex flex-row items-center justify-start w-[97%] sm:w-full">
                              <Select
                                name="selectedSite"
                                options={sites}
                                className="!text-black-900_99 font-raleway text-base text-left"
                                placeholder=""
                                isSearchable
                                styles={customStyles}
                                value={(() => {
                                  const selectedOption = sites.find((option) => {
                                    const isMatch = parseInt(option.value) === parseInt(values.selectedSite);
                                    return isMatch;
                                  });
                                  return selectedOption;
                                })()}
                                onChange={(selectedOption) => {
                                  handleChange({ target: { name: 'selectedSite', value: selectedOption.value } });
                                
                                  const selectedValue = selectedOption.value;
                                
                                  if (selectedValue === 'none') {
                                    // Clear variables when "None" is selected
                                    setFieldValue('selectedSite', 'none');
                                    setFieldValue('riverName', '');
                                    setFieldValue('siteName', '');
                                    setFieldValue('rivercategory', '');
                                    setFieldValue('siteDescription', '');
                                    setIsCreateSite('useexistingsite');
                                    setProceedToSavingData(false);
                                  } else {
                                    const selectedSite = sites.find((site) => site.value === selectedValue);
                                    if (selectedSite) {
                                      setIsCreateSite('useexistingsite');
                                      setFieldValue('selectedSite', selectedSite);
                                      setFieldValue('riverName', selectedSite.riverName);
                                      setFieldValue('siteName', selectedSite.siteName);
                                      setFieldValue('rivercategory', selectedSite.rivercategory);
                                      setFieldValue('siteDescription', selectedSite.siteDescription);
                                      setProceedToSavingData(true);
                                    }
                                  }
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </>
                }
                 
                <br/>

                <UploadModal
                  isOpen={isUploadModalOpen}
                  onClose={closeUploadModal}
                  onSubmit={(files) =>{
                    setFieldValue('images', files)
                    closeUploadModal()
                  }} />

                {/* rivername input */}
                <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
                  <Text
                    className="text-gray-800 text-lg tracking-[0.15px] w-auto"
                    size="txtRalewayRomanRegular18"
                  >
                    {props?.rivername}
                  </Text>
                  <Field
                    name="riverName"
                    placeholder="River name"
                    className="!placeholder:text-black-900_99 !text-black-900_99 font-raleway md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.50px] w-full"
                    wrapClassName="sm:w-full"
                    shape="round"
                    color="black_900_3a"
                    size="xs"
                    variant="outline"
                    style={{
                      width: '300px',
                      maxWidth: '300px',
                      height: '40px',
                      border: `1px solid ${proceedToSavingData ? 'rgba(0, 0, 0, 0.23)': !formValues.riverName ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                      borderRadius: '4px',
                      padding: '8px 12px',
                      marginRight: '-2%',
                      marginBottom: '2%'
                    }}
                    value={(() => {
                      const siteRiverName = props.siteDetails?.rivername;
                      const selectedValue = siteRiverName ? siteRiverName: values.riverName;
                      return selectedValue;
                    })()}
                    onChange={(e) => {
                      handleChange(e);
                      setSiteUserValues((prevValues) => ({
                        ...prevValues,
                        riverName: e.target.value
                      }));
                      formValues.riverName = e.target.value
                      updateHighlightedFields()
                    }}
                    disabled={!enableSiteFields ? true : false}
                  />
                </div>

                {/* sitename input  */}
                <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
                  <Text
                    className="text-gray-800 text-lg tracking-[0.15px] w-auto"
                    size="txtRalewayRomanRegular18"
                  >
                    {props?.sitename}
                  </Text>
                  <Field
                    name="siteName"
                    placeholder="Site name"
                    className="!placeholder:text-black-900_99 !text-black-900_99 border-solid font-raleway md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.50px] w-full"
                    wrapClassName="sm:w-full"
                    shape="round"
                    color="black_900_3a"
                    size="xs"
                    variant="outline"
                    style={{
                      width: '300px',
                      maxWidth: '300px',
                      height: '40px',
                      border: `1px solid ${proceedToSavingData ? 'rgba(0, 0, 0, 0.23)': !formValues.siteName ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                      borderRadius: '4px',
                      padding: '8px 12px',
                      marginRight: '-2%',
                      marginBottom: '4.5%'
                    }}
                    value={(() => {
                      const siteSiteName = props.siteDetails?.sitename;
                      const selectedValue = siteSiteName ? siteSiteName: values.siteName;
                      return selectedValue;
                    })()}
                    onChange={(e) => {
                      handleChange(e);
                      setSiteUserValues((prevValues) => ({
                        ...prevValues,
                        siteName: e.target.value
                      }));
                      formValues.siteName = e.target.value
                      updateHighlightedFields()
                    }}
                    disabled={!enableSiteFields ? true : false} 
                  />
                </div>

                {/* description input  */}
                <div className="flex sm:flex-col flex-row gap-3 h-[75px] md:h-auto items-center justify-between w-[541px] sm:w-full">
                  <Text
                    className="text-gray-800 text-lg tracking-[0.15px] w-auto"
                    size="txtRalewayRomanRegular18"
                  >
                    {props?.sitedescriptionOne}
                  </Text>

                  <textarea
                    name="siteDescription"
                    style={{
                      width: '300px',
                      maxWidth: '300px',
                      height: '80px',
                      border: `1px solid ${proceedToSavingData ? 'rgba(0, 0, 0, 0.23)': !formValues.siteDescription ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                      borderRadius: '4px',
                      padding: '8px 12px',
                      marginRight: '-2%',
                      marginBottom: '4%',
                      resize: 'vertical', // Optional: Allow vertical resizing
                    }}
                    placeholder="e.g. downstream of industry."
                    value={(() => {
                      const siteSiteDescription = props.siteDetails?.sitedescription;
                      const selectedValue = siteSiteDescription ? siteSiteDescription : values.siteDescription;
                      return selectedValue;
                    })()}
                    onChange={(e) => {
                      handleChange(e);
                      setSiteUserValues((prevValues) => ({
                        ...prevValues,
                        siteDescription: e.target.value
                      }));
                      formValues.siteDescription = e.target.value
                      updateHighlightedFields()
                    }}
                    disabled={!enableSiteFields ? true : false}
                  />
                </div>

                {/* river category input */}
                <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full" style={{marginBottom: '2%'}}>

                  {/* Tooltip */}
                  <Tooltip
                    title="River category description comes here"
                    placement="top"
                    arrow
                    PopperProps={{
                      popperRef,
                      anchorEl: {
                        getBoundingClientRect: () => {
                          return new DOMRect(
                            positionRef.current.x,
                            areaRef.current!.getBoundingClientRect().y,
                            0,
                            0,
                          );
                        },
                      },
                    }}
                  >
                    <div className="flex flex-row gap-1 items-start justify-start w-auto"
                      ref={areaRef}
                      onMouseMove={handleMouseMove}
                    >
                      <Text
                        className="text-gray-800 text-lg tracking-[0.15px] w-auto"
                        size="txtRalewayRomanRegular18"
                      >
                        {props?.rivercategory}
                      </Text>
                      {/* Information icon */}
                      <Img
                        className="h-3.5 w-3.5 cursor-pointer"
                        src={`${globalVariables.staticPath}information.png`}
                        alt="Information Icon"
                      />
                    </div>
                  </Tooltip>
                  <div className="flex flex-col items-start justify-start w-[300px]" style={{ marginRight: '-2%'}}>
                    <div className="flex flex-col items-start justify-start w-full" >
                    <Field as="select" name="rivercategory" className="!text-black-900_99 font-raleway text-base text-left tracking-[0.15px] w-full"
                        placeholderClassName="!text-black-900_99"
                        placeholder="Rocky"
                        shape="round"
                        color="black_900_3a"
                        size="xs"
                        variant="outline"
                        style={{
                          width: '300px',
                          maxWidth: '300px',
                          border: '1px solid rgba(0, 0, 0, 0.23)',
                          borderRadius: '4px',
                          padding: '8px 12px',
                          marginBottom: '2%'
                        }}
                        disabled={!enableSiteFields ? true : false} 
                      >
                      {inputOptionsList.map((option) => (
                        <option 
                          key={option.value} 
                          value={(() => {
                            const siteRivercategory = props.siteDetails?.rivercategory;
                            const selectedValue = siteRivercategory ? siteRivercategory : option.value;
                            return selectedValue;
                          })()}
                          selected={option.value === values.rivercategory}
                        >
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    </div>
                  </div>
                </div>


                {/* buttons to adjust input fields */}
                <div className="flex flex-col gap-3 items-start justify-start w-auto sm:w-full" style={{ marginBottom: '4%'}}>
                  <Text
                    className="text-blue-900 text-lg w-auto"
                    size="txtRalewayBold18"
                  >
                    {props?.sitelocation}
                  </Text>
                  <div className="flex sm:flex-col flex-row gap-3 items-start justify-start w-auto sm:w-full">
                    <Button
                      type="button"
                      className="!text-white-A700 cursor-pointer font-raleway min-w-[155px] text-center text-lg tracking-[0.81px]"
                      shape="round"
                      color={selectSiteMode === 'SELECT_ON_MAP' ? 'blue_900': 'blue_gray_500'}
                      size="xs"
                      variant="fill"
                      onClick={handleSelectOnMapClick}
                      disabled={!enableSiteFields ? true : false} 
                      style={{ opacity: enableSiteFields  ? 1 : 0.5 }}
                    >
                      {props?.selectOnMap}
                    </Button>
                    <Button
                      type="button"
                      className="!text-white-A700 cursor-pointer font-raleway min-w-[201px] text-center text-lg tracking-[0.81px]"
                      shape="round"
                      color={selectSiteMode === 'TYPE_IN_COORDINATES' ? 'blue_900': 'blue_gray_500'}
                      size="xs"
                      variant="fill"
                      onClick={handleSelectOnTypeCoordinateClick}
                      disabled={!enableSiteFields ? true : false}
                      style={{ opacity: enableSiteFields  ? 1 : 0.5 }}
                    >
                      {props?.typeInCoordinates}
                    </Button>
                  </div>
                </div>


                {/* Additional fields for longitude and latitude */}
                { (selectSiteMode === 'TYPE_IN_COORDINATES' || selectSiteMode === 'SELECT_ON_MAP') && enableSiteFields  ?
                  <CoordinatesInputForm
                    values={values}
                    setFieldValue={setFieldValue}
                    defaultType={'Degree'}
                    handleMapClick={props.handleMapClick}
                    selectedCoordinates={props.selectedCoordinates}
                    selectOnMap={props.selectingOnMap}
                    disabled={selectSiteMode !== 'TYPE_IN_COORDINATES'}
                  /> : null
                }
                <div className="flex flex-col gap-3 items-start justify-start w-auto sm:w-full" style={{marginBottom: '2%'}}>
                  <Text
                    className="text-blue-900 text-lg w-auto"
                    size="txtRalewayBold18"
                  >
                    {props?.observationdetaOne}
                  </Text>

                  {/* date input */}
                  <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
                      <Text className="text-gray-800 text-lg tracking-[0.15px] w-auto" size="txtRalewayRomanRegular18">
                        {props?.date}
                      </Text>
                      <div>
                        {values.date && (
                          <Text className="text-gray-800 text-lg tracking-[0.15px] w-auto" size="txtRalewayRomanRegular18">
                            {formatDate(new Date(values.date))}
                          </Text>
                        )}
                        <Field
                          type="date"
                          name="date"
                          placeholder="01.01.2024"
                          className="!placeholder:text-black-900_99 !text-black-900_99 font-raleway p-0 text-base text-left tracking-[0.50px] w-full"
                          wrapClassName="flex md:h-auto w-[300px]"
                          shape="round"
                          color="black_900_3a"
                          size="xs"
                          variant="outline"
                          style={{
                            width: '300px',
                            maxWidth: '300px',
                            height: '40px',
                            border: `1px solid ${!formValues.date ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                            borderRadius: '4px',
                            padding: '8px 12px',
                            marginRight: '-10px',
                          }}
                          min={'2010-01-01'}
                          max={formatDate(new Date())}
                          value={values.date}
                          onChange={(e) => {
                            handleChange(e);
                            setSiteUserValues((prevValues) => ({
                              ...prevValues,
                              date: e.target.value
                            }));
                            formValues.date = e.target.value
                            updateHighlightedFields()
                          }}
                        />
                      </div>
                    </div>


                  {/* collectors name input */}
                  <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
                    <Text
                      className="text-gray-800 text-lg tracking-[0.15px] w-auto"
                      size="txtRalewayRomanRegular18"
                    >
                      {props?.collectorsname}
                    </Text>
                    <Field
                      name="collectorsname"
                      placeholder="Collectors name:"
                      className="!placeholder:text-black-900_99 !text-black-900_99 font-raleway md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.50px] w-full"
                      wrapClassName="sm:w-full"
                      shape="round"
                      color="black_900_3a"
                      size="xs"
                      variant="outline"
                      style={{
                        width: '300px',
                        maxWidth: '300px',
                        height: '40px',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        marginRight: '-10px'
                      }}
                      value={values.collectorsname}
                      onChange={handleChange}
                    />
                  </div>

                  {/* notes input */}
                  <div className="flex flex-row gap-3 h-[75px] md:h-auto items-center justify-between w-[541px] sm:w-full">
                    <Text
                      className="text-gray-800 text-lg tracking-[0.15px] w-auto"
                      size="txtRalewayRomanRegular18"
                    >
                      {props?.notes}
                    </Text>
                    <textarea
                      name="notes"
                      style={{
                        width: '300px',
                        maxWidth: '300px',
                        height: '80px',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        marginRight: '-2%',
                        resize: 'vertical', // Optional: Allow vertical resizing
                      }}
                      placeholder="e.g. downstream of industry."
                      value={values.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>



                {/* measurements section */}
                <div className="flex flex-col gap-3 items-start justify-start w-auto sm:w-full" style={{ marginTop: '2%'}}>
                  <Text
                    className="text-blue-900 text-lg w-auto"
                    size="txtRalewayBold18"
                  >
                    {props?.measurements}
                  </Text>

                  <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
                    <Text
                      className="text-gray-800 text-lg tracking-[0.15px] w-auto"
                      size="txtRalewayRomanRegular18"
                    >
                      {props?.waterclaritycm}
                    </Text>
                    <Field
                      name="waterclaritycm"
                      placeholder="Water clarity (cm):"
                      type="number"
                      min="0"
                      className="!placeholder:text-black-900_99 !text-black-900_99 font-raleway md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.50px] w-full"
                      wrapClassName="sm:w-full"
                      shape="round"
                      color="black_900_3a"
                      size="xs"
                      variant="outline"
                      style={{
                        width: '300px',
                        maxWidth: '300px',
                        height: '40px',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        marginRight: '-10px'
                      }}
                      value={values.waterclaritycm}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
                    <Text
                      className="text-gray-800 text-lg tracking-[0.15px] w-auto"
                      size="txtRalewayRomanRegular18"
                    >
                      {props?.watertemperaturOne}
                    </Text>
                    <Field
                      name="watertemperaturOne"
                      placeholder="Water temperature (°C):"
                      type="number"
                      min="-100"
                      max="100"
                      className="!placeholder:text-black-900_99 !text-black-900_99 font-raleway md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.50px] w-full"
                      wrapClassName="sm:w-full"
                      shape="round"
                      color="black_900_3a"
                      size="xs"
                      variant="outline"
                      style={{
                        width: '300px',
                        maxWidth: '300px',
                        height: '40px',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        marginRight: '-10px'
                      }}
                      value={values.watertemperaturOne}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
                    <Text
                      className="text-gray-800 text-lg tracking-[0.15px] w-auto"
                      size="txtRalewayRomanRegular18"
                    >
                      {props?.ph}
                    </Text>
                    <Field
                      name="ph"
                      placeholder="pH:"
                      type="number"
                      min="0"
                      max="14"
                      className="!placeholder:text-black-900_99 !text-black-900_99 font-raleway md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.50px] w-full"
                      wrapClassName=""
                      shape="round"
                      color="black_900_3a"
                      size="xs"
                      variant="outline"
                      style={{
                        width: '300px',
                        maxWidth: '300px',
                        height: '40px',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        marginRight: '-10px'
                      }}
                      value={values.ph}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
                    <Text
                      className="text-gray-800 text-lg tracking-[0.15px] w-auto"
                      size="txtRalewayRomanRegular18"
                    >
                      {props?.dissolvedoxygenOne}
                    </Text>
                    <div className="flex flex-row h-[46px] md:h-auto items-start justify-start w-auto">
                      <div className="flex flex-row items-center justify-start w-[97%] sm:w-full">
                        <Field
                          name="dissolvedoxygenOne"
                          type="number"
                          min="0"
                          max="20"
                          placeholder="0.000000"
                          className="!placeholder:text-black-900_dd !text-black-900_dd font-roboto md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.15px] w-full"
                          wrapClassName="w-full"
                          shape="round"
                          color="black_900_3a"
                          size="xs"
                          variant="outline"
                          style={{
                            width: '219px',
                            maxWidth: '219px',
                            height: '40px',
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            marginRight: '-43px'
                          }}
                          value={values.dissolvedoxygenOne}
                          onChange={handleChange}
                        />
                        <Field as="select" name="dissolvedoxygenOneUnit" className="!text-black-900_99 font-raleway text-base text-left"
                            placeholderClassName="!text-black-900_99"
                            placeholder=""
                            shape="round"
                            color="black_900_3a"
                            size="xs"
                            variant="outline"
                            style={{
                              width: '85px',
                              maxWidth: '85px',
                              height: '40px',
                              border: '1px solid rgba(0, 0, 0, 0.23)',
                              borderRadius: '4px',
                              padding: '8px 12px',
                              marginRight: '-20px',
                              marginLeft: '50px'
                            }}
                          value={values.dissolvedoxygenOneUnit}
                          onChange={handleChange}
                          >
                          {inputOxygenUnitsList.map((option) => (
                            <option key={option.value} value={option.value} selected={option.value === values.dissolvedoxygenOneUnit}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </div>

                  </div>

                  <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
                    <Text
                      className="text-gray-800 text-lg tracking-[0.15px] w-auto"
                      size="txtRalewayRomanRegular18"
                    >
                      {props?.electricalconduOne}
                    </Text>
                    <div className="flex flex-row h-[46px] md:h-auto items-start justify-start w-auto">
                      <div className="flex flex-row items-center justify-start w-[97%] sm:w-full" style={{ marginLeft:'10px'}}>
                        <Field
                          name="electricalconduOne"
                          min="0"
                          max="100"
                          placeholder="0.000000"
                          type="number"
                          className="!placeholder:text-black-900_dd !text-black-900_dd font-roboto md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.15px] w-full"
                          wrapClassName="w-full"
                          shape="round"
                          color="black_900_3a"
                          size="xs"
                          variant="outline"
                          style={{
                            width: '211px',
                            maxWidth: '211px',
                            height: '40px',
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            marginRight: '-35px'
                          }}
                          value={values.electricalconduOne}
                          onChange={handleChange}
                        />
                        <Field as="select" name="electricalconduOneUnit" className="!text-black-900_99 font-raleway text-base text-left  w-[155px]"
                            placeholderClassName="!text-black-900_99"
                            placeholder=""
                            shape="round"
                            color="black_900_3a"
                            size="xs"
                            variant="outline"
                            style={{
                              width: '85px',
                              maxWidth: '85px',
                              height: '40px',
                              border: '1px solid rgba(0, 0, 0, 0.23)',
                              borderRadius: '4px',
                              padding: '8px 12px',
                              marginRight: '-11px',
                              marginLeft: '43px'
                            }}
                          value={values.electricalconduOneUnit}
                          onChange={handleChange}
                          >
                          {inputElectricConductivityUnitsList.map((option) => (
                            <option key={option.value} value={option.value} selected={option.value === values.electricalconduOneUnit}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </div>
                  </div>
                </div>

                {!proceedToSavingData && (
                  <Text
                    className={` text-lg tracking-[0.15px] w-auto `}
                    size="txtRalewayRomanRegular18"
                    style={{ color: 'red', marginTop: '4px', marginBottom:' 4px' }}
                  >
                    Incomplete form. Please scroll up to complete the highlighted fields.
                  </Text>
                )}

                <Button
                  className="!text-white-A700 cursor-pointer font-raleway mb-[33px] text-center text-lg tracking-[0.81px] w-[141px]"
                  shape="round"
                  color="blue_gray_500"
                  size="xs"
                  variant="fill"
                  type="submit"
                  disabled={!proceedToSavingData ? true : false}
                  style={{ marginTop: '10px', opacity: proceedToSavingData  ? 1 : 0.5 }}
                >
                  next
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      ): (
        <ScoreForm onCancel={handleHideScoreForm} additionalData={formValues} setSidebarOpen={props.setSidebarOpen} />
      )}
    </>
  );
};


// TODO make form dynamic
DataInputForm.defaultProps = {
  datainputform: "Data Input Form",
  sitedetails: "Site Details",
  uploadSiteImages: "Upload site images",
  rivername: "River name:",
  sitename: "Site name:",
  sitedescriptionOne: "Site description:",
  defaultslot: (
    <>
      e.g. downstream of industry. <br />
      Max 255 characters
    </>
  ),
  rivercategory: "River category",
  sitelocation: "Site location",
  selectKnownSite: SiteSelectionModes.SELECT_KNOWN_SITE,
  selectOnMap: SiteSelectionModes.SELECT_ON_MAP,
  typeInCoordinates: SiteSelectionModes.TYPE_IN_COORDINATES,
  observationdetaOne: "Observation details",
  date: "Date:",
  collectorsname: "Collectors name:",
  notes: "Notes:",
  defaultslotOne: (
    <>
      e.g. downstream of industry. <br />
      Max 255 characters
    </>
  ),
  measurements: "Measurements",
  waterclaritycm: "Water clarity (cm):",
  watertemperaturOne: "Water temperature (°C):",
  ph: "pH:",
  dissolvedoxygenOne: "Dissolved oxygen",
  electricalconduOne: "Electrical conductivity",
};

export default DataInputForm;
