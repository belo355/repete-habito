# Repete Hábito — Definição de Produto (Escopo Inicial)

> Versão 0.4 · 22/10/2026 · Status: validado até 0.2 · 0.3 e 0.4 **pendentes de validação**
> Histórico: 0.4 adiciona os critérios de aceite por feature e por entrega (4.9) · 0.3 adicionou o **Status do Corpo** (4.3.2 / F14) · 0.2 adicionou a tela de Dashboard (4.3.1 / F13)

## 1. Visão

Um app simples para **criar e manter uma rotina diária de exercícios**, focado em **constância** e não em performance. O usuário define poucas atividades, marca o que fez em segundos e vê o próprio progresso sem ser punido quando falha um dia.

**Posicionamento:** fica entre os apps de hábito genéricos e os apps de treino. É uma **rotina de exercício leve, flexível e tolerante a falhas**.

**Frase-guia:** "Aparecer todo dia vale mais do que treinar perfeito."

## 2. Público-alvo

- **Primário:** adultos de 25 a 45 anos que querem começar ou retomar atividade física em casa ou na rua (caminhada, alongamento, mobilidade, peso corporal) e já desistiram antes.
- **Secundário:** quem já treina e quer só acompanhar a constância, sem registrar séries e cargas.
- **Fora do público (MVP):** atletas, fisiculturistas, quem precisa de periodização e progressão de carga.

## 3. Premissas

> Hipóteses que assumimos verdadeiras e **precisam ser validadas** (ver seção 7).

| # | Premissa |
|---|---|
| P1 | O maior problema do usuário é **constância**, não falta de conteúdo de treino. |
| P2 | Marcar uma atividade precisa levar **no máximo 2 toques e menos de 5 segundos**. |
| P3 | Sequências **tolerantes a falha** (ex.: "dias de folga" e meta semanal) retêm mais do que sequências que zeram. |
| P4 | Usuários preferem **poucas atividades** (1 a 5) a uma biblioteca grande. |
| P5 | Um lembrete por dia, no horário escolhido pelo usuário, é suficiente e não incomoda. |
| P6 | Um modelo **free completo + premium cosmético/avançado** é aceito, desde que o limite fique claro desde o onboarding. |
| P7 | O MVP pode ser lançado para **uma plataforma de front-end web/PWA em TypeScript**, com app nativo depois. |
| P8 | Mostrar **o que a constância já mudou no corpo**, com base em evidência, e sugerir um próximo passo quando o corpo estiver preparado, aumenta a retenção depois do 1º mês. |

## 4. O que o app DEVE ter (MVP)

### 4.1 Rotina e atividades
- [ ] Criar atividade com nome, ícone/cor e tipo de registro: **check (sim/não)**, **duração (min)** ou **quantidade (reps, km, passos)**.
- [ ] Frequência flexível: **todo dia**, **dias específicos da semana** ou **X vezes por semana**.
- [ ] Meta opcional por atividade (ex.: 20 min, 30 reps).
- [ ] Modelos prontos para começar rápido (caminhada, alongamento, flexões, abdominais, mobilidade, corrida).
- [ ] Editar, pausar e arquivar atividade **sem perder histórico**.

### 4.2 Registro diário
- [ ] Tela "Hoje" como tela principal, com as atividades do dia.
- [ ] Marcar como feito com **1 toque** (check) ou 2 toques (valor).
- [ ] Desfazer marcação.
- [ ] Registrar dias passados (até 7 dias atrás) para quem esqueceu de marcar.
- [ ] Nota curta opcional por registro (ex.: "joelho doendo").

### 4.3 Progresso
- [ ] Sequência atual e melhor sequência por atividade.
- [ ] **Sequência tolerante**: dias de folga configuráveis (ex.: 1 por semana) que não quebram a sequência.
- [ ] Taxa de conclusão semanal e mensal.
- [ ] Calendário/heatmap mensal por atividade.
- [ ] Resumo semanal simples ("Você treinou 4 de 5 dias planejados").

#### 4.3.1 Tela de Dashboard
Tela própria, acessível pela navegação principal, para o usuário ver **quantas vezes se exercitou na semana ou no mês**.

- [ ] Alternar o período entre **Semana** e **Mês** (padrão: semana atual). A semana vai de segunda a domingo.
- [ ] Navegar para períodos anteriores (‹ ›) e voltar ao período atual com um toque.
- [ ] Indicadores principais do período:
  - **Vezes que se exercitou**: total de registros concluídos (cada atividade marcada conta 1 vez).
  - **Dias ativos**: dias com pelo menos 1 atividade concluída (ex.: "5 de 7 dias").
  - **Taxa de conclusão**: feitos ÷ planejados, seguindo a frequência de cada atividade.
- [ ] **Gráfico de área** com as vezes por **dia** ao longo do período (7 pontos na semana, 28 a 31 no mês).
  - Eixo X: dias do período. Eixo Y: vezes que se exercitou no dia, começando em 0.
  - Área do período atual em destaque. A área do período anterior aparece sobreposta, mais clara, para comparar a evolução.
  - Dias futuros do período atual ficam sem área (a linha para no dia de hoje), para não parecer queda.
  - Tocar ou passar o dedo sobre um ponto mostra o dia e o número de vezes.
- [ ] Detalhamento **por atividade**: vezes no período e, quando houver meta de valor, o total acumulado (ex.: "Caminhada: 4 vezes · 120 min").
- [ ] Comparação com o período anterior em tom positivo ou neutro (ex.: "+2 em relação à semana passada"). **Nunca** mensagem de culpa quando o número cair (ver 5.2).
- [ ] Estado vazio amigável quando não há registros no período, com atalho para a tela "Hoje".
- [ ] Atividades pausadas e arquivadas entram nas contagens dos períodos em que estavam ativas, mas não contam como "planejadas" enquanto pausadas ou arquivadas.
- [ ] Registros desfeitos não contam.
- [ ] Números e gráfico acessíveis por leitor de tela: o gráfico de área tem uma tabela equivalente (dia → vezes) para leitores de tela, ex.: "Terça: 2 vezes".

#### 4.3.2 Status do Corpo (pendente)

> **Status: pendente.** Feature nova (F14), ainda não validada com usuários (ver P8 e seção 7.1).

Tela que **incentiva o usuário a continuar** mostrando, em linguagem simples e com base em evidência, **o que a constância já está fazendo pelo corpo dele** e qual é o próximo marco. Quando o usuário tiver constância suficiente, a tela sugere **um próximo passo opcional**: experimentar uma atividade nova ou aceitar um desafio de maior intensidade.

**O que a evidência diz (base para as fases e os textos):**

| Tempo de constância | O que acontece | Fonte |
|---|---|---|
| 1 a 2 semanas | O volume de plasma do sangue aumenta: o coração enche mais e bombeia mais sangue por batimento. O exercício começa a parecer mais fácil. | [R4] |
| 3 a 5 semanas | Nos exercícios de força, o ganho inicial vem quase todo do **sistema nervoso**, que aprende a recrutar melhor os músculos. A partir daí, o próprio músculo começa a crescer. | [R5] |
| 4 a 6 semanas | Fim da fase de **condicionamento inicial**. A recomendação é aumentar primeiro a **duração** e só depois a intensidade. | [R6] |
| 6 semanas, com ≥ 4 vezes por semana | Mínimo observado para **o exercício virar hábito** em quem está começando. | [R3] |
| 6 a 8 semanas | Melhora **mensurável** da capacidade aeróbica (VO₂máx) com treino regular. | [R4] |
| ~59 a 66 dias (mediana) | Tempo típico para um comportamento de saúde ficar **automático**. A variação entre pessoas é grande: de 18 a 254 dias em um estudo e de 4 a 335 dias numa revisão. | [R1], [R2] |
| 4 a 8 meses | Fase de **melhora**: a intensidade pode subir aos poucos, a cada 2 ou 3 semanas. | [R6] |
| A partir de 6 meses | Fase de **manutenção** do condicionamento. | [R6] |
| 2 a 3 semanas parado | Quem tem condicionamento baixo ou moderado perde pouco nas primeiras ~3 semanas. Retomar costuma ser mais rápido do que começar do zero. | [R7] |

**Fases do Status do Corpo** (contadas em **dias ativos acumulados**, ou seja, dias com pelo menos 1 atividade concluída):

| Fase | Marco | Mensagem principal (exemplo) | Próximo passo sugerido |
|---|---|---|---|
| 1. Primeiros passos | 1 dia ativo | "Seu corpo já começou a responder." | Manter a rotina. |
| 2. Adaptação inicial | 7 dias ativos | "Seu coração já trabalha com mais eficiência." | Manter a rotina. |
| 3. Base em construção | 21 dias ativos | "Seus músculos estão aprendendo a trabalhar juntos." | Aumentar a **duração** ou a meta em ~10%. |
| 4. Hábito começando | 28 dias ativos **e** média ≥ 4 dias/semana nas últimas 6 semanas | "Exercitar está virando parte da sua rotina." | Aumentar a duração. |
| 5. Corpo preparado | **60 dias ativos** **e** média ≥ 4 dias/semana nas últimas 6 semanas | "Seu corpo está preparado para algo novo." | **Desafio de intensidade** ou **atividade nova** (opcional). |
| 6. Constância consolidada | 120 dias ativos | "Você está na fase de evolução." | Novo desafio a cada ciclo de 4 semanas, se quiser. |
| 7. Manutenção | 180 dias ativos | "Isso já faz parte de quem você é." | Variar atividades para manter o interesse. |

Requisitos:

- [ ] Tela "Status do Corpo" acessível pela navegação principal (ou como seção do Dashboard), mostrando a **fase atual**, o texto "o que está acontecendo no seu corpo" e a **fonte** do dado (link para a referência).
- [ ] Barra de progresso até o próximo marco, ex.: "Faltam 8 dias ativos para *Corpo preparado*".
- [ ] **Marcos nunca são perdidos.** Dias ativos acumulados só aumentam. Faltar dias não rebaixa a fase (ver 5.2).
- [ ] O **ritmo recente** (média de dias ativos por semana nas últimas 6 semanas) é calculado separadamente. Ele serve só para decidir **se é hora de sugerir mais intensidade**, nunca para rebaixar o usuário.
- [ ] **Modo retomada**: depois de 14 dias ou mais sem atividade, a tela troca a sugestão de desafio por uma mensagem de retomada: "Seu corpo guarda parte do que você construiu. Volte no seu ritmo." Sem culpa.
- [ ] Ao atingir um marco, mostrar uma **celebração discreta** (uma vez por marco) na tela Hoje, com link para o Status do Corpo.
- [ ] **Sugestão de próximo passo** (só a partir da fase 5 e com ritmo recente ≥ 4 dias/semana):
  - **Experimentar uma atividade nova**: sugere um modelo pronto que o usuário ainda não tem, de um tipo diferente (ex.: tem só caminhada → sugere mobilidade ou corrida leve). Um toque cria a atividade.
  - **Desafio de intensidade**: desafio de 4 semanas com regra simples e progressiva. Exemplos: "aumentar a meta em 10%", "1 sessão por semana com intervalos (alternar 1 min mais forte e 2 min leve)". Aceitar o desafio cria ou ajusta a atividade com data de término.
  - O usuário pode **aceitar, adiar ou dispensar**. Dispensar não volta a sugerir pelas próximas 4 semanas.
- [ ] Desafio ativo aparece na tela Hoje com o progresso ("Semana 2 de 4"). Ao terminar, o usuário escolhe se mantém a nova meta ou volta à anterior.
- [ ] Desafio não concluído **não tem penalidade**: a mensagem final é sempre positiva ("Você fez 6 de 8 sessões do desafio").
- [ ] **Aviso de saúde** visível sempre que houver sugestão de intensidade: "Sugestões gerais, não são orientação médica. Se você tem alguma condição de saúde, sente dor ou está voltando de lesão, fale com um profissional antes de aumentar a intensidade." (ver 5.2, sem prescrição).
- [ ] Ajuste para **desligar as sugestões de intensidade** (as fases e os textos continuam).
- [ ] Textos sobre o corpo usam linguagem de **possibilidade** ("costuma", "em geral") e não prometem resultado individual. Deixar claro que cada pessoa tem seu ritmo (a variação é de 4 a 335 dias).
- [ ] Todo o conteúdo funciona offline e fica nos recursos de i18n (pt-BR).
- [ ] Acessível: progresso e fase anunciados pelo leitor de tela, ex.: "Fase 4 de 7, Hábito começando. Faltam 32 dias ativos para a próxima fase."

### 4.4 Lembretes
- [ ] Lembrete diário com horário configurável, por atividade ou geral.
- [ ] Silenciar lembrete do dia quando todas as atividades já foram feitas.

### 4.5 Dados e conta
- [ ] Funciona **sem conta** e **offline**; dados locais.
- [ ] **Exportar dados** (JSON/CSV) a qualquer momento.
- [ ] Histórico **nunca é apagado** por erro de sync (estratégia de merge, não sobrescrever).

### 4.6 Onboarding
- [ ] Máximo de 3 telas: objetivo → escolher 1 a 3 atividades → horário do lembrete.
- [ ] Explicar o que é grátis e o que é premium **no onboarding**, não no meio do uso.

### 4.7 Qualidade
- [ ] Acessibilidade: contraste AA, alvos de toque ≥ 44px, suporte a leitor de tela.
- [ ] Tema claro e escuro.
- [ ] Interface em **português (pt-BR)**, preparada para i18n.

### 4.8 Sugestão de quebra em features

Cada feature é uma entrega que pode ser desenvolvida, testada e demonstrada sozinha.

| ID | Feature | Cobre | Prioridade | Depende de |
|---|---|---|---|---|
| F01 | **Fundação do app**: PWA, roteamento, tema claro/escuro, i18n pt-BR, base de acessibilidade | 4.7 | Must | — |
| F02 | **Armazenamento local**: modelo de dados (atividade, registro), persistência offline, migração de schema | 4.5 (offline, sem conta) | Must | F01 |
| F03 | **Cadastro de atividades**: criar e editar com nome, ícone/cor, tipo de registro, frequência e meta | 4.1 | Must | F02 |
| F04 | **Ciclo de vida da atividade**: pausar, arquivar e reativar mantendo o histórico | 4.1 | Must | F03 |
| F05 | **Tela Hoje e marcação**: lista do dia, marcar com 1 ou 2 toques, desfazer | 4.2 | Must | F03 |
| F06 | **Registro retroativo e notas**: marcar até 7 dias atrás, nota curta por registro | 4.2 | Should | F05 |
| F07 | **Motor de sequência**: sequência atual e melhor, dias de folga, regras por frequência ("X por semana", dias específicos) | 4.3 | Must | F05 |
| F08 | **Estatísticas e calendário**: taxa de conclusão semanal/mensal, heatmap mensal por atividade | 4.3 | Should | F07 |
| F09 | **Resumo semanal**: "Você treinou X de Y dias planejados" | 4.3 | Should | F07 |
| F10 | **Lembretes**: horário configurável (geral ou por atividade), silenciar quando o dia estiver completo | 4.4 | Must | F05 |
| F11 | **Exportação de dados**: JSON e CSV | 4.5 | Should | F02 |
| F12 | **Onboarding**: 3 telas (objetivo, atividades a partir de modelos prontos, lembrete) e aviso de grátis/premium | 4.1 (modelos), 4.6 | Must | F03, F10 |
| F13 | **Dashboard**: vezes que se exercitou e dias ativos na semana/mês, gráfico de área por dia com o período anterior sobreposto, detalhamento por atividade, comparação com o período anterior | 4.3.1 | Must | F05 |
| F14 | **Status do Corpo** *(pendente)*: fases por dias ativos acumulados com base em evidência, próximo marco, modo retomada, sugestão opcional de atividade nova ou desafio de intensidade de 4 semanas | 4.3.2 | Should | F03, F13 |

**Ordem sugerida de entrega:**

1. **Entrega 1 (núcleo usável):** F01, F02, F03, F05. O usuário já cria atividades e marca o dia.
2. **Entrega 2 (motivação):** F07, F04, F10. Sequência tolerante e lembretes, o centro da proposta.
3. **Entrega 3 (primeira experiência e progresso):** F12, F13, F08, F09.
4. **Entrega 4 (complementos):** F06, F11.
5. **Entrega 5 (evolução):** F14. Precisa estar no ar antes de os primeiros usuários do beta chegarem aos ~60 dias ativos. As fases 1 a 3 podem sair antes, junto com o Dashboard.

> F07 (motor de sequência) é a regra de negócio mais crítica: deve ser feita como módulo de domínio isolado, com a cobertura de testes unitários da seção 7.2.

### 4.9 Critérios de aceite

Uma feature só é considerada **entregue** quando cumpre a **Definição de Pronto** (4.9.1) e **todos** os seus critérios de aceite (4.9.2). Uma entrega só é **liberada** quando cumpre os critérios de saída (4.9.3).

Formato dos critérios: **Dado** (contexto), **quando** (ação), **então** (resultado verificável). Cada critério deve ter pelo menos um teste automatizado (unitário, integração ou E2E) ou, quando indicado com *(manual)*, uma verificação registrada na revisão da entrega.

#### 4.9.1 Definição de Pronto (vale para todas as features)

- [ ] Todos os critérios de aceite da feature passam e estão cobertos por testes.
- [ ] CI verde: lint, typecheck, testes unitários, build, E2E e Lighthouse.
- [ ] Regras de negócio da feature ficam em `domain/`, com cobertura ≥ 90%.
- [ ] Funciona **offline** (após o primeiro carregamento) em Chromium e WebKit, em viewport de 320px e desktop.
- [ ] Acessibilidade: zero violações do axe nas telas da feature, alvos de toque ≥ 44px, navegação completa por teclado, rótulos para leitor de tela.
- [ ] Todos os textos estão no i18n pt-BR (nenhuma string fixa em componente) e funcionam nos temas claro e escuro.
- [ ] Nenhum texto com tom de culpa, punição ou promessa de resultado (5.2).
- [ ] Nenhuma ação do usuário apaga histórico: desfazer, pausar, arquivar e editar preservam os registros.
- [ ] Se a feature muda o schema: migração versionada, snapshot antes da migração e teste a partir de um banco fixture da versão anterior.
- [ ] Demonstrada no ambiente de preview do PR e aprovada pelo responsável de produto.

#### 4.9.2 Critérios por feature

**F01 · Fundação do app**
- **CA01.1** Dado um navegador compatível, quando o usuário abre o app pela primeira vez e depois fica offline, então o app recarrega e navega entre todas as rotas sem conexão.
- **CA01.2** Dado o app aberto em Chrome Android ou desktop, quando os critérios de instalação são atendidos, então aparece o convite próprio "Instalar app". No iOS aparece a instrução visual "Adicionar à Tela de Início".
- **CA01.3** Dado o sistema operacional em modo escuro, quando o usuário abre o app sem preferência salva, então o tema escuro é aplicado. Quando ele escolhe outro tema em Ajustes, a escolha é mantida após recarregar.
- **CA01.4** Dado qualquer tela, quando auditada nos dois temas, então o contraste de texto atende WCAG AA (≥ 4,5:1 para texto normal).
- **CA01.5** Dado que uma nova versão foi publicada, quando o usuário está com o app aberto, então vê o aviso "Nova versão disponível" e o app só recarrega se ele aceitar.
- **CA01.6** Dado o build de produção, quando medido no Lighthouse CI, então o app é instalável como PWA, LCP < 2,5 s em 4G simulado e JS inicial < 200 KB gzip.

**F02 · Armazenamento local**
- **CA02.1** Dado um usuário sem conta e offline, quando cria atividades e registros e fecha o navegador, então ao reabrir todos os dados estão lá.
- **CA02.2** Dado um banco na versão N com dados, quando o app é atualizado para a versão N+1, então todos os registros e atividades são preservados e um snapshot JSON da versão N fica salvo localmente.
- **CA02.3** Dado que uma migração falha, quando o app é reaberto, então os dados podem ser recuperados a partir do snapshot, sem perda.
- **CA02.4** Dado um registro desfeito, quando o banco é consultado, então o registro continua existindo com `deletedAt` preenchido e não aparece em nenhuma contagem.
- **CA02.5** Dado o primeiro uso concluído, quando o navegador suporta, então `navigator.storage.persist()` foi solicitado e o resultado registrado.
- **CA02.6** Dado um valor inválido (negativo, vazio, acima do limite), quando a camada de dados tenta salvar, então a validação Zod rejeita e nada é gravado.

**F03 · Cadastro de atividades**
- **CA03.1** Dado o formulário de atividade, quando o usuário informa nome, ícone, cor, tipo (check, duração ou quantidade), frequência e meta opcional e salva, então a atividade aparece na lista e na tela Hoje nos dias em que está agendada.
- **CA03.2** Dado o nome vazio ou só com espaços, quando o usuário tenta salvar, então o formulário mostra um erro acessível (anunciado pelo leitor de tela) e não salva.
- **CA03.3** Dado o tipo "duração" ou "quantidade", quando o usuário informa meta ≤ 0 ou não numérica, então o formulário rejeita o valor.
- **CA03.4** Dado a frequência "dias específicos" com seg, qua e sex, quando chega uma terça, então a atividade não aparece como planejada no dia.
- **CA03.5** Dado uma atividade "todo dia" com 30 dias de histórico, quando o usuário muda para "3x por semana", então a nova regra vale a partir de hoje e as estatísticas e sequências dos dias anteriores não mudam.
- **CA03.6** Dado a tela de criação, quando o usuário escolhe um modelo pronto, então os campos vêm preenchidos e podem ser editados antes de salvar.

**F04 · Ciclo de vida da atividade**
- **CA04.1** Dado uma atividade ativa com histórico, quando o usuário pausa, então ela some da tela Hoje, continua visível na lista com o selo "Pausada" e o histórico continua aparecendo no Dashboard e no heatmap.
- **CA04.2** Dado uma atividade pausada, quando o usuário reativa, então ela volta à tela Hoje no mesmo dia e os dias pausados não quebram a sequência.
- **CA04.3** Dado uma atividade arquivada, quando o usuário abre "Arquivadas", então ela aparece lá com todo o histórico e pode ser reativada.
- **CA04.4** Dado uma atividade pausada ou arquivada, quando as taxas de conclusão são calculadas, então os dias em que ela estava inativa não contam como planejados.
- **CA04.5** Dado qualquer ação de pausar, arquivar ou reativar, quando concluída, então nenhum registro é apagado (contagem de registros antes = depois).

**F05 · Tela Hoje e marcação**
- **CA05.1** Dado o app aberto, quando o usuário acessa a raiz, então a tela Hoje abre em < 1 s com as atividades agendadas para a data local atual.
- **CA05.2** Dado uma atividade do tipo check, quando o usuário toca uma vez, então ela fica marcada como feita e a mudança é salva imediatamente.
- **CA05.3** Dado uma atividade de duração ou quantidade, quando o usuário toca e confirma o valor (meta pré-preenchida), então o registro é salvo em no máximo 2 toques.
- **CA05.4** Dado uma atividade marcada, quando o usuário desfaz, então ela volta para pendente, o registro recebe `deletedAt` e há opção de refazer.
- **CA05.5** Dado o app aberto às 23:59, quando passa da meia-noite, então a lista passa a mostrar o novo dia sem recarregar e os registros feitos antes da meia-noite ficam no dia anterior.
- **CA05.6** Dado uma atividade "3x por semana" com 1 registro na semana, quando o usuário abre a tela Hoje, então vê "faltam 2 nesta semana".
- **CA05.7** Dado 5 usuários no teste de usabilidade, quando marcam uma atividade, então o tempo médio é < 5 s e todos concluem sem ajuda *(manual)*.

**F06 · Registro retroativo e notas**
- **CA06.1** Dado a tela Hoje, quando o usuário escolhe um dia entre ontem e 7 dias atrás, então consegue marcar, alterar valor e desfazer registros daquele dia.
- **CA06.2** Dado o seletor de dias, quando o usuário tenta ir para 8 ou mais dias atrás ou para o futuro, então a opção não está disponível e o domínio também rejeita a data.
- **CA06.3** Dado um registro retroativo que fecha um buraco na sequência, quando salvo, então a sequência atual e a melhor são recalculadas na hora.
- **CA06.4** Dado um registro, quando o usuário adiciona uma nota de até 140 caracteres, então a nota é salva e aparece no detalhe do dia. Acima do limite, o campo impede a digitação e avisa.

**F07 · Motor de sequência**
- **CA07.1** Dado uma atividade diária feita nos últimos 5 dias, quando hoje ainda não foi marcado, então a sequência atual é 5 (o dia de hoje não quebra até acabar).
- **CA07.2** Dado `restDaysPerWeek = 1`, quando o usuário falta 1 dia numa semana, então a sequência não quebra. Quando falta 2 dias na mesma semana, ela recomeça e a melhor sequência é preservada.
- **CA07.3** Dado uma atividade de dias específicos, quando o dia não é agendado, então ele não quebra nem soma na sequência.
- **CA07.4** Dado uma atividade "X por semana", quando a semana termina com X ou mais registros, então a semana conta como cumprida. A semana atual não quebra a sequência enquanto ainda é possível cumpri-la.
- **CA07.5** Dado uma atividade criada numa quarta, quando a sequência é calculada, então os dias antes da criação não contam como perdidos.
- **CA07.6** Dado registros feitos em fusos diferentes (São Paulo, Auckland, UTC) e na troca de horário de verão, quando a sequência é calculada, então cada registro fica no `LocalDate` em que foi feito.
- **CA07.7** Dado qualquer histórico, quando um registro é adicionado, então a melhor sequência nunca diminui e a atual nunca passa da melhor (teste de propriedade).
- **CA07.8** Dado uma sequência que recomeça, quando o usuário vê a tela, então a mensagem é positiva (ex.: "Recomeçar também conta") e a melhor sequência continua visível.

**F08 · Estatísticas e calendário**
- **CA08.1** Dado uma semana com 4 feitos de 5 planejados, quando o usuário abre o progresso, então a taxa semanal mostra 80%.
- **CA08.2** Dado uma atividade pausada metade do mês, quando a taxa mensal é calculada, então só os dias ativos contam como planejados.
- **CA08.3** Dado o heatmap mensal de uma atividade, quando exibido, então cada dia tem um nível de 0 a 3 conforme o valor registrado em relação à meta, e cada célula tem rótulo para leitor de tela (ex.: "12 de outubro: 25 min").
- **CA08.4** Dado 2 anos de histórico com 5 atividades, quando o usuário abre a tela de progresso, então ela carrega em < 1 s.

**F09 · Resumo semanal**
- **CA09.1** Dado uma semana com 4 dias feitos de 5 planejados, quando o usuário vê o resumo, então lê "Você treinou 4 de 5 dias planejados".
- **CA09.2** Dado uma semana com 0 dias feitos, quando o usuário vê o resumo, então a mensagem é de incentivo, sem culpa.
- **CA09.3** Dado os mesmos dados, quando comparados com o Dashboard (F13), então "dias feitos" e "planejados" são idênticos (mesma função de domínio).

**F10 · Lembretes**
- **CA10.1** Dado um horário geral ou por atividade configurado, quando chega o horário com o app aberto, então uma notificação local é exibida.
- **CA10.2** Dado que todas as atividades do dia foram feitas antes do horário, quando chega o horário, então nenhuma notificação é exibida.
- **CA10.3** Dado uma atividade, quando o usuário tenta configurar, então só é possível definir 1 lembrete por atividade por dia.
- **CA10.4** Dado a PWA, quando o usuário configura lembretes, então vê um aviso claro de que, no navegador, o lembrete pode não chegar com o app fechado.
- **CA10.5** Dado que o usuário negou a permissão de notificação, quando abre os lembretes, então vê como reativar nas configurações do navegador, sem novos pedidos insistentes.
- **CA10.6** Dado iOS (PWA instalada) e Android, quando os lembretes são testados por 3 dias, então o resultado de cada plataforma fica registrado para a decisão do app nativo *(manual)*.

**F11 · Exportação de dados**
- **CA11.1** Dado qualquer volume de dados, quando o usuário exporta JSON, então o arquivo contém todas as atividades, regras de frequência, registros (inclusive desfeitos), desafios e a versão do schema.
- **CA11.2** Dado o CSV exportado, quando aberto numa planilha, então tem uma linha por registro com data, atividade, valor, unidade e nota, em UTF-8 com acentos corretos.
- **CA11.3** Dado um JSON exportado, quando o usuário apaga os dados e importa o arquivo, então 100% do histórico é recuperado (comparação registro a registro).
- **CA11.4** Dado um banco com dados e um JSON com registros diferentes, quando o usuário importa, então os dados são mesclados por `id` + `updatedAt` e nenhum registro existente é perdido.
- **CA11.5** Dado um arquivo inválido ou de outra origem, quando importado, então o app mostra o erro e não altera o banco.

**F12 · Onboarding**
- **CA12.1** Dado um primeiro acesso, quando o usuário abre o app, então vê no máximo 3 telas: objetivo → escolher de 1 a 3 atividades dos modelos → horário do lembrete.
- **CA12.2** Dado a tela de atividades, quando o usuário tenta avançar com 0 ou mais de 3 escolhidas, então o botão de avançar fica desabilitado com explicação.
- **CA12.3** Dado o onboarding, quando o usuário passa por ele, então vê de forma explícita o que é grátis e o que é premium, antes de terminar.
- **CA12.4** Dado o onboarding concluído, quando o usuário chega à tela Hoje, então as atividades escolhidas estão lá e ele consegue fazer a primeira marcação em < 5 s.
- **CA12.5** Dado o onboarding concluído, quando o app é reaberto, então o onboarding não aparece de novo.
- **CA12.6** Dado que o usuário pula a etapa de lembrete, quando conclui, então o app funciona normalmente e o lembrete pode ser configurado depois em Ajustes.

**F13 · Dashboard**
- **CA13.1** Dado o Dashboard aberto, quando nenhum período foi escolhido, então mostra a semana atual (segunda a domingo).
- **CA13.2** Dado registros na semana, quando o usuário vê os indicadores, então "vezes" = total de registros não desfeitos, "dias ativos" = dias com ≥ 1 registro e "taxa" = feitos ÷ planejados.
- **CA13.3** Dado uma semana que atravessa dois meses, quando o usuário alterna para Mês, então cada registro conta só no mês da sua data.
- **CA13.4** Dado o gráfico de área da semana atual numa quarta, quando exibido, então mostra pontos até quarta, nenhuma área de quinta a domingo, e a área da semana anterior sobreposta em tom mais claro.
- **CA13.5** Dado um ponto do gráfico, quando o usuário toca ou passa o mouse, então vê o dia e o número de vezes. O leitor de tela acessa uma tabela equivalente ("Terça: 2 vezes").
- **CA13.6** Dado o usuário em um período anterior, quando toca em "voltar ao atual", então volta ao período atual com um toque.
- **CA13.7** Dado menos vezes que no período anterior, quando o usuário vê a comparação, então o texto é neutro ou positivo, nunca de culpa.
- **CA13.8** Dado um período sem registros, quando o usuário abre o Dashboard, então vê um estado vazio amigável com atalho para a tela Hoje.
- **CA13.9** Dado 2 anos de histórico, quando o usuário abre o Dashboard, então ele carrega em < 1 s.

**F14 · Status do Corpo** *(pendente)*
- **CA14.1** Dado os textos e marcos da 4.3.2, quando a feature for implementada, então eles já foram revisados e aprovados por um profissional de educação física *(manual, pré-requisito)*.
- **CA14.2** Dado 59 dias ativos, quando o usuário registra o 60º com ritmo ≥ 4 dias/semana nas últimas 6 semanas, então a fase muda para "Corpo preparado" e uma celebração aparece uma única vez na tela Hoje.
- **CA14.3** Dado 60 dias ativos com ritmo < 4 dias/semana, quando o usuário abre o Status do Corpo, então a fase 5 não é atingida e a tela mostra o que falta (ritmo), sem tom de cobrança.
- **CA14.4** Dado um usuário em qualquer fase, quando ele fica dias sem registrar ou desfaz registros de outros dias, então a fase nunca regride abaixo do marco já alcançado.
- **CA14.5** Dado 14 dias ou mais sem atividade, quando o usuário abre o Status do Corpo, então vê a mensagem de retomada e nenhuma sugestão de intensidade.
- **CA14.6** Dado a fase 5 com ritmo suficiente, quando a sugestão aparece, então ela oferece "atividade nova" (modelo de tipo que o usuário ainda não tem) e "desafio de 4 semanas", sempre com o aviso de saúde visível.
- **CA14.7** Dado uma sugestão, quando o usuário dispensa, então nenhuma nova sugestão aparece pelas próximas 4 semanas. Quando ele desliga as sugestões de intensidade em Ajustes, elas não aparecem mais e as fases continuam.
- **CA14.8** Dado um desafio aceito, quando o usuário abre a tela Hoje, então vê o progresso ("Semana 2 de 4"). Ao final, escolhe manter a nova meta ou voltar à anterior, e o histórico anterior não muda.
- **CA14.9** Dado um desafio não concluído, quando termina o prazo, então a mensagem final mostra o que foi feito ("Você fez 6 de 8 sessões") em tom positivo.
- **CA14.10** Dado o leitor de tela, quando o usuário abre o Status do Corpo, então ouve a fase, a posição e o que falta (ex.: "Fase 4 de 7, Hábito começando. Faltam 32 dias ativos para a próxima fase.").
- **CA14.11** Dado cada texto sobre o corpo, quando exibido, então tem link para a fonte e usa linguagem de possibilidade ("costuma", "em geral").

#### 4.9.3 Critérios de saída por entrega

| Entrega | Features | Critério de saída (liberar para usuários) |
|---|---|---|
| **1 · Núcleo usável** | F01, F02, F03, F05 | Todos os CAs das features passam. Um usuário novo, offline, cria uma atividade e marca o dia em < 5 s. Testes de migração e snapshot (CA02.2, CA02.3) verdes. Demo para o responsável de produto. |
| **2 · Motivação** | F07, F04, F10 | Cobertura ≥ 90% em `domain/streak` com testes de fuso e de propriedade. Resultado dos lembretes no iOS e Android registrado (CA10.6) e decisão sobre o momento do Capacitor tomada. |
| **3 · Primeira experiência e progresso** | F12, F13, F08, F09 | E2E onboarding → primeira atividade → primeira marcação verde. Dashboard e progresso < 1 s com 2 anos de histórico. Analytics sem dados pessoais funcionando. **Libera o beta fechado.** |
| **4 · Complementos** | F06, F11 | Teste de ida e volta da exportação (CA11.3) verde. Revisão manual com VoiceOver e TalkBack sem bloqueios. Política de privacidade (LGPD) publicada e "Excluir meus dados" funcionando. |
| **5 · Evolução** | F14 | CA14.1 (revisão profissional) cumprido antes do desenvolvimento. Teste de compreensão dos textos (7.1) com 100% de entendimento correto. No ar antes de algum usuário do beta chegar a 60 dias ativos. |

## 5. O que o app NÃO deve ter

### 5.1 Fora do escopo do MVP (pode entrar depois)
- Integração com Apple Health / Google Fit / wearables.
- Treinos guiados em vídeo ou áudio.
- Social: amigos, desafios em grupo, ranking.
- Planos de treino montados por IA.
- Widgets na tela inicial e Apple Watch.
- App nativo iOS/Android (MVP = PWA).

### 5.2 Fora do produto (decisões de princípio)
- **Registro de séries, cargas e progressão de carga**: é outro produto.
- **Gamificação pesada** (moedas, avatares, RPG, loja de itens).
- **Zerar o progresso** ou mensagens de culpa ao falhar um dia.
- **Paywall surpresa** ou limite escondido de atividades.
- **Notificações de marketing** ou mais de um lembrete por atividade por dia sem o usuário pedir.
- Contagem de calorias, dieta e nutrição.
- Anúncios dentro do app.
- Coleta de dados de saúde além do que o usuário registra, e venda/compartilhamento de dados.
- Conselhos médicos ou prescrição de exercícios. As sugestões do Status do Corpo (4.3.2) são **gerais, opcionais e acompanhadas de aviso de saúde**, nunca um plano de treino individual.

## 6. Métricas de sucesso

| Métrica | Meta inicial |
|---|---|
| Ativação: usuário cria ≥ 1 atividade e marca no 1º dia | ≥ 60% |
| Retenção D7 | ≥ 35% |
| Retenção D30 | ≥ 20% |
| Dias ativos por semana (usuários retidos) | ≥ 4 |
| Tempo médio para marcar uma atividade | < 5 s |
| Incidentes de perda de dados/sequência | 0 |
| Retenção D60 (após F14) | ≥ 15% |
| Usuários na fase 5 que aceitam uma sugestão (atividade nova ou desafio) | ≥ 30% |

## 7. Testes necessários de validação

### 7.1 Validação de produto (antes e durante o MVP)

| Teste | Valida | Como | Critério de sucesso |
|---|---|---|---|
| Entrevistas com 8 a 12 pessoas do público-alvo | P1, P4 | Roteiro sobre tentativas anteriores e motivos de desistência | ≥ 70% citam constância/motivação como causa principal |
| Teste de usabilidade do protótipo (5 usuários) | P2 | Tarefas: criar atividade, marcar, ver progresso | 100% concluem sem ajuda; marcar < 5 s |
| Teste A/B de sequência rígida vs. tolerante | P3 | Dois grupos por 4 semanas | Retenção D30 do grupo tolerante ≥ 20% maior |
| Pesquisa de lembretes | P5 | Pergunta in-app após 2 semanas + taxa de desativação | < 15% desativam lembretes |
| Teste de disposição a pagar | P7 | Página de preço + intenção de compra | ≥ 5% clicam em "assinar" |
| Beta fechado (20 a 50 usuários, 4 semanas) | Todas | Métricas da seção 6 + feedback | Bater metas de ativação e D7 |
| Teste de compreensão dos textos do Status do Corpo (5 usuários) | P8 | Ler as fases e explicar com as próprias palavras | 100% entendem como incentivo, não como promessa ou orientação médica |
| A/B com e sem Status do Corpo | P8 | Dois grupos por 8 semanas | Retenção D60 do grupo com F14 ≥ 15% maior |

### 7.2 Testes de software (obrigatórios no pipeline)

**Unitários (regras de negócio, cobertura ≥ 90% no domínio):**
- [ ] Cálculo de sequência: dia feito, dia perdido, dia de folga, frequência "X por semana", dias específicos.
- [ ] Virada de dia, **fuso horário**, horário de verão e registros feitos perto da meia-noite.
- [ ] Taxa de conclusão semanal/mensal com atividades pausadas e arquivadas.
- [ ] Contagens do dashboard: vezes e dias ativos por semana/mês, limites de semana (segunda a domingo) e de mês, semanas que atravessam dois meses, registros desfeitos não contam.
- [ ] Atividade criada no meio da semana (não penalizar dias anteriores à criação).
- [ ] Edição de frequência não recalcula o histórico de forma retroativa errada.
- [ ] Validação de entradas (valores negativos, vazios, limites).
- [ ] Status do Corpo: dias ativos acumulados (nunca diminuem), ritmo das últimas 6 semanas, mudança de fase exatamente no marco, condição de ritmo das fases 4 e 5, modo retomada após 14 dias, registros desfeitos não contam.
- [ ] Desafio: início, término em 4 semanas, progresso parcial e período de 4 semanas sem nova sugestão após dispensar.

**Integração:**
- [ ] Persistência local (salvar, ler, migrar schema entre versões).
- [ ] Sincronização: **conflito entre dois dispositivos** não perde registros (merge).
- [ ] Reinstalação/restauração a partir do backup recupera 100% do histórico.
- [ ] Exportação JSON/CSV gera dados completos e reimportáveis.
- [ ] Funcionamento offline e sincronização ao voltar online.

**End-to-end (fluxos críticos):**
- [ ] Onboarding completo → primeira atividade → primeira marcação.
- [ ] Marcar, desfazer e registrar dia passado.
- [ ] Configurar lembrete e receber notificação.
- [ ] Pausar e arquivar atividade mantendo histórico.
- [ ] Marcar atividades e ver o dashboard refletir as vezes na semana e no mês; navegar entre períodos.
- [ ] Atingir a fase 5 (com histórico fixture), ver a sugestão, aceitar o desafio e vê-lo na tela Hoje; dispensar a sugestão.

**Não funcionais:**
- [ ] Acessibilidade WCAG 2.1 AA (automatizado + revisão manual com leitor de tela).
- [ ] Performance: telas "Hoje" e "Dashboard" abrem em < 1 s; app funciona com 2 anos de histórico.
- [ ] Responsividade em telas de 320px até desktop.
- [ ] Segurança e privacidade: dados criptografados em trânsito, conformidade com a LGPD, exclusão de conta apaga os dados.

## 8. Riscos

| Risco | Mitigação |
|---|---|
| Produto muito simples, sem diferencial | Foco forte em sequência tolerante + rapidez de registro; validar com A/B |
| Perda de dados destrói a confiança | Offline-first, merge em vez de sobrescrever, testes de sync obrigatórios |
| Notificações não confiáveis em PWA (especialmente iOS) | Testar cedo; planejar app nativo se for bloqueante |
| Baixa conversão para premium | Validar disposição a pagar antes de construir recursos pagos |
| Textos do Status do Corpo lidos como promessa ou orientação médica | Linguagem de possibilidade, fonte visível, aviso de saúde, revisão dos textos por um profissional de educação física |
| Sugestão de intensidade causar lesão ou desistência | Sugestão só com ritmo ≥ 4 dias/semana, sempre opcional, progressão pequena (~10%), opção de desligar |

## 9. Próximos passos

1. Revisar e validar os critérios de aceite da seção 4.9 com o time e ligar cada CA às tasks em `tasks.md`.
2. Construir o MVP e abrir o beta fechado.
3. Validar os textos e os marcos do Status do Corpo (F14) com um profissional de educação física antes de implementar.

## 10. Referências (Status do Corpo)

- **[R1]** Lally, P. et al. (2010). *How are habits formed: Modelling habit formation in the real world.* European Journal of Social Psychology. Mediana de 66 dias até a automaticidade, variação de 18 a 254 dias. [UCL News](https://www.ucl.ac.uk/news/2009/aug/how-long-does-it-take-form-habit) · [BPS Research Digest](https://bps.org.uk/research-digest/how-form-habit)
- **[R2]** Singh, B. et al. (2024). *Time to Form a Habit: A Systematic Review and Meta-Analysis of Health Behaviour Habit Formation and Its Determinants.* Healthcare. 20 estudos, 2.601 participantes; medianas de 59 a 66 dias, médias de 106 a 154 dias, variação de 4 a 335 dias. [PMC11641623](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11641623/)
- **[R3]** Kaushal, N.; Rhodes, R. (2015). *Exercise habit formation in new gym members.* Universidade de Victoria. Pelo menos 4 sessões por semana durante 6 semanas foi o mínimo para criar o hábito. [UVic News](https://www.uvic.ca/news/topics/2015+calling-all-couch-potatoes+ring) · [Tese (UVic)](https://dspace.library.uvic.ca/items/113699e5-2131-4f46-8ec6-2180cffed8c3)
- **[R4]** Linha do tempo de adaptações aeróbicas: expansão do volume plasmático em 1 a 2 semanas e melhora mensurável do VO₂máx em 6 a 8 semanas. [Peak VO2 Trainer](https://peakvo2trainer.com/blog/how-long-to-improve-vo2-max/) *(fonte de divulgação; confirmar com literatura primária na revisão do profissional)*
- **[R5]** Moritani, T.; deVries, H. A. (1979). *Neural factors versus hypertrophy in the time course of muscle strength gain.* American Journal of Physical Medicine. Ganho inicial de força predominantemente neural, com hipertrofia relevante após 3 a 5 semanas. [PubMed 453338](https://pubmed.ncbi.nlm.nih.gov/453338/)
- **[R6]** ACSM: estágios de progressão do treino aeróbico (condicionamento inicial em 1 a 6 semanas, melhora em 4 a 8 meses, manutenção após ~6 meses; aumentar a duração antes da intensidade). [ACSM Cardiorespiratory Training Guidelines (PDF)](https://www.rcboe.org//cms/lib/GA01903614/Centricity/Domain/20824/ACSM%20Cardiorespiratory%20Training%20Guidelines.pdf) · [NFPT](https://nfpt.com/aerobic-exercise-for-general-fitness/)
- **[R7]** Destreino: pessoas com capacidade aeróbica baixa ou moderada sentem pouco efeito nas primeiras ~3 semanas sem treino. [SAGE Encyclopedia of Sports Medicine, "Detraining (Reversibility)"](https://sk.sagepub.com/ency/edvol/embed/sportsmedicine/chpt/detraining-reversibility)
- **[R8]** Bull, F. C. et al. (2020). *World Health Organization 2020 guidelines on physical activity and sedentary behaviour.* 150 a 300 min/semana de atividade moderada; "qualquer atividade é melhor do que nenhuma". [PMC7719906](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7719906/)
