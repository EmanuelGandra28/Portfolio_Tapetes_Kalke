// Validação do formulário "Permita-se Criar". Obrigatórios: peça e tema; quantidade inteira a partir de 1.
export function validarCriar(f) {
  const erros = {};
  if (!String(f.peca ?? '').trim()) erros.peca = 'Escolha o tipo de peça';
  if (!String(f.tema ?? '').trim()) erros.tema = 'Conte o tema ou desenho';
  const q = Number(f.quantidade);
  if (!Number.isInteger(q) || q < 1) erros.quantidade = 'Informe uma quantidade de 1 ou mais';
  return { ok: Object.keys(erros).length === 0, erros };
}
