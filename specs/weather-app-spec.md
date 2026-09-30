# Especificação de Produto — Weather App

## Overview

O Weather App permite que pessoas encontrem cidades e consultem as condições meteorológicas atuais e a previsão para cinco dias. A interface oferece temperaturas em Celsius ou Fahrenheit, começa em Celsius e é apresentada em português do Brasil.

O produto será acessível sem autenticação e não manterá dados de usuário em servidor. Open-Meteo foi escolhido como fonte de dados, sem API key. Cobertura, termos de uso, limites e demais condições do provedor ainda precisam ser validados antes do lançamento.

As histórias usam três arquétipos provisórios: pessoa que se desloca diariamente, pessoa planejando uma viagem e pessoa organizando atividade ao ar livre. São hipóteses, não segmentos validados, e o discovery atual não define público prioritário nem métricas de sucesso.

## Functional Requirements

- **FR-01 — Buscar cidades:** aceitar nomes completos ou parciais de cidades; remover espaços periféricos e preservar acentos, espaços internos, hífens e apóstrofos. Não enviar consultas vazias. A busca é iniciada por botão ou Enter; autocomplete não faz parte da V1.
- **FR-02 — Selecionar cidade:** exibir cada resultado com nome da cidade, região administrativa quando disponível e país. Ao selecionar um resultado, usar seu identificador e coordenadas para as consultas meteorológicas.
- **FR-03 — Consultar clima atual:** exibir cidade, horário da observação, condição meteorológica em pt-BR, temperatura, sensação térmica, umidade relativa e velocidade do vento em km/h. Um campo ausente deve ser marcado como indisponível, nunca substituído por zero.
- **FR-04 — Consultar previsão de cinco dias:** exibir uma linha por dia para hoje e os quatro dias seguintes no fuso horário da cidade, com condição meteorológica em pt-BR, temperaturas mínima/máxima e probabilidade máxima de precipitação em percentual.
- **FR-05 — Alternar unidade de temperatura:** iniciar em Celsius e permitir alternar Celsius/Fahrenheit em todos os campos de temperatura. Converter a partir dos valores de origem e arredondar a uma casa decimal.
- **FR-06 — Exibir interface em pt-BR:** apresentar em português do Brasil todos os textos, mensagens, condições meteorológicas, datas e unidades localizadas.
- **FR-07 — Comunicar resultados, carregamento e falhas:** apresentar estados de carregamento, vazio, erro e resposta parcial. Para qualquer falha de consulta, oferecer nova tentativa manual; nunca repetir automaticamente a solicitação.

## User Stories

- **US-01 — Encontrar uma cidade (FR-01, FR-02):** Como pessoa que se desloca diariamente, quero buscar e selecionar minha cidade para consultar o tempo do lugar correto.
- **US-02 — Consultar condições atuais (FR-03):** Como pessoa que se desloca diariamente, quero ver o clima atual da cidade selecionada para me preparar antes de sair.
- **US-03 — Planejar uma viagem (FR-04):** Como pessoa planejando uma viagem, quero consultar a previsão de hoje e dos quatro dias seguintes no destino para me preparar para a estadia.
- **US-04 — Escolher o dia da atividade (FR-04):** Como pessoa organizando atividade ao ar livre, quero comparar a previsão dos próximos cinco dias para escolher quando realizar minha atividade.
- **US-05 — Preferir uma unidade de temperatura (FR-05):** Como pessoa planejando uma viagem, quero alternar entre Celsius e Fahrenheit para interpretar as temperaturas na unidade que prefiro.
- **US-06 — Recuperar uma consulta (FR-07):** Como pessoa que se desloca diariamente, quero entender quando a busca não encontra uma cidade ou uma consulta falha e poder tentar novamente para continuar minha consulta.
- **US-07 — Entender a interface (FR-06):** Como pessoa organizando atividade ao ar livre, quero usar a interface em pt-BR para compreender a busca, a previsão e as mensagens do app.

As histórias e arquétipos precisam ser validados com usuários representativos antes de serem usados para priorização.

## Acceptance Criteria

### FR-01 — Buscar cidades

- **AC-01.1**
	- **Given:** a pessoa informa uma consulta não vazia e o serviço de geocoding retorna duas cidades de teste.
	- **When:** ela envia a busca pelo botão ou pela tecla Enter.
	- **Then:** a interface apresenta exatamente as duas cidades retornadas, cada uma com nome, região administrativa quando disponível e país.
- **AC-01.2**
	- **Given:** o campo de busca contém somente espaços ou está vazio.
	- **When:** a pessoa tenta enviar a busca.
	- **Then:** nenhuma requisição de geocoding é feita e a interface informa “Digite o nome de uma cidade.”
- **AC-01.3**
	- **Given:** a consulta contém acentos, espaços internos, hífen ou apóstrofo.
	- **When:** a pessoa envia a busca.
	- **Then:** o serviço recebe esses caracteres preservados como valor de consulta e a interface os trata como texto, nunca como marcação ou código.
- **AC-01.4**
	- **Given:** a pessoa informa uma consulta com espaços no início ou no fim e espaços internos significativos.
	- **When:** a busca é enviada.
	- **Then:** espaços periféricos são removidos e espaços internos são preservados no valor enviado ao serviço.

### FR-02 — Selecionar cidade

- **AC-02.1**
	- **Given:** a lista contém duas cidades com identificadores e coordenadas distintos.
	- **When:** a pessoa seleciona o segundo resultado.
	- **Then:** o segundo resultado é identificado como cidade selecionada, e somente seu identificador/coordenadas são usados nas consultas meteorológicas seguintes.

### FR-03 — Consultar clima atual

- **AC-03.1**
	- **Given:** há uma cidade selecionada e o serviço retorna horário da observação, condição, temperatura, sensação térmica, umidade relativa e velocidade do vento.
	- **When:** a consulta termina com sucesso.
	- **Then:** a interface identifica a cidade e exibe os seis campos retornados, com temperatura na unidade ativa e horário formatado em pt-BR.

### FR-04 — Consultar previsão de cinco dias

- **AC-04.1**
	- **Given:** há uma cidade selecionada, um relógio de teste fixo e dados diários para hoje e os quatro dias seguintes no fuso da cidade.
	- **When:** a consulta da previsão termina com sucesso.
	- **Then:** a interface exibe exatamente cinco linhas diárias consecutivas nesse fuso, cada uma com condição, temperaturas mínima/máxima e probabilidade máxima de precipitação.

### FR-05 — Alternar unidade de temperatura

- **AC-05.1**
	- **Given:** a interface exibe temperaturas e a unidade padrão Celsius.
	- **When:** a pessoa seleciona Fahrenheit.
	- **Then:** todos os valores de temperatura visíveis são apresentados em °F e correspondem a $F = (C \times 9/5) + 32$, arredondados a uma casa decimal.
- **AC-05.2**
	- **Given:** a interface exibe temperaturas em Fahrenheit.
	- **When:** a pessoa seleciona Celsius.
	- **Then:** todos os valores de temperatura visíveis são apresentados em °C e correspondem a $C = (F - 32) \times 5/9$, arredondados a uma casa decimal.

### FR-06 — Exibir interface em pt-BR

- **AC-06.1**
	- **Given:** qualquer tela ou estado de busca, resultado, clima, previsão, carregamento, vazio ou erro.
	- **When:** a interface é apresentada.
	- **Then:** todo texto visível ao usuário, incluindo datas, unidades, condições meteorológicas, acessibilidade e erros, está em pt-BR.

### FR-07 — Comunicar resultados e falhas

- **AC-07.1**
	- **Given:** o serviço de busca retorna uma lista vazia.
	- **When:** a busca termina.
	- **Then:** a interface informa “Nenhuma cidade encontrada.”, encerra o carregamento e permite editar e reenviar a consulta.
- **AC-07.2**
	- **Given:** uma consulta falha por erro de rede, resposta inválida ou indisponibilidade do serviço.
	- **When:** a falha é recebida.
	- **Then:** a interface encerra o carregamento, apresenta “Não foi possível carregar os dados. Tente novamente.” e oferece a ação “Tentar novamente”, sem repetir a requisição automaticamente.
- **AC-07.3**
	- **Given:** uma consulta falhou e a ação de nova tentativa está disponível.
	- **When:** a pessoa aciona nova tentativa e o serviço responde com sucesso.
	- **Then:** o estado de erro é substituído pelos dados retornados e o carregamento é encerrado.
- **AC-07.4**
	- **Given:** uma requisição de geocoding ou meteorológica permanece pendente por 8 segundos.
	- **When:** o limite de timeout é atingido.
	- **Then:** a requisição é considerada encerrada, o carregamento é removido e a mensagem de erro com nova tentativa é exibida.
- **AC-07.5**
	- **Given:** a resposta contém pelo menos um campo ou dia válido e outros campos ou dias ausentes ou inválidos.
	- **When:** a resposta é apresentada.
	- **Then:** os dados válidos são exibidos, cada valor ausente é identificado como “Indisponível” e nenhum valor é substituído por zero ou dado antigo.

**Linha de base para os testes:** os campos, granularidade diária, fuso local da cidade, textos de estado, timeout de 8 segundos e arredondamento de uma casa decimal acima são defaults propostos nesta especificação. Requerem aprovação do responsável pelo produto antes do congelamento da baseline.

## Non-Functional Requirements

- **NFR-01 — Responsividade:** suportar larguras de 320 px a 1440 px. Nos viewports de 320, 390, 768, 1024 e 1440 px, os fluxos de buscar, selecionar, consultar e alternar unidade devem permanecer utilizáveis, sem rolagem horizontal da página nem sobreposição de controles.
- **NFR-02 — Acessibilidade:** atender WCAG 2.2 nível AA nos fluxos principais. Busca, seleção, alternância e retry devem ser operáveis por teclado, ter foco visível e nome/estado acessível; erros e atualizações de resultado devem ser anunciados por tecnologia assistiva. Contraste mínimo: 4,5:1 para texto normal e 3:1 para texto grande e componentes gráficos relevantes.
- **NFR-03 — Performance:** em 100 execuções automatizadas no viewport mobile 390 x 844 px, com perfil de rede 4G (150 ms RTT, 10 Mbps downstream e 2 Mbps upstream), o percentil 95 entre seleção da cidade e renderização dos campos obrigatórios de clima atual e previsão deve ser de até 3 segundos. Registrar separadamente duração da aplicação e do provedor; a meta end-to-end inclui ambos.
- **NFR-04 — Disponibilidade:** meta de 99,5% de consultas meteorológicas bem-sucedidas por mês, excluindo manutenções anunciadas. Sucesso significa receber dados suficientes para renderizar clima atual e previsão sem erro fatal. Falha do Open-Meteo conta como falha end-to-end e também deve ser registrada separadamente. Validar se essa meta é compatível com os termos/SLA do provedor antes do lançamento.
- **NFR-05 — Resiliência:** limitar cada requisição a 8 segundos; ao expirar, encerrar o carregamento e permitir retry manual. Não repetir automaticamente. Resultados de uma requisição antiga não devem sobrescrever os da cidade selecionada mais recentemente.
- **NFR-06 — Compatibilidade:** suportar as versões estáveis atual e anterior de Chrome, Edge, Firefox e Safari desktop, além de Safari no iOS atual e Chrome no Android atual. Executar os fluxos principais nos viewports NFR-01 antes de cada release.
- **NFR-07 — Usabilidade:** em teste moderado com cinco participantes representativos do público prioritário, pelo menos quatro devem concluir busca, seleção e consulta sem ajuda; registrar falhas e tempo por tarefa. O público prioritário ainda precisa ser aprovado.
- **NFR-08 — Privacidade e retenção:** não exigir conta, não persistir dados de usuário em servidor e não usar geolocalização automática. Não persistir cidade, histórico ou unidade no dispositivo nesta versão; a preferência de unidade dura apenas durante a sessão. Telemetria que inclua consulta ou localização requer aprovação explícita.

As metas NFR-02 a NFR-07 e a política local de retenção são uma baseline proposta para aprovação. NFR-04 é gate de lançamento até a validação de disponibilidade do provedor.

## Matriz de Rastreabilidade

A matriz liga cada User Story aos critérios de aceite que a verificam e aos requisitos não funcionais que restringem sua implementação ou validação. Os critérios e NFRs são referenciados pelos IDs definidos acima; um mesmo critério pode cobrir mais de uma história.

| User Story | Acceptance Criteria | NFRs relevantes |
|---|---|---|
| **US-01 — Encontrar uma cidade** | AC-01.1 a AC-01.4; AC-02.1; AC-07.1 a AC-07.4 | NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-06, NFR-07, NFR-08 |
| **US-02 — Consultar condições atuais** | AC-03.1; AC-07.2 a AC-07.5 | NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-06, NFR-07 |
| **US-03 — Planejar uma viagem** | AC-04.1; AC-07.2 a AC-07.5 | NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-06, NFR-07 |
| **US-04 — Escolher o dia da atividade** | AC-04.1; AC-07.2 a AC-07.5 | NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-06, NFR-07 |
| **US-05 — Preferir uma unidade de temperatura** | AC-05.1, AC-05.2 | NFR-01, NFR-02, NFR-06, NFR-08 |
| **US-06 — Recuperar uma consulta** | AC-01.2; AC-07.1 a AC-07.5 | NFR-01, NFR-02, NFR-05, NFR-06, NFR-07, NFR-08 |
| **US-07 — Entender a interface** | AC-06.1 | NFR-01, NFR-02, NFR-06, NFR-07 |

## Edge Cases

| Cenário | Comportamento esperado |
|---|---|
| **Cidade inexistente / geocoding sem resultados:** a fonte retorna uma lista vazia para a consulta. | Mostrar “Nenhuma cidade encontrada.”, encerrar o carregamento, permitir editar e reenviar a consulta e não iniciar consulta meteorológica. |
| **Input vazio:** o campo está vazio ou contém apenas espaços quando a pessoa envia a busca. | Não chamar geocoding; mostrar validação junto ao campo, manter a busca disponível para edição e não substituir resultados atuais por dados de uma consulta vazia. |
| **Caracteres especiais:** a consulta contém acentos, espaços, hífens ou apóstrofos válidos em nomes, ou caracteres que poderiam ser interpretados como marcação/código. | Preservar caracteres válidos como texto na consulta. Codificar/parâmetrizar a entrada para o serviço e exibi-la como texto, sem interpretá-la como HTML ou código. Uma consulta sem correspondência segue o estado de nenhum resultado. |
| **Falha de API:** o serviço responde com erro, resposta inválida ou indisponibilidade. | Encerrar o carregamento, manter a aplicação utilizável, informar que os dados não puderam ser obtidos e oferecer nova tentativa. Não apresentar uma resposta inválida como dado meteorológico válido. |
| **Timeout:** a solicitação não termina em até 8 segundos. | Encerrar a requisição, remover o estado de carregamento, exibir a mensagem de falha e oferecer retry manual; não repetir automaticamente. |
| **Resposta parcial:** a fonte retorna alguns campos ou dias válidos, mas outros ausentes, nulos ou inválidos. | Exibir cada campo/dia válido; para valor ausente, exibir “Indisponível”. Manter as cinco datas da previsão, não inventar valores nem substituir dados ausentes por dados antigos. |
| **Homônimos:** o geocoding retorna cidades distintas com o mesmo nome. | Apresentar cada correspondência separadamente com nome da cidade, região administrativa quando disponível e país. |
| **Dados armazenados em cache:** uma resposta anterior está disponível no cache do cliente ou intermediário. | A aplicação não reutiliza cache próprio de clima; cada consulta solicita dados atuais ao provedor. Se uma resposta do provedor incluir horário de observação antigo, exibir esse horário sem apresentá-lo como atual. |
| **Previsão cruza a mudança de data:** o relógio local do dispositivo e a data local da cidade selecionada são diferentes. | Agrupar e rotular hoje e os quatro dias seguintes no fuso da cidade selecionada, independentemente do fuso do dispositivo. |
| **Alternância de unidade durante carregamento:** a pessoa muda Celsius/Fahrenheit enquanto uma consulta está pendente. | Aplicar a unidade selecionada tanto aos dados já visíveis quanto aos dados recebidos depois; não mostrar valores com rótulo incompatível com a unidade. |
| **Viewport pequeno ou conteúdo extenso:** busca, nomes de cidade ou previsão excedem o espaço visível. | Manter controles e conteúdo essenciais acessíveis no viewport suportado, sem sobreposição nem rolagem horizontal da página. |

## Assumptions

- Open-Meteo é a fonte escolhida para dados meteorológicos e busca de cidades; o uso está condicionado à validação de cobertura, termos, limites e atribuição aplicáveis.
- A previsão é diária e contém hoje e os quatro dias seguintes, usando o fuso horário da cidade selecionada.
- O conjunto de campos é o definido em FR-03 e FR-04; campos ausentes são apresentados como “Indisponível”.
- Celsius é a unidade inicial; Fahrenheit também estará disponível; a conversão é arredondada a uma casa decimal.
- A interface e as condições meteorológicas serão exibidas em pt-BR, com datas no formato `dd/MM/yyyy`.
- A busca aceita nomes de cidades completos ou parciais, não códigos postais; não haverá autocomplete na V1.
- A pessoa seleciona uma cidade antes da consulta meteorológica; geolocalização automática não faz parte da V1.
- Não haverá autenticação, persistência em servidor, armazenamento local de busca/unidade nem cache próprio de clima. A unidade vale durante a sessão.
- A aplicação usará Open-Meteo sem API key, condicionado à aprovação dos termos, cobertura e limites de uso para produção.
- As metas NFR são uma baseline proposta, sujeita a aprovação; as personas continuam hipóteses, não segmentos validados.

## Risks

| Risco | Probabilidade inicial | Impacto | Mitigação |
|---|---|---|---|
| Necessidades do público e prioridade entre personas não validadas | Alta | O produto pode ter baixa adoção ou otimizar o fluxo errado. | Validar personas e protótipos; definir objetivo e métrica de sucesso com stakeholders e usuários. |
| Termos, cobertura, atribuição ou limites do Open-Meteo incompatíveis com o uso pretendido | Média | Consultas podem ser limitadas ou o lançamento/comercialização pode ser bloqueado. | Validar termos, cobertura e limites antes de fechar a integração e o plano de operação. |
| Ambiguidade na busca ou cidades homônimas | Alta | O usuário pode receber dados de uma cidade diferente da desejada. | Exibir cidade, região administrativa quando disponível e país; validar com fixtures de homônimos que cada opção continua distinguível. |
| Idade máxima e atualização de dados ainda não definidas | Média | Dados podem ser interpretados como atuais apesar de estarem defasados. | Exibir horário da observação, não manter cache próprio e aprovar uma política de atualização/frescor antes do lançamento. |
| Dependência externa degrada performance ou disponibilidade | Média | Busca lenta ou indisponível, mesmo que a aplicação esteja operacional. | Medir provedor e aplicação separadamente; acordar SLO, timeouts, limites, estados de erro e política de cache permitida. |
| Falha em conversão ou identificação das unidades | Média | Temperaturas podem ser inconsistentes ou enganosas. | Aplicar unidade de forma uniforme, definir arredondamento e validar conversões e limites. |
| Barreiras de acessibilidade ou incompatibilidade em dispositivos | Média | Parte dos usuários pode não conseguir completar o fluxo. | Aprovar matriz de suporte e validar teclado, leitor de tela, contraste e viewports antes da homologação. |
| Geolocalização ou telemetria introduz coleta de dados não decidida | Baixa/média | Risco de privacidade, perda de confiança e obrigações não atendidas. | Não presumir geolocalização; decidir necessidade, consentimento, retenção e telemetria antes de incluí-las. |

Probabilidades são estimativas iniciais do discovery, não baseadas em dados operacionais.

## Out of Scope

- Autenticação, criação de conta e persistência de dados de usuário em servidor.
- Persistência local de cidade, histórico de busca e preferência de unidade; a unidade é mantida apenas durante a sessão.
- Geolocalização automática, alertas meteorológicos, notificações, widgets e recursos sociais.
- Suporte offline e cache próprio de dados meteorológicos.
- Busca por código postal e sugestões/autocomplete durante a digitação.
- Previsão horária; a previsão da V1 é diária para hoje e os quatro dias seguintes.
- Histórico meteorológico de dias anteriores.
- Comparação simultânea de condições ou previsões entre cidades.
- Mapas meteorológicos, camadas geográficas e visualização por radar.
- Interface ou conteúdo em idiomas além de pt-BR.

## Open Questions

1. O responsável pelo produto aprova os campos de clima atual/previsão, unidades, política para resposta parcial e apresentação de valores indisponíveis?
2. Open-Meteo permite o uso pretendido em produção nos mercados-alvo, incluindo cobertura, termos, atribuição, quotas e disponibilidade?
3. A busca por nomes completos/parciais, sem códigos postais nem autocomplete, e os campos de desambiguação dos resultados atendem ao uso esperado?
4. O responsável pelo produto aprova os defaults de previsão diária no fuso da cidade, timeout de 8 segundos, retry manual e ausência de persistência local?
5. Qual é a cadência de atualização e a idade máxima aceitável para dados apresentados como atuais? Há atualização automática enquanto a tela permanece aberta?
6. As metas de 95% em até 3 segundos, 99,5% de consultas bem-sucedidas, WCAG 2.2 AA, teste de usabilidade e matriz de navegadores são aprovadas? A meta de disponibilidade depende de validação do provedor.
7. Qual arquétipo de usuário e mercado são prioritários, e qual métrica de negócio define sucesso? Atualizar o discovery para registrar essa decisão e as decisões de produto adotadas na especificação.