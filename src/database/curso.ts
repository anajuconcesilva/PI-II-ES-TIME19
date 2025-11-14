// Feito pela aluna Sofia de Sousa

import { promises } from "dns";
import mysql from "mysql2/promise";
import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "./connection";


export interface Curso {
  Instituicao: string;
  Nome: string;
  Periodo: string;
  ID: number;
}


// Comecando funcoes 
// Essa funcao obtem todas as turmas da tabela de turma do mySql

export async function getAllCursos(): Promise<Curso[]> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT Instituicao as Instituicao, Nome AS Nome_Curso, Periodo As 
       Periodo_Curso, ID AS Codigo, FROM Curso`
    );
    return rows as unknown as Curso[];
  } finally {
    conn.release();
  }
}



// Obtendo a turma pelo seu ID
export async function getCursoById(ID: number): Promise<Curso | null> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
             `SELECT Instituicao as Instituicao, Nome AS Nome_Curso, Periodo As 
              Periodo_Curso, ID AS Codigo, FROM Curso
              WHERE ID = ?`, [ID]
    );

    const Curso = (rows as unknown as Curso [])[0];
    return Curso ?? null;
  } finally {
    conn.release();
  }
}

export async function addCurso (Instituicao:string, Nome:string, Periodo:string, ID:number): Promise<number> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO Turma (ID, Nome_Curso, Periodo_Curso, Codigo) VALUES (?, ?, ?, ?)`,
      [Instituicao, Nome, Periodo, ID]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}





