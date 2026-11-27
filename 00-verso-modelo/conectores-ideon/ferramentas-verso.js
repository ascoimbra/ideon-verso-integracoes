const { readFile } = require('node:fs/promises');
const { join } = require('node:path');
const { randomUUID, createHash } = require('node:crypto');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
const { StreamableHTTPClientTransport } = require('@modelcontextprotocol/sdk/client/streamableHttp.js');

// Configuração administrativa local. Nenhum comando, endpoint ou segredo vem do modelo.
function criarFerramentasVerso({ pastaDados, env = process.env }) {
  const arquivo = env.IDEON_VERSO_TOOLS_FILE || join(pastaDados, '.ideon-private', 'verso-tools.local.json');
  const tickets = new Map();
  async function configuracao(usuarioId) {
    let texto;
    try { texto = await readFile(arquivo, 'utf8'); }
    catch (e) { if (e.code === 'ENOENT') return { servidores: [], assinatura: '' }; throw new Error('Não foi possível ler a configuração local de ferramentas.'); }
    const dados = JSON.parse(texto);
    if (!Array.isArray(dados.servidores)) throw new Error('Configuração de servidores inválida.');
    const servidores = dados.servidores.filter(s => s.contas?.includes(usuarioId));
    for (const s of servidores) {
      if (!/^[a-z0-9_-]{1,50}$/i.test(s.id) || !['browser-use', 'interpreter', 'mcp'].includes(s.tipo) || !Array.isArray(s.ferramentas) || !s.permissao) throw new Error('Revise permissões e ferramentas na configuração local.');
    }
    return { servidores, assinatura: createHash('sha256').update(texto).digest('hex') };
  }
  async function conectar(s, signal, executar) {
    let transporte;
    if (s.transporte === 'http') {
      const url = new URL(s.url);
      if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) throw new Error('Use HTTPS ou loopback.');
      const headers = {};
      if (s.tokenEnv) {
        if (!env[s.tokenEnv]) throw new Error('Credencial local ausente.');
        headers.Authorization = 'Bearer ' + env[s.tokenEnv];
      }
      transporte = new StreamableHTTPClientTransport(url, { requestInit: { headers, redirect: 'error' } });
    } else if (s.transporte === 'stdio' && typeof s.comando === 'string') {
      const ambiente = {};
      for (const nome of ['PATH', 'Path', 'SystemRoot', 'SYSTEMROOT', 'TEMP', 'TMP', 'HOME', 'USERPROFILE', ...(s.variaveisEnv || [])]) if (env[nome]) ambiente[nome] = env[nome];
      transporte = new StdioClientTransport({ command: s.comando, args: s.argumentos || [], env: ambiente, stderr: 'ignore' });
    } else throw new Error('Transporte MCP inválido.');
    const client = new Client({ name: 'ideon-verso', version: '1.0.0' });
    const cancelamento = () => { void client.close().catch(() => {}); };
    const prazo = AbortSignal.any([...(signal ? [signal] : []), AbortSignal.timeout(30000)]);
    prazo.addEventListener('abort', cancelamento, { once: true });
    try {
      prazo.throwIfAborted();
      await client.connect(transporte, { timeout: 15000, signal: prazo });
      prazo.throwIfAborted();
      return await executar(client, prazo);
    } finally { prazo.removeEventListener('abort', cancelamento); await client.close().catch(() => {}); }
  }
  async function listar(s, signal) {
    return conectar(s, signal, async (client, prazo) => {
      const resposta = await client.listTools({}, { signal: prazo, timeout: 15000 });
      return resposta.tools.filter(t => s.ferramentas.includes(t.name)).map(t => ({ nome: t.name, descricao: t.description || '', schema: t.inputSchema }));
    });
  }
  async function catalogo(usuarioId, signal) {
    const { servidores } = await configuracao(usuarioId);
    const resultado = [];
    for (const s of servidores) {
      try { resultado.push({ id: s.id, tipo: s.tipo, permissao: s.permissao, estado: 'disponivel', ferramentas: await listar(s, signal) }); }
      catch { resultado.push({ id: s.id, tipo: s.tipo, permissao: s.permissao, estado: 'indisponivel', erro: 'Servidor não respondeu. Confira instalação, endereço, credenciais e ferramentas permitidas.', ferramentas: [] }); }
    }
    return resultado;
  }
  async function revisar(usuarioId, dados, signal) {
    const { servidores, assinatura } = await configuracao(usuarioId);
    const servidor = servidores.find(s => s.id === dados.servidor);
    if (!servidor || !servidor.ferramentas.includes(dados.ferramenta) || !dados.argumentos || Array.isArray(dados.argumentos) || typeof dados.argumentos !== 'object' || JSON.stringify(dados.argumentos).length > 16000) throw new Error('Ferramenta ou argumentos não permitidos.');
    const ferramentas = await listar(servidor, signal);
    if (!ferramentas.some(t => t.nome === dados.ferramenta)) throw new Error('Ferramenta indisponível no servidor.');
    const argumentos = { ...dados.argumentos, ...(servidor.argumentosFixos?.[dados.ferramenta] || {}) };
    for (const [id, t] of tickets) if (t.expira < Date.now()) tickets.delete(id);
    if (tickets.size > 200) throw new Error('Há muitas revisões pendentes. Aguarde cinco minutos.');
    const autorizacao = randomUUID();
    tickets.set(autorizacao, { usuarioId, servidor: servidor.id, ferramenta: dados.ferramenta, argumentos, assinatura, expira: Date.now() + 300000 });
    return { autorizacao, servidor: servidor.id, ferramenta: dados.ferramenta, argumentos, permissao: servidor.permissao, validadeSegundos: 300 };
  }
  async function executar({ autorizacao, usuarioId, signal, progresso }) {
    const ticket = tickets.get(autorizacao);
    if (!ticket || ticket.usuarioId !== usuarioId || ticket.expira < Date.now()) throw new Error('Autorização ausente ou vencida. Revise a ferramenta novamente.');
    tickets.delete(autorizacao);
    const { servidores, assinatura } = await configuracao(usuarioId);
    const s = servidores.find(s => s.id === ticket.servidor);
    if (assinatura !== ticket.assinatura || !s?.ferramentas.includes(ticket.ferramenta)) throw new Error('A configuração mudou. Revise a ferramenta novamente.');
    const acao = `${s.tipo === 'browser-use' ? 'Ferramenta Browser Use' : s.tipo === 'interpreter' ? 'Ferramenta Open Interpreter' : 'Ferramenta MCP'}: ${s.id} / ${ticket.ferramenta}`;
    return progresso.etapa('ferramenta-autorizada', acao, s.tipo === 'browser-use' ? 'navegador' : s.tipo === 'interpreter' ? 'execucao' : 'mcp', () => conectar(s, signal, async (client, prazo) => {
      const retorno = await client.callTool({ name: ticket.ferramenta, arguments: ticket.argumentos }, undefined, { signal: prazo, timeout: 30000 });
      if (retorno.isError) throw new Error('A ferramenta informou falha. Revise os argumentos e os registros locais do serviço.');
      // Apenas texto; links, recursos e imagens não são buscados nem executados automaticamente.
      return (retorno.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').slice(0, 12000) || 'Ferramenta retornou sem conteúdo de texto.';
    }), `${acao}: retorno recebido`);
  }
  return { catalogo, revisar, executar };
}
module.exports = { criarFerramentasVerso };
