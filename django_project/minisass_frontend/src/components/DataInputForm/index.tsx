import React, { useEffect, useState } from "react";

import { Button, FloatingInput, Img, Input, SelectBox, Text } from "../../components";
import Tooltip from '@mui/material/Tooltip';
import UploadModal from "../../components/UploadFormModal";
import { Instance } from '@popperjs/core';
import { Formik, Form, Field } from 'formik';
import ScoreForm from "../../components/ScoreForm";
import axios from "axios";
import { globalVariables, formatDate } from "../../utils";
import CoordinatesInputForm from "../CoordinatesInputForm";
import Select from 'react-select';


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
    TYPE_IN_COORDINATES: 'Type in coordinates'
} as const;

type SiteSelectionMode = keyof typeof SiteSelectionModes;

const FETCH_SITES = globalVariables.baseUrl + '/monitor/sites/';

const DataInputForm: React.FC<DataInputFormProps> = (props) => {

  const handleCloseSidebar = () => {
    props.setSidebarOpen(false);
  };

  // TODO still need to save data to db

  // State to store form values
  const [formValues, setFormValues] = useState({
    riverName: '',
    siteName: '',
    siteDescription: '',
    rivercategory: '',
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
    selectedSite: ''
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectSiteMode, setSelectSiteMode] = useState<SiteSelectionMode | undefined>();
  const [sites, setSitesList] = useState([]);

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
    if (selectSiteMode === 'SELECT_ON_MAP') {
      props.toggleMapSelection()
    }
    setSelectSiteMode("SELECT_KNOWN_SITE");
  }

  const getSites = async () => {
    try {
      const response = await axios.get(`${FETCH_SITES}`);
      if (response.status === 200) {
          const sitesList = response.data.map(site => ({
            label: site.site_name,
            value: site.gid.toString(),
            rivercategory: site.river_cat,
            siteName: site.site_name,
            siteDescription: site.description,
            riverName: site.river_name,
          }));
          setSitesList(sitesList);
      }
    } catch (error) {
      console.log(error.message)
    }
  };

  useEffect(() => {
    if (selectSiteMode === 'SELECT_KNOWN_SITE') {
      getSites()
    }
  }, [selectSiteMode]);

  // Helper function to format date
  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // this will trigger select on map TODO
  const handleSelectKnownSiteFromMapChange = (evt) => {
    const newValue = evt.target.value;
    
    // Toggle between selected and unselected states
    setType((prevType) => (prevType === newValue ? null : newValue));
    
    if (type === newValue) {
      console.log('Radio button unselected');
    } else {
      console.log('Radio button selected');
    }
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
          <Text
            className="text-blue-900 text-lg w-auto"
            size="txtRalewayBold18"
          >
            {props?.sitedetails}
          </Text>

          <Formik
            initialValues={formValues}
            onSubmit={(values) => {
              setFormValues(values)
              handleShowScoreForm()
            }}
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form>
                <div>
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
                      border: '1px solid rgba(0, 0, 0, 0.23)',
                      borderRadius: '4px',
                      padding: '8px 12px',
                      marginRight: '-2%',
                      marginBottom: '2%'
                    }}
                    value={values.riverName}
                    onChange={(e) => {
                      handleChange(e);
                    }}
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
                      border: '1px solid rgba(0, 0, 0, 0.23)',
                      borderRadius: '4px',
                      padding: '8px 12px',
                      marginRight: '-2%',
                      marginBottom: '4.5%'
                    }}
                    value={values.siteName}
                    onChange={handleChange}
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

                      <Field
                        name="siteDescription"
                        style={{
                          width: '300px',
                          maxWidth: '300px',
                          height: '80px',
                          border: '1px solid rgba(0, 0, 0, 0.23)',
                          borderRadius: '4px',
                          padding: '8px 12px',
                          marginRight: '-2%',
                          marginBottom: '4%'
                        }}
                        placeholder="e.g. downstream of industry."
                        value={values.siteDescription}
                        onChange={handleChange}
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

                      >
                      {inputOptionsList.map((option) => (
                        <option key={option.value} value={option.value} selected={option.value === values.rivercategory}>
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
                      className="!text-white-A700 cursor-pointer font-raleway min-w-[184px] text-center text-lg tracking-[0.81px]"
                      shape="round"
                      color={selectSiteMode === 'SELECT_KNOWN_SITE' ? 'blue_900': 'blue_gray_500'}
                      size="xs"
                      variant="fill"
                      onClick={handleSelectKnownSite}
                    >
                      {props?.selectKnownSite}
                    </Button>
                    <Button
                      type="button"
                      className="!text-white-A700 cursor-pointer font-raleway min-w-[155px] text-center text-lg tracking-[0.81px]"
                      shape="round"
                      color={selectSiteMode === 'SELECT_ON_MAP' ? 'blue_900': 'blue_gray_500'}
                      size="xs"
                      variant="fill"
                      onClick={handleSelectOnMapClick}
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
                    >
                      {props?.typeInCoordinates}
                    </Button>
                  </div>
                </div>

                {/* Additional field for select known site */}
                {selectSiteMode === 'SELECT_KNOWN_SITE' && (
                  <>
                    <RadioGroup
                        value={type}
                        onClick={handleSelectKnownSiteFromMapChange}
                        row
                      >
                        <FormControlLabel value="MapSelection" control={<Radio />} label="Select On Map" />
                      </RadioGroup>

                    <div>
                      {/* known site */}
                      <div className="flex flex-row h-[46px] md:h-auto items-start justify-start w-auto">
                        <Text
                          className="text-gray-800 text-lg tracking-[0.15px] w-auto"
                          size="txtRalewayRomanRegular18"
                        >
                          {`Sites:`}
                        </Text>
                        <div className="flex flex-row items-center justify-start w-[97%] sm:w-full">
                          <Select
                            name="selectedSite"
                            options={sites}
                            className="!text-black-900_99 font-raleway text-base text-left"
                            placeholder=""
                            isSearchable
                            styles={customStyles}
                            value={sites.find((option) => option.value === values.selectedSite)}
                            onChange={(selectedOption) => {
                              handleChange({ target: { name: 'selectedSite', value: selectedOption.value } });
                              const selectedValue = selectedOption.value;
                              if (selectedValue === 'none') {
                                setIsInputDisabled(false);
                                setFieldValue('riverName', '');
                                setFieldValue('siteName', '');
                                setFieldValue('rivercategory', 'Rocky');
                                setFieldValue('siteDescription', '');
                              } else {
                                setIsInputDisabled(true);
                                const selectedSite = sites.find((site) => site.value === selectedValue);
                                if (selectedSite) {
                                  setFieldValue('riverName', selectedSite.riverName);
                                  setFieldValue('siteName', selectedSite.siteName);
                                  setFieldValue('rivercategory', selectedSite.riverCategory);
                                  setFieldValue('siteDescription', selectedSite.siteDescription);
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Additional fields for longitude and latitude */}
                { selectSiteMode === 'TYPE_IN_COORDINATES' || selectSiteMode === 'SELECT_ON_MAP' ?
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
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            marginRight: '-10px',
                          }}
                          min={'2010-01-01'}
                          max={formatDate(new Date())}
                          value={values.date}
                          onChange={handleChange}
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
                    <Field
                      name="notes"
                      style={{
                        width: '300px',
                        maxWidth: '300px',
                        height: '80px',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        marginRight: '-2%',
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
                            width: '215px',
                            maxWidth: '215px',
                            height: '40px',
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            marginRight: '-44px'
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
                              width: '120px',
                              maxWidth: '120px',
                              height: '40px',
                              border: '1px solid rgba(0, 0, 0, 0.23)',
                              borderRadius: '4px',
                              padding: '8px 12px',
                              marginLeft: '17%'
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
                            width: '215px',
                            maxWidth: '215px',
                            height: '40px',
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            marginRight: '-44px'
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
                              width: '120px',
                              maxWidth: '120px',
                              height: '40px',
                              border: '1px solid rgba(0, 0, 0, 0.23)',
                              borderRadius: '4px',
                              padding: '8px 12px',
                              marginLeft: '17%'
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

                <Button
                  className="!text-white-A700 cursor-pointer font-raleway mb-[33px] text-center text-lg tracking-[0.81px] w-[141px]"
                  shape="round"
                  color="blue_gray_500"
                  size="xs"
                  variant="fill"
                  type="submit"
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
