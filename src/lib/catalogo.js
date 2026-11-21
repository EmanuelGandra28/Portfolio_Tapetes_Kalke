// Funções puras do catálogo (usadas no build das páginas e nas ilhas do navegador).
const reais = import.meta.glob('../data/catalogo.json', { eager: true, import: 'default' });
const exemplo = import.meta.glob('../data/catalogo.exemplo.json', { eager: true, import: 'default' });

const base = () => (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '');

// Lê o catálogo gerado no build; sem ele (desenvolvimento), usa o de exemplo.
export async function carregarCatalogo() {
  const bruto = Object.values(reais)[0] ?? Object.values(exemplo)[0];
  const produtos = ordenar(bruto.produtos ?? []);
  const vendas = produtos.filter((p) => p.modo === 'VENDA');
  const galeria = produtos.filter((p) => p.modo === 'GALERIA');
  return { geradoEm: bruto.geradoEm, vendas, galeria, linhas: agruparPorLinha(vendas), exemplo: bruto.geradoEm === 'exemplo' };
}

export const temPreco = (p) => typeof p?.preco === 'number' && p.preco > 0;

export function formatarPreco(preco) {
  if (!(typeof preco === 'number' && preco > 0)) return 'Sob consulta';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);
}

export function fotoPrincipal(p) {
  const fotos = p?.fotos ?? [];
  if (fotos.length === 0) return null;
  return fotos.find((f) => f.principal) ?? [...fotos].sort((a, b) => a.ordem - b.ordem)[0];
}

export const urlFoto = (id, tamanho) => `${base()}/fotos/${id}-${tamanho}.webp`;

export function agruparPorLinha(produtos) {
  const grupos = {};
  for (const p of produtos) (grupos[p.linha] ??= []).push(p);
  return grupos;
}

export const ordenar = (produtos) =>
  [...produtos].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || a.nome.localeCompare(b.nome, 'pt-BR'));
