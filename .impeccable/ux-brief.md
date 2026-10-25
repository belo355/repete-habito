# Brief de UX — Repete Hábito (MVP)

> Confirmado pelo responsável em 2026-10-24 (impeccable `shape`). Fonte de produto: `PRODUCT.md` e `.claude/skills/product.md`.
> **Atualizado em 2026-10-25 (T01.14):** o mundo "Mapa do parque" foi substituído pelo **Álbum da semana** (rodada de direções com seed `774749bce7ca0a27`, escolhida pelo responsável), com mudança de estrutura: 3 abas e o Álbum no lugar de Atividades e Dashboard (DV10). Contrato em `.impeccable/surfaces/src-features-today-todaypage-tsx.md`; sistema em `DESIGN.md`.

## 1. Público e tarefa

- Adulto de 25 a 45 anos que já desistiu antes; celular, uma mão, muitas vezes logo depois do exercício; quer marcar o dia em segundos.
- Modo **Operate**: quem usa apps do tipo acha tudo antes de notar o visual. O mundo empresta tipografia, paleta, densidade e um gesto próprio; navegação e controles são padrão web.

## 2. Resultado

- Ação principal: marcar uma atividade em 1 toque (check) ou 2 toques (duração/quantidade), em menos de 5 s.
- Sucesso: ativação no 1º dia, ≥ 4 dias ativos por semana, nenhum momento de culpa.
- Verdade única: sequência tolerante (folga não quebra, meta semanal, nada zera).

## 3. Direção: Álbum da semana

- **Ideia:** marcar o dia é colar uma figurinha; o número dela conta quantas vezes a pessoa apareceu naquela atividade.
- **Paleta:** página branca (escuro `#16181D`), faixa de estrutura em azul álbum `#1B3FBF` com texto branco, tinta `#16181D`. Figurinhas por atividade: amarelo `#FFC20E`, vermelho `#FF5A3C`, verde `#00A65A`, magenta `#FF4FA3`, ciano `#00A3E0`, sempre com numeral em tinta e borda de papel branca. Folga em lilás `#EFE4FF`.
- **Tipo:** Barlow Condensed 800 em caixa alta para títulos e numerais; Barlow 500/700 para texto; servidas pelo app.
- **Faixa:** só o cabeçalho de Hoje e do Álbum é uma faixa azul (semana e data, título, resumo). Abaixo, lista padrão de app.
- **Gesto próprio — colar a figurinha:** vaga tracejada com o número que vai ganhar; ao tocar, a figurinha cai na vaga levemente torta (320 ms; sem animação com movimento reduzido). Nome acessível fixo, estado em `aria-pressed`, no texto e na forma.
- **Sem cobrança:** não existe vaga vazia de dia passado; as figurinhas colam em sequência e só a semana atual mostra o que falta. Folga é uma vaga lilás impressa.
- **Alcance:** Status do Corpo (F14) pode virar páginas especiais do álbum; no Álbum, semana e mês são páginas com o período anterior para comparação neutra.

## 4. Escopo e limites

- App inteiro do MVP: onboarding, Hoje, criar/editar atividade, Atividades, detalhe da atividade, Dashboard, Ajustes; esboço do Status do Corpo.
- Fora: chamas de streak, anéis, pontos/moedas/conquistas, fundo creme, faixa virando layout, vaga vazia de dia passado, modal como primeira solução, qualquer texto de culpa.

## 5. Estados e volumes

- 0 atividades (leva ao onboarding), 1–5 típico, mais sem limite escondido; nomes longos em 2 linhas; 2 anos de histórico.
- Hoje: pendente, feito, folga, meta batida, não agendada hoje (seção recolhida "Outras atividades"), dia completo (mensagem neutra), virada da meia-noite com o app aberto, offline, aviso de nova versão.
- Estado vazio em todas as telas.

## 6. Interação e layout

- **Navegação:** 3 abas no rodapé — **Hoje · Álbum · Ajustes**. O Álbum reúne a lista de atividades, a página de cada atividade (sequência, heatmap, notas) e as páginas de semana e mês (DV10).
- **Onboarding:** 3 telas (objetivo → 1 a 3 atividades como figurinhas a partir dos modelos, "Avançar" só habilita nessa faixa com motivo visível → lembrete, com pular). Bloco grátis × premium antes do fim. Termina em Hoje com a primeira cápsula sinalizada.
- **Hoje:** faixa com semana e data, "Hoje", "Você apareceu 4 de 5 dias planejados" e a tira de figurinhas da semana; linhas com nome, apoio ("32 min · meta 20" ou "faltam 2 nesta semana") e a vaga/figurinha. Duração/quantidade abre folha inferior com o valor da meta preenchido (Confirmar = 2 toques). Desfazer pelo aviso de 5 s ou tocando de novo na figurinha. Seletor "Hoje ▾" no cabeçalho abre os últimos 7 dias.
- **Criar/editar atividade:** tela própria (não modal); modelos como figurinhas no topo; nome, tipo (abas), frequência, meta (+/−), ícone; erros inline presos ao campo.
- **Álbum · atividades:** Ativas / Pausadas / Arquivadas; menu na linha (Editar, Pausar, Arquivar); tocar abre o detalhe (sequência atual e melhor, taxa, heatmap mensal na cor da figurinha em 4 níveis, notas).
- **Álbum · semana e mês:** faixa com abas Semana | Mês, ‹ › e "voltar ao atual"; 3 indicadores em algarismos tabulares; gráfico de área que para em hoje, com tabela acessível; detalhamento por atividade na cor da figurinha; comparação sempre neutra; estado vazio com atalho para Hoje.
- **Ajustes:** tema, lembretes (Switch + horário), instalar app, exportar/importar, excluir dados, versão.

## 7. Decisões

- **Tema escuro:** traduzido do mundo — fundo `#16181D`, a mesma faixa azul, figurinhas saturadas com numeral escuro; contraste AA verificado nos dois temas.
- **Cor da atividade:** automática como padrão (próxima cor livre da paleta de figurinhas ao criar), com opção de trocar no formulário (DV07, opção a; atende o CA03.1).
- **Restrições:** i18n pt-BR, WCAG 2.1 AA, 320 px ao desktop, offline, alvos ≥ 44 px; os componentes da T01.5 (Button, Dialog, Switch, Menu) são redesenhados neste mundo.
- **Fontes:** Barlow e Barlow Condensed, servidas pelo app (T01.14). **Em aberto:** conteúdo do premium e Status do Corpo seguem pendentes de validação no product.md.
