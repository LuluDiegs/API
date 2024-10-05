const express = require('express');
const cors = require('cors');
require('dotenv').config();
const tarefaRoutes = require('./routes/tarefaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    'https://luludiegs.github.io',
    'https://luludiegs.github.io/',
    'https://luludiegs.github.io/TodoApp_Frontend',
    'https://luludiegs.github.io/TodoApp_Frontend/'
];

app.use(cors({
    origin: function (origin, callback) {
        console.log('Origem da requisição:', origin);
        if (!origin || allowedOrigins.includes(origin)) {
            console.log('Origem permitida:', origin);
            callback(null, true);
        } else {
            console.log('Origem bloqueada:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

app.use(express.json());

app.use('/api/tarefas', tarefaRoutes);
app.use('/api/usuario', usuarioRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
