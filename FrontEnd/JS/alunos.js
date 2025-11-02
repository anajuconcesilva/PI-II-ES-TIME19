// Seleciona elementos do formulário e tabela
const form = document.querySelector('form');
const tbody = document.querySelector('table tbody');

// Função para criar uma nova linha na tabela
function adicionarAluno(instituicao, turma, nome, matricula, email) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${instituicao}</td>
    <td>${turma}</td>
    <td>${nome}</td>
    <td>${matricula}</td>
    <td>${email}</td>
    <td>
      <button class="edit">Editar</button>
      <button class="delete">Excluir</button>
    </td>
  `;

  // Adiciona eventos aos botões da linha
  tr.querySelector('.delete').addEventListener('click', () => {
    tr.remove(); // Remove a linha da tabela
  });

  tr.querySelector('.edit').addEventListener('click', () => {
    // Preenche o formulário com os dados da linha para edição
    document.getElementById('instituição').value = instituicao;
    document.getElementById('turma').value = turma;
    document.getElementById('nome').value = nome;
    document.getElementById('matricula').value = matricula;
    document.getElementById('email').value = email;

    // Remove a linha antiga (vai substituir ao salvar)
    tr.remove();
  });

  tbody.appendChild(tr); // Adiciona a linha na tabela
}

// Evento de envio do formulário
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Evita o envio padrão do formulário

  // Pega os valores do formulário
  const instituicao = document.getElementById('instituição').value;
  const turma = document.getElementById('turma').value;
  const nome = document.getElementById('nome').value;
  const matricula = document.getElementById('matricula').value;
  const email = document.getElementById('email').value;

  // Adiciona aluno na tabela
  adicionarAluno(instituicao, turma, nome, matricula, email);

  // Limpa o formulário
  form.reset();
});
