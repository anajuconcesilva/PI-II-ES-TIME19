// Função de adicionar disciplina feita pelas alunas - Ana Júlia e Sofia de Sousa 

// Seleciona elementos do formulário e tabela

const form = document.querySelector('form');
const tbody = document.querySelector('table tbody');

function adicionarDiciplina(instituicao, nome, periodo, codigo){
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${instituicao}</td>
      <td>${nome}</td>
      <td>${periodo}</td>
      <td>${codigo}</td>
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
      document.getElementById('nomeDiciplina').value = nome;
      document.getElementById('periodo').value = periodo;
      document.getElementById('codigo').value = codigo;
     
  
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
    const nome = document.getElementById('nome').value;
    const periodo = document.getElementById('periodo').value;
    const codigo = document.getElementById('codigo').value;
  
  
    // Adiciona a disciplina na tabela
   adicionarDiciplina(instituicao, nome, periodo, codigo);
  
    // Limpa o formulário
    form.reset();
  });
  
