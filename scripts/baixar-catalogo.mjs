// Roda antes do build: baixa o catálogo e as fotos do sistema.
// Sem API_URL (desenvolvimento), o site usa o catálogo de exemplo. Com API_URL e qualquer falha, sai com
// erro (código 1): o workflow falha e o site anterior continua no ar.
import { rm, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { baseDaApi, buscarComRetentativa, normalizarCatalogo } from './lib/api.mjs';
import { gravarJson, reduzirFoto } from './lib/fotos.mjs';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const arquivoCatalogo = `${raiz}src/data/catalogo.json`;
const pastaFotos = `${raiz}public/fotos`;

const apiUrl = (process.env.API_URL ?? '').trim();
await rm(arquivoCatalogo, { force: true });
await rm(pastaFotos, { recursive: true, force: true });

if (!apiUrl) {
  console.log('[catalogo] API_URL não definida: usando o catálogo de exemplo.');
  process.exit(0);
}

try {
  const base = baseDaApi(apiUrl);
  console.log(`[catalogo] Buscando ${base}/api/v1/publico/catalogo (o servidor pode levar até 3 minutos para acordar)…`);
  const resposta = await buscarComRetentativa(`${base}/api/v1/publico/catalogo`);
  if (!resposta.ok) throw new Error(`O catálogo respondeu ${resposta.status}`);
  const catalogo = normalizarCatalogo(await resposta.json());

  await mkdir(pastaFotos, { recursive: true });
  let total = 0;
  for (const produto of catalogo.produtos) {
    for (const foto of produto.fotos) {
      const img = await buscarComRetentativa(`${base}/api/v1/imagens/${foto.id}`, { tentativas: 4, espera: 5000 });
      if (!img.ok) throw new Error(`A foto ${foto.id} respondeu ${img.status}`);
      await reduzirFoto(Buffer.from(await img.arrayBuffer()), foto.id, pastaFotos);
      total++;
    }
  }
  await gravarJson(arquivoCatalogo, catalogo);
  console.log(`[catalogo] ${catalogo.produtos.length} tapetes e ${total} fotos prontos.`);
} catch (erro) {
  console.error(`[catalogo] FALHOU: ${erro.message}`);
  process.exit(1);
}
