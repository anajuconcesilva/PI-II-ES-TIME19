//Feito pela aluna Eduarda Prado Deiró

import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "./connection";

export interface Turma {
  id: number;
  horarioAula: string;
  numeroTurma: number;
  dataInicio: string;
  dataFim: string;
  localAula: string;
  idDisciplina?: number;
  nomeDisciplina?: string;
  codigo?: string;
}

// Adicionar turma e vincular ao docente
export async function addTurmaComDocente(
  horarioAula: string,
  numeroTurma: number,
  dataInicio: string,
  dataFim: string,
  localAula: string,
  idDisciplina: number | undefined,
  idDocente: number
): Promise<number> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.execute<ResultSetHeader>(`
      INSERT INTO Turma (Horario_Aula, Numero_Turma, Data_Inicio, Data_Fim, Local_Aula, ID_Disciplina)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [horarioAula, numeroTurma, dataInicio, dataFim, localAula, idDisciplina ?? null]);

    const turmaId = result.insertId;

    // Inserir vínculo com o docente
    await conn.execute(`INSERT INTO Administra_Turma (ID_Docente, ID_Turma) VALUES (?, ?)`, [idDocente, turmaId]);

    await conn.commit();
    return turmaId;
  } catch (erro) {
    await conn.rollback();
    throw erro;
  } finally {
    conn.release();
  }
}

// Obter turmas do docente com nome da disciplina
export async function getAllTurmasByDocente(docenteId: number): Promise<Turma[]> {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT 
      t.ID_Turma AS id,
      t.Horario_Aula AS horarioAula,
      t.Numero_Turma AS numeroTurma,
      t.Data_Inicio AS dataInicio,
      t.Data_Fim AS dataFim,
      t.Local_Aula AS localAula,
      t.ID_Disciplina AS idDisciplina,
      d.Nome_Disciplina AS nomeDisciplina,
      d.Codigo_Disciplina AS codigo
    FROM Administra_Turma at
    INNER JOIN Turma t ON t.ID_Turma = at.ID_Turma
    LEFT JOIN Disciplina d ON t.ID_Disciplina = d.ID_Disciplina
    WHERE at.ID_Docente = ?
  `, [docenteId]);

  return rows as Turma[];
}


// Deletar turma e vínculos
export async function deleteTurma(id: number): Promise<{ success: boolean; message: string }> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(`DELETE FROM Administra_Turma WHERE ID_Turma = ?`, [id]);
    const [result] = await conn.query<ResultSetHeader>(`DELETE FROM Turma WHERE ID_Turma = ?`, [id]);

    await conn.commit();

    if (result.affectedRows === 0) return { success: false, message: "Turma não encontrada" };
    return { success: true, message: "Turma excluída com sucesso!" };
  } catch (erro) {
    await conn.rollback();
    return { success: false, message: "Erro ao excluir turma." };
  } finally {
    conn.release();
  }
}
