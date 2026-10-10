import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE = "https://guilhermearevalo.com";

const PAGES = {
  pt: {
    title: "Guilherme Arevalo | Turismólogo, Inovação e Tecnologia no Turismo",
    description:
      "Turismólogo que une criatividade, estratégia e tecnologia para transformar destinos. Criador do Guatá e do Descubra MS. Aberto a parcerias, consultorias e projetos no Brasil e no mundo.",
    path: "/",
    locale: "pt_BR",
    lang: "pt-BR",
  },
  en: {
    title: "Guilherme Arevalo | Tourism Specialist & Travel Tech Innovator from Brazil",
    description:
      "Brazilian tourism specialist blending creativity, strategy and technology to transform destinations. Creator of Guatá and Descubra MS. Open to partnerships, consulting and global projects.",
    path: "/en",
    locale: "en_US",
    lang: "en",
  },
};

const RouteSeo = () => {
  const { pathname } = useLocation();
  const clean = pathname.replace(/\/+$/, "") || "/";

  if (clean === "/" || clean === "/en") {
    const p = clean === "/en" ? PAGES.en : PAGES.pt;
    const url = `${BASE}${p.path}`;
    const profile = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url,
      inLanguage: p.lang,
      name: p.title,
      mainEntity: { "@id": `${BASE}/#person` },
    };
    return (
      <Helmet htmlAttributes={{ lang: p.lang }}>
        <title>{p.title}</title>
        <meta name="description" content={p.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={p.title} />
        <meta property="og:description" content={p.description} />
        <meta property="og:url" content={url} />
        <meta property="og:locale" content={p.locale} />
        <meta name="twitter:title" content={p.title} />
        <meta name="twitter:description" content={p.description} />
        <script type="application/ld+json">{JSON.stringify(profile)}</script>
      </Helmet>
    );
  }

  const isAdmin = clean === "/login" || clean === "/admin";
  const title = isAdmin ? "Área restrita | Guilherme Arevalo" : "Página não encontrada | Guilherme Arevalo";
  const description = isAdmin
    ? "Área administrativa do portfólio de Guilherme Arevalo."
    : "A página que você procura não existe. Volte ao portfólio de Guilherme Arevalo.";
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={`${BASE}${clean}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${BASE}${clean}`} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default RouteSeo;
