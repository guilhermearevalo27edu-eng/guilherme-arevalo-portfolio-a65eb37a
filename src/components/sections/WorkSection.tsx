import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const WorkSection = () => {
  const { lang, t } = useLanguage();
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").order("sort_order");
      return data || [];
    },
  });

  return (
    <section id="work" className="py-24 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">
            {t("Trabalhos", "Work")}
          </p>
          <h2 className="font-display text-4xl font-bold">
            {t("Projetos Selecionados", "Selected Projects")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.a
              key={project.id}
              href={project.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group block"
            >
              <div className="aspect-video rounded-xl bg-muted/50 border border-border overflow-hidden mb-4 group-hover:border-primary/50 transition-colors">
                {project.image_url ? (
                  <img src={project.image_url} alt={lang === "pt" ? project.title_pt : project.title_en} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">{t("Imagem do projeto", "Project image")}</p>
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                    {lang === "pt" ? project.title_pt : project.title_en}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {lang === "pt" ? project.description_pt : project.description_en}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm shrink-0 mt-1">
                  <span>{project.year}</span>
                  <ExternalLink size={14} className="group-hover:text-primary transition-colors" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
