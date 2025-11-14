// Seleciona elementos do formulário e tabela
const form = document.querySelector('form');
const tbody = document.querySelector('table tbody');

// Função para criar uma nova linha na tabela
function adicionarAluno( nome, ra) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${nome}</td>
    <td>${ra}</td>
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
    document.getElementById('nome').value = nome;
    document.getElementById('ra').value = ra;

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
  const nome = document.getElementById('nome').value;
  const ra = document.getElementById('ra').value;
  const raConvertido = parseInt(ra, 10);// Converte matrícula para número

  // Adiciona aluno na tabela
  adicionarAluno( nome, ra);

  // Envia para o servidor
  cadastrarAlunoServidor(raConvertido, nome);

  // Limpa o formulário
  form.reset();
});
