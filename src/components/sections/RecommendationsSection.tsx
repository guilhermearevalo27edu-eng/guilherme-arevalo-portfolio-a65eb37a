import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const RecommendationsSection = () => {
  const { lang, t } = useLanguage();
  const { data: recommendations = [] } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const { data } = await supabase.from("recommendations").select("*").order("sort_order");
      return data || [];
    },
  });

  if (recommendations.length === 0) return null;

  return (
    <section id="recommendations" className="py-24 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">
            {t("Recomendações", "Recommendations")}
          </p>
          <h2 className="font-display text-4xl font-bold">
            {t("O que dizem sobre mim", "What people say")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {recommendations.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border border-border rounded-xl p-8"
            >
              <Quote className="text-primary/30 mb-4" size={32} />
              <p className="text-foreground leading-relaxed mb-6">
                {lang === "pt" ? rec.text_pt : rec.text_en}
              </p>
              {rec.screenshot_url && (
                <img src={rec.screenshot_url} alt="Recomendação" className="rounded-lg mb-4 max-h-48 object-contain" />
              )}
              <div>
                <p className="font-semibold">{rec.person_name}</p>
                <p className="text-muted-foreground text-sm">
                  {lang === "pt" ? rec.role_pt : rec.role_en}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendationsSection;
