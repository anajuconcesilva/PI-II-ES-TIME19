// Função de adicionar disciplina feita pelas alunas - Ana Júlia e Sofia de Sousa 

// Seleciona elementos do formulário e tabela

const form = document.querySelector('form');
const tbody = document.querySelector('table tbody');

function adicionarTurma(instituicao, turma, codigo, apelido){
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${instituicao}</td>
      <td>${turma}</td>
      <td>${codigo}</td>
      <td>${apelido}</td>
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
      document.getElementById('codigo').value = codigo;
      document.getElementById('apelido').value = apelido;
     
  
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
    const codigo = document.getElementById('codigo').value;
    const apelido = document.getElementById('apelido').value;
  
  
    // Adiciona a disciplina na tabela
   adicionarTurma(instituicao, turma, codigo, apelido);
  
    // Limpa o formulário
    form.reset();
  });
  
