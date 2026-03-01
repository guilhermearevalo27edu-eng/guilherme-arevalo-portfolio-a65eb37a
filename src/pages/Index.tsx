import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import WorkSection from "@/components/sections/WorkSection";
import CertificatesSection from "@/components/sections/CertificatesSection";
import RecommendationsSection from "@/components/sections/RecommendationsSection";
import ContactSection from "@/components/sections/ContactSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: content = [] } = useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("*");
      return data || [];
    },
    staleTime: 0,
  });

  const isVisible = (key: string) => {
    const item = content.find((c) => c.key === key);
    return !item || item.value_pt !== "false";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      {isVisible("section_about") && <AboutSection />}
      {isVisible("section_work") && <WorkSection />}
      {isVisible("section_certificates") && <CertificatesSection />}
      {isVisible("section_recommendations") && <RecommendationsSection />}
      {isVisible("section_contact") && <ContactSection />}
    </div>
  );
};

export default Index;
