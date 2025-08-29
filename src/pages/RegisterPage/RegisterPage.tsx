// src/pages/RegisterPage.tsx
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
// import { useDispatch } from "react-redux";
// import { setToken } from "../../redux/slices/authSlices";
import * as authRepository from "../../api/repository/authRepository";

const RegisterPage: React.FC = () => {
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

  const navigate = useNavigate();

  // const dispatch = useDispatch();
  const { handleSubmit, control, getValues } = useForm<Users>();

  const handleRegister = async (data: Users) => {
    const toastId = toast.loading("Proses Pendaftaran...");

    try {
      const dataRegis = {
        username: data.username,
        email: data.email,
        password: data.password,
      };

      const res = await authRepository.register(dataRegis as Users);
      if (res.statusNumber === 201) {
        toast.update(
          toastId,
          updateToastConfig("Pendaftaran berhasil, Mulai masuk...", "success")
        );

        const loginData = await authRepository.login({
          identifier: data.email || data.username || "",
          password: data.password,
        });

        if (loginData.statusNumber === 200) {
          navigate("/dashboard");
        } else {
          toast.error(
            loginData.message || "Pendaftaran gagal! Silahkan coba lagi"
          );
        }
      } else {
        toast.update(
          toastId,
          updateToastConfig("Pendaftaran gagal! Silahkan coba lagi", "error")
        );
      }
    } catch (error) {
      console.log(error);
      toast.update(
        toastId,
        updateToastConfig(
          "Terjadi kesalahan saat menghubungi server. Coba lagi nanti.",
          "error"
        )
      );
    }
  };

  return (
    <AppContainer className="w-full min-h-screen flex items-center justify-center bg-gradient-to-t from-blue-400 via-blue-300 to-blue-100 p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10">
      <AppContainer className="w-full max-w-[350px] sm:max-w-[500px] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1200px] min-h-[600px] sm:min-h-[700px] md:h-[750px] lg:h-[800px] xl:h-[850px] bg-white rounded-xl sm:rounded-2xl shadow-2xl flex flex-col md:flex-row lg:flex-row xl:flex-row overflow-hidden">
        <AppContainer
          className="
        w-full md:w-1/2 
        bg-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-6 lg:p-8 xl:p-10 
        order-2 md:order-1
        "
        >
          <AppContainer className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[350px] lg:max-w-[380px] xl:max-w-[400px] flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6">
            <AppHeadline
              titleDataAos="fade-right"
              subtitleDataAos="fade-right"
              className="text-blue-500 text-center font-unbounded text-base sm:text-lg md:text-lg lg:text-xl xl:text-2xl"
              subtitleClassName="text-gray-600 font-poppins text-xs sm:text-sm md:text-sm lg:text-[14px] xl:text-[14px] text-center"
              title="Buat Akun Baru"
              subtitle="Daftarkan dirimu sekarang di Jujurly"
            />

            <AppContainer
              className="flex flex-col w-full gap-1 sm:gap-2"
              dataAos="fade-right"
              dataAosDelay={200}
            >
              <label className="text-gray-600 text-xs sm:text-sm md:text-sm lg:text-[14px] xl:text-[14px] font-poppins">
                Username
              </label>
              <AppTextField
                control={control}
                name="username"
                rules={{ required: "Username is required" }}
                placeholder="Username"
                className="border border-gray-300 rounded-md sm:rounded-lg px-2 py-2 sm:px-3 sm:py-2 md:px-3 md:py-2 lg:px-4 lg:py-3 xl:px-4 xl:py-3 focus:border-blue-400 focus:outline-none text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"
              />
            </AppContainer>

            <AppContainer
              className="flex flex-col w-full gap-1 sm:gap-2"
              dataAos="fade-right"
              dataAosDelay={300}
            >
              <label className="text-gray-600 text-xs sm:text-sm md:text-sm lg:text-[14px] xl:text-[14px] font-poppins">
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
                placeholder="Email"
                className="border border-gray-300 rounded-md sm:rounded-lg px-2 py-2 sm:px-3 sm:py-2 md:px-3 md:py-2 lg:px-4 lg:py-3 xl:px-4 xl:py-3 focus:border-blue-400 focus:outline-none text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"
              />
            </AppContainer>

            <AppContainer
              className="flex flex-col w-full gap-1 sm:gap-2"
              dataAos="fade-right"
              dataAosDelay={400}
            >
              <label className="text-gray-600 text-xs sm:text-sm md:text-sm lg:text-[14px] xl:text-[14px] font-poppins">
                Password
              </label>
              <AppTextField
                control={control}
                name="password"
                rules={{
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 karakter" },
                }}
                placeholder="Password"
                type="password"
                className="border border-gray-300 rounded-md sm:rounded-lg px-2 py-2 sm:px-3 sm:py-2 md:px-3 md:py-2 lg:px-4 lg:py-3 xl:px-4 xl:py-3 focus:border-blue-400 focus:outline-none text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"
              />
            </AppContainer>

            <AppContainer
              className="flex flex-col w-full gap-1 sm:gap-2"
              dataAos="fade-right"
              dataAosDelay={500}
            >
              <label className="text-gray-600 text-xs sm:text-sm md:text-sm lg:text-[14px] xl:text-[14px] font-poppins">
                Konfirmasi Password
              </label>
              <AppTextField
                control={control}
                name="confirmPassword"
                rules={{
                  required: "Password confirmation is required",
                  validate: (value: string) =>
                    value === getValues("password") || "Password tidak cocok",
                }}
                placeholder="Confirm Password"
                type="password"
                className="border border-gray-300 rounded-md sm:rounded-lg px-2 py-2 sm:px-3 sm:py-2 md:px-3 md:py-2 lg:px-4 lg:py-3 xl:px-4 xl:py-3 focus:border-blue-400 focus:outline-none text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"
              />
            </AppContainer>

            <AppButton
              dataAos="fade-right"
              dataAosDelay={600}
              className="bg-blue-400 hover:bg-blue-500 font-poppins py-2 sm:py-3 md:py-3 lg:py-4 xl:py-4 rounded-md sm:rounded-lg text-white font-medium transition-colors duration-200 text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"
              text="Daftar"
              type="submit"
              onClick={handleSubmit(handleRegister)}
            />

            <AppRichTextButton
              // dataAos="fade-right"
              // dataAosDelay={700}
              title="Sudah punya akun?"
              subtitle="Login"
              onClick={() => navigate("/login")}
            />
          </AppContainer>
        </AppContainer>

        <AppContainer
          className="
            w-full md:w-1/2 
            bg-blue-500 flex flex-col items-center justify-center p-4 sm:p-6 md:p-6 lg:p-8 xl:p-10 
            relative order-1 md:order-1
            "
        >
          <AppContainer className="flex flex-col items-center justify-center h-full">
            <AppHeadline
              titleDataAos="fade-left"
              subtitleDataAos="fade-left"
              className="text-white text-center font-unbounded text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl"
              subtitleClassName="text-blue-100 font-poppins text-xs sm:text-sm md:text-sm lg:text-[15px] xl:text-[16px] text-center mt-2 sm:mt-3 md:mt-4"
              title="Yuk, Gabung Bareng Jujurly!"
              subtitle="Setiap feedback kecil bisa jadi langkah besar. Daftar dan mulai berbagi suaramu hari ini"
            />
            <img
              src="/images/team.svg"
              alt="Illustration"
              className="w-full max-w-[200px] sm:max-w-[280px] md:max-w-[350px] lg:max-w-[450px] xl:max-w-[500px] h-auto mt-3 sm:mt-4 md:mt-0 lg:mt-2 xl:mt-4"
              data-aos="fade-left"
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

export default RegisterPage;
