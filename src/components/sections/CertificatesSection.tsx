import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const CertificatesSection = () => {
  const { lang, t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: certificates = [] } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data } = await supabase.from("certificates").select("*").order("sort_order");
      return data || [];
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  if (certificates.length === 0) return null;

  return (
    <>
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
            {certificates.map((cert, i) => {
              const imageUrl = (cert as any).image_url;
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors ${imageUrl ? "cursor-pointer" : ""}`}
                  onClick={() => imageUrl && setSelectedImage(imageUrl)}
                >
                  {imageUrl && (
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img src={imageUrl} alt={lang === "pt" ? cert.name_pt : cert.name_en} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    {!imageUrl && <Award className="text-accent mb-4" size={28} />}
                    <h3 className="font-display text-lg font-semibold">
                      {lang === "pt" ? cert.name_pt : cert.name_en}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {lang === "pt" ? cert.institution_pt : cert.institution_en}
                    </p>
                    <p className="text-primary text-sm font-medium mt-2">{cert.year}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Image modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="" className="max-w-full max-h-[90vh] rounded-lg object-contain" />
        </div>
      )}
    </>
  );
};

export default CertificatesSection;
