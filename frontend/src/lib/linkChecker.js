// Análise educativa de links para a aba "Esse link é oficial?".
// Tudo roda no navegador: o link NUNCA é aberto nem enviado para nenhum servidor.
// As listas abaixo podem (e devem) ser ampliadas pela equipe — veja docs/VERIFICADOR-LINKS.md.

/** Finais de domínio reservados a órgãos públicos no Brasil (registro.br). */
export const OFFICIAL_SUFFIXES = [
  { suffix: 'gov.br', owner: 'Poder Executivo (governo federal, estados e municípios)' },
  { suffix: 'jus.br', owner: 'Poder Judiciário (tribunais e Justiça Eleitoral)' },
  { suffix: 'leg.br', owner: 'Poder Legislativo (Câmara, Senado e assembleias)' },
  { suffix: 'mp.br', owner: 'Ministério Público' },
  { suffix: 'mil.br', owner: 'Forças Armadas' },
  { suffix: 'def.br', owner: 'Defensoria Pública' },
];

// Categorias de segundo nível do .br (ex.: algo.com.br). Servem para achar o "dono" do endereço.
const BR_SECOND_LEVEL = new Set([
  'com', 'net', 'org', 'gov', 'jus', 'leg', 'mp', 'mil', 'def', 'edu', 'art', 'blog', 'app', 'dev',
  'eco', 'emp', 'ind', 'inf', 'log', 'seg', 'tv', 'wiki', 'adv', 'eng', 'med', 'coop', 'tur', 'esp',
]);

export const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 'cutt.ly', 't.co', 'is.gd', 'rb.gy', 'shorturl.at', 'ow.ly', 'buff.ly',
  'abre.ai', 'encurtador.com.br', 'tiny.cc', 's.id', 'goo.gl', 't.ly', 'short.gy', 'bit.do', 'v.gd',
  'u.to', 'qrco.de', 'shre.ink', 'encr.pw', 'l1nq.com',
]);

const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'online', 'site', 'click', 'shop', 'live', 'buzz', 'icu', 'cfd', 'sbs', 'lol', 'rest',
  'fun', 'space', 'website', 'store', 'work', 'link', 'support', 'monster', 'cyou', 'info', 'vip', 'win',
]);

// Nomes que golpistas usam para fingir ser do governo ou de bancos.
// Nomes curtos (até 4 letras) só contam como palavra inteira do endereço
// ("sus" em "sus-agendamento", mas não em "suspensao"); os longos contam em qualquer posição.
const IMPERSONATED_NAMES = [
  'gov', 'govbr', 'receita', 'inss', 'detran', 'caixa', 'enem', 'sus', 'cpf', 'serasa', 'bancocentral',
  'bcb', 'correios', 'tse', 'fgts', 'bolsafamilia', 'auxilio', 'cadunico', 'pedemeia', 'beneficio',
  'valoresareceber', 'meugov', 'carteiradetrabalho', 'ctps', 'pis', 'mec', 'inep',
];

function impersonatedNames(host) {
  const flat = host.replace(/[^a-z0-9]/g, '');
  const words = host.split(/[^a-z0-9]+/).filter(Boolean);
  const matches = IMPERSONATED_NAMES.filter((name) =>
    name.length <= 4
      ? words.some((word) => word === name || word === `${name}br` || word === `br${name}`)
      : flat.includes(name),
  );
  // "gov" e "govbr" juntos viram só "govbr"
  return matches.filter((name) => !matches.some((other) => other !== name && other.includes(name)));
}

/** Palavras inteiras do endereço que contêm uma "isca" (ex.: "regularize" contém "regulariz"). */
function baitWordsIn(text) {
  const words = text.split(/[^a-z0-9]+/).filter(Boolean);
  const found = new Set();
  for (const bait of BAIT_WORDS) {
    const word = words.find((candidate) => candidate.includes(bait));
    if (word) found.add(word);
  }
  return [...found];
}

// Palavras comuns em links de golpe.
const BAIT_WORDS = [
  'login', 'senha', 'atualiz', 'regulariz', 'bloque', 'cancelad', 'premio', 'resgat', 'liberac',
  'urgente', 'confirm', 'verific', 'seguranca', 'valida', 'restitui', 'indeniza', 'pendencia',
  'suspens', 'taxa', 'sorteio', 'gratis',
];

const stripAccents = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Acha os links dentro de um texto qualquer (ex.: uma mensagem de SMS colada inteira). */
export function extractUrls(text) {
  const found = [];
  for (const token of String(text ?? '').split(/\s+/)) {
    const clean = token.replace(/^[("'<[{]+/, '').replace(/[)"'>\]},.;:!?]+$/, '');
    if (!clean) continue;
    const hasScheme = /^https?:\/\//i.test(clean);
    const looksLikeDomain = /^(www\.)?[^\s/@:]+\.[a-z]{2,}(:\d+)?(\/\S*)?$/i.test(clean);
    if (hasScheme || looksLikeDomain) found.push(clean);
  }
  return [...new Set(found)];
}

function officialSuffixOf(host) {
  return OFFICIAL_SUFFIXES.find(({ suffix }) => host === suffix || host.endsWith(`.${suffix}`)) ?? null;
}

/** "Dono" do endereço: a parte que alguém registrou (ex.: golpe.com.br, exemplo.com). */
export function registrableDomain(host) {
  const labels = host.split('.');
  if (labels.length <= 2) return host;
  const take = labels.at(-1) === 'br' && BR_SECOND_LEVEL.has(labels.at(-2)) ? 3 : 2;
  return labels.slice(-take).join('.');
}

const isIpAddress = (host) => /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[');

/**
 * Analisa um link e explica, em linguagem simples, se ele é oficial e quais sinais de risco tem.
 * @param {string} input
 */
export function analyzeUrl(input) {
  const original = String(input ?? '').trim();
  if (!original) return { ok: false, original, error: 'Cole um link para analisar.' };

  const schemeGiven = /^[a-z][a-z0-9+.-]*:\/\//i.test(original);
  if (schemeGiven && !/^https?:\/\//i.test(original)) {
    return { ok: false, original, error: 'Esse texto não parece um link de site (http ou https).' };
  }

  let url;
  try {
    url = new URL(schemeGiven ? original : `https://${original}`);
  } catch {
    return { ok: false, original, error: 'Não consegui entender esse endereço. Confira se copiou o link inteiro.' };
  }

  const host = url.hostname.toLowerCase().replace(/\.$/, '');
  if (!host.includes('.') && !isIpAddress(host)) {
    return { ok: false, original, error: 'Esse endereço está incompleto: falta o final, como .gov.br ou .com.' };
  }

  const checks = [];
  const add = (level, title, detail) => checks.push({ level, title, detail });

  const official = officialSuffixOf(host);
  const registrable = registrableDomain(host);
  const ownerPart = official ? official.suffix : registrable;
  let pathAndQuery = `${url.pathname}${url.search}`;
  try {
    pathAndQuery = decodeURIComponent(pathAndQuery);
  } catch {
    // caminho com "%" inválido: analisamos como está
  }
  const addressText = stripAccents(`${host} ${pathAndQuery}`.toLowerCase());

  // --- Sinais graves -------------------------------------------------------
  if (url.username || url.password) {
    add(
      'danger',
      'Tem um "@" escondendo o endereço real',
      `Tudo antes do "@" é enfeite. O site que abre de verdade é ${host}.`,
    );
  }
  if (isIpAddress(host)) {
    add('danger', 'O endereço é só um número (IP)', 'Sites do governo usam nomes como gov.br, nunca números.');
  }
  if (host.split('.').some((label) => label.startsWith('xn--'))) {
    add(
      'danger',
      'Usa letras de outros alfabetos',
      'Algumas letras parecem normais, mas são de outro alfabeto. É um truque para imitar sites conhecidos.',
    );
  }
  if (SHORTENERS.has(host) || SHORTENERS.has(registrable)) {
    add(
      'danger',
      'Link encurtado',
      'Links encurtados escondem o destino real. Órgãos públicos não mandam serviços por link encurtado.',
    );
  }

  // --- Oficial ou não --------------------------------------------------------
  if (official) {
    add(
      'ok',
      `Termina em .${official.suffix}`,
      `Esse final é reservado a órgãos públicos: ${official.owner}.`,
    );
  } else {
    let pretendsToBeGov = false;
    if (host.includes('gov.br')) {
      pretendsToBeGov = true;
      add(
        'danger',
        '"gov.br" está no meio do endereço, não no final',
        `O que vale é o final. Este endereço pertence a ${registrable}, não ao governo.`,
      );
    } else {
      const imitated = impersonatedNames(stripAccents(host));
      if (imitated.length) {
        pretendsToBeGov = true;
        add(
          'danger',
          'Imita o nome de um órgão público',
          `O endereço usa "${imitated.join('", "')}", mas não termina em .gov.br. Sites assim costumam ser golpe.`,
        );
      }
    }

    add(
      'info',
      'Não termina em .gov.br',
      pretendsToBeGov
        ? `O dono deste endereço é ${registrable}, e não um órgão público.`
        : `Este endereço pertence a ${registrable}. Pode ser um site legítimo de empresa ou notícia, mas não é do governo.`,
    );

    const tld = host.split('.').at(-1);
    if (SUSPICIOUS_TLDS.has(tld)) {
      add('warn', `Final .${tld}`, 'Esse final é barato e muito usado em sites falsos.');
    }

    const bait = baitWordsIn(addressText);
    if (bait.length) {
      add(
        'warn',
        'Usa palavras comuns em golpes',
        `Encontramos: ${bait.map((word) => `"${word}"`).join(', ')}. Golpes usam essas palavras para criar pressa ou medo.`,
      );
    }

    if ((registrable.split('.')[0].match(/-/g) ?? []).length >= 2) {
      add('warn', 'Muitos hífens no nome', 'Nomes como "atualiza-cadastro-cpf" são típicos de sites falsos.');
    }
  }

  // --- Detalhes técnicos -----------------------------------------------------
  if (host.split('.').length >= 5 && !official) {
    add('warn', 'Endereço muito comprido', 'Muitas partes antes do domínio servem para confundir quem lê.');
  }
  if (url.port) {
    add('warn', `Usa a porta ${url.port}`, 'Sites comuns não mostram um número depois do nome.');
  }
  if (schemeGiven && url.protocol === 'http:') {
    add(
      official ? 'info' : 'warn',
      'Sem cadeado (http)',
      'A conexão não é protegida. Prefira endereços que começam com https.',
    );
  }
  if (!schemeGiven) {
    add('info', 'Começo do link não informado', 'Não dá para saber se ele começa com http ou https.');
  }

  const hasDanger = checks.some((check) => check.level === 'danger');
  const hasWarn = checks.some((check) => check.level === 'warn');
  const verdict = hasDanger ? 'perigo' : official ? 'oficial' : hasWarn ? 'atencao' : 'nao-oficial';

  const subdomain = host.endsWith(ownerPart) ? host.slice(0, host.length - ownerPart.length).replace(/\.$/, '') : '';

  return {
    ok: true,
    original,
    verdict,
    official: Boolean(official),
    host,
    checks: checks.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]),
    anatomy: {
      protocol: schemeGiven ? url.protocol.replace(':', '') : '',
      userinfo: url.username ? `${decodeURIComponent(url.username)}${url.password ? ':***' : ''}` : '',
      subdomain,
      owner: ownerPart,
      port: url.port,
      path: url.pathname === '/' ? '' : url.pathname,
      query: `${url.search}${url.hash}`,
    },
  };
}

const LEVEL_ORDER = { danger: 0, warn: 1, ok: 2, info: 3 };

/** Textos de cada veredito, usados na tela de resultado. */
export const VERDICTS = {
  oficial: {
    title: 'Endereço oficial do governo',
    summary: 'O final do endereço é reservado a órgãos públicos.',
    advice:
      'Mesmo assim, se o link chegou por mensagem, prefira digitar o endereço você mesmo ou abrir o aplicativo oficial.',
  },
  'nao-oficial': {
    title: 'Não é um site do governo',
    summary: 'Não encontramos sinais de golpe, mas este endereço não pertence a um órgão público.',
    advice: 'Se a mensagem diz falar em nome do governo, desconfie: serviços públicos usam endereços .gov.br.',
  },
  atencao: {
    title: 'Atenção: sinais de risco',
    summary: 'O endereço não é do governo e tem características comuns em golpes.',
    advice: 'Não digite senhas nem dados pessoais. Procure o serviço pelo site oficial, digitando o endereço.',
  },
  perigo: {
    title: 'Suspeito: não clique',
    summary: 'Encontramos sinais fortes de que este link tenta enganar quem clica.',
    advice: 'Apague a mensagem, não responda e avise quem mais pode ter recebido. Se já digitou algum dado, troque suas senhas.',
  },
};
