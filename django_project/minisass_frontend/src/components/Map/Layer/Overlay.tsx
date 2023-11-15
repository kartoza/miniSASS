import React, { useEffect, useState } from "react";
import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

export interface layerConfiguration {
  name: string,
  config: Object,
  activeByDefault: boolean
}

interface Interface {
  show: (layerConfiguration, rerender: boolean) => void,
  hide: () => void,
  layerConfig: layerConfiguration
}

/**
 * Overlay Layer component
 * @param props
 * @constructor
 */
export default function OverlayLayer(props: Interface) {
  const [active, setActive] = useState<boolean>(props.layerConfig.activeByDefault);
  const disabled = false

  /** First initiate */
  useEffect(() => {
    if (active) {
      props.show(props.layerConfig, false)
    } else {
      props.hide()
    }
  }, [active]);

  return <>
    <FormControlLabel
      disabled={disabled}
      control={
        <Checkbox
          checked={active}
          onChange={evt => {
            setActive(!active)
          }}/>
      }
      label={props.layerConfig.name}
    />
    <br/>
  </>
}
