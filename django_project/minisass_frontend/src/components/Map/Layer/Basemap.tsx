import React, { useEffect, useState } from "react";
import 'maplibre-gl/dist/maplibre-gl.css';
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

export interface BasemapConfiguration {
  name: string,
  config: Object,
}

interface Interface {
  basemapChanged: (BasemapConfiguration) => void,
  items: Array<BasemapConfiguration>,
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
    props.basemapChanged(props.items[idxActive])
  }, [idxActive]);

  return <RadioGroup
    value={idxActive}
    onChange={evt => {
      setIdxActive(parseInt(evt.target.value))
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
