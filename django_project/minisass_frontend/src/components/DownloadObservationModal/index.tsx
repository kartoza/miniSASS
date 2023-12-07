import React, {FormEvent, useState} from 'react';
import {DownloadObservationFormData} from '../../components/ContactFormModal/types';
import {Button, Img} from "../../components";
import Modal from 'react-modal';
import axios from 'axios'
import {globalVariables} from '../../utils';
import Select from 'react-select';
import dayjs from 'dayjs';
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DateField} from '@mui/x-date-pickers/DateField';

export interface DownloadObservationFormData {
    type: string,
    includeImage: boolean,
    startDate: string,
    endDate: string,
}

interface DownloadObservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate: string;
  siteId: number;
}

const DownloadObservationForm: React.FC<DownloadObservationFormProps> = ({ isOpen, onClose,
                                                                           defaultDate, siteId}) => {
  const initialState: DownloadObservationFormData = {
    type: 'csv',
    includeImage: false,
    startDate: dayjs(defaultDate),
    endDate: dayjs(defaultDate)
  };
  const typeOptions = [
    { value: 'csv', label: 'CSV' },
    { value: 'geopackage', label: 'GeoPackage' }
  ];

  const [formData, setFormData] = useState<DownloadObservationFormData>(initialState);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [showHeading, setShowHeading] = useState<boolean>(true);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    downloadFile()
    setFormData({
      type: 'csv',
      includeImage: false,
      startDate: dayjs(defaultDate),
      endDate: dayjs(defaultDate)
    });
  };


  const DOWNLOAD_OBSERVATIONS_URL = globalVariables.baseUrl + '/monitor/observations/download-v2'

  const downloadFile = async () => {

    try {
      const startDate = formData.startDate.format('YYYY-MM-DD');
      const endDate = formData.endDate.format('YYYY-MM-DD');
      const url = `${DOWNLOAD_OBSERVATIONS_URL}/${siteId}?type=${formData.type}&start_date=${startDate}&end_date=${endDate}`;
      const response = await axios.get(url, { responseType: 'blob' });

      if (response.status === 200) {
        const href = URL.createObjectURL(response.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        const fileName = formData.type === 'csv' ? 'observations.csv' : 'observations.gpkg'
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        setIsError(false);
        setShowHeading(false);
        setResponseMessage(null);
      } else {
        setIsError(true);
        setShowHeading(false);
        setResponseMessage(JSON.stringify(response.data));
      }
    } catch (error) {
      setIsError(true);
      setShowHeading(false);
      setResponseMessage(error.message);
    }
  };

  const resetForm = () => {
    setFormData(initialState);
    setShowHeading(true);
    setResponseMessage(null);
    setIsError(false);
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '605px',
          height: '350px',
          borderRadius: '0px 25px 25px 25px',
          border: 'none',
          background: 'white',
          padding: 0,
        },
      }}
    >
      {isOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '32px',
            gap: '18px',
            position: 'relative',
            width: '605px',
            height: '350px',
            background: 'white',
            borderRadius: '0px 25px 25px 25px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '10px',
              width: '541px',
              height: '33px',
            }}
          >
            <h3
              style={{
                fontFamily: 'Raleway',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '136.4%',
                color: '#539987',
                flex: '1',
              }}
            >
              {isError ? (
                <div className="bg-red-100 text-red-600 p-1 rounded">{responseMessage}</div>
              ) : <div>Download Observations</div>}
            </h3>
            <Img
                className="h-6 w-6 common-pointer"
                src={`${globalVariables.staticPath}img_icbaselineclose.svg`}
                alt="close"
                onClick={handleCloseModal}
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
          </div>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '6px',
              width: '541px',
            }}
          >
        {showHeading && (
              <label>
                File Type:
              </label>
        )}
        <Select
          name="type"
          placeholder="Select File Type..."
          value={typeOptions.find(option => option.value === formData.type)}
          onChange={(selectedOption) => {
            setFormData({ ...formData, type: selectedOption.value });
          }}
          options={typeOptions}
          styles={{
            control: (styles, { isFocused }) => ({
              ...styles,
              borderRadius: '4px',
              width: '245px',
              borderColor: isFocused ? '#539987' : 'rgba(0, 0, 0, 0.23)',
            }),
            option: (styles, { isFocused }) => ({
              ...styles,
              backgroundColor: isFocused ? '#539987' : 'white',
              color: isFocused ? 'white' : 'black',
              zIndex: 9999
            }),
            menu: (styles) => ({
              ...styles,
              width: '245px',
            }),
          }}
        />
        <label>
          Date Range:
        </label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateField', 'DateField']}>
            <DateField
              label="Start Date"
              format="DD-MM-YYYY"
              value={formData.startDate}
              onChange={(newValue) => setFormData({ ...formData, startDate: newValue })}
              style={{zIndex: 0}}
            />
            <DateField
              label="End Date"
              format="DD-MM-YYYY"
              value={formData.endDate}
              onChange={(newValue) => setFormData({ ...formData, endDate: newValue })}
            />
          </DemoContainer>
        </LocalizationProvider>
      </form>
          <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '10px',
                width: '541px',
                height: '37px'
              }}
            >
              <Button
                className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
                color="blue_gray_500"
                size="xs"
                variant="fill"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
        </div>
      )}
    </Modal>
  );
};

export default DownloadObservationForm;
