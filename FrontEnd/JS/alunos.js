const API = "http://localhost:3000";

const form = document.getElementById('form-aluno');
const tbody = document.getElementById('tbody-alunos');

// Criar linha na tabela
function adicionarAlunoNaTabela(turma, nome, ra) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${turma}</td>
    <td>${nome}</td>
    <td>${ra}</td>
    <td>
      <button class="edit">Editar</button>
      <button class="delete" style="background:red;color:white;">Excluir</button>
    </td>
  `;

  tr.querySelector('.delete').addEventListener('click', () => {
    fetch(`${API}/alunos/${ra}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => tr.remove());
  });

  tbody.appendChild(tr);
}

// Enviar aluno para o servidor
function cadastrarAlunoServidor(ra, nome, turma) {
  fetch(`${API}/alunos/cadastrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ RA: ra, Nome_Aluno: nome, ID_Turma: turma })
  })
    .then(res => res.json())
    .then(data => {
      console.log('Aluno cadastrado:', data);
      adicionarAlunoNaTabela(turma, nome, ra);
    })
    .catch(err => console.error('Erro ao cadastrar aluno:', err));
}

// Evento submit do formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const turma = document.getElementById('id_turma').value;
  const nome = document.getElementById('nome').value;
  const ra = document.getElementById('ra').value;

  cadastrarAlunoServidor(ra, nome, turma);
});

// Carregar alunos já cadastrados
function carregarAlunos() {
  fetch(`${API}/alunos`)
    .then(res => res.json())
    .then(alunos => {
      alunos.forEach(a => adicionarAlunoNaTabela(a.ID_Turma, a.Nome_Aluno, a.RA));
    });
}

carregarAlunos();
