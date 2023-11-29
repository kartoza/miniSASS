import React, { useState } from 'react';
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
  setFieldValue: (name: string, value: any) => void
}

/** Coordinates input form. **/
export default function CoordinatesInputForm(
  { values, setFieldValue }: Interface
) {
  const [type, setType] = useState<string>('DMS')

  /** set latitude **/
  const setLatitude = (val) => {
    setFieldValue('latitude', val)
  }

  /** set longitude **/
  const setLongitude = (val) => {
    setFieldValue('longitude', val)
  }

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
          latitude={values.latitude} setLatitude={setLatitude}
          longitude={values.longitude} setLongitude={setLongitude}
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