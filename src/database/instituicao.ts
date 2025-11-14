import mysql from "mysql2/promise";
import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import pool from "./connection";

export interface Instituicao {
  id: number;
  nome: string;
  endereco: string;
}

// Inserir uma nova instituição
export async function addInstituicao(nomeInstituicao: string, endereco: string): Promise<number> {
  const conn: PoolConnection = await pool.getConnection();

  try {
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO Instituicao (Nome, Endereco) VALUES (?, ?)`,
      [nomeInstituicao, endereco]
    );

    return result.insertId; // retorna o ID da instituição cadastrada
  } finally {
    conn.release();
  }
}

export async function getAllInstituicoes(): Promise<Instituicao[]> {
  const conn: PoolConnection = await pool.getConnection();

  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT Id AS id, Nome AS nome, Endereco AS endereco
       FROM Instituicao`
    );

    return rows as Instituicao[];
  } finally {
    conn.release();
  }
}