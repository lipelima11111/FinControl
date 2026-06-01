// Formata dados para o Mustache (templates não têm lógica)

// Formata valor em moeda brasileira (R$ 1.234,56)
function formatMoeda(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return '0,00';
  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Formata data em português brasileiro (dd/mm/aaaa)
function formatData(isoDate) {
  return new Date(isoDate + 'T00:00:00').toLocaleDateString('pt-BR');
}

// Converte transações do banco em objeto pronto para a tabela do dashboard
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
      tipoBadgeClass: isReceita ? 'tipo-badge--receita' : 'tipo-badge--despesa',  // Classe CSS para o badge de tipo
      valorClass: isReceita ? 'text-success' : 'text-danger',  // Classe CSS para o valor
    };
  });
}

// Converte categorias do banco em objeto pronto para o formulário de nova/edição de transação
function mapCategoria(c, transacao) {
  return {
    id: c.id,
    nome: c.nome,
    selected: !!(transacao && transacao.categoria_id === c.id),
  };
}

// Monta objeto único para o formulário de nova/edição de transação
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
