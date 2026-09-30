# Análise de Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa solicitou uma aplicação de previsão do tempo para que usuários consultem condições meteorológicas de cidades. A experiência deve contemplar busca de cidades, consulta do clima atual, previsão para cinco dias, alternância entre Celsius e Fahrenheit e uso em dispositivos móveis.

O briefing não define público-alvo específico, regras de busca, nem requisitos operacionais. Esses pontos precisam ser esclarecidos antes de fechar a especificação do produto e o plano técnico.

## Requisitos Funcionais

- **RF-01 — Buscar cidades:** permitir que o usuário pesquise cidades para consultar informações meteorológicas.
- **RF-02 — Consultar clima atual:** exibir as condições meteorológicas atuais da cidade selecionada.
- **RF-03 — Consultar previsão:** exibir a previsão do tempo para cinco dias da cidade selecionada.
- **RF-04 — Alternar unidade de temperatura:** permitir alternar entre Celsius e Fahrenheit para os valores de temperatura apresentados.

## Requisitos Não-Funcionais

- **RNF-01 — Responsividade:** conteúdo e controles principais devem funcionar em larguras de viewport de 320 px a 1440 px, sem rolagem horizontal da página e sem perda de funcionalidade.
- **RNF-02 — Usabilidade:** busca, consulta da previsão e alternância de unidade devem ter rótulos e feedback compreensíveis, permitindo completar o fluxo principal sem instruções externas.
- **RNF-03 — Acessibilidade:** os fluxos principais devem ser operáveis por teclado, expor nomes e estados compreensíveis a tecnologias assistivas e atender ao WCAG 2.2 nível AA.
- **RNF-04 — Performance:** como meta inicial a validar, 95% das consultas devem exibir os dados meteorológicos em até 3 segundos após a seleção da cidade, em condições de rede e teste acordadas. A medição deve registrar separadamente a latência da aplicação e a do provedor externo.
- **RNF-05 — Disponibilidade:** como meta inicial a validar, a aplicação deve manter 99,5% de disponibilidade mensal, excluindo manutenções programadas. A disponibilidade do provedor externo é uma dependência e deve ser monitorada separadamente.
- **RNF-06 — Resiliência a falhas:** diante de falhas de rede, respostas inválidas ou indisponibilidade do provedor, a interface deve apresentar um estado de erro compreensível e uma opção de nova tentativa, sem permanecer em carregamento indefinido.
- **RNF-07 — Compatibilidade:** a aplicação deve funcionar nos navegadores desktop e móveis definidos para suporte pelo produto; a matriz de navegadores e versões deve ser acordada antes da especificação final.

As metas numéricas de performance e disponibilidade, assim como o nível de conformidade de acessibilidade e a matriz de navegadores, são propostas iniciais e precisam ser validadas com as partes interessadas. O briefing não define esses parâmetros.

## Riscos

As probabilidades abaixo são estimativas iniciais baseadas nas lacunas do briefing, não em dados operacionais. Devem ser reavaliadas após validar os termos e a cobertura do provedor escolhido, definir o público-alvo e confirmar os requisitos.

| Risco | Probabilidade | Impacto | Estratégia de mitigação |
|---|---|---|---|
| **Produto — Necessidades do público não validadas:** o app pode entregar as funções solicitadas sem resolver a necessidade prioritária dos usuários. | Alta | Alto: baixa adoção e retrabalho de produto. | Definir público e objetivo; validar protótipos e fluxos de busca/consulta com usuários; estabelecer métricas de sucesso antes de priorizar o backlog. |
| **Produto — Escopo e critérios de sucesso indefinidos:** funcionalidades e expectativas podem crescer durante o desenvolvimento sem uma fronteira clara para a primeira versão. | Alta | Médio/alto: atrasos, priorização instável e entrega de valor tardia. | Definir escopo da primeira versão, itens fora de escopo, critérios de aceite e processo para avaliar novas solicitações. |
| **Técnico — Indisponibilidade, cobertura ou limites do provedor:** a API pode falhar, não cobrir localidades necessárias ou impor limites, custos e condições de licença incompatíveis. | Média | Alto: consultas incompletas ou indisponíveis e possível bloqueio de lançamento. | Validar cobertura, termos, custo e limites do Open-Meteo; monitorar erros e quotas; usar timeout e tratamento de falhas; avaliar cache somente conforme licença e atualidade permitirem. |
| **Técnico — Dados meteorológicos atrasados ou apresentados sem contexto:** atualização e horário de referência não foram definidos, podendo levar usuários a confiar em dados antigos como atuais. | Média | Alto: decisões baseadas em informação desatualizada e perda de confiança. | Acordar frequência de atualização e idade máxima aceitável; exibir horário de atualização; distinguir dado em cache de dado atual e sinalizar indisponibilidade. |
| **Técnico — Busca seleciona cidade incorreta:** nomes duplicados, entradas ambíguas e falta de contexto geográfico podem associar a consulta à localidade errada. | Alta | Alto: previsão irrelevante ou enganosa para o usuário. | Definir identificadores e contexto exibidos nos resultados (por exemplo, região e país); validar cidades homônimas e entradas sem resultado nos testes. |
| **Produto/técnico — Granularidade e fuso da previsão indefinidos:** embora o período esteja definido como hoje mais quatro dias, ainda não se decidiu se a previsão será diária ou horária nem qual fuso rege as datas. | Média | Médio/alto: resultados inconsistentes entre equipes e expectativas frustradas. | Definir a granularidade e o fuso horário; incluir exemplos nos critérios de aceite. |
| **Técnico — Performance degradada por rede ou serviço externo:** a latência do provedor, excesso de chamadas ou limites de quota podem impedir a meta de resposta. | Média | Alto: abandono durante a busca e falha na meta de performance. | Medir separadamente aplicação e provedor; definir condições de teste e percentis; reduzir chamadas duplicadas, usar cache permitido e monitorar latência e quotas. |
| **Técnico — Erros de unidade ou localização:** conversão incompleta entre Celsius/Fahrenheit ou divergência entre a unidade e os valores exibidos podem induzir a interpretação errada. | Média | Alto: informação meteorológica inconsistente ou enganosa. | Definir o escopo da conversão e persistência; manter Celsius como unidade inicial; centralizar conversões; testar valores-limite e todos os campos que exibem temperatura. |
| **Técnico — Barreiras de acessibilidade ou incompatibilidade móvel:** sem público de dispositivos e matriz de suporte definidos, controles podem falhar em telas menores, teclado ou tecnologias assistivas. | Média | Médio/alto: exclusão de usuários e falhas em dispositivos/navegadores prioritários. | Acordar navegadores e viewports suportados; validar WCAG 2.2 AA, teclado e leitor de tela; testar busca e previsão em dispositivos móveis representativos. |
| **Técnico/produto — Uso de localização sem requisitos de privacidade:** caso geolocalização seja incluída, permissão, retenção e uso dos dados ainda não estão definidos. | Baixa/média | Alto: perda de confiança e possível descumprimento de obrigações de privacidade. | Confirmar se geolocalização faz parte do escopo; torná-la opcional, solicitar consentimento explícito e minimizar retenção e uso dos dados de localização. |

## Perguntas em Aberto

As perguntas abaixo devem ser respondidas antes de fechar a especificação. Os impactos descrevem o risco de avançar sem uma decisão; não são requisitos já aprovados.

### Público, mercado e objetivo

- **Pergunta:** Quem são os usuários prioritários e qual necessidade principal o app deve resolver para eles?
  **Impacto:** sem um público e objetivo definidos, não há base para priorizar funcionalidades, conteúdo, idioma ou critérios de sucesso.
- **Pergunta:** Quais países/regiões são prioritários e quais convenções de data/hora devem ser adotadas? A interface em pt-BR e Celsius como unidade padrão já estão decididos.
  **Impacto:** sem definir os mercados e convenções regionais, formatos de data/hora e relevância da cobertura geográfica podem ficar inconsistentes com o público atendido.
- **Pergunta:** Como será medido o sucesso do produto (por exemplo, consultas concluídas, retorno de usuários ou precisão percebida)?
  **Impacto:** a equipe pode entregar as funcionalidades descritas sem conseguir avaliar se elas atendem ao objetivo de negócio.

### Busca e localização

- **Pergunta:** A busca aceita nome parcial, cidade, código postal ou outros identificadores? Deve oferecer sugestões enquanto o usuário digita?
  **Impacto:** sem isso, escopo da interface, comportamento de busca, validação e número de chamadas ao serviço ficam indefinidos.
- **Pergunta:** Como devem ser diferenciadas cidades homônimas: país, estado/região, coordenadas ou outro contexto?
  **Impacto:** usuários podem selecionar a cidade errada e receber dados meteorológicos para outra localização.
- **Pergunta:** A localização atual do dispositivo deve ser oferecida? Se sim, será opcional e como será solicitado o consentimento?
  **Impacto:** afeta permissões, privacidade, fluxo inicial e comportamento quando a permissão é negada ou indisponível.
- **Pergunta:** O que deve acontecer quando a busca não encontra resultados, recebe uma entrada inválida ou retorna muitas correspondências?
  **Impacto:** sem regras e estados definidos, o usuário pode ficar sem orientação ou selecionar um resultado incorreto.
- **Pergunta:** Deve haver histórico de cidades recentes, favoritos ou apenas uma cidade selecionada por vez?
  **Impacto:** muda navegação, persistência, armazenamento local e o escopo funcional da primeira versão.

### Informações meteorológicas

- **Pergunta:** Quais campos compõem o “clima atual” (por exemplo, temperatura, sensação térmica, condição, umidade, vento e precipitação)?
  **Impacto:** não é possível definir layout, integração de dados, critérios de aceite nem o que significa uma consulta completa.
- **Pergunta:** Com que frequência os dados devem ser atualizados e qual atraso máximo é aceitável para chamá-los de atuais?
  **Impacto:** a experiência pode apresentar informação desatualizada; também ficam indefinidos cache, frequência de chamadas e custo/limites do provedor.
- **Pergunta:** A previsão definida como hoje mais os quatro dias seguintes deve ser diária ou incluir períodos horários?
  **Impacto:** diferentes equipes ainda podem implementar granularidades distintas, alterando a API, o layout e os critérios de aceite.
- **Pergunta:** Qual fuso horário determina a data e a divisão dos dias da previsão: o da cidade consultada ou o do usuário?
  **Impacto:** datas e períodos podem aparecer deslocados, especialmente para usuários consultando cidades em outros fusos.
- **Pergunta:** A alternância Celsius/Fahrenheit se aplica apenas à temperatura? Como devem ser exibidos vento, precipitação e outras grandezas, se incluídas? Celsius já está definido como padrão.
  **Impacto:** valores sem unidade ou em escalas inesperadas podem confundir o usuário e levar a comparações incorretas.
- **Pergunta:** São necessários avisos de condições severas, explicações sobre incerteza ou atribuição da fonte meteorológica?
  **Impacto:** informações potencialmente importantes podem ser omitidas, e obrigações de licença ou comunicação do provedor podem não ser atendidas.

### Operação e qualidade

- **Pergunta:** Quais requisitos de licença, atribuição, custo, limites de chamadas e cobertura geográfica se aplicam ao Open-Meteo escolhido?
  **Impacto:** a fonte pode não cobrir os mercados necessários, exceder orçamento/limites ou impedir a distribuição do produto.
- **Pergunta:** Como o app deve se comportar em falha de rede, indisponibilidade do provedor ou resposta parcial: mostrar erro, tentar novamente ou exibir dados armazenados com horário?
  **Impacto:** sem comportamento definido, o usuário pode ver uma tela vazia, carregamento infinito ou informação antiga apresentada como atual.
- **Pergunta:** As metas iniciais propostas (95% das consultas em até 3 segundos) são adequadas? Em quais dispositivos e condições de rede devem ser medidas?
  **Impacto:** sem validar a meta e as condições, os resultados de performance podem não representar a experiência esperada nem ser comparáveis.
- **Pergunta:** A meta inicial de 99,5% de disponibilidade mensal para a aplicação é adequada? Como devem ser contabilizadas manutenções e falhas do provedor externo?
  **Impacto:** sem validar o alvo e as regras de medição, compromissos podem ser irreais ou contabilizados de forma inconsistente.
- **Pergunta:** Deve haver suporte offline ou uso de dados meteorológicos armazenados em cache? Por quanto tempo esses dados podem ser reutilizados?
  **Impacto:** afeta arquitetura, armazenamento e clareza sobre atualidade; sem prazo, dados vencidos podem parecer atuais.
- **Pergunta:** Quais navegadores, versões, tamanhos de tela e orientações de dispositivo devem ser suportados?
  **Impacto:** não é possível definir uma matriz de testes nem determinar o que significa compatibilidade e responsividade suficientes.
- **Pergunta:** WCAG 2.2 nível AA é o padrão adequado? Quais tecnologias assistivas e dispositivos devem ser priorizados nos testes?
  **Impacto:** sem validar o padrão e os contextos de teste, barreiras de teclado, leitor de tela, contraste ou foco podem passar despercebidas.
- **Pergunta:** Há requisitos de privacidade, retenção de dados ou telemetria, especialmente se houver localização do dispositivo?
  **Impacto:** a equipe pode coletar ou armazenar dados sem necessidade, sem transparência ou em desacordo com obrigações aplicáveis.

### Limites de escopo

- **Pergunta:** Sem autenticação e persistência em servidor, deve haver persistência local da cidade ou da unidade entre visitas no mesmo dispositivo?
  **Impacto:** sem uma decisão, preferências podem desaparecer a cada visita ou ser persistidas de modo incompatível com as expectativas de privacidade e continuidade.
- **Pergunta:** Alertas, notificações, widgets ou compartilhamento estão explicitamente fora do escopo da primeira versão?
  **Impacto:** sem uma fronteira explícita, expectativas podem crescer durante a implementação e comprometer prazo e priorização.

## Suposições

- A busca é iniciada pelo usuário, que seleciona uma cidade antes de consultar seus dados meteorológicos.
- O “clima atual” e a previsão de cinco dias referem-se à cidade selecionada.
- Celsius é a unidade inicial e Fahrenheit também estará disponível; conversões devem manter coerência entre os dados apresentados.
- A interface deve funcionar em dispositivos móveis e também ser utilizável em telas maiores.
- A aplicação usa o Open-Meteo como fonte externa de dados; cobertura, termos e limites aplicáveis ainda precisam ser confirmados.
- Autenticação e persistência em servidor não fazem parte do escopo decidido. Persistência local de preferências, alertas meteorológicos e recursos sociais ainda não foram definidos.
- A interface desta versão será em pt-BR.

## Decisões

| Decisão | Justificativa | Perguntas em aberto que resolve |
|---|---|---|
| **Fonte de dados: Open-Meteo, sem API key.** | Evita exigir credenciais de API no fluxo da aplicação e define a fonte para consultas meteorológicas e de cidades. | Fecha a escolha do provedor. Cobertura, termos de uso, atribuição, limites e condições de uso comercial ainda precisam ser validados. |
| **“5 dias” significa hoje mais os quatro dias seguintes.** | Define o período e elimina interpretações diferentes sobre a data inicial e a quantidade de dias. | Fecha se o dia atual entra na contagem. Granularidade da previsão e fuso horário ainda estão em aberto. |
| **Unidade padrão: Celsius.** | Estabelece uma apresentação inicial consistente; a alternância para Fahrenheit continua disponível. | Fecha qual unidade será exibida inicialmente. Ainda é necessário definir se outras grandezas também terão unidades alternáveis. |
| **Sem autenticação e sem persistência de servidor.** | Mantém o uso sem criação de conta e evita armazenar dados de usuário em servidor nesta versão. | Fecha se haverá cadastro/login ou sincronização de dados no servidor. Persistência local de cidade ou preferência de unidade continua em aberto. |
| **Idioma da interface: pt-BR.** | Define o idioma de lançamento da interface para esta versão. | Fecha a pergunta sobre o idioma da UI. Países/regiões prioritários e outras convenções de localização ainda precisam ser confirmados. |

As decisões acima são entradas para a especificação. Quando indicado, elas não encerram perguntas relacionadas que dependem de detalhes adicionais.

## Personas (Hipóteses)

As personas abaixo são arquétipos iniciais para orientar discovery; não foram validadas por pesquisa com usuários e não devem ser tratadas como segmentos confirmados.

| Persona | Objetivo principal | Contexto de uso | Métrica de sucesso para a pessoa |
|---|---|---|---|
| **Pessoa que se desloca diariamente** | Saber como está o tempo na cidade onde está e decidir se precisa levar proteção contra chuva ou frio. | Principalmente mobile, em uma consulta breve antes de sair ou durante o deslocamento. | Encontra a cidade correta e entende as condições atuais em até 30 segundos, sem precisar consultar outra fonte. |
| **Pessoa planejando uma viagem** | Consultar o clima do destino para se preparar para os próximos cinco dias. | Desktop ao organizar a viagem; mobile durante a estadia para rever a previsão. | Localiza o destino e consegue interpretar as condições de cada um dos cinco dias em até um minuto. |
| **Pessoa organizando atividade ao ar livre** | Escolher em qual dos próximos dias realizar uma atividade com base na previsão. | Mobile para consultas rápidas; desktop quando planeja com antecedência. | Compara os cinco dias e escolhe uma data em até um minuto, sentindo que tem informação suficiente para decidir sem abrir outro app. |