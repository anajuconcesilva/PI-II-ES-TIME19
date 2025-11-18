document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("txtEmail").value;

        // Envia requisição para o backend
        const response = await fetch("http://localhost:3000/docentes/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Um e-mail foi enviado com o link de redefinição de senha!");
        } else {
            alert(data.message);
        }
    });
});
