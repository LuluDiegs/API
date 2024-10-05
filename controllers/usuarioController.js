const usuarioModel = require('../models/usuarioModel');
const { hashSenha, compararSenhas, gerarToken } = require('../utils/helpers');
const { validarCampos, validarEmail, validarSenha } = require('../utils/validators');
const { enviarEmail } = require('../services/emailService');
const jwt = require('jsonwebtoken');
const { handleError } = require('../utils/errorHandler');

// Registro de novo usuário
const register = async (req, res) => {
    const { nome, sobrenome, email, senha } = req.body;

    console.log('Corpo da requisição recebido:', req.body);

    if (!validarCampos(nome, sobrenome, email, senha)) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    try {
        if (!(await validarEmail(email))) {
            return res.status(400).json({ error: 'E-mail já está em uso!' });
        }

        const senhaErro = validarSenha(senha);
        if (senhaErro) {
            return res.status(400).json({ error: senhaErro });
        }

        const senhaHashed = await hashSenha(senha);
        await usuarioModel.createUser(nome, sobrenome, email, senhaHashed);

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const verificaLink = `https://luludiegs.github.io/TodoApp_Frontend/verificar-email?token=${token}`;

        await enviarEmail(email, 'Verificação de E-mail', `Clique no link para verificar seu e-mail:\n\n${verificaLink}`,
            `<p>Clique no link para verificar seu e-mail:</p><p><a href="${verificaLink}">Verificar E-mail</a></p>`);

        res.status(201).json({ message: 'Conta criada com sucesso. Verifique seu e-mail para ativar sua conta!' });
    } catch (error) {
        handleError(res, error);
    }
};

// Login de usuário existente
const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await usuarioModel.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const senhaValida = await compararSenhas(senha, user.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const token = gerarToken(user.id);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
};


// Verificação de e-mail
const verificarEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) return res.status(400).json({ error: 'Token é obrigatório!' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const user = await usuarioModel.findUserByEmail(email);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado!' });

        if (user.verificado) {
            return res.status(400).json({ error: 'E-mail já verificado anteriormente!' });
        }

        await usuarioModel.updateUserVerification(email);

        res.status(200).json({ message: 'E-mail verificado com sucesso!' });
    } catch (error) {
        console.error('Erro ao verificar e-mail:', error);
        return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }
};

// Solicitação de recuperação de senha
const esqueceuSenha = async (req, res) => {
    console.log('Requisição recebida:', req.body);
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'E-mail é obrigatório!' });

    try {
        const user = await usuarioModel.findUserByEmail(email);
        if (!user) return res.status(404).json({ error: 'E-mail não encontrado!' });

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `https://luludiegs.github.io/TodoApp_Frontend/resetar-senha?token=${token}`;

        await enviarEmail(email, 'Recuperação de Senha', `Clique no link para redefinir sua senha:\n\n${resetLink}`,
            `<p>Clique no link para redefinir sua senha:</p><p><a href="${resetLink}">Redefinir Senha</a></p>`);

        res.status(200).json({ message: 'E-mail de recuperação enviado!' });
    } catch (error) {
        console.error('Erro ao enviar o e-mail de recuperação:', error);
        res.status(500).json({ error: 'Erro ao enviar o e-mail de recuperação.' });
    }
};

// Resetar senha com token
const resetarSenha = async (req, res) => {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) return res.status(400).json({ error: 'Token e nova senha são obrigatórios!' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const hashedSenha = await hashSenha(novaSenha);

        await usuarioModel.updateUserPassword(email, hashedSenha);

        res.status(200).json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
        handleError(res, error);
    }
};

// Alteração de senha de usuário autenticado
const alterarSenha = async (req, res) => {
    const { senhaAntiga, novaSenha } = req.body;
    const userId = req.userId;

    if (!validarCampos(senhaAntiga, novaSenha)) {
        return res.status(400).json({ error: 'Senha antiga e nova senha são obrigatórias' });
    }

    const senhaErro = validarSenha(novaSenha);
    if (senhaErro) {
        return res.status(400).json({ error: senhaErro });
    }

    try {
        const user = await usuarioModel.findUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        const senhaValida = await compararSenhas(senhaAntiga, user.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha antiga inválida!' });
        }

        const hashedSenha = await hashSenha(novaSenha);
        await usuarioModel.updateUserPasswordById(userId, hashedSenha);

        res.status(200).json({ message: 'Senha alterada com sucesso!' });
    } catch (error) {
        console.error('Erro ao alterar a senha:', error);
        return res.status(500).json({ error: 'Erro ao alterar a senha.' });
    }
};



// Deletar conta de usuário
const deletarConta = async (req, res) => {
    const { senha } = req.body;
    const userId = req.userId;

    if (!senha) return res.status(400).json({ error: 'Senha é obrigatória!' });

    try {
        const user = await usuarioModel.findUserById(userId);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado!' });

        const senhaValida = await compararSenhas(senha, user.senha);
        if (!senhaValida) return res.status(401).json({ error: 'Credenciais inválidas!' });

        await usuarioModel.deleteUser(userId);

        res.status(200).json({ message: 'Conta excluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar conta:', error);
        res.status(500).json({ error: 'Erro ao deletar conta.' });
    }
};

module.exports = {
    register,
    login,
    verificarEmail,
    esqueceuSenha,
    resetarSenha,
    alterarSenha,
    deletarConta
};
