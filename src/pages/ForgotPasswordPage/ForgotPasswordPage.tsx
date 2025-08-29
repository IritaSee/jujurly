import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AppContainer from "../../components/atoms/AppContainer/AppContainer";
import AppHeadline from "../../components/molecules/AppHeadline/AppHeadline";
import AppButton from "../../components/atoms/AppButton/AppButton";
import AppTextField from "../../components/atoms/AppTextField/AppTextField";
import AppRichTextButton from "../../components/molecules/AppRichTextButton/AppRichTextButton";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import AOS from "aos";
import type { Users } from "../../utils/types";
import { updateToastConfig } from "../../utils/helper";
import { toast } from "react-toastify";

import * as authRepository from "../../api/repository/authRepository";

const ForgotPasswordPage: React.FC = () => {
  const { handleSubmit, control } = useForm<Users>();
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("userData");
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }) 
  const handleForgotPass = async (data: Users) => {
    const toastId = toast.loading("Prosess Mengirim Email...");
    try {
      const payload = {
        email: data.email,
      };
      const res = await authRepository.forgotPass(payload);

      if (res.statusNumber === 200) {
        toast.update(
          toastId,
          updateToastConfig("Email Telah Terkirim.", "success")
        );
        navigate("/login");
      } else {
        toast.update(
          toastId,
          updateToastConfig(
            res.message || "Gagal mengirim Email. Silahkan coba lagi.",
            "error"
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.update(
        toastId,
        updateToastConfig("Gagal mengirim Email. Silahkan coba lagi", "error")
      );
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <AppContainer className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10">
      <AppContainer className="w-full max-w-[350px] sm:max-w-[500px] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1200px] min-h-auto md:h-[700px] lg:h-[750px] xl:h-[800px] bg-white rounded-xl sm:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Left side - Illustration */}
        <AppContainer className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 bg-blue-500 flex flex-col items-center justify-center p-4 sm:p-6 md:p-6 lg:p-8 xl:p-10 relative order-1 md:order-1 lg:order-1 xl:order-1">
          <AppContainer className="flex flex-col items-center justify-center h-full">
            <AppHeadline
              titleDataAos="fade-up"
              subtitleDataAos="fade-up"
              className="text-white text-center font-unbounded text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl"
              subtitleClassName="text-blue-100 font-poppins text-sm sm:text-sm md:text-sm lg:text-[15px] xl:text-[16px] text-center mt-2 sm:mt-3 md:mt-4"
              title="Lupa Password?"
              subtitle="Tidak apa-apa, kami akan membantu kamu reset password dengan mudah dan aman"
            />
            <img
              src="/images/key.png"
              alt="Forgot Password"
              className="w-full max-w-[500px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[350px] xl:max-w-[400px] h-auto mt-3 sm:mt-4 md:mt-0 lg:mt-2 xl:mt-4"
              data-aos="fade-right"
            />
          </AppContainer>
        </AppContainer>

        {/* Right side - Form */}
        <AppContainer className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 bg-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-6 lg:p-8 xl:p-10 order-2 md:order-2 lg:order-2 xl:order-2">
          <AppContainer className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[350px] lg:max-w-[380px] xl:max-w-[400px] flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6">
            
            <AppHeadline
              titleDataAos="fade-left"
              subtitleDataAos="fade-left"
              className="text-blue-500 text-center font-unbounded text-base sm:text-lg md:text-lg lg:text-xl xl:text-2xl"
              subtitleClassName="text-gray-600 font-poppins text-xs sm:text-sm md:text-sm lg:text-[14px] xl:text-[14px] text-center"
              title="Reset Password"
              subtitle="Masukkan email kamu dan kami akan kirimkan link reset password"
            />

            <AppContainer
              dataAos="fade-left"
              dataAosDelay={200}
              className="flex flex-col w-full gap-1 sm:gap-2"
            >
              <label className="text-black text-xs sm:text-sm md:text-sm lg:text-[14px] xl:text-[14px] font-poppins">
                Email
              </label>
              <AppTextField
                control={control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/,
                    message: "Invalid email format",
                  },
                }}
                placeholder="contoh@email.com"
                className="text-black border border-gray-300 rounded-md sm:rounded-lg px-2 py-2 sm:px-3 sm:py-2 md:px-3 md:py-2 lg:px-4 lg:py-3 xl:px-4 xl:py-3 focus:border-blue-400 focus:outline-none text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"
              />
            </AppContainer>

            <AppButton
              dataAos="fade-left"
              dataAosDelay={300}
              className="bg-blue-400 hover:bg-blue-500 font-poppins py-2 sm:py-3 md:py-3 lg:py-4 xl:py-4 rounded-md sm:rounded-lg text-white font-medium transition-colors duration-200 text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"
              text="Kirim Link Reset"
              type="submit"
              onClick={handleSubmit(handleForgotPass)}
            />

            <AppRichTextButton
              dataAos="fade-left"
              dataAosDelay={400}
              className="text-gray-600 text-xs sm:text-sm md:text-sm lg:text-[14px] xl:text-[14px] font-poppins"
              title="Sudah ingat passwordnya?"
              subtitle="Login"
              onClick={() => {
                navigate("/login");
              }}
            />
          </AppContainer>
        </AppContainer>

        {/* Back button */}
        <Icon
          data-aos="fade-right"
          data-aos-delay={600}
          icon={"mdi:arrow-left"}
          className="text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full text-[40px] p-[8px] absolute z-20 top-[20px] left-[20px] cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => navigate("/login")}
        />
      </AppContainer>
    </AppContainer>
  );
};

export default ForgotPasswordPage;