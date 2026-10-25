# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primário:** adultos de 25 a 45 anos que querem começar ou retomar atividade física leve em casa ou na rua (caminhada, alongamento, mobilidade, peso corporal) e que **já desistiram antes**. O trabalho deles é aparecer todo dia, não treinar perfeito.
- **Secundário:** quem já treina e só quer acompanhar a constância, sem registrar séries e cargas.
- **Fora do público:** atletas, fisiculturistas, quem precisa de periodização ou progressão de carga.

## Product Purpose

Criar e manter uma rotina diária de exercícios focada em **constância**, não em performance. O usuário define poucas atividades (1 a 5), marca o que fez em segundos e vê o próprio progresso sem ser punido quando falha um dia.

Sucesso (product.md §6): ≥ 60% criam uma atividade e marcam no 1º dia; retenção D7 ≥ 35% e D30 ≥ 20%; ≥ 4 dias ativos por semana entre os retidos; marcar uma atividade em < 5 s; zero perda de dados ou de sequência.

## Positioning

Fica entre os apps de hábito genéricos e os apps de treino: uma rotina de exercício **leve, flexível e tolerante a falhas**. O mecanismo próprio é a **sequência tolerante** (dias de folga configuráveis, meta semanal, "X vezes por semana") somada a um registro de 1 toque. Nada zera o progresso.

Frase-guia: **"Aparecer todo dia vale mais do que treinar perfeito."**

## Operating Context

- Uso rápido no celular, várias vezes por semana, muitas vezes logo depois do exercício: abrir, marcar, fechar. A tela **Hoje** é a principal.
- Funciona **sem conta e offline**; os dados ficam no dispositivo (IndexedDB). PWA instalável; lembretes na PWA são _best effort_, confiáveis só no app de loja (pós-MVP).
- Um lembrete por dia por atividade, no horário escolhido, silenciado quando o dia já está completo.
- Rituais do produto: marcar o dia, desfazer, registrar até 7 dias atrás, nota curta, resumo semanal ("Você treinou 4 de 5 dias planejados"), Dashboard de semana/mês com o período anterior sobreposto.

## Capabilities and Constraints

- **MVP (product.md §4):** atividades com tipo check, duração ou quantidade; frequência diária, dias da semana ou X por semana; meta opcional; modelos prontos (caminhada, alongamento, flexões, abdominais, mobilidade, corrida); pausar e arquivar sem perder histórico; tela Hoje com marcação em 1 toque (check) ou 2 toques (valor); desfazer; registro retroativo de 7 dias; nota de até 140 caracteres; sequência atual e melhor, com dias de folga; taxa semanal e mensal; heatmap mensal; Dashboard; lembretes; exportar/importar JSON e CSV; onboarding de no máximo 3 telas (objetivo → 1 a 3 atividades → horário do lembrete) com grátis × premium explicado ali.
- **Rotas atuais:** `/hoje`, `/album`, `/onboarding`, `/ajustes`; navegação principal de 3 abas (Hoje · Álbum · Ajustes), no rodapé no celular e no topo a partir de 1024 px. O Álbum reúne a lista de atividades, o detalhe de cada uma (sequência, heatmap, notas) e as páginas de semana e mês (o Dashboard da F13); `/atividades` e `/dashboard` redirecionam para `/album` (DV10).
- **Técnicas:** somente frontend (React 19, TypeScript, Vite, Tailwind v4, Radix); PWA offline-first; i18n pt-BR sem texto fixo; datas como `LocalDate`; desfazer é soft delete; valores calculados não são persistidos.
- **Em aberto (pendente de validação no product.md):** Status do Corpo (F14, fases por dias ativos acumulados, com aviso de saúde e revisão profissional antes de implementar); formato e preço do premium; ferramenta de analytics; sync entre dispositivos (fora do MVP).
- **Fora do produto (decisões de princípio, product.md §5.2):** séries e cargas; gamificação pesada (moedas, avatares, loja); zerar progresso ou mensagens de culpa; paywall surpresa ou limite escondido; notificações de marketing ou mais de um lembrete por atividade por dia; calorias e dieta; anúncios; coleta ou venda de dados de saúde; conselho médico ou prescrição.

## Brand Commitments

- Nome: **Repete Hábito**.
- Frase-guia: "Aparecer todo dia vale mais do que treinar perfeito."
- Tom: sem culpa, sem cobrança, sem promessa de resultado; recomeçar também conta. Textos sobre o corpo usam linguagem de possibilidade ("costuma", "em geral").
- Mundo visual "Álbum da semana" desde 25/10/2026 (marcar o dia é colar uma figurinha). O ícone atual (check branco sobre verde) é **provisório** e ainda não acompanha o novo mundo.

## Evidence on Hand

- Documentação de produto, técnica e de QA em `.claude/skills/` (product.md, tech-spec.md, tasks.md, run.md, qa.md).
- Referências científicas do Status do Corpo em product.md §10 (R1–R8), ainda sem revisão profissional.
- **Não há** usuários, depoimentos, métricas reais, pesquisa feita, preços nem marca registrada. Não inventar.

## Product Principles

1. **Constância acima de performance:** toda tela responde "apareci hoje?" antes de "quanto rendi?".
2. **Nunca punir:** nada zera, nada culpa; queda vira comparação neutra ou incentivo.
3. **Registrar em segundos:** a ação principal cabe em 1 ou 2 toques e menos de 5 s.
4. **Pouco e claro:** poucas atividades, sem limite escondido; o que é grátis e premium aparece no começo.
5. **Os dados são do usuário:** funcionam sem conta, offline, exportáveis; nada de saúde sai do dispositivo.

## Accessibility & Inclusion

WCAG 2.1 AA: contraste AA nos temas claro e escuro, alvos de toque ≥ 44 px, navegação completa por teclado, rótulos para leitor de tela (gráficos com tabela equivalente), funciona de 320 px ao desktop. Revisão manual com VoiceOver e TalkBack antes da Entrega 4.
