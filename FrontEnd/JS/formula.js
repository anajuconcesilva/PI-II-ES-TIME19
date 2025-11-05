// Seleciona o formulário da página
const formulario = document.querySelector("form");

// Seleciona o corpo da tabela onde os dados serão adicionados
const tabela = document.querySelector("tbody");

// Adiciona um evento que será disparado quando o usuário enviar o formulário
formulario.addEventListener("submit", function(event) {
  
  // Impede o recarregamento da página ao enviar o formulário
  event.preventDefault();

  // Captura o valor digitado no input "Componente"
  const componente = document.getElementById("comp").value;

  // Captura o valor digitado no input "Peso"
  const peso = document.getElementById("peso").value;

  // Captura o valor digitado no input "Tipo"
  const tipo = document.getElementById("tipo").value;

  // Captura o valor digitado no input "Instituição"
  const instituicao = document.getElementById("instit").value;

  // Cria uma nova linha (<tr>) na tabela
  const novaLinha = document.createElement("tr");

  // Preenche a linha criada com os dados digitados e um botão "Editar"
  novaLinha.innerHTML = `
    <td>${componente}</td>
    <td>${peso}</td>
    <td>${tipo}</td>
    <td>${instituicao}</td>
    <td>
      <button class="edit">Editar</button>
    </td>
  `;

  // Adiciona a nova linha à tabela (tbody)
  tabela.appendChild(novaLinha);

  // Chama a função que habilita o botão editar
  adicionarEventoEditar(novaLinha);

  // Limpa o formulário após cadastrar
  formulario.reset();
});

// Função que adiciona funcionalidade ao botão "Editar" de cada linha
function adicionarEventoEditar(linha) {

  // Seleciona o botão "Editar" dentro da linha recebida
  const botaoEditar = linha.querySelector(".edit");

  // Adiciona um evento de clique ao botão editar
  botaoEditar.addEventListener("click", function() {

    // Seleciona todas as células (td) da linha clicada
    const colunas = linha.querySelectorAll("td");

    // Preenche os inputs do formulário com os dados da linha
    document.getElementById("comp").value = colunas[0].textContent;
    document.getElementById("peso").value = colunas[1].textContent;
    document.getElementById("tipo").value = colunas[2].textContent;
    document.getElementById("instit").value = colunas[3].textContent;

    // Remove a linha da tabela para atualizar os dados ao salvar novamente
    linha.remove();
  });
}

// Aplica o evento de editar às linhas que já estavam no HTML
document.querySelectorAll("tbody tr").forEach(linha => {
  adicionarEventoEditar(linha);
});
