import React, { useEffect, useState } from 'react';
import { Text } from "../Text";
import { Field } from "formik";
import { debounce } from '@mui/material/utils';
import { globalVariables } from "../../utils";
import axios from "axios";

export interface DegreeInputInterface {
  label: string;
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
  disabled?: boolean;
}

function DegreeInput({ label, value, onChange, disabled }: DegreeInputInterface) {
  const [currValue, setCurrValue] = useState(value);
  
  const convertToSixDecimals = React.useMemo(
    () =>
      debounce(
        (value: number) => {
          setCurrValue(Number(value).toFixed(6));
        },
        1000,
      ),
    [],
  );

  useEffect(() => {
    if (!isNaN(currValue)) {
      onChange(currValue);
    }
  }, [currValue, onChange]);

  return (
    <div className="flex sm:flex-col flex-row gap-3 items-center justify-between w-[541px] sm:w-full" style={{ marginBottom: "2%" }}>
      <Text className="text-gray-800 text-lg tracking-[0.15px] w-auto">
        {label}:
      </Text>
      <Field
        id={label}
        value={currValue}
        type="number"
        onBlur={(evt) => {
          convertToSixDecimals(evt.target.value);
        }}
        disabled={disabled}
        className="!placeholder:text-black-900_99 !text-black-900_99 font-raleway md:h-auto p-0 sm:h-auto text-base text-left tracking-[0.50px] w-full"
        wrapClassName="sm:w-full"
        shape="round"
        color="black_900_3a"
        size="xs"
        variant="outline"
        placeholder="0.000000"
        step={0.0001}
        style={{
          width: '300px',
          maxWidth: '300px',
          height: '40px',
          border: `1px solid ${!currValue ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
          borderRadius: '4px',
          padding: '8px 12px',
          marginRight: '-2%'
        }}
        onChange={(evt) => {
          let value = evt.target.value;
          if (!isNaN(parseFloat(evt.target.value))) {
            const min = label === 'Latitude' ? -90 : -180;
            const max = -1 * min;
            if (value > max) {
              value = max;
            } else if (value < min) {
              value = min;
            }
          }
          setCurrValue(value);
        }}
      />
    </div>
  );
}

export interface DegreeInputsInterface {
  latitude: number;
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
  longitude: number;
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
  disabled?: boolean;
}

export default function DegreeInputs(
  { latitude, setLatitude, longitude, setLongitude, disabled }: DegreeInputsInterface
) {
  const [valueChanged, setValueChanged] = useState(false);

  const checkSiteIsLand = React.useMemo(
    () =>
      debounce(
        (lat: number, long: number) => {
          if (lat !== 0 || long !== 0) {
            (
              async () => {
                try {
                  const response = await axios.get(`${globalVariables.baseUrl}/monitor/sites/is-land/${lat}/${long}/`);
                  if (response.status === 200) {
                    if (!response.data.is_land) {
                      alert('Your points seem to be in the sea or not on land masses!');
                    }
                  }
                } catch (error) {
                  console.error('Error checking site land:', error);
                }
              }
            )();
          }
        },
        1000,
      ),
    []
  );

  useEffect(() => {
    if (valueChanged) {
      checkSiteIsLand(latitude, longitude);
      setValueChanged(false);
    }
  }, [valueChanged]);

  return (
    <>
      <DegreeInput
        label='Latitude'
        value={latitude}
        onChange={(value) => {
          setLatitude(value);
          setValueChanged(true);
        }}
        disabled={disabled}
      />
      <DegreeInput
        label='Longitude'
        value={longitude}
        onChange={(value) => {
          setLongitude(value);
          setValueChanged(true);
        }}
        disabled={disabled}
      />
    </>
  );
}
