import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContainer from "../../components/atoms/AppContainer/AppContainer";
import AppButton from "../../components/atoms/AppButton/AppButton";
import AppTextField from "../../components/atoms/AppTextField/AppTextField";
import AppHeadline from "../../components/molecules/AppHeadline/AppHeadline";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import AOS from "aos";
import type { UserFeedback } from "../../utils/types";
import { updateToastConfig } from "../../utils/helper";
import { toast } from "react-toastify";
import * as userRepository from "../../api/repository/userRepository";

const UserLookupPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  const { handleSubmit, control } = useForm<UserFeedback>();

    const handleUserLookup = async (data: UserFeedback) => {
    const toastId = toast.loading("Mencari Pengguna..");
    setIsLoading(true);
    try {
      const res = await userRepository.userLookup(data.targetUser as string);
      if (res.statusNumber === 200) {
        setUserData(res.data);
        toast.update(
          toastId,
          updateToastConfig("Pengguna ditemukan", "success")
        );
        navigate(`/beri-feedback/${data.targetUser}`);
      } else {
        toast.update(
          toastId,
          updateToastConfig(
            "Gagal mendapatkan link feedback untuk pengguna ini",
            "error"
          )
        );
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      if (error?.status === 404) {
        toast.update(
          toastId,
          updateToastConfig("User yang kamu cari gak ada", "error")
        );
      } else {
        toast.update(
          toastId,
          updateToastConfig(
            "Terjadi kesalahan saat menghubungi server. Coba lagi nanti.",
            "error"
          )
        );
      }
    }
  };

  return (
    <AppContainer className="w-full h-screen relative bg-blue-400">
      <AppContainer className="w-full h-full flex items-center justify-center pt-auto">
        <AppContainer 
          dataAos="fade-up"
          className="bg-white rounded-[24px] shadow-xl w-[95%] max-w-[850px] p-6 sm:p-8 mx-auto"
        >
          <AppContainer 
            dataAosDelay={100}
            className="flex justify-center"
          >
            <img src="/images/hand.png" alt="logo" className="w-[100px]" />
          </AppContainer>

          <AppHeadline
            titleDataAos="fade-down"
            subtitleDataAos="fade-down"
            className="text-black font-unbounded text-center mb-[20px]"
            subtitleClassName="text-gray-600 font-poppins text-[16px] text-center"
            title="Mau Kasih Feedback ke Siapa Nih?"
            titleClassName="text-[24px] text-black font-bold mb-[10px]"
            subtitle="Tulis username atau ID unik orang yang mau kamu kasih feedback."
          />

          <AppContainer
            dataAos="fade-down"
            dataAosDelay={300}
            className="flex flex-col w-full h-max gap-[12px] mb-[24px]"
          >
            <label className="text-gray-700 text-[14px] font-poppins font-medium">
              Username atau ID Pengguna
            </label>
            <AppTextField
              control={control}
              name="targetUser"
              rules={{
                required: "Username atau ID pengguna jangan lupa diisi ya.",
                pattern: {
                  value: /^\S+$/,
                  message: "format nama salah",
                },
              }}
              placeholder="cth: iganarendra atau user123abc"
              className="!text-black !border-gray-300 !rounded-xl !py-[14px] !px-[18px] !text-[16px] focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100"
            />
          </AppContainer>

          <AppButton
            dataAos="zoom-in"
            dataAosDelay={400}
            className="bg-blue-500 hover:bg-blue-600 font-poppins py-[16px] rounded-xl font-medium w-full text-[16px] mb-[20px] flex items-center justify-center gap-[8px]"
            text={"Lanjut Kasih Feedback"}
            type="submit"
            onClick={handleSubmit(handleUserLookup)}
            disabled={isLoading}
          />

          <p
            data-aos="fade-up"
            data-aos-delay={500}
            className="font-poppins text-[14px] text-gray-600 text-center leading-relaxed"
          >
            Pastikan kamu tau username atau ID yang bener ya, biar feedbacknya
            nyampe ke orang yang tepat.
          </p>
        </AppContainer>
      </AppContainer>

      <Icon
        data-aos="fade-right"
        data-aos-delay={600}
        icon={"mdi:arrow-back"}
        className="text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full text-[40px] p-[8px] absolute z-20 top-[20px] left-[20px] cursor-pointer hover:shadow-lg transition-all duration-200"
        onClick={() => navigate("/")}
      />
    </AppContainer>
  );
};

export default UserLookupPage;