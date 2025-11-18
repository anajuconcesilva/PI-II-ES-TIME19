//Autora: Sofia de Souza

import { Request, Response } from "express";
import { pool } from "../database/connection";

export const cadastrarAluno = async (req: Request, res: Response) => {
  try {
    const { RA, Nome_Aluno, ID_Turma } = req.body;

    if (!RA || !Nome_Aluno || !ID_Turma) {
      return res.status(400).json({
        error: "Preencha todos os campos obrigatórios: RA, Nome_Aluno, ID_Turma",
      });
    }

    // Verifica se o RA já existe
    const [found]: any = await pool.query(
      "SELECT RA FROM Aluno WHERE RA = ?",
      [RA]
    );

    if (found.length > 0) {
      return res.status(409).json({
        error: "Este RA já está cadastrado",
      });
    }

    // Inserir aluno
    await pool.query(
      "INSERT INTO Aluno (RA, Nome_Aluno, ID_Turma) VALUES (?, ?, ?)",
      [RA, Nome_Aluno, ID_Turma]
    );

    return res.status(201).json({
      message: "Aluno cadastrado com sucesso!",
      aluno: { RA, Nome_Aluno, ID_Turma },
    });
  } catch (err) {
    console.error("Erro no cadastro:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};


export const excluirAluno = async (req: Request, res: Response) => {
  try {
    const { ra } = req.params;

    if (!ra) {
      return res.status(400).json({
        error: "É necessário informar o RA do aluno para excluir.",
      });
    }

    // Verificar se o aluno existe
    const [found]: any = await pool.query(
      "SELECT RA FROM Aluno WHERE RA = ?",
      [ra]
    );

    if (found.length === 0) {
      return res.status(404).json({
        error: "Aluno não encontrado.",
      });
    }

    // Excluir aluno
    const [resultado]: any = await pool.query(
      "DELETE FROM Aluno WHERE RA = ?",
      [ra]
    );

    return res.status(200).json({
      message: "Aluno excluído com sucesso!"
    });

  } catch (err) {
    console.error("Erro ao excluir aluno:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};