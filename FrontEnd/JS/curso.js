document.addEventListener("DOMContentLoaded", () => {

  const docenteId = localStorage.getItem("docente_id");

  console.log("📌 Docente logado:", docenteId);

  if (!docenteId) {
    alert("Nenhum docente logado! Faça login novamente.");
    window.location.href = "../HTML/login.html";
    return;
  }

  const selectInstituicao = document.getElementById("instituicao");
  const form = document.querySelector("form");
  const tabelaBody = document.querySelector("tbody");

  // ================================
  // 1) CARREGAR LISTA DE INSTITUIÇÕES
  // ================================
  async function carregarInstituicoes() {
    try {
      const response = await fetch(`http://localhost:3000/instituicoes?docente_id=${docenteId}`);
      const data = await response.json();

      selectInstituicao.innerHTML = `<option value="">Selecione...</option>`;

      data.forEach((inst) => {
        const option = document.createElement("option");
        option.value = inst.id;
        option.textContent = inst.nome;
        selectInstituicao.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar instituições:", error);
    }
  }
  carregarInstituicoes();

  // ================================
  // 2) CADASTRAR CURSO
  // ================================
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const idInstituicao = selectInstituicao.value;
    const nomeCurso = document.getElementById("nome").value.trim();

    if (!idInstituicao || !nomeCurso) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeCurso,
          idInstituicao
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Erro ao cadastrar curso: " + data.erro);
        return;
      }

      alert("Curso cadastrado com sucesso!");
      form.reset();
      carregarCursos();

    } catch (error) {
      console.error("Erro no fetch:", error);
      alert("Erro ao conectar ao servidor.");
    }
  });

  // ================================
  // 3) LISTAR CURSOS
  // ================================
  async function carregarCursos() {
    tabelaBody.innerHTML = "<tr><td colspan='3'>Carregando...</td></tr>";

    try {
      const response = await fetch(`http://localhost:3000/cursos?docente_id=${docenteId}`);

      const data = await response.json();

      if (!response.ok) {
        tabelaBody.innerHTML = "<tr><td colspan='3'>Erro ao carregar.</td></tr>";
        return;
      }

      tabelaBody.innerHTML = "";

      if (data.length === 0) {
        tabelaBody.innerHTML = "<tr><td colspan='3'>Nenhum curso cadastrado.</td></tr>";
        return;
      }

      data.forEach((curso) => {
        const row = document.createElement("tr");

        row.innerHTML = `
    <td>${curso.NomeInstituicao ?? "-"}</td>
    <td>${curso.Nome_Curso}</td>
    <td>
        <button class="delete" data-id="${curso.ID_Curso}">Excluir</button>
    </td>
  `;

        tabelaBody.appendChild(row);
      });

      adicionarEventosBotoes();

    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    }
  }

  carregarCursos();

  // ================================
  // 4) Excluir curso
  // ================================
  function adicionarEventosBotoes() {
    document.querySelectorAll(".delete").forEach((btn) => {
      btn.addEventListener("click", () => deletarCurso(btn.dataset.id));
    });
  }

  async function deletarCurso(id) {
    if (!confirm("Tem certeza que deseja excluir este curso?")) return;

    try {
      const response = await fetch(`http://localhost:3000/cursos/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.erro);
        return;
      }

      alert("Curso excluído!");
      carregarCursos();

    } catch (error) {
      console.error(error);
    }
  }
});


// ================================
// 5) Excluir curso
// ================================
async function carregarCursos() {
  try {
    console.log("📌 Buscando cursos do docente:", docenteId);

    const response = await fetch(`http://localhost:3000/cursos?docente_id=${docenteId}`);
    const data = await response.json();

    if (!response.ok) {
      console.error("Erro:", data);
      return;
    }

    // Zera o select
    selectCurso.innerHTML = `<option value="">Selecione...</option>`;

    // Preenche
    data.forEach(curso => {
      const option = document.createElement("option");
      option.value = curso.ID_Curso;    // ID REAL DO CURSO
      option.textContent = `${curso.Nome_Curso} (${curso.NomeInstituicao})`;
      selectCurso.appendChild(option);
    });

    console.log("📌 Cursos carregados:", data);

  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
  }
}

// Chama ao iniciar
carregarCursos();


