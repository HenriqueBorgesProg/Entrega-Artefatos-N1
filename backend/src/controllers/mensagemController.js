const mensagemService = require('../services/mensagemService');

exports.criarMensagem = async (req, res) => {
    try {
        const { conteudo } = req.body;
        const { id_solicitacao } = req.params;
        const mensagem = await mensagemService.criarMensagem(conteudo, Number(id_solicitacao), req.user);
        res.status(201).json(mensagem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.findyBySolicitacaoId = async (req, res) => {
    try {
        const { id_solicitacao } = req.params;
        const mensagens = await mensagemService.findyBySolicitacaoId(Number(id_solicitacao));
        res.json(mensagens);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.marcarComoLidas = async (req, res) => {
    try {
        const { id_solicitacao } = req.params;
        const solicitacaoId = Number(id_solicitacao);

        if (!Number.isInteger(solicitacaoId)) {
            return res.status(400).json({ error: 'ID da solicitação inválido' });
        }

        const resultado = await mensagemService.marcarComoLidas(solicitacaoId, req.user);
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.contarNaoLidas = async (req, res) => {
    try {
        const total = await mensagemService.contarNaoLidas(req.user);
        return res.status(200).json({ total });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};