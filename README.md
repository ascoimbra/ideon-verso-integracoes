# Verso + integrações do Ideon

## Baixar o pacote completo

[⬇️ **Baixar ZIP completo**](https://github.com/ascoimbra/ideon-verso-integracoes/raw/refs/heads/main/Ideon-Verso-Integracoes-GitHub.zip?download=1)

O ZIP é extraído dentro da pasta **`Ideon Verso Integrações/`**. As pastas numeradas e os arquivos também estão visíveis diretamente nesta página do GitHub, para você conferir cada parte antes de baixar.

Pacote inicial, organizado para versionar em um repositório GitHub. Ele reúne a configuração do modelo Verso, os conectores do Ideon e um guia por projeto. **Não contém pesos de modelos nem cópias dos repositórios de terceiros**: cada pasta aponta para a fonte oficial e explica o papel do projeto e a ligação com o Verso.

## Como as peças se conectam

```text
Ideon IA (Node.js)
  └─ LangGraph JS (orquestra o fluxo no servidor)
      ├─ memória local por conta (ativa por padrão)
      ├─ Mem0 (opcional, serviço configurado pelo administrador)
      ├─ RAGFlow (opcional, consulta coleções configuradas)
      └─ ferramentas MCP autorizadas
          ├─ Browser Use (servidor MCP instalado à parte)
          └─ Open Interpreter (servidor MCP instalado à parte)

Ollama executa o modelo selecionado. O Modelfile deste pacote cria o modelo local `verso` a partir de `qwen3.5:4b`.
```

## Pastas

1. `00-verso-modelo/` — Modelfile, instalador do Ollama e cópias dos conectores Verso existentes no Ideon.
2. `01-mem0/` — memória de longo prazo opcional.
3. `02-ragflow/` — busca opcional em documentos autorizados.
4. `03-open-interpreter/` — execução de ferramentas via servidor MCP, com configuração separada.
5. `04-browser-use/` — navegador via servidor MCP, com configuração separada.
6. `05-mcp-servers/` — catálogo de servidores que podem conectar ferramentas adicionais.
7. `06-crewai-langgraph-examples/` — exemplo de referência; não é runtime usado pelo aplicativo.
8. `07-langgraph/` — orquestrador JavaScript já usado pelo fluxo Verso do Ideon.
9. `08-ideon-chat/` — perfil Ollama conversacional separado para o modo Chat.

## Situação real da integração

| Componente | Situação no código do Ideon |
| --- | --- |
| Ollama / Verso | Ollama fornece geração local. O Modelfile configura comportamento; não treina nem altera pesos. O modo Work prefere `verso:latest` quando instalado. |
| Ollama / Ideon Chat | O modo Chat prefere `ideon-chat:latest` quando instalado; caso contrário, usa outro modelo local disponível com as instruções conversacionais do modo. |
| ideon Code | Mantém o modelo de programação configurado no aplicativo e recebe instruções próprias de engenharia de software. |
| LangGraph JS | Integrado no processo Node e usado para coordenar memória, documentos e ferramenta autorizada. |
| Memória local | Ativa por padrão, separada por conta. |
| Mem0 | Conector HTTP existente; depende de serviço, endpoint e configuração local. |
| RAGFlow | Conector HTTP existente; depende de serviço, chave e IDs de conjuntos de dados. |
| MCP | Cliente existente para serviços configurados; descoberta, revisão e autorização são necessárias. |
| Browser Use | Não vem instalado. Pode ser chamado como servidor MCP depois de instalação, revisão e autorização. |
| Open Interpreter | Não vem instalado. Pode ser chamado como servidor MCP depois de instalação, revisão e autorização. |
| CrewAI + LangGraph | Exemplo de integração externo, incluído aqui apenas como referência. O Ideon usa LangGraph JS e não executa CrewAI. |

**Importante:** os perfis Chat e Verso são configurações do Ollama baseadas em `qwen3.5:4b`; eles não são novos pesos treinados. O aplicativo prefere `ideon-chat:latest` no Chat e `verso:latest` no Work quando cada perfil correspondente estiver instalado. O modo Code continua usando a configuração de programação existente.

## Instalação do modelo Verso

No Windows, instale o Ollama, extraia `00-verso-modelo/` e execute `Instalar Verso.bat`. O Ollama baixa `qwen3.5:4b` e cria o nome local `verso`. Os pesos são baixados pelo Ollama e não são armazenados neste ZIP nem devem ser enviados ao GitHub.

Para instalar o perfil do Chat, extraia `08-ideon-chat/` e execute `Instalar Ideon Chat.bat`. O Ollama cria o nome local `ideon-chat`. O perfil pode ser testado com `ollama run ideon-chat`.

## Configurar serviços opcionais

Use `exemplos/.env.example` como referência e mantenha credenciais apenas no `.env` local, que não deve ser versionado. Para MCP, crie a configuração local descrita em `00-verso-modelo/README.md`. Instale e revise cada servidor antes de configurá-lo. Permissões do Ideon não substituem isolamento do sistema operacional.

Consulte `ARQUITETURA.md` antes de habilitar serviços. O pacote não inicia serviços externos automaticamente e não publica nem expõe seu Ollama na internet.
