const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');
const { verificaJWT } = require('../utils/helpers');

router.get('/getAll', verificaJWT, tarefaController.getAll);
router.post('/post', verificaJWT, tarefaController.create);
router.delete('/delete/:id', verificaJWT, tarefaController.remove);
router.patch('/update/:id', verificaJWT, tarefaController.updateTarefa);

module.exports = router;
