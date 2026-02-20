import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const email = "guilhermearevalo27@gmail.com";
    const tempPassword = "TrocarSenha123!";

    // Check if user already exists
    const { data: { users: existingUsers } } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.find((u: any) => u.email === email);

    let userId: string;

    if (existing) {
      userId = existing.id;
      // Reset password to temp
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: tempPassword,
        user_metadata: { must_change_password: true },
      });
      if (updateErr) throw updateErr;
    } else {
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { must_change_password: true },
        });
      if (createError) throw createError;
      userId = newUser.user.id;
    }

    // Ensure admin role exists
    const { data: existingRole } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!existingRole) {
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (roleError) throw roleError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Admin criado! Email: ${email} | Senha temporária: ${tempPassword}`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
