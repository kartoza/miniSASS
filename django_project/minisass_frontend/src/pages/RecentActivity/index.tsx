import axios from "axios";
import BaseContainer from '../../components/BaseContainer/';
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {getTitle, globalVariables} from "../../utils";
import {useAuth} from "../../AuthContext";
import {Grid} from '@mui/material'
import MUIDataTable from "mui-datatables";
import {Text} from "../../components";
import PageviewIcon from '@mui/icons-material/Pageview';

const OBSERVATION_LIST_URL = globalVariables.baseUrl + '/monitor/observations/recent-observations';


interface Observation {
  observation: number;
  site: string;
  username: string;
  organisation: string;
  time_stamp: string;
  obs_date: string;
  score: string;
}

const RecentActivity: React.FC = () => {

  // State to control which form to display
  const location = useLocation();
  const [observationList, setObservationList] = useState<Observation[]>([]);
  const navigate = useNavigate();

  const navigateToMap = (value) => {
    // Navigate to the map page with details set to the observation's primary key
    navigate(`/map?details=${value}`);
  };

  const sampleObs = {
    observation: 0,
    site: '',
    username: '',
    organisation: '',
    time_stamp: '',
    obs_date: '',
    score: 0,
  }

  const columns = Object.keys(sampleObs).map((key) => ({
    name: key,
    label: getTitle(key),
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        if (key === 'observation') {
          return (
            <>
              {value}
              {/*<p onClick={() => {navigateToMap(value)}}>(View Detail)</p>*/}
              <PageviewIcon onClick={() => {navigateToMap(value)}} />
            </>
          );
        }
        return value
      }
    }
  }));
  const { dispatch, state  } = useAuth();

  // TODO: refactor to use
  const fetchObservations = async () => {
    const url = `${OBSERVATION_LIST_URL}/?recent=False&by_user=True`
    // axios.defaults.headers.common['Authorization'] = state.user.access_token
    const headers = { 'Authorization': `Bearer ${state.user.access_token}` };
    axios.get(url, {headers}).then((response) => {
      if (response.data) {
          setObservationList(response.data as Observation[])
      }
    }).catch((error) => {
        console.log(error)
    })
  }

  useEffect(() => {
    fetchObservations();
  }, []);

  return (
    <BaseContainer>
      <Grid container flexDirection={'column'}>
        <Grid item>
          <Text
              className="sm:flex-1 ml-2 sm:ml-[0] sm:mt-0 mt-[3px] sm:text-[32px] md:text-[38px] text-[42px] text-blue-900 w-[28%] sm:w-full"
              size="txtRalewayRomanBold42"
            >
              Recent Activities
            </Text>
        </Grid>
        <Grid item>
          <MUIDataTable
            data={observationList}
            columns={columns}
            options={{
              selectableRows: false
            }}
          />
        </Grid>
      </Grid>
    </BaseContainer>
  );
};

export default RecentActivity;