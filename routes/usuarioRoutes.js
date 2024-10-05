const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificaJWT } = require('../utils/helpers');

router.post('/create', usuarioController.register);
router.post('/login', usuarioController.login);
router.get('/verificar-email', usuarioController.verificarEmail);
router.post('/esqueceu-senha', usuarioController.esqueceuSenha);
router.post('/resetar-senha', usuarioController.resetarSenha);
router.patch('/alterar-senha', verificaJWT, usuarioController.alterarSenha);
router.delete('/deletarConta', verificaJWT, usuarioController.deletarConta);

module.exports = router;
