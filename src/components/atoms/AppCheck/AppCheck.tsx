"use client";
import React from "react";

interface AppCheckProps {
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const AppCheck: React.FC<AppCheckProps> = (props) => {
  return (
    <input
      type="checkbox"
      onChange={props.onChange}
      checked={props.checked}
      className="appearance-none w-[18px] h-[18px] rounded-md bg-gray-300 checked:bg-blue-500 transition-colors"
    />
  );
};

export default AppCheck;
