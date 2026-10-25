---
name: Repete Hábito
description: Rotina de exercício leve e tolerante a falhas; marcar o dia é colar uma figurinha.
colors:
  bg: '#ffffff'
  surface: '#eef0f6'
  text: '#16181d'
  text-muted: '#50555f'
  shell: '#1b3fbf'
  on-shell: '#ffffff'
  focus-on-shell: '#ffffff'
  primary: '#16181d'
  on-primary: '#ffffff'
  danger: '#b3261e'
  border: '#6b7180'
  focus: '#16181d'
  sticker-yellow: '#ffc20e'
  sticker-red: '#ff5a3c'
  sticker-green: '#00a65a'
  sticker-magenta: '#ff4fa3'
  sticker-cyan: '#00a3e0'
  on-sticker: '#16181d'
  sticker-edge: '#ffffff'
  rest: '#efe4ff'
  on-rest: '#3d2366'
  rest-border: '#8b6bb8'
  dark-bg: '#16181d'
  dark-surface: '#23262e'
  dark-text: '#f1f2f6'
  dark-text-muted: '#b3b8c4'
  dark-primary: '#f1f2f6'
  dark-on-primary: '#16181d'
  dark-danger: '#ff8a80'
  dark-border: '#8b909c'
  dark-focus: '#f1f2f6'
  dark-rest-border: '#b79ad6'
typography:
  display:
    fontFamily: "'Barlow Condensed', 'Barlow', ui-sans-serif, system-ui, sans-serif"
    fontSize: '4rem'
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: '-0.01em'
  headline:
    fontFamily: "'Barlow Condensed', 'Barlow', ui-sans-serif, system-ui, sans-serif"
    fontSize: '3rem'
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: '-0.01em'
  title-section:
    fontFamily: "'Barlow Condensed', 'Barlow', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1.5rem'
    fontWeight: 800
    lineHeight: 1.1
  title-section-sm:
    fontFamily: "'Barlow Condensed', 'Barlow', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1.25rem'
    fontWeight: 800
    lineHeight: 1.1
  sticker-numeral:
    fontFamily: "'Barlow Condensed', 'Barlow', ui-sans-serif, system-ui, sans-serif"
    fontSize: '2rem'
    fontWeight: 800
    lineHeight: 1
  sticker-numeral-slot:
    fontFamily: "'Barlow Condensed', 'Barlow', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1.375rem'
    fontWeight: 800
    lineHeight: 1
  lead:
    fontFamily: "'Barlow', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1.125rem'
    fontWeight: 700
    lineHeight: 1.556
  lead-lg:
    fontFamily: "'Barlow', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1.25rem'
    fontWeight: 700
    lineHeight: 1.4
  band-meta:
    fontFamily: "'Barlow', ui-sans-serif, system-ui, sans-serif"
    fontSize: '0.9375rem'
    fontWeight: 700
    lineHeight: 1.5
  body:
    fontFamily: "'Barlow', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1rem'
    fontWeight: 500
    lineHeight: 1.5
  meta:
    fontFamily: "'Barlow', ui-sans-serif, system-ui, sans-serif"
    fontSize: '0.875rem'
    fontWeight: 500
    lineHeight: 1.429
  label:
    fontFamily: "'Barlow', ui-sans-serif, system-ui, sans-serif"
    fontSize: '1rem'
    fontWeight: 700
    lineHeight: 1.5
  label-sticker:
    fontFamily: "'Barlow', ui-sans-serif, system-ui, sans-serif"
    fontSize: '0.8125rem'
    fontWeight: 700
    lineHeight: 1
  label-nav:
    fontFamily: "'Barlow', ui-sans-serif, system-ui, sans-serif"
    fontSize: '0.8125rem'
    fontWeight: 700
    lineHeight: 1.385
rounded:
  sm: '0.375rem'
  md: '0.625rem'
  lg: '1rem'
  full: '9999px'
spacing:
  gutter: '1.25rem'
  touch: '2.75rem'
  row: '5.75rem'
  nav-tab: '3.5rem'
  sticker-w: '4rem'
  sticker-h: '4.75rem'
  content-max: '42rem'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '0 1.25rem'
    height: '{spacing.touch}'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.text}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '0 1.25rem'
    height: '{spacing.touch}'
  button-secondary-hover:
    backgroundColor: '{colors.surface}'
  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.text}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '0 1.25rem'
    height: '{spacing.touch}'
  button-ghost-hover:
    backgroundColor: '{colors.surface}'
  button-danger:
    backgroundColor: 'transparent'
    textColor: '{colors.danger}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '0 1.25rem'
    height: '{spacing.touch}'
  sticker-slot:
    backgroundColor: 'transparent'
    textColor: '{colors.text}'
    typography: '{typography.sticker-numeral-slot}'
    rounded: '{rounded.md}'
    width: '{spacing.sticker-w}'
    height: '{spacing.sticker-h}'
  sticker-slot-hover:
    backgroundColor: '{colors.surface}'
  sticker:
    backgroundColor: '{colors.sticker-green}'
    textColor: '{colors.on-sticker}'
    typography: '{typography.sticker-numeral}'
    rounded: '{rounded.md}'
    width: '{spacing.sticker-w}'
    height: '{spacing.sticker-h}'
  switch:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.full}'
    height: '{spacing.touch}'
    width: '4.5rem'
  switch-checked:
    backgroundColor: '{colors.shell}'
  switch-thumb:
    backgroundColor: '{colors.sticker-edge}'
    rounded: '{rounded.full}'
    size: '2.25rem'
  nav-tab:
    backgroundColor: 'transparent'
    textColor: '{colors.text-muted}'
    typography: '{typography.label-nav}'
    rounded: '{rounded.md}'
    height: '{spacing.nav-tab}'
  nav-tab-active:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
  band-header:
    backgroundColor: '{colors.shell}'
    textColor: '{colors.on-shell}'
    padding: '1.5rem 1.25rem 1.75rem'
  menu:
    backgroundColor: '{colors.bg}'
    textColor: '{colors.text}'
    rounded: '{rounded.lg}'
    padding: '0.375rem'
  menu-item:
    typography: '{typography.label}'
    rounded: '{rounded.sm}'
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

**Creative North Star: "Álbum da semana"**

Marcar o dia é colar uma figurinha. O app empresta a linguagem do álbum de figurinhas de banca e a traduz para uma interface de uso diário (modo Operate): página branca, uma faixa azul chapada que marca a semana, figurinhas de cor chapada com borda de papel e numeral condensado, e títulos em caixa alta numa condensada pesada. O número da figurinha conta quantas vezes a pessoa apareceu naquela atividade e nunca volta a zero. Navegação, formulários, menus e diálogos seguem o padrão web; o mundo aparece no tipo, na paleta, na densidade e num gesto próprio, colar a figurinha.

A densidade é de lista de app: uma coluna de até 42rem, linhas de 92 px com a vaga ou figurinha à direita, alvos de toque de 44 px. Hoje e Álbum abrem com a faixa azul (a capa da página); abaixo dela, o conteúdo é uma lista aberta sobre fundo branco, separada por filetes de 2 px. Não há gradiente nem textura; a única sombra do mundo é o assentamento da figurinha. O tom é calmo e sem cobrança: nada de chama de sequência, anel de progresso ou lista cinza com círculos de check.

O tema claro é o padrão. O escuro é a mesma página em tinta: fundo #16181d, ação principal em tinta clara com texto escuro, e a faixa azul, as figurinhas e a borda de papel com os mesmos valores do claro.

**Key Characteristics:**

- Cor chapada; o azul só em estrutura (faixa da semana, interruptor ligado, seleção de texto).
- Figurinha de cor chapada, borda de papel de 4 px, numeral condensado em tinta, levemente torta (−2°).
- Barlow Condensed 800 em caixa alta para todo título e numeral; Barlow 500/700 para texto.
- Controles em retângulos de canto curto (0.625rem); só o interruptor e o rádio são redondos.
- O estado nunca depende só da cor: texto, forma (vaga tracejada × figurinha) e `aria-pressed`.
- Contraste AA garantido por teste em todos os pares de token, nos dois temas.

## Colors

Paleta restrita aos tokens do tema (as cores padrão do Tailwind estão desligadas): papel branco e tinta azulada, um azul álbum de estrutura, cinco cores de figurinha sempre com tinta escura e um lilás reservado à folga.

### Primary

- **Tinta Álbum** (`primary`): a ação principal é um bloco em tinta. Fundo do botão principal, da aba ativa da navegação e do miolo do rádio selecionado. No escuro vira **Tinta Clara** (`dark-primary`) com texto escuro (`dark-on-primary`).
- **Azul Álbum** (`shell`): cor de estrutura, igual nos dois temas. Preenche a faixa da semana no topo de Hoje e do Álbum, o trilho do interruptor ligado e a seleção de texto, sempre com texto `on-shell` (branco). Dentro da faixa o anel de foco troca para `focus-on-shell` (branco), porque a tinta não aparece sobre o azul.

### Secondary

As cinco cores de figurinha identificam atividades; o numeral e o texto sobre elas são sempre `on-sticker` (tinta) e a borda é sempre `sticker-edge` (papel branco), com os mesmos valores nos dois temas.

- **Verde Banca** (`sticker-green`): única cor de figurinha visível hoje, na figurinha de exemplo de Hoje.
- **Amarelo Capa** (`sticker-yellow`), **Vermelho Escudo** (`sticker-red`), **Magenta Brilho** (`sticker-magenta`), **Ciano Céu** (`sticker-cyan`): definidas e com contraste testado, ainda sem uso em tela.
- **Adaptação por contraste:** o vermelho e o magenta foram clareados em relação ao contrato da direção (#E8412C daria cerca de 4,4:1 com a tinta e #E5007E cerca de 3,9:1, abaixo de 4,5:1) para que o numeral em tinta passe AA. Os valores do frontmatter são os normativos.

### Tertiary

- **Lilás Folga** (`rest`, com texto `on-rest` e contorno `rest-border` / `dark-rest-border`): a vaga de folga, impressa na página. Tokens prontos e testados; o componente ainda não existe. Também adaptado por contraste: o fundo é um pouco mais saturado que o do contrato (#F3E8FF) para dar 4,5:1 com `on-rest`, e o contorno é mais escuro no claro, para chegar a 3:1 sobre o papel branco; no escuro o contorno é o lilás claro do contrato.

### Neutral

- **Papel Branco** (`bg`) / **Tinta Noite** (`dark-bg`): fundo da página, dos menus, diálogos e da barra de navegação.
- **Papel Azulado** (`surface`) / `dark-surface`: hover de botões secundários, fantasmas e da vaga pendente, item realçado do menu, trilho do interruptor desligado e os filetes de 2 px que separam linhas, seções e a navegação.
- **Tinta** (`text`) / `dark-text`: texto corrente, bordas de 2 px dos botões contornados, da vaga tracejada, do interruptor, do rádio, do menu e do diálogo; véu do diálogo a 50%.
- **Tinta Apagada** (`text-muted`) / `dark-text-muted`: descrições, linhas de apoio, rótulos de aba inativa, versão.
- **Cinza Régua** (`border`) / `dark-border`: token de borda com 3:1 garantido; contorno tracejado das vagas decorativas da página vazia do Álbum e barra de rolagem.
- **Foco** (`focus`) / `dark-focus`: anel de foco, igual à tinta de cada tema.
- **Alerta** (`danger`) / `dark-danger`: texto e borda do botão destrutivo.

### Named Rules

**The Blue Is Structure Rule.** O azul nunca é botão nem ação. Ele pinta a faixa da semana, o trilho do interruptor ligado e a seleção; a ação principal é tinta, e a aba ativa é um bloco em tinta.

**The Ink On Stickers Rule.** Toda figurinha leva numeral e texto em tinta (`on-sticker`) e borda de papel branca, nos dois temas. A cor só identifica a atividade; o estado está no texto, na forma e em `aria-pressed`.

**The Tested Pair Rule.** Um par texto × fundo só entra no sistema se estiver em `tests/unit/theme-contrast.test.ts` com 4,5:1 (texto) ou 3:1 (borda e foco) nos dois temas. Cores do tema ficam em `#rrggbb` para o teste conseguir ler.

## Typography

**Display Font:** Barlow Condensed 800 (com Barlow, ui-sans-serif, system-ui, sans-serif)
**Body Font:** Barlow 500 e 700 (com ui-sans-serif, system-ui, sans-serif)

**Character:** a condensada pesada em caixa alta é o numeral da figurinha e o título da página do álbum; a Barlow, da mesma família, carrega o texto em 500 e rótulos em 700. As duas são servidas pelo próprio app (`@fontsource`, só o subconjunto latino, só os três pesos usados).

### Hierarchy

- **Display** (Condensed 800, 4rem, 0,95, −0,01em, caixa alta): título da faixa ("HOJE", "ÁLBUM").
- **Headline** (Condensed 800, 3rem, 0,95, −0,01em, caixa alta): título das telas sem faixa (Ajustes, passo a passo).
- **Title-section** (Condensed 800, 1.5rem, 1,1, caixa alta): título do estado vazio, títulos de seção em Ajustes, título do diálogo e nome do app na barra do desktop.
- **Title-section-sm** (Condensed 800, 1.25rem, 1,1, caixa alta): título de seção dentro de outra seção ("VEJA COMO COLAR", no exemplo do estado vazio de Hoje) e do aviso de nova versão.
- **Sticker numeral** (Condensed 800, 2rem, 1) na figurinha colada; **Sticker numeral slot** (Condensed 800, 1.375rem, 1) na vaga pendente.
- **Band meta** (700, 0.9375rem): linha "Semana 43 · domingo, 25 de outubro" acima do título da faixa.
- **Lead** (700, 1.125rem): frase-resumo da faixa (até 22rem) e nome da atividade na linha. **Lead-lg** (700, 1.25rem): frase do passo a passo.
- **Body** (500, 1rem, 1,5): texto corrente; descrições limitadas a 60ch.
- **Meta** (500, 0.875rem): linha de apoio da atividade e versão (com algarismos tabulares); em 700, as iniciais dos dias na página vazia do Álbum.
- **Label** (700, 1rem): texto de botões e itens de menu. **Label-sticker** (700, 0.8125rem, 1): "Nº" na figurinha e "colar" na vaga. **Label-nav** (700, 0.8125rem; 0.875rem a partir de 1024 px): rótulos da navegação.

### Named Rules

**The Condensed Caps Rule.** Todo título de página e de seção (inclusive o do estado vazio, do diálogo e do aviso) usa a condensada 800 em caixa alta, assim como os numerais. Texto corrente, rótulos e nomes de atividade ficam na Barlow em caixa normal.

**The Two Weights Rule.** A Barlow tem só 500 e 700; a condensada, só 800. Hierarquia por tamanho e por essa troca de família, nunca por um peso novo ou uma terceira família.

## Layout

Coluna única centralizada de até 42rem com respiro lateral de 1.25rem em todas as telas, do celular de 320 px ao desktop. No celular, a navegação de 3 abas (Hoje · Álbum · Ajustes) fica fixa no rodapé, em grade de três colunas com abas de 56 px de altura; a partir de 1024 px ela sobe para uma barra no topo, com o nome do app à esquerda e abas em linha de 44 px.

A faixa da semana ocupa a largura toda e carrega a linha de semana e data, o título Display e a frase-resumo; seu conteúdo respeita a mesma coluna. Abaixo, seções empilham com ritmo vertical de 2rem; linhas de lista têm no mínimo 92 px (5.75rem), com nome e apoio à esquerda e a vaga ou figurinha de 64 × 76 px à direita, separadas por filetes de 2 px em `surface`. No Álbum, as duas seções vazias são separadas por um filete de 2 px. No estado vazio, a peça de exemplo do mundo fica entre o texto e as ações; as ações empilham na largura toda no celular e ficam lado a lado a partir de 640 px. Todo alvo interativo mede pelo menos 44 × 44 px (verificado em teste).

## Elevation & Depth

O mundo é plano: profundidade vem de cor chapada, de borda e de filete, não de sombra. A figurinha colada assenta na página com uma sombra dura de 2 px, sem desfoque (a única sombra do mundo); as camadas funcionais que flutuam sobre a página (menu, diálogo, aviso de nova versão) levam borda de 2 px em tinta e uma sombra difusa de camada. O diálogo escurece a página com um véu de tinta a 50%.

### Shadow Vocabulary

- **Assentamento** (`box-shadow: 0 2px 0 rgb(0 0 0 / 0.25)`): só na figurinha colada.
- **Menu** (`box-shadow: 0 10px 24px -10px rgb(0 0 0 / 0.35)`): menu de ações suspenso.
- **Camada** (`box-shadow: 0 16px 40px -12px rgb(0 0 0 / 0.4)`): diálogo modal e aviso de nova versão.

### Named Rules

**The Flat Page Rule.** Superfícies em repouso não têm sombra, gradiente nem textura. Sombra só para a figurinha colada (assentamento) e para o que flutua acima da página.

## Shapes

Retângulos de canto curto. **Canto de controle** (0.625rem) para botões, abas da navegação, botão de fechar, vaga e figurinha; **canto pequeno** (0.375rem) para itens do menu; **canto de camada** (1rem) para menu, diálogo e aviso. Só o interruptor e o rádio são totalmente redondos. Linhas e seções não têm caixa, apenas filetes de 2 px. Contornos são de 2 px; a exceção é a borda de papel da figurinha, de 4 px. A figurinha colada fica girada −2°; a vaga pendente é reta e tracejada.

## Components

### Buttons

Blocos firmes de canto curto, cor chapada e rótulo em negrito.

- **Shape:** canto de controle (0.625rem), altura mínima de 44 px, 1.25rem de respiro lateral, sem quebra de linha.
- **Primary:** tinta com texto branco (no escuro, tinta clara com texto escuro). No hover escurece levemente (`brightness(0.95)`).
- **Secondary:** contorno de 2 px em tinta, fundo transparente; hover em `surface`.
- **Ghost:** sem contorno, texto em tinta; hover em `surface`.
- **Danger:** contorno e texto em `danger`; hover em `surface`.
- **Pressionado / Desabilitado:** desce 1 px ao apertar (150 ms, sem transição com movimento reduzido); desabilitado a 60% de opacidade.
- **Link com seta:** links com aparência de botão terminam numa seta de linha de 20 px (traço 2.5) logo depois do rótulo, indicando que levam a outra tela. Botões de ação comum não levam seta.

### Sticker (gesto próprio)

Colar a figurinha é a assinatura do mundo. Mede 64 × 76 px e ocupa a direita da linha.

- **Vaga (pendente):** contorno tracejado de 2 px em tinta, fundo transparente (hover em `surface`), numeral que a pessoa vai ganhar em Sticker numeral slot e, abaixo, "colar" em Label-sticker.
- **Figurinha (colada):** fundo na cor da atividade, borda de papel de 4 px (`sticker-edge`), contorno externo de 2 px em tinta, sombra **Assentamento**, girada −2°; "Nº" em Label-sticker acima e o numeral em Sticker numeral.
- **Movimento:** ao colar agora, a figurinha cai na vaga um pouco torta e assenta (`sticker-in`, 320 ms, `cubic-bezier(0.22, 1, 0.36, 1)`, de −0.5rem, 9° e 114% para −2° e 100%, sem overshoot). Uma figurinha que já abre colada não anima; com movimento reduzido não há animação.
- **Acessibilidade:** nome acessível fixo com o número e o nome da atividade; estado em `aria-pressed`, no texto e na forma (vaga × figurinha). A cor só identifica a atividade.

### Toggle (Switch)

Trilho de 72 × 44 px com contorno de 2 px em tinta, `surface` desligado e azul (`shell`) ligado; o ponto de papel de 36 px, contornado em tinta, atravessa para a direita em 250 ms com a mesma curva da figurinha (instantâneo com movimento reduzido). O rótulo fica à esquerda.

### Radio

Círculo de 20 px com contorno de 2 px em tinta e miolo de 10 px em `primary` quando marcado; o alvo de toque é a linha inteira de 44 px, e o foco aparece no círculo.

### Cards / Containers

Não há cartões. Conteúdo vive em seções abertas sobre o fundo; só camadas flutuantes têm caixa (ver Menu e Dialog).

### Menu

Caixa em `bg` com contorno de 2 px em tinta, canto de camada, sombra **Menu** e 0.375rem de respiro; itens de 44 px em Label, realçados com `surface` mais um anel de foco interno de 3 px.

### Dialog

Caixa centralizada de até 28rem com contorno de 2 px, canto de camada, 1.25rem de respiro e sombra **Camada**; título em Title-section; botão de fechar de 44 px com ícone, hover em `surface`. O aviso de nova versão usa a mesma caixa, fixa acima da navegação, com título em Title-section-sm, sem roubar o foco.

### Navigation

Barra em `bg` separada do conteúdo por filete de 2 px em `surface`. Abas com ícone de linha (lucide, traço 2.25, 20 px) e rótulo em Label-nav; inativa em `text-muted` (hover em `text`), ativa como bloco em tinta (`primary` com `on-primary`). Rodapé fixo no celular, barra no topo a partir de 1024 px com o nome do app em Title-section.

### Band Header

A faixa da semana: região de estrutura em azul chapado, largura toda, usada só em Hoje e no Álbum, como a capa de uma página do álbum. Leva a linha de semana e data em Band meta (só em Hoje), o título Display e a frase-resumo em Lead. Dentro dela o anel de foco é branco (`focus-on-shell`).

### Empty State

Título em Title-section (condensada em caixa alta), texto em `text-muted` até 60ch, uma peça opcional do mundo e ações que ensinam o próximo passo (botão principal e, quando houver, um secundário). Nunca só "nada aqui". As telas sem faixa usam o título de página em Headline.

- **Peça de exemplo:** entra entre o texto e as ações e mostra o mundo antes de haver dados. Em Hoje, a seção "VEJA COMO COLAR" com uma linha de atividade e uma figurinha de exemplo que funciona, mas não é salva. Em "Semanas e meses", no Álbum, uma página vazia: sete vagas tracejadas de 2 px (proporção 4:5, canto de controle) em grade de sete colunas, com a inicial de cada dia embaixo em Meta 700; as vagas são `border` com texto `text-muted`, e a de hoje tem contorno e texto em tinta. É só decoração (`aria-hidden`).

### Focus

Anel de 3 px em `focus` a 2 px de distância do elemento, com 3:1 garantido sobre `bg` e `surface`; dentro da faixa azul, o anel usa `focus-on-shell`.

## Do's and Don'ts

### Do:

- **Do** usar o azul (`shell`) só em estrutura: faixa da semana, interruptor ligado, seleção de texto.
- **Do** fazer toda ação em bloco de canto curto (0.625rem) com pelo menos 44 px de altura e rótulo em 700.
- **Do** mostrar o estado da figurinha no texto e na forma (vaga tracejada × figurinha colada), além de `aria-pressed`; a cor só identifica a atividade.
- **Do** manter numeral em tinta e borda de papel branca em todas as figurinhas, também no tema escuro.
- **Do** usar a condensada 800 em caixa alta para todo título de página e de seção e para os numerais, e a Barlow 500/700 para todo o resto.
- **Do** dar a todo estado vazio uma peça do mundo (figurinha de exemplo, página com vagas) quando ela ensinar o que vai aparecer ali.
- **Do** separar linhas e regiões com filetes de 2 px em `surface`, não com caixas.
- **Do** adicionar todo novo par texto × fundo ao teste de contraste, nos dois temas.
- **Do** dar a toda transição uma saída com movimento reduzido.

### Don't:

- **Don't** usar o azul como cor de botão ou de ação.
- **Don't** usar gradiente, textura ou sombra decorativa; sombra só no assentamento da figurinha e em camadas flutuantes.
- **Don't** usar chama de sequência, anel de progresso ou lista cinza com círculos de check.
- **Don't** reordenar a lista ao colar: a figurinha muda de estado no lugar.
- **Don't** mostrar vaga vazia de dia passado; o número da figurinha nunca volta a zero.
- **Don't** usar cores fora dos tokens do tema (as cores padrão do Tailwind estão desligadas).
- **Don't** introduzir uma terceira família tipográfica ou pesos além de Barlow 500/700 e Condensed 800.

### Ainda não construído

Faz parte do mundo declarado, mas não existe no código; não trate como padrão disponível: a tira de figurinhas da semana dentro da faixa (precisa dos dados da F05/F09); a vaga de folga em lilás (os tokens `rest`, `on-rest` e `rest-border` existem, o componente não); a barra de meta de duração dentro da linha; as páginas de semana e mês do Álbum e as páginas de detalhe de cada atividade; e a atribuição de cor por atividade (hoje só o verde aparece, fixo na figurinha de exemplo).
