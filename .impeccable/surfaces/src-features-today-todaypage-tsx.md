---
version: 1
slug: 'src-features-today-todaypage-tsx'
primary_target: 'src/features/today/TodayPage.tsx'
related_targets: ['src/app/AppLayout.tsx', 'src/ui/theme.css', 'src/ui/components']
---

# Surface brief — App Repete Hábito (shell + tela Hoje)

Escopo: o shell do app (navegação de 4 abas, cabeçalho em lobo, componentes) e a tela Hoje como primeira superfície. Modo: **Operate**. Brief de UX confirmado: `.impeccable/ux-brief.md`. Produto: `PRODUCT.md`.

Público e tarefa: adulto que já desistiu antes, no celular com uma mão, marca o dia em segundos. Ação: marcar em 1 toque (check) ou 2 (valor). Restrições: offline, i18n pt-BR, WCAG 2.1 AA nos 2 temas, 320 px ao desktop, alvos ≥ 44 px, sem requisição externa (fonte servida pelo app).

Momento memorável: o ponto branco da cápsula atravessando para o outro lado quando a atividade vira "Feito".

## Direction contract

THESIS: Hoje é o mapa do dia: cada atividade tem uma cápsula de cor e marcar é levar o ponto dela para o outro lado. Recusa a lista cinza com círculos de check, a chama de streak e o anel de progresso da categoria.

OWN-WORLD: fundo branco (escuro: grafite #1A1C19); tinta #2C2E2A; verde #8ED462 só em regiões de estrutura (lobo do cabeçalho, aba ativa); cápsulas amarelo #F5E211, coral #FF705D, azul #2BA0FF, lilás #EBC1FF, sempre com texto escuro e ponto branco; cor chapada, sem gradiente, textura ou sombra decorativa; uma grotesca (Archivo variável, servida pelo app), títulos com entrelinha 0,95 e tracking −0,04em; cápsulas totalmente arredondadas, lobos com borda orgânica em SVG, o resto com raio pequeno.

STORY: a pessoa abre, entende o dia e a semana pela frase do lobo ("Você treinou 4 de 5 dias planejados"), toca a cápsula, vê "Feito" e fecha. Nada culpa; folga é um estado, não uma falha.

FIRST VIEWPORT: celular 390×844. Lobo verde no topo (~30% da altura) com "Hoje" a 48 px, a data em 14 px logo abaixo (sem rótulo acima do título, ajuste da revisão final) e a frase-resumo; abaixo, a lista de atividades em linhas de 72 px com nome, linha de apoio e a cápsula à direita (Marcar / Feito / Folga); barra de 4 abas no rodapé, aba ativa em verde. Sem atividades: estado vazio sob o lobo com "Criar primeira atividade" (botão principal) e "Usar o passo a passo" (secundário), empilhados na largura toda abaixo de 640 px. A ação principal é a cápsula, ao alcance do polegar.

FORM: desafiante do catálogo escolhido pelo responsável no lugar da direção sorteada (nº 6 da lista própria): mapa-guia de parque (aww2-zoo-gardens-guide-map), traduzido para Operate — o mundo empresta tipo, paleta, densidade e o gesto da cápsula; navegação e controles são padrão web. seed:c1445c9ff52bed9a

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
