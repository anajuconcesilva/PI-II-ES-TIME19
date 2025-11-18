// Feito pela aluna Sofia de Sousa

import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "./connection";

export interface Curso {
  ID_Curso: number;
  Nome_Curso: string;
  ID_Instituicao?: number;
}

// Buscar todos os cursos
export async function getAllCursos(): Promise<any[]> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(`
      SELECT 
        c.ID_Curso,
        c.Nome_Curso,
        i.Nome_Instituicao AS NomeInstituicao
      FROM Curso c
      LEFT JOIN Instituicao i ON i.ID_Instituicao = c.ID_Instituicao
    `);
    return rows as any[];
  } finally {
    conn.release();
  }
}


// Buscar curso pelo ID
export async function getCursoById(ID_Curso: number): Promise<Curso | null> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT 
         ID_Curso, 
         Nome_Curso, 
         ID_Instituicao 
       FROM Curso 
       WHERE ID_Curso = ?`,
      [ID_Curso]
    );
    return (rows as Curso[])[0] ?? null;
  } finally {
    conn.release();
  }
}

// Adicionar novo curso
export async function addCurso(Nome_Curso: string, ID_Instituicao?: number): Promise<number> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO Curso (Nome_Curso, ID_Instituicao) VALUES (?, ?)`,
      [Nome_Curso, ID_Instituicao ?? null]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}


// Deletar curso pelo ID
export async function deleteCurso(ID_Curso: number): Promise<boolean> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [result] = await conn.execute<ResultSetHeader>(
      `DELETE FROM Curso WHERE ID_Curso = ?`,
      [ID_Curso]
    );

    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}



export async function getAllCursosByDocente(idDocente: number): Promise<any[]> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(`
      SELECT 
        c.ID_Curso,
        c.Nome_Curso,
        i.Nome_Instituicao AS NomeInstituicao
      FROM Curso c
      INNER JOIN Instituicao i ON i.ID_Instituicao = c.ID_Instituicao
      WHERE i.ID_Docente = ?
    `, [idDocente]);
    return rows as any[];
  } finally {
    conn.release();
  }
}
