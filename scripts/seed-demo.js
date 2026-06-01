const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const { Usuario, Categoria, Transacao } = require('../models');
const { CATEGORIAS_SEED } = require('../constants/categorias');

const DEMO = {
  nome: 'Demo User',
  email: 'demo@fincontrol.com',
  senha: 'password',
};

const TRANSACOES_SEED = [
  { descricao: 'Salário mensal', valor: 5200.00, data: '2026-01-05', categoria: 'Salário' },
  { descricao: 'Aluguel', valor: 1800.00, data: '2026-01-08', categoria: 'Moradia' },
  { descricao: 'Supermercado', valor: 412.30, data: '2026-01-12', categoria: 'Alimentação' },
  { descricao: 'Uber / transporte', valor: 89.50, data: '2026-01-15', categoria: 'Transporte' },
  { descricao: 'Netflix e Spotify', valor: 74.90, data: '2026-01-18', categoria: 'Assinaturas' },
  { descricao: 'Freelance design', valor: 850.00, data: '2026-02-03', categoria: 'Vendas' },
  { descricao: 'Salário mensal', valor: 5200.00, data: '2026-02-05', categoria: 'Salário' },
  { descricao: 'Conta de luz e água', valor: 245.80, data: '2026-02-10', categoria: 'Contas e utilidades' },
  { descricao: 'Farmácia', valor: 128.40, data: '2026-02-14', categoria: 'Saúde' },
  { descricao: 'Cinema e jantar', valor: 195.00, data: '2026-02-20', categoria: 'Lazer' },
  { descricao: 'PIX recebido', valor: 300.00, data: '2026-03-02', categoria: 'Transferências' },
  { descricao: 'Salário mensal', valor: 5200.00, data: '2026-03-05', categoria: 'Salário' },
  { descricao: 'Curso online', valor: 199.90, data: '2026-03-08', categoria: 'Educação' },
  { descricao: 'Roupas e calçados', valor: 459.00, data: '2026-03-15', categoria: 'Compras' },
  { descricao: 'Restaurante', valor: 87.60, data: '2026-03-22', categoria: 'Alimentação' },
  { descricao: 'Dividendos ações', valor: 420.00, data: '2026-04-01', categoria: 'Investimentos' },
  { descricao: 'Salário mensal', valor: 5200.00, data: '2026-04-05', categoria: 'Salário' },
  { descricao: 'Aluguel', valor: 1800.00, data: '2026-04-08', categoria: 'Moradia' },
  { descricao: 'Combustível', valor: 320.00, data: '2026-04-12', categoria: 'Transporte' },
  { descricao: 'Presente aniversário', valor: 150.00, data: '2026-04-18', categoria: 'Outros (despesa)' },
  { descricao: 'Reembolso empresa', valor: 75.00, data: '2026-04-25', categoria: 'Outros (receita)' },
  { descricao: 'Salário mensal', valor: 5200.00, data: '2026-05-05', categoria: 'Salário' },
  { descricao: 'Supermercado', valor: 342.50, data: '2026-05-12', categoria: 'Alimentação' },
  { descricao: 'Academia', valor: 129.90, data: '2026-05-15', categoria: 'Saúde' },
  { descricao: 'Viagem fim de semana', valor: 680.00, data: '2026-05-20', categoria: 'Lazer' },
  { descricao: 'Internet fibra', valor: 119.90, data: '2026-05-25', categoria: 'Contas e utilidades' },
];

const force = process.argv.includes('--force');

async function main() {
  await sequelize.sync();

  if (await Categoria.count() === 0) {
    await Categoria.bulkCreate(CATEGORIAS_SEED);
    console.log('Categorias padrão criadas.');
  } else {
    for (const cat of CATEGORIAS_SEED) {
      await Categoria.findOrCreate({ where: { nome: cat.nome }, defaults: cat });
    }
  }

  const hash = await bcrypt.hash(DEMO.senha, 10);
  const [usuario, created] = await Usuario.findOrCreate({
    where: { email: DEMO.email },
    defaults: { nome: DEMO.nome, senha: hash },
  });

  if (created) {
    console.log(`Usuário demo criado: ${DEMO.email}`);
  } else {
    console.log(`Usuário demo já existe: ${DEMO.email}`);
  }

  const mapaCategoria = Object.fromEntries(
    (await Categoria.findAll()).map(c => [c.nome, c.id])
  );

  const existentes = await Transacao.count({ where: { usuario_id: usuario.id } });

  if (existentes > 0 && !force) {
    console.log(`Demo já possui ${existentes} transação(ões). Use --force para recriar.`);
    console.log(`Login: ${DEMO.email} / ${DEMO.senha}`);
    process.exit(0);
  }

  if (force && existentes > 0) {
    await Transacao.destroy({ where: { usuario_id: usuario.id } });
    console.log(`Removidas ${existentes} transação(ões) anteriores do demo.`);
  }

  const transacoes = TRANSACOES_SEED.map(t => {
    const categoria_id = mapaCategoria[t.categoria];
    if (!categoria_id) {
      throw new Error(`Categoria não encontrada: ${t.categoria}`);
    }
    return {
      descricao: t.descricao,
      valor: t.valor,
      data: t.data,
      usuario_id: usuario.id,
      categoria_id,
    };
  });

  await Transacao.bulkCreate(transacoes);
  console.log(`${transacoes.length} transações criadas para o usuário demo.`);
  console.log(`Login: ${DEMO.email} / ${DEMO.senha}`);
  process.exit(0);
}

main().catch(err => {
  console.error('Erro ao executar seed:', err.message);
  process.exit(1);
});
