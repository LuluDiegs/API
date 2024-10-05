const handleError = (res, error) => {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro interno. Tente novamente mais tarde.' });
};

module.exports = { handleError };
