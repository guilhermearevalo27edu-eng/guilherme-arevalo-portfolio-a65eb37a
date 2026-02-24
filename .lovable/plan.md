

# Corrigir texto do Hero e recarregamento ao editar

## Problema 1: Texto do Hero nao editavel
O texto "Criador do Guata, idealizador do Descubra Mato Grosso do Sul..." esta escrito diretamente no codigo do `HeroSection.tsx`. Ele nao vem do banco de dados, por isso nao aparece no admin para editar.

**Solucao:**
- Criar uma chave `tagline` na tabela `site_content` (via insert, nao migration) com o texto atual em PT e EN
- Modificar `HeroSection.tsx` para buscar `getContent("tagline")` em vez do texto fixo
- O campo ja vai aparecer automaticamente no admin porque ele exibe todos os itens de `site_content`

## Problema 2: Formulario "recarrega" ao editar
Toda vez que voce clica fora de um campo, o sistema salva, busca tudo de novo e incrementa a `version`. Isso faz o React destruir e recriar TODOS os campos do formulario, causando um "flash" que parece recarregamento de pagina. Isso atrapalha a edicao de varios campos seguidos.

**Solucao:**
- Remover o `fetchAll()` de dentro das funcoes de update (`updateContentField`, `updateProject`, etc.)
- Em vez disso, atualizar o estado local diretamente apos salvar com sucesso
- Manter `fetchAll()` apenas para operacoes de adicionar/deletar e upload de imagens
- Isso elimina o "flash" porque os campos nao sao remontados

## Arquivos modificados

### `src/pages/AdminDashboard.tsx`
- `updateContentField`: apos salvar, atualizar o array `content` no estado local em vez de chamar `fetchAll()`
- `updateProject`: atualizar o array `projects` no estado local
- `updateMedia`: atualizar o array `projectMedia` no estado local
- `updateCertificate`: atualizar o array `certificates` no estado local
- `updateRecommendation`: atualizar o array `recommendations` no estado local
- `updateSocialLink`: atualizar o array `socialLinks` no estado local

### `src/components/sections/HeroSection.tsx`
- Substituir o `t("Criador do Guata...")` por `getContent("tagline")` com fallback para o texto atual

### Insercao no banco de dados
- Inserir registro na tabela `site_content` com key `tagline`, contendo o texto em portugues e ingles

## O que NAO muda
- Fotos, certificados, redes sociais continuam funcionando
- Adicionar/deletar itens continua chamando `fetchAll()` normalmente
- O site publico nao e afetado
