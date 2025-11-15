// server.ts
// Rotas criadas pela aluna Sofia de Sousa

import express, { Request, Response, NextFunction } from "express";
import path from "path";

const app = express();

app.use(express.json());

//cors
import cors from "cors";
app.use(cors());


// Caminho absoluto para a pasta FrontEnd
const frontEndPath = path.join(__dirname, '../FrontEnd');
app.use(express.static(frontEndPath));


// Importa a conexão
import { pool } from './database/connection';

// Rota de teste da conexão
app.get('/teste', async (req: Request, res: Response) => { // Rota de teste da conexão
  try {
    const [rows] = await pool.query('SELECT NOW() AS agora');
    res.json({ mensagem: "Conexão funcionando ✅", data: (rows as any)[0].agora });
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});



//ROTAS PARA HTMLS (GET) Posteriormente, é possível migrar para express.static, mas será necessário ajustar os paths dos arquivos CSS e JS no FrontEnd e a organização das pastas.

app.get('/dashboard', (req: Request, res: Response) => {
    res.sendFile(path.join(frontEndPath, 'HTML', 'dashboard.html'));
});

app.get('/cadastrar-instituicao', (req: Request, res: Response) => {
    res.sendFile(path.join(frontEndPath, 'HTML', 'cadastro-instituicao.html'));
});

//rota principal para obter todos os alunos
app.get('/alunos', (req: Request, res: Response) => {
    res.sendFile(path.join(frontEndPath, 'HTML', 'alunos.html'));
});

app.get('/cadastro', (req: Request, res: Response) => {
    res.sendFile(path.join(frontEndPath, 'HTML', 'cadastro.html'));
});

//ROTAS POST, GET, PUT, DELETE

//rota adicionar aluno
import { addAluno } from './database/alunos';

app.post('/adicionarAlunos', async (req: Request, res: Response) => {
  const { ra, nome } = req.body;
  try {
    const novoId = await addAluno(ra, nome);
    res.status(201).json({ id: novoId, ra, nome });
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

//rota adicionar instituicao
import { addInstituicao } from "./database/instituicao";

app.post("/cadastrar-instituicao", async (req: Request, res: Response) => {
  try {
    const { nomeInstituicao, endereco } = req.body;

    const idCriado = await addInstituicao(nomeInstituicao, endereco);

    res.status(201).json({
      mensagem: "Instituição cadastrada com sucesso!",
      id: idCriado
    });

  } catch (erro) {
    console.error("Erro ao cadastrar instituição:", erro);
    res.status(500).json({ erro: "Erro ao cadastrar instituição" });
  }
});

//rota obter todas as instituicoes
import { getAllInstituicoes } from "./database/instituicao";

app.get("/instituicoes", async (req: Request, res: Response) => {
  try {
    const instituicoes = await getAllInstituicoes();
    res.json(instituicoes);
  } catch (erro) {
    console.error("Erro ao buscar instituições:", erro);
    res.status(500).json({ erro: "Erro interno" });
  }
});


// rotas turma

import { addTurma } from "./database/turma";

app.post("/cadastrar-turma", async (req: Request, res: Response) => {
  try {
    const { ID,HoraAula,NumeroTurma, DataInicio, DataFim, LocalAula } = req.body;

    const idCriado = await addTurma(ID,HoraAula,NumeroTurma, DataInicio, DataFim, LocalAula);

    res.status(201).json({
      mensagem: "Turma cadastrada com sucesso!",
      id: idCriado
    });

  } catch (erro) {
    console.error("Erro ao cadastrar instituição:", erro);
    res.status(500).json({ erro: "Erro ao cadastrar instituição" });
  }
});

// Rota de obter todas as turmas

import { getAllTurmas }  from "./database/turma";

app.get("/turmas", async (req: Request, res: Response) => {
  try {
    const turmas = await getAllTurmas();
    res.json(turmas);
  } catch (erro) {
    console.error("Erro ao buscar instituições:", erro);
    res.status(500).json({ erro: "Erro interno" });
  }
});

// rotas docente

//rota principal para obter todos os docentes

import {getAllDocente} from './database/docente';

app.get('/Docente', (req: Request, res: Response) => {
  res.sendFile(path.join(frontEndPath, 'HTML', 'cadastro.html'));
});

// Rota de adicionar docente

import { addDocente } from './database/docente';

app.post('/adicionarDocente', async (req: Request, res: Response) => {
  const { ID, Nome, Email, Telefone_Celular, Senha } = req.body;
  try {
    const novoId = await addDocente(ID, Nome, Email, Telefone_Celular, Senha);
    res.status(201).json({ id: novoId, ID, Nome,Email, Telefone_Celular, Senha });
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});


// Rotas de curso 

   //Rota principal para obter todos os cursos

 import {getAllCursos} from './database/curso';

  app.get('/Cursos', (req: Request, res: Response) => {
  res.sendFile(path.join(frontEndPath, 'HTML', 'cadastro.html'));
});

   // Rota de adicionar curso

   import { addCurso } from './database/curso';

   app.post ('/adicionarCurso', async (req: Request, res: Response) => {
    const { Instituicao, Nome, Periodo, ID} = req.body;

    try{
      const novoId = await addCurso(Instituicao, Nome,Periodo,ID);
      res.status (201).json ({id: novoId, Instituicao, Nome, Periodo, ID});
    } catch (erro) {
      res.status (500).json ({ erro: (erro as Error).message});
    }
   });

   // Rotas de componente de nota

      //Rota principal para obter todos os componentes

 import {getAllComponentes} from './database/componenteNota';

  app.get('/Componentes', (req: Request, res: Response) => {
  res.sendFile(path.join(frontEndPath, 'HTML', 'cadastro.html'));
});  
       // Adicionar componente de nota 

          import { addComponenteNota} from './database/componenteNota';

   app.post ('/adicionarComponenteNota', async (req: Request, res: Response) => {
    const { id,nome,sigla} = req.body;

    try{
      const novoId = await addComponenteNota(id,nome,sigla);
      res.status (201).json ({id: novoId, nome, sigla});
    } catch (erro) {
      res.status (500).json ({ erro: (erro as Error).message});
    }
   });


    // excluir componente de nota 
    
import { deleteComponenteNota } from './database/componenteNota';

app.delete('/componentenota/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    const deleted = await deleteComponenteNota(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Componente de nota não encontrado.' });
    }

    return res.status(200).json({
      message: 'Componente de nota excluído com sucesso',
      id,
    });

  } catch (error) {
    console.error('Erro ao excluir componente de nota:', error);
    return res.status(500).json({
      error: 'Erro interno ao excluir componente de nota.',
    });
  }
});
   
// Inicia o servidor
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});



