

# Plano: Corrigir atualizacao de conteudo no site

## Problemas encontrados

### 1. Edicoes se sobrescrevem (problema principal)
O formulario do admin usa `onBlur` para salvar. Quando voce edita o campo Portugues e clica fora, ele salva o portugues mas usa o valor ANTIGO do ingles (da memoria local). Se depois voce edita o ingles e clica fora, ele salva o ingles mas sobrescreve o portugues com o valor antigo. Resultado: parece que nao salvou.

### 2. Campo "About" nao aparece no site
Existe um campo chamado "About" no admin com o texto detalhado, mas o site le apenas a chave "bio" (que tem o texto curto). O conteudo do "About" nunca e exibido.

---

## Solucao

### Arquivo: `src/pages/AdminDashboard.tsx`
- Corrigir o `updateContent` para buscar o valor atual do OUTRO campo no momento do blur, em vez de usar o valor antigo do estado. Alternativa mais robusta: atualizar apenas o campo que mudou (value_pt OU value_en), nao ambos ao mesmo tempo.
- Mudar o `onBlur` do Portugues para salvar SOMENTE `value_pt`, e o do Ingles para salvar SOMENTE `value_en`.
- Apos salvar, chamar `fetchAll()` para atualizar o estado local.

### Arquivo: `src/components/sections/AboutSection.tsx`
- Trocar `getContent("bio")` por `getContent("about")` para exibir o texto detalhado que voce editou no campo "About".
- Manter `getContent("about_title")` como esta (funciona corretamente).
- Usar "bio" apenas como fallback caso "about" esteja vazio.

### Resumo
- 2 arquivos modificados
- Nenhuma mudanca no banco de dados
- Nao mexe em nada que ja funciona (fotos, redes sociais, certificados, etc.)
