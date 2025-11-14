// Seleciona todos os cards
const cards = document.querySelectorAll('.card');

// Adiciona um evento de clique em cada card
cards.forEach(card => {
  card.addEventListener('click', () => {
    const url = card.getAttribute('data-url'); // Pega a URL do atributo data-url
    if (url) {
      window.location.href = url; // Redireciona para a página
    }
  });
});

async function carregarInstituicoes() {
  try {
    const resposta = await fetch("/instituicoes");
    const instituicoes = await resposta.json();

    const container = document.getElementById("lista-instituicoes");
    container.innerHTML = ""; // limpa a lista

    instituicoes.forEach(inst => {
      const card = document.createElement("div");
      card.classList.add("instituicao-card");

      card.innerHTML = `
        <h4>${inst.nome}</h4>
        <p>${inst.endereco}</p>
        <a href="dashboard" class="btn-acessar">Acessar</a>
      `;

      container.appendChild(card);
    });

  } catch (erro) {
    console.error("Erro ao carregar instituições:", erro);
  }
}

document.addEventListener("DOMContentLoaded", carregarInstituicoes);