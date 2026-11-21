import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

// Grava duas versões WEBP: "p" (grade, 480 px) e "g" (detalhe, 1280 px). Nunca aumenta a foto original.
export async function reduzirFoto(buffer, id, pasta) {
  await mkdir(pasta, { recursive: true });
  const base = sharp(buffer, { failOn: 'none' }).rotate();
  await base.clone().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(join(pasta, `${id}-p.webp`));
  await base.clone().resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(pasta, `${id}-g.webp`));
}

export const gravarJson = (arquivo, dados) => writeFile(arquivo, JSON.stringify(dados, null, 2));
