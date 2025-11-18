// Feito pela aluna Eduarda Prado Deiró

import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import pool from "./connection";

export interface Instituicao {
  id: number;
  nome: string;
  sigla?: string;
  idDocente?: number;
}

// Inserir uma nova instituição
export async function addInstituicao(
  nome: string,
  sigla?: string,
  idDocente?: number
): Promise<number> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO Instituicao (Nome_Instituicao, Sigla, ID_Docente) 
       VALUES (?, ?, ?)`,
      [nome, sigla ?? null, idDocente ?? null]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}

// Obter todas as instituições
export async function getAllInstituicoes(): Promise<Instituicao[]> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT 
         ID_Instituicao AS id, 
         Nome_Instituicao AS nome, 
         Sigla AS sigla, 
         ID_Docente AS idDocente
       FROM Instituicao`
    );
    return rows as Instituicao[];
  } finally {
    conn.release();
  }
}

// Obter instituição pelo ID
export async function getInstituicaoById(id: number): Promise<Instituicao | null> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT 
         ID_Instituicao AS id, 
         Nome_Instituicao AS nome, 
         Sigla AS sigla, 
         ID_Docente AS idDocente
       FROM Instituicao
       WHERE ID_Instituicao = ?`,
      [id]
    );
    return (rows as Instituicao[])[0] ?? null;
  } finally {
    conn.release();
  }
}


export async function deleteInstituicao(
  id: number
): Promise<{ success: boolean; message: string }> {
  const conn: PoolConnection = await pool.getConnection();

  try {
    // 1 — Verificar se existem cursos vinculados à instituição
    const [cursos] = await conn.query<RowDataPacket[]>(
      `SELECT ID_Curso FROM Curso WHERE ID_Instituicao = ?`,
      [id]
    );

    if (cursos.length > 0) {
      return {
        success: false,
        message: "Não é possível excluir: existem cursos vinculados à instituição."
      };
    }

    // 2 — Tentar excluir a instituição
    const [result] = await conn.execute<ResultSetHeader>(
      `DELETE FROM Instituicao WHERE ID_Instituicao = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Instituição não encontrada."
      };
    }

    return {
      success: true,
      message: "Instituição excluída com sucesso."
    };

  } finally {
    conn.release();
  }
}


// Obter todas as instituições de um docente específico
export async function getAllInstituicoesByDocente(idDocente: number): Promise<Instituicao[]> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(`
      SELECT 
         ID_Instituicao AS id, 
         Nome_Instituicao AS nome, 
         Sigla AS sigla, 
         ID_Docente AS idDocente
      FROM Instituicao
      WHERE ID_Docente = ?
    `, [idDocente]);
    return rows as Instituicao[];
  } finally {
    conn.release();
  }
}
