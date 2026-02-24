import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, LogOut, ChevronDown, ChevronUp } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;
type Certificate = Tables<"certificates">;
type Recommendation = Tables<"recommendations">;
type SocialLink = Tables<"social_links">;
type SiteContent = Tables<"site_content">;

interface ProjectMedia {
  id: string;
  project_id: string;
  title_pt: string;
  title_en: string;
  description_pt: string;
  description_en: string;
  media_url: string | null;
  external_url: string | null;
  media_type: string;
  sort_order: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<SiteContent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [projectMedia, setProjectMedia] = useState<ProjectMedia[]>([]);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [version, setVersion] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/login"); return; }
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (!isAdmin) { navigate("/login"); return; }
    fetchAll();
  };

  const fetchAll = async () => {
    setLoading(true);
    const [c, p, cert, rec, sl, pm] = await Promise.all([
      supabase.from("site_content").select("*"),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("certificates").select("*").order("sort_order"),
      supabase.from("recommendations").select("*").order("sort_order"),
      supabase.from("social_links").select("*").order("sort_order"),
      supabase.from("project_media").select("*").order("sort_order"),
    ]);
    setContent(c.data || []);
    setProjects(p.data || []);
    setCertificates(cert.data || []);
    setRecommendations(rec.data || []);
    setSocialLinks(sl.data || []);
    setProjectMedia((pm.data as ProjectMedia[]) || []);
    setVersion((v) => v + 1);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const updateContentField = async (id: string, field: "value_pt" | "value_en", value: string) => {
    const updated_at = new Date().toISOString();
    const { error } = await supabase.from("site_content").update({ [field]: value, updated_at }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Salvo!");
      setContent((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value, updated_at } : c));
    }
  };

  // Upload profile photo
  const uploadProfilePhoto = async (file: File) => {
    const url = await uploadImage(file, `profile/photo-${Date.now()}`);
    if (!url) return;
    // Check if profile_photo key exists
    const existing = content.find((c) => c.key === "profile_photo");
    if (existing) {
      await supabase.from("site_content").update({ value_pt: url, value_en: url, updated_at: new Date().toISOString() }).eq("id", existing.id);
    } else {
      await supabase.from("site_content").insert({ key: "profile_photo", value_pt: url, value_en: url });
    }
    toast.success("Foto atualizada!");
    fetchAll();
  };

  // Projects CRUD
  const addProject = async () => {
    const { error } = await supabase.from("projects").insert({ title_pt: "Novo Projeto", title_en: "New Project", sort_order: projects.length });
    if (error) toast.error(error.message); else fetchAll();
  };
  const updateProject = async (id: string, data: Partial<Project>) => {
    const { error } = await supabase.from("projects").update(data).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Salvo!");
      setProjects((prev) => prev.map((p) => p.id === id ? { ...p, ...data } : p));
    }
  };
  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  // Project Media CRUD
  const addMedia = async (projectId: string) => {
    const count = projectMedia.filter((m) => m.project_id === projectId).length;
    const { error } = await supabase.from("project_media").insert({
      project_id: projectId,
      title_pt: "Nova mídia",
      title_en: "New media",
      sort_order: count,
    });
    if (error) toast.error(error.message); else fetchAll();
  };
  const updateMedia = async (id: string, data: Partial<ProjectMedia>) => {
    const { error } = await supabase.from("project_media").update(data).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Salvo!");
      setProjectMedia((prev) => prev.map((m) => m.id === id ? { ...m, ...data } : m));
    }
  };
  const deleteMedia = async (id: string) => {
    const { error } = await supabase.from("project_media").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  // Certificates CRUD
  const addCertificate = async () => {
    const { error } = await supabase.from("certificates").insert({ name_pt: "Novo Certificado", name_en: "New Certificate", sort_order: certificates.length });
    if (error) toast.error(error.message); else fetchAll();
  };
  const updateCertificate = async (id: string, data: Partial<Certificate>) => {
    const { error } = await supabase.from("certificates").update(data).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Salvo!");
      setCertificates((prev) => prev.map((c) => c.id === id ? { ...c, ...data } : c));
    }
  };
  const deleteCertificate = async (id: string) => {
    const { error } = await supabase.from("certificates").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  // Recommendations CRUD
  const addRecommendation = async () => {
    const { error } = await supabase.from("recommendations").insert({ person_name: "Nome", sort_order: recommendations.length });
    if (error) toast.error(error.message); else fetchAll();
  };
  const updateRecommendation = async (id: string, data: Partial<Recommendation>) => {
    const { error } = await supabase.from("recommendations").update(data).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Salvo!");
      setRecommendations((prev) => prev.map((r) => r.id === id ? { ...r, ...data } : r));
    }
  };
  const deleteRecommendation = async (id: string) => {
    const { error } = await supabase.from("recommendations").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  // Social links CRUD
  const addSocialLink = async () => {
    const { error } = await supabase.from("social_links").insert({ platform: "Novo Link", url: "https://", icon: "link", sort_order: socialLinks.length });
    if (error) toast.error(error.message); else fetchAll();
  };
  const updateSocialLink = async (id: string, data: Partial<SocialLink>) => {
    const { error } = await supabase.from("social_links").update(data).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Salvo!");
      setSocialLinks((prev) => prev.map((s) => s.id === id ? { ...s, ...data } : s));
    }
  };
  const deleteSocialLink = async (id: string) => {
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  // Image upload
  const uploadImage = async (file: File, path: string) => {
    const { data, error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); return null; }
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const toggleProjectExpand = (id: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Carregando...</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold">Painel Admin</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>Ver Site</Button>
            <Button variant="outline" size="sm" onClick={handleLogout}><LogOut size={16} /> Sair</Button>
          </div>
        </div>

        <Tabs defaultValue="content">
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="certificates">Certificados</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {/* Profile Photo Upload */}
            <div className="border border-border rounded-xl p-6 space-y-4">
              <p className="font-semibold text-primary">Foto de Perfil (Sobre Mim)</p>
              <input type="file" accept="image/*" className="text-sm" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadProfilePhoto(file);
              }} />
              {content.find((c) => c.key === "profile_photo")?.value_pt && (
                <img src={content.find((c) => c.key === "profile_photo")!.value_pt} alt="" className="h-24 w-24 rounded-full object-cover" />
              )}
            </div>
            {/* Hero Photo Upload */}
            <div className="border border-border rounded-xl p-6 space-y-4">
              <p className="font-semibold text-primary">Foto do Hero (Página Inicial)</p>
              <input type="file" accept="image/*" className="text-sm" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = await uploadImage(file, `profile/hero-${Date.now()}`);
                if (!url) return;
                const existing = content.find((c) => c.key === "hero_photo");
                if (existing) {
                  await supabase.from("site_content").update({ value_pt: url, value_en: url, updated_at: new Date().toISOString() }).eq("id", existing.id);
                } else {
                  await supabase.from("site_content").insert({ key: "hero_photo", value_pt: url, value_en: url });
                }
                toast.success("Foto do Hero atualizada!");
                fetchAll();
              }} />
              {content.find((c) => c.key === "hero_photo")?.value_pt && (
                <img src={content.find((c) => c.key === "hero_photo")!.value_pt} alt="" className="h-24 w-32 rounded object-cover" />
              )}
            </div>
            {content.filter((c) => c.key !== "profile_photo" && c.key !== "hero_photo").map((item) => (
              <div key={item.id + "-" + version} className="border border-border rounded-xl p-6 space-y-4">
                <p className="font-semibold text-primary capitalize">{item.key}</p>
                <div>
                  <label className="text-sm text-muted-foreground">🇧🇷 Português</label>
                  <Textarea defaultValue={item.value_pt} onBlur={(e) => updateContentField(item.id, "value_pt", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">🇺🇸 English</label>
                  <Textarea defaultValue={item.value_en} onBlur={(e) => updateContentField(item.id, "value_en", e.target.value)} />
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Button onClick={addProject} size="sm"><Plus size={16} /> Adicionar Projeto</Button>
            {projects.map((p) => {
              const media = projectMedia.filter((m) => m.project_id === p.id);
              const isExpanded = expandedProjects.has(p.id);
              return (
                <div key={p.id + "-" + version} className="border border-border rounded-xl p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-3">
                      <Input placeholder="Título PT" defaultValue={p.title_pt} onBlur={(e) => updateProject(p.id, { title_pt: e.target.value })} />
                      <Input placeholder="Title EN" defaultValue={p.title_en} onBlur={(e) => updateProject(p.id, { title_en: e.target.value })} />
                      <Textarea placeholder="Descrição PT" defaultValue={p.description_pt} onBlur={(e) => updateProject(p.id, { description_pt: e.target.value })} />
                      <Textarea placeholder="Description EN" defaultValue={p.description_en} onBlur={(e) => updateProject(p.id, { description_en: e.target.value })} />
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Link" defaultValue={p.link || ""} onBlur={(e) => updateProject(p.id, { link: e.target.value })} />
                        <Input placeholder="Ano" defaultValue={p.year || ""} onBlur={(e) => updateProject(p.id, { year: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Imagem do projeto</label>
                        <input type="file" accept="image/*" className="mt-1 text-sm" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await uploadImage(file, `projects/${p.id}-${Date.now()}`);
                          if (url) { updateProject(p.id, { image_url: url }); }
                        }} />
                        {p.image_url && <img src={p.image_url} alt="" className="mt-2 h-20 rounded object-cover" />}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteProject(p.id)}><Trash2 size={16} className="text-destructive" /></Button>
                  </div>

                  {/* Media/Press Section */}
                  <div className="border-t border-border pt-3 mt-3">
                    <button
                      onClick={() => toggleProjectExpand(p.id)}
                      className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      Mídia/Imprensa ({media.length})
                    </button>
                    {isExpanded && (
                      <div className="mt-3 space-y-4">
                        <Button onClick={() => addMedia(p.id)} size="sm" variant="outline">
                          <Plus size={14} /> Adicionar Mídia
                        </Button>
                        {media.map((m) => (
                          <div key={m.id} className="border border-border/50 rounded-lg p-4 space-y-2 bg-muted/30">
                            <div className="flex justify-between">
                              <div className="flex-1 space-y-2">
                                <Input placeholder="Título PT" defaultValue={m.title_pt} onBlur={(e) => updateMedia(m.id, { title_pt: e.target.value })} />
                                <Input placeholder="Title EN" defaultValue={m.title_en} onBlur={(e) => updateMedia(m.id, { title_en: e.target.value })} />
                                <Textarea placeholder="Descrição PT" defaultValue={m.description_pt} onBlur={(e) => updateMedia(m.id, { description_pt: e.target.value })} />
                                <Textarea placeholder="Description EN" defaultValue={m.description_en} onBlur={(e) => updateMedia(m.id, { description_en: e.target.value })} />
                                <div className="grid grid-cols-2 gap-2">
                                  <Input placeholder="Link externo" defaultValue={m.external_url || ""} onBlur={(e) => updateMedia(m.id, { external_url: e.target.value })} />
                                  <select
                                    defaultValue={m.media_type}
                                    onChange={(e) => updateMedia(m.id, { media_type: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                  >
                                    <option value="jornal">Jornal</option>
                                    <option value="radio">Rádio</option>
                                    <option value="tv">TV</option>
                                    <option value="online">Online</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-sm text-muted-foreground">Imagem/Print</label>
                                  <input type="file" accept="image/*" className="mt-1 text-sm" onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const url = await uploadImage(file, `media/${m.id}-${Date.now()}`);
                                    if (url) updateMedia(m.id, { media_url: url });
                                  }} />
                                  {m.media_url && <img src={m.media_url} alt="" className="mt-2 h-20 rounded object-cover" />}
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => deleteMedia(m.id)}>
                                <Trash2 size={14} className="text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <Button onClick={addCertificate} size="sm"><Plus size={16} /> Adicionar Certificado</Button>
            {certificates.map((c) => (
              <div key={c.id + "-" + version} className="border border-border rounded-xl p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    <Input placeholder="Nome PT" defaultValue={c.name_pt} onBlur={(e) => updateCertificate(c.id, { name_pt: e.target.value })} />
                    <Input placeholder="Name EN" defaultValue={c.name_en} onBlur={(e) => updateCertificate(c.id, { name_en: e.target.value })} />
                    <Input placeholder="Instituição PT" defaultValue={c.institution_pt} onBlur={(e) => updateCertificate(c.id, { institution_pt: e.target.value })} />
                    <Input placeholder="Institution EN" defaultValue={c.institution_en} onBlur={(e) => updateCertificate(c.id, { institution_en: e.target.value })} />
                    <Input placeholder="Ano" defaultValue={c.year || ""} onBlur={(e) => updateCertificate(c.id, { year: e.target.value })} />
                    <div>
                      <label className="text-sm text-muted-foreground">Imagem do Certificado</label>
                      <input type="file" accept="image/*" className="mt-1 text-sm" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadImage(file, `certificates/${c.id}-${Date.now()}`);
                        if (url) { updateCertificate(c.id, { image_url: url } as any); }
                      }} />
                      {(c as any).image_url && <img src={(c as any).image_url} alt="" className="mt-2 h-20 rounded object-cover" />}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteCertificate(c.id)}><Trash2 size={16} className="text-destructive" /></Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Button onClick={addRecommendation} size="sm"><Plus size={16} /> Adicionar Recomendação</Button>
            {recommendations.map((r) => (
              <div key={r.id + "-" + version} className="border border-border rounded-xl p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    <Input placeholder="Nome da pessoa" defaultValue={r.person_name} onBlur={(e) => updateRecommendation(r.id, { person_name: e.target.value })} />
                    <Input placeholder="Cargo PT" defaultValue={r.role_pt} onBlur={(e) => updateRecommendation(r.id, { role_pt: e.target.value })} />
                    <Input placeholder="Role EN" defaultValue={r.role_en} onBlur={(e) => updateRecommendation(r.id, { role_en: e.target.value })} />
                    <Textarea placeholder="Texto PT" defaultValue={r.text_pt} onBlur={(e) => updateRecommendation(r.id, { text_pt: e.target.value })} />
                    <Textarea placeholder="Text EN" defaultValue={r.text_en} onBlur={(e) => updateRecommendation(r.id, { text_en: e.target.value })} />
                    <div>
                      <label className="text-sm text-muted-foreground">Print/Screenshot</label>
                      <input type="file" accept="image/*" className="mt-1 text-sm" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadImage(file, `recommendations/${r.id}-${Date.now()}`);
                        if (url) { updateRecommendation(r.id, { screenshot_url: url }); }
                      }} />
                      {r.screenshot_url && <img src={r.screenshot_url} alt="" className="mt-2 h-20 rounded object-cover" />}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteRecommendation(r.id)}><Trash2 size={16} className="text-destructive" /></Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Button onClick={addSocialLink} size="sm"><Plus size={16} /> Adicionar Link</Button>
            {socialLinks.map((s) => (
              <div key={s.id + "-" + version} className="border border-border rounded-xl p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    <Input placeholder="Plataforma (ex: Instagram)" defaultValue={s.platform} onBlur={(e) => updateSocialLink(s.id, { platform: e.target.value })} />
                    {s.icon === "message-circle" ? (
                      <Input placeholder="Número com DDD e código do país (ex: 5567999999999)" defaultValue={s.url} onBlur={(e) => updateSocialLink(s.id, { url: e.target.value.replace(/\D/g, '') })} />
                    ) : (
                      <Input placeholder="URL" defaultValue={s.url} onBlur={(e) => updateSocialLink(s.id, { url: e.target.value })} />
                    )}
                    <div>
                      <label className="text-sm text-muted-foreground">Ícone</label>
                      <select
                        defaultValue={s.icon}
                        onChange={(e) => updateSocialLink(s.id, { icon: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="message-circle">WhatsApp</option>
                        <option value="external-link">Link Externo</option>
                        <option value="graduation-cap">Lattes/Acadêmico</option>
                        <option value="link">Link Genérico</option>
                      </select>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteSocialLink(s.id)}><Trash2 size={16} className="text-destructive" /></Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
