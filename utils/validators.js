const supabase = require('../services/supabaseService');

const validarCampos = (...campos) => campos.every(campo => campo);

const validarEmail = async (email) => {
    const { data: userCriado, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email);

    if (error) {
        throw new Error('Erro ao validar o email');
    }

    return userCriado.length === 0;
};

const validarSenha = (senha) => {
    const comprimentoMinimo = 8;
    const regexComplexidade = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (senha.length < comprimentoMinimo) {
        return 'A senha deve ter pelo menos 8 caracteres!';
    }

    if (!regexComplexidade.test(senha)) {
        return 'A senha deve conter letras maiúsculas, letras minúsculas, números e caracteres especiais!';
    }

    return null;
};

module.exports = { validarCampos, validarEmail, validarSenha };
