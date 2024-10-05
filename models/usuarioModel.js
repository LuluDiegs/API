const supabase = require('../services/supabaseService');

// Cria um novo usuário
const createUser = async (nome, sobrenome, email, senhaHashed) => {
    const { data, error } = await supabase
        .from('usuarios')
        .insert([{ nome, sobrenome, email, senha: senhaHashed, verificado: false }]);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Encontra um usuário pelo e-mail
const findUserByEmail = async (email) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Atualiza o status de verificação do e-mail
const updateUserVerification = async (email) => {
    const { data, error } = await supabase
        .from('usuarios')
        .update({ verificado: true })
        .eq('email', email);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Atualiza a senha do usuário pelo e-mail
const updateUserPassword = async (email, senhaHashed) => {
    const { data, error } = await supabase
        .from('usuarios')
        .update({ senha: senhaHashed })
        .eq('email', email);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Atualiza a senha do usuário pelo ID
const updateUserPasswordById = async (userId, senhaHashed) => {
    const { data, error } = await supabase
        .from('usuarios')
        .update({ senha: senhaHashed })
        .eq('id', userId);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};


// Encontra um usuário pelo ID
const findUserById = async (id) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};


// Deleta um usuário pelo ID
const deleteUser = async (id) => {
    const { data, error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

module.exports = {
    createUser,
    findUserByEmail,
    updateUserVerification,
    updateUserPassword,
    updateUserPasswordById,
    findUserById,
    deleteUser
};
