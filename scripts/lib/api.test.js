import { describe, it, expect } from 'vitest';
import { buscarComRetentativa, normalizarCatalogo } from './api.mjs';

const resp = (status) => ({ status, ok: status >= 200 && status < 300 });
const semEspera = () => Promise.resolve();

describe('buscarComRetentativa', () => {
  it('tenta de novo em erro de rede até conseguir', async () => {
    let chamadas = 0;
    const fetchFn = async () => {
      chamadas++;
      if (chamadas < 3) throw new Error('rede');
      return resp(200);
    };
    const r = await buscarComRetentativa('http://x', { fetchFn, dormir: semEspera });
    expect(r.ok).toBe(true);
    expect(chamadas).toBe(3);
  });
  it('tenta de novo em status 5xx (Render acordando)', async () => {
    const respostas = [resp(503), resp(502), resp(200)];
    let i = 0;
    const r = await buscarComRetentativa('http://x', { fetchFn: async () => respostas[i++], dormir: semEspera });
    expect(r.status).toBe(200);
    expect(i).toBe(3);
  });
  it('rejeita depois de esgotar as tentativas', async () => {
    let chamadas = 0;
    await expect(
      buscarComRetentativa('http://x', { tentativas: 4, fetchFn: async () => { chamadas++; throw new Error('rede'); }, dormir: semEspera }),
    ).rejects.toThrow();
    expect(chamadas).toBe(4);
  });
  it('não repete em 404', async () => {
    let chamadas = 0;
    const r = await buscarComRetentativa('http://x', { fetchFn: async () => { chamadas++; return resp(404); }, dormir: semEspera });
    expect(r.status).toBe(404);
    expect(chamadas).toBe(1);
  });
});

describe('normalizarCatalogo', () => {
  const item = (o = {}) => ({ id: 'a', nome: 'Conjunto', linha: 'COZINHA', descricao: 'd', cor: 'c', tamanho: 't', preco: 10, selo: null, ordem: 1, modo: 'VENDA', fotos: [{ id: 'f', principal: true, ordem: 0 }], ...o });

  it('aceita a resposta embrulhada em data (ApiResponse)', () => {
    const c = normalizarCatalogo({ success: true, data: { geradoEm: 'agora', produtos: [item()] } });
    expect(c.produtos).toHaveLength(1);
    expect(c.geradoEm).toBe('agora');
  });
  it('descarta itens sem id ou sem nome', () => {
    const c = normalizarCatalogo({ produtos: [item({ nome: '' }), item({ id: '' }), item()] });
    expect(c.produtos).toHaveLength(1);
  });
  it('descarta modo desconhecido ou NENHUM', () => {
    const c = normalizarCatalogo({ produtos: [item({ modo: 'NENHUM' }), item({ modo: 'XYZ' }), item({ modo: 'GALERIA' })] });
    expect(c.produtos.map((p) => p.modo)).toEqual(['GALERIA']);
  });
  it('mantém só os campos públicos', () => {
    const c = normalizarCatalogo({ produtos: [item({ precoCusto: 5, estoqueComercial: 3, observacoes: 'x' })] });
    expect(Object.keys(c.produtos[0]).sort()).toEqual(['cor', 'descricao', 'fotos', 'id', 'linha', 'modo', 'nome', 'ordem', 'preco', 'selo', 'tamanho']);
  });
  it('resposta vazia vira catálogo sem produtos', () => {
    expect(normalizarCatalogo(null).produtos).toEqual([]);
  });
});
