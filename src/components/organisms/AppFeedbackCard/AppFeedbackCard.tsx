import AppContainer from "../../atoms/AppContainer/AppContainer";
import AppChipSentiment from "../../molecules/AppChipSentiment/AppChipSentiment";
import { convertDateString } from "../../../utils/helper";
import { useState, useRef } from "react";

interface AppFeedbackCard {
  sender?: string;
  sentiment?: string;
  context?: string;
  summary?: string;
  constructiveCriticism?: string;
  timestamp?: string;
  checkMode?: boolean;
  checked?: boolean;
  onClick?: () => void;
  onChecked?: (value: boolean) => void;
  onClickCard?: () => void;
}

const AppFeedbackCard: React.FC<AppFeedbackCard> = (props) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const isCheckedRef = useRef<boolean>(props.checked);

  const handleClick = () => {
    if (props.checkMode) {
      isCheckedRef.current = !isCheckedRef.current;
      props.onChecked?.(isCheckedRef.current);
    } else {
      props.onClickCard?.();
    }
  };

  return (
    <AppContainer
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleClick}
      className={`flex flex-col items-start justify-start cursor-pointer pt-[5px] pb-[15px] px-[10px] font-poppins border-b-1 ${
        props.checkMode && props.checked
          ? "bg-blue-100 border-blue-200 rounded-lg "
          : isHover
          ? "bg-white border-white rounded-lg shadow-xl"
          : " border-gray-300 "
      }`}
    >
      <AppContainer className="flex items-center gap-[10px] justify-between w-full">
        <AppContainer className="flex items-center gap-[10px] justify-between w-full ">
          <AppContainer className="flex items-center gap-[10px]">
            <p className="text-[16px] font-bold font-monserrat">
              {props.sender || "Anonim"}
            </p>

            <AppChipSentiment
              type={props.sentiment || ""}
            />
          </AppContainer>
          <p className="text-[12px] text-gray-400 min-w-fit">
            {convertDateString(props.timestamp as string)}
          </p>
        </AppContainer>
      </AppContainer>

      <AppContainer className="flex flex-col gap-[6px] font-poppins">
        <h3 className="text-[13px] font-bold font-monserrat">
          {props.context || "-"}
        </h3>

        <AppContainer className="">
          <p className="text-[12px] line-clamp-1">Ringkasan: {props.summary}</p>

          <p className="text-[12px] line-clamp-1">
            Saran Konstruktif: {props.constructiveCriticism}
          </p>
        </AppContainer>
      </AppContainer>
    </AppContainer>
  );
};

export default AppFeedbackCard;
