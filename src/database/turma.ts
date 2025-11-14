// Feito pela aluna Sofia de Sousa

import { promises } from "dns";
import mysql from "mysql2/promise";
import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "./connection";


export interface Turma {
  ID: number;
  HoraAula: string;
  NumeroTurma: number;
  DataInicio: number;
  DataFim: number;
  LocalAula: string;
}


// Comecando funcoes 
// Essa funcao obtem todas as turmas da tabela de turma do mySql

export async function getAllTurmas(): Promise<Turma[]> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT ID AS ID, HoraAula AS Horario_Aula, NumeroTurma AS Numero_Turma, DataInicio AS Data_Inicio, 
       DataFim AS Data_Fim , LocalAula AS Local_Aula FROM Aluno`
    );
    return rows as unknown as Turma[];
  } finally {
    conn.release();
  }
}



// Obtendo a turma pelo seu ID
export async function getTurmaById(ID: number): Promise<Turma | null> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
             `SELECT ID AS ID, HoraAula AS Horario_Aula, NumeroTurma AS Numero_Turma, DataInicio AS Data_Inicio, 
              DataFim AS Data_Fim , LocalAula AS Local_Aula FROM Aluno FROM Aluno
              WHERE ID = ?`, [ID]
    );

    const Turma = (rows as unknown as Turma [])[0];
    return Turma ?? null;
  } finally {
    conn.release();
  }
}

export async function addTurma (ID:number, HoraAula:string, NumeroTurma:number, DataInicio:number, DataFim: number, LocalAula:string): Promise<number> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO Turma (ID, Horario_Aula, Numero_Turma, Data_Inicio, Data_Fim, Local_Aula) VALUES (?, ?, ?, ?, ?, ?)`,
      [ID, HoraAula, NumeroTurma,DataInicio, DataFim, LocalAula]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}





