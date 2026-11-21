import { useState } from 'react';
import { validarCriar } from '../lib/criar.js';
import { linkWhatsapp, montarMensagemCriar } from '../lib/whatsapp.js';

const PECAS = ['Banheiro', 'Cozinha', 'Sala', 'Outro'];
const inicial = { peca: '', tema: '', cores: '', tamanho: '', quantidade: 1, observacoes: '' };

// Nada sai do navegador: o formulário só monta a mensagem e abre o WhatsApp.
export default function FormCriar({ whatsapp }) {
  const [f, setF] = useState(inicial);
  const [erros, setErros] = useState({});
  const mudar = (campo) => (e) => setF({ ...f, [campo]: e.target.value });

  function enviar(e) {
    e.preventDefault();
    const r = validarCriar(f);
    setErros(r.erros);
    if (!r.ok) return;
    window.open(linkWhatsapp(whatsapp, montarMensagemCriar({ ...f, quantidade: Number(f.quantidade) })), '_blank', 'noopener');
  }

  return (
    <form className="form-criar" onSubmit={enviar} noValidate>
      <fieldset>
        <legend>O que você quer criar?</legend>
        <div className="pecas">
          {PECAS.map((p) => (
            <button key={p} type="button" className={`filtro${f.peca === p ? ' ativo' : ''}`} aria-pressed={f.peca === p} onClick={() => setF({ ...f, peca: p })}>
              {p}
            </button>
          ))}
        </div>
        {erros.peca && <span className="erro" role="alert">{erros.peca}</span>}
      </fieldset>
      <label>
        Tema ou desenho
        <input value={f.tema} onChange={mudar('tema')} placeholder="Ex.: tulipas, galinhas, café…" aria-invalid={!!erros.tema} />
        {erros.tema && <span className="erro" role="alert">{erros.tema}</span>}
      </label>
      <label>
        Cores
        <input value={f.cores} onChange={mudar('cores')} placeholder="Ex.: vermelho e amarelo" />
      </label>
      <label>
        Tamanho aproximado
        <input value={f.tamanho} onChange={mudar('tamanho')} placeholder="Ex.: 60 × 40 cm" />
      </label>
      <label>
        Quantidade
        <input type="number" min="1" step="1" value={f.quantidade} onChange={mudar('quantidade')} aria-invalid={!!erros.quantidade} />
        {erros.quantidade && <span className="erro" role="alert">{erros.quantidade}</span>}
      </label>
      <label>
        Observações
        <textarea rows="3" value={f.observacoes} onChange={mudar('observacoes')} placeholder="Algo mais que a gente deva saber?" />
      </label>
      <p className="dica">Tem uma foto de referência? Envie na conversa do WhatsApp depois que a mensagem abrir.</p>
      <button type="submit" className="btn wa">Pedir orçamento no WhatsApp</button>
    </form>
  );
}
