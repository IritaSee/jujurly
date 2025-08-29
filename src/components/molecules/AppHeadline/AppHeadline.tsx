import AppContainer from "../../atoms/AppContainer/AppContainer";

interface AppHeadlineProps {
  title: string;
  subtitle: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  titleDataAos?: string;
  subtitleDataAos?: string;
}

const AppHeadline: React.FC<AppHeadlineProps> = (props) => {
  return (
    <AppContainer
      className={`flex flex-col items-center justify-center gap-[0px] text-black ${props.className}`}
    >
      <h1
        data-aos={props.titleDataAos}
        className={props.titleClassName ?? `text-[24px] font-bold  `}
      >
        {props.title}
      </h1>
      <p
        data-aos={props.subtitleDataAos}
        className={props.subtitleClassName ?? "text-[16px] "}
      >
        {props.subtitle}
      </p>
    </AppContainer>
  );
};

export default AppHeadline;
