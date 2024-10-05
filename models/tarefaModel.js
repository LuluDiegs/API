const supabase = require('../services/supabaseService');

const getAll = async (userId) => {
    if (!userId) {
        throw new Error('userId não definido');
    }

    console.log('UserId recebido no model:', userId);

    const { data, error } = await supabase
        .from('tarefas')
        .select('*')
        .eq('usuario_id', userId);

    if (error) throw error;

    return { data, error };
};

const create = async (userId, descricao, concluida) => {
    try {
        const { data, error } = await supabase
            .from('tarefas')
            .insert([{ descricao, concluida, usuario_id: userId }]);

        if (error) {
            console.error('Erro ao inserir tarefa no banco de dados:', error.message);
            return { error };
        }

        return { data };
    } catch (err) {
        console.error('Erro inesperado ao criar tarefa:', err.message);
        return { error: err.message };
    }
};

const update = async (id, descricao, concluida) => {
    try {
        const { data, error } = await supabase
            .from('tarefas')
            .update({ descricao, concluida })
            .eq('id', id)
            .select();

        if (error) {
            console.error('Erro ao atualizar a tarefa no banco de dados:', error);
            return { error };
        }
        return { data };
    } catch (err) {
        console.error('Erro inesperado durante a atualização no model:', err);
        return { error: err };
    }
};



const deleteTarefa = async (userId, id) => {
    const { data, error } = await supabase
        .from('tarefas')
        .delete()
        .eq('id', id)
        .eq('usuario_id', userId);

    if (error) throw error;
    return { data, error };
};

module.exports = {
    getAll,
    create,
    update,
    deleteTarefa,
};
