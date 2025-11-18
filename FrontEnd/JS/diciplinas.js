document.addEventListener("DOMContentLoaded", () => {
    const docenteId = localStorage.getItem("docente_id");
    if (!docenteId) {
        alert("Nenhum docente logado! Faça login novamente.");
        window.location.href = "../HTML/login.html";
        return;
    }

    const form = document.querySelector("form");
    const tabelaBody = document.querySelector("tbody");

    const selectInstituicao = document.getElementById("instituicao");
    const selectCurso = document.getElementById("curso");

    // ================================
    // 1) Carregar instituições
    // ================================
    async function carregarInstituicoes() {
        try {
            const res = await fetch(`http://localhost:3000/instituicoes?docente_id=${docenteId}`);
            const lista = await res.json();

            selectInstituicao.innerHTML = `<option value="">Selecione...</option>`;

            lista.forEach(inst => {
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
    // 2) Quando selecionar instituição → carregar cursos
    // ================================
    selectInstituicao.addEventListener("change", () => {
        const instId = selectInstituicao.value;

        if (!instId) {
            selectCurso.innerHTML = `<option value="">Selecione...</option>`;
            return;
        }

        carregarCursos(instId);
    });

    async function carregarCursos(idInstituicao) {
        try {
            const res = await fetch(`http://localhost:3000/cursos?docente_id=${docenteId}&instituicao_id=${idInstituicao}`);
            const lista = await res.json();

            selectCurso.innerHTML = `<option value="">Selecione...</option>`;

            lista.forEach(curso => {
                const option = document.createElement("option");
                option.value = curso.ID_Curso;
                option.textContent = curso.Nome_Curso;
                selectCurso.appendChild(option);
            });

        } catch (error) {
            console.error("Erro ao carregar cursos:", error);
        }
    }

    // ================================
    // 3) Cadastrar disciplina
    // ================================
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const idCurso = selectCurso.value;
        const nomeDisciplina = document.getElementById("nome").value.trim();
        const periodo = Number(document.getElementById("periodo").value.trim());
        const codigo = document.getElementById("codigo").value.trim();

        if (!idCurso || !nomeDisciplina || !periodo || !codigo) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/disciplinas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nomeDisciplina, periodo, codigo, idCurso })
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Erro: " + data.erro);
                return;
            }

            alert("Disciplina cadastrada!");
            form.reset();
            carregarDisciplinas();

        } catch (error) {
            console.error("Erro ao cadastrar disciplina:", error);
        }
    });

    // ================================
    // 4) Listar disciplinas
    // ================================
    async function carregarDisciplinas() {
        tabelaBody.innerHTML = "<tr><td colspan='5'>Carregando...</td></tr>";

        try {
            const res = await fetch(`http://localhost:3000/disciplinas?docente_id=${docenteId}`);
            const lista = await res.json();

            tabelaBody.innerHTML = "";

            if (!res.ok || lista.length === 0) {
                tabelaBody.innerHTML = "<tr><td colspan='5'>Nenhuma disciplina cadastrada.</td></tr>";
                return;
            }

            lista.forEach(d => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${d.nomeInstituicao}</td>
                    <td>${d.nome}</td>
                    <td>${d.periodo}</td>
                    <td>${d.codigo}</td>
                    <td><button class="delete" data-id="${d.id}">Excluir</button></td>
                `;
                tabelaBody.appendChild(row);
            });

            document.querySelectorAll(".delete").forEach(btn => {
                btn.addEventListener("click", () => deletarDisciplina(btn.dataset.id));
            });

        } catch (error) {
            console.error("Erro ao carregar disciplinas:", error);
        }
    }

    carregarDisciplinas();


    // ================================
    // 5) Deletar disciplina
    // ================================
    async function deletarDisciplina(id) {
        if (!confirm("Deseja realmente excluir?")) return;

        try {
            const res = await fetch(`http://localhost:3000/disciplinas/${id}`, { method: "DELETE" });
            const data = await res.json();

            if (!res.ok) {
                alert(data.erro);
                return;
            }

            alert("Disciplina excluída!");
            carregarDisciplinas();

        } catch (error) {
            console.error(error);
        }
    }
});
