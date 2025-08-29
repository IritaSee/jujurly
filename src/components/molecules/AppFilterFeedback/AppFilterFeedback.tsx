import AppContainer from "../../atoms/AppContainer/AppContainer";
import { useEffect, useState } from "react";

interface AppFilterFeedbackProps {
  filterSelected?: number;
  onFilterChange?: (value: number) => void;
}

const AppFilterFeedback: React.FC<AppFilterFeedbackProps> = (props) => {
  const [filter, setFilter] = useState<number>(0);

  const handleClick = () => {
    props.onFilterChange?.(filter as number);
  };

  useEffect(() => {
    if (props.filterSelected !== undefined) {
      setFilter(props.filterSelected);
    } else {
      setFilter(0);
    }
  }, [props.filterSelected]);

  return (
    <AppContainer className="flex items-end justify-between text-gray-400 border-b-[1px] border-gray-300">
      <p
        onMouseEnter={() => setFilter(1)}
        onMouseLeave={() => setFilter(0)}
        onClick={handleClick}
        className={`font-poppins text-[12px] font-semibold py-[10px] px-[14px] box-border border-b-[1px] cursor-pointer ${
          filter === 1 ? "text-blue-600 border-blue-600" : "border-transparent"
        }`}
      >
        For You
      </p>
      <p
        onMouseEnter={() => setFilter(2)}
        onMouseLeave={() => setFilter(0)}
        onClick={handleClick}
        className={`font-poppins text-[12px] font-semibold py-[10px] px-[14px] box-border border-b-[1px] cursor-pointer ${
          filter === 2 ? "text-blue-600 border-blue-600" : "border-transparent"
        }`}
      >
        Send
      </p>
      <p
        onMouseEnter={() => setFilter(3)}
        onMouseLeave={() => setFilter(0)}
        onClick={handleClick}
        className={`font-poppins text-[12px] font-semibold py-[10px] px-[14px] box-border border-b-[1px] cursor-pointer ${
          filter === 3 ? "text-blue-600 border-blue-600" : "border-transparent"
        }`}
      >
        Favorite
      </p>
    </AppContainer>
  );
};

export default AppFilterFeedback;
