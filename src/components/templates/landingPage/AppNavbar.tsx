import AppButton from "../../atoms/AppButton/AppButton";
import AppContainer from "../../atoms/AppContainer/AppContainer";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

const AppNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav
        className={`top-0 fixed z-50  bg-transparent w-full  flex ${
          !sidebarOpen ? "p-[15px] items-center justify-center " : "p-0 "
        } `}
      >
        <AppContainer
          className={`w-full flex sm:flex md:flex lg:hidden xl:hidden ${
            sidebarOpen ? "!hidden" : "flex"
          } `}
        >
          <Icon
            onClick={() => setSidebarOpen(!sidebarOpen)}
            icon="ph:list-bold"
            className="text-[30px] text-black p-1 bg-white rounded-sm shadow-xl"
          />
        </AppContainer>

        <AppContainer
          className={`
          ${
            sidebarOpen
              ? "flex sm:flex md:flex lg:flex xl:flex h-screen !w-[50%] sm:!w-[50%]   md:!w-[30%] lg:!w-[20%] xl:!w-[15%]"
              : " hidden sm:hidden md:hidden lg:flex xl:flex "
          } 
          
         ${
           !sidebarOpen
             ? " flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row  rounded-full   "
             : "flex flex-col relative"
         }
          gap-[100px] p-[15px] bg-white font-poppins font-bold items-center justify-center w-[80%] px-[30px] shadow-xl`}
        >
          {sidebarOpen && (
            <Icon
              onClick={() => setSidebarOpen(false)}
              icon="ph:x-bold"
              className="text-[30px] text-black p-1 bg-white rounded-sm absolute top-5 right-5 cursor-pointer"
            />
          )}
          <h3 className="font-unbounded text-blue-600">Jujurly</h3>
          <AppContainer className="flex items-center w-full justify-between gap-[30px] flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row">
            <p className="hover:text-blue-600 cursor-pointer">
              <a href="#home">Home</a>{" "}
            </p>
            <p className="hover:text-blue-600 cursor-pointer">
              <a href="#feature">Feature</a>{" "}
            </p>
            <p className="hover:text-blue-600 cursor-pointer">
              <a href="#faq">FAQ</a>{" "}
            </p>
            <p className="hover:text-blue-600 cursor-pointer">
              <a href="#contact">Contact</a>{" "}
            </p>
          </AppContainer>
          <AppButton
            text="Login"
            className="!w-fit hover:bg-blue-500 hover:shadow-lg"
            onClick={() => {
              navigate("/login");
            }}
          />
        </AppContainer>
      </nav>
    </>
  );
};
export default AppNavbar;
