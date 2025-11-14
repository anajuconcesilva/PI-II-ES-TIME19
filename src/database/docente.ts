// Feito pela aluna Sofia de Sousa

import { promises } from "dns";
import mysql from "mysql2/promise";
import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "./connection";


export interface Docente {
  ID: number;
  Nome: string;
  Email: string;
  Telefone_Celular: number;
  Senha: string;
}


// Comecando funcoes 
// Essa funcao obtem todos os docente da tabela de docente do mySql

export async function getAllDocente(): Promise<Docente[]> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT ID AS ID_Docente, Nome AS Nome_Docente, Email AS Email, Telefone_Celular AS Telefone_Celular, Senha AS Senha FROM Aluno`
    );
    return rows as unknown as Docente[];
  } finally {
    conn.release();
  }
}


// Obtendo o Aluno pelo ID
export async function getDocenteById(ID: number): Promise<Docente | null> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
             `SELECT ID AS ID_Docente, Nome AS Nome_Docente, Email AS Email, Telefone_Celular AS Telefone_Celular,
              Senha AS Senha FROM Aluno
              WHERE ID = ?`, [ID]
    );

    const Docente = (rows as unknown as Docente[])[0];
    return Docente ?? null;
  } finally {
    conn.release();
  }
}

export async function addDocente(ID: number, Nome:string, Email:string, Telefone_Celular:number, Senha:string): Promise<number> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO Docente (ID_Docente, Nome_Docente, Email, Telefone_Celular, Senha) VALUES (?, ?, ?, ?, ?)`,
      [ID, Nome, Email, Telefone_Celular, Senha]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}





