// Pedido (carrinho) guardado só no navegador do visitante. Funciona mesmo sem armazenamento.
import { temPreco } from './catalogo.js';

const CHAVE = 'kalke.pedido';

function storagePadrao() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function criarCarrinho(storage = storagePadrao()) {
  let itens = [];
  const ouvintes = new Set();

  try {
    const lido = JSON.parse(storage?.getItem(CHAVE) ?? '[]');
    if (Array.isArray(lido)) {
      itens = lido.filter((i) => i && typeof i.id === 'string' && Number.isInteger(i.quantidade) && i.quantidade > 0);
    }
  } catch {
    // conteúdo inválido ou storage indisponível: começa vazio
  }

  const mudou = () => {
    try {
      storage?.setItem(CHAVE, JSON.stringify(itens));
    } catch {
      // sem storage: segue só na memória
    }
    ouvintes.forEach((fn) => fn());
  };

  return {
    itens: () => itens,
    adicionar(id) {
      const atual = itens.find((i) => i.id === id);
      itens = atual
        ? itens.map((i) => (i.id === id ? { ...i, quantidade: i.quantidade + 1 } : i))
        : [...itens, { id, quantidade: 1 }];
      mudou();
    },
    definir(id, quantidade) {
      itens = quantidade > 0 ? itens.map((i) => (i.id === id ? { ...i, quantidade } : i)) : itens.filter((i) => i.id !== id);
      mudou();
    },
    remover(id) {
      itens = itens.filter((i) => i.id !== id);
      mudou();
    },
    limpar() {
      itens = [];
      mudou();
    },
    assinar(fn) {
      ouvintes.add(fn);
      return () => ouvintes.delete(fn);
    },
  };
}

let unico;
export const obterCarrinho = () => (unico ??= criarCarrinho());

// Junta os itens do pedido com os dados do catálogo. Itens que saíram do catálogo são ignorados.
export function resumir(itens, catalogo) {
  const porId = new Map(catalogo.map((p) => [p.id, p]));
  const linhas = itens
    .filter((i) => porId.has(i.id))
    .map((i) => {
      const produto = porId.get(i.id);
      return { produto, quantidade: i.quantidade, subtotal: temPreco(produto) ? produto.preco * i.quantidade : null };
    });
  return {
    linhas,
    total: linhas.reduce((soma, l) => soma + (l.subtotal ?? 0), 0),
    temSemPreco: linhas.some((l) => l.subtotal === null),
  };
}
