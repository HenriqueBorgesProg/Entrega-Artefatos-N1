const express = require('express');
const controller = require('../controllers/mensagemController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/nao-lidas', auth, controller.contarNaoLidas);
router.post('/:id_solicitacao', auth, controller.criarMensagem);
router.get('/:id_solicitacao', auth, controller.findyBySolicitacaoId);
router.patch('/:id_solicitacao', auth, controller.marcarComoLidas);

module.exports = router;