import AppContainer from "../../atoms/AppContainer/AppContainer";
import AppHeadline from "../AppHeadline/AppHeadline";

interface AppProfileCardProps {
  onClick?: () => void;
  title?: string;
  subtitle?: string;
}

const AppProfileCard: React.FC<AppProfileCardProps> = (props) => {
  return (
    <AppContainer
      onClick={props.onClick}
      className=" max-w-[10%] w-fit sm:w-max md:w-max lg:w-max   xl:w-[10%] rounded-full flex items-center justify-end gap-[10px] py-[8px] px-[5px] "
    >
      <AppHeadline
        title={props.title || "John Doe"}
        subtitle={props.subtitle || "johndoe@gmail.com"}
        className="text-black text-right hidden sm:hidden md:hidden lg:flex xl:flex items-end min-w-fit"
        titleClassName="text-[14px] font-bold !font-unbounded"
        subtitleClassName="text-[10px] font-normal !font-poppins text-gray-500 !mt-[-2px] !mb-[-2px] min-w-fit"
      />
      <img
        alt="profile"
        src="https://picsum.photos/seed/picsum/200/300"
        className="rounded-full w-[40px] h-[40px] flex-shrink-0 "
      />
    </AppContainer>
  );
};

export default AppProfileCard;
