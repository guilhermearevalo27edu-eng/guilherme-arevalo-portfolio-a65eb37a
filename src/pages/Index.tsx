import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import WorkSection from "@/components/sections/WorkSection";
import CertificatesSection from "@/components/sections/CertificatesSection";
import RecommendationsSection from "@/components/sections/RecommendationsSection";
import ContactSection from "@/components/sections/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <CertificatesSection />
      <RecommendationsSection />
      <ContactSection />
    </div>
  );
};

export default Index;
