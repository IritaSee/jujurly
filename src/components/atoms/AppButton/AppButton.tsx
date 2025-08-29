"use client";

interface AppButton {
  text: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  dataAos?: string;
  dataAosDelay?: string | number;
}

const AppButton: React.FC<AppButton> = (props) => {
  return (
    <button
      data-aos={props.dataAos}
      data-aos-delay={props.dataAosDelay}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      className={`px-[30px] py-3 w-full text-[14px] font-extrabold rounded-full cursor-pointer bg-black text-white ${props.className}`}
    >
      {props.text}
    </button>
  );
};

export default AppButton;
