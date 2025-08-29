import AppContainer from "../../atoms/AppContainer/AppContainer";

interface AppAnonimCardProps {
  text?: string;
  username?: string;
  dataAos?: string;
  dataAosDelay?: string | number;
}

const AppAnonimCard: React.FC<AppAnonimCardProps> = (props) => {
  return (
    <AppContainer
      dataAos={props.dataAos}
      dataAosDelay={props.dataAosDelay}
      className="bg-white rounded-xl flex flex-col gap-[20px] items-start justify-start p-[20px] w-full h-fit"
    >
      <p className="font-poppins text-gray-500 text-[14px] line-clamp-3 ">
        {props.text}
      </p>
      <AppContainer className="flex items-center gap-[10px]">
        <AppContainer className="w-[40px] h-[40px] rounded-full bg-[url('https://picsum.photos/200/300')] bg-cover bg-red-500" />
        <p className="font-unbounded text-[16px] font-bold line-clamp-1">
          {props.username || "Anonim"}
        </p>
      </AppContainer>
    </AppContainer>
  );
};

export default AppAnonimCard;
