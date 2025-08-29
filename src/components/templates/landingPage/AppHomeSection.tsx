import AppContainer from "../../atoms/AppContainer/AppContainer";
import AppHeadline from "../../molecules/AppHeadline/AppHeadline";
import AppButton from "../../atoms/AppButton/AppButton";
import { useNavigate } from "react-router-dom";

const AppHomeSection = () => {
  const arr = [1, 2, 3, 4, 5];
  const navigate = useNavigate();
  return (
    <section
      className="w-full  bg- gap-[50px] 
      h-full lg:h-screen xl:h-screen
      flex flex-col-reverse md:flex-col-reverse lg:flex-row xl:flex-row 
      px-[20px] sm:px-[20px] md:px-[20px] lg:px-[100px] xl:px-[100px] 
      py-[100px] sm:py-[100px] md:py-[100px] lg:py-[0px] xl:py-[0px] 
      mt-[0px] sm:mt-[0px] md:mt-[0px] lg:mt-[10px] xl:mt-[100px] 
      items-center "
      id="home"
    >
      <AppContainer className=" w-full sm:w-full md:w-[60%] lg:w-[60%] xl:w-[50%] h-full flex items-center justify-center">
        <AppContainer className="flex flex-col gap-[40px] items-center sm:items-center md:items-center lg:items-start xl:items-start">
          <AppContainer className="flex flex-col items-center sm:items-center md:items-center  lg:items-start xl:items-start justify-start gap-[20px] text-center lg:text-left xl:text-left">
            <p
              className="text-[14px]  text-white font-anton"
              data-aos="fade-right"
              data-aos-delay="500"
            >
              Platform Honesty as a Service (HaaS) pertama di Indonesia!
            </p>
            <AppHeadline
              className="items-center sm:items-center md:items-center  lg:items-start xl:items-start self-center !gap-[15px] min-w-fit text-center lg:text-left xl:text-left"
              title={"Feedback jujur, biar makin mujur"}
              titleClassName="text-[48px] font-bold text-white leading-10 !font-unbounded "
              subtitle={
                " Suara dan masukannya kamu sangat berarti buat kami. Dari komentar kecil hingga saran besar, semuanya membantu kami menyempurnakan karya ini. Yuk, jadi bagian dari perjalanan kami menuju sesuatu yang lebih baik!."
              }
              subtitleClassName="text-[16px]  text-white font-poppins text-center lg:text-left xl:text-left!font-poppins w-[80%]"
              titleDataAos="fade-right"
              subtitleDataAos="fade-right"
            />
          </AppContainer>
          <AppContainer className="flex relative w-fit ">
            <AppContainer className="flex ">
              {arr.map((data) => {
                return (
                  <AppContainer
                    dataAos="fade-down-right"
                    key={data}
                    className={`w-[50px] h-[50px] rounded-full bg-cover relative`}
                    style={{
                      backgroundImage: `url('https://picsum.photos/id/23${data}/200/300')`,
                      zIndex: data,
                      left: data !== 1 ? `${data * -20}px` : "0px", // overlap separuh (40px width)
                    }}
                  />
                );
              })}
            </AppContainer>
            <AppHeadline
              titleDataAos="fade-down-right"
              subtitleDataAos="fade-down-right"
              className="items-start self-center !gap-[0px] min-w-fit  absolute left-40"
              title={"5M+"}
              titleClassName="text-[16px] font-bold text-white leading-4 !font-unbounded "
              subtitle={"Telah Bergabung"}
              subtitleClassName="text-[14px]  text-white font-poppins text-left !font-poppins w-full "
            />
          </AppContainer>
          <AppContainer className="flex  flex-col md:flex-col lg:flex-row xl:flex-row  items-center gap-[10px]">
              <AppButton
                dataAos="zoom-in"
                text="Mau Kumpulkan Feedback"
                className="!min-w-fit sm:!min-w-fit md:!w-fit lg:!w-fit xl:w-fit bg-white !text-black border-1 border-black font-poppins"
                onClick={() => navigate("/dashboard")}
              />
              <AppButton
                dataAos="zoom-in"
                dataAosDelay={200}
                text="Mau Kasih Feedback"
                className="!min-w-fit sm:!min-w-fit md:!w-fit lg:!w-fit xl:w-fit font-poppins"
                onClick={() => navigate("/beri-feedback")}
              />

          </AppContainer>
        </AppContainer>
      </AppContainer>
      <AppContainer className="w-[50%]  h-full items-center jusitfy-center">
        <img data-aos="zoom-in-left" src="/images/home.svg" />
      </AppContainer>
    </section>
  );
};

export default AppHomeSection;
