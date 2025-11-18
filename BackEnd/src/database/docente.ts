// Feito pela aluna Sofia de Sousa

import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "./connection";

export interface Docente {
  ID_Docente: number;
  Nome_Docente: string;
  Email: string;
  Telefone_Celular: string;
  Senha: string;
}

// Buscar todos os docentes
export async function getAllDocente(): Promise<Docente[]> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT ID_Docente, Nome_Docente, Email, Telefone_Celular, Senha FROM Docente`
    );
    return rows as Docente[];
  } finally {
    conn.release();
  }
}

// Buscar docente por ID
export async function getDocenteById(ID_Docente: number): Promise<Docente | null> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT ID_Docente, Nome_Docente, Email, Telefone_Celular, Senha FROM Docente WHERE ID_Docente = ?`,
      [ID_Docente]
    );
    return (rows as Docente[])[0] ?? null;
  } finally {
    conn.release();
  }
}

/* Adicionar docente
export async function addDocente(Nome_Docente: string, Email: string, Telefone_Celular: string, Senha: string): Promise<number> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO Docente (Nome_Docente, Email, Telefone_Celular, Senha) VALUES (?, ?, ?, ?)`,
      [Nome_Docente, Email, Telefone_Celular, Senha]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}
// Enviar link para redefinição
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const [rows]: any = await db.query("SELECT * FROM docentes WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "E-mail não encontrado" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutos

    await db.query(
      "UPDATE docentes SET reset_token = ?, reset_expires = ? WHERE email = ?",
      [token, expires, email]
    );

    const link = `http://localhost:5500/HTML/redefinir.html?token=${token}`;

    // Configurar envio de email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "seuemail@gmail.com",
        pass: "suasenha"
      }
    });

    await transporter.sendMail({
      from: "NOTADEZ <seuemail@gmail.com>",
      to: email,
      subject: "Redefinição de Senha",
      html: `
        <h2>Redefinição de Senha</h2>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${link}">${link}</a>
        <p>O link expira em 15 minutos.</p>
      `
    });

    res.json({ message: "E-mail enviado com sucesso" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erro interno" });
  }
};

// Redefinir senha com token
export const resetPassword = async (req: Request, res: Response) => {
  const { token, novaSenha } = req.body;

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM docentes WHERE reset_token = ? AND reset_expires > NOW()",
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Token inválido ou expirado" });
    }

    const hash = await bcrypt.hash(novaSenha, 10);

    await db.query(
      "UPDATE docentes SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
      [hash, rows[0].id]
    );

    res.json({ message: "Senha redefinida com sucesso" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erro interno" });
  }
};/*