// Feito pela aluna Eduarda Prado Deiró

document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // PEGAR ID DO DOCENTE LOGADO
  // ===============================
  const docenteId = localStorage.getItem("docente_id");

  console.log("ID do docente logado:", docenteId);

  if (!docenteId) {
    alert("Você precisa estar logado para cadastrar uma instituição!");
    window.location.href = "login.html";
    return;
  }

  // ===============================
  // FORMULÁRIO
  // ===============================
  const form = document.querySelector(".form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nomeInstituicao").value.trim();
    const sigla = document.getElementById("sigla").value.trim();

    if (!nome) {
      alert("O nome da instituição é obrigatório!");
      return;
    }

    // ===============================
    // MONTAR OBJETO PARA API
    // ===============================
    const data = {
      nome: nome,
      sigla: sigla || null,
      idDocente: Number(docenteId)
    };


    console.log("Dados enviados para API:", data);

    try {
      const response = await fetch("http://localhost:3000/instituicoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.erro || "Erro ao cadastrar instituição!");
        return;
      }

      alert("Instituição cadastrada com sucesso!");

      // Limpar campos
      form.reset();

      // Redirecionar depois de cadastrar
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);

    } catch (error) {
      console.error("Erro ao cadastrar instituição:", error);
      alert("Erro ao conectar com o servidor!");
    }
  });
});
