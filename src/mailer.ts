import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function testarEmail(email: string) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Teste de envio de e-mail",
      text: "Se você recebeu isto, o backend está funcionando!",
    });

    console.log("E-mail enviado com sucesso!");
  } catch (erro: any) {
    console.error("Erro ao enviar e-mail:", erro.message);
  }
}



