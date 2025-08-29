import AppContainer from "../../atoms/AppContainer/AppContainer";
import AppAccordion from "../../molecules/AppAccordion/AppAccordion";
const AppFaqSection: React.FC = () => {
  const faqs = [
    {
      title: "Apa itu aplikasi ini?",
      description:
        "Aplikasi ini memungkinkan Anda memberikan umpan balik secara anonim menggunakan AI dengan nada positif atau netral, lalu membagikan tautan umpan balik Anda kepada orang lain.",
    },
    {
      title: "Bagaimana menjaga anonimitas?",
      description:
        "Kami tidak menyimpan data pribadi pengirim. Setiap umpan balik sepenuhnya anonim dan aman.",
    },
    {
      title: "Bisakah memilih nada umpan balik?",
      description:
        "Tentu. Anda dapat memilih nada positif atau netral, dan AI kami akan membantu menyusunnya.",
    },
    {
      title: "Bagaimana cara membagikan tautan feedback?",
      description:
        "Setelah menulis umpan balik, Anda mendapatkan tautan khusus untuk dibagikan.",
    },
    {
      title: "Apakah bisa memberikan saran?",
      description:
        "Ya, Anda dapat menambahkan saran, dan AI akan membantu merangkumnya dengan baik.",
    },
  ];

  return (
    <section
      className="w-full h-full bg-white flex flex-col gap-[20px] items-center justify-center 
   
      px-[20px] sm:px-[20px] md:px-[20px] lg:px-[100px] xl:px-[100px] 
      py-[100px] sm:py-[100px] md:py-[100px] lg:py-[0px] xl:py-[0px]"
      id="faq"
    >
      <h3 data-aos="zoom-in" className="text-[28px] font-unbounded text-center">
        Ingin <strong>Tahu</strong> lebih <strong>dekat</strong> ? <br></br>{" "}
        Berikut <strong>Pertanyaan yang Sering Diajukan</strong>
      </h3>
      <AppContainer className=" w-full sm:w-full  md:w-full lg:w-[80%] xl:w-[80%] flex flex-col items-center gap-[15px]">
        {faqs.map((data, index) => {
          return (
            <AppAccordion
              key={index}
              dataAos="fade-up"
              dataAosDelay={index * 200}
              title={data.title}
              subtitle={data.description}
            />
          );
        })}
      </AppContainer>
    </section>
  );
};
export default AppFaqSection;
