import { useState } from 'react';

export default function CopiarEndereco({ texto }) {
  const [copiado, setCopiado] = useState(false);
  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.prompt('Copie o endereço:', texto);
    }
  }
  return (
    <button type="button" className="rota" onClick={copiar}>
      {copiado ? '✓ Copiado' : 'Copiar endereço'}
    </button>
  );
}
