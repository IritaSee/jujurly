// src/pages/LoginPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AppContainer from "../../components/atoms/AppContainer/AppContainer";
import AppHeadline from "../../components/molecules/AppHeadline/AppHeadline";
import AppButton from "../../components/atoms/AppButton/AppButton";
import AppTextField from "../../components/atoms/AppTextField/AppTextField";
import AppRichTextButton from "../../components/molecules/AppRichTextButton/AppRichTextButton";
import type { Login } from "../../utils/types";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import AOS from "aos";
import { updateToastConfig } from "../../utils/helper";
import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";
import * as authRepository from "../../api/repository/authRepository";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { handleSubmit, control } = useForm();

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  const isAuthenticated = !!localStorage.getItem("userData");
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  });

  const handleLogin = async (data: Login) => {
    const toastId = toast.loading("Logging in...");
    try {
      const res = await authRepository.login(data);
      if (res.statusNumber === 200) {
        localStorage.setItem("userData", JSON.stringify(res));
        toast.update(toastId, updateToastConfig("Login berhasil", "success"));
        navigate("/dashboard");
      } else {
        toast.update(
          toastId,
          updateToastConfig(
            res.message || "Login gagal! tolong check kembali data anda.",
            "error"
          )
        );
      }
    } catch (_error) {
      console.error(_error);
      toast.update(
        toastId,
        updateToastConfig("Login gagal! coba lagi nanti", "error")
      );
    }
  };

  const onSubmit = (data: object) => {
    handleLogin(data as Login);
  };

  return (
    <AppContainer className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10">
      <AppContainer className="w-full max-w-[350px] sm:max-w-[500px] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1200px] min-h-auto md:h-[700px] lg:h-[750px] xl:h-[800px] bg-white rounded-xl sm:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        <AppContainer className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 bg-blue-500 flex flex-col items-center justify-center p-4 sm:p-6 md:p-6 lg:p-8 xl:p-10 relative order-1 md:order-1 lg:order-1 xl:order-1">
          <AppContainer className="flex flex-col items-center justify-center h-full">
            <AppHeadline
              titleDataAos="fade-up"
              subtitleDataAos="fade-up"
              className="text-white text-center font-unbounded text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl"
              subtitleClassName="text-blue-100 font-poppins text-xm sm:text-sm md:text-sm lg:text-[15px] xl:text-[16px] text-center mt-2 sm:mt-3 md:mt-4"
              title="Dari feedback kecil, lahir perubahan besar"
              subtitle="Yuk, jadi bagian dari perjalanan membangun sesuatu yang lebih baik bareng Jujurly!"
            />
            <img
              src="/images/team.svg"
              alt="Team Performance"
              className="w-full max-w-[500px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[350px] xl:max-w-[400px] h-auto mt-3 sm:mt-4 md:mt-0 lg:mt-2 xl:mt-4"
              data-aos="fade-right"
            />
          </AppContainer>
        </AppContainer>

        <AppContainer className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 bg-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-6 lg:p-8 xl:p-10 order-2 md:order-2 lg:order-2 xl:order-2">
          <AppContainer className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[350px] lg:max-w-[380px] xl:max-w-[400px] flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6">
            <AppHeadline
              titleDataAos="fade-left"
              subtitleDataAos="fade-left"
              className="text-blue-500 text-center font-unbounded text-base sm:text-lg md:text-lg lg:text-xl xl:text-2xl"
              subtitleClassName="text-gray-600 font-poppins text-xs sm:text-sm md:text-sm lg:text-[14px] xl:text-[14px] text-center"
              title="Selamat datang di Jujurly"
              subtitle="Senang melihatmu. Yuk, bagikan feedback jujurmu"
            />

            <AppContainer
              dataAos="fade-left"
              dataAosDelay={200}
              className="flex flex-col w-full gap-1 sm:gap-2"
            >
              <label className="text-black text-xs sm:text-sm md:text-sm lg:text-[14px] xl:text-[14px] font-poppins">
                Email atau Username
              </label>
              <AppTextField
                control={control}
                name="identifier"
                rules={{
                  required: "Identifier is required",
                }}
                placeholder="Farhanpaozan@gmail.com"
                className="text-black border border-gray-300 rounded-md sm:rounded-lg px-2 py-2 sm:px-3 sm:py-2 md:px-3 md:py-2 lg:px-4 lg:py-3 xl:px-4 xl:py-3 focus:border-blue-400 focus:outline-none text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"
              />
            </AppContainer>

            <AppContainer
              dataAos="fade-left"
              dataAosDelay={300}
              className="flex flex-col w-full gap-1 sm:gap-2"
            >
              <label className="text-gray-600 text-xs sm:text-sm md:text-sm lg:text-[14px] xl:text-[14px] font-poppins">
                Password
              </label>
              <AppTextField
                control={control}
                name="password"
                rules={{
                  required: "Password is required",
                }}
                placeholder="Password kamu"
                type="password"
                className="border border-gray-300 rounded-md sm:rounded-lg px-2 py-2 sm:px-3 sm:py-2 md:px-3 md:py-2 lg:px-4 lg:py-3 xl:px-4 xl:py-3 focus:border-blue-400 focus:outline-none text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"
              />
            </AppContainer>

            <p
              data-aos="fade-left"
              data-aos-delay={400}
              className="text-blue-400 text-xs sm:text-sm md:text-sm lg:text-[14px] xl:text-[14px] self-end cursor-pointer font-poppins hover:text-blue-500 transition-colors"
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              Forgot password?
            </p>

            <AppButton
              dataAos="fade-left"
              dataAosDelay={500}
              className="bg-blue-400 hover:bg-blue-500 font-poppins py-2 sm:py-3 md:py-3 lg:py-4 xl:py-4 rounded-md sm:rounded-lg text-white font-medium transition-colors duration-200 text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"
              text="Login"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            />

            <AppRichTextButton
              dataAos="fade-left"
              dataAosDelay={600}
              className="text-gray-600 text-xs sm:text-sm md:text-sm lg:text-[14px] xl:text-[14px] font-poppins"
              title="Don't have an account?"
              subtitle="Register"
              onClick={() => {
                navigate("/register");
              }}
            />
          </AppContainer>
        </AppContainer>
        <Icon
          data-aos="fade-right"
          data-aos-delay={600}
          icon={"mdi:home"}
          className="text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full text-[40px] p-[8px] absolute z-20 top-[20px] left-[20px] cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => navigate("/")}
        />
      </AppContainer>
    </AppContainer>
  );
};

export default LoginPage;
