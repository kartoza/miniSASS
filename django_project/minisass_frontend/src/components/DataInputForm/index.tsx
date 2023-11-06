import React from "react";

import { Button, FloatingInput, Img, Input, SelectBox, Text } from "../../components";

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
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

const DataInputForm: React.FC<DataInputFormProps> = (props) => {
  return (
    <>
      <div className={props.className}>
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
          >
            {props?.uploadSiteImages}
          </Button>
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
            ></Input>
          </div>
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
              className="!placeholder:text-black-900_99 !text-black-900_99 font-raleway md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.50px] w-full"
              wrapClassName="sm:w-full"
              shape="round"
              color="black_900_3a"
              size="xs"
              variant="outline"
            ></Input>
          </div>
          <div className="flex sm:flex-col flex-row gap-3 h-[75px] md:h-auto items-center justify-between w-[541px] sm:w-full">
            <Text
              className="text-gray-800 text-lg tracking-[0.15px] w-auto"
              size="txtRalewayRomanRegular18"
            >
              {props?.sitedescriptionOne}
            </Text>
            <div className="border border-black-900_3a border-solid flex flex-col h-[75px] md:h-auto items-start justify-start px-3 py-2 rounded w-[300px]">
              <div className="flex flex-col items-center justify-start w-full">
                <Text
                  className="leading-[24.00px] max-w-[215px] md:max-w-full text-base text-black-900_99 tracking-[0.15px]"
                  size="txtRalewayRomanRegular16"
                >
                  {props?.defaultslotOne}
                </Text>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
            <div className="flex flex-row gap-1 items-start justify-start w-auto">
              <Text
                className="text-gray-800 text-lg tracking-[0.15px] w-auto"
                size="txtRalewayRomanRegular18"
              >
                {props?.rivercategory}
              </Text>
              <Img
                className="h-3.5 w-3.5"
                src="images/img_mdiinformation.svg"
                alt="mdiinformation"
              />
            </div>
            <div className="flex flex-col items-start justify-start w-[300px]">
              <div className="flex flex-col items-start justify-start w-full">
                <SelectBox
                  className="!text-black-900_99 font-raleway text-base text-left tracking-[0.15px] w-full"
                  placeholderClassName="!text-black-900_99"
                  indicator={
                    <Img
                      className="h-6 w-6"
                      src="images/img_arrowdropdownfilled.svg"
                      alt="ArrowDropDownFilled"
                    />
                  }
                  isMulti={false}
                  name="input"
                  options={inputOptionsList}
                  isSearchable={false}
                  placeholder="Rocky"
                  shape="round"
                  color="black_900_3a"
                  size="xs"
                  variant="outline"
                />
              </div>
            </div>
          </div>
        </div>
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
          <div className="flex flex-row gap-3 items-center justify-between w-[541px] sm:w-full">
            <Text
              className="text-gray-800 text-lg tracking-[0.15px] w-auto"
              size="txtRalewayRomanRegular18"
            >
              {props?.date}
            </Text>
            <Input
              name="dateslot"
              placeholder="01.01.2024"
              className="!placeholder:text-black-900_99 !text-black-900_99 font-raleway p-0 text-base text-left tracking-[0.50px] w-full"
              wrapClassName="flex md:h-auto w-[300px]"
              suffix={
                <Img
                  className="h-6 ml-[35px] my-auto"
                  src="images/img_icbaselinecalendarmonth.svg"
                  alt="ic:baseline-calendar-month"
                />
              }
              shape="round"
              color="black_900_3a"
              size="xs"
              variant="outline"
            ></Input>
          </div>
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
            ></Input>
          </div>
          <div className="flex flex-row gap-3 h-[75px] md:h-auto items-center justify-between w-[541px] sm:w-full">
            <Text
              className="text-gray-800 text-lg tracking-[0.15px] w-auto"
              size="txtRalewayRomanRegular18"
            >
              {props?.notes}
            </Text>
            <div className="border border-black-900_3a border-solid flex flex-col h-[75px] md:h-auto items-start justify-start px-3 py-2 rounded w-[300px]">
              <div className="flex flex-col items-center justify-start w-full">
                <Text
                  className="leading-[24.00px] max-w-[215px] md:max-w-full text-base text-black-900_99 tracking-[0.15px]"
                  size="txtRalewayRomanRegular16"
                >
                  {props?.defaultslotOne}
                </Text>
              </div>
            </div>
          </div>
        </div>
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
              <div className="flex flex-col items-center justify-start w-[77%] sm:w-full">
                <Input
                  name="inputslot_Six"
                  placeholder="0.000000"
                  className="!placeholder:text-black-900_dd !text-black-900_dd font-roboto md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.15px] w-full"
                  wrapClassName="w-full"
                  shape="round"
                  color="black_900_3a"
                  size="xs"
                  variant="outline"
                ></Input>
              </div>
              <div className="flex flex-col items-start justify-start w-[71px] sm:w-full">
                <FloatingInput
                  wrapClassName="bg-transparent border border-black-900_3a border-solid flex pl-3 pr-[35px] py-2.5 rounded top-[0] w-full"
                  className="font-roboto p-0 placeholder:bg-white-A700 placeholder:left-3 placeholder:text-black-900_99 placeholder:top-[0] sm:pr-5 text-black-900_99 text-left text-xs tracking-[0.15px] w-full"
                  name="label_One"
                  labelClasses="bg-white-A700 left-3 top-[0] text-black-900_99"
                  focusedClasses="translate-y-[10px] scale-[1]"
                  wrapperClasses="w-full top-[0]"
                  labelText="unit"
                  defaultText="unit"
                  suffix={
                    <Img
                      className="top-[0] my-auto"
                      src="images/img_arrowdropdownfilled.svg"
                      alt="ArrowDropDownFilled"
                    />
                  }
                ></FloatingInput>
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
              <div className="flex flex-col items-center justify-start w-[77%] sm:w-full">
                <Input
                  name="inputslot_Seven"
                  placeholder="0.000000"
                  className="!placeholder:text-black-900_dd !text-black-900_dd font-roboto md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.15px] w-full"
                  wrapClassName="w-full"
                  shape="round"
                  color="black_900_3a"
                  size="xs"
                  variant="outline"
                ></Input>
              </div>
              <div className="flex flex-col items-start justify-start w-[71px] sm:w-full">
                <FloatingInput
                  wrapClassName="bg-transparent border border-black-900_3a border-solid flex pl-3 pr-[35px] py-2.5 rounded top-[0] w-full"
                  className="font-roboto p-0 placeholder:bg-white-A700 placeholder:left-3 placeholder:text-black-900_99 placeholder:top-[0] sm:pr-5 text-black-900_99 text-left text-xs tracking-[0.15px] w-full"
                  name="label_One"
                  labelClasses="bg-white-A700 left-3 top-[0] text-black-900_99"
                  focusedClasses="translate-y-[10px] scale-[1]"
                  wrapperClasses="w-full top-[0]"
                  labelText="unit"
                  defaultText="unit"
                  suffix={
                    <Img
                      className="top-[0] my-auto"
                      src="images/img_arrowdropdownfilled.svg"
                      alt="ArrowDropDownFilled"
                    />
                  }
                ></FloatingInput>
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
        >
          {props?.next}
        </Button>
      </div>
    </>
  );
};

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
