import React, {useEffect, useRef, useState} from "react";
import Modal from 'react-modal';
import { Button, Img, Text } from "../../components";
import { FaTrash } from 'react-icons/fa';
import Grid from '@mui/material/Grid';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: any,
  accept?: string
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSubmit, accept= '.jpg, .jpeg, .png' }) => {
  // Get the current URL using window.location.href
  const currentURL = window.location.href;

  // Extract the base URL (everything up to the first single forward slash '/')
  const parts = currentURL.split('/');
  const baseUrl = parts[0] + '//' + parts[2]; // Reconstruct the base URL

  // Define the replacement path
  const replacementPath = 'static/images/';

  // Construct the new URL with the replacement path
  const newURL = baseUrl + '/' + replacementPath;
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [clearAll, setClearAll] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const handleClearFile = () => {
    setUploadedFiles([]);
    setClearAll(true);
  };

  useEffect(() => {
    if (clearAll) {
      onSubmit(uploadedFiles);
    }
  }, [clearAll])

  useEffect(() => {
    if (isOpen) {
      setClearAll(false);
    }
  }, [isOpen])

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input
    }
  };

  return (
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
          maxWidth: '600px',
          background: 'white',
          border: 'none',
          borderRadius: '0px 25px 25px 25px',
          maxHeight: '67vh'
        },
      }}
    >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '5%'
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
                flex: 1, // Expand to take the remaining space
                marginLeft: '45%'
              }}
            >
              Upload
            </h3>
            <div
              onClick={onClose}
              style={{
                cursor: 'pointer',
                marginRight: '7%'

              }}
            >
              X
            </div>
          </div>
          <div className="flex flex-col gap-[30px] w-[88%] md:w-full" style={{marginLeft: '6%'}}>
            <div className="bg-gray-50 border border-dashed border-indigo-500_4c flex flex-col font-mulish gap-[21px] items-center justify-start p-[34px] sm:px-5 rounded-bl-[25px] rounded-br-[25px] rounded-tl-[25px] w-full">


              <div className="flex flex-col items-start justify-start p-[5px] w-auto">

                  <Grid container flexDirection={'row'} spacing={2}>
                    <Grid item>
                      <Grid container flexDirection={'column'}>
                        {uploadedFiles.map((file, index) => (
                            <Grid item>
                              <span className="text-gray-700">{file.name}</span>
                            </Grid>
                        ))}
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container flexDirection={'column'}>
                        {uploadedFiles.map((file, index) => (
                          <Grid item>
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="text-red-500 font-bold cursor-pointer"
                            >
                              <FaTrash />
                            </button>
                        </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item xs={3}>
                      <Img
                        className="h-[59px] mt-[111px]"
                        src={`${newURL}img_download.svg`}
                        alt="download"
                        style={{cursor: 'pointer'}}
                        onClick={handleBrowseClick}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Text
                          className="text-base text-blue_gray-900 text-center w-auto"
                          size="txtMulishRomanBold16"
                        >
                        {/* TODO : We remove this until we can do drag/drop */}
                        {/*<span className="text-gray-800 font-raleway font-bold">*/}
                        {/*  Drag & drop files or*/}
                        {/*</span>*/}
                        <span className="text-blue_gray-900 font-raleway font-bold">
                          {" "}
                        </span>
                        <a
                          className="text-blue_gray-500 font-raleway font-bold underline cursor-pointer"
                          onClick={handleBrowseClick}
                        >
                          Browse
                        </a>
                      </Text>
                    </Grid>
                    <Grid item sx={3}>
                      <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        accept={accept}
                        multiple
                      />
                    </Grid>
                  </Grid>
              </div>


              <div className="flex flex-col font-raleway items-start justify-start mb-[106px] p-[5px] w-auto sm:w-full">
                <Grid container flexDirection="column" alignItems="center" justifyContent="center">
                  <Grid item xs={3}>
                    <button
                      onClick={handleClearFile}
                      className="text-red-500 font-bold cursor-pointer"
                    >
                      Clear
                    </button>
                  </Grid>
                </Grid>
                <Text
                  className="text-center text-gray-700 text-xs w-auto"
                  size="txtRalewayRomanRegular12"
                >
                  Supported formats: <span style={{ textTransform: "uppercase" }}>{accept}</span>
                </Text>
              </div>
            </div>
            <Button
              className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[100%] opacity-50 hover:opacity-100 p-1"
              color="blue_gray_500"
              size="xl"
              variant="fill"
              style={{
                fontWeight: 'bold',
              }}
              onClick={() => {
                onSubmit(uploadedFiles)
              }}
            >
              Upload chosen files
            </Button>

            {/* Hidden input element for file selection */}
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileUpload}
              multiple
              ref={fileInputRef}
            />
          </div>

          </Modal>
  );
};

export default UploadModal;
