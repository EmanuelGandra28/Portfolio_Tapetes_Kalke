import { describe, it, expect } from 'vitest';
import { linkWhatsapp, montarMensagemPedido, montarMensagemCriar } from './whatsapp.js';

describe('montarMensagemPedido', () => {
  const texto = montarMensagemPedido([
    { nome: 'Conjunto Tulipas', tamanho: '70 × 45 cm', quantidade: 1 },
    { nome: 'Conjunto Cogumelos', tamanho: '60 × 40 cm', quantidade: 2 },
  ]);
  it('começa e termina como combinado', () => {
    expect(texto.startsWith('Olá! Gostaria de encomendar:')).toBe(true);
    expect(texto.endsWith('Pode me ajudar?')).toBe(true);
  });
  it('lista os itens com quantidade e tamanho', () => {
    expect(texto).toContain('• 1× Conjunto Tulipas (70 × 45 cm)');
    expect(texto).toContain('• 2× Conjunto Cogumelos (60 × 40 cm)');
  });
  it('omite os parênteses quando não há tamanho', () => {
    expect(montarMensagemPedido([{ nome: 'X', tamanho: '', quantidade: 1 }])).toContain('• 1× X\n');
  });
  it('limita o tamanho e avisa quantos itens ficaram de fora', () => {
    const muitos = Array.from({ length: 80 }, (_, i) => ({ nome: `Conjunto muito bonito número ${i}`, tamanho: '60 × 40 cm', quantidade: 1 }));
    const t = montarMensagemPedido(muitos);
    expect(t.length).toBeLessThanOrEqual(1600);
    expect(t).toMatch(/… e mais \d+ item\(ns\)/);
    expect(t.endsWith('Pode me ajudar?')).toBe(true);
  });
});

describe('linkWhatsapp', () => {
  it('codifica caracteres especiais e preserva o texto', () => {
    const msg = 'Olá & #1 "teste" 😀';
    const url = linkWhatsapp('5527998042658', msg);
    expect(url.startsWith('https://wa.me/5527998042658?text=')).toBe(true);
    expect(url).toContain('%26');
    expect(url).toContain('%23');
    expect(url).toContain('%22');
    expect(decodeURIComponent(url.split('?text=')[1])).toBe(msg);
  });
  it('sem mensagem, não coloca o parâmetro text', () => {
    expect(linkWhatsapp('5527998042658')).toBe('https://wa.me/5527998042658');
  });
});

describe('montarMensagemCriar', () => {
  it('inclui só os campos preenchidos', () => {
    const t = montarMensagemCriar({ peca: 'Banheiro', tema: 'Tulipas', cores: '', tamanho: '60 × 40 cm', quantidade: 2, observacoes: '' });
    expect(t).toContain('• Peça: Banheiro');
    expect(t).toContain('• Tema: Tulipas');
    expect(t).toContain('• Tamanho: 60 × 40 cm');
    expect(t).toContain('• Quantidade: 2');
    expect(t).not.toContain('Cores');
    expect(t).not.toContain('Observações');
  });
});
