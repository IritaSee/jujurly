"use client";
import { Modal } from "@mui/material";
import { Icon } from "@iconify/react";
import AppContainer from "../AppContainer/AppContainer";

interface AppModalProps {
    open: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

const AppModal: React.FC<AppModalProps> = (props) => {
    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            className="flex items-center justify-center"
        >
            <AppContainer className=" xl:w-[30%] lg:w-[40%] md:w-[50%] sm:w-[60%] w-[90%] h-max rounded-[15px] bg-white flex flex-col justify-start items-start gap-[20px] relative">
                <AppContainer className="w-full flex justify-end items-center absolute  pt-[10px] pr-[10px]">
                    <Icon
                        icon="mdi:close"
                        className="text-gray-400 cursor-pointer text-[24px] "
                        onClick={props.onClose}
                    />
                </AppContainer>
                <AppContainer className="w-full  flex flex-col justify-center items-center p-[15px] gap-[20px]">
                    {props.children}
                </AppContainer>
            </AppContainer>
        </Modal>
    );
};

export default AppModal;
