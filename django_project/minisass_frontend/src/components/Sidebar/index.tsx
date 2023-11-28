// Sidebar.tsx

import React from "react";
import DataInputForm from "../../components/DataInputForm";
import ObservationDetails from "../../components/ObservationDetails";

interface SidebarProps {
  isOpen: boolean;
  isObservationDetails: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  observation: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isObservationDetails, setSidebarOpen , observation}) => {
  return (
    <div
      className={`absolute ${
        isOpen ? "right-0" : "-right-full"
      } bg-white-A700 flex flex-col  items-start justify-center py-5 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] top-[0%] sm:top-[25px] w-auto transition-all duration-300`}
    >
      {isObservationDetails ? (
        <ObservationDetails 
          classname="bg-white-A700 flex flex-col gap-6 items-start justify-start pb-3 px-3 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] shadow-bs w-full" 
          observation_id={observation}
          setSidebarOpen={setSidebarOpen}
        />
      ):( isOpen &&
        <DataInputForm className="bg-white-A700 flex flex-col gap-6 items-start justify-start pb-3 px-3 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] shadow-bs w-full" setSidebarOpen={setSidebarOpen} />
      )}
      
    </div>
  );
};

export default Sidebar;
