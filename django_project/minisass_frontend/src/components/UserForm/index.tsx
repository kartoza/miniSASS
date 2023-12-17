import React, {useEffect} from 'react';
import Modal from 'react-modal';
import {Button, Img} from "../../components";
import {globalVariables} from '../../utils';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import EditProfile from './EditProfile'
import EditPassword from './EditPassword'
import UploadCertificate from './UploadCertificate'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './index.css'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{width: '100%'}}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


interface FormModalProps {
  isOpen: boolean;
  onClose: void;
  defaultTab: number;
  loading: boolean;
  inProgress: boolean;
}


const UserFormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  defaultTab,
 }) => {
  const [value, setValue] = React.useState(defaultTab);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [itemUpdated, setItemUpdated] = React.useState<string>('');
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const closeSuccessMessage = () => {
    setSuccess(false);
  }

  useEffect(() => {
    setValue(defaultTab ? defaultTab : 0)
  }, [isOpen]);


  return (
    <>
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '50vw',
          background: 'white',
          border: 'none',
          borderRadius: '0px 25px 25px 25px',
          overflowX: 'hidden'
        },
      }}
    >
      {loading ? (
        <LinearProgress color="success" />
      ) : success ? (
        <div>
          <h3
              style={{
                fontFamily: 'Raleway',
                fontStyle: 'normal',
                fontWeight: 700,
                alignItems: 'flex-start',
                fontSize: '24px',
                lineHeight: '136.4%',
                color: '#539987',
              }}
            >
              Success
            </h3>
            <br />
          <Typography>
            {`${itemUpdated} has been successfully updated.`}
          </Typography>

          <Button
              className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
              color="blue_gray_500"
              size="xs"
              variant="fill"
              style={{ marginLeft: "65%" }}
              onClick={closeSuccessMessage}
            >
              Ok
            </Button>
        </div>
      ) : (
        
      
      isOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '32px',
            gap: '18px',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '55%',
              width: '60vw',
              height: '33px',
            }}
          >
            <h3
              style={{
                fontFamily: 'Raleway',
                fontStyle: 'normal',
                fontWeight: 700,
                alignItems: 'flex-start',
                fontSize: '24px',
                lineHeight: '136.4%',
                color: '#539987',
              }}
            >
              Update Account
            </h3>
            <Img
              className="h-6 w-6 common-pointer"
              src={`${globalVariables.staticPath}img_icbaselineclose.svg`}
              alt="close"
              onClick={onClose}
              style={{marginLeft: '30px'}}
            />
          </div>
          <Box
            sx={{bgcolor: 'background.paper', display: 'flex', width: '100%'}}
          >
            <TabPanel value={value} index={0}>
              <EditProfile
                setLoading={setLoading}
                setSuccess={setSuccess}
                setItemUpdated={setItemUpdated}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <EditPassword
                setLoading={setLoading}
                setSuccess={setSuccess}
                setItemUpdated={setItemUpdated}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <UploadCertificate
                setLoading={setLoading}
                setSuccess={setSuccess}
                setItemUpdated={setItemUpdated}
              />
            </TabPanel>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{borderRight: 1, borderColor: 'divider', minWidth: '200px'}}
            >
              <Tab label="Profile" {...a11yProps(0)} />
              <Tab label="Change Password" {...a11yProps(2)} />
              <Tab label="Upload Certificate" {...a11yProps(3)} />
            </Tabs>
          </Box>
        </div>
      )
      )}
    </Modal>
  </>
  );
};

export default UserFormModal;