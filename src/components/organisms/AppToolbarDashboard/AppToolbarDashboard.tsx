import AppContainer from "../../atoms/AppContainer/AppContainer";
import { Icon } from "@iconify/react";
import AppTextField from "../../atoms/AppTextField/AppTextField";
import AppButton from "../../atoms/AppButton/AppButton";
import AppProfileCard from "../../molecules/AppProfileCard/AppProfileCard";
import type { Control } from "react-hook-form";
import AppPopover from "../../molecules/AppPopover/AppPopover";
interface AppToolDashboardProps {
  control: Control;
  username: string;
  email: string;
  onAddFeedbackClick: () => void;
  onClickSidebar: () => void;
  dataAos?: string;
  dataAosDelay?: string;
}

const AppToolbarDashboard: React.FC<AppToolDashboardProps> = (props) => {
  return (
    <AppContainer
      dataAos={props.dataAos}
      dataAosDelay={props.dataAosDelay}
      className="w-full flex items-center justify-between h-max border-b-1 border-gray-200 p-[10px]"
    >
      <AppContainer className="flex justify-start items-center p-[10px] gap-[10px] w-full">
        <>
          <AppContainer className="items-center gap-[10px] w-[30%] relative hidden  md:flex lg:flex xl:flex ">
            <Icon
              icon="ph:list-bold"
    className="text-[32px] mr-3 text-black cursor-pointer"
              onClick={props.onClickSidebar}
            />
            <AppTextField
              control={props.control}
              name="search"
              className="bg-gray-200/20 !text-black rounded-lg p-[12px] !w-full text-[12px] relative "
              rules={{
                required: "search",
                pattern: {
                  value: /^(?!\s*$).+/,
                  message: "Input tidak boleh kosong atau hanya spasi",
                },
              }}
              placeholder="Cari Feedbackmu..."
            />
            <Icon
              icon="mingcute:search-line"
              className="text-gray-500 text-[24px] absolute  right-5"
            />
          </AppContainer>
          <AppPopover
            icon="mingcute:search-line"
            className="text-blue-400 text-[44px] p-2 bg-blue-100 rounded-lg cursor-pointer block sm:blcok md:block lg:hidden xl:hidden"
          >
  <AppContainer className="items-center gap-[10px] w-[30%] relative hidden sm:hidden md:flex lg:flex xl:flex">
              <AppTextField
                control={props.control}
                name="search"
                className="bg-gray-200/20 !text-black rounded-lg p-[12px] !w-full text-[12px] relative "
                rules={{
                  required: "search",
                  pattern: {
                    value: /^(?!\s*$).+/,
                    message: "Input tidak boleh kosong atau hanya spasi",
                  },
                }}
                placeholder="Cari Feedbackmu..."
              />
              <Icon
                icon="mingcute:search-line"
                className="text-gray-500 text-[24px] absolute  right-5"
              />
            </AppContainer>
          </AppPopover>
        </>
        <>
          <AppButton
            text="Tambah"
            className="!bg-blue-400 rounded-md !p-[12px] !w-fit !text-[12px] !font-monserrat hidden sm:hidden md:block lg:block xl:block"
            onClick={props.onAddFeedbackClick}
          />
          <Icon
            icon="mdi:add"
            className="text-white text-[44px] p-2 bg-blue-400 rounded-lg cursor-pointer block sm:block md:hidden lg:hidden xl:hidden"
            onClick={props.onAddFeedbackClick}
          />
        </>
      </AppContainer>
      <AppProfileCard title={props.username} subtitle={props.email} />
    </AppContainer>
  );
};

export default AppToolbarDashboard;
