// Seleciona elementos do formulário e tabela
const form = document.querySelector('form');
const tbody = document.querySelector('table tbody');

// Função para criar uma nova linha na tabela
function adicionarFormulaNota(comp, peso, tipo, instit) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${comp}</td>
    <td>${peso}</td>
    <td>${tipo}</td>
    <td>${instit}</td>
    <td>
      <button class="edit">Editar</button>
     
    </td>
  `;

  tr.querySelector('.edit').addEventListener('click', () => {
    // Preenche o formulário com os dados da linha para edição
    document.getElementById('comp').value = comp;
    document.getElementById('peso').value = peso;
    document.getElementById('tipo').value = tipo;
    document.getElementById('instit').value = instit;
    

    // Remove a linha antiga (vai substituir ao salvar)
    tr.remove();
  });

  tbody.appendChild(tr); // Adiciona a linha na tabela
}

// Evento de envio do formulário
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Evita o envio padrão do formulário

  // Pega os valores do formulário
  const comp = document.getElementById('comp').value;
  const peso = document.getElementById('peso').value;
  const tipo = document.getElementById('tipo').value;
  const instit = document.getElementById('instit').value;


  // Adiciona aluno na tabela
  adicionarFormulaNota(comp, peso, tipo, instit);

  // Limpa o formulário
  form.reset();
});
