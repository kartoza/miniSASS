import React, { useEffect, useState } from 'react';
import { FormikValues } from 'formik';
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import DegreeInputs from "./degreeInputs";
import DmsInputs, { ValueInterface } from "./dmsInput";
import {
  convertDmsToLatitude,
  convertDmsToLongitude,
  convertToDMSLatitude,
  convertToDMSLongitude
} from "../../utils/coordinates";

import "./style.css"

export interface Interface {
  values: FormikValues,
  setFieldValue: (name: string, value: any) => void,
  defaultType: string,
  selectedCoordinates: {longitude: number, latitude: number},
  handleMapClick: (longitude: number, latitude: number) => void;
  selectOnMap: boolean;
  disabled?: boolean;
}

const detailed = 10000

/** Coordinates input form. **/
export default function CoordinatesInputForm(
  { values, setFieldValue, defaultType, handleMapClick, selectedCoordinates, selectOnMap, disabled }: Interface
) {
  const [type, setType] = useState<string>(defaultType)

  /** set latitude **/
  const setLatitude = (val) => {
    if (val) {
      setFieldValue('latitude', val)
    }
  }

  /** set longitude **/
  const setLongitude = (val) => {
    if (val) {
      setFieldValue('longitude', val)
    }
  }

  useEffect(() => {
    // console.log('debug coordinates: ', selectedCoordinates)
    setLatitude(selectedCoordinates.latitude)
    setLongitude(selectedCoordinates.longitude)
  }, [selectedCoordinates]);

  return <div className='CoordinatesInputForm'>
    {!selectOnMap ? (
      <RadioGroup
        value={type}
        onChange={(evt) => setType(evt.target.value)}
        row
      >
        <FormControlLabel value="DMS" control={<Radio/>} label="DMS"/>
        <FormControlLabel value="Degree" control={<Radio/>} label="Degree"/>
      </RadioGroup>
    ):(
      <RadioGroup
        value={`Degree`}
        onChange={(evt) => {
          setType(evt.target.value);
        }}
        row
      >
        <FormControlLabel value="Degree" control={<Radio/>} label="Degree"/>
      </RadioGroup>
    )}
    {selectOnMap ?
    (
      <DegreeInputs
        latitude={selectedCoordinates.latitude !== null ? selectedCoordinates.latitude.toFixed(6) : 0.000000}
        longitude={selectedCoordinates.longitude !== null ? selectedCoordinates.longitude.toFixed(6) : 0.000000}
        disabled={disabled}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
      />
    ) :
      type === 'Degree' ?
        <DegreeInputs
          latitude={values.latitude}
          longitude={values.longitude}
          disabled={disabled}
          setLatitude={(value) => {
            setFieldValue('latitude', value);
            handleMapClick(Number(value), Number(values.longitude))
          }}
          setLongitude={(value) => {
            setFieldValue('longitude', value);
            handleMapClick(Number(values.latitude), Number(value))
          }}
        />
        :
        <DmsInputs
          latitude={convertToDMSLatitude(values.latitude)}
          disabled={disabled}
          setLatitude={(values_internal: ValueInterface) => {
            setLatitude(
              convertDmsToLatitude(
                values_internal.degrees, values_internal.minutes, values_internal.seconds, values_internal.cardinal
              )
            )
            handleMapClick(
              Number(values.latitude),
              Number(values.longitude)
            )
          }}
          longitude={convertToDMSLongitude(values.longitude)}
          setLongitude={(values_internal: ValueInterface) => {
            setLongitude(
              convertDmsToLongitude(
                values_internal.degrees, values_internal.minutes, values_internal.seconds, values_internal.cardinal
              )
            )
            handleMapClick(
              Number(values.latitude),
              Number(values.longitude)
            )
          }}
        />
    }
  </div>
}
