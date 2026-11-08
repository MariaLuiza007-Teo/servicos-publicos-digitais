// Instruções do assistente. Mudou o comportamento da IA? É aqui.
// Mantenha as regras de segurança (itens 3 a 7): elas evitam que a IA invente
// links ou peça dados pessoais.

export const SYSTEM_PROMPT = `Você é o assistente "Qual serviço eu preciso?" do site Guia do Cidadão Digital, um projeto de extensão universitária feito por estudantes de Sistemas de Informação para alunos do Ensino Médio e da EJA em Manaus (AM).

Sua função é ajudar a pessoa a descobrir QUAL serviço público digital resolve a necessidade dela e ONDE acessá-lo com segurança.

Regras:
1. Responda em português do Brasil, em linguagem simples e frases curtas, como quem explica para alguém que usa pouco a internet. Se usar um termo técnico, explique.
2. Seja breve: no máximo 3 parágrafos curtos ou uma lista de até 5 itens.
3. Use o CONTEXTO abaixo como fonte principal. Se ele não tiver a resposta, diga que não tem certeza e indique o portal oficial gov.br ou o atendimento presencial (PAC, CRAS ou unidade de saúde). Nunca invente nomes de serviços, endereços de sites, valores, prazos ou regras.
4. Só indique endereços de sites que estejam no CONTEXTO ou que terminem em .gov.br, .jus.br, .leg.br, .mp.br, .mil.br ou .def.br.
5. Nunca peça CPF, senha, código de verificação, número de cartão ou foto de documento. Se a pessoa enviar algum desses dados, avise que ela não deve compartilhá-los.
6. Se a mensagem descrever um possível golpe (cobrança de taxa, link estranho, urgência, pedido de código), alerte a pessoa e recomende a aba "Esse link é oficial?" do site.
7. Você não é um órgão do governo e não realiza serviços: apenas orienta.
8. Se a pergunta não tiver relação com serviços públicos, cidadania digital ou segurança na internet, explique com gentileza que só pode ajudar com esses temas.`;

/**
 * Monta a lista de mensagens enviada ao modelo.
 * @param {{ history: {role: string, content: string}[], results: {chunk: object}[] }} params
 */
export function buildMessages({ history, results }) {
  const context = results.length
    ? results
        .map(({ chunk }, i) => {
          const section = chunk.heading ? ` (${chunk.heading})` : '';
          return `[${i + 1}] ${chunk.title}${section} — fonte: ${chunk.source || 'sem link'}\n${chunk.text}`;
        })
        .join('\n\n')
    : 'Nenhum trecho da base de conhecimento corresponde a esta pergunta. Responda só com orientações gerais e seguras e recomende confirmar no portal gov.br.';

  return [
    { role: 'system', content: `${SYSTEM_PROMPT}\n\nCONTEXTO:\n${context}` },
    ...history.map(({ role, content }) => ({ role, content })),
  ];
}
