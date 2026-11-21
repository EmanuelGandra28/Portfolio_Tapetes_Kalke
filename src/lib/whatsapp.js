// Mensagens e links do WhatsApp. As mensagens saem em texto puro; só o link codifica.
const LIMITE = 1500; // o link do WhatsApp tem tamanho máximo, então a lista é cortada

export function linkWhatsapp(numero, mensagem) {
  return `https://wa.me/${numero}${mensagem ? `?text=${encodeURIComponent(mensagem)}` : ''}`;
}

export function montarMensagemPedido(itens) {
  const inicio = 'Olá! Gostaria de encomendar:\n';
  const fim = 'Pode me ajudar?';
  const linhas = itens.map((i) => `• ${i.quantidade}× ${i.nome}${i.tamanho ? ` (${i.tamanho})` : ''}\n`);
  let usadas = linhas.length;
  const montar = (n) => {
    const resto = linhas.length - n;
    return inicio + linhas.slice(0, n).join('') + (resto > 0 ? `… e mais ${resto} item(ns)\n` : '') + fim;
  };
  while (usadas > 0 && montar(usadas).length > LIMITE) usadas--;
  return montar(usadas);
}

export function montarMensagemCriar(f) {
  const campos = [['Peça', f.peca], ['Tema', f.tema], ['Cores', f.cores], ['Tamanho', f.tamanho], ['Quantidade', f.quantidade], ['Observações', f.observacoes]];
  const linhas = campos.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '').map(([k, v]) => `• ${k}: ${String(v).trim()}`);
  return `Olá! Quero criar um tapete personalizado (Permita-se Criar):\n${linhas.join('\n')}\nPode me passar um orçamento?`;
}
