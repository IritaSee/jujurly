"use client";

interface AppContainerProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;

  style?: React.CSSProperties;
  dataAos?: string;
  dataAosDelay?: string | number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const AppContainer: React.FC<AppContainerProps> = (props) => {
  return (
    <div
      id={props.id}
      data-aos={props.dataAos}
      data-aos-delay={props.dataAosDelay}
      style={props.style}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onClick={props.onClick}
      className={props.className ?? `flex flex-col`}
    >
      {props.children}
    </div>
  );
};

export default AppContainer;
