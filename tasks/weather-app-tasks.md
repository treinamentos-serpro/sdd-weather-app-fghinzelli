# Weather App — Backlog de Tarefas

Backlog derivado de [`plans/weather-app-plan.md`](../plans/weather-app-plan.md), com os critérios da [`specs/weather-app-spec.md`](../specs/weather-app-spec.md) como fonte de comportamento. As tarefas foram divididas por responsabilidade e limitadas a até dois arquivos prováveis cada; subtarefas sem dependência direta podem avançar em paralelo. Baselines propostas continuam condicionadas à aprovação de produto.

## Matriz de rastreabilidade funcional

A coluna de implementação lista tarefas que entregam o comportamento; a coluna de verificação lista testes correspondentes e não substitui a implementação.

| Requisito da spec | Tarefas de implementação | Tarefas de verificação |
|---|---|---|
| **FR-01 — Buscar cidades** | T-07 (geocoding e parâmetros), T-08 (validação e busca), T-09 (campo), T-15 (composição inicial da busca), T-16 (integração completa). | T-20 (service), T-22 (hook), T-24 (componentes), T-29 (integração), T-30 (E2E de busca), T-32 (fluxo mobile). |
| **FR-02 — Selecionar cidade** | T-04 (normalização de `City`), T-07 (gateway), T-08 (seleção e coordenadas), T-10 (lista e callback), T-15/T-16 (composição). | T-17 (mapper), T-23 (hook), T-24 (componentes), T-29 (integração), T-30 (E2E de busca). |
| **FR-03 — Consultar clima atual** | T-04 (mapeamento dos dados atuais), T-07 (forecast), T-11 (painel atual), T-16 (integração do relatório). | T-17 (mapper), T-25 (componente), T-29 (integração), T-31 (E2E do relatório), T-32 (fluxo mobile). |
| **FR-04 — Consultar previsão de cinco dias** | T-04 (normalização diária), T-07 (forecast), T-12 (previsão), T-16 (integração do relatório). | T-17 (mapper), T-26 (componente), T-29 (integração), T-31 (E2E do relatório), T-32 (fluxo mobile). |
| **FR-05 — Alternar unidade de temperatura** | T-05 (conversão), T-08 (estado), T-11/T-12 (apresentação), T-13 (controle), T-16 (integração do relatório). | T-18 (conversão), T-23 (hook), T-25/T-26 (componentes), T-28 (controle), T-29 (integração), T-31/T-32 (E2E). |
| **FR-06 — Exibir interface em pt-BR** | T-06 (datas e condições), T-07 (idioma do geocoding), T-09 a T-14 (componentes), T-15/T-16 (composição). | T-19 (formatação), T-24 a T-28 (componentes), T-29 (integração), T-30 a T-32 (E2E). |
| **FR-07 — Comunicar resultados, carregamento e falhas** | T-07 (classificação de falhas e timeout), T-08 (estados e retry), T-09 (validação), T-14 (status), T-15/T-16 (composição). | T-20/T-21 (service), T-22/T-23 (hook), T-27 (estados de componente), T-29 (integração), T-30/T-31 (E2E). |

**Cobertura:** FR-01 a FR-07 têm tarefas de implementação e verificação associadas; nenhum requisito funcional da spec está sem tarefa correspondente.

## Prioridade, tamanho e fatias verticais

P0 indica item necessário para a primeira entrega utilizável ou bloqueador explícito de release; P1 indica hardening importante após o fluxo principal; P2 indica decisão de produto/validação que pode permanecer pendente sem impedir a primeira versão. Tamanho relativo: P (pequeno), M (médio), G (grande).

| Tarefa | Prioridade | Tamanho | Tarefa | Prioridade | Tamanho |
|---|---|---|---|---|---|
| T-01 | P0 | P | T-21 | P0 | P |
| T-02 | P0 | M | T-22 | P0 | M |
| T-03 | P0 | P | T-23 | P0 | M |
| T-04 | P0 | G | T-24 | P0 | M |
| T-05 | P0 | P | T-25 | P1 | P |
| T-06 | P0 | M | T-26 | P1 | P |
| T-07 | P0 | G | T-27 | P0 | P |
| T-08 | P0 | G | T-28 | P1 | P |
| T-09 | P0 | M | T-29 | P0 | M |
| T-10 | P0 | M | T-30 | P0 | M |
| T-11 | P0 | M | T-31 | P0 | M |
| T-12 | P0 | M | T-32 | P0 | G |
| T-13 | P0 | P | T-33 | P0 | M |
| T-14 | P0 | M | T-34 | P0 | G |
| T-15 | P0 | M | T-35 | P1 | G |
| T-16 | P0 | M | T-36 | P1 | G |
| T-17 | P0 | M | T-37 | P0 | M |
| T-18 | P0 | P | T-38 | P0 | M |
| T-19 | P1 | P | T-39 | P0 | G |
| T-20 | P0 | M | T-40 | P2 | G |

### Sequência sugerida

1. **Base técnica:** T-01 a T-08; validar o mapper com T-17. Entrega contratos, normalização, gateway e orquestração reutilizáveis.
2. **Fatia vertical 1 — busca visível:** T-09, T-10, T-14 e T-15; validar com T-20, T-22, T-24, T-27 e T-30. A pessoa já consegue buscar, ver resultados e selecionar uma cidade antes de o relatório meteorológico estar pronto.
3. **Fatia vertical 2 — relatório e unidade:** T-05, T-06, T-11, T-12, T-13 e T-16; validar com T-18, T-19, T-21, T-23, T-25, T-26, T-28, T-29, T-31 e T-32. Completa clima atual, cinco dias, alternância e retry.
4. **Hardening e release:** T-33 a T-40. Fechar responsividade, acessibilidade, performance, compatibilidade e gates operacionais; T-40 pode permanecer pendente se produto ainda não tiver aprovado público e frescor.

As tarefas de teste aparecem depois da integração no backlog para manter a ordem de execução; dentro de cada fatia, execute os testes listados assim que a parte correspondente estiver integrada.

## Entrega 0 — Preparação mínima

### T-01 — Configurar scripts do projeto
- **Descrição:** garantir scripts de qualidade compatíveis com as ferramentas já instaladas no repositório.
- **Critérios de aceite:** `package.json` define scripts para lint/check, build e test; cada comando termina com código 0 na branch da tarefa; não são adicionados serviços de backend, armazenamento ou dependências de estado/data.
- **Rastreabilidade:** Plano, Tech Stack (Qualidade) e Architecture.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `package.json`.
- **Tipo:** Infra

### T-02 — Criar entrada e shell React
- **Descrição:** inicializar a SPA React/Vite e um `App` mínimo que compile com TypeScript strict.
- **Critérios de aceite:** executar build sem erro; a página monta React no elemento raiz e renderiza `App`; a estrutura usa Vite, Tailwind e TypeScript strict existentes.
- **Rastreabilidade:** Plano, Architecture, Tech Stack e Project Structure.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/main.tsx`, `src/App.tsx`.
- **Tipo:** Infra

## Entrega 1 — Tipos e funções puras

### T-03 — Definir contratos de domínio
- **Descrição:** criar os tipos de cidade, clima, previsão, unidade, falha, gateway e estado da aplicação.
- **Critérios de aceite:** `weather.ts` exporta os contratos descritos em Data Model e State Management; campos numéricos opcionais aceitam `number | null`; `tsc --noEmit` passa; o módulo não importa React nem declara tipos acoplados ao JSON Open-Meteo.
- **Rastreabilidade:** Plano, Data Model, State Management e Architecture.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Tipo:** Data

### T-04 — Mapear respostas Open-Meteo
- **Descrição:** normalizar respostas de geocoding e forecast para os tipos de domínio.
- **Critérios de aceite:** ID numérico vira string e `admin1` ausente vira `null`; raiz incompatível, coordenadas não finitas ou timezone não IANA são rejeitados; cada campo numérico inválido vira `null` sem descartar outros campos válidos; arrays diários alinham pelo mesmo índice; resposta utilizável incompleta retorna `partial` e resposta sem valor meteorológico válido é rejeitada.
- **Rastreabilidade:** FR-02/03/04/07; AC-02.1, AC-07.5; Plano, Data Model, External APIs e Error Handling.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/lib/openMeteoMapper.ts`.
- **Tipo:** Data

### T-05 — Converter temperaturas
- **Descrição:** implementar o formatador puro Celsius/Fahrenheit.
- **Critérios de aceite:** para cada chamada, converte o Celsius original pela fórmula definida no plano e arredonda o resultado a uma casa decimal; zero e negativos são convertidos; `null` retorna “Indisponível”.
- **Rastreabilidade:** FR-05; AC-05.1 e AC-05.2; Plano, State Management e contratos de apresentação.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Tipo:** Data

### T-06 — Formatar datas e condições
- **Descrição:** implementar formatação de horário, data e rótulo WMO em pt-BR.
- **Critérios de aceite:** `Intl.DateTimeFormat` recebe locale `pt-BR` e o timezone fornecido; códigos WMO cobertos pela tabela retornam rótulos pt-BR e código não mapeado retorna “Indisponível”.
- **Rastreabilidade:** FR-03/04/06; AC-03.1, AC-04.1 e AC-06.1; Plano, contratos de apresentação.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/lib/weatherFormat.ts`.
- **Tipo:** Data

## Entrega 2 — Services

### T-07 — Implementar gateway Open-Meteo
- **Descrição:** implementar busca e forecast com APIs nativas do navegador.
- **Critérios de aceite:** URLs são montadas por `URL`/`URLSearchParams`; geocoding envia consulta aparada sem alterar espaços internos, acentos, hífens ou apóstrofos, com `count=10`, `language=pt` e `format=json`; forecast usa latitude/longitude da cidade recebida e os parâmetros do plano; toda chamada inicia timeout de 8 s, limpa o timer ao concluir, aceita `AbortSignal` e classifica rede/HTTP/timeout/resposta inválida; não repete requests.
- **Rastreabilidade:** FR-01/02/03/04/07; AC-01.3, AC-01.4 e AC-07.4; Plano, External APIs e Error Handling.
- **Dependências:** T-03, T-04.
- **Arquivos prováveis:** `src/services/openMeteoService.ts`.
- **Tipo:** Data

## Entrega 3 — Hook

### T-08 — Implementar orquestração do hook
- **Descrição:** criar `useWeatherApp` com reducer, gateway injetável e coordenação da busca e do clima.
- **Critérios de aceite:** busca vazia não chama gateway; seleção limpa relatório anterior e envia o `City` escolhido; retry reenvia a consulta/cidade que falhou; unidade inicial é Celsius e sua alteração não chama `getWeather`; resposta com requestId/cidade obsoletos não altera estado; estado não é escrito em storage, cookie ou servidor.
- **Rastreabilidade:** FR-01/02/05/07; AC-01.2, AC-02.1, AC-05.1/2, AC-07.2/3/5; NFR-05 e NFR-08; Plano, State Management.
- **Dependências:** T-03, T-07.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`.
- **Tipo:** Data

## Entrega 4 — Componentes

### T-09 — Criar campo de busca
- **Descrição:** implementar campo controlado e envio da consulta por botão ou Enter.
- **Critérios de aceite:** botão e Enter enviam consulta; aparar remove somente espaços nas pontas; vazio/só espaços mostra literalmente “Digite o nome de uma cidade.” e não chama busca; acentos e caracteres especiais são exibidos como texto; input e botão têm nome acessível e foco visível; não há overflow horizontal nos viewports NFR-01.
- **Rastreabilidade:** FR-01/06; AC-01.2/3/4 e AC-06.1; NFR-01/02.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/components/CitySearch.tsx`.
- **Tipo:** UI

### T-10 — Criar resultados de cidades
- **Descrição:** apresentar e permitir selecionar cidades retornadas pelo geocoding.
- **Critérios de aceite:** cada item exibe nome, região quando não nula e país; dois resultados homônimos aparecem como itens distintos; teclado seleciona o item focado e callback recebe exatamente seu objeto `City`; nome e estado são acessíveis; não há sobreposição/overflow nos viewports NFR-01.
- **Rastreabilidade:** FR-02/06; AC-01.1, AC-02.1 e AC-06.1; NFR-01/02.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/components/CityResults.tsx`.
- **Tipo:** UI

### T-11 — Criar painel de condições atuais
- **Descrição:** apresentar os dados meteorológicos atuais da cidade selecionada.
- **Critérios de aceite:** exibe cidade, horário, condição, temperatura, sensação térmica, umidade e vento; cada `null` aparece como “Indisponível” e zero é exibido como zero; temperaturas usam unidade ativa, vento km/h e texto pt-BR; conteúdo não se sobrepõe nem causa overflow nos viewports NFR-01.
- **Rastreabilidade:** FR-03/05/06; AC-03.1, AC-05.1/2 e AC-06.1; AC-07.5; NFR-01.
- **Dependências:** T-03, T-05, T-06.
- **Arquivos prováveis:** `src/components/CurrentConditions.tsx`.
- **Tipo:** UI

### T-12 — Criar previsão de cinco dias
- **Descrição:** apresentar os dados diários no fuso da cidade.
- **Critérios de aceite:** para forecast com cinco datas, renderiza exatamente cinco linhas na ordem recebida; cada linha apresenta data local, condição, mín./máx. e precipitação; campos `null` mostram “Indisponível”; datas usam timezone do relatório; linhas não se sobrepõem nem causam overflow nos viewports NFR-01.
- **Rastreabilidade:** FR-04/05/06; AC-04.1, AC-05.1/2 e AC-06.1; AC-07.5; NFR-01.
- **Dependências:** T-03, T-05, T-06.
- **Arquivos prováveis:** `src/components/FiveDayForecast.tsx`.
- **Tipo:** UI

### T-13 — Criar controle de unidade
- **Descrição:** implementar alternância acessível entre Celsius e Fahrenheit.
- **Critérios de aceite:** seleção inicial é Celsius; escolher Fahrenheit/Celsius chama callback com o valor correspondente; controle expõe nome e seleção acessíveis, foco visível e permanece utilizável nos viewports NFR-01.
- **Rastreabilidade:** FR-05/06; AC-05.1/2 e AC-06.1; NFR-01/02/08.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/components/TemperatureUnitControl.tsx`.
- **Tipo:** UI

### T-14 — Criar estados e retry
- **Descrição:** apresentar carregamento, vazio, erro e ação explícita de nova tentativa.
- **Critérios de aceite:** loading, vazio, erro e retry exibem textos definidos na spec em pt-BR; atualização de resultado/erro é anunciada por região live; retry tem nome acessível, foco visível, funciona por teclado e só executa após ação; mensagens não sobrepõem controles nos viewports NFR-01.
- **Rastreabilidade:** FR-06/07; AC-06.1, AC-07.1/2/3/4; NFR-01/02/05.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/components/RequestStatus.tsx`.
- **Tipo:** UI

## Entrega 5 — Primeira fatia visível: busca

### T-15 — Integrar busca e seleção em App
- **Descrição:** ligar hook, campo, lista e status para entregar primeiro o fluxo de descoberta de cidades.
- **Critérios de aceite:** a pessoa envia consulta, vê loading/resultados/vazio/erro, seleciona um resultado e o hook recebe exatamente a cidade escolhida; integração não renderiza dados meteorológicos ainda; componentes continuam sem chamadas de rede.
- **Rastreabilidade:** FR-01/02/06/07; AC-01.1 a AC-02.1, AC-06.1 e AC-07.1/2; NFR-02.
- **Dependências:** T-08, T-09, T-10, T-14.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI

## Entrega 6 — Integração do relatório

### T-16 — Integrar clima, previsão e unidade em App
- **Descrição:** completar a composição da tela com o relatório meteorológico e o controle de unidade.
- **Critérios de aceite:** fluxo completo busca, seleciona, consulta clima atual e cinco dias, alterna unidade e permite retry; cidade nova remove relatório anterior; layout mantém os cinco viewports NFR-01 sem overflow/sobreposição; inspeção confirma ausência de storage, geolocalização automática e polling.
- **Rastreabilidade:** FR-01 a FR-07; AC-01.1 a AC-07.5; NFR-01, NFR-05 e NFR-08; Plano, Architecture e Data Flow.
- **Dependências:** T-15, T-11, T-12, T-13.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI

## Entrega 7 — Testes

### T-17 — Testar mapeamento de respostas
- **Descrição:** cobrir normalização de geocoding, forecast completo, parcial e inválido.
- **Critérios de aceite:** Vitest passa com casos de geocoding válido/inválido, forecast completo, parcial e inválido; asserts verificam ID string, `null` para campo inválido, alinhamento diário, timezone inválido rejeitado, classificação `complete`/`partial` e rejeição sem dado utilizável.
- **Rastreabilidade:** FR-02/03/04/07; AC-02.1 e AC-07.5; Plano, Testing Strategy e Error Handling.
- **Dependências:** T-04.
- **Arquivos prováveis:** `tests/unit/lib/openMeteoMapper.test.ts`, `tests/fixtures/openMeteo.ts`.
- **Tipo:** Test

### T-18 — Testar conversões de temperatura
- **Descrição:** cobrir os casos-limite do formatador de temperatura.
- **Critérios de aceite:** Vitest passa para Celsius e Fahrenheit, ida e volta a partir da origem sem arredondamento, arredondamento de uma casa decimal, zero, negativo e `null`; teste não usa rede nem relógio.
- **Rastreabilidade:** FR-05; AC-05.1 e AC-05.2; Plano, Testing Strategy.
- **Dependências:** T-05.
- **Arquivos prováveis:** `tests/unit/lib/temperature.test.ts`.
- **Tipo:** Test

### T-19 — Testar datas e condições localizadas
- **Descrição:** cobrir formatação `pt-BR`, fusos e mapeamento de códigos WMO.
- **Critérios de aceite:** Vitest passa com timezone IANA explícito, data/horário determinísticos, pelo menos um código WMO mapeado e um desconhecido; o resultado localizado corresponde ao formato pt-BR esperado.
- **Rastreabilidade:** FR-03/04/06; AC-03.1, AC-04.1 e AC-06.1; Plano, Testing Strategy.
- **Dependências:** T-06.
- **Arquivos prováveis:** `tests/unit/lib/weatherFormat.test.ts`.
- **Tipo:** Test

### T-20 — Testar requests e falhas do gateway
- **Descrição:** verificar a construção das chamadas e classificação das falhas com `fetch` controlado.
- **Critérios de aceite:** Vitest substitui `globalThis.fetch` por mock; confirma URL e parâmetros esperados para geocoding e forecast e cobre sucesso, HTTP não-2xx, falha de rede e JSON inválido; todas as respostas vêm do mock e nenhuma chamada real é feita.
- **Rastreabilidade:** FR-01/02/03/04/07; AC-01.3, AC-01.4, AC-07.2; Plano, Testing Strategy.
- **Dependências:** T-07.
- **Arquivos prováveis:** `tests/unit/services/openMeteoService.test.ts`.
- **Tipo:** Test

### T-21 — Testar timeout e cancelamento do gateway
- **Descrição:** verificar limite por requisição e cancelamento de chamadas substituídas.
- **Critérios de aceite:** relógio falso comprova que 8 s causam abort e erro `timeout`; teste verifica limpeza do timer; abort externo não vira timeout; chamadas substituídas não atualizam resultado; spy confirma zero retries automáticos.
- **Rastreabilidade:** FR-07; AC-07.4; NFR-05; Plano, Architecture, External APIs e Testing Strategy.
- **Dependências:** T-07.
- **Arquivos prováveis:** `tests/unit/services/openMeteoService.test.ts`.
- **Tipo:** Test

### T-22 — Testar busca e retry do hook
- **Descrição:** testar estados da busca, validação e retry com gateway falso.
- **Critérios de aceite:** Vitest confirma zero chamadas para consulta vazia; exercita estados loading, success com resultados, empty e error; retry envia exatamente a consulta que falhou e sucesso encerra o estado de loading/erro.
- **Rastreabilidade:** FR-01/07; AC-01.2 e AC-07.1/2/3; Plano, Testing Strategy.
- **Dependências:** T-08.
- **Arquivos prováveis:** `tests/unit/hooks/useWeatherApp.test.tsx`.
- **Tipo:** Test

### T-23 — Testar seleção e concorrência do hook
- **Descrição:** testar consulta meteorológica selecionada e descarte de respostas antigas.
- **Critérios de aceite:** testes com promises adiadas confirmam que somente resposta do requestId/cidade ativa altera clima; selecionar outra cidade limpa o relatório anterior e envia as novas coordenadas; retry reusa a cidade falha; alternar unidade não incrementa chamadas a `getWeather`.
- **Rastreabilidade:** AC-02.1, AC-05.1/2 e AC-07.2/3; NFR-05; Plano, State Management e Testing Strategy.
- **Dependências:** T-08.
- **Arquivos prováveis:** `tests/unit/hooks/useWeatherApp.test.tsx`.
- **Tipo:** Test

### T-24 — Testar busca e resultados
- **Descrição:** testar interação, conteúdo e acessibilidade dos componentes de cidade.
- **Critérios de aceite:** Testing Library confirma envio por Enter e botão, mensagem e ausência de callback para vazio, preservação de texto com acentos/especiais, nome/região/país, dois homônimos distintos e seleção por teclado com callback para o item correto.
- **Rastreabilidade:** AC-01.1/2/3/4, AC-02.1 e NFR-02.
- **Dependências:** T-09, T-10.
- **Arquivos prováveis:** `tests/unit/components/CitySearch.test.tsx`, `tests/unit/components/CityResults.test.tsx`.
- **Tipo:** Test

### T-25 — Testar condições atuais
- **Descrição:** verificar apresentação dos dados meteorológicos atuais.
- **Critérios de aceite:** Testing Library verifica os seis campos de AC-03.1; teste parcial confirma “Indisponível” para cada null e preserva zero; teste verifica unidade ativa, código desconhecido e horário localizado.
- **Rastreabilidade:** AC-03.1, AC-05.1/2, AC-06.1 e AC-07.5.
- **Dependências:** T-11.
- **Arquivos prováveis:** `tests/unit/components/CurrentConditions.test.tsx`.
- **Tipo:** Test

### T-26 — Testar previsão diária
- **Descrição:** verificar conteúdo e datas da previsão de cinco dias.
- **Critérios de aceite:** Testing Library com fixture de cinco datas verifica exatamente cinco linhas consecutivas, no timezone do relatório, os campos de AC-04.1, unidade ativa e “Indisponível” em valores null sem substituí-los por zero.
- **Rastreabilidade:** AC-04.1, AC-05.1/2, AC-06.1 e AC-07.5; NFR-01.
- **Dependências:** T-12.
- **Arquivos prováveis:** `tests/unit/components/FiveDayForecast.test.tsx`.
- **Tipo:** Test

### T-27 — Testar estados loading, erro e vazio
- **Descrição:** verificar que o componente de status apresenta estados de busca/clima e retry.
- **Critérios de aceite:** Testing Library renderiza separadamente `loading`, `empty` e `error`; cada estado apresenta a mensagem definida na spec; erro e mudança de resultado são anunciados; retry tem nome acessível e só chama callback após interação por teclado ou ponteiro.
- **Rastreabilidade:** AC-06.1, AC-07.1/2/3 e NFR-02/05.
- **Dependências:** T-14.
- **Arquivos prováveis:** `tests/unit/components/RequestStatus.test.tsx`.
- **Tipo:** Test

### T-28 — Testar controle de unidade
- **Descrição:** verificar interação acessível do controle Celsius/Fahrenheit.
- **Critérios de aceite:** Testing Library confirma Celsius inicial, callback `fahrenheit` ao escolher °F, callback `celsius` ao escolher °C, nome acessível e operação por teclado.
- **Rastreabilidade:** AC-05.1/2, AC-06.1 e NFR-02.
- **Dependências:** T-13.
- **Arquivos prováveis:** `tests/unit/components/TemperatureUnitControl.test.tsx`.
- **Tipo:** Test

### T-29 — Testar integração da aplicação
- **Descrição:** validar a composição completa com gateway falso.
- **Critérios de aceite:** teste de integração executa busca, seleciona o segundo de dois resultados, confirma coordenadas correspondentes no gateway falso, renderiza clima/previsão, alterna unidade e executa retry; nenhum request real ocorre.
- **Rastreabilidade:** AC-01.1, AC-02.1, AC-03.1, AC-04.1, AC-05.1/2 e AC-07.3; NFR-05.
- **Dependências:** T-15, T-16, T-22, T-23, T-24, T-25, T-26, T-27, T-28.
- **Arquivos prováveis:** `tests/integration/weatherApp.test.tsx`.
- **Tipo:** Test

### T-30 — Testar E2E da busca e seleção
- **Descrição:** automatizar fluxo de geocoding com rotas interceptadas no Playwright.
- **Critérios de aceite:** Playwright intercepta todas as rotas; asserts cobrem envio por botão e Enter, zero requests para input vazio, texto acentuado, dois homônimos com metadados, seleção da cidade esperada e estados empty/error/retry; nenhuma chamada sai para Open-Meteo.
- **Rastreabilidade:** AC-01.1/2/3/4, AC-02.1 e AC-07.1/2/3; NFR-05.
- **Dependências:** T-15.
- **Arquivos prováveis:** `tests/e2e/weather-search.spec.ts`.
- **Tipo:** Test

### T-31 — Testar E2E do relatório meteorológico
- **Descrição:** automatizar renderização do clima, previsão, conversão e recuperação de falhas.
- **Critérios de aceite:** Playwright com rotas determinísticas verifica seis campos atuais, exatamente cinco dias, resposta parcial com “Indisponível”, C→F→C para todos os campos de temperatura sem request adicional, erro, timeout em 8 s e retry manual bem-sucedido.
- **Rastreabilidade:** AC-03.1, AC-04.1, AC-05.1/2 e AC-07.2/3/4/5; NFR-05.
- **Dependências:** T-16, T-29.
- **Arquivos prováveis:** `tests/e2e/weather-report.spec.ts`.
- **Tipo:** Test

### T-32 — Testar E2E do fluxo principal em viewport mobile
- **Descrição:** executar a jornada completa de busca até alternância de unidade em viewport mobile.
- **Critérios de aceite:** Playwright usa viewport 390×844 px; intercepta geocoding e forecast; executa busca, seleciona um resultado, confirma clima atual e previsão de cinco dias, alterna C→F e verifica que não houve request extra; o teste passa sem chamadas reais à Open-Meteo.
- **Rastreabilidade:** AC-01.1, AC-02.1, AC-03.1, AC-04.1 e AC-05.1; NFR-01/05.
- **Dependências:** T-16, T-29, T-30, T-31.
- **Arquivos prováveis:** `tests/e2e/weather-main-flow.spec.ts`.
- **Tipo:** Test

## Entrega 8 — Hardening e gates de release

### T-33 — Validar responsividade
- **Descrição:** exercitar os fluxos principais nos viewports definidos pela spec.
- **Critérios de aceite:** Playwright executa o fluxo de busca, seleção, consulta e unidade em 320, 390, 768, 1024 e 1440 px; em cada largura `scrollWidth <= clientWidth` e nenhum controle/conteúdo essencial se sobrepõe; falha em qualquer largura reprova a tarefa.
- **Rastreabilidade:** NFR-01.
- **Dependências:** T-30, T-31, T-32.
- **Arquivos prováveis:** `tests/e2e/weather-responsive.spec.ts`.
- **Tipo:** Test

### T-34 — Validar acessibilidade dos fluxos principais
- **Descrição:** verificar navegação por teclado, foco, nomes/estados e anúncios de atualização/erro.
- **Critérios de aceite:** checklist registra busca, seleção, unidade e retry completados só por teclado; cada controle interativo tem nome/estado acessível e foco visível; medição encontra contraste mínimo 4,5:1 para texto normal e 3:1 para texto grande/componentes; leitor de tela anuncia erro e resultado; falha em requisito reprova a validação.
- **Rastreabilidade:** NFR-02; AC-06.1 e AC-07.2.
- **Dependências:** T-30, T-31, T-32.
- **Arquivos prováveis:** `tests/e2e/weather-accessibility.spec.ts`.
- **Tipo:** Test

### T-35 — Medir performance mobile
- **Descrição:** medir latência do fluxo de seleção até a renderização dos dados obrigatórios.
- **Critérios de aceite:** harness completa 100 execuções em 390×844 px sob 150 ms RTT, 10 Mbps downstream e 2 Mbps upstream; relatório contém p95 end-to-end e duração separada da aplicação/provedor; p95 acima de 3 s é registrado como falha da meta, não como aprovação; consulta/localização não é persistida nem enviada a telemetria.
- **Rastreabilidade:** NFR-03 e NFR-08; Plano, Testing Strategy.
- **Dependências:** T-31, T-32.
- **Arquivos prováveis:** `tests/e2e/weather-performance.spec.ts`, `docs/performance-validation.md`.
- **Tipo:** Test

### T-36 — Validar matriz de navegadores
- **Descrição:** executar os fluxos principais nos navegadores e versões da NFR-06.
- **Critérios de aceite:** relatório contém resultado individual para versão estável atual e anterior de Chrome, Edge, Firefox e Safari desktop e para Safari iOS/Chrome Android atuais; fluxo busca-seleção-consulta-unidade passa em cada ambiente executado; ambiente indisponível é marcado “não verificado”, nunca aprovado.
- **Rastreabilidade:** NFR-06.
- **Dependências:** T-30, T-31, T-32.
- **Arquivos prováveis:** `playwright.config.ts`, `docs/browser-validation.md`.
- **Tipo:** Test

### T-37 — Aprovar baseline de produto
- **Descrição:** obter decisão explícita sobre campos, respostas parciais, timeout, metas NFR e retenção antes do congelamento da spec.
- **Critérios de aceite:** spec registra status aprovado/alterado/pendente para campos, política parcial, timeout, NFR-01 a NFR-08 e retenção; cada alteração atualiza os critérios afetados; nenhum item pendente é descrito como concluído.
- **Rastreabilidade:** Spec, Acceptance Criteria (baseline proposta), NFR-01 a NFR-08 e Open Questions 1, 4 e 6.
- **Dependências:** T-33, T-34, T-35, T-36.
- **Arquivos prováveis:** `specs/weather-app-spec.md`.
- **Tipo:** Infra

### T-38 — Validar condições de uso da Open-Meteo
- **Descrição:** confirmar adequação do provedor ao uso pretendido em produção.
- **Critérios de aceite:** documento cita evidência/fonte e status aprovado, reprovado ou pendente para cobertura, CORS, termos, atribuição, quotas e disponibilidade; qualquer item reprovado/pendente está marcado como bloqueio de release.
- **Rastreabilidade:** Plano, External APIs e Risks & Trade-offs; Spec, Assumptions, Risks e Open Question 2; NFR-04.
- **Dependências:** nenhuma; gate de release.
- **Arquivos prováveis:** `docs/provider-validation.md`.
- **Tipo:** Infra

### T-39 — Definir gate de disponibilidade operacional
- **Descrição:** decidir como avaliar e medir a meta mensal de 99,5% sem introduzir coleta não aprovada.
- **Critérios de aceite:** documento define numerador/denominador conforme sucesso de NFR-04, exclusões, registro separado de falha do provedor e estratégia aprovada de medição; se qualquer definição ou aprovação faltar, status é bloqueado; não há backend/telemetria com consulta ou localização sem aprovação explícita.
- **Rastreabilidade:** NFR-04 e NFR-08; Plano, Error Handling, Testing Strategy e Risks & Trade-offs; Spec, Open Question 6.
- **Dependências:** T-37, T-38.
- **Arquivos prováveis:** `docs/availability-validation.md`.
- **Tipo:** Infra

### T-40 — Registrar público, usabilidade e frescor
- **Descrição:** resolver ou preservar como pendentes as decisões de público prioritário, protocolo de usabilidade e idade aceitável dos dados.
- **Critérios de aceite:** spec registra público aprovado ou pendente; protocolo define cinco participantes representativos e critério mensurável de sucesso (ao menos 4 concluem busca/seleção/consulta sem ajuda); registra idade máxima/cadência aprovada ou pendente; sem decisão de produto, não se implementa polling.
- **Rastreabilidade:** NFR-07/08; Spec, Open Questions 5 e 7, Risks e Out of Scope; Plano, Risks & Trade-offs.
- **Dependências:** T-37.
- **Arquivos prováveis:** `specs/weather-app-spec.md`.
- **Tipo:** Infra