# Perfil do Ideon Chat

Este perfil orienta o Qwen3.5 4B para conversas, brainstorming, dúvidas, análise de textos e explicações. Ele muda as instruções e os parâmetros de geração; não treina nem altera os pesos do modelo-base.

## Instalar no Windows

Execute `Instalar Ideon Chat.bat` com o Ollama instalado. O instalador baixa `qwen3.5:4b` se necessário e cria o perfil local `ideon-chat:latest`.

O projeto Ideon IA prefere esse perfil no modo Chat quando ele está instalado. Sem ele, o aplicativo continua usando outro modelo local disponível, junto às instruções conversacionais do modo Chat.

O perfil Verso fica separado para o modo Work. O modo Code mantém o modelo de programação já configurado no aplicativo e recebe instruções próprias de engenharia de software.

Os pesos do modelo não estão neste pacote e não devem ser enviados ao repositório. O Ollama os baixa no computador durante a instalação.
