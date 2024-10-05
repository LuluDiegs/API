const tarefaModel = require('../models/tarefaModel');
const { handleError } = require('../utils/errorHandler');

const getAll = async (req, res) => {
    try {
        const { data, error } = await tarefaModel.getAll(req.userId);
        if (error) throw error;
        if (!data) {
            console.error('Nenhuma tarefa encontrada para o usuário:', req.userId);
            return res.status(404).json({ message: 'Nenhuma tarefa encontrada' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error.message);
        res.status(500).json({ message: 'Erro ao buscar tarefas' });
    }
};

const create = async (req, res) => {
    const { descricao, concluida = false } = req.body;

    if (!descricao) {
        console.error('Erro: Descrição é obrigatória.');
        return res.status(400).json({ message: 'Descrição é obrigatória.' });
    }

    try {
        const { data, error } = await tarefaModel.create(req.userId, descricao, concluida);
        if (error) {
            console.error('Erro ao criar tarefa:', error.message);
            return res.status(500).json({ message: 'Erro interno ao criar a tarefa.' });
        }

        return res.status(201).json(data);
    } catch (error) {
        console.error('Erro inesperado ao criar tarefa:', error.message);
        return res.status(500).json({ message: 'Erro interno ao processar a criação da tarefa.' });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await tarefaModel.deleteTarefa(req.userId, id);
        if (error) throw error;
        res.status(200).json({ message: 'Tarefa excluída com sucesso!', data });
    } catch (error) {
        console.error('Erro ao remover tarefa:', error.message);
        handleError(res, error);
    }
};

const updateTarefa = async (req, res) => {
    const { id } = req.params;
    const { descricao, concluida } = req.body;
    try {
        const { data, error } = await tarefaModel.update(id, descricao, concluida);

        if (error) {
            console.error('Erro ao atualizar tarefa no banco de dados:', error);
            return res.status(500).json({ message: 'Erro ao atualizar tarefa no banco de dados!' });
        }

        if (!data || (Array.isArray(data) && data.length === 0)) {
            console.error('Tarefa não encontrada para o ID fornecido:', id);
            return res.status(404).json({ message: 'Tarefa não encontrada!' });
        }

        res.status(200).json({ message: 'Tarefa atualizada com sucesso!', data });
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        res.status(500).json({ message: 'Erro ao atualizar tarefa!' });
    }
};

module.exports = { getAll, create, remove, updateTarefa };
