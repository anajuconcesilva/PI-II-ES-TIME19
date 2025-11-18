import { PoolConnection, RowDataPacket } from "mysql2/promise";

import { pool } from "./connection";

export interface Docente {
    ID: number;
    Nome: string;
    Email: string;
    Telefone_Celular: number;
    Senha: string;
}

export async function getDocenteByEmail(email: string): Promise<Docente | null> {
    const conn: PoolConnection = await pool.getConnection();
    try {
        const [rows] = await conn.execute<(Docente & RowDataPacket)[]>(
            `SELECT 
     ID_Docente   AS ID,
     Nome_Docente   AS Nome,
     Email   AS Email,
     Telefone_Celular  AS Telefone_Celular,
     Senha AS Senha
   FROM DOCENTE
   WHERE EMAIL = ?`,
            [email]
        );


        return rows.length > 0 ? rows[0] : null;
    } finally {
        conn.release();
    }
}