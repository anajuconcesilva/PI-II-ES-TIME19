# 📘 Projeto NotaDez  

Sistema web desenvolvido como parte do **Projeto Integrador 2 (PI2)** do curso de Engenharia de Software da **PUC-Campinas (2025)**.  

O **NotaDez** tem como objetivo auxiliar professores do ensino superior no **gerenciamento de notas** de alunos, oferecendo recursos para cadastro de instituições, disciplinas, turmas, importação/exportação de alunos, lançamento de notas e cálculo automático de médias.  

---

## 🚀 Funcionalidades principais  

- 🔐 **Autenticação de usuário** (login/cadastro com recuperação de senha)  
- 🏫 **Gerenciamento de instituições, cursos, disciplinas e turmas**  
- 👩‍🎓 **Cadastro ou importação de alunos via CSV/JSON**  
- 📝 **Registro de componentes de nota** (provas, atividades, trabalhos)  
- 📊 **Quadro de notas por turma** (com edição e painel de auditoria)  
- ➗ **Cálculo automático da nota final** baseado em fórmula definida pelo docente  
- 🎯 **Coluna de notas ajustadas** (com arredondamento e ajustes manuais)  
- 📤 **Exportação de notas em CSV**  

---

## 🛠️ Tecnologias utilizadas  

- **Backend:** Node.js (TypeScript)  
- **Frontend:** HTML5, CSS3 
- **Banco de Dados:** MySQL 
- **IDE:** Visual Studio Code
- **Versionamento:** Git + GitHub  

---

---

## 👨‍🎓 Equipe de Desenvolvimento  

- Ana Júlia Conceição da Silva – RA 25002592
- Eduarda Prado Deiró – RA 25004440
- Marília Sara Pereira dos Santos – RA 25014905  
- Sofia de Sousa – RA 25005435

---

## 👩‍🏫 Professores Orientadores  

- Prof. Me. Mateus Dias – mateus.dias@puc-campinas.edu.br  
- Profa. Dra. Renata Arantes – renata.arantes@puc-campinas.edu.br  
- Prof. Dr. Luã Muriana – lua.marcelo@puc-campinas.edu.br  

---
## Observações sobre o funcionamento do projeto
Ao acessar o projeto o docente responsavel por avaliar terá que executar, na sua maquina, o seguinte script do banco de dados para o funcionamento do sistema:
--workbanch
CREATE DATABASE IF NOT EXISTS projetonotadez;
use projetonotadez;

CREATE TABLE Docente (
    ID_Docente INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Docente VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Telefone_Celular VARCHAR(20),
    Senha VARCHAR(100) NOT NULL
);

CREATE TABLE Instituicao (
    ID_Instituicao INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Instituicao VARCHAR(100) NOT NULL,
    Sigla VARCHAR(20),
    ID_Docente INT,
    FOREIGN KEY (ID_Docente) REFERENCES Docente(ID_Docente)
);

CREATE TABLE Curso (
    ID_Curso INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Curso VARCHAR(100) NOT NULL,
    ID_Instituicao INT,
    FOREIGN KEY (ID_Instituicao) REFERENCES Instituicao(ID_Instituicao)
);

CREATE TABLE Disciplina (
    ID_Disciplina INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Disciplina VARCHAR(100) NOT NULL,
    Sigla_Disciplina VARCHAR(20),
    Codigo_Disciplina VARCHAR(20),
    Periodo_Curso INT,
    ID_Curso INT,
    FOREIGN KEY (ID_Curso) REFERENCES Curso(ID_Curso)
);

CREATE TABLE Componente_e_Nota (
    ID_Componente_Nota INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Componente VARCHAR(100) NOT NULL,
    Sigla_Componente VARCHAR(20),
    ID_Disciplina INT,
    FOREIGN KEY (ID_Disciplina) REFERENCES Disciplina(ID_Disciplina)
);

CREATE TABLE Formula_Nota_Final (
    ID_Formula_Nota_Final INT PRIMARY KEY AUTO_INCREMENT,
    Expressao_Numerica VARCHAR(255),
    Validade DATE,
    Coluna_Ajustada VARCHAR(100),
    ID_Componente_Nota INT,
    FOREIGN KEY (ID_Componente_Nota) REFERENCES Componente_e_Nota(ID_Componente_Nota)
);

CREATE TABLE Turma (
    ID_Turma INT PRIMARY KEY AUTO_INCREMENT,
    Horario_Aula VARCHAR(50),
    Numero_Turma INT,
    Data_Inicio DATE,
    Data_Fim DATE,
    Local_Aula VARCHAR(100),
    ID_Disciplina INT,
    FOREIGN KEY (ID_Disciplina) REFERENCES Disciplina(ID_Disciplina)
);

CCREATE TABLE Docente (
    ID_Docente INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Docente VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Telefone_Celular VARCHAR(20),
    Senha VARCHAR(100) NOT NULL
);

CREATE TABLE Instituicao (
    ID_Instituicao INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Instituicao VARCHAR(100) NOT NULL,
    Sigla VARCHAR(20),
    ID_Docente INT,
    FOREIGN KEY (ID_Docente) REFERENCES Docente(ID_Docente)
);

CREATE TABLE Curso (
    ID_Curso INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Curso VARCHAR(100) NOT NULL,
    ID_Instituicao INT,
    FOREIGN KEY (ID_Instituicao) REFERENCES Instituicao(ID_Instituicao)
);

CREATE TABLE Disciplina (
    ID_Disciplina INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Disciplina VARCHAR(100) NOT NULL,
    Sigla_Disciplina VARCHAR(20),
    Codigo_Disciplina VARCHAR(20),
    Periodo_Curso INT,
    ID_Curso INT,
    FOREIGN KEY (ID_Curso) REFERENCES Curso(ID_Curso)
);

CREATE TABLE Componente_e_Nota (
    ID_Componente_Nota INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Componente VARCHAR(100) NOT NULL,
    Sigla_Componente VARCHAR(20),
    ID_Disciplina INT,
    FOREIGN KEY (ID_Disciplina) REFERENCES Disciplina(ID_Disciplina)
);

CREATE TABLE Formula_Nota_Final (
    ID_Formula_Nota_Final INT PRIMARY KEY AUTO_INCREMENT,
    Expressao_Numerica VARCHAR(255),
    Validade DATE,
    Coluna_Ajustada VARCHAR(100),
    ID_Componente_Nota INT,
    FOREIGN KEY (ID_Componente_Nota) REFERENCES Componente_e_Nota(ID_Componente_Nota)
);

CREATE TABLE Turma (
    ID_Turma INT PRIMARY KEY AUTO_INCREMENT,
    Horario_Aula VARCHAR(50),
    Numero_Turma INT,
    Data_Inicio DATE,
    Data_Fim DATE,
    Local_Aula VARCHAR(100),
    ID_Disciplina INT,
    FOREIGN KEY (ID_Disciplina) REFERENCES Disciplina(ID_Disciplina)
);

CREATE TABLE Aluno (
    RA INT PRIMARY KEY,
    Nome_Aluno VARCHAR(100) NOT NULL,
    Matriculado_Dia DATE,
    Data_Nascimento DATE,
    ID_Turma INT,
    FOREIGN KEY (ID_Turma) REFERENCES Turma(ID_Turma)
);

CREATE TABLE Nota_Final (
    ID_Nota_Final INT PRIMARY KEY AUTO_INCREMENT,
    RA INT,
    ID_Turma INT,
    FOREIGN KEY (RA) REFERENCES Aluno(RA),
    FOREIGN KEY (ID_Turma) REFERENCES Turma(ID_Turma)
);

CREATE TABLE Lancamento_Nota (
    ID_Componente_Nota INT PRIMARY KEY,
    Nota DECIMAL(5,2),
    ID_Turma INT,
    RA INT,
    ID_Docente INT,
    FOREIGN KEY (ID_Componente_Nota) REFERENCES Componente_e_Nota(ID_Componente_Nota),
    FOREIGN KEY (ID_Turma) REFERENCES Turma(ID_Turma),
    FOREIGN KEY (RA) REFERENCES Aluno(RA),
    FOREIGN KEY (ID_Docente) REFERENCES Docente(ID_Docente)
);

CREATE TABLE Administra_Turma (
    ID_Administra INT PRIMARY KEY AUTO_INCREMENT,
    ID_Docente INT,
    ID_Turma INT,
    FOREIGN KEY (ID_Docente) REFERENCES Docente(ID_Docente),
    FOREIGN KEY (ID_Turma) REFERENCES Turma(ID_Turma)
);

CREATE TABLE Recuperacao_Senha (
    ID_Recuperacao_Senha INT PRIMARY KEY AUTO_INCREMENT,
    Token_Criado VARCHAR(255) NOT NULL,
    Validade DATETIME,
    Usado BOOLEAN DEFAULT FALSE
);

CREATE TABLE Docente_Tem (
    ID_Empregado INT PRIMARY KEY AUTO_INCREMENT,
    ID_Docente INT,
    ID_Instituicao INT,
    FOREIGN KEY (ID_Docente) REFERENCES Docente(ID_Docente),
    FOREIGN KEY (ID_Instituicao) REFERENCES Instituicao(ID_Instituicao)
);

---
