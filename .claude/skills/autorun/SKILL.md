---
name: autorun
description: Executa as tasks de .claude/skills/tasks.md em modo autônomo, seguindo .claude/skills/run.md e validando cada uma com o agente de QA (.claude/skills/qa.md). Parâmetros em .claude/skills/autorun/autorun.config.json.
argument-hint: "[T05.2 | F05 | entrega 1 | tudo] [--uma-task]"
disable-model-invocation: true
---

# /autorun — Orquestrador do modo autônomo

Você é o **orquestrador**. Você não escreve código de produção nem valida o trabalho: delega ao subagente `executor` (passos 1–4 e 6 do `run.md`) e ao subagente `qa` (passo 5). Seu trabalho é escolher a task, coordenar, aplicar as condições de parada e registrar.

Argumentos recebidos: `$ARGUMENTS`

## 0. Preparação

1. Ler `.claude/skills/autorun/autorun.config.json`.
   - Se `$ARGUMENTS` trouxer um escopo (`T05.2`, `F05`, `entrega 1`, `tudo`), ele substitui `escopo` da config.
   - Se `$ARGUMENTS` trouxer `--uma-task`, executar **uma única** task e encerrar (modo usado por `scripts/autorun.sh`).
2. Ativar as travas do modo autônomo: `touch .claude/autorun.active`.
3. Ler `.claude/skills/run.md` §1 a §6 e o painel de progresso + dívidas de `.claude/skills/tasks.md`.
4. Conferir o git: a árvore precisa estar limpa (`git status --porcelain` vazio). Se não estiver, **parar** com motivo `arvore_suja`.
5. Se `escopo` ≠ entrega 0 e a feature F00 não estiver ✅, **parar** com motivo `f00_pendente` (sem F00 não existem os comandos que o QA usa).

## 1. Laço principal

Repetir até `limites.maxTasks` tasks concluídas, até o fim do escopo ou até uma condição de `pararQuando`:

**a. Selecionar** a próxima task elegível conforme `run.md` Passo 1, restrita ao escopo.
   - Nenhuma task elegível no escopo → parar com `fim_do_escopo`.
   - Task *(manual)* → aplicar `tasksManuais`: `parar` (padrão) ou `pular` (registrar na saída e seguir).
   - Task ou CA ligado a uma divergência ⬜ Aberta em `run.md` §6.2 → se `divergencia_aberta` estiver em `pararQuando`, parar.

**b. Branch** (se `git.branchPorTask`): `git checkout <branchBase> && git checkout -b task/<ID>`.

**c. Executar.** Delegar ao subagente `executor` (modelo `modelos.executor`):
   > Execute a task <ID> seguindo .claude/skills/run.md passos 2, 3 e 4. Não faça o passo 6. Ao terminar, responda com: arquivos alterados, CAs cobertos, testes criados e o resultado do passo 4.

**d. Validar.** Delegar ao subagente `qa` (modelo `modelos.qa`), **sempre** em contexto separado:
   > qa task <ID>

   Nunca validar no seu próprio contexto e nunca alterar o veredito devolvido.

**e. Decidir pelo veredito do QA:**

| Veredito | Ação |
|---|---|
| ❌ Reprovada | Se houver falha S1 e `falha_S1` estiver em `pararQuando` → parar. Senão, devolver a seção "Falhas" ao `executor` ("corrija as falhas abaixo e repita o passo 4") e voltar ao passo d. Ao atingir `maxTentativasPorTask` → parar com `reprovada_apos_max_tentativas`. |
| ⏸️ Bloqueada | Registrar a divergência (run.md §6.2) e parar com `veredito_bloqueada`. |
| 🟡 Aprovada com pendência | Se `qa.aceitarPendencia` = `false` → parar. Senão, seguir para f. |
| ✅ Aprovada | Seguir para f. |

**f. Fechar.** Delegar ao `executor`:
   > Faça o passo 6 do run.md para <ID> com este resultado do QA: <resumo do QA>. Inclua a linha "QA (qa.md)" no registro.

   Depois, se `git.commitPorTask`: `git add -A && git commit -m "<ID>: <título curto> (<CAs>)"`.
   Se `git.mergeAposAprovacao`: `git checkout <branchBase> && git merge --no-ff task/<ID>`.
   Nunca `git push` se `git.push` = `false`.

**g. Fechamentos.**
   - Última task da feature e `qa.fecharFeature` → delegar `qa feature <Fxx>`. Só ✅ fecha a feature (run.md §4); qualquer outro veredito → parar.
   - Última feature da entrega e `qa.fecharEntrega` → delegar `qa entrega <N>`. Só ✅ libera a entrega (run.md §5); qualquer outro veredito → parar.

**h.** Se `--uma-task`, sair do laço.

## 2. Encerramento

1. Desativar as travas: `rm -f .claude/autorun.active`.
2. Responder com um resumo curto:
   - tasks concluídas, com veredito e número de tentativas;
   - relatórios de QA gerados (`reports/qa/…`);
   - divergências abertas nesta execução;
   - motivo da parada.
3. A **última linha** da resposta deve ser exatamente uma das duas abaixo (usada por `scripts/autorun.sh`):

```
AUTORUN_STATUS: continuar
AUTORUN_STATUS: parar <motivo>
```

Use `continuar` só no modo `--uma-task`, quando a task fechou com ✅/🟡 e ainda há tasks no escopo.

## Regras invariáveis

- `.claude/skills/product.md` nunca é alterado (a trava `.claude/hooks/guard-product.sh` bloqueia durante o autorun).
- Nenhuma task vira `[x]` sem veredito ✅ ou 🟡 do QA (a trava `.claude/hooks/guard-qa.sh` impede encerrar sem QA).
- Na dúvida entre seguir e parar, **parar** e explicar. Decisões de produto são do responsável de produto.
