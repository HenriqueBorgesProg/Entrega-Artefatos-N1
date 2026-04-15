const mensagemModel = require('../models/mensagemModel');
const {publishMensagemCriada} = require('../infra/broker/messagePublisher');
const prisma = require("../config/prisma");

exports.criarMensagem = async (conteudo, id_solicitacao, usuarioLogado) => {
 
  const solicitacaoId = Number(id_solicitacao);

  if (!Number.isInteger(solicitacaoId)) {
    throw new Error('O campo "id_solicitacao" deve ser um número válido');
  }

  const solicitacao = await prisma.solicitacaoemprestimo.findUnique({
    where: { id: solicitacaoId },
  });

  if (!solicitacao) {
    throw new Error('Solicitação de empréstimo não encontrada');
  }

  const idRemetente = usuarioLogado.id;
  let idDestinatario;

  if (usuarioLogado.role === 'admin') {
    idDestinatario = solicitacao.id_usuario;
  } else {
    const admin = await prisma.usuarios.findFirst({
      where: { role: 'admin' },
    });

    if (!admin) {
      throw new Error('Administrador não encontrado');
    }

    if (solicitacao.id_usuario !== usuarioLogado.id) {
      throw new Error('Usuário não autorizado a enviar mensagens para esta solicitação');
    }

    idDestinatario = admin.id;
  }

  const mensagem = await mensagemModel.criarMensagem(
    String(conteudo).trim(),
    solicitacaoId,
    idRemetente,
    idDestinatario
  );

  await publishMensagemCriada({
    eventType: 'mensagem.criada',
    mensagemId: mensagem.id,
    solicitacaoId: mensagem.id_solicitacao,
    remetenteId: mensagem.id_remetente,
    destinatarioId: mensagem.id_destinatario,
    conteudo: mensagem.conteudo,
    timestamp: mensagem.enviada_em,
  });

  return mensagem;
};
exports.findyBySolicitacaoId = async (id_solicitacao) => {
    if (!id_solicitacao) {
        throw new Error('O campo "id_solicitacao" é obrigatório');
    }
    if (isNaN(id_solicitacao)) {
        throw new Error('O campo "id_solicitacao" deve ser um número');
    }
    if (id_solicitacao <= 0) {
        throw new Error('O campo "id_solicitacao" deve ser um número positivo');
    }
    return await mensagemModel.findyBySolicitacaoId(id_solicitacao);
}

exports.marcarComoLidas = async (id_solicitacao, usuarioLogado) => {
    if (!Number.isInteger(id_solicitacao)) {
        throw new Error('ID da solicitação inválido');
    }

    if (!usuarioLogado || !usuarioLogado.id) {
        throw new Error('Usuário autenticado não encontrado');
    }
    
    return await mensagemModel.marcarComoLidas(id_solicitacao, usuarioLogado.id);
};
exports.contarNaoLidas = async (usuarioLogado) => {
    if (!usuarioLogado || !usuarioLogado.id) {
        throw new Error('Usuário autenticado não encontrado');
    }

    return await mensagemModel.contarNaoLidas(usuarioLogado.id);
};