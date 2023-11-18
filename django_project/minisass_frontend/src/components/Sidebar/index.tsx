import React from "react";
import DataInputForm from "../../components/DataInputForm";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div
      className={`absolute ${
        isOpen ? "left-0" : "-left-full"
      } bg-white-A700 flex flex-col gap-2 items-start justify-center px-[18px] py-5 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] top-[1%] sm:top-[25px] w-auto transition-all duration-300`}
    >
      <DataInputForm className="bg-white-A700 flex flex-col gap-6 items-start justify-start pb-3 px-3 rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] shadow-bs w-full" />
     
    </div>
  );
};

export default Sidebar;
