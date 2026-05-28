function formatMoeda(valor) {
  return parseFloat(valor).toFixed(2).replace('.', ',');
}

function formatData(isoDate) {
  return new Date(isoDate + 'T00:00:00').toLocaleDateString('pt-BR');
}

function mapHistorico(historico) {
  return historico.map(t => {
    const isReceita = t.Categoria.tipo === 'receita';
    return {
      id: t.id,
      dataFormatada: formatData(t.data),
      descricao: t.descricao || '—',
      categoriaNome: t.Categoria.nome,
      categoriaTipo: isReceita ? 'Receita' : 'Despesa',
      valorFormatado: formatMoeda(t.valor),
      tipoBadgeClass: isReceita ? 'tipo-badge--receita' : 'tipo-badge--despesa', // para estilização do CSS
      valorClass: isReceita ? 'text-success' : 'text-danger', // para estilização do CSS
    };
  });
}

function mapCategoria(c, transacao) {
  return {
    id: c.id,
    nome: c.nome,
    selected: !!(transacao && transacao.categoria_id === c.id),
  };
}

function buildTransacaoForm(transacao, categorias, erro) {
  const isEdicao = !!transacao;
  return {
    titulo: isEdicao ? 'Editar Transação' : 'Nova Transação',
    formAction: isEdicao ? `/transacoes/${transacao.id}` : '/transacoes',
    botaoSubmit: isEdicao ? 'Salvar Alterações' : 'Registrar Transação',
    descricao: transacao?.descricao || '',
    valor: transacao ? parseFloat(transacao.valor).toFixed(2) : '',
    data: transacao?.data || '',
    categoriasReceita: categorias.filter(c => c.tipo === 'receita').map(c => mapCategoria(c, transacao)),
    categoriasDespesa: categorias.filter(c => c.tipo === 'despesa').map(c => mapCategoria(c, transacao)),
    erro,
  };
}

module.exports = {
  formatMoeda,
  formatData,
  mapHistorico,
  buildTransacaoForm,
};
