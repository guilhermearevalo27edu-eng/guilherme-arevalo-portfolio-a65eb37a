import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "pt" | "en";

interface LanguageContextType {
  lang: Language;
  toggle: () => void;
  t: (pt: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const META = {
  pt: {
    title: "Guilherme Arevalo | Turismólogo, Inovação e Tecnologia no Turismo",
    description:
      "Turismólogo que une criatividade, estratégia e tecnologia para transformar destinos. Criador do Guatá e do Descubra MS. Aberto a parcerias, consultorias e projetos no Brasil e no mundo.",
  },
  en: {
    title: "Guilherme Arevalo | Tourism Specialist & Travel Tech Innovator from Brazil",
    description:
      "Brazilian tourism specialist blending creativity, strategy and technology to transform destinations. Creator of Guatá and Descubra MS. Open to partnerships, consulting and global projects.",
  },
};

const isEnPath = () =>
  typeof window !== "undefined" && /^\/en(\/|$)/.test(window.location.pathname);

const setMeta = (selector: string, value: string) => {
  const el = document.querySelector(selector);
  if (el) el.setAttribute("content", value);
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>(isEnPath() ? "en" : "pt");

  useEffect(() => {
    const m = META[lang];
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    const path = window.location.pathname;
    if (path === "/" || /^\/en\/?$/.test(path)) {
      document.title = m.title;
      setMeta('meta[name="description"]', m.description);
      setMeta('meta[property="og:title"]', m.title);
      setMeta('meta[property="og:description"]', m.description);
      setMeta('meta[property="og:locale"]', lang === "pt" ? "pt_BR" : "en_US");
      const url = `https://guilhermearevalo.com${lang === "en" ? "/en" : "/"}`;
      setMeta('meta[property="og:url"]', url);
      document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    }
  }, [lang]);

  const toggle = () => {
    const next: Language = lang === "pt" ? "en" : "pt";
    const path = window.location.pathname;
    if (path === "/" || /^\/en\/?$/.test(path)) {
      window.history.replaceState(null, "", (next === "en" ? "/en" : "/") + window.location.hash);
    }
    setLang(next);
  };
  const t = (pt: string, en: string) => (lang === "pt" ? pt : en);

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
