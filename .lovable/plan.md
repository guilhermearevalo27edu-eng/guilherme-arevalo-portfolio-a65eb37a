

# Plano: Garantir que tudo funcione no Admin e Login

## O que ja esta pronto
- Conta admin criada com email `guilhermearevalo27@gmail.com` e senha temporaria `TrocarSenha123!`
- Role admin atribuida no banco
- Edge function `setup-admin` funcionando
- Login com fluxo de troca de senha obrigatoria implementado
- Painel admin com abas para Conteudo, Projetos, Certificados, Recomendacoes e Redes Sociais
- Secao de midia/imprensa dentro dos projetos
- WorkSection com modal para exibir midias
- AboutSection buscando conteudo dinamico

## O que precisa ser feito

### 1. Inserir registros iniciais no `site_content`
O AboutSection busca as chaves `about_title` e `profile_photo`, mas elas nao existem no banco. Sem elas, o titulo e a foto nao aparecem e nao podem ser editados pelo admin. Vou criar uma migracao SQL para inserir essas chaves com valores padrao.

### 2. Adicionar links sociais iniciais
A tabela `social_links` esta vazia. Vou inserir os links padrao (Instagram, LinkedIn, WhatsApp, Lattes, DescubraMS) para que o admin possa editar e eles aparecam no site. Tambem preciso adicionar um botao "Adicionar Link" no painel admin para redes sociais.

### 3. Corrigir o AdminDashboard — Redes Sociais
Atualmente a aba de Redes Sociais so permite editar links existentes, mas nao tem botao para adicionar ou remover. Vou adicionar funcionalidade completa de CRUD.

### 4. Garantir que o fluxo de login funcione corretamente
Revisar o AdminLogin para confirmar que:
- Login com credenciais temporarias funciona
- Fluxo de troca de senha aparece
- Apos trocar senha, redireciona para o admin

---

## Resumo tecnico

1. **Migracao SQL**: Inserir `about_title` e `profile_photo` na tabela `site_content`, e links sociais iniciais na `social_links`
2. **AdminDashboard**: Adicionar botoes de adicionar/remover na aba de Redes Sociais
3. **Verificacao**: Testar login e fluxo completo

