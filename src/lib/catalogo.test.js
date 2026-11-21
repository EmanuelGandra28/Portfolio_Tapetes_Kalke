import { describe, it, expect } from 'vitest';
import { formatarPreco, temPreco, fotoPrincipal, urlFoto, agruparPorLinha, ordenar } from './catalogo.js';

describe('formatarPreco', () => {
  it('formata em reais', () => expect(formatarPreco(89.9).replace(/\s/g, ' ')).toBe('R$ 89,90'));
  it('mostra "Sob consulta" para 0 e null', () => {
    expect(formatarPreco(0)).toBe('Sob consulta');
    expect(formatarPreco(null)).toBe('Sob consulta');
  });
});

describe('temPreco', () => {
  it('é falso para 0, null e undefined', () => {
    expect(temPreco({ preco: 0 })).toBe(false);
    expect(temPreco({ preco: null })).toBe(false);
    expect(temPreco({})).toBe(false);
  });
  it('é verdadeiro para preço positivo', () => expect(temPreco({ preco: 10 })).toBe(true));
});

describe('ordenar', () => {
  it('respeita a ordem e depois o nome', () => {
    const r = ordenar([{ nome: 'B', ordem: 1 }, { nome: 'A', ordem: 1 }, { nome: 'Z', ordem: 0 }]);
    expect(r.map((p) => p.nome)).toEqual(['Z', 'A', 'B']);
  });
});

describe('agruparPorLinha', () => {
  it('não cria chaves vazias', () => {
    const g = agruparPorLinha([{ linha: 'COZINHA' }, { linha: 'COZINHA' }, { linha: 'SALA' }]);
    expect(Object.keys(g).sort()).toEqual(['COZINHA', 'SALA']);
    expect(g.COZINHA).toHaveLength(2);
  });
});

describe('fotoPrincipal', () => {
  it('devolve a marcada como principal', () => {
    const p = { fotos: [{ id: 'a', principal: false, ordem: 0 }, { id: 'b', principal: true, ordem: 1 }] };
    expect(fotoPrincipal(p).id).toBe('b');
  });
  it('sem principal, devolve a de menor ordem', () => {
    const p = { fotos: [{ id: 'a', principal: false, ordem: 2 }, { id: 'b', principal: false, ordem: 1 }] };
    expect(fotoPrincipal(p).id).toBe('b');
  });
  it('sem fotos, devolve null', () => {
    expect(fotoPrincipal({ fotos: [] })).toBeNull();
    expect(fotoPrincipal({})).toBeNull();
  });
});

describe('urlFoto', () => {
  it('monta o caminho da foto reduzida', () => {
    expect(urlFoto('abc', 'p')).toBe('/fotos/abc-p.webp');
    expect(urlFoto('abc', 'g')).toBe('/fotos/abc-g.webp');
  });
});
