import React from "react";

import { Button, FloatingInput, Img, Input, SelectBox, Text } from "../../components";
import DataInputForm from "../../components/DataInputForm";

const inputOptionsList = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

const DataInputFormPage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col font-raleway items-start justify-end mx-auto md:px-10 sm:px-5 px-[132px] w-full">
        <div className="flex flex-col items-center justify-end w-[93%] md:w-full">
          <DataInputForm className="bg-white-A700 flex flex-col gap-6 items-start justify-start pb-3 px-3 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] shadow-bs w-full" />
        </div>
      </div>
    </>
  );
};

export default DataInputFormPage;
