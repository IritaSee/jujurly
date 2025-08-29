"use client";
import AppContainer from "../../atoms/AppContainer/AppContainer";
import { Icon } from "@iconify/react";

interface AppSideBarProps {
  className?: string;
  isSelected?: boolean;
  icon?: string;
  text?: string;
  onClick?: () => void;
}

const AppSideBar: React.FC<AppSideBarProps> = (props) => {
  return (
    <AppContainer
      onClick={props.onClick}
      className={`flex items-center gap-[10px] py-[8px]  w-full font-bold cursor-pointer ${
        props.isSelected
          ? "bg-white rounded-md text-blue-900 px-[20px]"
          : "text-white bg-transparent "
      }`}
    >
      <Icon icon={props.icon || "mdi:chevron-right"} className="text-[18px]" />
      <p>{props.text}</p>
    </AppContainer>
  );
};

export default AppSideBar;
