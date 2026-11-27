// O servidor é a única origem dos estados das etapas. Sem dados de conversa nos eventos.
function criarProgresso(enviar, signal) {
  const abertos = new Map();
  function emitir(id, acao, icone, estado) {
    const evento = { id, acao, icone, estado, instante: Date.now() };
    if (estado === 'em_andamento') abertos.set(id, evento);
    else abertos.delete(id);
    enviar(evento);
  }
  async function etapa(id, acao, icone, executar, concluido, opcional = false) {
    signal?.throwIfAborted();
    emitir(id, acao, icone, 'em_andamento');
    try {
      const resultado = await executar();
      signal?.throwIfAborted();
      emitir(id, typeof concluido === 'function' ? concluido(resultado) : concluido, icone, 'concluido');
      return resultado;
    } catch (erro) {
      const cancelado = signal?.aborted;
      emitir(id, cancelado ? acao + ': cancelado' : acao + ': indisponível ou falhou', icone, cancelado ? 'cancelado' : 'erro');
      if (!opcional || cancelado) throw erro;
      return null;
    }
  }
  function encerrar(estado) {
    for (const evento of [...abertos.values()]) emitir(evento.id, evento.acao + (estado === 'cancelado' ? ': cancelado' : ': falhou'), evento.icone, estado);
  }
  return { emitir, etapa, encerrar };
}
module.exports = { criarProgresso };
