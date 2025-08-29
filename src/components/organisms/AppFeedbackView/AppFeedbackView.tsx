import { convertDateString } from "../../../utils/helper";
import AppContainer from "../../atoms/AppContainer/AppContainer";
import AppChipSentiment from "../../molecules/AppChipSentiment/AppChipSentiment";
import { Icon } from "@iconify/react";

interface AppFeedbackViewProps {
  id: number;
  sender?: string;
  sentiment?: string;
  context?: string;
  summary?: string;
  constructiveCriticism?: string;
  timestamp?: string;
  onClose?: () => void;
}

const AppFeedbackView: React.FC<AppFeedbackViewProps> = (props) => {
  return (
    <AppContainer className="w-full h-full flex flex-col bg-white items-start justify-start p-[20px] gap-[20px] font-poppins overflow-y-auto rounded-2xl ">
      <AppContainer className="w-full flex items-center justify-between">
        <h3 className="font-unbounded font-bold">Feedback #{props.id}</h3>
        <Icon
          icon="mdi:close"
          className="text-gray-400 text-[24px] cursor-pointer block sm:block md:hidden lg:hidden xl:hidden"
          onClick={props.onClose}
        />
      </AppContainer>
      <AppContainer className="flex items-center gap-[10px] justify-between w-full border-b-1 pb-[10px] border-gray-200">
        <AppContainer className="flex items-center gap-[10px]">
          <AppContainer className="w-[50px] h-[50px] bg-[url('https://picsum.photos/200/300')] rounded-full  flex-shrink-0"></AppContainer>
          <AppContainer className="flex items-center ">
            <AppContainer className="flex flex-col gap-[5px]">
              <p className="font-unbounded font-bold text-[20px] leading-none ">
                {props.sender || "Anonim"}
              </p>
              <p className="text-gray-400 text-[14px] font-unbounded">
                {convertDateString(props.timestamp as string)}
              </p>
            </AppContainer>
          </AppContainer>
        </AppContainer>
        <AppChipSentiment
          className="!px-[20px] !py-[6px] !rounded-full !text-[14px]"
          type={props.sentiment as "positif" | "negatif" | "netral"}
        />
      </AppContainer>

      <AppContainer className="w-full flex items-center justify-between pb-[10px]  ">
        <p className="font-monserrat font-bold text-[24px] ">{props.context}</p>

        <AppContainer className="flex items-center gap-[10px]">
          <Icon
            icon="mdi:star-outline"
            className="text-gray-300 text-[24px] cursor-pointer"
          />
          <Icon
            icon="mdi:trash-can-outline"
            className="text-gray-300 text-[24px] cursor-pointer"
          />
        </AppContainer>
      </AppContainer>

      <AppContainer className="w-full font-monserrat text-[14px] flex flex-col gap-[10px]">
        <p>{props.summary}</p>
        <AppContainer className="flex flex-col bg-blue-100 p-[20px] w-full rounded-lg font-poppins relative">
          <p className=" font-600">{props.constructiveCriticism}</p>
          <p className="font-bold self-end bg-blue-500 p-[10px] text-[12px] rounded-lg text-white">
            Saran Konstruktif
          </p>
        </AppContainer>
      </AppContainer>
    </AppContainer>
  );
};

export default AppFeedbackView;
