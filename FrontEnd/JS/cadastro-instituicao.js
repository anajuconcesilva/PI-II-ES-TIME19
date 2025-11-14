// Função de adicionar disciplina feita pelas alunas - Ana Júlia e Sofia de Sousa 

// Seleciona elementos do formulário e tabela
const form = document.querySelector('form');
const tbody = document.querySelector('table tbody'); // se não existir tabela, será null

// Adiciona visualmente a instituição na tabela (se existir)
function cadastrarInstituicao(nomeInstituicao, endereco) {
  // Se não houver tabela na página, apenas não faz nada visualmente
  if (!tbody) {
    console.warn("Nenhuma tabela encontrada para listar instituições (tbody é null).");
    return;
  }

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${nomeInstituicao}</td>
    <td>${endereco}</td>
    <td>
      <button class="edit">Editar</button>
      <button class="delete">Excluir</button>
    </td>
  `;

  // Botão excluir
  tr.querySelector('.delete').addEventListener('click', () => {
    tr.remove(); // Remove a linha da tabela
  });

  // Botão editar
  tr.querySelector('.edit').addEventListener('click', () => {
    // Preenche o formulário com os dados da linha para edição
    document.getElementById('nomeInstituicao').value = nomeInstituicao;
    document.getElementById('endereco').value = endereco;

    // Remove a linha antiga (vai substituir ao salvar)
    tr.remove();
  });

  tbody.appendChild(tr); // Adiciona a linha na tabela
}

// Envia a instituição para o servidor (backend)
function cadastrarInstituicaoServidor(nomeInstituicao, endereco) {
  // Validação simples
  if (!nomeInstituicao || !endereco) {
    window.alert("Preencha todos os campos antes de cadastrar.");
    return;
  }

  const dados = {
    nomeInstituicao: nomeInstituicao,
    endereco: endereco
  };

  fetch('/cadastrar-instituicao', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  })
  
  .then(response => response.json())

  .then(data => {
    window.alert('Instituição cadastrada com sucesso!');
    console.log('Resposta do servidor:', data);
  })

  .catch(error => {
    window.alert('Erro ao cadastrar instituição.');
    console.error('Erro no servidor:', error);
  });
}

// Evento de envio do formulário
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Evita o envio padrão do formulário


  // Pega os valores do formulário (ID sem acento!)
  const nomeInstituicao = document.getElementById('nomeInstituicao').value;
  const endereco = document.getElementById('endereco').value;

  // Adiciona na tabela (se houver)
  cadastrarInstituicao(nomeInstituicao, endereco);

  // Envia para o servidor
  cadastrarInstituicaoServidor(nomeInstituicao, endereco);

  // Limpa o formulário
  form.reset();
});