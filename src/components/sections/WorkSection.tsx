import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Newspaper, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const WorkSection = () => {
  const { lang, t } = useLanguage();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").order("sort_order");
      return data || [];
    },
  });

  const { data: allMedia = [] } = useQuery({
    queryKey: ["project_media"],
    queryFn: async () => {
      const { data } = await supabase.from("project_media").select("*").order("sort_order");
      return data || [];
    },
  });

  const getMediaForProject = (projectId: string) =>
    allMedia.filter((m) => m.project_id === projectId);

  const selectedMedia = selectedProjectId ? getMediaForProject(selectedProjectId) : [];
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

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
          {projects.map((project, i) => {
            const media = getMediaForProject(project.id);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group block"
              >
                <a
                  href={project.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
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
                </a>
                <div className="flex items-start justify-between">
                  <div>
                    <a href={project.link || "#"} target="_blank" rel="noopener noreferrer">
                      <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                        {lang === "pt" ? project.title_pt : project.title_en}
                      </h3>
                    </a>
                    <p className="text-muted-foreground text-sm mt-1">
                      {lang === "pt" ? project.description_pt : project.description_en}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm shrink-0 mt-1">
                    <span>{project.year}</span>
                    <ExternalLink size={14} className="group-hover:text-primary transition-colors" />
                  </div>
                </div>
                {media.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 gap-2"
                    onClick={() => setSelectedProjectId(project.id)}
                  >
                    <Newspaper size={14} />
                    {t("Ver na mídia", "View in media")} ({media.length})
                  </Button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedProjectId} onOpenChange={() => setSelectedProjectId(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {selectedProject && (lang === "pt" ? selectedProject.title_pt : selectedProject.title_en)} — {t("Na Mídia", "In the Media")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {selectedMedia.map((m) => (
              <div key={m.id} className="border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {m.media_type}
                  </span>
                  <h4 className="font-semibold">
                    {lang === "pt" ? m.title_pt : m.title_en}
                  </h4>
                </div>
                <p className="text-muted-foreground text-sm">
                  {lang === "pt" ? m.description_pt : m.description_en}
                </p>
                {m.media_url && (
                  <img src={m.media_url} alt="" className="rounded-lg w-full max-h-64 object-cover" />
                )}
                {m.external_url && (
                  <a
                    href={m.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    {t("Ver matéria completa", "View full article")} <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WorkSection;
