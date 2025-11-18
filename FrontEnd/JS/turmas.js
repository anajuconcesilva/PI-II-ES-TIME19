document.addEventListener("DOMContentLoaded", () => {
  const docenteId = localStorage.getItem("docente_id");
  console.log("📌 Docente logado:", docenteId);

  if (!docenteId) {
    alert("Nenhum docente logado! Faça login novamente.");
    window.location.href = "../HTML/login.html";
    return;
  }

  const form = document.getElementById("formTurma");
  const tabelaBody = document.querySelector("tbody");
  const selectDisciplina = document.getElementById("disciplina");

  const disciplinasMap = {}; // idDisciplina -> nomeDisciplina

  // =====================================
  // 1) CARREGAR DISCIPLINAS
  // =====================================
  async function carregarDisciplinas() {
    try {
      const res = await fetch(`http://localhost:3000/disciplinas?docente_id=${docenteId}`);
      const lista = await res.json();

      selectDisciplina.innerHTML = `<option value="">Selecione...</option>`;

      if (!res.ok || lista.length === 0) {
        selectDisciplina.innerHTML = `<option value="">Nenhuma disciplina cadastrada</option>`;
        return;
      }

      lista.forEach(d => {
        const option = document.createElement("option");
        option.value = d.id;
        option.textContent = `${d.nome} (${d.codigo})`;
        selectDisciplina.appendChild(option);

        disciplinasMap[d.id] = d.nome;
      });
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
    }
  }


  carregarDisciplinas();

  // =====================================
  // 2) CADASTRAR TURMA
  // =====================================
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const idDisciplina = selectDisciplina.value;
    const numeroTurma = Number(document.getElementById("numero").value.trim());
    const horarioAula = document.getElementById("horario").value.trim();
    const dataInicio = document.getElementById("dataInicio").value.trim();
    const dataFim = document.getElementById("dataFim").value.trim();
    const localAula = document.getElementById("local").value.trim();

    if (!idDisciplina || !numeroTurma || !horarioAula || !dataInicio || !dataFim || !localAula) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/turmas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idDisciplina,
          numeroTurma,
          horarioAula,
          dataInicio,
          dataFim,
          localAula,
          docenteId: Number(docenteId) // ⚠️ garante que seja número
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert("Erro: " + data.erro);
        return;
      }

      alert("Turma cadastrada!");
      form.reset();
      carregarTurmas();

    } catch (error) {
      console.error("Erro ao cadastrar turma:", error);
    }
  });

  // =====================================
  // 3) LISTAR TURMAS NA TABELA
  // =====================================
  async function carregarTurmas() {
    tabelaBody.innerHTML = "<tr><td colspan='8'>Carregando...</td></tr>";

    try {
      const res = await fetch(`http://localhost:3000/turmas?docente_id=${docenteId}`);
      const lista = await res.json();

      tabelaBody.innerHTML = "";

      if (!res.ok || lista.length === 0) {
        tabelaBody.innerHTML = "<tr><td colspan='8'>Nenhuma turma cadastrada.</td></tr>";
        return;
      }

      lista.forEach(t => {
        const formatarData = (dataStr) => {
          if (!dataStr) return "—";
          const data = new Date(dataStr);
          return `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}/${data.getFullYear()}`;
        }

        const dataInicioBR = formatarData(t.dataInicio);
        const dataFimBR = formatarData(t.dataFim);

        const nomeDisciplina = t.nomeDisciplina || disciplinasMap[t.idDisciplina] || "—";

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${t.id}</td>
          <td>${nomeDisciplina}</td>
          <td>${t.numeroTurma}</td>
          <td>${t.horarioAula}</td>
          <td>${dataInicioBR}</td>
          <td>${dataFimBR}</td>
          <td>${t.localAula}</td>
          <td><button class="delete" data-id="${t.id}">Excluir</button></td>
        `;
        tabelaBody.appendChild(row);
      });

      document.querySelectorAll(".delete").forEach(btn => {
        btn.addEventListener("click", () => deletarTurma(btn.dataset.id));
      });

    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
    }
  }

  carregarTurmas();

  // =====================================
  // 4) DELETAR TURMA
  // =====================================
  async function deletarTurma(id) {
    if (!id || !confirm("Deseja realmente excluir?")) return;

    try {
      const res = await fetch(`http://localhost:3000/turmas/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.erro || "Erro ao excluir turma");
        return;
      }

      alert("Turma excluída com sucesso!");
      carregarTurmas();
    } catch (error) {
      console.error("Erro ao excluir turma:", error);
    }
  }
});
