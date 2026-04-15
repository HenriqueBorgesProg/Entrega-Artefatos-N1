
const prisma = require("../config/prisma");

exports.criarMensagem = async (conteudo, id_solicitacao, id_remetente, id_destinatario) => {
    return await prisma.mensagens.create({
        data: {
            conteudo,
            id_solicitacao,
            id_remetente,
            id_destinatario,
            lida: false
        }
    })
};

exports.findyBySolicitacaoId = async (id_solicitacao) => {
    return await prisma.mensagens.findMany({
        where: {
            id_solicitacao
        },
        orderBy: {
            enviada_em: 'asc'
        }
    })
};

exports.marcarComoLidas = async (id_solicitacao, id_destinatario) => {
    return await prisma.mensagens.updateMany({
        where: {
            id_solicitacao,
            id_destinatario,
            lida: false
        },
        data: {
            lida: true
        }
    });
};
exports.contarNaoLidas = async (id_destinatario) => {
    return await prisma.mensagens.count({
        where: {
            id_destinatario,
            lida: false
        }
    });
}

