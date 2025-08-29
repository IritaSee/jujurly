interface AppChipSentimentProps {
  type: string;
  className?: string;
}

const AppChipSentiment: React.FC<AppChipSentimentProps> = ({ type, className }) => {  const getColor = (sentiment: string) => {
    if (sentiment.toLowerCase().includes("netral")) {
      return "bg-blue-500 text-white";
    }
    if (sentiment.toLowerCase().includes("positif")) {
      return "bg-green-500 text-white";
    }
    if (sentiment.toLowerCase().includes("negatif")) {
      return "bg-red-500 text-white";
    }
    return "bg-gray-200 text-gray-700";
  };

  return (
    <p
      className={`${className ?? ""} ${getColor(type)} text-[10px] font-bold py-[3px] px-[8px] rounded-xl`}
    >
      {type}
    </p>
  );
};

export default AppChipSentiment;
