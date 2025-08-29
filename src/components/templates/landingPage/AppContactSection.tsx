import AppContainer from "../../atoms/AppContainer/AppContainer";
import AppButton from "../../atoms/AppButton/AppButton";

const AppContactSection = () => {
  return (
    <section
      className="w-full  bg-white items-center justify-center 
      h-full lg:h-screen xl:h-screen
      flex 
      px-[20px] sm:px-[20px] md:px-[20px] lg:px-[100px] xl:px-[100px] 
      py-[100px] sm:py-[100px] md:py-[100px] lg:py-[0px] xl:py-[0px]
      "
      id="contact"
    >
      <AppContainer
        dataAos="flip-right"
        className="bg-blue-500 h-[80%] flex items-center flex-col md:flex-col lg:flex-row xl:flex-row  w-full rounded-[30px] lg:rounded-[80px] xl:rounded-[100px] py-[100px] sm:py-[100px] md:py-[100px] lg:py-[0px] xl:py-[0px]"
      >
        <AppContainer className="w-full sm:w-full md:w-[60%] lg:w-[60%] xl:w-[50%] h-full flex items-center justify-center ">
          <img
            data-aos="zoom-in-up"
            data-aos-delay="400"
            src="/images/laptop.svg"
          />
        </AppContainer>
        <AppContainer className="w-full sm:w-full md:w-[60%] lg:w-[60%] xl:w-[50%] h-full flex items-center justify-center ">
          <AppContainer className="flex flex-col text-white items-center lg:items-start xl:items-start  justify-center gap-[20px]">
            <h3
              className="text-[28px] font-unbounded text-center lg:text-left xl:text-left "
              data-aos="zoom-in"
            >
              Mau <strong className="text-black">Kolaborasi</strong> dengan kami
              ? <br></br>Yuk Bikin semua jadi lebih menarik dengan{" "}
              <strong className="text-black">Jujurly</strong>
            </h3>
            <p
              data-aos="zoom-in"
              data-aos-delay={200}
              className="text-[16px] font-poppins w-[90%] text-center lg:text-left xl:text-left"
            >
              Kami selalu terbuka untuk ide segar dan gagasan kreatif. Dengan
              Jujurly, setiap masukan jadi peluang untuk tumbuh. Kolaborasi ini
              bukan hanya tentang berbagi, tapi juga menciptakan sesuatu yang
              bermanfaat, menyenangkan, dan penuh inspirasi untuk semua.
            </p>
            <AppButton
              dataAos="zoom-in"
              dataAosDelay={400}
              text="Hubungi Kami"
              className="!w-fit font-unbounded"
              onClick={() => {
                window.location.href =
                  "https://mail.google.com/mail/?view=cm&to=team@jujurly.com&su=Judul&body=Isi%20pesan";
              }}
            />
          </AppContainer>
        </AppContainer>
      </AppContainer>
    </section>
  );
};
export default AppContactSection;
