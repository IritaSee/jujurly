"use client";
import AppContainer from "../../atoms/AppContainer/AppContainer";

interface AppRichTextButton {
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
  dataAos?: string;
  dataAosDelay?: string | number;
}

const AppRichTextButton: React.FC<AppRichTextButton> = (props) => {
  return (
    <AppContainer
      dataAos={props.dataAos}
      dataAosDelay={props.dataAosDelay}
      className="w-max flex items-center gap-[5px] font-poppins"
    >
      <p className="text-[14px]">{props.title}</p>
      <p
        onClick={props.onClick}
        className="text-blue-800 text-[14px] cursor-pointer"
      >
        {props.subtitle}
      </p>
    </AppContainer>
  );
};

export default AppRichTextButton;
