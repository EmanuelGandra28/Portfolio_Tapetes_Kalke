import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const ler = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const config = ler('../../site.config.json');
const exemplo = ler('../data/catalogo.exemplo.json');

describe('site.config.json', () => {
  it('tem o WhatsApp da loja só com dígitos e com 55', () => {
    expect(config.whatsapp).toBe('5527998042658');
    expect(config.whatsapp).toMatch(/^\d+$/);
  });
  it('tem o endereço do cartão de visita', () => {
    expect(config.endereco.linha1).toBe('Rua Bernardino Monteiro');
    expect(config.endereco.cidade).toBe('Domingos Martins – ES');
    expect(config.endereco.complemento).toBe('Em frente à biquinha');
  });
});

describe('catalogo.exemplo.json', () => {
  it('tem produtos nos modos VENDA e GALERIA', () => {
    const modos = new Set(exemplo.produtos.map((p) => p.modo));
    expect([...modos].sort()).toEqual(['GALERIA', 'VENDA']);
  });
  it('não expõe dados internos', () => {
    const texto = JSON.stringify(exemplo);
    for (const chave of ['precoCusto', 'estoque', 'observacoes', 'codigoBarras', 'fornecedor']) {
      expect(texto).not.toContain(chave);
    }
  });
});
