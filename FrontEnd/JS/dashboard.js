// dashboard.js

document.addEventListener("DOMContentLoaded", () => {

    // ============================
    // PEGAR ID DO DOCENTE LOGADO
    // ============================
    const docenteId = localStorage.getItem("docente_id");

    console.log("ID do docente logado:", docenteId);

    if (!docenteId) {
        alert("Você precisa estar logado!");
        window.location.href = "login.html";
        return;
    }

    // ============================
    // CLICAR NOS CARDS E IR PARA AS PÁGINAS
    // ============================

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("click", () => {

            const url = card.getAttribute("data-url");

            if (!url) return;

            // redireciona preservando o docente_id
            window.location.href = `${url}.html?docente_id=${docenteId}`;
        });
    });

    // ============================
    // BOTÃO DE LOGOUT
    // ============================
    const logoutBtn = document.getElementById("btnLogout");

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("docente_id");
        window.location.href = "login.html";
    });
});
