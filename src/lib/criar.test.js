import { describe, it, expect } from 'vitest';
import { validarCriar } from './criar.js';

const completo = { peca: 'Banheiro', tema: 'Tulipas', cores: 'Vermelho', tamanho: '60 × 40 cm', quantidade: 1, observacoes: '' };

describe('validarCriar', () => {
  it('aceita o formulário completo', () => {
    expect(validarCriar(completo)).toEqual({ ok: true, erros: {} });
  });
  it('sem tema, pede o tema ou desenho', () => {
    const r = validarCriar({ ...completo, tema: '   ' });
    expect(r.ok).toBe(false);
    expect(r.erros.tema).toBe('Conte o tema ou desenho');
  });
  it('sem peça, pede para escolher', () => {
    expect(validarCriar({ ...completo, peca: '' }).erros.peca).toBe('Escolha o tipo de peça');
  });
  it('quantidade 0 ou decimal é inválida', () => {
    expect(validarCriar({ ...completo, quantidade: 0 }).erros.quantidade).toBeTruthy();
    expect(validarCriar({ ...completo, quantidade: 1.5 }).erros.quantidade).toBeTruthy();
  });
  it('aceita quantidade digitada como texto', () => {
    expect(validarCriar({ ...completo, quantidade: '3' }).ok).toBe(true);
  });
});
