// App.tsx
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AppContainer from "../../atoms/AppContainer/AppContainer";

interface AppAccordionProps {
  title?: string;
  subtitle: string;
  dataAos?: string;
  dataAosDelay?: number | string;
}

const AppAccordion: React.FC<AppAccordionProps> = (props) => {
  return (
    <AppContainer
      className="w-full flex "
      dataAos={props.dataAos}
      dataAosDelay={props.dataAosDelay}
    >
      <Accordion className="!rounded-[20px] p-[10px] w-full">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <p className="font-unbounded text-[16px] font-bold ">{props.title}</p>
        </AccordionSummary>
        <AccordionDetails className="w-ffull">
          <p className="text-[14px] font-poppins ">{props.subtitle}</p>
        </AccordionDetails>
      </Accordion>
    </AppContainer>
  );
};

export default AppAccordion;
