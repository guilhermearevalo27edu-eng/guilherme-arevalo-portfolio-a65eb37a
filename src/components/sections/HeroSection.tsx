import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const { lang, t } = useLanguage();

  const { data: content = [] } = useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("*");
      return data || [];
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const getContent = (key: string) => {
    const item = content.find((c) => c.key === key);
    if (!item) return "";
    return lang === "pt" ? item.value_pt : item.value_en;
  };

  const heroPhotoUrl = getContent("hero_photo");

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            {getContent("tagline") || t("Turismo & Tecnologia", "Tourism & Technology")}
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            Guilherme
            <br />
            <span className="text-primary">Arevalo</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mb-8 leading-relaxed">
           {getContent("hero_bio") || t(
              "Criador do Guatá, idealizador do Descubra Mato Grosso do Sul. Unindo turismo e tecnologia para transformar o cenário sul-mato-grossense.",
              "Creator of Guatá, founder of Descubra Mato Grosso do Sul. Merging tourism and technology to transform the landscape of Mato Grosso do Sul."
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <a
              href="#work"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              {t("Ver Portfólio", "View Portfolio")}
              <ArrowDown size={16} />
            </a>
            <SocialLinks />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden md:block"
        >
          <div className="aspect-[3/4] rounded-2xl bg-muted/50 border border-border overflow-hidden flex items-center justify-center">
            {heroPhotoUrl ? (
              <img
                src={heroPhotoUrl}
                alt={t("Guilherme Santos Arevalo, turismólogo e criador do Guatá", "Guilherme Santos Arevalo, tourism professional and creator of Guatá")}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <p className="text-muted-foreground text-sm">{t("Sua foto aqui", "Your photo here")}</p>
            )}
          </div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-primary rounded-2xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
