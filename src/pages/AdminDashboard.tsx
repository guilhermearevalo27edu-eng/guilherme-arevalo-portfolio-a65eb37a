import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, LogOut } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;
type Certificate = Tables<"certificates">;
type Recommendation = Tables<"recommendations">;
type SocialLink = Tables<"social_links">;
type SiteContent = Tables<"site_content">;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<SiteContent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

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
    const [c, p, cert, rec, sl] = await Promise.all([
      supabase.from("site_content").select("*"),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("certificates").select("*").order("sort_order"),
      supabase.from("recommendations").select("*").order("sort_order"),
      supabase.from("social_links").select("*").order("sort_order"),
    ]);
    setContent(c.data || []);
    setProjects(p.data || []);
    setCertificates(cert.data || []);
    setRecommendations(rec.data || []);
    setSocialLinks(sl.data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const updateContent = async (id: string, valuePt: string, valueEn: string) => {
    const { error } = await supabase.from("site_content").update({ value_pt: valuePt, value_en: valueEn, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) toast.error(error.message); else toast.success("Salvo!");
  };

  // Projects CRUD
  const addProject = async () => {
    const { error } = await supabase.from("projects").insert({ title_pt: "Novo Projeto", title_en: "New Project", sort_order: projects.length });
    if (error) toast.error(error.message); else fetchAll();
  };
  const updateProject = async (id: string, data: Partial<Project>) => {
    const { error } = await supabase.from("projects").update(data).eq("id", id);
    if (error) toast.error(error.message); else toast.success("Salvo!");
  };
  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  // Certificates CRUD
  const addCertificate = async () => {
    const { error } = await supabase.from("certificates").insert({ name_pt: "Novo Certificado", name_en: "New Certificate", sort_order: certificates.length });
    if (error) toast.error(error.message); else fetchAll();
  };
  const updateCertificate = async (id: string, data: Partial<Certificate>) => {
    const { error } = await supabase.from("certificates").update(data).eq("id", id);
    if (error) toast.error(error.message); else toast.success("Salvo!");
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
    if (error) toast.error(error.message); else toast.success("Salvo!");
  };
  const deleteRecommendation = async (id: string) => {
    const { error } = await supabase.from("recommendations").delete().eq("id", id);
    if (error) toast.error(error.message); else fetchAll();
  };

  // Social links CRUD
  const updateSocialLink = async (id: string, data: Partial<SocialLink>) => {
    const { error } = await supabase.from("social_links").update(data).eq("id", id);
    if (error) toast.error(error.message); else toast.success("Salvo!");
  };

  // Image upload
  const uploadImage = async (file: File, path: string) => {
    const { data, error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); return null; }
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(data.path);
    return urlData.publicUrl;
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
          <TabsList className="mb-6">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="certificates">Certificados</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {content.map((item) => (
              <div key={item.id} className="border border-border rounded-xl p-6 space-y-4">
                <p className="font-semibold text-primary capitalize">{item.key}</p>
                <div>
                  <label className="text-sm text-muted-foreground">🇧🇷 Português</label>
                  <Textarea defaultValue={item.value_pt} onBlur={(e) => updateContent(item.id, e.target.value, item.value_en)} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">🇺🇸 English</label>
                  <Textarea defaultValue={item.value_en} onBlur={(e) => updateContent(item.id, item.value_pt, e.target.value)} />
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Button onClick={addProject} size="sm"><Plus size={16} /> Adicionar Projeto</Button>
            {projects.map((p) => (
              <div key={p.id} className="border border-border rounded-xl p-6 space-y-3">
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
              </div>
            ))}
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <Button onClick={addCertificate} size="sm"><Plus size={16} /> Adicionar Certificado</Button>
            {certificates.map((c) => (
              <div key={c.id} className="border border-border rounded-xl p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    <Input placeholder="Nome PT" defaultValue={c.name_pt} onBlur={(e) => updateCertificate(c.id, { name_pt: e.target.value })} />
                    <Input placeholder="Name EN" defaultValue={c.name_en} onBlur={(e) => updateCertificate(c.id, { name_en: e.target.value })} />
                    <Input placeholder="Instituição PT" defaultValue={c.institution_pt} onBlur={(e) => updateCertificate(c.id, { institution_pt: e.target.value })} />
                    <Input placeholder="Institution EN" defaultValue={c.institution_en} onBlur={(e) => updateCertificate(c.id, { institution_en: e.target.value })} />
                    <Input placeholder="Ano" defaultValue={c.year || ""} onBlur={(e) => updateCertificate(c.id, { year: e.target.value })} />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteCertificate(c.id)}><Trash2 size={16} className="text-destructive" /></Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Button onClick={addRecommendation} size="sm"><Plus size={16} /> Adicionar Recomendação</Button>
            {recommendations.map((r) => (
              <div key={r.id} className="border border-border rounded-xl p-6 space-y-3">
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
            {socialLinks.map((s) => (
              <div key={s.id} className="border border-border rounded-xl p-6 space-y-3">
                <p className="font-semibold">{s.platform}</p>
                <Input placeholder="URL" defaultValue={s.url} onBlur={(e) => updateSocialLink(s.id, { url: e.target.value })} />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
