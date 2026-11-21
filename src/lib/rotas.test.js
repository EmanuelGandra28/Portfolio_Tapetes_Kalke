import { describe, it, expect } from 'vitest';
import { googleMapsUrl, wazeUrl, appleMapsUrl, mapaEmbedUrl, textoEndereco } from './rotas.js';

const semPin = { linha1: 'Rua Bernardino Monteiro', cidade: 'Domingos Martins – ES', complemento: 'Em frente à biquinha', lat: null, lng: null };
const comPin = { ...semPin, lat: -20.36, lng: -40.66 };

describe('textoEndereco', () => {
  it('junta rua e cidade, sem o complemento', () => {
    expect(textoEndereco(semPin)).toBe('Rua Bernardino Monteiro, Domingos Martins – ES');
  });
});

describe('rotas sem coordenadas (busca pelo texto)', () => {
  it('Google Maps', () => {
    const u = googleMapsUrl(semPin);
    expect(u).toContain('Rua%20Bernardino%20Monteiro');
    expect(u).toContain('Domingos%20Martins');
    expect(u.startsWith('https://www.google.com/maps/dir/?api=1&destination=')).toBe(true);
  });
  it('Waze', () => {
    expect(wazeUrl(semPin)).toContain('q=Rua%20Bernardino%20Monteiro');
  });
  it('Apple Maps', () => {
    expect(appleMapsUrl(semPin)).toContain('daddr=Rua%20Bernardino%20Monteiro');
  });
  it('mapa incorporado não usa chave', () => {
    const u = mapaEmbedUrl(semPin);
    expect(u).toContain('output=embed');
    expect(u).not.toContain('key=');
  });
});

describe('rotas com coordenadas (pin exato)', () => {
  it('usam latitude e longitude', () => {
    expect(googleMapsUrl(comPin)).toContain('destination=-20.36,-40.66');
    expect(wazeUrl(comPin)).toContain('ll=-20.36,-40.66');
    expect(wazeUrl(comPin)).toContain('navigate=yes');
    expect(appleMapsUrl(comPin)).toContain('daddr=-20.36,-40.66');
  });
});
