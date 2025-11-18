// notas.ts

import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import pool from "./connection";

export interface Nota {
    id: number;
    idAluno: number;
    idComponente: number;
    nota: number;
}

// 🔎 Verifica se aluno existe
export async function alunoExiste(idAluno: number): Promise<boolean> {
    const conn: PoolConnection = await pool.getConnection();
    try {
        const [rows] = await conn.query<RowDataPacket[]>(
            `SELECT ID_Aluno FROM Aluno WHERE ID_Aluno = ?`,
            [idAluno]
        );
        return rows.length > 0;
    } finally {
        conn.release();
    }
}

// 🔎 Verifica se componente existe
export async function componenteExiste(idComponente: number): Promise<boolean> {
    const conn: PoolConnection = await pool.getConnection();
    try {
        const [rows] = await conn.query<RowDataPacket[]>(
            `SELECT ID_Componente FROM Componente_Nota WHERE ID_Componente = ?`,
            [idComponente]
        );
        return rows.length > 0;
    } finally {
        conn.release();
    }
}

// 📌 Registrar nota
export async function registrarNota(
    idAluno: number,
    idComponente: number,
    nota: number
): Promise<{ success: boolean; message: string }> {
    if (nota < 0 || nota > 10)
        return { success: false, message: "A nota deve estar entre 0.00 e 10.00" };

    const conn: PoolConnection = await pool.getConnection();
    try {
        const existeAluno = await alunoExiste(idAluno);
        if (!existeAluno)
            return { success: false, message: "Aluno não encontrado" };

        const existeComp = await componenteExiste(idComponente);
        if (!existeComp)
            return { success: false, message: "Componente de nota não encontrado" };

        await conn.execute<ResultSetHeader>(
            `INSERT INTO Nota (ID_Aluno, ID_Componente, NotaValor)
       VALUES (?, ?, ?)`,
            [idAluno, idComponente, nota]
        );

        return { success: true, message: "Nota registrada com sucesso" };
    } finally {
        conn.release();
    }
}

// 📌 Atualizar nota
export async function atualizarNota(
    id: number,
    nota: number
): Promise<{ success: boolean; message: string }> {
    if (nota < 0 || nota > 10)
        return { success: false, message: "A nota deve estar entre 0 e 10" };

    const conn: PoolConnection = await pool.getConnection();
    try {
        const [rows] = await conn.query<RowDataPacket[]>(
            `SELECT * FROM Nota WHERE ID_Nota = ?`,
            [id]
        );

        if (rows.length === 0)
            return { success: false, message: "Nota não encontrada" };

        await conn.execute<ResultSetHeader>(
            `UPDATE Nota SET NotaValor = ? WHERE ID_Nota = ?`,
            [nota, id]
        );

        return { success: true, message: "Nota atualizada com sucesso" };
    } finally {
        conn.release();
    }
}
