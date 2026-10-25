# Brief de UX — Repete Hábito (MVP)

> Confirmado pelo responsável em 2026-10-24 (impeccable `shape`). Fonte de produto: `PRODUCT.md` e `.claude/skills/product.md`.
> Mundo visual escolhido na rodada de direções (seed `c1445c9ff52bed9a`): **Mapa do parque** (catálogo `aww2-zoo-gardens-guide-map`), adaptado ao modo Operate.
> Ainda não há contrato de direção nem `DESIGN.md`: eles nascem no passo de construção.

## 1. Público e tarefa

- Adulto de 25 a 45 anos que já desistiu antes; celular, uma mão, muitas vezes logo depois do exercício; quer marcar o dia em segundos.
- Modo **Operate**: quem usa apps do tipo acha tudo antes de notar o visual. O mundo empresta tipografia, paleta, densidade e um gesto próprio; navegação e controles são padrão web.

## 2. Resultado

- Ação principal: marcar uma atividade em 1 toque (check) ou 2 toques (duração/quantidade), em menos de 5 s.
- Sucesso: ativação no 1º dia, ≥ 4 dias ativos por semana, nenhum momento de culpa.
- Verdade única: sequência tolerante (folga não quebra, meta semanal, nada zera).

## 3. Direção: Mapa do parque

- **Paleta:** fundo branco (sem o creme do original), tinta grafite `#2C2E2A`, verde `#8ED462` como cor da estrutura. Cada atividade recebe uma cor de cápsula: amarelo `#F5E211`, coral `#FF705D`, azul `#2BA0FF`, lilás `#EBC1FF`, sempre com texto escuro (AA).
- **Tipo:** uma grotesca só; títulos grandes bem justos (entrelinha 0,95, tracking negativo); escala fixa em rem.
- **Lobo:** só o cabeçalho de Hoje e do Dashboard é um lobo verde de borda orgânica (data, título, resumo). Abaixo, lista padrão de app.
- **Gesto próprio — a cápsula de marcar:** cápsula colorida com um ponto branco; ao marcar, o ponto atravessa para o outro lado e o texto vira "Feito" (~250 ms, leve overshoot; instantâneo com movimento reduzido). Folga usa a cápsula lilás "Folga". O estado sempre aparece também no texto e na posição do ponto.
- **Alcance:** Status do Corpo (F14) vira uma trilha no mapa do parque com marcos; no Dashboard, período atual em verde e anterior em lilás claro.

## 4. Escopo e limites

- App inteiro do MVP: onboarding, Hoje, criar/editar atividade, Atividades, detalhe da atividade, Dashboard, Ajustes; esboço do Status do Corpo.
- Fora: chamas de streak, anéis, pontos/moedas/conquistas, fundo creme, lobo virando layout, modal como primeira solução, qualquer texto de culpa.

## 5. Estados e volumes

- 0 atividades (leva ao onboarding), 1–5 típico, mais sem limite escondido; nomes longos em 2 linhas; 2 anos de histórico.
- Hoje: pendente, feito, folga, meta batida, não agendada hoje (seção recolhida "Outras atividades"), dia completo (mensagem neutra), virada da meia-noite com o app aberto, offline, aviso de nova versão.
- Estado vazio em todas as telas.

## 6. Interação e layout

- **Navegação:** 4 abas no rodapé — **Hoje · Atividades · Dashboard · Ajustes**. O "Progresso" (sequência, heatmap, notas) passa a ser o detalhe de cada atividade.
- **Onboarding:** 3 telas (objetivo → 1 a 3 atividades como cápsulas a partir dos modelos, "Avançar" só habilita nessa faixa com motivo visível → lembrete, com pular). Bloco grátis × premium antes do fim. Termina em Hoje com a primeira cápsula sinalizada.
- **Hoje:** lobo com data, "Hoje" e "Você treinou 4 de 5 dias planejados"; linhas com nome, apoio ("32 min · meta 20" ou "faltam 2 nesta semana") e a cápsula. Duração/quantidade abre folha inferior com o valor da meta preenchido (Confirmar = 2 toques). Desfazer pelo aviso de 5 s ou tocando de novo na cápsula. Seletor "Hoje ▾" no cabeçalho abre os últimos 7 dias.
- **Criar/editar atividade:** tela própria (não modal); modelos como cápsulas no topo; nome, tipo (abas), frequência, meta (+/−), ícone; erros inline presos ao campo.
- **Atividades:** Ativas / Pausadas / Arquivadas; menu na linha (Editar, Pausar, Arquivar); tocar abre o detalhe (sequência atual e melhor, taxa, heatmap mensal na cor da atividade em 4 níveis, notas).
- **Dashboard:** lobo com abas Semana | Mês, ‹ › e "voltar ao atual"; 3 indicadores em algarismos tabulares; gráfico de área que para em hoje, com tabela acessível; detalhamento por atividade na cor da cápsula; comparação sempre neutra; estado vazio com atalho para Hoje.
- **Ajustes:** tema, lembretes (Switch + horário), instalar app, exportar/importar, excluir dados, versão.

## 7. Decisões

- **Tema escuro:** traduzido do mundo — fundo grafite, lobo em verde escurecido, cápsulas saturadas com texto escuro; contraste AA verificado nos dois temas.
- **Cor da atividade:** automática como padrão (próxima cor livre da paleta de cápsulas ao criar), com opção de trocar no formulário (DV07, opção a; atende o CA03.1).
- **Restrições:** i18n pt-BR, WCAG 2.1 AA, 320 px ao desktop, offline, alvos ≥ 44 px; os componentes da T01.5 (Button, Dialog, Switch, Menu) são redesenhados neste mundo.
- **Em aberto:** a fonte exata (uma grotesca de trabalho, fora da lista de fontes batidas) é decidida na construção; conteúdo do premium e Status do Corpo seguem pendentes de validação no product.md.
