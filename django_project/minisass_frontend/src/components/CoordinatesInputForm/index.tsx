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
  updateMapLocation: (longitude: number, latitude: number) => void
}

const detailed = 10000

/** Coordinates input form. **/
export default function CoordinatesInputForm(
  { values, setFieldValue,updateMapLocation }: Interface
) {
  const [type, setType] = useState<string>('DMS')

  const [prev_lat, setPrevLat] = useState(0)
  const [prev_long, setPrevLong] = useState(0)

  /** set latitude **/
  const setLatitude = (val) => {
    val = Math.floor(val * detailed) / detailed
    setFieldValue('latitude', val)
    setPrevLat(val)
  }

  /** set longitude **/
  const setLongitude = (val) => {
    val = Math.floor(val * detailed) / detailed
    setFieldValue('longitude', val)
    setPrevLong(val)
  }

  useEffect(() => {
    updateMapLocation(prev_long,prev_lat)
  }, [prev_lat,prev_long]);

  return <div className='CoordinatesInputForm'>
    <RadioGroup
      value={type}
      onChange={(evt) => setType(evt.target.value)}
      row
    >
      <FormControlLabel value="DMS" control={<Radio/>} label="DMS"/>
      <FormControlLabel value="Degree" control={<Radio/>} label="Degree"/>
    </RadioGroup>
    {
      type === 'Degree' ?
        <DegreeInputs
          latitude={values.latitude} 
          longitude={values.longitude}
          setLatitude={(value) => {
            setFieldValue('latitude', value);
            updateMapLocation(values.latitude, Number(value)); // Call updateMapLocation here
          }}
          setLongitude={(value) => {
            setFieldValue('longitude', value);
            updateMapLocation(values.longitude, Number(value)); // Call updateMapLocation here
          }}
        /> :
        <DmsInputs
          latitude={convertToDMSLatitude(values.latitude)}
          setLatitude={(values: ValueInterface) => {
            setLatitude(
              convertDmsToLatitude(
                values.degrees, values.minutes, values.seconds, values.cardinal
              )
            )
          }}
          longitude={convertToDMSLongitude(values.longitude)}
          setLongitude={(values: ValueInterface) => {
            setLongitude(
              convertDmsToLongitude(
                values.degrees, values.minutes, values.seconds, values.cardinal
              )
            )
          }}
        />
    }
  </div>
}
