// -------------------------------
// Feito pela aluna Eduarda Prado Deiró
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // PEGAR DADOS DO FORM
        const nome = document.getElementById("txtName").value.trim();
        const email = document.getElementById("txtEmail").value.trim();
        const telefone = document.getElementById("txtPhone").value.trim();
        const senha = document.getElementById("txtPassword").value.trim();

        // VALIDAÇÃO BÁSICA
        if (!nome || !email || !telefone || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            // REQUISIÇÃO PARA O BACKEND
            const resposta = await fetch("http://localhost:3000/docentes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    email,
                    telefone,
                    senha
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert("Erro: " + dados.erro);
                return;
            }

            // SUCESSO
            alert("Cadastro realizado com sucesso!");
            window.location.href = "login.html";

        } catch (erro) {
            console.error("Erro no cadastro:", erro);
            alert("Não foi possível realizar o cadastro. Tente novamente.");
        }
    });
});
