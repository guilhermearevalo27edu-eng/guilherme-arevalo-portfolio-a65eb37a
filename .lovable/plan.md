

# Plano: Conta Admin + Seção de Midia/Imprensa nos Projetos

## Parte 1 — Criar sua conta admin

Vou criar uma edge function chamada `setup-admin` que faz o seguinte:
1. Cria um usuario com o email `guilhermearevalo27@gmail.com` e uma senha temporaria
2. Atribui a role `admin` na tabela `user_roles`
3. Ao fazer login pela primeira vez, o painel vai mostrar um aviso para trocar a senha

Na pagina de login, vou adicionar um fluxo de "troca de senha obrigatoria" para que voce defina sua propria senha ao entrar pela primeira vez.

---

## Parte 2 — Expandir Projetos com Midia/Imprensa

Sobre sua pergunta: **sim, adicionar midia e imprensa e uma otima ideia para marca pessoal**. Nao vai poluir — pelo contrario, mostra credibilidade. A chave e organizar bem.

### O que vou fazer:

Adicionar uma nova tabela `project_media` para anexar midias aos projetos (materia de jornal, radio, etc.):

- `id`, `project_id` (referencia ao projeto), `title_pt`, `title_en`, `description_pt`, `description_en`, `media_url` (link da imagem/print), `external_url` (link da materia original), `media_type` (jornal, radio, tv, online), `sort_order`

### Na pagina publica:
- Cada projeto tera um botao "Ver na midia" que abre um modal/accordion mostrando as materias relacionadas (print + descricao + link)
- Visual limpo, so aparece se o projeto tiver midias cadastradas

### No painel admin:
- Dentro de cada projeto, uma subsecao "Midia/Imprensa" onde voce pode adicionar prints de jornal, links de materias, descricoes

---

## Parte 3 — Melhorias na Bio (About)

Vou tornar a secao About editavel pelo admin tambem, buscando o conteudo da tabela `site_content`. Vou adicionar suporte para foto de perfil via upload no admin.

---

## Resumo tecnico

1. **Edge function `setup-admin`**: cria usuario + atribui role admin via service role key
2. **Migracao SQL**: nova tabela `project_media` com RLS (leitura publica, edicao admin)
3. **AdminDashboard**: subsecao de midia dentro de cada projeto + upload de imagens
4. **WorkSection**: modal/expandir para mostrar midias do projeto
5. **AdminLogin**: fluxo de troca de senha na primeira entrada
6. **AboutSection**: buscar bio da tabela `site_content` + campo de upload de foto no admin

