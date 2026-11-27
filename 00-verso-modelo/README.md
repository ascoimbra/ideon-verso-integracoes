# 00 — Modelo Verso

Verso é uma configuração de comportamento para uso geral, baseada no modelo aberto Qwen3.5 4B executado pelo Ollama. O Modelfile orienta respostas e parâmetros; não é treinamento nem um novo conjunto de pesos.

## Instalar

1. Instale o Ollama: https://ollama.com/download
2. Execute `Instalar Verso.bat` ou os comandos abaixo:

```powershell
ollama pull qwen3.5:4b
ollama create verso -f Modelfile
ollama run verso
```

Os pesos ficam gerenciados pelo Ollama no computador e não entram neste pacote.

## Ligação ao Ideon

`conectores-ideon/` contém cópias dos conectores atuais do aplicativo: LangGraph coordena o contexto, Mem0/RAGFlow são opcionais e ferramentas MCP só são chamadas após configuração, revisão e autorização. O app lê o Ollama conforme a configuração em `servidor.js`. Hoje o perfil da interface `Versos` aponta para `qwen3.5:0.8b`, não para o nome `verso`; alterar essa associação exige uma mudança separada no app.

A configuração local de ferramentas MCP fica no diretório privado de dados do Ideon, em `.ideon-private/verso-tools.local.json`, ou no caminho indicado pela variável `IDEON_VERSO_TOOLS_FILE`. Não inclua esse arquivo, credenciais ou dados de contas no GitHub.
