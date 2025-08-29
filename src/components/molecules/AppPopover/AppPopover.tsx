import { OverlayTrigger, Popover, Fade } from "react-bootstrap";
import { Icon } from "@iconify/react";

interface AppPopoverProps {
  icon?: string;
  className?: string;
  children: React.ReactNode;
}

const AppPopover: React.FC<AppPopoverProps> = (props) => {
  const popover = (
    <Popover id="popover-basic">
      <Popover.Body className="relative">
        <div className="bg-white rounded-xl flex gap-[10px] p-[10px] items-center shadow-xl relative">
          {props.children}
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      overlay={popover}
      rootClose
      transition={Fade}
      popperConfig={{
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [-10, 10],
            },
          },
        ],
      }}
    >
      <Icon
        icon={props.icon || "mdi:dots-horizontal"}
        className={props.className || "text-blue-700 cursor-pointer"}
        fontSize={24}
      />
    </OverlayTrigger>
  );
};

export default AppPopover;
