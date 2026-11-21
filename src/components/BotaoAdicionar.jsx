import { useCarrinho } from './useCarrinho.js';
import './pedido.css';

export default function BotaoAdicionar({ id, grande = false }) {
  const { itens, carrinho } = useCarrinho();
  const dentro = itens.some((i) => i.id === id);
  return (
    <button
      type="button"
      className={`add-pedido${dentro ? ' dentro' : ''}${grande ? ' grande' : ''}`}
      onClick={() => carrinho?.adicionar(id)}
      aria-pressed={dentro}
    >
      {dentro ? '✓ No pedido (adicionar mais)' : '+ Adicionar ao pedido'}
    </button>
  );
}
