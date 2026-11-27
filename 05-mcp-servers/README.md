# 05 — Model Context Protocol (MCP) Servers

**O que faz:** oferece servidores de ferramentas que seguem um protocolo comum para que aplicativos clientes descubram e chamem funções externas.

**Fonte oficial:** https://github.com/modelcontextprotocol/servers

**Ligação no Ideon:** o cliente MCP já está no app. A configuração é local e administrativa, em `.ideon-private/verso-tools.local.json`; cada servidor deve declarar transporte, executável ou URL, ferramentas permitidas, conta e escopo. O catálogo do Ideon descobre ferramentas, e a pessoa revisa e autoriza antes da execução.

O repositório MCP é uma coleção de servidores, não um plugin único que ativa tudo. Instale apenas servidores confiáveis e restrinja-os no sistema operacional.
