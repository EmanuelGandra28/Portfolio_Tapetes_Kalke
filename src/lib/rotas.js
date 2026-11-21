// Links de rota e mapa a partir do endereço. Com latitude/longitude (pin exato) a rota fica precisa;
// sem elas, busca pelo texto do endereço. Nenhum desses links precisa de chave.
export const textoEndereco = (e) => `${e.linha1}, ${e.cidade}`;

const temPin = (e) => typeof e.lat === 'number' && typeof e.lng === 'number';
const destino = (e) => (temPin(e) ? `${e.lat},${e.lng}` : encodeURIComponent(textoEndereco(e)));

export const googleMapsUrl = (e) => `https://www.google.com/maps/dir/?api=1&destination=${destino(e)}`;

export const wazeUrl = (e) =>
  temPin(e) ? `https://waze.com/ul?ll=${e.lat},${e.lng}&navigate=yes` : `https://waze.com/ul?q=${destino(e)}&navigate=yes`;

export const appleMapsUrl = (e) => `https://maps.apple.com/?daddr=${destino(e)}`;

export const mapaEmbedUrl = (e) => `https://www.google.com/maps?q=${destino(e)}&output=embed`;
