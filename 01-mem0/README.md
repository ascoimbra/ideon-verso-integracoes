# 01 — Mem0

**O que faz:** guarda e recupera memórias relevantes de conversas. No Ideon, complementa a memória local por conta; não altera os pesos do Verso.

**Fonte oficial:** https://github.com/mem0ai/mem0

**Ligação no Ideon:** o conector HTTP já existe em `integracoes-verso.js`. Defina `IDEON_MEM0_URL` e, se o servidor exigir, `IDEON_MEM0_API_KEY` no `.env` local. O serviço Mem0 precisa ser instalado e iniciado separadamente. O Ideon não migra automaticamente as conversas antigas.

Use uma configuração de armazenamento e autenticação apropriada. O conector aplica um identificador derivado da conta; revise também o isolamento configurado no servidor Mem0.
