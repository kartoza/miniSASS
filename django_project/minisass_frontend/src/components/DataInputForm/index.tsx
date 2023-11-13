import React, { useState } from "react";

import { Button, FloatingInput, Img, Input, SelectBox, Text } from "../../components";
import Tooltip from '@mui/material/Tooltip';
import UploadModal from "../../components/UploadFormModal";
import { Instance } from '@popperjs/core';



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

const DataInputForm: React.FC<DataInputFormProps> = (props) => {

  // TODO still need to get units and river categories and save data to db

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
    dissolvedoxygenOneUnit: '',
    electricalconduOneUnit: '',
  });

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


  // Function to handle form submission
  const handleSubmit = () => {
    console.log('Form Values:', formValues);
  };

  // Get the current URL using window.location.href
  const currentURL = window.location.href;

  // Extract the base URL (everything up to the first single forward slash '/')
  const parts = currentURL.split('/');
  const baseUrl = parts[0] + '//' + parts[2]; // Reconstruct the base URL

  // Define the replacement path
  const replacementPath = 'static/images/';

  // Construct the new URL with the replacement path
  const staticPath = baseUrl + '/' + replacementPath;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const openUploadModal = () => {
      setIsUploadModalOpen(true);
    };

    const closeUploadModal = () => {
      setIsUploadModalOpen(false);
    };

  
  return (
    <>
      <div className={props.className} style={{
        height: '95vh',
        overflowY: 'auto',
        overflowX: 'auto',
      }}>
        <Text
          className="text-2xl md:text-[22px] text-blue-900 sm:text-xl"
          size="txtRalewayBold24"
        >
          {props?.datainputform}
        </Text>
        <div className="flex flex-col gap-3 items-start justify-start w-auto sm:w-full">
          <Text
            className="text-blue-900 text-lg w-auto"
            size="txtRalewayBold18"
          >
            {props?.sitedetails}
          </Text>
          <Button
            className="!text-white-A700 cursor-pointer font-raleway min-w-[198px] text-center text-lg tracking-[0.81px]"
            shape="round"
            color="blue_gray_500"
            size="xs"
            variant="fill"
            onClick={openUploadModal}
          >
            {props?.uploadSiteImages}
          </Button>
          <UploadModal isOpen={isUploadModalOpen} onClose={closeUploadModal} onSubmit={null} />

          {/* rivername input */}
          <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
            <Text
              className="text-gray-800 text-lg tracking-[0.15px] w-auto"
              size="txtRalewayRomanRegular18"
            >
              {props?.rivername}
            </Text>
            <Input
              name="inputslot"
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
                marginRight: '-10px'
              }}
              value={formValues.riverName}
              onChange={(e) => {
                setFormValues({ ...formValues, riverName: e });
              }}
              
            ></Input>
          </div>

          {/* sitename input  */}
          <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
            <Text
              className="text-gray-800 text-lg tracking-[0.15px] w-auto"
              size="txtRalewayRomanRegular18"
            >
              {props?.sitename}
            </Text>
            <Input
              name="inputslot_One"
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
                marginRight: '-10px'
              }}
              value={formValues.siteName}
              onChange={(e) => setFormValues({ ...formValues, siteName: e })} 
            ></Input>
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
                  name="message"
                  style={{
                    width: '300px',
                    maxWidth: '300px',
                    height: '80px',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    padding: '8px 12px',
                  }}
                  placeholder="e.g. downstream of industry.             Max 255 characters"
                  value={formValues.siteDescription}
                  onChange={(e) => setFormValues({ ...formValues, siteDescription: e.target.value })} 
                />
              
            
          </div>

          {/* river category input */}
          <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full">

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
                    src={`${staticPath}information.png`}
                    alt="Information Icon"
                  />
                </div>
              </Tooltip>
            <div className="flex flex-col items-start justify-start w-[300px]">
              <div className="flex flex-col items-start justify-start w-full">
                <SelectBox
                  className="!text-black-900_99 font-raleway text-base text-left tracking-[0.15px] w-full"
                  placeholderClassName="!text-black-900_99"
                  isMulti={false}
                  name="input"
                  options={inputOptionsList}
                  isSearchable={false}
                  placeholder="Rocky"
                  shape="round"
                  color="black_900_3a"
                  size="xs"
                  variant="outline"
                  value={formValues.rivercategory}
                  onChange={(selectedOption) =>{
                    setFormValues({ ...formValues, rivercategory: selectedOption })

                  } }
                />
              </div>
            </div>
          </div>
          
        </div>
        
        {/* buttons to adjust input fields */}
        <div className="flex flex-col gap-3 items-start justify-start w-auto sm:w-full">
          <Text
            className="text-blue-900 text-lg w-auto"
            size="txtRalewayBold18"
          >
            {props?.sitelocation}
          </Text>
          <div className="flex sm:flex-col flex-row gap-3 items-start justify-start w-auto sm:w-full">
            <Button
              className="!text-white-A700 cursor-pointer font-raleway min-w-[184px] text-center text-lg tracking-[0.81px]"
              shape="round"
              color="blue_gray_500"
              size="xs"
              variant="fill"
            >
              {props?.selectKnownSite}
            </Button>
            <Button
              className="!text-white-A700 cursor-pointer font-raleway min-w-[155px] text-center text-lg tracking-[0.81px]"
              shape="round"
              color="blue_gray_500"
              size="xs"
              variant="fill"
            >
              {props?.selectOnMap}
            </Button>
            <Button
              className="!text-white-A700 cursor-pointer font-raleway min-w-[201px] text-center text-lg tracking-[0.81px]"
              shape="round"
              color="blue_gray_500"
              size="xs"
              variant="fill"
            >
              {props?.typeInCoordinates}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-start justify-start w-auto sm:w-full">
          <Text
            className="text-blue-900 text-lg w-auto"
            size="txtRalewayBold18"
          >
            {props?.observationdetaOne}
          </Text>

          {/* date input */}
          <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
            <Text
              className="text-gray-800 text-lg tracking-[0.15px] w-auto"
              size="txtRalewayRomanRegular18"
            >
              {props?.date}
            </Text>
            <Input
              type="date" 
              name="dateslot"
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
                marginRight: '-10px'
              }}
              value={formValues.date}
              onChange={(e) => setFormValues({ ...formValues, date: e })} 
            />
          </div>


          {/* collectors name input */}
          <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
            <Text
              className="text-gray-800 text-lg tracking-[0.15px] w-auto"
              size="txtRalewayRomanRegular18"
            >
              {props?.collectorsname}
            </Text>
            <Input
              name="inputslot_Two"
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
              value={formValues.collectorsname}
              onChange={(e) => setFormValues({ ...formValues, collectorsname: e })} 
            ></Input>
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
              name="message"
              style={{
                    width: '300px',
                    maxWidth: '300px',
                    height: '80px',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    padding: '8px 12px',
                  }}
                  placeholder="e.g. downstream of industry.             Max 255 characters"
                  value={formValues.notes}
                  onChange={(e) => setFormValues({ ...formValues, notes: e.target.value })} 
              />

          </div>

        </div>
        {/* measurements section */}
        <div className="flex flex-col gap-3 items-start justify-start w-auto sm:w-full">
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
            <Input
              name="inputslot_Three"
              placeholder="Water clarity (cm):"
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
              value={formValues.waterclaritycm}
              onChange={(e) => setFormValues({ ...formValues, waterclaritycm: e })} 
            ></Input>
          </div>

          <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
            <Text
              className="text-gray-800 text-lg tracking-[0.15px] w-auto"
              size="txtRalewayRomanRegular18"
            >
              {props?.watertemperaturOne}
            </Text>
            <Input
              name="inputslot_Four"
              placeholder="Water temperature (°C):"
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
              value={formValues.watertemperaturOne}
              onChange={(e) => setFormValues({ ...formValues, watertemperaturOne: e })} 
            ></Input>
          </div>

          <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
            <Text
              className="text-gray-800 text-lg tracking-[0.15px] w-auto"
              size="txtRalewayRomanRegular18"
            >
              {props?.ph}
            </Text>
            <Input
              name="inputslot_Five"
              placeholder="pH:"
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
              value={formValues.ph}
              onChange={(e) => setFormValues({ ...formValues, ph: e })} 
            ></Input>
          </div>

          <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
            <Text
              className="text-gray-800 text-lg tracking-[0.15px] w-auto"
              size="txtRalewayRomanRegular18"
            >
              {props?.dissolvedoxygenOne}
            </Text>
            <div className="flex flex-row h-[46px] md:h-auto items-start justify-start w-auto">
              <div className="flex flex-row items-center justify-start w-[97%] sm:w-full" style={{ marginLeft:'10px'}}>
                <Input
                  name="inputslot_Six"
                  placeholder="0.000000"
                  className="!placeholder:text-black-900_dd !text-black-900_dd font-roboto md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.15px] w-full"
                  wrapClassName="w-full"
                  shape="round"
                  color="black_900_3a"
                  size="xs"
                  variant="outline"
                  style={{
                    width: '180px',
                    maxWidth: '180px',
                    height: '40px',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    marginRight: '-45px'
                  }}
                  value={formValues.dissolvedoxygenOne}
                  onChange={(e) => setFormValues({ ...formValues, dissolvedoxygenOne: e })} 
                />
                <SelectBox
                  className="!text-black-900_99 font-raleway text-base text-left  w-[155px]"
                  placeholderClassName="!text-black-900_99"
                  isMulti={false}
                  name="input"
                  options={inputOxygenUnitsList}
                  isSearchable={false}
                  placeholder=""
                  shape="round"
                  color="black_900_3a"
                  size="xs"
                  variant="outline"
                  value={formValues.dissolvedoxygenOneUnit}  // Set the value from state
                  onChange={(selectedOption) => setFormValues({ ...formValues, dissolvedoxygenOneUnit: selectedOption })}
                />
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
                <Input
                  name="inputslot_Six"
                  placeholder="0.000000"
                  className="!placeholder:text-black-900_dd !text-black-900_dd font-roboto md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.15px] w-full"
                  wrapClassName="w-full"
                  shape="round"
                  color="black_900_3a"
                  size="xs"
                  variant="outline"
                  style={{
                    width: '180px',
                    maxWidth: '180px',
                    height: '40px',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    marginRight: '-45px'
                  }}
                  value={formValues.electricalconduOne}
                  onChange={(e) => setFormValues({ ...formValues, electricalconduOne: e })} 
                />
                <SelectBox
                  className="!text-black-900_99 font-raleway text-base text-left  w-[155px]"
                  placeholderClassName="!text-black-900_99"
                  isMulti={false}
                  name="input"
                  options={inputElectricConductivityUnitsList}
                  isSearchable={false}
                  placeholder=""
                  shape="round"
                  color="black_900_3a"
                  size="xs"
                  variant="outline"
                  value={formValues.electricalconduOneUnit}  // Set the value from state
                  onChange={(selectedOption) => setFormValues({ ...formValues, electricalconduOneUnit: selectedOption })}
                />
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
          onClick={() => handleSubmit()}
        >
          next
        </Button>
      </div>
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
  selectKnownSite: "Select known site",
  selectOnMap: "Select on map",
  typeInCoordinates: "Type in coordinates",
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
