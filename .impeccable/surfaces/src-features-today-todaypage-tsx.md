---
version: 1
slug: 'src-features-today-todaypage-tsx'
primary_target: 'src/features/today/TodayPage.tsx'
related_targets: ['src/app/AppLayout.tsx', 'src/ui/theme.css', 'src/ui/components']
---

# Surface brief — App Repete Hábito (shell + tela Hoje), redesenho "Álbum da semana"

Escopo: o shell do app e a tela Hoje como primeira superfície, mais a nova estrutura de navegação. Modo: **Operate**. Produto: `PRODUCT.md`. Substitui o mundo "Mapa do parque" (DESIGN.md atual passa a ser referência do que sai; reescrito ao fim da construção). Decisão do responsável em 2026-10-25: mudar visual e estrutura, ousado, nada intocado além das regras do produto.

Público e tarefa: adulto que já desistiu antes, no celular com uma mão, marca o dia em segundos. Ação: colar a figurinha em 1 toque (check) ou 2 (valor). Restrições: offline, i18n pt-BR, WCAG 2.1 AA nos 2 temas, 320 px ao desktop, alvos ≥ 44 px, fontes servidas pelo app.

Momento memorável: a figurinha caindo na vaga tracejada, levemente torta, com o número de vezes que a pessoa já apareceu.

## Direction contract

THESIS: Marcar o dia é colar uma figurinha; o número dela conta quantas vezes você apareceu naquela atividade e nunca volta a zero. Recusa a lista cinza com círculos de check, o anel de progresso e a chama de streak.

OWN-WORLD: página branca (escuro: #16181D); faixa da semana em azul álbum #1B3FBF com texto branco; figurinhas em cores chapadas por atividade (amarelo #FFC20E, vermelho #E8412C, verde #00A65A, magenta #E5007E, ciano #00A3E0), sempre com borda branca recortada de 4 px e texto/numeral em tinta #16181D; folga em lilás #F3E8FF com contorno #B79AD6; vaga pendente em contorno tracejado de 2 px. Adaptação por contraste AA (registrada na construção): o vermelho virou #FF5A3C e o magenta #FF4FA3 (tinta sobre #E8412C dava ~4,4:1 e sobre #E5007E ~3,9:1), e a folga virou #EFE4FF com borda #8B6BB8 no claro (#B79AD6 não chega a 3:1 sobre branco; fica no escuro). Tipo: Barlow Condensed 800 em caixa alta para títulos e numerais, Barlow 500/700 para texto (ambas servidas pelo app). Sem gradiente nem textura; a figurinha colada leva borda de papel de 4 px mais contorno de 2 px em tinta e a única sombra da página é o assentamento dela (0 2px 0); menu, diálogo e aviso de nova versão, que flutuam, mantêm sombra funcional; a figurinha cai em 320 ms com ease-out-quint (sem overshoot) e não anima com movimento reduzido. Raises: uma peça domina cada tela (em Hoje, a página da semana); cada atividade tem ficha fixa (cor, nome, contagem) igual em todas as telas; arquivar e excluir isolados por espaço vazio; em duração, barra com comprimento exato da fração da meta; colar muda o estado no lugar, a lista nunca reordena.

STORY: a pessoa abre, lê "Semana 43 · Você apareceu 4 de 5 dias planejados", vê as figurinhas da semana coladas, toca a vaga da atividade e a figurinha cai com o número 39. Não existe vaga vazia de dia passado: as figurinhas colam em sequência e só a semana atual mostra o que falta ("falta 1"). Folga é uma vaga lilás impressa, parte da página.

FIRST VIEWPORT: celular 390×844. Faixa azul no topo com "Semana 43 · domingo, 25 de outubro" (15 px, 700), o título "HOJE" a 64 px na condensada (o título da rota continua "Hoje"; o número da semana sobe para a linha de cima, ajuste da construção) e a frase-resumo; quando houver registros (F05/F09), a tira de figurinhas da semana entra logo abaixo, com vagas tracejadas só para os dias planejados restantes. Abaixo da faixa, a lista "Para colar hoje" em linhas de ≥ 92 px: nome, apoio (e barra de meta em duração) e, à direita, a vaga/figurinha de 64×76. Sem atividades: estado vazio com "Criar primeira atividade" (leva ao Álbum) e "Usar o passo a passo", empilhados abaixo de 640 px, e a seção "Veja como colar" com uma figurinha de exemplo que não é salva. Navegação em 3 abas no rodapé: Hoje · Álbum · Ajustes (Álbum reúne a gestão de atividades, o detalhe de cada uma e o antigo Dashboard como páginas de semana/mês; /atividades e /dashboard redirecionam para /album; a aba ativa é um bloco em tinta). A partir de 1024 px a navegação sobe para o topo. Esboço aprovado: `.impeccable/mocks/decision/r2/assigned.html`.

FORM: direção sorteada da lista própria (nº 7, álbum de figurinhas de banca), adaptada ao modo Operate; o mundo empresta tipo, paleta, densidade e o gesto de colar; navegação e controles são padrão web. Desafiante competitivo não escolhido: cartão de embarque e painel de portão. seed:774749bce7ca0a27

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
