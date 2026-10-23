#!/usr/bin/env bash
# Modo autônomo headless: uma sessão nova do Claude Code por task, guiada só pelos arquivos do projeto.
# Uso: scripts/autorun.sh [escopo]      ex.: scripts/autorun.sh "entrega 1" · scripts/autorun.sh F05
# Parâmetros: skills/autorun.config.json · processo: skills/run.md · validação: skills/qa.md
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

config="skills/autorun.config.json"
escopo="${1:-}"
max_tasks="$(jq -r '.limites.maxTasks' "$config")"
max_turns="$(jq -r '.limites.maxTurnosPorTask' "$config")"
model="$(jq -r '.modelos.orquestrador' "$config")"

logdir="reports/autorun"
mkdir -p "$logdir"
run_id="$(date +%Y%m%d-%H%M%S)"
log="$logdir/$run_id.log"

export AUTORUN=1   # ativa as travas de .claude/hooks durante toda a execução

echo "Autorun $run_id · escopo: ${escopo:-config} · máx. $max_tasks tasks · log: $log" | tee -a "$log"

status="parar sem_execucao"
for ((i = 1; i <= max_tasks; i++)); do
  echo "── Task $i/$max_tasks ──" | tee -a "$log"

  out="$logdir/$run_id-$i.json"
  if ! claude -p "/autorun ${escopo} --uma-task" \
      --model "$model" \
      --permission-mode acceptEdits \
      --max-turns "$max_turns" \
      --output-format json > "$out"; then
    status="parar erro_claude_cli"
    echo "Falha ao executar o Claude Code (ver $out)." | tee -a "$log"
    break
  fi

  result="$(jq -r '.result // ""' "$out")"
  cost="$(jq -r '.total_cost_usd // "?"' "$out")"
  turns="$(jq -r '.num_turns // "?"' "$out")"
  printf '%s\n' "$result" >> "$log"
  echo "turnos: $turns · custo: US\$ $cost" | tee -a "$log"

  status="$(grep -oE 'AUTORUN_STATUS: .*' <<<"$result" | tail -1 | sed 's/AUTORUN_STATUS: //')"
  [[ -z "$status" ]] && status="parar sem_status"

  echo "status: $status" | tee -a "$log"
  [[ "$status" == "continuar" ]] || break
done

rm -f .claude/autorun.active
echo "Fim do autorun $run_id · último status: $status" | tee -a "$log"
[[ "$status" == continuar || "$status" == *fim_do_escopo* ]]
