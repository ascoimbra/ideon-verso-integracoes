# 07 — LangGraph

**O que faz:** organiza etapas de um fluxo de IA como um grafo, com estado e transições entre etapas.

**Fonte oficial:** https://github.com/langchain-ai/langgraph

**Ligação no Ideon:** LangGraph JavaScript já é dependência e é usado em `integracoes-verso.js` para encadear memória local, Mem0 opcional, RAGFlow opcional e ferramenta autorizada antes da geração no Ollama. O tracing fica desativado por padrão no conector.

O modelo continua sendo executado pelo Ollama; LangGraph coordena o fluxo e não é um modelo.
