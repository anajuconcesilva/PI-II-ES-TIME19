// Feito pela aluna Sofia de Sousa

import { promises } from "dns";
import mysql from "mysql2/promise";
import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "./connection";


export interface Aluno {
  id: number;
  ra: string;
  nome: string;
}


// Comecando funcoes 
// Essa funcao obtem todos os estudantes da tabela de alunos do mySql
export async function getAllAluno(): Promise<Aluno[]> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT ID AS id, RA AS ra, Nome AS nome FROM Aluno`
    );
    return rows as unknown as Aluno[];
  } finally {
    conn.release();
  }
}


// Obtendo o Aluno pelo ID
export async function getAlunoById(id: number): Promise<Aluno | null> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT ID AS id, RA AS ra, Nome AS nome
       FROM Aluno
       WHERE ID = ?`, [id]
    );
    const aluno = (rows as unknown as Aluno[])[0];
    return aluno ?? null;
  } finally {
    conn.release();
  }
}

export async function addAluno(ra: string, nome: string): Promise<number> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO Aluno (RA, Nome_Aluno) VALUES (?, ?)`,
      [ra, nome]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}





