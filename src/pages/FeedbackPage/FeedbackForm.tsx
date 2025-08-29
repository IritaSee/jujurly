// src/components/FeedbackForm.tsx
import { useState, useEffect } from "react";

import AppContainer from "../../components/atoms/AppContainer/AppContainer";
import AppButton from "../../components/atoms/AppButton/AppButton";
import type { FeedbackRequest, FeedbackFormProps } from "../../utils/types";
import AppTextField from "../../components/atoms/AppTextField/AppTextField";
import AppHeadline from "../../components//molecules/AppHeadline/AppHeadline";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import * as feedbackRepository from "../../api/repository/feedbackRepository";
import { toast } from "react-toastify";
import { updateToastConfig } from "../../utils/helper";

import AOS from "aos";

function FeedbackForm({ userId }: FeedbackFormProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const nextStep = () => setStep(step + 1);
  const backStep = (index: number) => setStep(step != 1 ? index : 1);
  const { handleSubmit, control } = useForm<FeedbackRequest>();

  const textFeedbackPrimary = [
    {
      icon: "maki:town",
      title: "Pertama kali Kenal ",
      subtitle: "Coba Ceritain kamu awal ketemu",
    },
    {
      icon: "mdi:feedback-outline",
      title: "Isi Feedback ",
      subtitle: "Berikan feedback yang jelas dan konstruktif",
    },
    {
      icon: "fluent:slide-text-title-16-filled",
      title: "Isi Konteks ",
      subtitle: "Berikan Konteks tentang feedback kamu",
    },
    {
      icon: "mdi:mail",
      title: "Email Kamu ",
      subtitle: "Masukin Email Kamu yahh!",
    },
  ];

  const handleFeedbackSending = async (data: FeedbackRequest) => {
    setLoading(true);

    const toastId = toast.loading("Mengirim Feedback...");

    try {
      const res = await feedbackRepository.feedbackSend(
        userId,
        data as FeedbackRequest
      );
      if (res.statusNumber === 201) {
        console.log(res.data);
        toast.update(
          toastId,
          updateToastConfig("Feedback berhasil terkirim", "success")
        );
        navigate("/beri-feedback");
      } else {
        toast.update(
          toastId,
          updateToastConfig("Gagal mengirim feedback!!", "error")
        );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <>
      <AppContainer className="flex w-full h-screen bg-gray-100/70 relative">
        <AppContainer className="w-[20%] hidden sm:hidden md:flex lg:flex xl:flex h-full flex items-center justify-center">
          <AppContainer className="flex flex-col w-[80%] gap-[30px] items-start">
            {textFeedbackPrimary.map((data, index) => {
              return (
                <AppContainer
                  key={index}
                  dataAos="fade-up"
                  dataAosDelay={index * 200}
                  className="flex items-center gap-[20px] cursor-pointer "
                  onClick={() => {
                    backStep(index + 1);
                  }}
                >
                  <Icon
                    icon={data.icon}
                    className={`${
                      step >= index + 1 ? "text-blue-400" : "text-gray-400"
                    } text-[32px] p-[5px] rounded-md border-1`}
                  />
                  <AppHeadline
                    className="text-black !items-start text-start font-unbounded"
                    subtitleClassName={`${
                      step >= index + 1 ? "text-blue-500" : "text-gray-400"
                    } font-poppins text-[10px] text-start`}
                    titleClassName={`text-[12px] font-bold ${
                      step >= index + 1 ? "text-blue-500" : "text-gray-500"
                    }`}
                    title={data.title}
                    subtitle={data.subtitle}
                  />
                </AppContainer>
              );
            })}
          </AppContainer>
        </AppContainer>
        <AppContainer className="w-full sm:w-full  md:w-[80%] lg:w-[80%] xl:w-[80%] h-full bg-blue-400 flex items-center justify-center">
          <AppContainer className=" flex flex-col  w-[90%] sm:w-[60%] md:w-[60%] lg:w-[60%]  xl:w-[60%] ">
            <form onSubmit={() => {}} className="flex flex-col">
              {step === 1 && (
                <AppContainer className="flex flex-col gap-6 bg-white rounded-2xl shadow-lg p-8">
                  <AppHeadline
                    titleDataAos="fade-down"
                    subtitleDataAos="fade-down"
                    className="text-black text-center font-unbounded"
                    subtitleClassName="text-black font-poppins text-[16px] text-center"
                    title="Kenal doi darimana? atau siapa nih?"
                    subtitle="Lo boleh kasih tau nama, atau stay anon, tapi kabarin elu kenal dia dimana. Biar apa? Biar AI kita bisa paham, terus dia kita kasih paham LOL"
                  />
                  <AppTextField
                    dataAos="fade-down"
                    dataAosDelay={200}
                    type="text"
                    name="anonIdentifier"
                    control={control}
                    rules={{
                      required: "Nama Pengguna Harus Diisi",
                      // pattern: {
                      //   value: /^\S+@\S+$/,
                      //   message: "format nama salah",
                      // },
                    }}
                    placeholder="cth: temen sekelas, rekan kerja proyek X"
                    className="!text-black"
                  />
                  <AppButton
                    dataAos="zoom-in"
                    dataAosDelay={300}
                    className="bg-blue-500 font-poppins py-[15px]"
                    text={"Lanjut"}
                    type="button"
                    onClick={nextStep}
                    disabled={isLoading}
                  />
                </AppContainer>
              )}

              {step === 2 && (
                <AppContainer className="flex flex-col gap-6 bg-white rounded-2xl shadow-lg p-8">
                  <AppHeadline
                    titleDataAos="fade-down"
                    subtitleDataAos="fade-down"
                    className="text-black text-center font-unbounded"
                    subtitleClassName="text-black font-poppins text-[16px] text-center"
                    title="Yang pengen lo sampein"
                    subtitle="Santai sih, doi ga bisa liat langsung, tunjukkin aja semua yang lo rasain ke dia, mengumpat bila perlu"
                  />
                  <AppTextField
                    dataAos="fade-down"
                    dataAosDelay={200}
                    type="text"
                    control={control}
                    rules={{
                      required: "Feedback Pengguna Harus Diisi",
                      // pattern: {
                      //   value: /^\S+@\S+$/,
                      //   message: "format feedback salah",
                      // },
                    }}
                    placeholder="'Gue suka cara lo presentasi' atau 'parah banget, kerjaan kacau babiii'"
                    name="feedback_text"
                    className="!text-black"
                  />
                  <AppButton
                    dataAos="zoom-in"
                    dataAosDelay={300}
                    className="bg-blue-500 font-poppins py-[15px]"
                    text={"Lanjut"}
                    type="button"
                    onClick={nextStep}
                    disabled={isLoading}
                  />
                </AppContainer>
              )}

              {step === 3 && (
                <AppContainer className="flex flex-col gap-6 bg-white rounded-2xl shadow-lg p-8">
                  <AppHeadline
                    titleDataAos="fade-down"
                    subtitleDataAos="fade-down"
                    className="text-black text-center font-unbounded"
                    subtitleClassName="text-black font-poppins text-[16px] text-center"
                    title="Konteks feedbacknya apa nih?"
                    subtitle="Opsional, karena kita pake AI, biar makin kena nih ke doi"
                  />
                  <AppTextField
                    dataAos="fade-down"
                    dataAosDelay={200}
                    type="text"
                    control={control}
                    rules={{
                      required: "Konteks Feedback Harus Diisi",
                      // pattern: {
                      //   value: /^\S+@\S+$/,
                      //   message: "format nama salah",
                      // },
                    }}
                    placeholder="cth: pas proyek X, abis presentasi"
                    name="context_text"
                    className="!text-black"
                  />
                  <AppButton
                    dataAos="zoom-in"
                    dataAosDelay={300}
                    className="bg-blue-500 font-poppins py-[15px]"
                    text={"Lanjut"}
                    type="button"
                    onClick={nextStep}
                    disabled={isLoading}
                  />
                </AppContainer>
              )}

              {step === 4 && (
                <AppContainer className="flex flex-col gap-6 bg-white rounded-2xl shadow-lg p-8">
                  <AppHeadline
                    titleDataAos="fade-down"
                    subtitleDataAos="fade-down"
                    className="text-black text-center font-unbounded"
                    subtitleClassName="text-black font-poppins text-[16px] text-center"
                    title="Email lo (opsional)"
                    subtitle="Doi ga bisa liat email lo. Ini buat future feature: kita bisa kasih tau kalau feedback lo dibaca"
                  />
                  <AppTextField
                    dataAos="fade-down"
                    dataAosDelay={200}
                    control={control}
                    rules={{
                      pattern: {
                        value: /^\S+@\S+$/,
                        message: "format Email salah",
                      },
                    }}
                    type="email"
                    placeholder="email.lo@example.com"
                    name="anon_email"
                    className="!text-black"
                  />
                  <AppButton
                    dataAos="zoom-in"
                    dataAosDelay={300}
                    text={isLoading ? "Mengirim..." : "Kirim Feedback"}
                    className="bg-blue-500 font-poppins py-[15px]"
                    type="submit"
                    disabled={isLoading}
                    onClick={handleSubmit(handleFeedbackSending)}
                  />
                </AppContainer>
              )}
            </form>
          </AppContainer>
        </AppContainer>
        <Icon
          data-aos="fade-left"
          data-aos-delay={600}
          icon={"mdi:arrow-back"}
          className="text-black bg-white border-1 border-gray-300 rounded-full text-[36px] p-[4px] absolute z-90 top-3 left-3 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </AppContainer>
    </>
  );
}

export default FeedbackForm;
