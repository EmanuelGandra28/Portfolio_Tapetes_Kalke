// Acesso à API do sistema durante o build. O Render grátis dorme: a primeira chamada pode levar ~1 minuto,
// então tentamos de novo em erro de rede e em status 5xx.
const MODOS = new Set(['VENDA', 'GALERIA']);
const CAMPOS = ['id', 'nome', 'linha', 'descricao', 'cor', 'tamanho', 'preco', 'selo', 'ordem', 'modo', 'fotos'];

const dormirPadrao = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function buscarComRetentativa(url, { tentativas = 12, espera = 15000, fetchFn = fetch, dormir = dormirPadrao } = {}) {
  let ultimoErro = new Error(`Sem resposta de ${url}`);
  for (let i = 1; i <= tentativas; i++) {
    try {
      const resposta = await fetchFn(url);
      if (resposta.status < 500) return resposta;
      ultimoErro = new Error(`${url} respondeu ${resposta.status}`);
    } catch (erro) {
      ultimoErro = erro;
    }
    if (i < tentativas) await dormir(espera);
  }
  throw ultimoErro;
}

// Deixa só o que o site pode mostrar, mesmo que a API mande campos a mais.
export function normalizarCatalogo(resposta) {
  const corpo = resposta?.data ?? resposta ?? {};
  // Resposta 200 em outro formato não pode virar um site vazio publicado em silêncio.
  if (!Array.isArray(corpo.produtos)) throw new Error('A resposta do catálogo não trouxe a lista de produtos');
  const produtos = corpo.produtos
    .filter((p) => p && typeof p.id === 'string' && p.id.trim() && typeof p.nome === 'string' && p.nome.trim() && MODOS.has(p.modo))
    .map((p) => Object.fromEntries(CAMPOS.map((c) => [c, p[c] ?? (c === 'fotos' ? [] : null)])));
  return { geradoEm: corpo.geradoEm ?? new Date().toISOString(), produtos };
}

// De onde vem o catálogo: "api" (produção) ou "exemplo" (só desenvolvimento). No GitHub Actions, sem API_URL
// o build falha, para nunca publicar os preços fictícios do exemplo (a menos que PERMITIR_EXEMPLO=1).
export function decidirOrigem(env) {
  if ((env.API_URL ?? '').trim()) return 'api';
  const noCi = Boolean(env.CI || env.GITHUB_ACTIONS);
  if (noCi && env.PERMITIR_EXEMPLO !== '1') {
    throw new Error('API_URL não está definida no repositório (Settings > Secrets and variables > Actions > Variables)');
  }
  return 'exemplo';
}

// Aceita tanto https://servidor quanto https://servidor/api/v1.
export const baseDaApi = (url) => url.replace(/\/+$/, '').replace(/\/api\/v1$/, '');
