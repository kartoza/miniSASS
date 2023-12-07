import React, { useEffect, useState } from 'react';
import { Text } from "../Text";
import { Field } from "formik";


export interface DegreeInputInterface {
  label: string,
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
  disabled?: boolean
}

/** Degree input form. **/
function DegreeInput({ label, value, onChange, disabled }: DegreeInputInterface) {
  const [currValue, setCurrValue] = useState(value)
  const min = label === 'Latitude' ? -90 : -180
  const max = -1 * min


  useEffect(() => {
    if (!isNaN(currValue)) {
      onChange(currValue)
    }
  }, [currValue]);

  useEffect(() => {
    setCurrValue(value)
  }, [value]);

  return <div
    className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full"
    style={{ marginBottom: "2%" }}
  >
    <Text
      className="text-gray-800 text-lg tracking-[0.15px] w-auto"
    >
      {label}:
    </Text>
    <Field
      id={label}
      value={currValue}
      type="number"
      disabled={disabled}
      className="!placeholder:text-black-900_99 !text-black-900_99 font-raleway md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.50px] w-full"
      wrapClassName="sm:w-full"
      shape="round"
      color="black_900_3a"
      size="xs"
      variant="outline"
      min={min}
      max={max}
      placeholder="0.000000"
      step={0.0001}
      style={{
        width: '300px',
        maxWidth: '300px',
        height: '40px',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: '4px',
        padding: '8px 12px',
        marginRight: '-2%'
      }}
      onChange={(evt) => {
        let value = evt.target.value
        if (!isNaN(parseFloat(evt.target.value))) {
          if (value > max) {
            value = max
          } else if (value < min) {
            value = min
          }
        }
        setCurrValue(value)
      }}
    />
  </div>
}

export interface DegreeInputsInterface {
  latitude: number,
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
  longitude: number,
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
  disabled?: boolean
}

/** Degree input form. **/
export default function DegreeInputs(
  { latitude, setLatitude, longitude, setLongitude, disabled }: DegreeInputsInterface
) {
  return <>
    <DegreeInput
      label='Latitude'
      value={latitude}
      onChange={setLatitude}
      disabled={disabled}
    />
    <DegreeInput
      label='Longitude'
      value={longitude}
      onChange={setLongitude}
      disabled={disabled}
    />
  </>
}
