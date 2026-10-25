# F01 · Demo local aprovada pelo responsável de produto

> Definição de Pronto (product 4.9.1): "Demonstrada no ambiente de preview do PR e aprovada pelo
> responsável de produto". Pela DV04 (run.md §6.2), a demo é local, com o build de produção.

## Como fazer

1. `pnpm build && pnpm preview` e abrir http://localhost:4173.
2. Percorrer pela navegação as 4 abas (Hoje, Atividades, Dashboard, Ajustes) e /onboarding pelos estados vazios (T01.12: Progresso deixou de ser aba).
3. Em Ajustes: trocar o tema (Igual ao sistema, Claro, Escuro) e recarregar; ver a versão do app.
4. Instalar o app pelo Chrome (ícone de instalar na barra de endereço ou "Instalar app" em Ajustes).
5. Offline: DevTools → Network → Offline, recarregar e navegar entre as telas.
6. Atualização: com o app aberto, `pnpm build` de novo com outra versão (ex.: `APP_VERSION=demo-2 pnpm build`) e voltar à aba; ver o aviso "Nova versão disponível" e aceitar.

## Resultado (preencher)

| Item | Resultado |
|---|---|
| Data | |
| Navegador e sistema | |
| Telas e navegação | ☐ ok ☐ ajustes |
| Tema claro/escuro e persistência | ☐ ok ☐ ajustes |
| Instalação | ☐ ok ☐ ajustes |
| Offline | ☐ ok ☐ ajustes |
| Aviso de nova versão | ☐ ok ☐ ajustes |
| Aprovado pelo responsável de produto | ☐ sim ☐ não |
| Observações / ajustes pedidos | |
