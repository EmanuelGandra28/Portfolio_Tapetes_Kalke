# Site de portfólio — Tapetes Kalke

Site estático (Astro + React) com catálogo, pedido por WhatsApp, "Permita-se Criar" e rotas.
Os tapetes e as fotos vêm do Sistema Tapetes Kalke: a cada publicação o build lê
`GET {API_URL}/api/v1/publico/catalogo` e baixa as fotos de `GET {API_URL}/api/v1/imagens/{id}`.

## Como atualizar o site
- **Automático:** o workflow `Publicar site` roda a cada 6 horas.
- **Por botão:** no sistema, em Produtos, "Atualizar site" (leva de 2 a 5 minutos).
- **Manual:** aba *Actions* → *Publicar site* → *Run workflow*.

Se a API não responder, a publicação falha e **o site anterior continua no ar**.
Sem a variável `API_URL` o build **também falha** (para nunca publicar os preços de exemplo).

Atenção: o GitHub desliga workflows agendados depois de 60 dias sem nenhuma atividade no repositório.
Se isso acontecer, basta rodar o workflow uma vez pela aba *Actions* (ou usar o botão do sistema) para reativar.

## Configuração
- `site.config.json`: nome, WhatsApp, endereço (com `lat`/`lng` quando houver o pin exato), horário, Instagram.
- Variável do repositório `API_URL` (ex.: `https://tapetes-kalke-api.onrender.com`). Sem ela o site usa o catálogo de exemplo.
- Nunca coloque senhas, chaves ou tokens neste repositório: ele é público.

## Desenvolvimento
```
npm install
npm run dev      # usa o catálogo de exemplo (src/data/catalogo.exemplo.json)
npm test
npm run build
```
