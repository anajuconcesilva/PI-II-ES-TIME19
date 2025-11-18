// csvImport.ts

import { parse } from "csv-parse";
import fs from "fs";
import pool from "./connection";
import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";

// Verificar se aluno já existe
export async function alunoExiste(id: number): Promise<boolean> {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query<RowDataPacket[]>(
            "SELECT ID_Aluno FROM Aluno WHERE ID_Aluno = ?",
            [id]
        );
        return rows.length > 0;
    } finally {
        conn.release();
    }
}

export async function inserirAluno(id: number, nome: string, idTurma: number) {
    const conn = await pool.getConnection();
    try {
        await conn.execute<ResultSetHeader>(
            `INSERT INTO Aluno (ID_Aluno, Nome, ID_Turma)
       VALUES (?, ?, ?)`,
            [id, nome, idTurma]
        );
    } finally {
        conn.release();
    }
}

// Função principal: Importar CSV
export async function importarCSV(
    filePath: string,
    idTurma: number
): Promise<{ inseridos: number; ignorados: number; erros: string[] }> {

    const erros: string[] = [];
    let inseridos = 0;
    let ignorados = 0;

    const arquivo = fs.createReadStream(filePath);

    return new Promise((resolve, reject) => {
        const parser = parse({
            delimiter: ",",
            trim: true,
            skip_empty_lines: true
        });

        parser.on("readable", async () => {
            let registro;
            while ((registro = parser.read())) {
                const [idStr, nome] = registro;

                // Ignora registros inválidos
                if (!idStr || !nome) {
                    erros.push(`Linha inválida: ${registro.join(",")}`);
                    continue;
                }

                const id = Number(idStr);

                if (isNaN(id)) {
                    erros.push(`ID inválido: ${idStr}`);
                    continue;
                }

                // Verifica se aluno existe
                const existe = await alunoExiste(id);
                if (existe) {
                    ignorados++;
                    continue;
                }

                // Insere aluno
                await inserirAluno(id, nome, idTurma);
                inseridos++;
            }
        });

        parser.on("end", () => {
            fs.unlinkSync(filePath); // apagar arquivo após uso
            resolve({ inseridos, ignorados, erros });
        });

        parser.on("error", (err) => {
            reject(err);
        });

        arquivo.pipe(parser);
    });
}
