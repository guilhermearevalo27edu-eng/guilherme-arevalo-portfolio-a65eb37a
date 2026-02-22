

# Plano: Corrigir todos os problemas reportados

## Problemas identificados e solucoes

### 1. "About" e "Bio" nao atualizam na pagina
**Causa**: O `AboutSection` usa `useQuery` com cache do React Query, mas o admin atualiza o banco sem invalidar esse cache. Alem disso, o AboutSection busca a chave `"bio"` para o texto, mas o conteudo mais detalhado esta na chave `"about"`. Preciso garantir que o AboutSection use as chaves corretas e que o cache seja invalidado (ou use `refetchOnWindowFocus: true`).

**Solucao**: Adicionar `refetchOnWindowFocus: true` e `staleTime: 0` nas queries do site publico para que ao voltar do admin os dados atualizem automaticamente.

### 2. Certificados — permitir upload de imagem do certificado
**Causa**: A tabela `certificates` nao tem coluna para imagem. O visual atual e apenas texto.

**Solucao**: 
- Criar migracao SQL adicionando coluna `image_url` na tabela `certificates`
- No AdminDashboard, adicionar campo de upload de imagem no formulario de certificados
- No CertificatesSection, exibir a imagem do certificado quando disponivel (como um card com imagem clicavel)

### 3. Foto do perfil so aparece no "Sobre Mim", nao no Hero
**Causa**: O `HeroSection` tem um placeholder fixo ("Sua foto aqui") e nao busca a foto do banco. Alem disso, so existe uma chave `profile_photo` no banco.

**Solucao**: 
- Adicionar nova chave `hero_photo` no `site_content` para a foto do Hero
- No AdminDashboard, adicionar campo de upload para "Foto do Hero" separado da "Foto de Perfil"
- No HeroSection, buscar `hero_photo` do banco e exibir a imagem

### 4. Redes sociais — links nao funcionam
**Causa**: Os links no banco estao sem `https://` no inicio (ex: `www.linkedin.com/...` em vez de `https://www.linkedin.com/...`). O componente `SocialLinks` usa `<a href={link.url}>`, que sem protocolo nao funciona.

**Solucao**: No componente `SocialLinks`, adicionar logica para prefixar `https://` caso a URL nao comece com `http`.

### 5. "Vamos Conversar?" nao e editavel
**Causa**: O email e o texto da secao de contato estao hardcoded no `ContactSection.tsx`. Nao existe campo no admin para editar.

**Solucao**: 
- Adicionar chaves `contact_email` e `contact_text` no `site_content`
- No AdminDashboard, elas ja aparecerao automaticamente na aba Conteudo
- No ContactSection, buscar esses valores do banco

### 6. "Direitos reservados" — ano nao editavel
**Causa**: O ano esta usando `new Date().getFullYear()` automaticamente (ja e dinamico, muda sozinho). Mas o texto "Guilherme Arevalo" esta hardcoded.

**Solucao**: 
- Adicionar chave `footer_name` no `site_content` para o nome do rodape
- O ano ja e automatico, mas vou deixar editavel tambem se quiser personalizar

---

## Resumo tecnico das mudancas

### Banco de dados (migracao SQL)
- Adicionar coluna `image_url TEXT` na tabela `certificates`
- Inserir novas chaves no `site_content`: `hero_photo`, `contact_email`, `contact_text`, `footer_name`

### Arquivos a modificar
1. **`src/components/sections/HeroSection.tsx`** — buscar `hero_photo` e `tagline` do banco
2. **`src/components/sections/AboutSection.tsx`** — adicionar `refetchOnWindowFocus` para resolver cache
3. **`src/components/sections/ContactSection.tsx`** — buscar email e texto do banco
4. **`src/components/sections/CertificatesSection.tsx`** — exibir imagem do certificado
5. **`src/components/SocialLinks.tsx`** — corrigir URLs sem protocolo
6. **`src/pages/AdminDashboard.tsx`** — adicionar upload de foto do Hero, upload de imagem do certificado, e garantir que as novas chaves aparecam na aba Conteudo

### Total: 1 migracao + 6 arquivos modificados

