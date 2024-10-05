const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const enviarEmail = async (to, subject, text, html) => {
    try {
        const emailConfig = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
            html: html
        };

        await transporter.sendMail(emailConfig);
        console.log('E-mail enviado com sucesso');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error.message);
        throw error;
    }
};

module.exports = { enviarEmail };
