// Seleciona o formulário da página
const form = document.querySelector("form");

// Seleciona o corpo da tabela onde as turmas serão listadas
const tabelaBody = document.querySelector("tbody");

// Variável que identifica se estamos editando alguma linha
let editIndex = null;

// Evento para quando o formulário for enviado
form.addEventListener("submit", function(event) {
  event.preventDefault(); // Evita atualizar a página ao enviar o formulário

  // Pega os valores dos campos do formulário
  const instituicao = document.getElementById("instituição").value;
  const turma = document.getElementById("turma").value;
  const codigo = document.getElementById("codigo").value;
  const apelido = document.getElementById("apelido").value;

  // Verifica se todos os campos estão preenchidos
  if (!instituicao || !turma || !codigo || !apelido) {
    alert("Preencha todos os campos!");
    return; // Sai da função caso falte um campo
  }

  // Se estamos editando uma linha já existente
  if (editIndex !== null) {
    const linhas = tabelaBody.querySelectorAll("tr"); // Pega todas as linhas da tabela
    const linha = linhas[editIndex].querySelectorAll("td"); // Seleciona a linha que está sendo editada

    // Atualiza os valores da linha
    linha[0].textContent = instituicao;
    linha[1].textContent = turma;
    linha[2].textContent = codigo;
    linha[3].textContent = apelido;

    // Reseta a variável para sair do modo de edição
    editIndex = null;

    // Limpa o formulário
    form.reset();
    return; // Sai para não criar uma nova linha
  }

  // Criar nova linha da tabela
  const novaLinha = document.createElement("tr");

  // Inserir conteúdo HTML da nova linha com botões
  novaLinha.innerHTML = `
    <td>${instituicao}</td>
    <td>${turma}</td>
    <td>${codigo}</td>
    <td>${apelido}</td>
    <td>
      <button class="edit">Editar</button>
      <button class="delete">Excluir</button>
    </td>
  `;

  // Adiciona a nova linha à tabela
  tabelaBody.appendChild(novaLinha);

  // Limpa o formulário
  form.reset();
});

// Evento para detectar cliques nos botões de editar e excluir (delegação)
tabelaBody.addEventListener("click", function(event) {

  // Se o botão clicado for o de excluir
  if (event.target.classList.contains("delete")) {
    event.target.closest("tr").remove(); // Remove a linha inteira
  }

  // Se o botão clicado for o de editar
  if (event.target.classList.contains("edit")) {

    const linha = event.target.closest("tr"); // Pega a linha clicada
    const colunas = linha.querySelectorAll("td"); // Pega as células dessa linha

    // Preenche os campos do formulário com os valores da linha
    document.getElementById("instituição").value = colunas[0].textContent;
    document.getElementById("turma").value = colunas[1].textContent;
    document.getElementById("codigo").value = colunas[2].textContent;
    document.getElementById("apelido").value = colunas[3].textContent;

    // Guarda o índice da linha para atualizar depois
    editIndex = [...tabelaBody.children].indexOf(linha);
  }
});
