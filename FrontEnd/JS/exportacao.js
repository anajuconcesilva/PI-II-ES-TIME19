// Autora: Ana Júlia Conceição da Silva

// Executa quando a página terminar de carregar
document.addEventListener("DOMContentLoaded", () => {

    // Seletores dos elementos HTML
    const selectInstituicao = document.querySelector("#instituicao");
    const selectTurma = document.querySelector("#turma");
    const formExportar = document.querySelector("#form-exportar");

    // 1. CARREGAR INSTITUIÇÕES AO ABRIR A PÁGINA
    async function carregarInstituicoes() {
        try {
            // Faz requisição para pegar todas as instituições
            const resposta = await fetch("/instituicoes");

            // Converte a resposta para JSON
            const instituicoes = await resposta.json();

            // Preenche o select de Instituição
            instituicoes.forEach(inst => {
                const opcao = document.createElement("option");
                opcao.value = inst.id_instituicao;
                opcao.textContent = inst.nome;
                selectInstituicao.appendChild(opcao);
            });

        } catch (erro) {
            console.error("Erro ao carregar instituições:", erro);
            alert("Erro ao carregar instituições.");
        }
    }

    carregarInstituicoes(); // Chama a função ao iniciar


    // 2. CARREGAR TURMAS DA INSTITUIÇÃO SELECIONADA
    selectInstituicao.addEventListener("change", async () => {

        // Limpa as opções do select de turmas
        selectTurma.innerHTML = `
            <option value="" disabled selected>Selecione a turma</option>
        `;

        const idInst = selectInstituicao.value;

        try {
            // Busca todas as turmas
            const resposta = await fetch("/turmas");
            const turmas = await resposta.json();

            // Filtra apenas as turmas que pertencem à instituição escolhida
            const turmasDaInstituicao = turmas.filter(t => t.id_instituicao == idInst);

            // Preenche o select com as turmas filtradas
            turmasDaInstituicao.forEach(turma => {
                const opcao = document.createElement("option");
                opcao.value = turma.id_turma;
                opcao.textContent = turma.nome;
                selectTurma.appendChild(opcao);
            });

        } catch (erro) {
            console.error("Erro ao carregar turmas:", erro);
            alert("Erro ao carregar turmas.");
        }
    });


    // 3. ENVIAR REQUISIÇÃO PARA EXPORTAR ARQUIVO CSV
    formExportar.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita recarregar a página

        const ID_Turma = selectTurma.value;

        if (!ID_Turma) {
            alert("Selecione uma turma.");
            return;
        }

        try {
            // Faz POST para gerar o CSV
            const resposta = await fetch("/exportar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ID_Turma })
            });

            // Se o backend retornou erro, mostra mensagem
            if (!resposta.ok) {
                const erro = await resposta.json();
                alert(erro.erro || "Erro ao exportar.");
                return;
            }

            // Recebe o arquivo como blob (conteúdo binário)
            const blob = await resposta.blob();

            // Cria uma URL temporária para download
            const url = window.URL.createObjectURL(blob);

            // Cria um link <a> invisível para baixar o arquivo
            const link = document.createElement("a");
            link.href = url;

            // Extrai o nome enviado pelo backend
            const header = resposta.headers.get("Content-Disposition");
            let nomeArquivo = "notas.csv";

            if (header && header.includes("filename=")) {
                nomeArquivo = header.split("filename=")[1].replace(/"/g, "");
            }

            // Define o nome do arquivo
            link.download = nomeArquivo;

            // Adiciona o link ao documento e dispara o clique
            document.body.appendChild(link);
            link.click();

            // Remove o link temporário
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (erro) {
            console.error("Erro ao exportar:", erro);
            alert("Erro ao baixar arquivo.");
        }
    });

});
