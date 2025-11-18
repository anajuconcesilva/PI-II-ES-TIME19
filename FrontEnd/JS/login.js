document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("txtEmail").value.trim();
        const senha = document.getElementById("txtPassword").value.trim();

        if (!email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.erro || "Credenciais inválidas!");
                return;
            }

            // ==============================
            // SALVAR SOMENTE O ID DO DOCENTE
            // ==============================
            localStorage.setItem("docente_id", result.docente.id);

            alert("Login realizado com sucesso!");
            window.location.href = "dashboard.html";

        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Erro ao conectar com o servidor!");
        }
    });
});
