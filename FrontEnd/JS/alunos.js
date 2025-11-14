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

function cadastrarAlunoServidor(ra, nome) {
  // Validação simples
  if (!ra || !nome) {
    window.alert("Preencha RA e Nome antes de cadastrar.");
    return;
  }

  const dados = {
    ra: ra,
    nome: nome
  };

  fetch('/adicionarAlunos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Resposta não OK do servidor');
      }
      return response.json();
    })
    .then(data => {
      window.alert('Aluno cadastrado com sucesso!');
      console.log('Resposta do servidor:', data);
    })
    .catch(error => {
      window.alert('Erro ao cadastrar aluno.');
      console.error('Erro no servidor:', error);
    });
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
  const raConvertido = parseInt(matricula, 10);// Converte matrícula para número

  // Adiciona aluno na tabela
  adicionarAluno(instituicao, turma, nome, matricula, email);

  // Envia para o servidor
  cadastrarAlunoServidor(raConvertido, nome);

  // Limpa o formulário
  form.reset();
});
