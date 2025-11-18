import { Request, Response } from "express";
import { db } from "../database";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        // Verifica se o docente existe
        const [rows]: any = await db.query(
            "SELECT * FROM docentes WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "E-mail não encontrado" });
        }

        // Gera token aleatório
        const token = crypto.randomBytes(32).toString("hex");

        //  Define validade do token (1 hora)
        const expires = new Date(Date.now() + 3600000);

        // Salva no banco
        await db.query(
            "UPDATE docentes SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
            [token, expires, email]
        );

        //  Configura envio de e-mail
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "seuEmail@gmail.com",
                pass: "suaSenhaDeAplicativo"
            }
        });

        const resetLink = `http://localhost:3000/redefinir-senha.html?token=${token}`;

        //  Envia e-mail
        await transporter.sendMail({
            from: "NOTADEZ <no-reply@notadez.com>",
            to: email,
            subject: "Redefinição de senha - NOTADEZ",
            text: `Clique no link para redefinir sua senha: ${resetLink}`,
            html: `
                <p>Você solicitou uma redefinição de senha.</p>
                <p>Clique no botão abaixo:</p>
                <a href="${resetLink}" style="padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Redefinir senha</a>
                <p>Se não foi você, ignore este e-mail.</p>
            `
        });

        res.json({ message: "E-mail enviado!" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};

