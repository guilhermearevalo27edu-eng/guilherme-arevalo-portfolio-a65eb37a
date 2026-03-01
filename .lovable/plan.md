

# Corrigir bio do Hero, separar campos e esconder itens do menu

## Problema 1: Bio sumiu do Hero

O campo `tagline` no banco tem o valor "Turismo & Tecnologia" (que e o subtitulo pequeno acima do nome). O codigo do Hero usa `getContent("tagline")` para mostrar o texto longo abaixo do nome, entao ele mostra o texto curto em vez da bio completa.

**Solucao**: Separar em dois campos distintos:
- `tagline` continua sendo o subtitulo curto ("Turismo & Tecnologia") -- ja usado na linha acima do nome
- Criar um novo campo `hero_bio` para o texto longo que aparece abaixo do nome

Isso evita confusao e permite editar cada texto independentemente.

### Mudancas:
- **Banco de dados**: Inserir novo registro `hero_bio` com o texto longo da bio do Hero (o texto original que sumiu)
- **HeroSection.tsx**: Mudar de `getContent("tagline")` para `getContent("hero_bio")` na linha do paragrafo abaixo do nome. Usar `getContent("tagline")` no subtitulo acima do nome (onde hoje esta hardcoded "Turismo & Tecnologia")
- **AdminDashboard.tsx**: Adicionar label amigavel `hero_bio: "Bio do Hero (texto abaixo do nome)"`

## Problema 2: Menu nao esconde secoes desativadas

Quando voce desativa "Certificados" ou "Recomendacoes" no admin, eles somem da pagina mas continuam aparecendo no menu de navegacao.

**Solucao**: O Navbar vai buscar os dados de `site_content` e esconder os itens de menu das secoes desativadas.

### Mudancas:

**`src/components/Navbar.tsx`**:
- Adicionar `useQuery` para buscar `site_content`
- Criar mapa de secao para item do menu: `about` -> `section_about`, `work` -> `section_work`, etc.
- Filtrar os `navItems` para remover os que estao com valor "false"
- Manter "Home" sempre visivel (nao tem toggle)

## Problema 3: Label do tagline no admin

Atualizar os labels amigaveis para ficarem mais claros:
- `tagline` -> "Subtitulo do Hero (acima do nome)"
- `hero_bio` -> "Bio do Hero (texto abaixo do nome)"

## Arquivos modificados

1. **Banco de dados** (insercao): Novo registro `hero_bio` com o texto bio original
2. **`src/components/sections/HeroSection.tsx`**: Usar `hero_bio` para o paragrafo e `tagline` para o subtitulo
3. **`src/components/Navbar.tsx`**: Filtrar itens do menu baseado nos toggles de visibilidade
4. **`src/pages/AdminDashboard.tsx`**: Atualizar labels amigaveis
5. **`src/pages/Index.tsx`**: Nenhuma mudanca necessaria (ja funciona)

## O que NAO muda
- Os toggles de visibilidade continuam funcionando como antes
- Todas as outras secoes do admin permanecem iguais
- Fotos e redes sociais nao sao afetadas
