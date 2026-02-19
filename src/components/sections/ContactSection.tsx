import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import SocialLinks from "@/components/SocialLinks";
import { Mail } from "lucide-react";

const ContactSection = () => {
  const { t } = useLanguage();

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
            {t(
              "Obrigado por visitar meu portfólio! Se você quer saber mais sobre meu trabalho ou tem uma proposta, entre em contato.",
              "Thanks for visiting my portfolio! If you want to know more about my work or have a proposal, get in touch."
            )}
          </p>

          <a
            href="mailto:contato@guilhermearevalo.com"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-lg mb-8"
          >
            <Mail size={20} />
            contato@guilhermearevalo.com
          </a>

          <div className="flex justify-center">
            <SocialLinks />
          </div>
        </motion.div>

        <div className="mt-16 pt-8 border-t border-border text-muted-foreground text-sm">
          © {new Date().getFullYear()} Guilherme Arevalo. {t("Todos os direitos reservados.", "All rights reserved.")}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
