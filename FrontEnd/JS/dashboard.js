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
