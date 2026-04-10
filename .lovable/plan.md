

# Remover marcas do Lovable do site publicado

## O que precisa ser feito

### 1. Esconder o badge "Edit with Lovable" (canto inferior direito)
O badge está ativo. Vou usar a ferramenta `set_badge_visibility` para escondê-lo. Isso requer plano Pro ou superior.

### 2. Trocar o favicon (ícone na aba do navegador)
O site está usando o favicon padrão do Lovable. Vou adicionar um favicon personalizado com suas iniciais "GA" (que já é o logo do seu site).

### 3. Atualizar o título e metadados do site
O `index.html` ainda tem:
- Título: "Lovable App" → trocar para "Guilherme Arevalo"
- Author: "Lovable" → trocar para "Guilherme Arevalo"
- Twitter site: "@Lovable" → remover
- og:title e og:description com texto genérico do Lovable → atualizar

## Detalhes técnicos

### Badge
- Chamar `set_badge_visibility(hide_badge: true)`

### Favicon
- Criar um favicon SVG simples com "GA" no estilo do logo do site (fundo escuro, texto verde)
- Adicionar a referência no `index.html`

### index.html
- Atualizar `<title>`, meta author, og:title, og:description, twitter tags com informações do seu portfólio

## Observação
- Esconder o badge requer que você esteja no plano Pro ou superior do Lovable

