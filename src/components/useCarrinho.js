import { useSyncExternalStore } from 'react';
import { obterCarrinho } from '../lib/carrinho.js';

const vazio = [];

// Hook das ilhas React: lê o pedido do navegador e repinta quando ele muda.
export function useCarrinho() {
  const c = typeof window === 'undefined' ? null : obterCarrinho();
  const itens = useSyncExternalStore(
    (fn) => (c ? c.assinar(fn) : () => {}),
    () => (c ? c.itens() : vazio),
    () => vazio,
  );
  return { itens, carrinho: c };
}
