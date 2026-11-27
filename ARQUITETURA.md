# Arquitetura e ordem de integração

## Fluxo

1. O aplicativo recebe a mensagem e identifica a conta, o modo e o contexto.
2. LangGraph coordena a recuperação da memória local, a consulta opcional ao Mem0, a busca opcional no RAGFlow e, se houver autorização explícita para aquele envio, uma ferramenta MCP.
3. O contexto permitido é enviado ao modelo disponível no Ollama.
4. A resposta é mostrada e a troca é salva na memória local; Mem0 também recebe a troca quando configurado.
5. O painel de progresso exibe etapas reais. Serviço ausente ou falha não deve ser mostrado como sucesso.

## O que significa “integrado”

Os conectores no código permitem que o Ideon converse com esses serviços. Isso não significa que cada projeto esteja instalado, ativo ou incorporado aos pesos do modelo. Mem0, RAGFlow, Browser Use e Open Interpreter precisam de seus próprios serviços e configurações. A chamada de ferramenta passa por revisão e autorização no app; mantenha também as restrições do sistema operacional e do próprio serviço.

## Dependências e execução

O projeto atual exige Node.js 22+, dependências do `package.json`, Ollama e um modelo compatível. LangGraph e o cliente MCP rodam no processo Node. Mem0, RAGFlow, Browser Use e Open Interpreter não são instalados por `npm install` do Ideon.

Para manter este pacote em sincronia, atualize as cópias em `00-verso-modelo/conectores-ideon/` a partir dos arquivos correspondentes na raiz do projeto. O aplicativo continua usando os arquivos originais da raiz; esta cópia existe para tornar o pacote autodescritivo.
