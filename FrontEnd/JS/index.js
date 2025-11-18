document.addEventListener("DOMContentLoaded", async () => {
    const listaContainer = document.getElementById("lista-instituicoes");
    const docenteId = localStorage.getItem("docente_id");

    if (!docenteId) {
        alert("Nenhum docente logado! Faça login novamente.");
        window.location.href = "login.html";
        return;
    }

    async function carregarInstituicoes() {
        listaContainer.innerHTML = "<p>Carregando...</p>";

        try {
            const res = await fetch(`http://localhost:3000/instituicoes?docente_id=${docenteId}`);
            if (!res.ok) throw new Error("Erro ao buscar instituições");

            const instituicoes = await res.json();

            if (instituicoes.length === 0) {
                listaContainer.innerHTML = "<p>Nenhuma instituição cadastrada.</p>";
                return;
            }

            listaContainer.innerHTML = "";
            instituicoes.forEach(inst => {
                const card = document.createElement("div");
                card.className = "instituicao-card";
                card.innerHTML = `
          <div class="card-info">
            <h4><strong>Nome da Instituição: </strong>${inst.nome}</h4>
            <p><strong>Sigla:</strong> ${inst.sigla ?? "—"}</p>
            <p><strong>ID:</strong> ${inst.id}</p>
          </div>
          <button data-id="${inst.id}" class="btn-excluir">Excluir</button>
        `;
                listaContainer.appendChild(card);
            });

            document.querySelectorAll(".btn-excluir").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const id = btn.dataset.id;
                    if (!confirm("Deseja realmente excluir esta instituição?")) return;

                    try {
                        const resDel = await fetch(`http://localhost:3000/instituicoes/${id}`, { method: "DELETE" });
                        const data = await resDel.json();

                        if (!resDel.ok) {
                            alert("Erro: " + data.erro);
                            return;
                        }

                        alert("Instituição excluída!");
                        carregarInstituicoes();
                    } catch (erro) {
                        console.error("Erro ao excluir:", erro);
                    }
                });
            });

        } catch (erro) {
            console.error("Erro ao carregar instituições:", erro);
            listaContainer.innerHTML = "<p>Erro ao carregar instituições.</p>";
        }
    }

    carregarInstituicoes();
});
