import { fotoPrincipal, urlFoto } from '../lib/catalogo.js';

const TONS = [
  ['#b0463f', '#e8c4a0'],
  ['#d9a441', '#f1dfae'],
  ['#7a9c8a', '#cfe0d6'],
  ['#a5512f', '#e8c4a0'],
  ['#1c5c46', '#c8a24a'],
];
const tomDe = (id) => TONS[[...String(id)].reduce((s, c) => s + c.charCodeAt(0), 0) % TONS.length];

// Foto do tapete (versão pequena "p" ou grande "g"). Sem foto, mostra um quadro com o losango da marca.
export default function FotoTapete({ produto, tamanho = 'p', foto, eager = false, className = '' }) {
  const f = foto ?? fotoPrincipal(produto);
  if (f) {
    return (
      <img
        className={`foto ${className}`}
        src={urlFoto(f.id, tamanho)}
        alt={`Tapete ${produto.nome}${produto.cor ? `, ${produto.cor}` : ''}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        width={tamanho === 'g' ? 1280 : 480}
        height={tamanho === 'g' ? 960 : 360}
      />
    );
  }
  const [a, b] = tomDe(produto.id);
  return (
    <div className={`foto foto-vazia ${className}`} style={{ background: `linear-gradient(150deg, ${a}, ${b})` }} role="img" aria-label={`Foto de ${produto.nome} em breve`}>
      <svg viewBox="0 0 60 60" width="44" height="44" aria-hidden="true">
        <path d="M30 4 56 30 30 56 4 30Z" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="2" />
        <path d="M30 16 44 30 30 44 16 30Z" fill="rgba(255,255,255,.35)" />
      </svg>
    </div>
  );
}
