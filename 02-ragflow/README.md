# 02 — RAGFlow

**O que faz:** organiza documentos e recupera trechos relevantes para responder perguntas com base neles.

**Fonte oficial:** https://github.com/infiniflow/ragflow

**Ligação no Ideon:** o conector HTTP já existe em `integracoes-verso.js`. Configure `IDEON_RAGFLOW_URL`, `IDEON_RAGFLOW_API_KEY` e `IDEON_RAGFLOW_DATASET_IDS` no `.env` local. Inicie o RAGFlow, configure embeddings e carregue documentos autorizados nele antes de consultar.

O Ideon busca trechos dos conjuntos configurados; não faz upload automático de arquivos. Verifique requisitos e documentação de instalação na fonte oficial antes de iniciar o serviço.
