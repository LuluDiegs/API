const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashSenha = async (senha) => {
    const saltRounds = 10;
    return await bcrypt.hash(senha, saltRounds);
};

const compararSenhas = async (senha, hashedSenha) => {
    return await bcrypt.compare(senha, hashedSenha);
};

const gerarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

function verificaJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ auth: false, message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ auth: false, message: 'Token malformado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Erro ao verificar o token:', err);
            return res.status(401).json({ auth: false, message: 'Token inválido ou expirado' });
        }
        req.userId = decoded.id;
        next();
    });
}

module.exports = { hashSenha, compararSenhas, gerarToken, verificaJWT };
