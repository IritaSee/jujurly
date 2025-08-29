import AppContainer from "../../atoms/AppContainer/AppContainer";
import AppHeadline from "../../molecules/AppHeadline/AppHeadline";

const AppFeatureSection: React.FC = () => {
  const features = [
    {
      title: "Feedback jujur, biar makin mujur.",
      description:
        "Suara dan masukannya kamu sangat berarti buat kami. Dari komentar kecil hingga saran besar, semuanya membantu kami menyempurnakan karya ini.",
    },
    {
      title: "Buat kamu yang suka berbagi cerita.",
      description:
        "Kami ingin mendengar kisahmu! Bagikan pengalamanmu dengan kami, dan mari bersama-sama menciptakan komunitas yang penuh inspirasi.",
    },
  ];

  return (
    <section
      className="w-full  bg-white items-center gap-[20px]
      h-full lg:h-screen xl:h-screen
      flex flex-col md:flex-col lg:flex-row xl:flex-row 
      px-[20px] sm:px-[20px] md:px-[20px] lg:px-[100px] xl:px-[100px] 
      py-[100px] sm:py-[100px] md:py-[100px] lg:py-[0px] xl:py-[0px]
      "
      id="feature"
    >
      <AppContainer className="w-[50%] h-full flex items-center justify-center ">
        <img data-aos="zoom-in-right" src="/images/feature.svg" />
      </AppContainer>
      <AppContainer className="w-full sm:w-full md:w-[60%] lg:w-[60%] xl:w-[50%] h-full flex items-center jusitfy-center">
        <AppContainer className="flex flex-col gap-[40px]">
          <h3
            data-aos="zoom-in-right"
            className="text-[28px] font-unbounded font-bold"
          >
            Bisa Ngapain Apa aja sih?<br></br>di Jujurly ini
          </h3>

          <AppContainer className="flex flex-col gap-[30px]">
            {features.map((data, index) => {
              return (
                <AppContainer
                  key={index}
                  className="flex items-center gap-[30px]"
                  dataAos="fade-up"
                  dataAosDelay={index * 200}
                >
                  <AppContainer className="w-[50px] h-[50px] rounded-full shadow-lg flex  flex-shrink-0 items-center justify-center font-bold">
                    {index + 1}
                  </AppContainer>
                  <AppHeadline
                    className="items-start !gap-[10px] "
                    title={data.title}
                    titleClassName="text-[14px] font-bold text-black  !font-unbounded "
                    subtitle={data.description}
                    subtitleClassName="text-[12px]  text-black font-poppins text-left !font-poppins w-full"
                  />
                </AppContainer>
              );
            })}
          </AppContainer>
        </AppContainer>
      </AppContainer>
    </section>
  );
};

export default AppFeatureSection;
