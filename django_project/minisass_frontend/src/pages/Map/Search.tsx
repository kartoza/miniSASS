import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { debounce } from '@mui/material/utils';
import { CircularProgress } from "@mui/material";


interface PlaceType {
  value: string
  source: string
  label: string
  data: {
    osm_id: number,
    osm_type: string,
  }
}

interface Interface {
  searchEntityChanged: (geojson) => void,
}

const NOMINATIM = 'nominatim'
const SITES = 'sites'
let lastQuery = ''
let lastValue = ''

/** Search input */
export default function Search(props: Interface) {
  const [value, setValue] = useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<readonly PlaceType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // This is sites data
  const [sites, setSites] = useState<PlaceType[]>(null);

  /**
   * This function removes newline characters from a string.
   */
  function escape(str) {
    return str
      .replace(/[\n]/g, " ")
      .replace(/[\r]/g, " ");
  }

  /** Fetch sites data at first time */
  useEffect(() => {
    (
      async () => {
        try {
          const response = await fetch('https://minisass.org' + '/map/sites/-9/-9/-9/');
          const text = await response.text();
          const json = JSON.parse(escape(text))
          const results: PlaceType[] = []
          json.features.map(row => {
            const properties = row.properties
            results.push({
              value: properties.gid,
              source: SITES,
              label: properties.combo_name,
              data: row
            })
          })
          setSites(results)
        } catch (error) {

        }
      }
    )()
  }, []);

  // Fetching results
  const fetchResults = React.useMemo(
    () =>
      debounce(
        (
          query: string,
          sites: PlaceType[],
          callback: (query: string, results?: readonly PlaceType[],) => void,
        ) => {
          setLoading(true);
          lastQuery = query;
          (
            async () => {
              try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`);
                const json = await response.json();
                let results: PlaceType[] = []
                json.map(row => {
                  results.push({
                    value: row.place_id,
                    source: NOMINATIM,
                    label: row.display_name,
                    data: row
                  })
                })
                if (sites) {
                  results = results.concat(sites.filter(site => site.label.includes(query)))
                }
                callback(query, results)
              } catch (error) {

              }
            }
          )()
        },
        400,
      ),
    [],
  );

  /**
   * Use effect when input changed.
   * Do fetching request
   *  */
  useEffect(() => {
    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetchResults(inputValue, sites, (query: string, results?: readonly PlaceType[]) => {
      if (query !== lastQuery) {
        return
      }
      let newOptions: PlaceType[] = [];
      if (value) {
        newOptions = [value];
      }
      if (results) {
        newOptions = [...newOptions, ...results];
      }
      setOptions(newOptions);
      setLoading(false);
    });
  }, [value, inputValue, fetch]);

  /**
   * Use effect when value changed.
   * If nominatim, get the detail
   * */
  useEffect(() => {
    lastValue = JSON.stringify(value)

    if (value) {
      setLoadingData(true);
      switch (value.source) {
        case NOMINATIM: {
          (
            async () => {
              const response = await fetch(`https://nominatim.openstreetmap.org/lookup?osm_ids=${value.data.osm_type[0].toUpperCase()}${value.data.osm_id}&format=geojson&polygon_geojson=1`);
              const json = await response.json();
              if (JSON.stringify(value) === lastValue) {
                props.searchEntityChanged(json);
                setLoadingData(false);
              }
            }
          )()
          break
        }
        case SITES: {
          props.searchEntityChanged(value.data);
          setLoadingData(false);
          break
        }
      }
    } else {
      props.searchEntityChanged({
        type: 'FeatureCollection',
        features: []
      });
    }
  }, [value]);

  return (
    <Autocomplete
      className='Search'
      sx={{ width: 300, height: 41 }}
      filterOptions={(x) => x}
      getOptionLabel={(option) => option.label}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      loading={loading}
      value={value}
      noOptionsText="Not found"
      onChange={(event: any, newValue: PlaceType | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      popupIcon={loadingData ? <CircularProgress size={20}/> : null}
      renderInput={(params) => {
        return <TextField
          {...params}
          placeholder="Search sites or place"
          fullWidth
        />
      }}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.value}>
            <Grid container alignItems="center">
              <Grid item sx={{
                width: '100% ',
                wordWrap: 'break-word'
              }}>
                <Typography variant="body2" color="text.secondary">
                  {option.label}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}