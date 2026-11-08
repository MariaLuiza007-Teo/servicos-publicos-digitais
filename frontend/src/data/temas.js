// Conteúdo do Guia do Cidadão Digital — os 5 eixos do roteiro teórico do projeto,
// reescritos em linguagem simples para os alunos.
//
// Como editar: veja docs/CONTEUDO.md. Regras principais:
//   - frases curtas, sem jargão (se usar um termo técnico, explique);
//   - toda informação sobre serviço, lei ou prazo precisa de uma fonte oficial em "fontes";
//   - "icone" é um nome da lista em src/components/icons.js.

export const temas = [
  {
    id: 'inclusao-digital',
    numero: 1,
    icone: 'Smartphone',
    titulo: 'Inclusão digital',
    subtitulo: 'Ter celular não basta: é preciso saber usar',
    resumo:
      'Entenda o que é inclusão digital e por que saber usar a tecnologia ajuda a garantir seus direitos.',
    secoes: [
      {
        titulo: 'O que é inclusão digital',
        paragrafos: [
          'Inclusão digital é ter acesso à tecnologia e, principalmente, saber usá-la para resolver a vida: estudar, trabalhar, cuidar da saúde e exercer seus direitos.',
        ],
      },
      {
        titulo: 'Três degraus',
        paragrafos: ['Pesquisadores explicam a inclusão digital em três degraus:'],
        itens: [
          'Acesso: ter um aparelho e internet.',
          'Habilidade: saber usar com autonomia e segurança.',
          'Resultado: conseguir benefícios reais, como uma vaga de emprego, uma matrícula ou um documento.',
        ],
      },
      {
        titulo: 'Usar rede social não é a mesma coisa',
        paragrafos: [
          'Muita gente usa o celular todo dia para conversar, ver vídeos e jogar. Mas resolver um serviço público, proteger seus dados ou checar uma notícia exige outras habilidades.',
          'Essas habilidades podem ser aprendidas por qualquer pessoa, em qualquer idade.',
        ],
      },
      {
        titulo: 'Sem internet ou sem celular?',
        paragrafos: [
          'Os serviços públicos continuam tendo atendimento presencial. Procure o PAC (Pronto Atendimento ao Cidadão), o CRAS do seu bairro ou a unidade de saúde mais próxima.',
        ],
      },
    ],
    importante: 'Ninguém nasce sabendo. Aprender a usar a tecnologia é um direito e está ao alcance de todos.',
    fontes: [
      { nome: 'Cetic.br — Pesquisa TIC Domicílios', url: 'https://cetic.br' },
      { nome: 'Governo Digital', url: 'https://www.gov.br/governodigital/pt-br' },
    ],
  },
  {
    id: 'servicos-publicos-digitais',
    numero: 2,
    icone: 'Landmark',
    titulo: 'Serviços públicos digitais',
    subtitulo: 'O governo no seu celular, de graça',
    resumo: 'Conheça a conta gov.br e aprenda a reconhecer um site oficial do governo.',
    secoes: [
      {
        titulo: 'O governo foi para o celular',
        paragrafos: [
          'Muitos serviços que antes exigiam fila e papel hoje podem ser feitos pela internet: inscrição no ENEM, carteira de trabalho, carteira de vacinação, título de eleitor e muito mais.',
        ],
      },
      {
        titulo: 'Uma chave para tudo: a conta gov.br',
        paragrafos: [
          'A conta gov.br funciona como uma chave única. Com seu CPF e uma senha, você entra em milhares de serviços do governo federal e em vários serviços de estados e municípios. A conta é gratuita.',
        ],
      },
      {
        titulo: 'Os níveis da conta',
        paragrafos: ['Quanto mais o governo tem certeza de que é você mesmo, mais serviços a conta libera:'],
        itens: [
          'Bronze: cadastro básico. Libera os serviços mais simples.',
          'Prata: identidade confirmada por um banco credenciado ou por reconhecimento facial. Libera a maioria dos serviços.',
          'Ouro: identidade confirmada com biometria oficial ou certificado digital. Libera todos os serviços.',
        ],
        nota: 'As formas de confirmar a identidade podem mudar. Confira sempre no site oficial do gov.br.',
      },
      {
        titulo: 'Como reconhecer um site oficial',
        paragrafos: [
          'Sites do governo terminam em .gov.br, como www.gov.br. Sites da Justiça terminam em .jus.br, e os das Forças Armadas, em .mil.br.',
          'Endereços como gov-br.com ou govbr.online não são oficiais, mesmo que pareçam.',
        ],
      },
      {
        titulo: 'Serviço público digital é gratuito',
        paragrafos: [
          'Ninguém precisa pagar despachante, taxa de liberação ou intermediário para usar esses serviços. Se alguém cobrar, desconfie.',
        ],
      },
    ],
    importante:
      'Na dúvida, não clique em links de mensagens. Digite gov.br no navegador ou abra o aplicativo oficial.',
    acoes: [
      { rotulo: 'Ver o catálogo de serviços', para: '/servicos' },
      { rotulo: 'Testar um link no verificador', para: '/verificador' },
    ],
    fontes: [
      { nome: 'Conta gov.br — Governo Digital', url: 'https://www.gov.br/governodigital/pt-br/identidade/conta-gov-br' },
      { nome: 'Lei do Governo Digital (Lei 14.129/2021)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14129.htm' },
    ],
  },
  {
    id: 'direitos-e-dados',
    numero: 3,
    icone: 'Scale',
    titulo: 'Seus direitos e seus dados',
    subtitulo: 'Cidadania também vale na internet',
    resumo: 'Saiba o que dizem o Marco Civil da Internet e a LGPD sobre a sua privacidade.',
    secoes: [
      {
        titulo: 'Cidadania digital',
        paragrafos: [
          'Cidadania digital é usar a internet com responsabilidade: conhecer seus direitos, proteger seus dados e respeitar as outras pessoas.',
        ],
      },
      {
        titulo: 'Marco Civil da Internet',
        paragrafos: [
          'A Lei 12.965/2014 garante, entre outros pontos, a liberdade de expressão, a privacidade e o sigilo das suas comunicações na internet.',
        ],
      },
      {
        titulo: 'LGPD: seus dados são seus',
        paragrafos: [
          'A Lei Geral de Proteção de Dados (Lei 13.709/2018) define regras para empresas e governo usarem seus dados pessoais.',
        ],
        itens: [
          'Dado pessoal: qualquer informação que identifique você, como nome, CPF, endereço ou telefone.',
          'Dado sensível: informação que exige cuidado maior, como saúde, biometria (seu rosto e sua digital), religião e origem racial.',
          'Você tem direito de saber quais dados uma organização tem sobre você, corrigir o que estiver errado e pedir a exclusão do que for desnecessário.',
        ],
      },
      {
        titulo: 'Dados de adolescentes',
        paragrafos: [
          'A LGPD exige que os dados de crianças e adolescentes sejam usados sempre no melhor interesse deles.',
        ],
      },
      {
        titulo: 'Seus deveres',
        paragrafos: [
          'Divulgar fotos, conversas ou dados de outras pessoas sem autorização pode trazer consequências na Justiça.',
          'Desde 2024, a intimidação sistemática virtual (cyberbullying) é crime previsto no Código Penal.',
        ],
      },
    ],
    importante: 'Seu rosto é um dado sensível. Só faça reconhecimento facial em aplicativos oficiais.',
    fontes: [
      { nome: 'Lei Geral de Proteção de Dados (Lei 13.709/2018)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm' },
      { nome: 'Marco Civil da Internet (Lei 12.965/2014)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm' },
      { nome: 'Autoridade Nacional de Proteção de Dados (ANPD)', url: 'https://www.gov.br/anpd/pt-br' },
    ],
  },
  {
    id: 'seguranca-e-golpes',
    numero: 4,
    icone: 'ShieldAlert',
    titulo: 'Segurança e golpes',
    subtitulo: 'Golpes enganam pessoas, não máquinas',
    resumo: 'Aprenda os 4 sinais de golpe, como proteger suas contas e o que fazer se cair em um.',
    secoes: [
      {
        titulo: 'Como os golpes funcionam',
        paragrafos: [
          'A maioria dos golpes não invade o celular. Eles convencem a pessoa a entregar uma senha, um código ou dinheiro. Isso se chama engenharia social.',
        ],
      },
      {
        titulo: 'Os 4 sinais de golpe',
        itens: [
          'Urgência: "último dia", "sua conta será bloqueada".',
          'Pedido de dado ou código: senha, código que chegou por SMS, foto de documento.',
          'Pedido de dinheiro: taxa, Pix ou depósito para "liberar" algo.',
          'Link estranho: endereço que não é o oficial, encurtado ou com erros.',
        ],
      },
      {
        titulo: 'Golpes mais comuns',
        itens: [
          'Falso gov.br ou Receita: "Seu CPF será cancelado, regularize pelo link".',
          'Falso dinheiro esquecido: o Banco Central não manda links nem cobra taxa para devolver valores.',
          'WhatsApp clonado: alguém pede o código de 6 dígitos que chegou por SMS.',
          'Parente com número novo pedindo um Pix urgente.',
          'Renda fácil: "ganhe por dia curtindo vídeos" ou vaga de emprego que cobra taxa.',
        ],
      },
      {
        titulo: 'Proteja suas contas',
        itens: [
          'Use senhas longas, como uma frase que só você conhece.',
          'Não repita a mesma senha em vários sites.',
          'Ative a verificação em duas etapas no WhatsApp, no gov.br e nas redes sociais.',
          'Instale aplicativos só pela loja oficial do celular.',
          'Mantenha o celular atualizado e com bloqueio de tela.',
        ],
      },
      {
        titulo: 'Caiu em um golpe? Aja rápido',
        itens: [
          'Avise o banco na hora, pelo aplicativo ou pelo telefone oficial. Em golpe com Pix, peça o MED (Mecanismo Especial de Devolução).',
          'Troque as senhas das contas afetadas.',
          'Avise seus contatos se sua conta foi clonada.',
          'Registre um boletim de ocorrência. Dá para fazer pela delegacia virtual da Polícia Civil.',
          'Guarde prints e comprovantes.',
        ],
      },
    ],
    importante:
      'Parou, desconfiou, confirmou por outro caminho. Nunca confirme pelo link ou pelo número que veio na mensagem.',
    acoes: [{ rotulo: 'Verificar um link suspeito', para: '/verificador' }],
    fontes: [
      { nome: 'Cartilha de Segurança para Internet (CERT.br)', url: 'https://cartilha.cert.br' },
      { nome: 'Valores a Receber (Banco Central)', url: 'https://valoresareceber.bcb.gov.br' },
      { nome: 'SaferNet Brasil', url: 'https://new.safernet.org.br' },
    ],
  },
  {
    id: 'noticias-e-bem-estar',
    numero: 5,
    icone: 'Newspaper',
    titulo: 'Notícias falsas e bem-estar',
    subtitulo: 'Checar antes de compartilhar e cuidar de você',
    resumo: 'Veja como checar uma informação em 5 passos e como usar as telas com equilíbrio.',
    secoes: [
      {
        titulo: 'Nem tudo que circula é verdade',
        paragrafos: [
          'Notícias falsas se espalham mais rápido que as verdadeiras, porque costumam causar medo, raiva ou surpresa.',
        ],
      },
      {
        titulo: 'Como checar em 5 passos',
        ordenada: true,
        itens: [
          'Respire antes de compartilhar.',
          'Veja quem publicou: é um veículo conhecido? Tem autor e data?',
          'Procure a notícia em outros sites de notícia.',
          'Confira a data: muita notícia falsa é notícia velha.',
          'Consulte uma agência de checagem.',
        ],
      },
      {
        titulo: 'Fotos, vídeos e áudios falsos',
        paragrafos: [
          'A inteligência artificial consegue criar imagens e vídeos falsos e até imitar a voz de pessoas. Se um áudio de um parente pedir dinheiro, ligue para ele e confirme.',
          'Para descobrir de onde veio uma foto, use a busca por imagem do Google Lens.',
        ],
      },
      {
        titulo: 'Cuide de você',
        itens: [
          'Regra 20-20-20: a cada 20 minutos de tela, olhe para algo a cerca de 6 metros por 20 segundos.',
          'Levante o celular até a altura dos olhos para poupar o pescoço.',
          'Evite telas na última hora antes de dormir.',
          'Desative notificações que não são importantes.',
          'Em caso de cyberbullying ou exposição, converse com alguém de confiança e procure a SaferNet Brasil.',
        ],
      },
    ],
    importante: 'Na dúvida, não compartilhe.',
    fontes: [
      { nome: 'Aos Fatos', url: 'https://www.aosfatos.org' },
      { nome: 'Agência Lupa', url: 'https://www.agencialupa.org' },
      { nome: 'Projeto Comprova', url: 'https://projetocomprova.com.br' },
      { nome: 'Fato ou Fake (g1)', url: 'https://g1.globo.com/fato-ou-fake/' },
      { nome: 'SaferNet Brasil', url: 'https://new.safernet.org.br' },
    ],
  },
];

export const getTema = (id) => temas.find((tema) => tema.id === id);
