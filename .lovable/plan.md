

# Tagline editavel e controle de visibilidade das secoes

## Problema 1: Tagline nao aparece no admin
O registro `tagline` foi inserido no banco de dados, mas pode nao estar aparecendo na aba "Conteudo" do admin. Vou garantir que ele apareca com um label mais claro ("Tagline do Hero") em vez de apenas "tagline".

**Verificacao:** O campo ja deveria aparecer na aba "Conteudo" junto com os outros campos (about, bio, etc.). Vou adicionar um mapa de labels amigaveis para que os nomes dos campos sejam mais claros no admin.

## Problema 2: Desativar secoes do portfolio

Adicionar toggles (botoes liga/desliga) no admin para controlar quais secoes aparecem na pagina inicial.

### Como vai funcionar

1. **Banco de dados**: Inserir registros na tabela `site_content` com chaves como:
   - `section_work` (Projetos)
   - `section_certificates` (Certificados)
   - `section_recommendations` (Recomendacoes)
   - `section_about` (Sobre Mim)
   - `section_contact` (Contato)
   
   Os valores serao "true" ou "false" (string).

2. **Admin (`AdminDashboard.tsx`)**: 
   - Adicionar uma nova aba "Visibilidade" (ou colocar no topo da aba "Conteudo")
   - Mostrar um Switch (toggle) para cada secao
   - Ao clicar, atualiza o valor no banco entre "true" e "false"

3. **Pagina inicial (`Index.tsx`)**:
   - Buscar os dados de `site_content` 
   - Renderizar cada secao condicionalmente baseado no valor do toggle

4. **Labels amigaveis no admin**:
   - Adicionar um dicionario que traduz as chaves tecnicas para nomes legiveis:
     - `tagline` -> "Tagline (Hero)"
     - `about` -> "Sobre Mim (texto)"
     - `bio` -> "Bio (curta)"
     - `about_title` -> "Titulo Sobre Mim"

## Arquivos modificados

### Banco de dados (insercao)
- Inserir 5 registros em `site_content` com as chaves de visibilidade, todos com valor "true" por padrao

### `src/pages/AdminDashboard.tsx`
- Adicionar mapa de labels amigaveis para os campos de conteudo
- Adicionar secao de toggles de visibilidade na aba "Conteudo" (usando o componente Switch)
- Filtrar as chaves `section_*` para nao aparecerem como campos de texto editavel

### `src/pages/Index.tsx`
- Buscar `site_content` do banco
- Condicionar a renderizacao de cada secao ao valor do toggle correspondente

### `src/components/sections/HeroSection.tsx`
- Nenhuma mudanca (ja usa `getContent("tagline")`)

## O que NAO muda
- Nenhuma secao some por padrao (tudo comeca ativado)
- Fotos, redes sociais, projetos continuam funcionando normalmente
- O admin continua salvando sem recarregar a pagina
