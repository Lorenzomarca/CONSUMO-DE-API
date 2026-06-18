let moedaAtual = "USD-BRL";


const infoMoedas = {
    "USD-BRL": { nome: "Dólar Americano", icone: "ph-currency-dollar" },
    "EUR-BRL": { nome: "Euro", icone: "ph-currency-eur" },
    "BTC-BRL": { nome: "Bitcoin", icone: "ph-currency-btc" }
};

async function consumir_api() {
    const api_url = `https://economia.awesomeapi.com.br/last/${moedaAtual}`;
    
    const elementoValor = document.getElementById("valor");
    const elementoData = document.getElementById("data");
    const botao = document.getElementById("btn-atualizar");

    const chaveJson = moedaAtual.replace("-", "");

    try {
        botao.disabled = true;
        botao.innerHTML = `<i class="ph ph-circle-notch spinner"></i> Buscando...`;

        let resposta = await fetch(api_url);
        
        if (!resposta.ok) {
            throw new Error(`Erro: ${resposta.status}`);
        }

        let json_resposta = await resposta.json();
        const dados = json_resposta[chaveJson];
        
        let valorBruto = parseFloat(dados.bid);
        let valorFormatado;

        if (moedaAtual === "BTC-BRL") {
            valorFormatado = valorBruto.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        } else {
            valorFormatado = valorBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        
        const dataHora = dados.create_date.split(" ");
        const dataComponentes = dataHora[0].split("-");
        const dataFormatada = `${dataComponentes[2]}/${dataComponentes[1]}/${dataComponentes[0]} às ${dataHora[1]}`;

        elementoValor.innerText = valorFormatado;
        elementoData.innerText = dataFormatada;

    } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
        elementoValor.innerText = "Erro";
        elementoData.innerText = "Tente novamente";
    } finally {
        botao.disabled = false;
        botao.innerHTML = `<i class="ph ph-arrows-counter-clockwise"></i> Atualizar cotação`;
    }
}

function mudarMoeda(novaMoeda, elementoClicado) {
    moedaAtual = novaMoeda;

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    elementoClicado.classList.add('active');

    document.getElementById("moeda-nome").innerText = infoMoedas[novaMoeda].nome;
    
    const containerIcone = document.getElementById("moeda-icone");
    containerIcone.innerHTML = `<i class="ph-fill ${infoMoedas[novaMoeda].icone}"></i>`;

    consumir_api();
}

window.onload = () => {
    consumir_api();
};

setInterval(consumir_api, 30000);