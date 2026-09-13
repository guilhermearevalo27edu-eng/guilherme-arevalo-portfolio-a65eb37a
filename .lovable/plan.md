# Recuperar senha, fotos mais rápidas, SEO e logo do Lovable

## 1. Voltar a entrar no admin
- Redefinir sua senha para uma temporária (`TrocarSenha123!`) para você conseguir entrar agora mesmo em `/login`; ao entrar, o site pede uma nova senha sua.
- Revisar o "Esqueci minha senha" para que o email de recuperação chegue e abra direto a tela de nova senha, sem depender de mim no futuro.

## 2. Fotos aparecendo na hora
Hoje as fotos só começam a carregar depois que o site pergunta ao banco quais são as imagens, e isso custa 2–4 segundos.
- Guardar essa consulta em cache por alguns minutos, em vez de refazê-la a cada visita/foco na janela.
- Pedir as fotos em versões redimensionadas (largura adequada), em vez do arquivo original inteiro.
- Marcar a foto principal como prioritária e abrir conexão antecipada com o servidor de imagens.
- Mostrar um espaço com fundo suave enquanto a imagem chega, para não haver "salto" na página.

## 3. SEO e busca por "turismólogo", "turismo"
- Usar seu nome completo, Guilherme Santos Arevalo, no título, na descrição e nos dados estruturados.
- Título e descrição focados em: turismólogo, turismo, Mato Grosso do Sul, Guatá, Descubra MS, tecnologia e turismo.
- Ficha de pessoa (dados estruturados) mais completa: nome completo, profissão de turismólogo, formação na UEMS, cidade/estado, redes sociais e seus projetos.
- Ajustar textos visíveis das seções para conterem naturalmente esses termos, sem inventar nada sobre você.
- Sitemap e robots revisados; `/admin` e `/login` continuam fora dos buscadores.
- Também deixa o site melhor compreendido por buscas com IA (ChatGPT, Perplexity), que leem esses mesmos dados.

## 4. Remover a logo do Lovable
- O ícone que aparece na aba do navegador ainda é o padrão do Lovable. Vou criar um ícone "GA" nas suas cores e usá-lo no lugar, apagando o antigo.
- Confirmar que o selo "Edit with Lovable" segue oculto no site publicado.

## Observações técnicas
- Reset de senha via edge function `setup-admin`; conferir `enable_email_auth` e o `redirectTo` de `resetPasswordForEmail`.
- React Query: `staleTime` ~5 min + `refetchOnWindowFocus: false` no `site_content` do Hero/About; imagens do Storage com `?width=&quality=`, `loading="eager"`/`fetchpriority="high"` no hero e `loading="lazy"` no resto; `<link rel="preconnect">` para o domínio de imagens em `index.html`.
- `index.html`: title/description/og/twitter + JSON-LD Person (`givenName`, `familyName`, `jobTitle`, `alumniOf`, `sameAs`, `address`).
- Favicon: gerar `public/favicon.png` (GA verde), referenciar em `index.html`, remover `public/favicon.ico`.
- Publicar no final — alterações de título/ícone só valem no domínio após publicar.
