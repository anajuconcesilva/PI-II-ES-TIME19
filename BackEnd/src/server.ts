// server.ts
// Feito pela aluna Sofia de Sousa E Eduarda Prado Deiró

import express, { Request, Response } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { pool } from "./database/connection";
//import AuthRoutes from "./routes/AuthRoutes";

// ALUNOS
import { excluirAluno} from "./database/alunos";
import { cadastrarAluno } from "./database/alunos";

// DOCENTES
import {
  getAllDocente,
  getDocenteById,
  adddDocente,

} from "./database/docente";

import { getDocenteByEmail } from "./database/login";

// INSTITUIÇÕES
import {
  getAllInstituicoes,
  getInstituicaoById,
  addInstituicao,
  deleteInstituicao,
  getAllInstituicoesByDocente
} from "./database/instituicao";

// CURSOS
import {
  getAllCursos,
  getCursoById,
  addCurso,
  deleteCurso,
  getAllCursosByDocente
} from "./database/curso";

// TURMAS
import {

  getAllTurmasByDocente,
  deleteTurma,
  addTurmaComDocente
} from "./database/turma";

// DISCIPLINAS
import {
  addDisciplina,
  deleteDisciplina,
  getAllDisciplinasByDocente
} from "./database/disciplina";
import { exportarNotas } from "./database/exportacao";

import { atualizarNota, registrarNota } from "./database/notas";
import multer from "multer";
import { importarCSV } from "./database/csvImport";

const upload = multer({ dest: "uploads/" });


const app = express();
app.use(cors());
app.use(express.json());

/* ---------------------------  IMPORTAÇÃO CSV DE ALUNOS --------------------------- */
app.get("/teste", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS agora");
    res.json({ mensagem: "Conexão funcionando ✅", data: (rows as any)[0].agora });
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

/* --------------------------- ROTA TESTE --------------------------- */

app.post("/importar-csv/:idTurma", upload.single("arquivo"), async (req, res) => {
  const idTurma = Number(req.params.idTurma);

  if (!req.file)
    return res.status(400).json({ erro: "Envie um arquivo CSV" });

  try {
    const resultado = await importarCSV(req.file.path, idTurma);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ erro: (error as Error).message });
  }
});

/* --------------------------- ROTA LOGIN --------------------------- */
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios" });
  }

  try {
    const docente = await getDocenteByEmail(email);

    if (!docente) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // Comparar senha digitada com hash
    const senhaCorreta = await bcrypt.compare(senha, docente.Senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    res.json({
      mensagem: "Login bem-sucedido",
      docente: {
        id: docente.ID,
        nome: docente.Nome,
        email: docente.Email
      }
    });

  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

/* --------------------------- ALUNOS --------------------------- */

/// CADASTRAR ALUNO
app.post("/alunos/cadastrar", async (req, res) => {
  try {
    const { RA, Nome_Aluno, ID_Turma } = req.body;

    if (!RA || !Nome_Aluno || !ID_Turma) {
      return res.status(400).json({
        error: "Preencha RA, Nome_Aluno e ID_Turma",
      });
    }

    const [existe]: any = await pool.query(
      "SELECT RA FROM Aluno WHERE RA = ?",
      [RA]
    );

    if (existe.length > 0) {
      return res.status(409).json({
        error: "Este RA já está cadastrado.",
      });
    }

    await pool.query(
      "INSERT INTO Aluno (RA, Nome_Aluno, ID_Turma) VALUES (?, ?, ?)",
      [RA, Nome_Aluno, ID_Turma]
    );

    res.status(201).json({
      message: "Aluno cadastrado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// LISTAR ALUNOS
app.get("/alunos", async (req, res) => {
  try {
    const [alunos]: any = await pool.query("SELECT * FROM Aluno");
    res.json(alunos);
  } catch (error) {
    console.error("Erro ao listar alunos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// EXCLUIR ALUNO
app.delete("/alunos/:ra", async (req, res) => {
  const { ra } = req.params;

  try {
    const [resultado]: any = await pool.query(
      "DELETE FROM Aluno WHERE RA = ?",
      [ra]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    res.json({ message: "Aluno excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir aluno:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/* --------------------------- DOCENTES --------------------------- */
app.get("/docentes", async (req, res) => {
  try {
    const docentes = await getAllDocente();
    res.json(docentes);
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

app.get("/docentes/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const docente = await getDocenteById(id);
    if (!docente) return res.status(404).json({ erro: "Docente não encontrado" });
    res.json(docente);
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});


app.post("/docentes", async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  if (!nome || !email || !telefone || !senha) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }

  try {
    // Criptografar senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await pool.query(
      `INSERT INTO DOCENTE (Nome_Docente, Email, Telefone_Celular, Senha)
       VALUES (?, ?, ?, ?)`,
      [nome, email, telefone, senhaCriptografada]
    );

    res.json({ mensagem: "Cadastro realizado com sucesso!" });

  } catch (error) {
    res.status(500).json({ erro: (error as Error).message });
  }
});


/* --------------------------- INSTITUIÇÕES --------------------------- */
app.get("/instituicoes", async (req, res) => {
  const docenteId = Number(req.query.docente_id); // vamos passar pelo query string
  if (!docenteId) return res.status(400).json({ erro: "docente_id é obrigatório" });

  try {
    const instituicoes = await getAllInstituicoesByDocente(docenteId);
    res.json(instituicoes);
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

app.get("/instituicoes/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const inst = await getInstituicaoById(id);
    if (!inst) return res.status(404).json({ erro: "Instituição não encontrada" });
    res.json(inst);
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

app.post("/instituicoes", async (req, res) => {
  const { nome, sigla, idDocente } = req.body;

  if (!nome)
    return res.status(400).json({ erro: "Nome da instituição é obrigatório" });

  try {
    const novoId = await addInstituicao(nome, sigla, idDocente);
    res.status(201).json({ id: novoId, nome, sigla, idDocente });
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

app.delete("/instituicoes/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const resultado = await deleteInstituicao(id);

    if (!resultado.success)
      return res.status(400).json({ erro: resultado.message });

    res.json({ mensagem: resultado.message });
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

/* --------------------------- CURSOS --------------------------- */
app.get("/cursos", async (req, res) => {
  const docenteId = Number(req.query.docente_id); // vamos passar pelo query string
  if (!docenteId) return res.status(400).json({ erro: "docente_id é obrigatório" });

  try {
    const cursos = await getAllCursosByDocente(docenteId);
    res.json(cursos);
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});


app.get("/cursos/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const curso = await getCursoById(id);
    if (!curso) return res.status(404).json({ erro: "Curso não encontrado" });
    res.json(curso);
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

app.post("/cursos", async (req, res) => {
  const { nomeCurso, idInstituicao } = req.body;

  if (!nomeCurso)
    return res.status(400).json({ erro: "Nome do curso é obrigatório" });

  try {
    const novoId = await addCurso(nomeCurso, idInstituicao);
    res.status(201).json({ id: novoId, nomeCurso, idInstituicao });
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

app.delete("/cursos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const apagado = await deleteCurso(Number(id));

    if (!apagado) {
      return res.status(404).json({ erro: "Curso não encontrado" });
    }

    res.json({ mensagem: "Curso excluído com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

/* --------------------------- TURMAS --------------------------- */


// Criar turma
app.post("/turmas", async (req, res) => {
  const { horarioAula, numeroTurma, dataInicio, dataFim, localAula, idDisciplina, docenteId } = req.body;

  if (!horarioAula || !numeroTurma || !dataInicio || !dataFim || !localAula || !docenteId) {
    return res.status(400).json({ erro: "Todos os campos obrigatórios" });
  }

  try {
    const novoId = await addTurmaComDocente(
      horarioAula,
      numeroTurma,
      dataInicio,
      dataFim,
      localAula,
      idDisciplina,
      Number(docenteId)
    );

    res.status(201).json({
      id: novoId,
      horarioAula,
      numeroTurma,
      dataInicio,
      dataFim,
      localAula,
      idDisciplina
    });
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

// Listar turmas do docente
app.get("/turmas", async (req, res) => {
  const docenteId = Number(req.query.docente_id);
  if (!docenteId) return res.status(400).json({ erro: "docente_id é obrigatório" });

  try {
    console.log("Buscando turmas do docente:", docenteId);
    const turmas = await getAllTurmasByDocente(docenteId);
    console.log("Turmas encontradas:", turmas);
    res.json(turmas);
  } catch (erro) {
    console.error("ERRO ao buscar turmas:", erro);
    res.status(500).json({ erro: (erro as Error).message });
  }
});


// Excluir turma
app.delete("/turmas/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ erro: "ID da turma é obrigatório" });

  try {
    const resultado = await deleteTurma(id);
    if (!resultado.success) return res.status(404).json({ erro: resultado.message });
    res.json({ mensagem: resultado.message });
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});




/* --------------------------- DISCIPLINAS --------------------------- */
app.post("/disciplinas", async (req, res) => {
  const { nomeDisciplina, codigo, periodo, idCurso } = req.body;

  if (!nomeDisciplina || !idCurso) {
    return res.status(400).json({ erro: "Nome e curso da disciplina são obrigatórios" });
  }

  try {
    const novoId = await addDisciplina(nomeDisciplina, codigo, periodo, idCurso);
    res.status(201).json({ id: novoId, nomeDisciplina, codigo, periodo, idCurso });
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

app.get("/disciplinas", async (req, res) => {
  const docenteId = Number(req.query.docente_id);
  if (!docenteId) return res.status(400).json({ erro: "docente_id é obrigatório" });

  try {
    const disciplinas = await getAllDisciplinasByDocente(docenteId);
    res.json(disciplinas);
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

app.delete("/disciplinas/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ erro: "ID da disciplina é obrigatório" });

  try {
    const resultado = await deleteDisciplina(id);
    if (!resultado.success) return res.status(404).json({ erro: resultado.message });
    res.json({ message: resultado.message });
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});



/* --------------------------- EXPORTAÇÃO DE NOTAS --------------------------- */
app.post("/exportar-notas", async (req, res) => {
  try {
    await exportarNotas(req, res);
  } catch (erro) {
    console.error("Erro na rota de exportação:", erro);
    res.status(500).json({ erro: "Erro interno ao exportar notas." });
  }
});

/* --------------------------- COMPONENTES DE NOTA --------------------------- */

//revisar depois

app.post("/notas", async (req, res) => {
  const { idAluno, idComponente, nota } = req.body;

  const resultado = await registrarNota(idAluno, idComponente, nota);

  if (!resultado.success)
    return res.status(400).json({ erro: resultado.message });

  res.json({ mensagem: resultado.message });
});

// 📌 Atualizar nota existente
app.put("/notas/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nota } = req.body;

  const resultado = await atualizarNota(id, nota);

  if (!resultado.success)
    return res.status(400).json({ erro: resultado.message });

  res.json({ mensagem: resultado.message });
});

/* --------------------------- REDEFINIR SENHA --------------------------- */



/* --------------------------- INICIAR SERVIDOR --------------------------- */
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
