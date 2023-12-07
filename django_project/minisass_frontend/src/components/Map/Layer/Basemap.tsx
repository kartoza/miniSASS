import React, { useEffect, useState } from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

export interface BasemapConfiguration {
  name: string,
  config: Object,
}

interface Interface {
  basemapChanged: (BasemapConfiguration) => void,
  items: BasemapConfiguration[],
  idxActive: number;
  setIdxActive: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Basemap component
 * @param props
 * @constructor
 */
export default function Basemap(props: Interface) {

  const [idxActive, setIdxActive] = useState<number>(0);


  /** First initiate */
  useEffect(() => {
    setIdxActive(props.idxActive)
    props.basemapChanged(props.items[props.idxActive])  
  }, [props.idxActive]);

  useEffect(() => {
    setIdxActive(idxActive)
    props.setIdxActive(idxActive)
    props.basemapChanged(props.items[idxActive]) 
  }, [idxActive]);

  return <RadioGroup
    value={idxActive}
    onChange={evt => {
      setIdxActive(parseInt(evt.target.value))
      props.basemapChanged(props.items[evt.target.value])
    }}
  >
    {
      props.items.map((item, idx) => {
          return <FormControlLabel
            key={idx}
            value={idx}
            control={<Radio/>}
            label={item.name}/>
        }
      )
    }
  </RadioGroup>
}
