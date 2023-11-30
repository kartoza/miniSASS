import React, { useEffect, useState } from "react";
import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import maplibregl from "maplibre-gl";
import { hideLayer, showLayer } from "../utils";

interface Interface {
  map: maplibregl.Map,
}

export const minisassObservationId = 'MiniSASS Observations'

/**
 * MiniSASS Layer component
 */
export default function MinisassLayer({ map }: Interface) {
  const [active, setActive] = useState<boolean>(true);
  const disabled = false

  /** First initiate */
  useEffect(() => {
    map.getStyle().layers.map(layer => {
      if (layer.source === minisassObservationId) {
        if (active) {
          showLayer(map, layer.id)
        } else {
          hideLayer(map, layer.id)
        }
      }
    })
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
      label={'miniSASS Observations'}
    />
    <br/>
  </>
}
