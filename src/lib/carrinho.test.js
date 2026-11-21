import { describe, it, expect } from 'vitest';
import { criarCarrinho, resumir } from './carrinho.js';

const memoria = () => { const d = {}; return { getItem: (k) => d[k] ?? null, setItem: (k, v) => { d[k] = v; } }; };

describe('criarCarrinho', () => {
  it('somar o mesmo id duas vezes dá quantidade 2', () => {
    const c = criarCarrinho(memoria());
    c.adicionar('a'); c.adicionar('a');
    expect(c.itens()).toEqual([{ id: 'a', quantidade: 2 }]);
  });
  it('definir quantidade 0 remove o item', () => {
    const c = criarCarrinho(memoria());
    c.adicionar('a'); c.definir('a', 0);
    expect(c.itens()).toEqual([]);
  });
  it('remover tira o item', () => {
    const c = criarCarrinho(memoria());
    c.adicionar('a'); c.adicionar('b'); c.remover('a');
    expect(c.itens().map((i) => i.id)).toEqual(['b']);
  });
  it('persiste no storage e recarrega', () => {
    const s = memoria();
    criarCarrinho(s).adicionar('a');
    expect(criarCarrinho(s).itens()).toEqual([{ id: 'a', quantidade: 1 }]);
  });
  it('funciona mesmo se o storage lançar erro', () => {
    const c = criarCarrinho({ getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); } });
    c.adicionar('a');
    expect(c.itens()).toEqual([{ id: 'a', quantidade: 1 }]);
  });
  it('ignora conteúdo inválido guardado no storage', () => {
    const s = memoria(); s.setItem('kalke.pedido', '{lixo');
    expect(criarCarrinho(s).itens()).toEqual([]);
  });
  it('avisa os assinantes a cada mudança e permite cancelar', () => {
    const c = criarCarrinho(memoria()); let n = 0;
    const parar = c.assinar(() => n++);
    c.adicionar('a'); c.adicionar('a');
    parar(); c.adicionar('a');
    expect(n).toBe(2);
  });
});

describe('resumir', () => {
  const catalogo = [
    { id: 'a', nome: 'Com preço', tamanho: '3 peças', preco: 100 },
    { id: 'b', nome: 'Sob consulta', tamanho: '', preco: null },
  ];
  it('soma só itens com preço e avisa se há item sem preço', () => {
    const r = resumir([{ id: 'a', quantidade: 2 }, { id: 'b', quantidade: 1 }], catalogo);
    expect(r.total).toBe(200);
    expect(r.temSemPreco).toBe(true);
    expect(r.linhas[1].subtotal).toBeNull();
  });
  it('ignora ids que não estão mais no catálogo', () => {
    const r = resumir([{ id: 'sumiu', quantidade: 3 }, { id: 'a', quantidade: 1 }], catalogo);
    expect(r.linhas.map((l) => l.produto.id)).toEqual(['a']);
    expect(r.total).toBe(100);
  });
});
