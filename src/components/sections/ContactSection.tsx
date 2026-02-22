import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import SocialLinks from "@/components/SocialLinks";
import { Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ContactSection = () => {
  const { lang, t } = useLanguage();

  const { data: content = [] } = useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("*");
      return data || [];
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const getContent = (key: string) => {
    const item = content.find((c) => c.key === key);
    if (!item) return "";
    return lang === "pt" ? item.value_pt : item.value_en;
  };

  const contactEmail = getContent("contact_email") || "contato@guilhermearevalo.com";
  const contactText = getContent("contact_text_pt") || t(
    "Obrigado por visitar meu portfólio! Se você quer saber mais sobre meu trabalho ou tem uma proposta, entre em contato.",
    "Thanks for visiting my portfolio! If you want to know more about my work or have a proposal, get in touch."
  );
  const footerName = getContent("footer_name") || "Guilherme Arevalo";

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">
            {t("Contato", "Contact")}
          </p>
          <h2 className="font-display text-4xl font-bold mb-4">
            {t("Vamos conversar?", "Let's talk?")}
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            {contactText}
          </p>

          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-lg mb-8"
          >
            <Mail size={20} />
            {contactEmail}
          </a>

          <div className="flex justify-center">
            <SocialLinks />
          </div>
        </motion.div>

        <div className="mt-16 pt-8 border-t border-border text-muted-foreground text-sm">
          © {new Date().getFullYear()} {footerName}. {t("Todos os direitos reservados.", "All rights reserved.")}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
