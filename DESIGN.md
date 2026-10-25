---
name: Repete Hábito
description: Rotina de exercício leve e tolerante a falhas; marcar o dia em um toque.
colors:
  bg: '#ffffff'
  surface: '#f2f4ee'
  text: '#2c2e2a'
  text-muted: '#5d5f59'
  shell: '#8ed462'
  on-shell: '#2c2e2a'
  primary: '#2c2e2a'
  on-primary: '#ffffff'
  danger: '#b3261e'
  border: '#767a70'
  focus: '#2c2e2a'
  capsule-yellow: '#f5e211'
  capsule-coral: '#ff705d'
  capsule-blue: '#2ba0ff'
  capsule-lilac: '#ebc1ff'
  on-capsule: '#2c2e2a'
  chip: '#ffffff'
  dark-bg: '#1a1c19'
  dark-surface: '#242722'
  dark-text: '#f2f3ee'
  dark-text-muted: '#b5b8ae'
  dark-shell: '#3d6b28'
  dark-on-shell: '#f2f3ee'
  dark-primary: '#f2f3ee'
  dark-on-primary: '#2c2e2a'
  dark-danger: '#ff8a80'
  dark-border: '#8b8f84'
  dark-focus: '#f2f3ee'
typography:
  display:
    fontFamily: "'Archivo Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: '3rem'
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: '-0.04em'
  headline:
    fontFamily: "'Archivo Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: '2.25rem'
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: '-0.04em'
  title:
    fontFamily: "'Archivo Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1.5rem'
    fontWeight: 800
    lineHeight: 1.333
    letterSpacing: '-0.01em'
  title-sm:
    fontFamily: "'Archivo Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1.25rem'
    fontWeight: 800
    lineHeight: 1.4
    letterSpacing: '-0.01em'
  lead:
    fontFamily: "'Archivo Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1.125rem'
    fontWeight: 600
    lineHeight: 1.556
  body:
    fontFamily: "'Archivo Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1rem'
    fontWeight: 450
    lineHeight: 1.5
  meta:
    fontFamily: "'Archivo Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: '0.875rem'
    fontWeight: 450
    lineHeight: 1.429
  label:
    fontFamily: "'Archivo Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1rem'
    fontWeight: 700
    lineHeight: 1.5
  label-nav:
    fontFamily: "'Archivo Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: '0.75rem'
    fontWeight: 600
    lineHeight: 1.333
rounded:
  md: '0.75rem'
  lg: '1.25rem'
  full: '9999px'
spacing:
  gutter: '1.25rem'
  touch: '2.75rem'
  row: '4.5rem'
  nav-tab: '3.5rem'
  content-max: '42rem'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.label}'
    rounded: '{rounded.full}'
    padding: '0 1.25rem'
    height: '{spacing.touch}'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.text}'
    typography: '{typography.label}'
    rounded: '{rounded.full}'
    padding: '0 1.25rem'
    height: '{spacing.touch}'
  button-secondary-hover:
    backgroundColor: '{colors.surface}'
  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.text}'
    typography: '{typography.label}'
    rounded: '{rounded.full}'
    padding: '0 1.25rem'
    height: '{spacing.touch}'
  button-ghost-hover:
    backgroundColor: '{colors.surface}'
  button-danger:
    backgroundColor: 'transparent'
    textColor: '{colors.danger}'
    typography: '{typography.label}'
    rounded: '{rounded.full}'
    padding: '0 1.25rem'
    height: '{spacing.touch}'
  button-chip:
    backgroundColor: '{colors.on-primary}'
    textColor: '{colors.primary}'
    rounded: '{rounded.full}'
    size: '2rem'
  mark-capsule:
    backgroundColor: '{colors.capsule-yellow}'
    textColor: '{colors.on-capsule}'
    typography: '{typography.label}'
    rounded: '{rounded.full}'
    padding: '0 3rem 0 1.25rem'
    height: '{spacing.touch}'
    width: '8rem'
  mark-capsule-done:
    padding: '0 1.25rem 0 3rem'
  mark-capsule-dot:
    backgroundColor: '{colors.chip}'
    rounded: '{rounded.full}'
    size: '2rem'
  switch:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.full}'
    height: '{spacing.touch}'
    width: '4.5rem'
  switch-checked:
    backgroundColor: '{colors.primary}'
  nav-tab:
    backgroundColor: 'transparent'
    textColor: '{colors.text-muted}'
    typography: '{typography.label-nav}'
    rounded: '{rounded.full}'
    height: '{spacing.nav-tab}'
  nav-tab-active:
    backgroundColor: '{colors.shell}'
    textColor: '{colors.on-shell}'
  lobe-header:
    backgroundColor: '{colors.shell}'
    textColor: '{colors.on-shell}'
    padding: '1.5rem 1.25rem 5rem'
  menu:
    backgroundColor: '{colors.bg}'
    textColor: '{colors.text}'
    rounded: '{rounded.lg}'
    padding: '0.375rem'
  menu-item:
    rounded: '{rounded.md}'
    padding: '0 0.75rem'
    height: '{spacing.touch}'
  menu-item-highlighted:
    backgroundColor: '{colors.surface}'
  dialog:
    backgroundColor: '{colors.bg}'
    textColor: '{colors.text}'
    rounded: '{rounded.lg}'
    padding: '1.25rem'
---

# Design System: Repete Hábito

## Overview

**Creative North Star: "Mapa do parque"**

O app empresta a linguagem de um mapa-guia de parque e a traduz para uma interface de uso diário (modo Operate): cor chapada, um verde que marca só a estrutura, cápsulas coloridas que identificam cada atividade e uma única grotesca com títulos grandes e justos. Quem usa encontra tudo antes de reparar no visual; navegação, formulários e menus seguem o padrão web, e o mundo aparece na tipografia, na paleta, na densidade e num gesto próprio, a cápsula de marcar.

A densidade é de lista de app: uma coluna de até 42rem, linhas de 72 px, alvos de toque de 44 px, ação principal ao alcance do polegar. O cabeçalho de Hoje e do Dashboard é um "lobo" verde de borda inferior orgânica; abaixo dele, o conteúdo é uma lista comum sobre fundo branco (ou grafite no tema escuro). Não há gradiente, textura nem sombra decorativa. O tom é calmo e sem cobrança: nada de chama de sequência, anel de progresso ou lista cinza de círculos de check.

O tema claro é o padrão. O escuro é uma tradução do mesmo mundo, não uma inversão: fundo grafite, lobo em verde escurecido, ação principal em tinta clara e as cápsulas com a mesma saturação e o mesmo texto escuro.

**Key Characteristics:**

- Cor chapada; o verde só em estrutura (lobo, aba ativa, seleção de texto).
- Cápsulas totalmente arredondadas para todo controle de ação.
- Uma grotesca variável (Archivo), títulos com entrelinha 0,95 e tracking −0,04em.
- O estado nunca depende só da cor: texto, posição do ponto e `aria-pressed`.
- Contraste AA garantido por teste em todos os pares de token, nos dois temas.

## Colors

Paleta restrita aos tokens do tema (as cores padrão do Tailwind estão desligadas): neutros esverdeados de tinta e papel, um verde de estrutura e quatro cores de cápsula sempre com texto escuro.

### Primary

- **Tinta Grafite** (`primary`): a ação principal é uma cápsula em tinta, não em verde. Fundo do botão principal, do interruptor ligado e do miolo do rádio selecionado. No escuro vira **Tinta Clara** (`dark-primary`) com texto grafite (`dark-on-primary`).
- **Verde Parque** (`shell`): cor de estrutura. Preenche o lobo do cabeçalho, a aba ativa da navegação e a seleção de texto, sempre com texto `on-shell`. No escuro vira **Verde Musgo** (`dark-shell`) com texto claro.

### Secondary

As quatro cores de cápsula identificam atividades (atribuição automática por atividade, segundo o brief); o texto sobre elas é sempre `on-capsule` (grafite) e o ponto é sempre `chip` (branco), nos dois temas.

- **Amarelo Placa** (`capsule-yellow`): única cor de cápsula visível hoje, na linha de exemplo de Hoje.
- **Coral Quiosque** (`capsule-coral`), **Azul Lago** (`capsule-blue`), **Lilás Jardim** (`capsule-lilac`): definidas e com contraste testado, ainda sem uso em tela. Pelo brief, o lilás é também a cor da folga.

### Neutral

- **Papel Branco** (`bg`) / **Grafite Noite** (`dark-bg`): fundo da página, dos menus, diálogos e da barra de navegação.
- **Papel Sálvia** (`surface`) / `dark-surface`: hover de botões secundários e fantasmas, item realçado do menu, trilho do interruptor desligado e os filetes de 2 px que separam linhas e a navegação.
- **Tinta** (`text`) / `dark-text`: texto corrente, bordas de 2 px dos botões contornados, do interruptor, do menu e do diálogo.
- **Tinta Apagada** (`text-muted`) / `dark-text-muted`: linhas de apoio, descrições, rótulos de aba inativa, versão.
- **Cinza Trilha** (`border`) / `dark-border`: token de borda com 3:1 garantido; hoje usado na barra de rolagem.
- **Foco** (`focus`) / `dark-focus`: anel de foco, igual à tinta de cada tema.
- **Alerta** (`danger`) / `dark-danger`: texto e borda do botão destrutivo.

### Named Rules

**The Green Is Structure Rule.** O verde nunca é botão nem ação. Ele pinta regiões de estrutura (lobo, aba ativa, seleção); a ação principal é tinta.

**The Dark Text On Capsules Rule.** Toda cápsula colorida leva texto grafite e ponto branco, também no tema escuro. A cor só identifica a atividade; o estado está no texto e na posição do ponto.

**The Tested Pair Rule.** Um par texto × fundo só entra no sistema se estiver em `tests/unit/theme-contrast.test.ts` com 4,5:1 (texto) ou 3:1 (borda e foco) nos dois temas. Cores do tema ficam em `#rrggbb` para o teste conseguir ler.

## Typography

**Display Font:** Archivo Variable (com ui-sans-serif, system-ui, sans-serif)
**Body Font:** Archivo Variable (mesma família)

**Character:** uma grotesca de trabalho, servida pelo próprio app (`@fontsource-variable/archivo`, eixo de peso). O contraste vem de peso e tamanho: títulos em 800 bem justos, texto corrente em 450, rótulos em 600 a 700.

### Hierarchy

- **Display** (800, 3rem, 0,95, −0,04em): título do lobo ("Hoje", "Dashboard").
- **Headline** (800, 2.25rem, 0,95, −0,04em): título das telas sem lobo (Atividades, Ajustes, onboarding).
- **Title** (800, 1.5rem, −0,01em): título do estado vazio.
- **Title-sm** (800, 1.25rem, −0,01em): títulos de seção em Ajustes, título do diálogo; em 1.125rem no aviso de nova versão e no nome do app na barra do desktop.
- **Lead** (600, 1.125rem): frase-resumo do lobo, limitada a 22rem; nome da atividade na linha usa 700 com −0,01em.
- **Body** (450, 1rem, 1,5): texto corrente; descrições limitadas a 60ch.
- **Meta** (450, 0.875rem): linha de apoio da atividade e versão (com algarismos tabulares); a data do lobo usa 600.
- **Label** (700, 1rem): texto de botões e da cápsula. **Label-nav** (600, 0.75rem; 0.875rem a partir de 1024 px; 700 na aba ativa): rótulos da navegação.

### Named Rules

**The Tight Title Rule.** Títulos Display e Headline usam sempre o utilitário de título do mundo (800, entrelinha 0,95, tracking −0,04em). Títulos menores usam 800 com só −0,01em; o tracking extremo é reservado ao topo da tela.

**The One Family Rule.** Uma família só, em escala fixa de rem. Hierarquia por peso e tamanho, nunca por uma segunda fonte.

## Layout

Coluna única centralizada de até 42rem com respiro lateral de 1.25rem em todas as telas, do celular de 320 px ao desktop. No celular, a navegação de 4 abas (Hoje, Atividades, Dashboard, Ajustes) fica no rodapé, em grade de quatro colunas com abas de 56 px de altura; a partir de 1024 px ela sobe para uma barra no topo, com o nome do app à esquerda e abas em linha de 44 px.

O lobo ocupa a largura toda e carrega título, data e frase-resumo; seu conteúdo respeita a mesma coluna. Abaixo, seções empilham com ritmo vertical de 2rem; linhas de lista têm no mínimo 72 px (4.5rem), com nome e apoio à esquerda e a cápsula à direita, separadas por filetes de 2 px em `surface`. Ações do estado vazio empilham na largura toda no celular e ficam lado a lado a partir de 640 px. Todo alvo interativo mede pelo menos 44 × 44 px (verificado em teste).

## Elevation & Depth

O mundo é plano: profundidade vem de cor chapada e de filetes, não de sombra. Sombra existe só em três lugares funcionais: o ponto da cápsula (uma sombra mínima para destacá-lo da cor), e as camadas que flutuam sobre a página (menu, diálogo, aviso de nova versão), que também levam borda de 2 px em tinta. O diálogo escurece a página com um véu de tinta a 50%.

### Shadow Vocabulary

- **Ponto** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.25)`): só no ponto branco da cápsula de marcar.
- **Menu** (`box-shadow: 0 10px 24px -10px rgb(0 0 0 / 0.35)`): menu de ações suspenso.
- **Camada** (`box-shadow: 0 16px 40px -12px rgb(0 0 0 / 0.4)`): diálogo modal e aviso de nova versão.

### Named Rules

**The Flat Map Rule.** Superfícies em repouso não têm sombra, gradiente nem textura. Sombra só para o que flutua acima da página ou para o ponto da cápsula.

## Shapes

Três formas. **Cápsula** (totalmente arredondada) para tudo que se aperta: botões, cápsula de marcar, interruptor, abas da navegação, botão de fechar. **Cantos suaves** (1.25rem) para camadas flutuantes, menu, diálogo e aviso, e 0.75rem para os itens do menu. **Borda orgânica** só no lobo: um contorno inferior ondulado em SVG que se estica com a largura. O resto é retangular: linhas e seções não têm caixa, apenas filetes de 2 px. Contornos são sempre de 2 px.

## Components

### Buttons

Cápsulas firmes, de cor chapada e texto em negrito.

- **Shape:** cápsula (raio total), altura mínima de 44 px, 1.25rem de respiro lateral, sem quebra de linha.
- **Primary:** tinta com texto branco (no escuro, tinta clara com texto grafite). No hover escurece levemente (`brightness(0.95)`).
- **Secondary:** contorno de 2 px em tinta, fundo transparente; hover em `surface`.
- **Ghost:** sem contorno, texto em tinta; hover em `surface`.
- **Danger:** contorno e texto em `danger`; hover em `surface`.
- **Pressionado / Desabilitado:** desce 1 px ao apertar (150 ms, sem transição com movimento reduzido); desabilitado a 60% de opacidade.
- **Chip com seta:** os links com aparência de botão terminam num ponto redondo de 32 px com seta, em cor que contrasta com a cápsula (ponto branco com seta em tinta no principal; ponto em tinta com seta na cor do fundo no secundário e no fantasma; ponto em `danger` no destrutivo). Botões de ação comum não levam chip. Quando os botões empilham na largura toda no celular, o chip fica colado ao rótulo, no centro, e não na ponta direita (limite conhecido).

### Mark Capsule (gesto próprio)

A cápsula de marcar é a assinatura do mundo: 128 × 44 px, cor da atividade, texto grafite e um ponto branco de 32 px. Pendente, o texto "Marcar" fica à esquerda e o ponto à direita; ao marcar, o ponto atravessa para a esquerda em 250 ms com leve overshoot (`cubic-bezier(0.34, 1.25, 0.64, 1)`) e o texto vira "Feito" à direita. Com movimento reduzido a troca é instantânea. O estado está no texto, na posição do ponto e em `aria-pressed`; o nome acessível inclui o nome da atividade. Hoje aparece só na linha de exemplo (amarelo); folga em lilás está no brief, ainda não construída.

### Toggle (Switch)

Mesmo gesto da cápsula: trilho de 72 × 44 px com contorno de 2 px em tinta, `surface` desligado e tinta ligado; o ponto branco de 36 px, também contornado, atravessa para a direita com a mesma curva de 250 ms. O rótulo à esquerda também alterna.

### Radio

Círculo de 20 px com contorno de 2 px em tinta e miolo de 10 px em `primary` quando marcado; o alvo de toque é a linha inteira de 44 px, e o foco aparece no círculo.

### Cards / Containers

Não há cartões. Conteúdo vive em seções abertas sobre o fundo; só camadas flutuantes têm caixa (ver Menu e Dialog).

### Menu

Caixa em `bg` com contorno de 2 px em tinta, cantos de 1.25rem, sombra **Menu** e 0.375rem de respiro; itens de 44 px em 600, realçados com `surface` mais um anel de foco interno de 3 px.

### Dialog

Caixa centralizada de até 28rem com contorno de 2 px, cantos de 1.25rem, 1.25rem de respiro e sombra **Camada**; título em Title-sm; botão de fechar em cápsula de 44 px com ícone. O aviso de nova versão usa a mesma caixa, fixa acima da navegação, sem roubar o foco.

### Navigation

Barra em `bg` separada do conteúdo por filete de 2 px em `surface`. Abas com ícone de linha (lucide, traço 2.25, 20 px) e rótulo; inativa em `text-muted` (hover em `text`), ativa como cápsula preenchida em `shell` com texto `on-shell` em 700. Rodapé no celular, topo a partir de 1024 px.

### Lobe Header

Região de estrutura em `shell` com a borda inferior orgânica, usada só em Hoje e Dashboard. Leva o título Display, a data (0.875rem, 600) e a frase-resumo em Lead.

### Empty State

Título em Title, texto em `text-muted` até 60ch e ações que ensinam o próximo passo (botão principal e, quando houver, um secundário). Nunca só "nada aqui".

### Focus

Anel de 3 px em `focus` a 2 px de distância do elemento, com 3:1 garantido sobre `bg`, `surface` e `shell`.

## Do's and Don'ts

### Do:

- **Do** usar o verde (`shell`) só em estrutura: lobo, aba ativa, seleção de texto.
- **Do** fazer toda ação em cápsula de raio total com pelo menos 44 px de altura e texto em 700.
- **Do** mostrar o estado da cápsula no texto e na posição do ponto, além de `aria-pressed`; a cor só identifica a atividade.
- **Do** manter texto grafite e ponto branco em todas as cápsulas coloridas, também no tema escuro.
- **Do** usar o utilitário de título (800, 0,95, −0,04em) para Display e Headline, e −0,01em nos títulos menores.
- **Do** separar linhas e regiões com filetes de 2 px em `surface`, não com caixas.
- **Do** adicionar todo novo par texto × fundo ao teste de contraste, nos dois temas.
- **Do** dar a toda transição uma saída com movimento reduzido.

### Don't:

- **Don't** usar o verde como cor de botão ou de ação.
- **Don't** usar gradiente, textura ou sombra decorativa; sombra só no ponto da cápsula e em camadas flutuantes.
- **Don't** usar chama de sequência, anel de progresso ou lista cinza com círculos de check.
- **Don't** usar cores fora dos tokens do tema (as cores padrão do Tailwind estão desligadas).
- **Don't** transformar o lobo em layout: ele é só o cabeçalho de Hoje e do Dashboard.
- **Don't** introduzir uma segunda família tipográfica.

### Ainda não construído

Faz parte do mundo declarado, mas não existe no código; não trate como padrão disponível: cores de cápsula fora da linha de exemplo (coral, azul e lilás em uso real, folga em lilás), divisores orgânicos entre seções, contêiner da navegação em forma de cápsula, e o chip na ponta direita dos botões empilhados na largura toda.
