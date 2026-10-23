#!/usr/bin/env bash
# Hook PreToolUse (Edit|Write): durante o autorun, bloqueia qualquer alteração em skills/product.md.
# Ativo só com AUTORUN=1 (scripts/autorun.sh) ou com o arquivo .claude/autorun.active (/autorun).
set -euo pipefail

input="$(cat)"
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"

if [[ "${AUTORUN:-0}" != "1" && ! -f "$root/.claude/autorun.active" ]]; then
  exit 0
fi

file="$(jq -r '.tool_input.file_path // .tool_input.path // empty' <<<"$input")"

if [[ "$file" == *"skills/product.md" ]]; then
  echo "Autorun: skills/product.md é somente leitura (run.md §1). Registre a divergência em run.md §6.2 em vez de alterar o produto." >&2
  exit 2
fi

exit 0
