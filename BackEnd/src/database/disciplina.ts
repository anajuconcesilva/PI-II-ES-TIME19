import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import pool from "./connection";

export interface Disciplina {
    id: number;
    nome: string;
    sigla?: string;
    codigo?: string;
    periodo?: number;
    idCurso?: number;
    nomeCurso?: string;
    nomeInstituicao?: string;
}

// ================================
// 1) Adicionar disciplina
// ================================
export async function addDisciplina(
    nome: string,
    codigo?: string,
    periodo?: number,
    idCurso?: number
): Promise<number> {
    const conn: PoolConnection = await pool.getConnection();
    try {
        const [result] = await conn.execute<ResultSetHeader>(
            `INSERT INTO Disciplina (Nome_Disciplina, Codigo_Disciplina, Periodo_Curso, ID_Curso) 
             VALUES (?, ?, ?, ?)`,
            [nome, codigo ?? null, periodo ?? null, idCurso ?? null]
        );
        return result.insertId;
    } finally {
        conn.release();
    }
}

// ================================
// 2) Buscar todas disciplinas de um docente
// ================================
export async function getAllDisciplinasByDocente(docenteId: number): Promise<Disciplina[]> {
    const conn: PoolConnection = await pool.getConnection();
    try {
        const [rows] = await conn.query<RowDataPacket[]>(`
            SELECT 
                d.ID_Disciplina AS id,
                d.Nome_Disciplina AS nome,
                d.Codigo_Disciplina AS codigo,
                d.Periodo_Curso AS periodo,
                d.ID_Curso AS idCurso,
                c.Nome_Curso AS nomeCurso,
                i.Nome_Instituicao AS nomeInstituicao
            FROM Disciplina d
            INNER JOIN Curso c ON c.ID_Curso = d.ID_Curso
            INNER JOIN Instituicao i ON i.ID_Instituicao = c.ID_Instituicao
            WHERE i.ID_Docente = ?
        `, [docenteId]);
        return rows as Disciplina[];
    } finally {
        conn.release();
    }
}

// ================================
// 3) Deletar disciplina
// ================================
export async function deleteDisciplina(id: number): Promise<{ success: boolean; message: string }> {
    const conn: PoolConnection = await pool.getConnection();
    try {
        const [result] = await conn.execute<ResultSetHeader>(
            `DELETE FROM Disciplina WHERE ID_Disciplina = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return { success: false, message: "Disciplina não encontrada" };
        }

        return { success: true, message: "Disciplina deletada com sucesso" };
    } finally {
        conn.release();
    }
}
