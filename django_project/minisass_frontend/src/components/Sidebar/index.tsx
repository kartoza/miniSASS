// Sidebar.tsx

import React from "react";
import DataInputForm from "../../components/DataInputForm";
import ObservationDetails from "../../components/ObservationDetails";

interface SidebarProps {
  isOpen: boolean;
  isObservationDetails: boolean;
  siteWithObservations: {site: {}, observations: []};
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  observation: string;
  toggleMapSelection: () => void;
  handleMapClick: (longitude: number, latitude: number) => void;
  selectingOnMap: boolean;
  selectedCoordinates: {longitude: number, latitude: number};
  resetMap: () => void;
  siteDetails: {};
  resetSiteDetails: (details: {}) => void;
  useSelectOnSite: (isSelectOnSite: boolean, supressObservationPanel: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  isObservationDetails,
  siteWithObservations,
  setSidebarOpen , 
  observation,
  toggleMapSelection, 
  handleMapClick,
  selectingOnMap,
  selectedCoordinates,
  resetMap,
  siteDetails,
  resetSiteDetails,
  useSelectOnSite
}) => {
  return (
    <div
      className={`absolute ${
        isOpen ? "right-[10px]" : "-right-full"
      } bg-white-A700 flex flex-col  items-start justify-center py-5 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] top-[0%] sm:top-[25px] w-auto transition-all duration-300`}
      style={{
        marginTop: '0.2%'
      }}
    >
      {isObservationDetails ? (
        <ObservationDetails 
          classname="bg-white-A700 flex flex-col gap-6 items-start justify-start pb-3 px-3 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] shadow-bs w-full" 
          observation_id={observation}
          setSidebarOpen={setSidebarOpen}
          handleMapClick={handleMapClick}
          siteWithObservations={siteWithObservations}
          resetMap={resetMap}
        />
      ):( isOpen &&
        <DataInputForm 
          className="bg-white-A700 flex flex-col gap-6 items-start justify-start pb-3 px-3 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] shadow-bs w-full" 
          setSidebarOpen={setSidebarOpen}
          toggleMapSelection={toggleMapSelection}
          handleMapClick={handleMapClick}
          selectingOnMap={selectingOnMap}
          selectedCoordinates={selectedCoordinates}
          resetMap={resetMap}
          siteDetails={siteDetails}
          resetSiteDetails={resetSiteDetails}
          useSelectOnSite={useSelectOnSite}
        />
      )}
      
    </div>
  );
};

export default Sidebar;
