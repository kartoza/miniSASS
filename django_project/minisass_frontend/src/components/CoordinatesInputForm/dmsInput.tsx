import React, { useEffect, useState } from 'react';
import { Text } from "../Text";
import { Field } from "formik";


const inputDirectionUnitsList = {
  "dms latitude": [
    { label: "N", value: "N" },
    { label: "S", value: "S" },
  ],
  "dms longitude": [
    { label: "E", value: "E" },
    { label: "W", value: "W" },
  ]
}

export interface DegreeInputSectionInterface {
  id: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean
}

/** Input Section **/
function DmsInputSection(
  { id, value, max, min, onChange, disabled }: DegreeInputSectionInterface
) {
  return <Field
    id={id}
    value={value}
    type="number"
    disabled={disabled}
    className="!placeholder:text-black-900_99 !text-black-900_99 font-raleway md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.50px] w-full dms-input"
    wrapClassName="sm:w-full"
    shape="round"
    color="black_900_3a"
    size="xs"
    variant="outline"
    step={0.01}
    min={min}
    max={max}
    placeholder="0.000000"
    onChange={(evt) => {
      let value = parseFloat(evt.target.value)
      if (parseFloat(evt.target.value) > max) {
        value = max
      } else if (parseFloat(evt.target.value) < min) {
        value = min
      }
      onChange(value)
    }}
  />
}

export interface ValueInterface {
  degrees: number;
  minutes: number;
  seconds: number;
  cardinal: string
}

export interface DegreeInputInterface {
  label: string,
  value: ValueInterface;
  onChange: (values: ValueInterface) => void;
  disabled?: boolean
}

/** Degree input form. **/
function DmsInput({ label, value, onChange, disabled }: DegreeInputInterface) {
  const [currValue, setCurrValue] = useState(value)
  const { degrees, minutes, seconds, cardinal } = currValue


  useEffect(() => {
    onChange(
      {
        degrees: degrees,
        minutes: minutes,
        seconds: seconds,
        cardinal: cardinal
      }
    )
  }, [currValue]);

  return <div
    className="flex sm:flex-col flex-row items-center w-[541px] sm:w-full"
    style={{ marginBottom: "2%" }}
  >
    <Text
      className="text-gray-800 text-lg tracking-[0.15px] w-full"
    >
      {label}:
    </Text>
    <DmsInputSection
      id={label + 'degrees'}
      value={degrees} min={-18000} max={18000}
      disabled={disabled}
      onChange={(val) => {
        setCurrValue(
          {
            ...currValue,
            degrees: val
          }
        )
      }}/>
    <div className='indicator'>°</div>
    <DmsInputSection
      id={label + 'minutes'}
      value={minutes} min={0} max={6000}
      disabled={disabled}
      onChange={(val) => {
        setCurrValue(
          {
            ...currValue,
            minutes: val
          }
        )
      }}/>
    <div className='indicator'>'</div>
    <DmsInputSection
      id={label + 'seconds'}
      value={seconds} min={0} max={7200}
      disabled={disabled}
      onChange={(val) => {
        setCurrValue(
          {
            ...currValue,
            seconds: val
          }
        )
      }}/>
    <div className='indicator'>"</div>
    <Field
      as="select"
      className="!text-black-900_99 font-raleway text-base text-left"
      placeholderClassName="!text-black-900_99"
      placeholder=""
      shape="round"
      color="black_900_3a"
      size="xs"
      variant="outline"
      value={cardinal}
      disabled={disabled}
      style={{
        width: '80px',
        maxWidth: '80px',
        height: '40px',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: '4px',
        padding: '8px 12px',
        marginLeft: '1.5%'
      }}
      onChange={(evt) => {
        setCurrValue(
          {
            ...currValue,
            cardinal: evt.target.value
          }
        )
      }}
    >
      {
        inputDirectionUnitsList[label.toLowerCase()].map((option) => {
          return <option
            key={option.value} value={option.value}
            selected={option.value === cardinal}>
            {option.label}
          </option>
        })
      }
    </Field>
  </div>
}

export interface DmsInputsInterface {
  latitude: ValueInterface,
  setLatitude: (values: ValueInterface) => void;
  longitude: ValueInterface,
  setLongitude: (values: ValueInterface) => void;
  disabled?: boolean
}

/** Degree input form. **/
export default function DmsInputs(
  { latitude, setLatitude, longitude, setLongitude, disabled }: DmsInputsInterface
) {
  return <>
    <DmsInput
      label='DMS latitude'
      disabled={disabled}
      value={latitude}
      onChange={(val: ValueInterface) => {
        setLatitude(val)
      }}
    />
    <DmsInput
      label='DMS longitude'
      disabled={disabled}
      value={longitude}
      onChange={(val: ValueInterface) => {
        setLongitude(val)
      }}
    />
  </>
}
