// Autora: Ana Júlia Conceição da Silva



import { Request, Response } from "express";                 // Importa tipos do Express
import { PoolConnection, RowDataPacket } from "mysql2/promise"; // Tipos para MySQL
import pool from "./connection";
                     // Conexão com o banco

// Função auxiliar para transformar os dados em texto CSV
function gerarCSV(dados: any[], componentes: string[]): string {

    // Se não houver dados, retorna CSV vazio
    if (dados.length === 0) return "";

    // Cabeçalho fixo exigido pelo PI
    const headerFixo = ["Identificador", "Nome"];

    // Cabeçalho dinâmico → lista de siglas dos componentes (P1, P2, APS...)
    const headerDinamico = componentes.map(sigla => `Nota ${sigla}`);

    // Última coluna obrigatória
    const headerFinal = "Nota Final Calculada";

    // Junta todos os cabeçalhos em uma única linha CSV
    const header = [...headerFixo, ...headerDinamico, headerFinal]
        .map(h => `"${h}"`) // envelopa cada coluna com aspas
        .join(",");

    // Mapeia cada linha de dados para texto CSV
    const linhas = dados.map(linha => {
        const valores = [
            linha.Identificador,
            linha.Nome,
            ...componentes.map(sigla => linha[sigla] ?? ""), // Notas por sigla
            linha.NotaFinal                                 // Nota final SQL
        ];

        // Sanitiza valores e converte para CSV
        return valores
            .map(v => `"${String(v).replace(/"/g, '""')}"`)
            .join(",");
    });

    // Retorna tudo montado em formato CSV
    return [header, ...linhas].join("\n");
}

// Função principal: exportarNotas
export async function exportarNotas(req: Request, res: Response) {

    // Abre conexão com o banco
    const conn: PoolConnection = await pool.getConnection();

    try {
        // Obtém ID_Turma do corpo da requisição
        const { ID_Turma } = req.body;

        // Validação básica
        if (!ID_Turma) {
            return res.status(400).json({
                erro: "É necessário informar o ID_Turma para exportar."
            });
        }

        // 1. Verificar se TODAS as notas foram lançadas

        // Conta quantos lançamentos DEVERIAM existir (aluno × componente)
        const [rowsEsperado] = await conn.query<RowDataPacket[]>(`
            SELECT COUNT(A.id_aluno) * COUNT(CN.id_componente) AS totalEsperado
            FROM aluno A
            JOIN turma T ON A.id_turma = T.id_turma
            JOIN disciplina D ON T.id_disciplina = D.id_disciplina
            JOIN componente_e_nota CN ON CN.id_disciplina = D.id_disciplina
            WHERE T.id_turma = ?
        `, [ID_Turma]);

        const totalEsperado = rowsEsperado[0].totalEsperado ?? 0;

        // Conta quantas notas realmente existem preenchidas
        const [rowsReal] = await conn.query<RowDataPacket[]>(`
            SELECT COUNT(N.id_nota) AS totalReal
            FROM nota N
            JOIN aluno A ON A.id_aluno = N.id_aluno
            WHERE A.id_turma = ? AND N.valor IS NOT NULL
        `, [ID_Turma]);

        const totalReal = rowsReal[0].totalReal ?? 0;

        // Se faltar notas → bloqueia exportação
        if (totalEsperado === 0 || totalReal !== totalEsperado) {
            return res.status(409).json({
                erro: "Exportação bloqueada: existem notas pendentes de lançamento."
            });
        }

        // 2. Buscar nome da turma + sigla da disciplina (para nome do arquivo)

        const [meta] = await conn.query<RowDataPacket[]>(`
            SELECT T.nome AS NomeTurma, D.sigla AS SiglaDisciplina
            FROM turma T
            JOIN disciplina D ON T.id_disciplina = D.id_disciplina
            WHERE T.id_turma = ?
        `, [ID_Turma]);

        if (meta.length === 0) {
            return res.status(404).json({ erro: "Turma não encontrada." });
        }

        const { NomeTurma, SiglaDisciplina } = meta[0];

        // 3. Buscar componentes, alunos e notas dinamicamente

        // Componentes de nota (siglas)
        const [rowsComponentes] = await conn.query<RowDataPacket[]>(`
            SELECT CN.sigla
            FROM componente_e_nota CN
            JOIN disciplina D ON D.id_disciplina = CN.id_disciplina
            JOIN turma T ON T.id_disciplina = D.id_disciplina
            WHERE T.id_turma = ?
            ORDER BY CN.id_componente
        `, [ID_Turma]);

        const siglas = rowsComponentes.map(r => r.sigla);

        // Alunos da turma
        const [rowsAlunos] = await conn.query<RowDataPacket[]>(`
            SELECT id_aluno, identificador, nome
            FROM aluno
            WHERE id_turma = ?
            ORDER BY nome
        `, [ID_Turma]);

        // Notas dos alunos
        const [rowsNotas] = await conn.query<RowDataPacket[]>(`
            SELECT N.id_aluno, N.valor, CN.sigla
            FROM nota N
            JOIN componente_e_nota CN ON CN.id_componente = N.id_componente
            JOIN aluno A ON A.id_aluno = N.id_aluno
            WHERE A.id_turma = ?
        `, [ID_Turma]);

        // Mapa de notas: { aluno: { P1: 9, P2: 7 } }
        const mapaNotas: Record<number, Record<string, number>> = {};

        rowsNotas.forEach(n => {
            if (!mapaNotas[n.id_aluno]) mapaNotas[n.id_aluno] = {};
            mapaNotas[n.id_aluno][n.sigla] = n.valor;
        });

        // Monta dados finais para o CSV
        const dados = [];

        for (const aluno of rowsAlunos) {

            // Objeto inicial
            const info: any = {
                Identificador: aluno.identificador,
                Nome: aluno.nome,
            };

            // Adiciona notas dinamicamente
            siglas.forEach(sigla => {
                info[sigla] = mapaNotas[aluno.id_aluno]?.[sigla] ?? "";
            });

            // Calcula média usando a FUNCTION do banco (obrigatório no escopo)
            const [mediaRow] = await conn.query<RowDataPacket[]>(`
                SELECT calcular_media_simples(?) AS media
            `, [aluno.id_aluno]);

            info.NotaFinal = mediaRow[0].media ?? "";

            dados.push(info);
        }

        // 4. Gerar o CSV final
        const conteudoCSV = gerarCSV(dados, siglas);

        // 5. Criar nome do arquivo no padrão do escopo

        const agora = new Date();
        const data = agora.toISOString().substring(0, 10); // YYYY-MM-DD
        const hora = agora.toLocaleTimeString("pt-BR", { hour12: false })
            .replace(/:/g, "") +
            agora.getMilliseconds().toString().padStart(3, "0");

        const nomeArquivo = `${data}_${hora}-${NomeTurma}_${SiglaDisciplina}.csv`;

        // 6. Enviar para download
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="${nomeArquivo}"`);
        return res.status(200).send(conteudoCSV);

    } catch (erro) {

        console.error("Erro ao exportar:", erro);
        return res.status(500).json({
            erro: "Erro interno ao gerar CSV."
        });

    } finally {
        conn.release(); // libera conexão SEMPRE
    }
}
