#!/usr/bin/env bash
# Hook Stop: durante o autorun, impede encerrar com task 🚧 sem a linha "QA (qa.md)" no registro de run.md §9.
# Ativo só com AUTORUN=1 (scripts/autorun.sh) ou com o arquivo .claude/autorun.active (/autorun).
set -euo pipefail

input="$(cat)"
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"

if [[ "${AUTORUN:-0}" != "1" && ! -f "$root/.claude/autorun.active" ]]; then
  exit 0
fi

# Evita laço: se o Claude já está continuando por causa deste hook, libera.
if [[ "$(jq -r '.stop_hook_active // false' <<<"$input")" == "true" ]]; then
  exit 0
fi

tasks="$root/.claude/skills/tasks.md"
run="$root/.claude/skills/run.md"
[[ -f "$tasks" && -f "$run" ]] || exit 0

# IDs de tasks em andamento: "- [ ] 🚧 **T05.2**", "**OBS.1**", "**NFR.4**"...
open_ids="$(grep -oE '🚧 \*\*[A-Z0-9]+\.[0-9]+\*\*' "$tasks" | sed -E 's/.*\*\*([A-Z0-9]+\.[0-9]+)\*\*/\1/' || true)"
[[ -z "$open_ids" ]] && exit 0

# Trecho do registro de execuções (depois de "### Execuções").
registro="$(awk '/^### Execuções/{f=1} f' "$run")"

missing=()
for id in $open_ids; do
  # Bloco da entrada da task: do cabeçalho "### <data> · <ID>" até o próximo "### ".
  bloco="$(awk -v id="$id" '
    /^### / { f = index($0, "· " id " ") > 0 || $0 ~ ("· " id "$") }
    f' <<<"$registro")"
  if ! grep -q '\*\*QA (qa.md):\*\*' <<<"$bloco"; then
    missing+=("$id")
  fi
done

if (( ${#missing[@]} > 0 )); then
  echo "Autorun: task(s) em andamento sem validação de QA: ${missing[*]}. Delegue 'qa task <ID>' ao subagente qa e registre a linha **QA (qa.md):** em run.md §9 antes de encerrar (run.md passo 5)." >&2
  exit 2
fi

exit 0
