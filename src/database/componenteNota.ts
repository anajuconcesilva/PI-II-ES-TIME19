// Feito pela aluna Sofia de Sousa

import mysql from "mysql2/promise";
import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "./connection";

export interface ComponenteNota {
  id: number;
  ra: string;
  sigla: string;
  nome: string;
  idDisciplina?: number;
}

// 
// funcao de buscar  todos os componentes
export async function getAllComponentes(): Promise<ComponenteNota[]> {
  const conn: PoolConnection = await pool.getConnection();

  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT 
        ID AS id,
        RA AS ra,
        Sigla AS sigla,
        Nome AS nome,
        ID_Disciplina AS idDisciplina
      FROM ComponenteNota`
    );

    return rows as unknown as ComponenteNota[];
  } finally {
    conn.release();
  }
}


// funcao de buscar componente por id

export async function getComponenteById(id: number): Promise<ComponenteNota | null> {
  const conn: PoolConnection = await pool.getConnection();

  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT 
        ID AS id,
        RA AS ra,
        Sigla AS sigla,
        Nome AS nome,
        ID_Disciplina AS idDisciplina
       FROM ComponenteNota
       WHERE ID = ?`,
      [id]
    );

    const componente = (rows as unknown as ComponenteNota[])[0];
    return componente ?? null;
  } finally {
    conn.release();
  }
}


// funcao de adicionar componente de nota 

export async function addComponenteNota(
  ra: string,
  nome: string,
  sigla: string,
  idDisciplina: number
): Promise<number> {
  const conn: PoolConnection = await pool.getConnection();

  try {
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO ComponenteNota (RA, Nome, Sigla, ID_Disciplina)
       VALUES (?, ?, ?, ?)`,
      [ra, nome, sigla, idDisciplina]
    );

    return result.insertId;
  } finally {
    conn.release();
  }
}

// BUSCAR COMPONENTES DE UMA DISCIPLINA

export async function getAllComponentesByDisciplina(disciplinaId: number
): Promise<ComponenteNota[]> {

  const conn: PoolConnection = await pool.getConnection();

  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT
        ID AS id,
        RA AS ra,
        Sigla AS sigla,
        Nome AS nome,
        ID_Disciplina AS idDisciplina
       FROM ComponenteNota
       WHERE ID_Disciplina = ?
       ORDER BY ID DESC`,
      [disciplinaId]
    );

    return rows as unknown as ComponenteNota[];
  } finally {
    conn.release();
  }
}

// Função de deletarq componente de nota

export async function deleteComponenteNota(id: number): Promise<void> {
  const conn: PoolConnection = await pool.getConnection();

  try {
    await conn.execute(
      `DELETE FROM ComponenteNota WHERE ID = ?`,
      [id]
    );
  } finally {
    conn.release();
  }
}
