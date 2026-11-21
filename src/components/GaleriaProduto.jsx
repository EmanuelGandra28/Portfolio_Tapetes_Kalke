import { useState } from 'react';
import FotoTapete from './FotoTapete.jsx';

// Foto grande + miniaturas clicáveis (e acessíveis pelo teclado). Sem fotos, mostra o quadro da marca.
export default function GaleriaProduto({ produto }) {
  const fotos = [...(produto.fotos ?? [])].sort((a, b) => (b.principal ? 1 : 0) - (a.principal ? 1 : 0) || a.ordem - b.ordem);
  const [atual, setAtual] = useState(0);
  if (fotos.length === 0) return <FotoTapete produto={produto} tamanho="g" eager />;
  return (
    <div className="detalhe-fotos">
      <FotoTapete produto={produto} foto={fotos[atual]} tamanho="g" eager />
      {fotos.length > 1 && (
        <div className="miniaturas" role="group" aria-label="Fotos do tapete">
          {fotos.map((f, i) => (
            <button key={f.id} type="button" aria-current={i === atual} aria-label={`Ver foto ${i + 1}`} onClick={() => setAtual(i)}>
              <FotoTapete produto={produto} foto={f} tamanho="p" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
