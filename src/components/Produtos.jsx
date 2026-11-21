import { useEffect, useState } from 'react';
import FotoTapete from './FotoTapete.jsx';
import BotaoAdicionar from './BotaoAdicionar.jsx';
import { formatarPreco, temPreco } from '../lib/catalogo.js';

const ROTULOS = { BANHEIRO: 'Banheiro', COZINHA: 'Cozinha', SALA: 'Sala', OUTRA: 'Outros' };

// Grade "Nossos tapetes" com filtro por linha. O filtro também responde a links como #linha-COZINHA.
export default function Produtos({ produtos, base }) {
  const linhas = [...new Set(produtos.map((p) => p.linha))];
  const [linha, setLinha] = useState('TODOS');

  useEffect(() => {
    const ler = () => {
      const m = window.location.hash.match(/^#linha-(\w+)$/);
      if (m && linhas.includes(m[1])) setLinha(m[1]);
    };
    ler();
    window.addEventListener('hashchange', ler);
    return () => window.removeEventListener('hashchange', ler);
  }, []);

  const visiveis = linha === 'TODOS' ? produtos : produtos.filter((p) => p.linha === linha);

  return (
    <div>
      {linhas.length > 1 && (
        <div className="filtros" role="group" aria-label="Filtrar por linha">
          {['TODOS', ...linhas].map((l) => (
            <button key={l} type="button" className={`filtro${l === linha ? ' ativo' : ''}`} aria-pressed={l === linha} onClick={() => setLinha(l)}>
              {l === 'TODOS' ? 'Todos' : ROTULOS[l] ?? l}
            </button>
          ))}
        </div>
      )}
      <div className="grade-produtos">
        {visiveis.map((p) => (
          <article className="card-tapete" key={p.id}>
            <a className="card-foto" href={`${base}/tapete/${p.id}/`} aria-label={`Ver ${p.nome}`}>
              <FotoTapete produto={p} />
              {p.selo && <span className="selo">{p.selo}</span>}
            </a>
            <div className="card-texto">
              <h3><a href={`${base}/tapete/${p.id}/`}>{p.nome}</a></h3>
              <span className="card-meta">{[ROTULOS[p.linha], p.tamanho].filter(Boolean).join(' · ')}</span>
              <strong className={`card-preco${temPreco(p) ? '' : ' consulta'}`}>{formatarPreco(p.preco)}</strong>
            </div>
            <BotaoAdicionar id={p.id} />
          </article>
        ))}
      </div>
    </div>
  );
}
