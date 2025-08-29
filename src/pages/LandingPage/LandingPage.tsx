import AppNavbar from "../../components/templates/landingPage/AppNavbar";
import AppHomeSection from "../../components/templates/landingPage/AppHomeSection";
import AppFeatureSection from "../../components/templates/landingPage/AppFeatureSection";
import AppFaqSection from "../../components/templates/landingPage/AppFaqSection";
import AppContactSection from "../../components/templates/landingPage/AppContactSection";
import AppFooter from "../../components/templates/landingPage/AppFooter";
import { useEffect } from "react";
import AOS from "aos";

const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  return (
    <>
      <main className="w-full h-full  bg-blue-400 overflow-x-hidden relative">
        <AppNavbar />
        <AppHomeSection />
        <AppFeatureSection />
        <AppFaqSection />
        <AppContactSection />
        <AppFooter />
      </main>
    </>
  );
};

export default LandingPage;
