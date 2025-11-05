// Seleciona o formulário da página
const form = document.querySelector("form");

// Seleciona o corpo da tabela (onde as linhas serão adicionadas)
const tabelaBody = document.querySelector("tbody");

// Variável para guardar o índice da linha quando estiver editando
let editIndex = null;

// Adiciona evento ao enviar o formulário
form.addEventListener("submit", function(event) {
  event.preventDefault(); // Impede o refresh da página ao enviar o formulário

  // Pega os valores digitados nos inputs
  const instituicao = document.getElementById("instituição").value;
  const nome = document.getElementById("nome").value;
  const periodo = document.getElementById("periodo").value;
  const codigo = document.getElementById("codigo").value;

  // Verifica se todos os campos foram preenchidos
  if (!instituicao || !nome || !periodo || !codigo) {
    alert("Preencha todos os campos!");
    return; // Para a execução se tiver campo vazio
  }

  // Se estamos editando uma disciplina existente
  if (editIndex !== null) {

    // Pega todas as linhas da tabela
    const linhas = tabelaBody.querySelectorAll("tr");

    // Seleciona os dados da linha correspondente ao índice being edit
    const linha = linhas[editIndex].querySelectorAll("td");

    // Substitui os valores nos campos da tabela
    linha[0].textContent = instituicao;
    linha[1].textContent = nome;
    linha[2].textContent = periodo;
    linha[3].textContent = codigo;

    // Limpa o modo de edição
    editIndex = null;

    // Limpa o formulário
    form.reset();

    return; // Sai da função para não criar nova linha
  }

  // Se NÃO estiver editando, cria uma nova linha na tabela
  const novaLinha = document.createElement("tr");

  // Preenche a nova linha com os valores e os botões
  novaLinha.innerHTML = `
    <td>${instituicao}</td>
    <td>${nome}</td>
    <td>${periodo}</td>
    <td>${codigo}</td>
    <td>
      <button class="edit">Editar</button>
      <button class="delete">Excluir</button>
    </td>
  `;

  // Adiciona a linha dentro da tabela
  tabelaBody.appendChild(novaLinha);

  // Limpa os campos do formulário após adicionar
  form.reset();
});

// Evento para capturar cliques nos botões de edição e exclusão (delegação)
tabelaBody.addEventListener("click", function(event) {

  // Se clicou no botão de excluir
  if (event.target.classList.contains("delete")) {
    event.target.closest("tr").remove(); // Remove a linha inteira da tabela
  }

  // Se clicou no botão de editar
  if (event.target.classList.contains("edit")) {

    // Guarda a linha onde o botão foi clicado
    const linha = event.target.closest("tr");

    // Pega todas as células da linha
    const colunas = linha.querySelectorAll("td");

    // Preenche o formulário com os dados da tabela para editar
    document.getElementById("instituição").value = colunas[0].textContent;
    document.getElementById("nome").value = colunas[1].textContent;
    document.getElementById("periodo").value = colunas[2].textContent;
    document.getElementById("codigo").value = colunas[3].textContent;

    // Guarda o índice dessa linha para atualizar depois
    editIndex = [...tabelaBody.children].indexOf(linha);
  }
});
