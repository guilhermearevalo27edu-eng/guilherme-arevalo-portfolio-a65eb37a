import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { id: "home", pt: "Início", en: "Home", sectionKey: null },
  { id: "about", pt: "Sobre", en: "About", sectionKey: "section_about" },
  { id: "work", pt: "Trabalhos", en: "Work", sectionKey: "section_work" },
  { id: "certificates", pt: "Certificados", en: "Certificates", sectionKey: "section_certificates" },
  { id: "recommendations", pt: "Recomendações", en: "Recommendations", sectionKey: "section_recommendations" },
  { id: "contact", pt: "Contato", en: "Contact", sectionKey: "section_contact" },
];

const Navbar = () => {
  const { lang, toggle, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const { data: content = [] } = useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("*");
      return data || [];
    },
    staleTime: 0,
  });

  const visibleItems = navItems.filter((item) => {
    if (!item.sectionKey) return true;
    const entry = content.find((c) => c.key === item.sectionKey);
    return !entry || entry.value_pt !== "false";
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="#home" className="font-display text-xl font-bold text-primary">
          GA
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {visibleItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {lang === "pt" ? item.pt : item.en}
            </a>
          ))}
          <button
            onClick={toggle}
            className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            {lang === "pt" ? "🇧🇷 PT" : "🇺🇸 EN"}
          </button>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggle} className="text-sm font-semibold text-accent">
            {lang === "pt" ? "🇧🇷" : "🇺🇸"}
          </button>
          <button onClick={() => setOpen(!open)} className="text-foreground">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {visibleItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {lang === "pt" ? item.pt : item.en}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
