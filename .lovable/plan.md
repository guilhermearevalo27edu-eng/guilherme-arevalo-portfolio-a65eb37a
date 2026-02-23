

# Plano: Corrigir campos que nao atualizam apos salvar

## Problema encontrado

O formulario do admin usa `defaultValue` nos campos de texto. Em React, `defaultValue` so define o valor na primeira renderizacao. Quando voce salva e o `fetchAll()` busca os dados novos do banco, o React atualiza o estado interno, mas os campos de texto continuam mostrando o valor antigo porque o `defaultValue` nao forca atualizacao.

Resultado: voce edita, clica fora, aparece "Salvo!", mas o campo continua com o texto antigo. Parece que nao salvou.

## Solucao

Adicionar uma prop `key` dinamica nos containers dos campos que muda quando os dados sao atualizados. Isso forca o React a destruir e recriar os inputs com os valores novos.

### Arquivo: `src/pages/AdminDashboard.tsx`

**Mudanca 1 - Campos de conteudo (about, bio, tagline, etc.):**
- Trocar `key={item.id}` por `key={item.id + item.updated_at}` no mapeamento dos itens de conteudo
- Isso garante que ao salvar (que atualiza `updated_at`), os campos sao recriados com os valores novos

**Mudanca 2 - Projetos, certificados, recomendacoes, redes sociais:**
- Aplicar a mesma logica com `key` baseado em `created_at` ou outro campo que mude
- Para projetos: `key={p.id + p.title_pt}` (ou usar um contador de versao)

**Alternativa mais simples (escolhida):**
- Adicionar um estado `version` que incrementa apos cada `fetchAll()`
- Usar `key={item.id + "-" + version}` em todos os formularios
- Uma unica mudanca resolve todos os campos de uma vez

### Resumo
- 1 arquivo modificado (`AdminDashboard.tsx`)
- Adicionar estado `version` e usar como parte do `key` dos formularios
- Nenhuma mudanca no banco de dados
- Nao mexe em nada que ja funciona

