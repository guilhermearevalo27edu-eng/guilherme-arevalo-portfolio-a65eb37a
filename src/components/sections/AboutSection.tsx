import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="aspect-square rounded-2xl bg-muted/50 border border-border overflow-hidden flex items-center justify-center">
            <p className="text-muted-foreground text-sm">{t("Foto", "Photo")}</p>
          </div>
          <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-accent rounded-xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">
            {t("Sobre Mim", "About Me")}
          </p>
          <h2 className="font-display text-4xl font-bold mb-6">
            {t("Paixão por turismo e inovação", "Passion for tourism and innovation")}
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              {t(
                "Estudante de Turismo na Universidade Estadual de Mato Grosso do Sul (UEMS), apaixonado por unir turismo e tecnologia para promover o potencial turístico do estado.",
                "Tourism student at the State University of Mato Grosso do Sul (UEMS), passionate about merging tourism and technology to promote the state's tourism potential."
              )}
            </p>
            <p>
              {t(
                "Criador do Guatá, a capivara mascote de turismo do MS, e idealizador do projeto Descubra Mato Grosso do Sul (descubrams.com), que busca dar visibilidade aos destinos e experiências únicas do estado.",
                "Creator of Guatá, the capybara tourism mascot of MS, and founder of the Descubra Mato Grosso do Sul project (descubrams.com), which showcases the state's unique destinations and experiences."
              )}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="border border-border rounded-xl p-4">
              <p className="text-3xl font-display font-bold text-primary">UEMS</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("Turismo", "Tourism")}
              </p>
            </div>
            <div className="border border-border rounded-xl p-4">
              <p className="text-3xl font-display font-bold text-secondary">2+</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("Projetos Ativos", "Active Projects")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
