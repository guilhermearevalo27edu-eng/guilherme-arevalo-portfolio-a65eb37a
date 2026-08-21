import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMustChangePassword(true);
        toast.info("Defina sua nova senha.");
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Digite seu email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Enviamos um link de redefinição para o seu email.");
    setShowReset(false);
  };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    // Check if user is admin
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (!isAdmin) {
      await supabase.auth.signOut();
      toast.error("Acesso negado. Apenas administradores podem acessar.");
      setLoading(false);
      return;
    }
    // Check if must change password
    if (signInData.user?.user_metadata?.must_change_password) {
      setMustChangePassword(true);
      setLoading(false);
      return;
    }
    navigate("/admin");
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      data: { must_change_password: false },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Senha atualizada com sucesso!");
      navigate("/admin");
    }
    setLoading(false);
  };

  if (mustChangePassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-bold text-center mb-2">Trocar Senha</h1>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Defina sua nova senha para continuar.
          </p>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              type="password"
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Nova Senha"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (showReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-bold text-center mb-2">Recuperar Senha</h1>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Digite seu email e enviaremos um link para redefinir a senha.
          </p>
          <form onSubmit={handleResetRequest} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
          </form>
          <button
            type="button"
            onClick={() => setShowReset(false)}
            className="block w-full text-center mt-4 text-sm text-muted-foreground hover:text-primary"
          >
            ← Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-bold text-center mb-8">Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setShowReset(true)}
          className="block w-full text-center mt-4 text-sm text-muted-foreground hover:text-primary"
        >
          Esqueci minha senha
        </button>

        <a href="/" className="block text-center mt-4 text-sm text-muted-foreground hover:text-primary">
          ← Voltar ao portfólio
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;
