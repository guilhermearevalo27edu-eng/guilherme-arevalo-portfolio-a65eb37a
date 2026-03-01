

# Corrigir tagline do Hero e adicionar controle de visibilidade

## Problema 1: Texto bio sumiu do Hero

O campo `tagline` no banco esta com o valor errado: "Turismo & Tecnologia" (que e o subtitulo pequeno, nao a bio). Por isso, o texto longo que aparecia abaixo do seu nome sumiu -- o codigo usa `getContent("tagline")` e como retorna "Turismo & Tecnologia", ele substitui a bio inteira.

**Solucao:**
- Atualizar o valor do `tagline` no banco para o texto correto (a bio longa do Hero)
- Adicionar labels amigaveis no admin para que os campos fiquem claros:
  - `tagline` -> "Texto do Hero (abaixo do nome)"
  - `about` -> "Sobre Mim (texto completo)"
  - `bio` -> "Bio (texto curto)"
  - `about_title` -> "Titulo da secao Sobre"
  - `contact_email` -> "Email de contato"
  - `contact_text_pt` -> "Texto de contato"
  - `footer_name` -> "Nome no rodape"

## Problema 2: Ativar/desativar secoes do site

Adicionar toggles (liga/desliga) no admin para controlar quais secoes aparecem no site.

### Como vai funcionar

1. **Banco de dados**: Inserir 5 registros em `site_content`:
   - `section_about` = "true"
   - `section_work` = "true"
   - `section_certificates` = "true"
   - `section_recommendations` = "true"
   - `section_contact` = "true"

2. **Admin**: Adicionar uma secao "Visibilidade das Secoes" no topo da aba "Conteudo" com switches para cada secao. Ao clicar, alterna entre "true" e "false" no banco.

3. **Pagina inicial**: Buscar `site_content` e renderizar cada secao apenas se o toggle correspondente estiver "true".

## Detalhes tecnicos

### Banco de dados
- Atualizar valor do registro `tagline` para o texto bio correto
- Inserir 5 registros de visibilidade com valor "true"

### `src/pages/AdminDashboard.tsx`
- Importar o componente `Switch`
- Criar mapa de labels amigaveis (dicionario chave -> nome legivel)
- Filtrar chaves `section_*` para nao aparecerem como campos de texto
- Adicionar secao de toggles usando Switch para cada secao
- Usar o label amigavel em vez de `item.key` nos campos de conteudo

### `src/pages/Index.tsx`
- Buscar dados de `site_content` com useQuery
- Criar funcao `getContent(key)`
- Condicionar cada secao: `{getContent("section_work") !== "false" && <WorkSection />}`

### `src/components/sections/HeroSection.tsx`
- Nenhuma mudanca necessaria (ja usa `getContent("tagline")`)

## O que NAO muda
- Todas as secoes comecam ativadas por padrao
- Fotos, redes sociais, projetos continuam funcionando
- O formulario continua salvando sem recarregar
