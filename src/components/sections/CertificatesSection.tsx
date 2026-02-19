import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CertificatesSection = () => {
  const { lang, t } = useLanguage();
  const { data: certificates = [] } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data } = await supabase.from("certificates").select("*").order("sort_order");
      return data || [];
    },
  });

  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">
            {t("Certificados", "Certificates")}
          </p>
          <h2 className="font-display text-4xl font-bold">
            {t("Formação & Certificações", "Education & Certifications")}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <Award className="text-accent mb-4" size={28} />
              <h3 className="font-display text-lg font-semibold">
                {lang === "pt" ? cert.name_pt : cert.name_en}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {lang === "pt" ? cert.institution_pt : cert.institution_en}
              </p>
              <p className="text-primary text-sm font-medium mt-2">{cert.year}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
