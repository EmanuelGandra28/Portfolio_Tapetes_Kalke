import { useEffect, useState } from 'react';
import { useCarrinho } from './useCarrinho.js';
import { resumir } from '../lib/carrinho.js';
import { formatarPreco } from '../lib/catalogo.js';
import { linkWhatsapp, montarMensagemPedido } from '../lib/whatsapp.js';
import './pedido.css';

// Botão "Meu pedido" no menu + painel lateral com a lista e o envio para o WhatsApp.
export default function Pedido({ produtos, whatsapp, catalogoUrl }) {
  const { itens, carrinho } = useCarrinho();
  const [aberto, setAberto] = useState(false);
  const resumo = resumir(itens, produtos);
  const quantidade = resumo.linhas.reduce((s, l) => s + l.quantidade, 0);

  useEffect(() => {
    if (!aberto) return undefined;
    const fechar = (e) => e.key === 'Escape' && setAberto(false);
    document.addEventListener('keydown', fechar);
    return () => document.removeEventListener('keydown', fechar);
  }, [aberto]);

  const mensagem = montarMensagemPedido(
    resumo.linhas.map((l) => ({ nome: l.produto.nome, tamanho: l.produto.tamanho, quantidade: l.quantidade })),
  );

  return (
    <>
      <button type="button" className="pedido-botao" onClick={() => setAberto(true)} aria-haspopup="dialog">
        Meu pedido
        {quantidade > 0 && (
          <span className="pedido-contador" aria-label={`${quantidade} itens`}>
            {quantidade}
          </span>
        )}
      </button>
      {aberto && (
        <div className="pedido-fundo" onClick={() => setAberto(false)}>
          <aside className="pedido-painel" role="dialog" aria-modal="true" aria-label="Meu pedido" onClick={(e) => e.stopPropagation()}>
            <header>
              <h2>Meu pedido</h2>
              <button type="button" className="pedido-fechar" onClick={() => setAberto(false)} aria-label="Fechar">
                ×
              </button>
            </header>
            {resumo.linhas.length === 0 ? (
              <div className="pedido-vazio">
                <p>Seu pedido está vazio.</p>
                <a className="btn" href={catalogoUrl} onClick={() => setAberto(false)}>
                  Ver catálogo
                </a>
              </div>
            ) : (
              <>
                <ul className="pedido-lista">
                  {resumo.linhas.map(({ produto, quantidade: q, subtotal }) => (
                    <li key={produto.id}>
                      <div className="pedido-info">
                        <strong>{produto.nome}</strong>
                        <span>{produto.tamanho || ' '}</span>
                        <span className="pedido-preco">{subtotal === null ? 'Sob consulta' : formatarPreco(subtotal)}</span>
                      </div>
                      <div className="pedido-qtd">
                        <button type="button" onClick={() => carrinho.definir(produto.id, q - 1)} aria-label={`Diminuir ${produto.nome}`}>
                          −
                        </button>
                        <span aria-live="polite">{q}</span>
                        <button type="button" onClick={() => carrinho.definir(produto.id, q + 1)} aria-label={`Aumentar ${produto.nome}`}>
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <details className="pedido-previa">
                  <summary>Ver a mensagem que será enviada</summary>
                  <pre>{mensagem}</pre>
                </details>
                <footer>
                  {resumo.total > 0 && (
                    <p className="pedido-total">
                      Total dos itens com preço: <strong>{formatarPreco(resumo.total)}</strong>
                    </p>
                  )}
                  <p className="pedido-aviso">
                    {resumo.temSemPreco ? 'Itens “sob consulta”, ' : ''}frete e peças personalizadas são combinados pelo WhatsApp.
                  </p>
                  <a className="btn wa" href={linkWhatsapp(whatsapp, mensagem)} target="_blank" rel="noopener">
                    Encomendar pelo WhatsApp
                  </a>
                  <button type="button" className="pedido-limpar" onClick={() => carrinho.limpar()}>
                    Esvaziar pedido
                  </button>
                </footer>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
